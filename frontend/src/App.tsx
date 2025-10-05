import { useEffect } from "react";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import { useTaskStore } from "./store/taskStore";
import { Toaster } from "./components/ui/sonner";
import { ModeToggle } from "./components/mode-toggle";

function App() {
  const { fetchTasks } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-8">
        {/* Header */}
        <header className="relative text-center mb-12">
          {/* Mode toggle in top-right */}
          <div className="absolute top-0 right-0">
            <ModeToggle />
          </div>

          <h1 className="text-4xl font-bold tracking-tight">Todo App</h1>
          <p className="text-muted-foreground mt-2">
            Manage your tasks efficiently
          </p>
        </header>

        {/* Toast notifications */}
        <Toaster richColors position="top-right" />

        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-8 justify-center items-start w-full">
          <div className="w-full lg:w-1/2">
            <TaskForm />
          </div>
          <div className="w-full lg:w-1/2">
            <TaskList />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;