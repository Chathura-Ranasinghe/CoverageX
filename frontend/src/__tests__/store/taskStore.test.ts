import { renderHook, act, waitFor } from '@testing-library/react';
import { useTaskStore } from '../../store/taskStore';
import { taskApi } from '../../lib/api';

jest.mock('../../lib/api');

const mockTasks = [
  {
    id: '1',
    title: 'Task 1',
    description: 'Description 1',
    completed: false,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

describe('useTaskStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset store state
    const { result } = renderHook(() => useTaskStore());
    act(() => {
      result.current.tasks = [];
      result.current.loading = false;
      result.current.error = null;
    });
  });

  describe('fetchTasks', () => {
    it('fetches tasks successfully', async () => {
      (taskApi.getRecentTasks as jest.Mock).mockResolvedValue(mockTasks);

      const { result } = renderHook(() => useTaskStore());

      await act(async () => {
        await result.current.fetchTasks();
      });

      await waitFor(() => {
        expect(result.current.tasks).toEqual(mockTasks);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
      });
    });

    it('handles fetch error', async () => {
      (taskApi.getRecentTasks as jest.Mock).mockRejectedValue(
        new Error('API Error')
      );

      const { result } = renderHook(() => useTaskStore());

      await act(async () => {
        await result.current.fetchTasks();
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Failed to fetch tasks');
        expect(result.current.loading).toBe(false);
      });
    });

    it('sets loading state during fetch', async () => {
      (taskApi.getRecentTasks as jest.Mock).mockImplementation(
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
  });

  describe('createTask', () => {
    it('creates task and refreshes list', async () => {
      const newTask = { title: 'New Task', description: 'New Description' };
      (taskApi.createTask as jest.Mock).mockResolvedValue({
        id: '2',
        ...newTask,
        completed: false,
        createdAt: '2024-01-02T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      });
      (taskApi.getRecentTasks as jest.Mock).mockResolvedValue(mockTasks);

      const { result } = renderHook(() => useTaskStore());

      await act(async () => {
        await result.current.createTask(newTask);
      });

      await waitFor(() => {
        expect(taskApi.createTask).toHaveBeenCalledWith(newTask);
        expect(taskApi.getRecentTasks).toHaveBeenCalled();
        expect(result.current.loading).toBe(false);
      });
    });

    it('handles create error', async () => {
      (taskApi.createTask as jest.Mock).mockRejectedValue(
        new Error('API Error')
      );

      const { result } = renderHook(() => useTaskStore());

      await act(async () => {
        await result.current.createTask({
          title: 'Test',
          description: 'Test',
        });
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Failed to create task');
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('completeTask', () => {
    it('completes task and refreshes list', async () => {
      (taskApi.completeTask as jest.Mock).mockResolvedValue({
        ...mockTasks[0],
        completed: true,
      });
      (taskApi.getRecentTasks as jest.Mock).mockResolvedValue([]);

      const { result } = renderHook(() => useTaskStore());

      await act(async () => {
        await result.current.completeTask('1');
      });

      await waitFor(() => {
        expect(taskApi.completeTask).toHaveBeenCalledWith('1');
        expect(taskApi.getRecentTasks).toHaveBeenCalled();
        expect(result.current.loading).toBe(false);
      });
    });

    it('handles complete error', async () => {
      (taskApi.completeTask as jest.Mock).mockRejectedValue(
        new Error('API Error')
      );

      const { result } = renderHook(() => useTaskStore());

      await act(async () => {
        await result.current.completeTask('1');
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Failed to complete task');
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('clearError', () => {
    it('clears error state', async () => {
      const { result } = renderHook(() => useTaskStore());

      // Set error first
      act(() => {
        result.current.error = 'Some error';
      });

      expect(result.current.error).toBe('Some error');

      // Clear error
      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });
});