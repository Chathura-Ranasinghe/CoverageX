import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { createApp } from '../../app';

const prisma = new PrismaClient();
const app = createApp(prisma);

describe('Task API Integration Tests', () => {
  beforeEach(async () => {
    await prisma.task.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(taskData.title);
      expect(response.body.description).toBe(taskData.description);
      expect(response.body.completed).toBe(false);
    });

    it('should return 400 for invalid data', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: '' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for missing fields', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: 'Only Title' })
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
    });
  });

  describe('GET /api/tasks', () => {
    it('should return empty array when no tasks exist', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should return recent tasks', async () => {
      await request(app)
        .post('/api/tasks')
        .send({ title: 'Task 1', description: 'Desc 1' });

      await request(app)
        .post('/api/tasks')
        .send({ title: 'Task 2', description: 'Desc 2' });

      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].title).toBe('Task 2');
    });

    it('should return only 5 most recent tasks', async () => {
      for (let i = 1; i <= 7; i++) {
        await request(app)
          .post('/api/tasks')
          .send({ title: `Task ${i}`, description: `Desc ${i}` });
      }

      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(response.body).toHaveLength(5);
    });

    it('should not return completed tasks', async () => {
      const task1Response = await request(app)
        .post('/api/tasks')
        .send({ title: 'Task 1', description: 'Desc 1' });

      await request(app)
        .post('/api/tasks')
        .send({ title: 'Task 2', description: 'Desc 2' });

      await request(app)
        .patch(`/api/tasks/${task1Response.body.id}/complete`)
        .expect(200);

      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Task 2');
    });
  });

  describe('PATCH /api/tasks/:id/complete', () => {
    it('should mark task as completed', async () => {
      const createResponse = await request(app)
        .post('/api/tasks')
        .send({ title: 'Test', description: 'Test Desc' });

      const taskId = createResponse.body.id;

      const response = await request(app)
        .patch(`/api/tasks/${taskId}/complete`)
        .expect(200);

      expect(response.body.completed).toBe(true);
    });

    it('should return 404 for non-existent task', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174000';

      const response = await request(app)
        .patch(`/api/tasks/${fakeId}/complete`)
        .expect(404);

      expect(response.body.error).toBe('Task not found');
    });

    it('should return 400 for invalid task ID', async () => {
      const response = await request(app)
        .patch('/api/tasks/invalid-id/complete')
        .expect(400);

      expect(response.body.error).toBe('Invalid task ID');
    });

    it('should return 400 when task already completed', async () => {
      const createResponse = await request(app)
        .post('/api/tasks')
        .send({ title: 'Test', description: 'Test Desc' });

      const taskId = createResponse.body.id;

      await request(app)
        .patch(`/api/tasks/${taskId}/complete`)
        .expect(200);

      const response = await request(app)
        .patch(`/api/tasks/${taskId}/complete`)
        .expect(400);

      expect(response.body.error).toBe('Task already completed');
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('ok');
    });
  });
});