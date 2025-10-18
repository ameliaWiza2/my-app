# AI Health Consultation System

A secure, privacy-focused AI health consultation platform that enables users to have conversations with AI about health queries while leveraging their personal health data context.

## Features

- 🤖 AI-powered health consultations using OpenAI GPT-4
- 💬 Chat-style UI with streaming responses
- 👥 User and family member support
- 🔒 Privacy-first design with data redaction
- 📊 Health data context enrichment
- 💾 Conversation persistence and history
- 📄 Pagination support for conversation lists
- 🗑️ Conversation deletion controls
- 📈 Usage monitoring and metrics
- ⚡ Rate limiting and fallback handling

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Axios for API calls
- React Testing Library for tests

### Backend
- Node.js with Express
- TypeScript
- Prisma ORM with PostgreSQL
- OpenAI API integration
- Rate limiting with express-rate-limit

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- OpenAI API key

### Installation

1. Clone the repository
2. Install dependencies:

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables:

**Server (.env in server directory):**
```
DATABASE_URL="postgresql://user:password@localhost:5432/health_chat"
OPENAI_API_KEY="your-openai-api-key"
JWT_SECRET="your-jwt-secret"
PORT=3001
```

**Client (.env in client directory):**
```
REACT_APP_API_URL="http://localhost:3001"
```

4. Set up the database:

```bash
cd server
npx prisma migrate dev
npx prisma generate
```

5. Start the development servers:

```bash
# Start backend (from server directory)
npm run dev

# Start frontend (from client directory)
npm run start
```

## Testing

```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test
```

## API Endpoints

- `POST /api/conversations` - Create a new conversation
- `GET /api/conversations` - Get paginated conversations
- `GET /api/conversations/:id` - Get a specific conversation
- `DELETE /api/conversations/:id` - Delete a conversation
- `POST /api/conversations/:id/messages` - Send a message (streaming)
- `GET /api/health-context/:userId` - Get user health context
- `GET /api/metrics` - Get AI usage metrics

## Privacy & Security

- Sensitive identifiers are redacted from AI prompts
- User consent is checked before enriching prompts with health data
- API keys are securely stored in environment variables
- Rate limiting prevents abuse
- All data is scoped per user/family member

## License

MIT
