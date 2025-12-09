# Todo App Assessment

A full-stack todo task management application built with React, Node.js/Express, and MySQL.

1. Clone the repository:

```bash
git clone https://github.com/Mihinr/Todo-App-Assessment.git
cd Todo-App-Assessment
```

2. Start all services:

```bash
docker compose up --build
```

3. Access the application:

- Frontend: http://localhost
- Backend API: http://localhost:3000
- Health check: http://localhost:3000/health

## Manual Setup (Development)

### Backend Setup

1. Navigate to backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=todo_user
DB_PASSWORD=todo_password
DB_NAME=todo_db
PORT=3000
```

4. Start the backend:

```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The frontend will be available at http://localhost:5173

## Running Tests

### Backend Tests

Run tests locally:

```bash
cd backend
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

Run tests in Docker:

```bash
docker compose run --rm backend npm test
```

Run tests with coverage in Docker:

```bash
docker compose run --rm backend npm run test:coverage
```

### Frontend Tests

Run tests locally:

```bash
cd frontend
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

Run tests in Docker:

```bash
docker compose run --rm frontend npm test
```

Run tests with coverage in Docker:

```bash
docker compose run --rm frontend npm run test:coverage
```

## Stopping the Application

To stop all containers:

```bash
docker-compose down
```

To stop and remove volumes (this will delete the database data):

```bash
docker-compose down -v
```
