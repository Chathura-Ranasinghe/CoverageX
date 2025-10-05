# Setup Guide - Step by Step

This guide walks you through setting up the complete Todo application from scratch.

## Prerequisites Check

Before starting, verify you have:

```bash
# Check Docker version (should be 20.10+)
docker --version

# Check Docker Compose version (should be 2.0+)
docker-compose --version

# Check Git
git --version
```

## Complete File Structure

Create this exact folder structure:

```
todo-app/
├── backend/
│   ├── src/
│   │   ├── __tests__/
│   │   │   ├── integration/
│   │   │   │   └── task.api.test.ts
│   │   │   ├── repositories/
│   │   │   │   └── TaskRepository.test.ts
│   │   │   ├── services/
│   │   │   │   └── TaskService.test.ts
│   │   │   └── controllers/
│   │   │       └── TaskController.test.ts
│   │   ├── controllers/
│   │   │   └── TaskController.ts
│   │   ├── repositories/
│   │   │   ├── ITaskRepository.ts
│   │   │   └── TaskRepositoryImpl.ts
│   │   ├── services/
│   │   │   └── TaskService.ts
│   │   ├── routes/
│   │   │   └── taskRoutes.ts
│   │   ├── types/
│   │   │   └── task.types.ts
│   │   ├── validators/
│   │   │   └── taskValidators.ts
│   │   ├── app.ts
│   │   └── index.ts
│   ├── prisma/
│   │   └── schema.prisma
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── Dockerfile
│   ├── jest.config.js
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── __tests__/
│   │   │   ├── components/
│   │   │   │   ├── TaskForm.test.tsx
│   │   │   │   └── TaskList.test.tsx
│   │   │   └── store/
│   │   │       └── taskStore.test.ts
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── label.tsx
│   │   │   │   ├── textarea.tsx
│   │   │   │   ├── tooltip.tsx
│   │   │   │   └── sonner.tsx
│   │   │   ├── TaskForm.tsx
│   │   │   ├── TaskList.tsx
│   │   │   ├── mode-toggle.tsx
│   │   │   └── theme-provider.tsx
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   ├── utils.ts
│   │   │   └── validators.ts
│   │   ├── store/
│   │   │   └── taskStore.ts
│   │   ├── types/
│   │   │   └── task.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── e2e/
│   │   └── todo.spec.ts
│   ├── public/
│   ├── .env
│   ├── .env.example
│   ├── .env.production
│   ├── .gitignore
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── jest.config.ts
│   ├── jest.setup.ts
│   ├── playwright.config.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── components.json
│   └── index.html
├── docker-compose.yml
└── README.md
```

## Step-by-Step Setup

### Step 1: Create Project Structure

```bash
# Create root directory
mkdir todo-app
cd todo-