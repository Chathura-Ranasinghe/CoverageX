import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useTaskStore } from '../store/taskStore';
import { createTaskSchema, type CreateTaskFormData } from '../lib/validators';
import { toast } from 'sonner';

export const TaskForm: React.FC = () => {
  const { createTask, loading } = useTaskStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
  });

const onSubmit = async (data: CreateTaskFormData) => {
  try {
    await createTask(data);
    toast.success('Task created successfully!');
    reset();
  } catch {
    toast.error('Failed to create task.');
  }
};

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create New Task</CardTitle>
        <CardDescription>Add a new task to your to-do list</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter task title"
              {...register('title')}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter task description"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating...' : 'Create Task'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};