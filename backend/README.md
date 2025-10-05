# Task Management API

A RESTful API for managing tasks built with Node.js, Express, TypeScript, Prisma, and PostgreSQL.

## Features

- Create, read, and complete tasks
- Clean architecture with repository pattern
- Input validation with Zod
- Comprehensive test coverage (94%+)
- Docker containerization
- Type-safe database operations with Prisma

## Tech Stack

- **Runtime**: Node.js 22
- **Framework**: Express 5
- **Language**: TypeScript
- **Database**: PostgreSQL 17
- **ORM**: Prisma
- **Validation**: Zod
- **Testing**: Jest, Supertest
- **Containerization**: Docker & Docker Compose

## Prerequisites

- Node.js 22 or higher
- Docker and Docker Compose
- npm or yarn

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example environment file and update values if needed:

```bash
cp .env.example .env
```

### 4. Start the database

```bash
docker-compose up -d db
```

### 5. Run database migrations

```bash
npm run prisma:migrate
```

### 6. Start the development server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Health Check
- `GET /health` - Check API health status

### Tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks` - Get recent incomplete tasks (limit 5)
- `PATCH /api/tasks/:id/complete` - Mark a task as completed

### Request Examples

**Create Task:**
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project",
    "description": "Finish the backend API implementation"
  }'
```

**Get Tasks:**
```bash
curl http://localhost:3000/api/tasks
```

**Complete Task:**
```bash
curl -X PATCH http://localhost:3000/api/tasks/{task-id}/complete
```

## Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm start            # Start production server
npm test             # Run tests with coverage
npm run test:watch   # Run tests in watch mode
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio (database GUI)
```

## Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

The project includes:
- Unit tests for services
- Integration tests for repositories
- End-to-end API tests

## Docker Deployment

### Development

Start all services (database + backend):

```bash
docker-compose up
```

### Production

Build and run the production container:

```bash
docker-compose up --build
```

The application will:
1. Start PostgreSQL database
2. Wait for database health check
3. Run migrations automatically
4. Start the API server

## Project Structure

```
src/
├── __tests__/              # Test files
│   ├── integration/        # API integration tests
│   ├── repositories/       # Repository tests
│   └── services/           # Service unit tests
├── controllers/            # Request handlers
├── repositories/           # Data access layer
├── routes/                 # API routes
├── services/              # Business logic
├── types/                 # TypeScript type definitions
├── validators/            # Input validation schemas
├── app.ts                 # Express app configuration
└── index.ts               # Application entry point
prisma/
└── schema.prisma          # Database schema
```

## Architecture

The application follows clean architecture principles:

- **Controllers**: Handle HTTP requests/responses
- **Services**: Contain business logic
- **Repositories**: Abstract database operations
- **Validators**: Ensure data integrity with Zod schemas

This architecture provides:
- Separation of concerns
- Testability through dependency injection
- Easy maintenance and scalability
- Type safety throughout the stack

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5433/todo_db?schema=public` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment mode | `development` |

## Database Schema

```prisma
model Task {
  id          String   @id @default(uuid())
  title       String
  description String
  completed   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

## License

MIT