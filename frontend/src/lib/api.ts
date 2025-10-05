import axios from 'axios';
import type { Task, CreateTaskDTO } from '../types/task';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const taskApi = {
  createTask: async (data: CreateTaskDTO): Promise<Task> => {
    const response = await api.post<Task>('/tasks', data);
    return response.data;
  },

  getRecentTasks: async (): Promise<Task[]> => {
    const response = await api.get<Task[]>('/tasks');
    return response.data;
  },

  completeTask: async (id: string): Promise<Task> => {
    const response = await api.patch<Task>(`/tasks/${id}/complete`);
    return response.data;
  },
};