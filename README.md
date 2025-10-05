# Todo Application - Full Stack Project

A modern, full-stack todo application built with React, TypeScript, Express, and PostgreSQL. This project demonstrates clean architecture principles, comprehensive testing, and containerized deployment.

## 🏗️ Architecture

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Frontend  │ ───► │   Backend   │ ───► │  PostgreSQL │
│   (React)   │      │  (Express)  │      │  Database   │
│   Port 80   │      │  Port 3000  │      │  Port 5432  │
└─────────────┘      └─────────────┘      └─────────────┘
```

### Components

- **Frontend**: React 19 + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Express.js + TypeScript + Prisma ORM
- **Database**: PostgreSQL 17
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod validation
- **Testing**: Jest + React Testing Library (Frontend), Jest + Supertest (Backend)

## ✨ Features

- ✅ Create todo tasks with title and description
- ✅ View 5 most recent incomplete tasks
- ✅ Mark tasks as completed
- ✅ Real-time updates
- ✅ Dark/Light theme toggle
- ✅ Responsive design
- ✅ Form validation
- ✅ Error handling with toast notifications
- ✅ 100% backend test coverage
- ✅ Comprehensive frontend test coverage

## 📋 Prerequisites

- **Docker** (v20.10 or higher)
- **Docker Compose** (v2.0 or higher)
- **Git**

For local development without Docker:
- Node.js 22+
- PostgreSQL 17+

## 🚀 Quick Start

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd todo-app
   ```

2. **Start all services**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:3000/api
   - Database: localhost:5433

4. **Stop the services**
   ```bash
   docker-compose down
   ```

5. **Clean up (remove volumes)**
   ```bash
   docker-compose down -v
   ```

## 🛠️ Local Development Setup

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start PostgreSQL (using Docker)
docker run -d \
  --name postgres-dev \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=todo_db \
  -p 5433:5432 \
  postgres:17-alpine

# Run database migrations
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate

# Start development server
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📁 Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── __tests__/           # Test files
│   │   │   ├── integration/     # Integration tests
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
│   │   │   ├── TaskForm.tsx
│   │   │   ├── TaskList.tsx
│   │   │   └── mode-toggle.tsx
│   │   ├── lib/                 # Utilities
│   │   │   ├── api.ts           # API client
│   │   │   ├── utils.ts         # Helper functions
│   │   │   └── validators.ts    # Zod schemas
│   │   ├── store/               # Zustand store
│   │   ├── types/               # TypeScript types
│   │   ├── App.tsx              # Main app component
│   │   ├── main.tsx             # Entry point
│   │   └── setupTests.ts        # Test configuration
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── jest.config.ts
│   ├── package.json
│   └── tsconfig.json
│
└── docker-compose.yml
```

## 🧪 Testing

### Backend Tests

The backend has **100% test coverage** including:
- Unit tests for controllers, services, and repositories
- Integration tests for API endpoints
- Validation tests
- Error handling tests

```bash
cd backend
npm test                 # Run all tests with coverage
npm run test:watch       # Watch mode
```

### Frontend Tests

Comprehensive test coverage including:
- Component tests
- Store/state management tests
- User interaction tests
- Error handling tests

```bash
cd frontend
npm test                 # Run all tests with coverage
npm run test:watch       # Watch mode
npm run test:ci          # CI mode
```

## 🔌 API Endpoints

### Tasks

- **POST** `/api/tasks` - Create a new task
  ```json
  {
    "title": "Task title",
    "description": "Task description"
  }
  ```

- **GET** `/api/tasks` - Get 5 most recent incomplete tasks

- **PATCH** `/api/tasks/:id/complete` - Mark task as completed

### Health Check

- **GET** `/health` - Health check endpoint

## 🎨 Design Decisions

### Backend Architecture

- **Layered Architecture**: Controller → Service → Repository pattern
- **Dependency Injection**: Loose coupling through constructor injection
- **Repository Pattern**: Data access abstraction for easier testing and maintenance
- **DTO Pattern**: Separate data transfer objects from domain models
- **Zod Validation**: Runtime type checking and validation
- **Prisma ORM**: Type-safe database access

### Frontend Architecture

- **Component-Based**: Reusable, testable components
- **Zustand State Management**: Simple, performant global state
- **React Hook Form**: Efficient form handling with validation
- **shadcn/ui**: Accessible, customizable component library
- **Axios**: HTTP client with interceptor support
- **Tailwind CSS**: Utility-first styling

### Testing Strategy

- **Backend**: 100% coverage with unit and integration tests
- **Frontend**: High coverage focusing on user interactions
- **Mocking**: Strategic mocking for isolation
- **Integration Tests**: Real database interactions for confidence

## 🔐 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/todo_db?schema=public"
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
```

## 🐳 Docker Configuration

### Multi-stage Builds
Both frontend and backend use multi-stage Docker builds for:
- Smaller image sizes
- Faster builds
- Separation of build and runtime environments

### Networks
All services communicate through a custom bridge network for:
- Service discovery
- Network isolation
- Better security

### Health Checks
- Database has health checks to ensure it's ready before backend starts
- Proper dependency management with `depends_on`

## 🚦 CI/CD Considerations

The project is ready for CI/CD with:
- Dockerized builds
- Automated tests
- Coverage thresholds
- Lint checks
- Health check endpoints

## 📝 Development Workflow

1. Create feature branch
2. Make changes
3. Run tests locally
4. Build Docker containers
5. Test with Docker Compose
6. Submit pull request

## 🔧 Troubleshooting

### Port Conflicts
If ports are already in use:
```bash
# Change ports in docker-compose.yml
ports:
  - "8080:80"      # Frontend
  - "3001:3000"    # Backend
  - "5434:5432"    # Database
```

### Database Connection Issues
```bash
# Reset database
docker-compose down -v
docker-compose up -d db
docker-compose up backend
```

### Frontend not connecting to backend
- Ensure VITE_API_URL is set correctly
- Check CORS settings in backend
- Verify backend is running

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Express Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

## 📄 License

MIT

## 👤 Author

Your Name

## 🙏 Acknowledgments

Built as part of the Full Stack Engineer Take Home Assessment.
