import { Router } from 'express';
import * as toolkitService from '../services/toolkit.service';
import LibraryItem from '../models/LibraryItem';

const router = Router();

router.get('/library', async (req, res) => {
  try {
    const items = await LibraryItem.find().sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/generate-questions', async (req, res) => {
  try {
    const result = await toolkitService.generateQuestions(req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/generate-rubric', async (req, res) => {
  try {
    const result = await toolkitService.generateRubric(req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/grade-essay', async (req, res) => {
  try {
    const result = await toolkitService.gradeEssay(req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/generate-lesson-plan', async (req, res) => {
  try {
    const result = await toolkitService.generateLessonPlan(req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
