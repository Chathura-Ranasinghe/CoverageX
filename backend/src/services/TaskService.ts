import { ITaskRepository } from '../repositories/ITaskRepository';
import { Task, CreateTaskDTO } from '../types/task.types';

export class TaskService {
  constructor(private taskRepository: ITaskRepository) {}

  async createTask(data: CreateTaskDTO): Promise<Task> {
    return await this.taskRepository.create(data);
  }

  async getRecentTasks(): Promise<Task[]> {
    return await this.taskRepository.findRecent(5);
  }

  async completeTask(id: string): Promise<Task> {
    const task = await this.taskRepository.findById(id);
    
    if (!task) {
      throw new Error('Task not found');
    }

    if (task.completed) {
      throw new Error('Task already completed');
    }

    return await this.taskRepository.markAsCompleted(id);
  }
}