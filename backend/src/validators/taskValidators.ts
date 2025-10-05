import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description too long'),
});

export const taskIdSchema = z.object({
  id: z.string().uuid('Invalid task ID'),
});