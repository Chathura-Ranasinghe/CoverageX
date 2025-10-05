import { Request, Response } from 'express';
import { TaskService } from '../services/TaskService';
import { createTaskSchema, taskIdSchema } from '../validators/taskValidators';
import { ZodError } from 'zod';

export class TaskController {
  constructor(private taskService: TaskService) {}

  createTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = createTaskSchema.parse(req.body);
      const task = await this.taskService.createTask(validatedData);
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ 
          error: 'Validation failed', 
          details: error.issues 
        });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };

  getRecentTasks = async (req: Request, res: Response): Promise<void> => {
    try {
      const tasks = await this.taskService.getRecentTasks();
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  completeTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = taskIdSchema.parse(req.params);
      const task = await this.taskService.completeTask(id);
      res.status(200).json(task);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ 
          error: 'Invalid task ID', 
          details: error.issues 
        });
      } else if (error instanceof Error) {
        if (error.message === 'Task not found') {
          res.status(404).json({ error: error.message });
        } else if (error.message === 'Task already completed') {
          res.status(400).json({ error: error.message });
        } else {
          res.status(500).json({ error: 'Internal server error' });
        }
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };
}