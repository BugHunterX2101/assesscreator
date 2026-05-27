import { Router, Request, Response } from 'express';
import { AssignmentFormSchema } from '@vedaai/shared';
import Assignment from '../models/Assignment.model';
import { enqueueGenerationJob } from '../services/queue.service';
import { wsService } from '../services/websocket.service';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = AssignmentFormSchema.parse(req.body);
    
    const newAssignment = new Assignment({
      ...validatedData,
      status: 'pending'
    });
    
    await newAssignment.save();
    
    await enqueueGenerationJob(newAssignment._id.toString(), validatedData, validatedData.referenceFileKey || undefined);
    
    wsService.emitToAssignment(newAssignment._id.toString(), 'job:queued', { assignmentId: newAssignment._id.toString() });
    
    res.status(202).json({
      assignmentId: newAssignment._id.toString(),
      status: 'pending'
    });
  } catch (error: any) {
    if (error.errors) { // Zod error
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Validation failed', details: error.errors } });
    } else {
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: error.message } });
    }
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Assignment not found' } });
    }
    
    // In a real app we'd fetch actual progress from redis, here we just return a stub if processing
    res.status(200).json({
      assignmentId: assignment._id.toString(),
      status: assignment.status,
      createdAt: assignment.createdAt
    });
  } catch (error: any) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: error.message } });
  }
});

router.post('/:id/regenerate', async (req: Request, res: Response) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Assignment not found' } });
    }
    
    if (assignment.status === 'processing') {
      return res.status(409).json({ error: { code: 'CONFLICT', message: 'Assignment is currently processing' } });
    }

    assignment.status = 'pending';
    await assignment.save();

    const { feedback } = req.body;
    
    await enqueueGenerationJob(assignment._id.toString(), assignment.toObject(), assignment.referenceFileKey, feedback);
    
    res.status(202).json({
      assignmentId: assignment._id.toString(),
      status: 'pending'
    });
  } catch (error: any) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: error.message } });
  }
});

// Get all assignments
router.get('/', async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 });
    res.json({ assignments });
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } });
  }
});

export default router;
