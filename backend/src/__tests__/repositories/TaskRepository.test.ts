import { PrismaClient } from '@prisma/client';
import { TaskRepositoryImpl } from '../../repositories/TaskRepositoryImpl';
import { CreateTaskDTO } from '../../types/task.types';

const prisma = new PrismaClient();
const taskRepository = new TaskRepositoryImpl(prisma);

describe('TaskRepository', () => {
  beforeEach(async () => {
    await prisma.task.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const taskData: CreateTaskDTO = {
        title: 'Test Task',
        description: 'Test Description',
      };

      const task = await taskRepository.create(taskData);

      expect(task).toHaveProperty('id');
      expect(task.title).toBe(taskData.title);
      expect(task.description).toBe(taskData.description);
      expect(task.completed).toBe(false);
    });
  });

  describe('findRecent', () => {
    it('should return only non-completed tasks', async () => {
      await taskRepository.create({ title: 'Task 1', description: 'Desc 1' });
      const task2 = await taskRepository.create({ title: 'Task 2', description: 'Desc 2' });
      await taskRepository.markAsCompleted(task2.id);

      const tasks = await taskRepository.findRecent(5);

      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toBe('Task 1');
    });

    it('should return tasks in descending order', async () => {
      await taskRepository.create({ title: 'Task 1', description: 'Desc 1' });
      await new Promise(resolve => setTimeout(resolve, 10));
      await taskRepository.create({ title: 'Task 2', description: 'Desc 2' });

      const tasks = await taskRepository.findRecent(5);

      expect(tasks[0].title).toBe('Task 2');
      expect(tasks[1].title).toBe('Task 1');
    });

    it('should limit results to specified number', async () => {
      for (let i = 1; i <= 10; i++) {
        await taskRepository.create({ title: `Task ${i}`, description: `Desc ${i}` });
      }

      const tasks = await taskRepository.findRecent(5);

      expect(tasks).toHaveLength(5);
    });
  });

  describe('findById', () => {
    it('should return task when found', async () => {
      const created = await taskRepository.create({ title: 'Test', description: 'Desc' });

      const found = await taskRepository.findById(created.id);

      expect(found).not.toBeNull();
      expect(found?.id).toBe(created.id);
    });

    it('should return null when task not found', async () => {
      const found = await taskRepository.findById('non-existent-id');

      expect(found).toBeNull();
    });
  });

  describe('markAsCompleted', () => {
    it('should mark task as completed', async () => {
      const task = await taskRepository.create({ title: 'Test', description: 'Desc' });

      const updated = await taskRepository.markAsCompleted(task.id);

      expect(updated.completed).toBe(true);
    });
  });
});