# Task Manager

A full-stack task management application with a NestJS backend and React frontend.

## Project Structure

```
task-manager/
├── backend/          # NestJS API server
├── frontend/         # React application with Vite
└── README.md        # This file
```

## Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd task-manager
```

2. Install dependencies for both backend and frontend:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## Running the Project

### Development Mode

**Terminal 1 - Start Backend:**

```bash
cd backend
npm run start:dev
```

The backend server will run on `http://localhost:3000`

**Terminal 2 - Start Frontend:**

```bash
cd frontend
npm run dev
```

The frontend application will typically run on `http://localhost:5173`

### Production Build

**Backend:**

```bash
cd backend
npm run build
npm run start:prod
```

**Frontend:**

```bash
cd frontend
npm run build
```

The built files will be in the `frontend/dist` directory.

## Available Commands

### Backend (NestJS)

- `npm run start` - Start the server in production mode
- `npm run start:dev` - Start the server in watch mode (development)
- `npm run start:debug` - Start the server with debugging enabled
- `npm run build` - Build the project for production
- `npm run lint` - Run ESLint and fix issues
- `npm run format` - Format code with Prettier
- `npm test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage report
- `npm run test:e2e` - Run end-to-end tests

### Frontend (React + Vite)

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint

## Database

The backend uses **Prisma** with **SQLite** for data persistence.

### Database Setup

```bash
cd backend
# Run migrations (usually done automatically on first run)
npx prisma migrate dev
```

### Database File Location

The SQLite database file is stored at `backend/prisma/dev.db`

## Technology Stack

### Backend

- **Framework**: NestJS
- **Database**: Prisma ORM with SQLite
- **Validation**: class-validator, class-transformer

### Frontend

- **Framework**: React 19
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI)
- **HTTP Client**: Axios
- **Forms**: React Hook Form
- **Language**: TypeScript

## API Endpoints

The backend provides the following main endpoints:

- **Todos**: `/todos` - CRUD operations for tasks
- **Categories**: `/categories` - CRUD operations for categories

Refer to the backend README for detailed API documentation.

## Troubleshooting

### Backend won't start

- Ensure Node.js version is v18 or higher: `node --version`
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check if port 3000 is available

### Frontend won't start

- Ensure port 5173 is available
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check browser console for errors

### Database issues

- Delete `backend/prisma/dev.db` and restart the backend to recreate the database
- Run migrations: `cd backend && npx prisma migrate dev`

## Development Tips

1. **Frontend and Backend must run simultaneously** for the application to work correctly
2. **Environment variables**: Create `.env` files in both backend and frontend directories (they are in `.gitignore`)
3. **Prisma Studio**: View and edit your database with `cd backend && npx prisma studio`
