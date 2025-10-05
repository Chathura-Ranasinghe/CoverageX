# Todo Application - Full Stack Project

A modern, full-stack todo application built with React, TypeScript, Express, and PostgreSQL. This project demonstrates clean architecture principles, comprehensive testing, and containerized deployment.

## 🏗️ Tech Stack

- **Frontend**: React 19 + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Express.js + TypeScript + Prisma ORM
- **Database**: PostgreSQL 17
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod validation
- **Testing**: Jest + React Testing Library (Frontend), Jest + Supertest (Backend)

## ✨ Features

- ✅ Create, view, and complete todo tasks
- ✅ View 5 most recent incomplete tasks
- ✅ Real-time updates with optimistic UI
- ✅ Dark/Light theme toggle
- ✅ Responsive design
- ✅ Form validation with error handling
- ✅ Toast notifications
- ✅ 100% backend test coverage
- ✅ Comprehensive frontend test coverage

## 📋 Prerequisites

### Required
- **Docker** (v20.10 or higher)
- **Docker Compose** (v2.0 or higher)
- **Git**

### For Local Development (Optional)
- Node.js 22+
- PostgreSQL 17+

## 🚀 Quick Start with Docker (Recommended)

### 1. Clone the Repository
```bash
git clone https://github.com/Chathura-Ranasinghe/CoverageX
cd CoverageX
```

### 2. Start All Services
```bash
docker-compose up --build
```

This command will:
- Build the frontend, backend, and database containers
- Start all services
- Run database migrations automatically
- Make the application available at http://localhost

### 3. Access the Application
- **Frontend**: http://localhost
- **Backend API**: http://localhost:3000/api
- **Database**: localhost:5433

### 4. Stop the Services
```bash
# Stop containers (keeps data)
docker-compose down

# Stop and remove all data
docker-compose down -v
```

## 🛠️ Local Development Setup (Without Docker)

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Edit `.env` file:**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/todo_db?schema=public"
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Start PostgreSQL using Docker:**
```bash
docker run -d \
  --name postgres-dev \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=todo_db \
  -p 5433:5432 \
  postgres:17-alpine
```

**Run database migrations:**
```bash
npx prisma migrate dev
npx prisma generate
```

**Start the development server:**
```bash
npm run dev
```

**Run tests:**
```bash
npm test                 # Run all tests with coverage
npm run test:watch       # Watch mode
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Edit `.env` file:**
```env
VITE_API_URL=http://localhost:3000/api
```

**Start the development server:**
```bash
npm run dev
```

**Run tests:**
```bash
npm test                 # Run all tests with coverage
npm run test:watch       # Watch mode
npm run test:ci          # CI mode
```

## 🔌 API Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/health` | Health check | - |
| POST | `/api/tasks` | Create a new task | `{ "title": "string", "description": "string" }` |
| GET | `/api/tasks` | Get 5 most recent incomplete tasks | - |
| PATCH | `/api/tasks/:id/complete` | Mark task as completed | - |

### Example API Requests

