import { Request, Response } from 'express';
import { TaskController } from '../../controllers/TaskController';
import { TaskService } from '../../services/TaskService';

describe('TaskController', () => {
  let taskController: TaskController;
  let mockTaskService: jest.Mocked<TaskService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockTaskService = {
      createTask: jest.fn(),
      getRecentTasks: jest.fn(),
      completeTask: jest.fn(),
    } as any;

    taskController = new TaskController(mockTaskService);

    mockRequest = {
      body: {},
      params: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('createTask', () => {
    it('should handle unexpected errors (non-ZodError)', async () => {
      mockRequest.body = { title: 'Test', description: 'Test Desc' };
      
      const unexpectedError = new Error('Database connection failed');
      mockTaskService.createTask.mockRejectedValue(unexpectedError);

      await taskController.createTask(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Internal server error',
      });
    });
  });

  describe('getRecentTasks', () => {
    it('should handle unexpected errors', async () => {
      const unexpectedError = new Error('Database connection failed');
      mockTaskService.getRecentTasks.mockRejectedValue(unexpectedError);

      await taskController.getRecentTasks(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Internal server error',
      });
    });
  });

  describe('completeTask', () => {
    it('should handle unexpected errors (non-Error objects)', async () => {
      mockRequest.params = { id: '123e4567-e89b-12d3-a456-426614174000' };
      
      // Throw something that's not an Error instance
      mockTaskService.completeTask.mockRejectedValue('Something went wrong');

      await taskController.completeTask(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Internal server error',
      });
    });

    it('should handle unexpected Error types', async () => {
      mockRequest.params = { id: '123e4567-e89b-12d3-a456-426614174000' };
      
      const unexpectedError = new Error('Unexpected error');
      mockTaskService.completeTask.mockRejectedValue(unexpectedError);

      await taskController.completeTask(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Internal server error',
      });
    });
  });
});