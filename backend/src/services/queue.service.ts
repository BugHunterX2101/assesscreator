import { Queue } from 'bullmq';
import { redis } from '../config/redis';

export const questionGenerationQueue = new Queue('question-generation', {
  connection: redis as any
});

export const enqueueGenerationJob = async (assignmentId: string, formData: any, referenceText?: string, feedback?: string) => {
  await questionGenerationQueue.add('generate', {
    assignmentId,
    formData,
    referenceText,
    feedback
  }, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 }
  });
};
