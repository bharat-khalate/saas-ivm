# StockFlow

StockFlow is a full-stack inventory and stock management application with a React frontend and an Express + Prisma backend.

## Tech Stack

- Frontend: React, TypeScript, Vite, Redux Toolkit, Axios, Tailwind CSS
- Backend: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, JWT auth

## Project Structure

```text
StockFlow/
  FE/                 # Frontend (Vite + React)
  BE/                 # Backend API (Express + Prisma)
  package.json        # Root scripts to run FE and BE together
```

## Prerequisites

- Node.js 18+ (recommended)
- npm
- PostgreSQL database

## Environment Variables

### Backend (`BE/.env`)

Create `BE/.env` (you can start from `BE/.example.env`):

```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name?schema=public
JWT_EXPIRES_IN=expiry
JWT_SECRET=my_secret
PORT=5000
```

### Frontend (`FE/.env`)

Create `FE/.env`:

```env
VITE_API_BASE=http://localhost:5000/api
```

## Setup

From the project root:

```bash
npm install
```

Install frontend and backend dependencies:

```bash
cd FE && npm install
cd ../BE && npm install
```

Run backend migrations:

```bash
cd BE
npm run prisma:migrate
```

## Run in Development

### Option 1: Run services separately (recommended on case-sensitive environments)

Backend:

```bash
cd BE
npm run dev
```

Frontend:

```bash
cd FE
npm run dev
```

### Option 2: Run both from root

```bash
npm run dev
```

Note: root scripts currently reference `fe` / `be`. On case-sensitive systems, update them to `FE` / `BE` in root `package.json`.

## Build and Start

Backend build:

```bash
cd BE
npm run build
npm run start
```

Frontend build:

```bash
cd FE
npm run build
npm run preview
```

## API Overview

Base URL: `http://localhost:5000/api`

Main route groups:

- `/users` (register, login, refresh, and user management)
- `/products` (create, list/search, update, delete products)
- `/categories` (list/create categories)
- `/settings` (read/update app settings)
- `/dashboard` (dashboard data)
- `/files` (static file serving from backend uploads directory)

Health check:

- `GET /` -> `StockFlow API is running`

## Database

- Prisma schema: `BE/prisma/schema.prisma`
- Migrations: `BE/prisma/migrations/`
- Migration command: `npm run prisma:migrate` (inside `BE`)

## Available Scripts

### Root

- `npm run setup`: install FE and BE dependencies, then run backend migration
- `npm run dev`: run FE and BE together using concurrently

### Backend (`BE`)

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run prisma:generate`
- `npm run prisma:migrate`

### Frontend (`FE`)

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run preview`
