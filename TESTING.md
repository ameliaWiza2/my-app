# Testing Guide

This document outlines the testing strategy and how to run tests for the AI Health Consultation System.

## Overview

The project includes unit tests, integration tests, and component tests to ensure reliability and correctness.

## Backend Tests

### Running Backend Tests

```bash
cd server
npm test                # Run all tests with coverage
npm run test:watch      # Run tests in watch mode
```

### Test Coverage

The backend aims for 70%+ code coverage with critical paths (privacy, security) at 100%.

### Test Structure

```
server/src/
├── services/
│   └── __tests__/
│       └── aiService.test.ts
└── utils/
    └── __tests__/
        └── privacy.test.ts
```

### Privacy Tests (`privacy.test.ts`)

**What's Tested:**
- Health data redaction
- Context prompt building
- User message sanitization
- SSN/email/phone number redaction

**Example:**
```typescript
describe('sanitizeUserMessage', () => {
  it('should redact SSN patterns', () => {
    const message = 'My SSN is 123-45-6789';
    const sanitized = sanitizeUserMessage(message);
    expect(sanitized).toBe('My SSN is [REDACTED]');
  });
});
```

### AI Service Tests (`aiService.test.ts`)

**What's Tested:**
- Fallback response generation
- Error handling
- Prompt construction (via integration tests)

**Key Test Cases:**
- Fallback message contains emergency guidance
- Fallback message acknowledges service issues

### Future Backend Tests

**Planned Coverage:**
- API endpoint integration tests
- Database operations
- Rate limiter behavior
- Metrics aggregation
- Streaming response handling

## Frontend Tests

### Running Frontend Tests

```bash
cd client
npm test                # Run all tests
npm run test:watch      # Run tests in watch mode
```

### Test Structure

```
client/src/
├── components/
│   └── __tests__/
│       ├── ChatMessage.test.tsx
│       └── ChatInput.test.tsx
└── App.test.tsx
```

### Component Tests

#### ChatMessage Tests (`ChatMessage.test.tsx`)

**What's Tested:**
- User message rendering
- Assistant message rendering
- Health context indicator display
- Message styling differences

**Key Test Cases:**
```typescript
it('shows health data indicator when usedHealthData is true', () => {
  const message = {
    id: '1',
    role: 'assistant',
    content: 'Based on your health data...',
    usedHealthData: true,
    createdAt: new Date().toISOString(),
  };
  
  render(<ChatMessage message={message} />);
  expect(screen.getByText(/Response includes your health context/i))
    .toBeInTheDocument();
});
```

#### ChatInput Tests (`ChatInput.test.tsx`)

**What's Tested:**
- Input and button rendering
- Message sending functionality
- Health context toggle
- Disabled state handling
- Empty input validation

**Key Test Cases:**
- Send button disabled when input empty
- onSend callback called with correct parameters
- Health context checkbox toggle
- Input disabled when disabled prop is true

#### App Tests (`App.test.tsx`)

**What's Tested:**
- Initial render state
- Welcome message display
- New conversation button presence

### Future Frontend Tests

**Planned Coverage:**
- Hook tests (useConversations, useChat)
- API service mocking
- Streaming message handling
- Pagination component
- ConversationList interactions
- Error state rendering
- Loading state rendering

## Integration Testing

### Manual Testing Checklist

#### User Flow Tests

**Create Conversation:**
1. ✅ Click "New Conversation"
2. ✅ Enter conversation title
3. ✅ Verify conversation appears in list
4. ✅ Verify conversation is selected

**Send Message:**
1. ✅ Type message in input
2. ✅ Click Send (or press Enter)
3. ✅ Verify user message appears
4. ✅ Verify loading indicator shows
5. ✅ Verify AI response streams in
6. ✅ Verify response is complete

**Health Context:**
1. ✅ Toggle health context checkbox off
2. ✅ Send message
3. ✅ Verify response doesn't show health indicator
4. ✅ Toggle checkbox on
5. ✅ Send message
6. ✅ Verify response shows health indicator

**Pagination:**
1. ✅ Create 21+ conversations (if pageSize=20)
2. ✅ Verify pagination controls appear
3. ✅ Click Next page
4. ✅ Verify new conversations load
5. ✅ Click Previous page
6. ✅ Verify original conversations show

**Delete Conversation:**
1. ✅ Click Delete on conversation
2. ✅ Confirm deletion
3. ✅ Verify conversation removed from list
4. ✅ If selected, verify main area resets

#### Privacy Tests

