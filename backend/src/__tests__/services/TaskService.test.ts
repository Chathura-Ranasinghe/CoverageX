import { TaskService } from '../../services/TaskService';
import { ITaskRepository } from '../../repositories/ITaskRepository';
import { Task, CreateTaskDTO } from '../../types/task.types';

describe('TaskService', () => {
  let taskService: TaskService;
  let mockRepository: jest.Mocked<ITaskRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findRecent: jest.fn(),
      findById: jest.fn(),
      markAsCompleted: jest.fn(),
    };
    taskService = new TaskService(mockRepository);
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      const taskData: CreateTaskDTO = {
        title: 'Test Task',
        description: 'Test Description',
      };

      const expectedTask: Task = {
        id: '1',
        ...taskData,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.create.mockResolvedValue(expectedTask);

      const result = await taskService.createTask(taskData);

      expect(mockRepository.create).toHaveBeenCalledWith(taskData);
      expect(result).toEqual(expectedTask);
    });
  });

  describe('getRecentTasks', () => {
    it('should return 5 most recent tasks', async () => {
      const tasks: Task[] = [
        {
          id: '1',
          title: 'Task 1',
          description: 'Desc 1',
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockRepository.findRecent.mockResolvedValue(tasks);

      const result = await taskService.getRecentTasks();

      expect(mockRepository.findRecent).toHaveBeenCalledWith(5);
      expect(result).toEqual(tasks);
    });
  });

  describe('completeTask', () => {
    it('should complete a task successfully', async () => {
      const task: Task = {
        id: '1',
        title: 'Test',
        description: 'Desc',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const completedTask: Task = { ...task, completed: true };

      mockRepository.findById.mockResolvedValue(task);
      mockRepository.markAsCompleted.mockResolvedValue(completedTask);

      const result = await taskService.completeTask('1');

      expect(mockRepository.findById).toHaveBeenCalledWith('1');
      expect(mockRepository.markAsCompleted).toHaveBeenCalledWith('1');
      expect(result.completed).toBe(true);
    });

    it('should throw error when task not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(taskService.completeTask('non-existent'))
        .rejects.toThrow('Task not found');
    });

    it('should throw error when task already completed', async () => {
      const completedTask: Task = {
        id: '1',
        title: 'Test',
        description: 'Desc',
        completed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findById.mockResolvedValue(completedTask);

      await expect(taskService.completeTask('1'))
        .rejects.toThrow('Task already completed');
    });
  });
});