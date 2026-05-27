import { Router } from 'express';
import { getGroups, createGroup, addStudent } from '../controllers/groups.controller';

const router = Router();

router.get('/', getGroups);
router.post('/', createGroup);
router.post('/:id/students', addStudent);

export default router;
