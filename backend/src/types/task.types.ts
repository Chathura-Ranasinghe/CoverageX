export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskDTO {
  title: string;
  description: string;
}

export interface UpdateTaskDTO {
  completed: boolean;
}