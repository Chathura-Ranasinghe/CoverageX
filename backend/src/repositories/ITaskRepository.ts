import { Task, CreateTaskDTO } from '../types/task.types';

export interface ITaskRepository {
  create(data: CreateTaskDTO): Promise<Task>;
  findRecent(limit: number): Promise<Task[]>;
  findById(id: string): Promise<Task | null>;
  markAsCompleted(id: string): Promise<Task>;
}