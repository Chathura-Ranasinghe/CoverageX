import { renderHook, act, waitFor } from '@testing-library/react';
import { taskApi } from '../../lib/api';
import type { Task } from '../../types/task';
import { useTaskStore } from '@/store/taskStore';

jest.mock('../../lib/api');

describe('useTaskStore', () => {
  const mockTaskApi = taskApi as jest.Mocked<typeof taskApi>;

  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Task 1',
      description: 'Description 1',
      completed: false,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: '2',
      title: 'Task 2',
      description: 'Description 2',
      completed: false,
      createdAt: '2024-01-02T00:00:00.000Z',
      updatedAt: '2024-01-02T00:00:00.000Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset store state between tests
    const { result } = renderHook(() => useTaskStore());
    act(() => {
      result.current.clearError();
    });
  });

  describe('fetchTasks', () => {
    it('fetches tasks successfully', async () => {
      mockTaskApi.getRecentTasks.mockResolvedValue(mockTasks);

      const { result } = renderHook(() => useTaskStore());

      expect(result.current.tasks).toEqual([]);
      expect(result.current.loading).toBe(false);

      await act(async () => {
        await result.current.fetchTasks();
      });

      expect(result.current.tasks).toEqual(mockTasks);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('sets loading state while fetching', async () => {
      mockTaskApi.getRecentTasks.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockTasks), 100))
      );

      const { result } = renderHook(() => useTaskStore());

      act(() => {
        result.current.fetchTasks();
      });

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('handles fetch error', async () => {
      mockTaskApi.getRecentTasks.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useTaskStore());

      await act(async () => {
        await result.current.fetchTasks();
      });

      expect(result.current.error).toBe('Failed to fetch tasks');
      expect(result.current.loading).toBe(false);
      expect(result.current.tasks).toEqual([]);
    });
  });

  describe('createTask', () => {
    const newTaskData = {
      title: 'New Task',
      description: 'New Description',
    };

    const createdTask: Task = {
      id: '3',
      ...newTaskData,
      completed: false,
      createdAt: '2024-01-03T00:00:00.000Z',
      updatedAt: '2024-01-03T00:00:00.000Z',
    };

    it('creates task successfully', async () => {
      mockTaskApi.createTask.mockResolvedValue(createdTask);
      mockTaskApi.getRecentTasks.mockResolvedValue([createdTask, ...mockTasks]);

      const { result } = renderHook(() => useTaskStore());

      await act(async () => {
        await result.current.createTask(newTaskData);
      });

      expect(mockTaskApi.createTask).toHaveBeenCalledWith(newTaskData);
      expect(mockTaskApi.getRecentTasks).toHaveBeenCalled();
      expect(result.current.error).toBeNull();
      expect(result.current.loading).toBe(false);
    });

    it('sets loading state while creating', async () => {
      mockTaskApi.createTask.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(createdTask), 100))
      );
      mockTaskApi.getRecentTasks.mockResolvedValue([createdTask]);

      const { result } = renderHook(() => useTaskStore());

      act(() => {
        result.current.createTask(newTaskData);
      });

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('handles create error', async () => {
      mockTaskApi.createTask.mockRejectedValue(new Error('Validation error'));

      const { result } = renderHook(() => useTaskStore());

      await act(async () => {
        await result.current.createTask(newTaskData);
      });

      expect(result.current.error).toBe('Failed to create task');
      expect(result.current.loading).toBe(false);
    });

    it('refreshes tasks after successful creation', async () => {
      mockTaskApi.createTask.mockResolvedValue(createdTask);
      mockTaskApi.getRecentTasks.mockResolvedValue([createdTask, ...mockTasks]);

      const { result } = renderHook(() => useTaskStore());

      await act(async () => {
        await result.current.createTask(newTaskData);
      });

      expect(mockTaskApi.getRecentTasks).toHaveBeenCalledTimes(1);
      expect(result.current.tasks).toHaveLength(3);
    });
  });

  describe('completeTask', () => {
    const completedTask: Task = {
      ...mockTasks[0],
      completed: true,
    };

    it('completes task successfully', async () => {
      mockTaskApi.completeTask.mockResolvedValue(completedTask);
      mockTaskApi.getRecentTasks.mockResolvedValue([mockTasks[1]]);

      const { result } = renderHook(() => useTaskStore());

      await act(async () => {
        await result.current.completeTask('1');
      });

      expect(mockTaskApi.completeTask).toHaveBeenCalledWith('1');
      expect(mockTaskApi.getRecentTasks).toHaveBeenCalled();
      expect(result.current.error).toBeNull();
      expect(result.current.loading).toBe(false);
    });

    it('sets loading state while completing', async () => {
      mockTaskApi.completeTask.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(completedTask), 100))
      );
      mockTaskApi.getRecentTasks.mockResolvedValue([mockTasks[1]]);

      const { result } = renderHook(() => useTaskStore());

      act(() => {
        result.current.completeTask('1');
      });

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('handles complete error', async () => {
      mockTaskApi.completeTask.mockRejectedValue(new Error('Task not found'));

      const { result } = renderHook(() => useTaskStore());

      await act(async () => {
        await result.current.completeTask('999');
      });

      expect(result.current.error).toBe('Failed to complete task');
      expect(result.current.loading).toBe(false);
    });

    it('refreshes tasks after successful completion', async () => {
      mockTaskApi.completeTask.mockResolvedValue(completedTask);
      mockTaskApi.getRecentTasks.mockResolvedValue([mockTasks[1]]);

      const { result } = renderHook(() => useTaskStore());

      await act(async () => {
        await result.current.completeTask('1');
      });

      expect(mockTaskApi.getRecentTasks).toHaveBeenCalledTimes(1);
    });
  });

  describe('clearError', () => {
    it('clears error state', async () => {
      mockTaskApi.getRecentTasks.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useTaskStore());

      await act(async () => {
        await result.current.fetchTasks();
      });

      expect(result.current.error).toBe('Failed to fetch tasks');

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });
});