**Data Redaction:**
1. ✅ Send message with SSN (123-45-6789)
2. ✅ Verify AI response doesn't echo SSN
3. ✅ Send message with email
4. ✅ Verify email is redacted
5. ✅ Send message with phone number
6. ✅ Verify phone is redacted

**Health Context:**
1. ✅ Enable health context
2. ✅ Verify AI mentions general health info, not specifics
3. ✅ Verify no specific medication names in prompt logs

#### Error Handling

**Network Errors:**
1. ✅ Disable backend
2. ✅ Try to send message
3. ✅ Verify error message displays
4. ✅ Verify fallback response shown

**Rate Limiting:**
1. ✅ Send 11 messages rapidly
2. ✅ Verify rate limit error on 11th
3. ✅ Wait 1 minute
4. ✅ Verify messages work again

**Invalid API Key:**
1. ✅ Set invalid OPENAI_API_KEY
2. ✅ Send message
3. ✅ Verify fallback response
4. ✅ Verify error logged server-side

## Testing Best Practices

### Writing New Tests

1. **Arrange, Act, Assert:**
   ```typescript
   // Arrange: Set up test data
   const message = createTestMessage();
   
   // Act: Perform action
   render(<ChatMessage message={message} />);
   
   // Assert: Verify outcome
   expect(screen.getByText(message.content)).toBeInTheDocument();
   ```

2. **Test Behavior, Not Implementation:**
   - Focus on what users see and do
   - Avoid testing internal state
   - Test public APIs

3. **Use Descriptive Test Names:**
   ```typescript
   // ✅ Good
   it('shows error message when API request fails', () => {})
   
   // ❌ Bad
   it('test 1', () => {})
   ```

4. **Keep Tests Isolated:**
   - No shared state between tests
   - Mock external dependencies
   - Clean up after each test

5. **Test Edge Cases:**
   - Empty states
   - Maximum values
   - Null/undefined
   - Error conditions

### Mocking

**API Calls:**
```typescript
jest.mock('../services/api', () => ({
  sendMessage: jest.fn().mockResolvedValue({ content: 'Mocked response' }),
}));
```

**Timers:**
```typescript
jest.useFakeTimers();
// ... test code
jest.runAllTimers();
jest.useRealTimers();
```

## Performance Testing

### Load Testing Scenarios

**Concurrent Users:**
- 10 users sending messages simultaneously
- 100 users browsing conversations
- Verify response times < 2s

**Large Datasets:**
- 1000+ conversations per user
- Verify pagination performance
- Verify query optimization

**Streaming:**
- Long AI responses (1000+ tokens)
- Verify smooth streaming
- Verify memory doesn't leak

## Accessibility Testing

### Manual Checks

1. ✅ Keyboard navigation works
2. ✅ Focus indicators visible
3. ✅ Screen reader compatible
4. ✅ Color contrast sufficient
5. ✅ Error messages announced

### Automated Tools

- axe DevTools
- Lighthouse accessibility audit
- WAVE browser extension

## CI/CD Testing

### Pre-commit Checks

```bash
# Lint
npm run lint

# Type check
tsc --noEmit

# Tests
npm test
```

### Pre-push Checks

```bash
# Full test suite
npm test

# Build verification
npm run build
```

### CI Pipeline (GitHub Actions Example)

```yaml
- name: Run tests
  run: |
    cd server && npm test
    cd ../client && npm test

- name: Check coverage
  run: |
    cd server && npm test -- --coverage --coverageThreshold='{"global":{"branches":70,"functions":70,"lines":70,"statements":70}}'
```

## Debugging Tests

### Common Issues

**Test Timeout:**
```typescript
// Increase timeout for slow tests
jest.setTimeout(10000); // 10 seconds
```

**Async Issues:**
```typescript
// Use waitFor for async updates
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});
```

**State Not Updating:**
```typescript
// Use act() for state updates
import { act } from '@testing-library/react';

act(() => {
  // Trigger state change
});
```

## Test Maintenance

### When to Update Tests

- Feature changes
- Bug fixes
- API changes
- Refactoring (if tests break)

### When to Add Tests

- New features
- Bug fixes (add regression test)
- Critical user flows
- Security-sensitive code

### When to Remove Tests

- Removed features
- Redundant coverage
- Tests that don't add value

## Monitoring Test Health

### Metrics to Track

- Test execution time
- Flaky test frequency
- Coverage trends
- Test-to-code ratio

### Red Flags

- Tests frequently failing/passing randomly (flaky)
- Tests take > 5 minutes to run
- Coverage dropping below threshold
- Tests not catching bugs
