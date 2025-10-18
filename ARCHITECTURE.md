# Architecture Documentation

## System Overview

The AI Health Consultation System is a full-stack application that provides users with AI-powered health consultations while maintaining strict privacy safeguards.

## High-Level Architecture

```
┌─────────────────┐
│  React Client   │
│   (TypeScript)  │
└────────┬────────┘
         │ HTTP/REST + SSE
         │
┌────────▼────────┐
│  Express API    │
│   (TypeScript)  │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼──┐  ┌──▼────┐
│ PG   │  │OpenAI │
│ DB   │  │ API   │
└──────┘  └───────┘
```

## Component Architecture

### Frontend (`/client`)

**Components:**
- `App.tsx` - Main application container
- `ChatWindow.tsx` - Chat interface with message display
- `ChatMessage.tsx` - Individual message rendering
- `ChatInput.tsx` - Message input with controls
- `ConversationList.tsx` - Conversation sidebar
- `Pagination.tsx` - Pagination controls

**Hooks:**
- `useConversations` - Manages conversation list state and pagination
- `useChat` - Handles message sending and streaming

**Services:**
- `api.ts` - API client with typed methods

**State Management:**
- React hooks (useState, useEffect, useCallback)
- Local component state
- Props drilling for shared state

### Backend (`/server`)

**Routes:**
- `POST /api/conversations` - Create conversation
- `GET /api/conversations` - List conversations (paginated)
- `GET /api/conversations/:id` - Get conversation details
- `DELETE /api/conversations/:id` - Delete conversation
- `POST /api/conversations/:id/messages` - Send message (streaming/non-streaming)
- `GET /api/metrics` - Get AI usage metrics

**Services:**
- `aiService.ts` - OpenAI integration, prompt construction
- `conversationService.ts` - Conversation and message management
- `monitoring.ts` - Metrics logging and aggregation
- `privacy.ts` - Data redaction and sanitization

**Middleware:**
- `rateLimiter.ts` - API rate limiting
- `errorHandler.ts` - Centralized error handling

**Database (Prisma):**
- PostgreSQL for data persistence
- Models: User, FamilyMember, Conversation, Message, HealthData, AIMetrics

## Data Flow

### Creating a Conversation
```
User Input → API Request → conversationService.createConversation()
→ Prisma Insert → Database → Response to Client
```

### Sending a Message (Streaming)
```
User Message → API Request → conversationService.addMessage()
→ Build AI Context → Redact Health Data (if consented)
→ OpenAI Stream → Server-Sent Events → Client
→ Save Assistant Response → Update Metrics
```

### Privacy Flow
```
Raw Health Data → redactHealthData()
→ Remove identifiers, generalize values
→ Build context prompt → Include in AI request
```

## Privacy & Security

### Privacy Safeguards

1. **Data Redaction:**
   - SSN patterns removed from user messages
   - Email addresses redacted
   - Phone numbers redacted
   - Health data generalized (e.g., "heart rate: 75 bpm" → "normal heart rate")

2. **Consent Checking:**
   - User/family member consent verified before using health data
   - Health context only included if `includeHealthContext` is true and consent exists

3. **Minimal Data Exposure:**
   - Health data aggregated (e.g., "3 medications" vs listing medications)
   - Pregnancy stage preserved as relevant medical context
   - Recent checkup status (yes/no) instead of exact dates

### Security Measures

1. **Rate Limiting:**
   - API-wide: 100 requests per 15 minutes
   - Chat endpoint: 10 messages per minute

2. **API Key Management:**
   - OpenAI key stored in environment variables
   - Never exposed to client

3. **Input Validation:**
   - Zod schemas for request validation
   - Max message length enforced
   - SQL injection prevention via Prisma ORM

4. **Error Handling:**
   - Sensitive errors logged server-side only
   - Generic error messages to client
   - Fallback responses for AI failures

## Monitoring & Metrics

### Tracked Metrics
- Total AI requests
- Success rate
- Average response time (ms)
- Token usage
- Error messages

### Logging
- AI request/response pairs
- Conversation metadata
- Error events with context

## Scalability Considerations

### Current Limitations
- In-memory rate limiting (not distributed)
- Single database connection
- No caching layer

### Future Improvements
- Redis for distributed rate limiting
- Database connection pooling
- Response caching for common queries
- Message queue for async processing
- Horizontal scaling with load balancer

## Testing Strategy

### Backend Tests
- Unit tests for privacy utils (sanitization, redaction)
- Service layer tests with mocked dependencies
- Integration tests for API endpoints

### Frontend Tests
- Component rendering tests
- User interaction tests
- Hook behavior tests
- Mock API responses

### Coverage Goals
- 70%+ code coverage
- Critical paths: 100% (privacy, security)

## Technology Choices

### Why React?
- Component reusability
- Strong TypeScript support
- Rich ecosystem
- Stream handling with fetch API

### Why Express?
- Lightweight and flexible
- Middleware ecosystem
- SSE support for streaming

### Why PostgreSQL?
- ACID compliance for health data
- JSON support for flexible schemas
- Mature and reliable

### Why Prisma?
- Type-safe database access
- Migration management
- Auto-generated TypeScript types

### Why OpenAI GPT-4?
- State-of-the-art language understanding
- Good medical knowledge base
- Streaming support
- Function calling capability (future use)

## Deployment Architecture

### Recommended Setup
```
┌─────────────────┐
│   CloudFlare    │  CDN + DDoS protection
└────────┬────────┘
         │
┌────────▼────────┐
│   React App     │  Static hosting (Vercel/Netlify)
│   (S3 + CF)     │
└────────┬────────┘
         │
┌────────▼────────┐
│   API Gateway   │  Rate limiting, auth
└────────┬────────┘
         │
┌────────▼────────┐
│  Express API    │  Container (ECS/K8s)
│   (Docker)      │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼──┐  ┌──▼────┐
│ RDS  │  │OpenAI │
│ PG   │  │ API   │
└──────┘  └───────┘
```

## Future Enhancements

1. **Authentication:**
   - JWT-based auth
   - OAuth integration
   - Role-based access control

2. **Real-time Features:**
   - WebSocket for typing indicators
   - Conversation sharing
   - Multi-user support

3. **Advanced AI Features:**
   - Image analysis (symptoms)
   - Voice input/output
   - Multi-language support
   - Specialized medical domain models

4. **Analytics:**
   - User engagement metrics
   - Conversation insights
   - A/B testing framework

5. **Compliance:**
   - HIPAA compliance measures
   - GDPR data export/deletion
   - Audit logging
   - Data retention policies
