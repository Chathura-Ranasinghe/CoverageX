import { create } from 'zustand';
import type { Task, CreateTaskDTO } from '../types/task';
import { taskApi } from '../lib/api';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  createTask: (data: CreateTaskDTO) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const tasks = await taskApi.getRecentTasks();
      set({ tasks, loading: false });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      set({ 
        error: 'Failed to fetch tasks', 
        loading: false 
      });
    }
  },

  createTask: async (data: CreateTaskDTO) => {
    set({ loading: true, error: null });
    try {
      await taskApi.createTask(data);
      // Refresh tasks after creation
      await get().fetchTasks();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      set({ 
        error: 'Failed to create task', 
        loading: false 
      });
    }
  },

  completeTask: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await taskApi.completeTask(id);
      // Refresh tasks after completion
      await get().fetchTasks();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      set({ 
        error: 'Failed to complete task', 
        loading: false 
      });
    }
  },

  clearError: () => set({ error: null }),
}));