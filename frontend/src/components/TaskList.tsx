import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { useTaskStore } from "../store/taskStore";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export const TaskList: React.FC = () => {
  const { tasks, loading, error, completeTask, fetchTasks } = useTaskStore();

  if (loading && tasks.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Clock className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading tasks...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full border-destructive">
        <CardContent className="p-6">
          <div className="flex items-center text-destructive">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
          <Button
            variant="outline"
            className="mt-4"
            onClick={async () => {
              await fetchTasks();
              toast.info("Retrying to load tasks...");
            }}
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (tasks.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground">
            No tasks yet
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            Create your first task to get started!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recent Tasks</CardTitle>
        <CardDescription>Your 5 most recent incomplete tasks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{task.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {task.description}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Created: {new Date(task.createdAt).toLocaleDateString()}
              </p>
            </div>
            <Button
              onClick={async () => {
                try {
                  await completeTask(task.id);
                  toast.success("Task marked as done!");
                } catch {
                  toast.error("Failed to complete task.");
                }
              }}
              disabled={loading}
              variant="outline"
              className="ml-4"
            >
              {loading ? "..." : "Done"}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
