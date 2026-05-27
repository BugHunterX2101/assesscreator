import { Worker } from 'bullmq';
import { redis } from '../config/redis';
import { buildSystemPrompt, generatePrompt, callLLM } from './llm.service';
import Assignment from '../models/Assignment.model';
import GeneratedPaper from '../models/GeneratedPaper.model';
import { wsService } from '../services/websocket.service';
import { GeneratedPaperSchema } from '@vedaai/shared';
import fs from 'fs';
import * as path from 'path';
const pdfParse = require('pdf-parse');

export const startWorker = () => {
  const worker = new Worker('question-generation', async job => {
    const { assignmentId, formData, referenceText: referenceFileKey, feedback } = job.data;
    
    try {
      wsService.emitToAssignment(assignmentId, 'job:processing', { assignmentId, progress: 10, step: 'building_prompt' });
      await redis.setex(`job:progress:${assignmentId}`, 3600, JSON.stringify({ step: 'building_prompt', progress: 10 }));

      let extractedText = '';
      if (referenceFileKey) {
        try {
          const filePath = path.resolve(referenceFileKey);
          if (fs.existsSync(filePath)) {
            const ext = path.extname(filePath).toLowerCase();
            if (ext === '.pdf') {
              const dataBuffer = fs.readFileSync(filePath);
              const data = await pdfParse(dataBuffer);
              extractedText = data.text;
            } else if (ext === '.txt') {
              extractedText = fs.readFileSync(filePath, 'utf-8');
            }
          }
        } catch (e) {
          console.error("Error reading reference file", e);
        }
      }

      const systemPrompt = buildSystemPrompt();
      const userPrompt = generatePrompt(formData, extractedText || undefined, feedback);
      
      wsService.emitToAssignment(assignmentId, 'job:processing', { assignmentId, progress: 30, step: 'calling_llm' });
      await redis.setex(`job:progress:${assignmentId}`, 3600, JSON.stringify({ step: 'calling_llm', progress: 30 }));
      
      const responseText = await callLLM(systemPrompt, userPrompt);
      
      wsService.emitToAssignment(assignmentId, 'job:processing', { assignmentId, progress: 80, step: 'parsing_response' });
      await redis.setex(`job:progress:${assignmentId}`, 3600, JSON.stringify({ step: 'parsing_response', progress: 80 }));

      let parsedData;
      try {
        parsedData = JSON.parse(responseText);
      } catch (err) {
        throw new Error('Failed to parse JSON from LLM response');
      }

      const validatedData = GeneratedPaperSchema.parse(parsedData);
      
      const existingPaper = await GeneratedPaper.findOne({ assignmentId });
      let version = 1;
      if (existingPaper) {
        version = existingPaper.version + 1;
        await GeneratedPaper.updateOne({ _id: existingPaper._id }, { ...validatedData, version, generatedAt: new Date() });
      } else {
        const newPaper = new GeneratedPaper({
          assignmentId,
          ...validatedData,
          version
        });
        await newPaper.save();
      }

      await Assignment.findByIdAndUpdate(assignmentId, { status: 'completed' });
      
      // Cache paper in redis
      await redis.setex(`paper:${assignmentId}`, 3600, JSON.stringify(validatedData));

      wsService.emitToAssignment(assignmentId, 'job:completed', { assignmentId });
      wsService.emitGlobal('notification', {
        type: 'success',
        message: `Assignment paper generated successfully!`
      });
      await redis.del(`job:progress:${assignmentId}`);

    } catch (error: any) {
      console.error('Job failed:', error);
      if (job.attemptsMade >= (job.opts.attempts || 3) - 1) {
        await Assignment.findByIdAndUpdate(assignmentId, { status: 'failed' });
        wsService.emitToAssignment(assignmentId, 'job:failed', { assignmentId, error: error.message });
        wsService.emitGlobal('notification', {
          type: 'error',
          message: `Assignment generation failed: ${error.message}`
        });
      }
      throw error;
    }
  }, { connection: redis as any });

  worker.on('error', err => {
    console.error('Worker error:', err);
  });
};
