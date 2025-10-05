import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';

export const createTaskRoutes = (taskController: TaskController): Router => {
  const router = Router();

  router.post('/tasks', taskController.createTask);
  router.get('/tasks', taskController.getRecentTasks);
  router.patch('/tasks/:id/complete', taskController.completeTask);

  return router;
};