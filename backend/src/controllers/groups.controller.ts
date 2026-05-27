import { Request, Response } from 'express';
import { Group } from '../models/Group.model';

// Colors for UI variety
const COLORS = [
  'bg-purple-100 text-purple-600',
  'bg-pink-100 text-pink-600',
  'bg-green-100 text-green-600',
  'bg-blue-100 text-blue-600',
  'bg-orange-100 text-orange-600',
];

export const getGroups = async (req: Request, res: Response) => {
  try {
    const groups = await Group.find().sort({ createdAt: -1 });
    res.status(200).json({ groups });
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ error: { message: 'Failed to fetch groups' } });
  }
};

export const createGroup = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: { message: 'Group name is required' } });
    }

    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    
    const group = new Group({
      name,
      color,
      students: [],
    });

    await group.save();
    res.status(201).json({ group });
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ error: { message: 'Failed to create group' } });
  }
};

export const addStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: { message: 'Student name is required' } });
    }

    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ error: { message: 'Group not found' } });
    }

    group.students.push({ name, addedAt: new Date() });
    await group.save();

    res.status(200).json({ group });
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ error: { message: 'Failed to add student' } });
  }
};
