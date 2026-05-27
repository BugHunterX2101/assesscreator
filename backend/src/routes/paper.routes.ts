import { Router, Request, Response } from 'express';
import GeneratedPaper from '../models/GeneratedPaper.model';
import { redis } from '../config/redis';

const router = Router();

router.get('/:id/paper', async (req: Request, res: Response) => {
  try {
    const assignmentId = req.params.id;
    
    // Check Redis cache first
    const cachedPaper = await redis.get(`paper:${assignmentId}`);
    if (cachedPaper) {
      return res.status(200).json({
        assignmentId,
        paper: JSON.parse(cachedPaper)
      });
    }

    // Fallback to MongoDB
    const paper = await GeneratedPaper.findOne({ assignmentId }).sort({ version: -1 });
    if (!paper) {
      return res.status(404).json({ error: { code: 'NOT_READY', message: 'Paper not yet generated or failed' } });
    }

    // Update cache
    await redis.setex(`paper:${assignmentId}`, 3600, JSON.stringify(paper.toObject()));

    res.status(200).json({
      assignmentId,
      paper
    });
  } catch (error: any) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: error.message } });
  }
});

export default router;
