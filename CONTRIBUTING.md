# Contributing Guide

Thank you for your interest in contributing to the AI Health Consultation System!

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/repo-name.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Follow the [SETUP.md](SETUP.md) guide to set up your development environment

## Development Workflow

### 1. Make Your Changes

- Write clean, readable code
- Follow existing code style
- Add comments only for complex logic
- Keep functions small and focused

### 2. Test Your Changes

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

### 3. Commit Your Changes

Follow conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(chat): add message editing capability
fix(privacy): correct SSN redaction pattern
docs(readme): update installation instructions
```

### 4. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub with:
- Clear description of changes
- Screenshots/GIFs for UI changes
- Reference to related issues

## Code Style Guidelines

### TypeScript

- Use TypeScript strict mode
- Define interfaces for all data structures
- Avoid `any` type unless absolutely necessary
- Use meaningful variable names

**Example:**
```typescript
// ✅ Good
interface UserMessage {
  content: string;
  timestamp: Date;
}

// ❌ Bad
interface Msg {
  c: string;
  t: any;
}
```

### React

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Props should be well-typed interfaces

**Example:**
```typescript
// ✅ Good
interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  // Component implementation
};

// ❌ Bad
export const ChatInput = (props: any) => {
  // Component implementation
};
```

### File Organization

```
component-name/
├── ComponentName.tsx          # Component logic
├── ComponentName.test.tsx     # Tests
└── ComponentName.styles.ts    # Styles (if extracted)
```

### Naming Conventions

- **Components:** PascalCase (`ChatWindow`)
- **Hooks:** camelCase with "use" prefix (`useConversations`)
- **Functions:** camelCase (`sendMessage`)
- **Constants:** UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Interfaces:** PascalCase (`ConversationProps`)

## Testing Guidelines

### Write Tests For

- All new features
- Bug fixes (regression tests)
- Edge cases
- Error handling
- Privacy/security functions

### Test Structure

```typescript
describe('ComponentName', () => {
  describe('when condition', () => {
    it('should do expected behavior', () => {
      // Arrange
      const props = { /* ... */ };
      
      // Act
      render(<ComponentName {...props} />);
      
      // Assert
      expect(screen.getByText('Expected')).toBeInTheDocument();
    });
  });
});
```

### Coverage Requirements

- Minimum 70% overall coverage
- 100% for privacy/security functions
- All critical user flows covered

## Pull Request Process

### Before Submitting

- [ ] Tests pass locally
- [ ] Code follows style guidelines
- [ ] New tests added for new features
- [ ] Documentation updated if needed
- [ ] No console.log statements
- [ ] No commented-out code

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how you tested your changes

## Screenshots
If applicable, add screenshots

## Checklist
- [ ] Tests pass
- [ ] Documentation updated
- [ ] Code follows style guide
```

### Review Process

1. Automated checks run (tests, linting)
2. Code review by maintainer(s)
3. Address feedback
4. Approval and merge

## Privacy & Security Considerations

### Data Privacy

- Never log sensitive user data
- Always redact identifiers (SSN, email, phone)
- Get explicit consent before using health data
- Follow HIPAA guidelines

### Security

- Never commit API keys or secrets
- Use environment variables for configuration
- Validate all user input
- Sanitize data before sending to AI
- Implement rate limiting

**Example - DON'T DO THIS:**
```typescript
// ❌ Bad - logs sensitive data
console.log('User health data:', healthData);

// ❌ Bad - includes API key
const apiKey = 'sk-1234567890';
```

**Example - DO THIS:**
```typescript
// ✅ Good - redacts data
const redacted = redactHealthData(healthData);
console.log('Redacted health context:', redacted);

// ✅ Good - uses environment variable
const apiKey = process.env.OPENAI_API_KEY;
```

## Common Tasks

### Adding a New API Endpoint

1. Define route in `server/src/routes/`
2. Implement service logic in `server/src/services/`
3. Add TypeScript types in `server/src/types/`
4. Write tests
5. Update API documentation

### Adding a New Component

1. Create component file in `client/src/components/`
2. Define TypeScript interface for props
3. Implement component logic
4. Write tests in `__tests__/` subdirectory
5. Export component

### Updating Database Schema

1. Modify `server/prisma/schema.prisma`
2. Create migration: `npx prisma migrate dev --name description`
3. Update TypeScript types
4. Update seed data if needed
5. Test migration

## Getting Help

- Check existing issues on GitHub
- Read the [ARCHITECTURE.md](ARCHITECTURE.md) document
- Ask questions in pull request comments
- Join our community discussions

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Give constructive feedback
- Focus on what is best for the community

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
