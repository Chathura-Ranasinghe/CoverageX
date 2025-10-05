import axios, { AxiosError } from 'axios';
import type { Task, CreateTaskDTO } from '../types/task';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Network Error: No response received');
    } else {
      console.error('Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const taskApi = {
  createTask: async (data: CreateTaskDTO): Promise<Task> => {
    try {
      const response = await api.post<Task>('/tasks', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error;
    }
  },

  getRecentTasks: async (): Promise<Task[]> => {
    try {
      const response = await api.get<Task[]>('/tasks');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      throw error;
    }
  },

  completeTask: async (id: string): Promise<Task> => {
    try {
      const response = await api.patch<Task>(`/tasks/${id}/complete`);
      return response.data;
    } catch (error) {
      console.error('Failed to complete task:', error);
      throw error;
    }
  },
};