# StockFlow

StockFlow is a full-stack inventory and stock management application with a React frontend and an Express + Prisma backend.  
The project includes multilingual support (frontend i18n + backend l10n), JWT auth with refresh flow, and Prisma migration/seeding support.

## Tech Stack

- Frontend: React, TypeScript, Vite, Redux Toolkit, Axios, Tailwind CSS, i18next, react-i18next
- Backend: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, JWT auth, i18next, i18next-http-middleware

## Project Structure

```text
StockFlow/
  FE/                 # Frontend (Vite + React)
  BE/                 # Backend API (Express + Prisma)
  package.json        # Root scripts for combined setup/run
```

## Prerequisites

- Node.js 18+ (recommended)
- npm
- PostgreSQL database

## Environment Variables

### Backend (`BE/.env`)

Create `BE/.env` (you can copy values from `BE/.example.env`):

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

### 1) Root commands (recommended start)

Run from project root:

```bash
npm run bootstrap
```

- Installs FE + BE dependencies
- Runs backend migration
- Seeds initial data

Or run everything and start dev servers:

```bash
npm run bootstrap-run
```

### 2) Backend setup (for debug purpose)

Use this when you want to debug backend independently.

```bash
cd BE
npm install
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Backend API default: `http://localhost:5000/api`

### 3) Frontend setup (for debug purpose)

Use this when you want to debug frontend independently.

```bash
cd FE
npm install
npm run dev
```

Frontend default: `http://localhost:5173`

## Run in Development

### Run both services from root

```bash
npm run dev
```

### Run services separately

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

## Build and Start

### Backend

```bash
cd BE
npm run build
npm run start
```

### Frontend

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

## API Documentation (Swagger)

Swagger UI:

- `http://localhost:5000/api-docs`

Notes:

- Route docs are defined with JSDoc `@swagger` comments in `BE/src/routes/*.routes.ts`
- Swagger config is in `BE/src/config/swagger.config.ts`
- Production scan target: `dist/routes/*.routes.js`

## Database

- Prisma schema: `BE/prisma/schema.prisma`
- Migrations: `BE/prisma/migrations/`
- Migrate: `cd BE && npm run prisma:migrate`
- Seed: `cd BE && npm run prisma:seed`

## Localization

### Frontend i18n

- Setup: `FE/src/i18n/index.ts`
- Locale files: `FE/src/i18n/en.json`, `FE/src/i18n/hi.json`
- Loaded in: `FE/src/main.tsx`
- UI language switch is wired in app-level UI

### Backend l10n

- Setup: `BE/src/i18n/index.ts`
- Locale files: `BE/src/i18n/en.json`, `BE/src/i18n/hi.json`
- Middleware mounted in: `BE/src/index.ts`
- Language can be passed through `Accept-Language` header

## Available Scripts

### Root

- `npm run bootstrap`
- `npm run bootstrap-run`
- `npm run dev`

### Backend (`BE`)

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run prisma:generate`
- `npm run prisma:migrate`
- `npm run prisma:seed`

### Frontend (`FE`)

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run preview`
