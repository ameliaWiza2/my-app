# Setup Guide

This guide will help you set up the AI Health Consultation System for local development.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18 or higher
- PostgreSQL 14 or higher
- npm or yarn

## Step 1: Clone and Navigate

```bash
cd /path/to/project
```

## Step 2: Install Dependencies

### Backend
```bash
cd server
npm install
```

### Frontend
```bash
cd ../client
npm install
```

## Step 3: Set Up Environment Variables

### Backend Environment Variables

Create a `.env` file in the `server` directory:

```bash
cd server
cp .env.example .env
```

Edit the `.env` file with your actual values:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/health_chat"
OPENAI_API_KEY="your-openai-api-key-here"
JWT_SECRET="your-random-secret-key"
PORT=3001
NODE_ENV=development
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Important:** Replace the placeholders:
- `user`, `password` in DATABASE_URL with your PostgreSQL credentials
- `your-openai-api-key-here` with your actual OpenAI API key
- `your-random-secret-key` with a secure random string

### Frontend Environment Variables

Create a `.env` file in the `client` directory:

```bash
cd ../client
cp .env.example .env
```

The default values should work for local development:

```env
REACT_APP_API_URL=http://localhost:3001
```

## Step 4: Set Up PostgreSQL Database

Create the database:

```bash
psql -U postgres
CREATE DATABASE health_chat;
\q
```

## Step 5: Run Database Migrations

From the `server` directory:

```bash
cd server
npx prisma migrate dev --name init
```

This will:
- Create all necessary tables
- Generate the Prisma Client

## Step 6: Seed the Database (Optional)

To add demo data:

```bash
npx prisma db seed
```

This creates:
- A demo user with ID `550e8400-e29b-41d4-a716-446655440000`
- Sample health data
- A family member
- An example conversation

## Step 7: Start the Development Servers

### Terminal 1 - Backend Server
```bash
cd server
npm run dev
```

The backend will start on http://localhost:3001

### Terminal 2 - Frontend Application
```bash
cd client
npm start
```

The frontend will start on http://localhost:3000

## Step 8: Verify Setup

1. Open http://localhost:3000 in your browser
2. You should see the AI Health Chat interface
3. If you seeded the database, you'll see a demo conversation
4. Try creating a new conversation and sending a message

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running: `sudo service postgresql status`
- Verify your DATABASE_URL is correct
- Check that the database exists: `psql -U postgres -l`

### OpenAI API Errors
- Verify your OPENAI_API_KEY is valid
- Check you have credits in your OpenAI account
- Ensure you're not hitting rate limits

### Port Already in Use
If port 3001 or 3000 is already in use:
- Change PORT in `server/.env`
- Update REACT_APP_API_URL in `client/.env` accordingly

### Module Not Found Errors
Try deleting node_modules and reinstalling:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Running Tests

### Backend Tests
```bash
cd server
npm test
```

### Frontend Tests
```bash
cd client
npm test
```

## Building for Production

### Backend
```bash
cd server
npm run build
npm start
```

### Frontend
```bash
cd client
npm run build
```

The production build will be in the `client/build` directory.

## Next Steps

- Customize the system prompt in `server/src/services/aiService.ts`
- Add authentication/authorization
- Configure production database
- Set up monitoring and logging
- Deploy to your preferred hosting platform