**Create a Task:**
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy groceries","description":"Milk, eggs, bread"}'
```

**Get Tasks:**
```bash
curl http://localhost:3000/api/tasks
```

**Complete a Task:**
```bash
curl -X PATCH http://localhost:3000/api/tasks/1/complete
```

## 🧪 Testing

### Backend Tests (100% Coverage)
```bash
cd backend
npm test                 # Run all tests with coverage
npm run test:watch       # Watch mode for development
```

**Test Coverage Includes:**
- Unit tests for controllers, services, and repositories
- Integration tests for API endpoints
- Validation tests with Zod schemas
- Error handling and edge cases

### Frontend Tests
```bash
cd frontend
npm test                 # Run all tests with coverage
npm run test:watch       # Watch mode
npm run test:ci          # CI mode (no watch)
```

**Test Coverage Includes:**
- Component rendering and interactions
- State management (Zustand store)
- User interactions and form submissions
- Error handling and loading states

## 📁 Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── __tests__/           # Test files
│   │   │   ├── integration/     # API integration tests
│   │   │   ├── controllers/     # Controller unit tests
│   │   │   ├── services/        # Service unit tests
│   │   │   └── repositories/    # Repository tests
│   │   ├── controllers/         # Request handlers
│   │   ├── repositories/        # Data access layer
│   │   ├── services/            # Business logic
│   │   ├── routes/              # API routes
│   │   ├── types/               # TypeScript types
│   │   ├── validators/          # Zod schemas
│   │   ├── app.ts               # Express app setup
│   │   └── index.ts             # Entry point
│   ├── prisma/
│   │   ├── migrations/          # Database migrations
│   │   └── schema.prisma        # Database schema
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── __tests__/           # Test files
│   │   │   ├── components/      # Component tests
│   │   │   └── store/           # Store tests
│   │   ├── components/          # React components
│   │   │   ├── ui/              # shadcn/ui components
│   │   │   ├── TaskForm.tsx     # Task creation form
│   │   │   ├── TaskList.tsx     # Task list display
│   │   │   └── mode-toggle.tsx  # Theme toggle
│   │   ├── lib/                 # Utilities
│   │   │   ├── api.ts           # Axios API client
│   │   │   ├── utils.ts         # Helper functions
│   │   │   └── validators.ts    # Zod schemas
│   │   ├── store/               # Zustand store
│   │   ├── types/               # TypeScript types
│   │   ├── App.tsx              # Main app component
│   │   └── main.tsx             # Entry point
│   ├── Dockerfile
│   ├── nginx.conf               # Nginx configuration
│   ├── jest.config.ts
│   ├── package.json
│   └── tsconfig.json
│
└── docker-compose.yml           # Docker orchestration
```

## 🐳 Docker Configuration

### Services Architecture

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   Frontend      │ ───► │   Backend       │ ───► │  PostgreSQL     │
│   (Nginx)       │      │   (Express)     │      │  Database       │
│   Port 80       │      │   Port 3000     │      │   Port 5432     │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

### Key Features
- **Multi-stage builds** for optimized image sizes
- **Health checks** for service dependencies
- **Custom bridge network** for service communication
- **Volume persistence** for database data
- **Automatic migrations** on backend startup

### Customizing Ports

If default ports are in use, edit `docker-compose.yml`:

```yaml
services:
  frontend:
    ports:
      - "8080:80"      # Change 8080 to your preferred port
  
  backend:
    ports:
      - "3001:3000"    # Change 3001 to your preferred port
  
  db:
    ports:
      - "5434:5432"    # Change 5434 to your preferred port
```

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Check what's using the port
lsof -i :80        # Linux/Mac
netstat -ano | findstr :80   # Windows

# Change ports in docker-compose.yml or stop the conflicting service
```

### Database Connection Issues
```bash
# Reset database and restart
docker-compose down -v
docker-compose up -d db
# Wait for database to be ready
docker-compose up backend frontend
```

### Frontend Not Loading
- Verify backend is running: `curl http://localhost:3000/health`
- Check browser console for errors
- Ensure CORS is configured correctly in backend
- Verify `VITE_API_URL` in frontend `.env`

### Container Build Fails
```bash
# Clean Docker cache
docker-compose down -v
docker system prune -a
docker-compose up --build
```

### Tests Failing
```bash
# Backend tests
cd backend
rm -rf node_modules package-lock.json
npm install
npm test

# Frontend tests
cd frontend
rm -rf node_modules package-lock.json
npm install
npm test
```

## 🎯 Architecture Decisions

### Backend
- **Layered Architecture**: Controller → Service → Repository pattern for separation of concerns
- **Dependency Injection**: Loose coupling through constructor injection
- **Repository Pattern**: Data access abstraction for easier testing
- **Zod Validation**: Runtime type checking and validation
- **Prisma ORM**: Type-safe database queries

### Frontend
- **Component-Based**: Reusable, testable React components
- **Zustand**: Lightweight state management
- **React Hook Form**: Performant form handling
- **shadcn/ui**: Accessible, customizable components
- **Tailwind CSS**: Utility-first styling

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Docker Documentation](https://docs.docker.com/)

## 📄 License

MIT

## 👤 Author

Chathura Ranasinghe

---

## 📸 Screenshots

### Application Interface
![Application UI](./src/assets/task_app_screenshot.jpeg)
*Todo application interface showing task creation form and task list with theme toggle*

### Docker Desktop
![Docker Desktop Running](./src/assets/docker.png)
*All services running successfully in Docker Desktop*
