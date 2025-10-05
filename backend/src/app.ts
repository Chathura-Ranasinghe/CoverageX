import express, { Application } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { TaskRepositoryImpl } from "./repositories/TaskRepositoryImpl";
import { TaskService } from "./services/TaskService";
import { TaskController } from "./controllers/TaskController";
import { createTaskRoutes } from "./routes/taskRoutes";

export const createApp = (prisma: PrismaClient): Application => {
  const app = express();

  const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  };

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Dependency injection
  const taskRepository = new TaskRepositoryImpl(prisma);
  const taskService = new TaskService(taskRepository);
  const taskController = new TaskController(taskService);

  // Routes
  app.use("/api", createTaskRoutes(taskController));

  // Health check
  app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
  });

  return app;
};
