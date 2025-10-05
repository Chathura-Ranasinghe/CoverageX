import { PrismaClient } from '@prisma/client';
import { ITaskRepository } from './ITaskRepository';
import { Task, CreateTaskDTO } from '../types/task.types';

export class TaskRepositoryImpl implements ITaskRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateTaskDTO): Promise<Task> {
    return await this.prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
      },
    });
  }

  async findRecent(limit: number): Promise<Task[]> {
    return await this.prisma.task.findMany({
      where: {
        completed: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }

  async findById(id: string): Promise<Task | null> {
    return await this.prisma.task.findUnique({
      where: { id },
    });
  }

  async markAsCompleted(id: string): Promise<Task> {
    return await this.prisma.task.update({
      where: { id },
      data: { completed: true },
    });
  }
}