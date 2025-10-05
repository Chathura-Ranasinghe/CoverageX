# Todo Task Management Application

A full-stack todo application built with React, TypeScript, Node.js, Express, PostgreSQL, and Docker.

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Development Setup](#development-setup)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)

## ✨ Features

- Create new tasks with title and description
- View the 5 most recent incomplete tasks
- Mark tasks as completed
- Completed tasks are automatically hidden from the list
- Dark/Light theme toggle
- Responsive design
- Real-time toast notifications
- Form validation with Zod
- Comprehensive test coverage

## 🏗️ Architecture

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Frontend   │─────▶│   Backend    │─────▶│  PostgreSQL  │
│   (React)    │      │  (Express)   │      │   Database   │
│   Port: 80   │      │  Port: 3000  │      │  Port: 5432  │
└──────────────┘      └──────────────┘      └──────────────┘
```

The application follows a three-tier architecture:
- **Frontend**: React SPA with TypeScript, Tailwind CSS, and shadcn/ui components
- **Backend**: RESTful API built with Express.js, following clean architecture principles
- **Database**: PostgreSQL with Prisma ORM for type-safe database access

## 🛠️ Tech Stack

### Frontend
- React 19 with TypeScript
- Vite for fast development and optimized builds
- Tailwind CSS for styling
- shadcn/ui for UI components
- Zustand for state management
- React Hook Form + Zod for form validation
- Axios for API communication
- Jest + React Testing Library for testing

### Backend
- Node.js with Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Zod for validation
- Jest + Supertest for testing
- CORS for cross-origin requests

### DevOps
- Docker & Docker Compose
- Multi-stage builds for optimized images
- Nginx for serving frontend in production

## 📦 Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)
- Git

That's it! Docker handles everything else.

## 🚀 Quick Start

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd todo-app
   ```

2. **Start all services with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:3000
   - Backend Health: http://localhost:3000/health

4. **Stop the services**
   ```bash
   docker-compose down
   ```

5. **Clean up (remove volumes)**
   ```bash
   docker-compose down -v
   ```

## 💻 Development Setup

### Backend Development

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Run database migrations**
   ```bash
   npm run prisma:migrate
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Run tests**
   ```bash
   npm test
   ```

### Frontend Development

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env if needed (default: http://localhost:3000/api)
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Run tests**
   ```bash
   npm test
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test                 # Run tests with coverage
npm run test:watch       # Run tests in watch mode
```

**Test Coverage:**
- Unit tests for services, controllers, and repositories
- Integration tests for API endpoints
- 100% code coverage across all critical paths

### Frontend Tests

```bash
cd frontend
npm test                 # Run tests with coverage
npm run test:watch       # Run tests in watch mode
```

**Test Coverage:**
- Component tests with React Testing Library
- Store tests with Zustand
- Form validation tests
- 80%+ code coverage

## 📁 Project Structure

```
todo-app/
├── backend/
│   ├── src/
│   │   ├── __tests__/           # Tests
│   │   │   ├── integration/     # API integration tests
│   │   │   ├── repositories/    # Repository tests
│   │   │   ├── services/        # Service tests
│   │   │   └── controllers/     # Controller tests
│   │   ├── controllers/         # Request handlers
│   │   ├── repositories/        # Data access layer
│   │   ├── services/            # Business logic
│   │   ├── routes/              # Route definitions
│   │   ├── types/               # TypeScript types
│   │   ├── validators/          # Zod schemas
│   │   ├── app.ts               # Express app setup
│   │   └── index.ts             # Entry point
│   ├── prisma/
│   │   └── schema.prisma        # Database schema
│   ├── Dockerfile
│   ├── jest.config.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── __tests__/           # Tests
│   │   │   ├── components/      # Component tests
│   │   │   └── store/           # Store tests
│   │   ├── components/          # React components
│   │   │   ├── ui/              # shadcn/ui components
│   │   │   ├── TaskForm.tsx
│   │   │   ├── TaskList.tsx
│   │   │   └── mode-toggle.tsx
│   │   ├── lib/                 # Utilities
│   │   │   ├── api.ts           # API client
│   │   │   ├── utils.ts         # Helper functions
│   │   │   └── validators.ts    # Zod schemas
│   │   ├── store/               # Zustand stores
│   │   │   └── taskStore.ts
│   │   ├── types/               # TypeScript types
│   │   ├── App.tsx              # Main component
│   │   └── main.tsx             # Entry point
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── jest.config.ts
│   └── package.json
└── docker-compose.yml           # Multi-container setup
```

## 📡 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### Create Task
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Task title",
  "description": "Task description"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "title": "Task title",
  "description": "Task description",
  "completed": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Get Recent Tasks
```http
GET /api/tasks
```

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "title": "Task title",
    "description": "Task description",
    "completed": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Complete Task
```http
PATCH /api/tasks/:id/complete
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "title": "Task title",
  "description": "Task description",
  "completed": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Health Check
```http
GET /health
```

**Response:** `200 OK`
```json
{
  "status": "ok"
}
```

### Error Responses

**400 Bad Request** - Validation error
```json
{
  "error": "Validation failed",
  "details": [
    {
      "path": ["title"],
      "message": "Title is required"
    }
  ]
}
```

**404 Not Found** - Task not found
```json
{
  "error": "Task not found"
}
```

**500 Internal Server Error**
```json
{
  "error": "Internal server error"
}
```

## 🎨 Design Decisions

### Backend Architecture
- **Clean Architecture**: Separation of concerns with controllers, services, and repositories
- **Dependency Injection**: Makes the code testable and maintainable
- **Repository Pattern**: Abstracts data access for easier testing and future database changes
- **Validation Layer**: Zod schemas ensure data integrity at API boundaries

### Frontend Architecture
- **Component-Based**: Reusable UI components with shadcn/ui
- **State Management**: Zustand for simple, scalable state management
- **Form Handling**: React Hook Form for performance and validation
- **Type Safety**: TypeScript throughout for catching errors early

### Database Design
```sql
Table: task
- id (UUID, Primary Key)
- title (String, Max 200)
- description (String, Max 1000)
- completed (Boolean, Default false)
- createdAt (Timestamp)
- updatedAt (Timestamp)
```

## 🔒 Security Considerations

- CORS enabled with configurable origins
- Input validation on both frontend and backend
- Parameterized queries via Prisma (SQL injection protection)
- Environment variables for sensitive configuration
- Security headers configured in Nginx

## 🚢 Deployment

The application is containerized and can be deployed to any platform that supports Docker:
- AWS ECS/Fargate
- Google Cloud Run
- Azure Container Instances
- DigitalOcean App Platform
- Self-hosted with Docker Compose

## 📝 License

This project was created as a take-home assessment.

## 👥 Author

Your Name - Full Stack Engineer Assessment

---

**Assessment Completion Date:** [Date]
**Time Spent:** [Hours]