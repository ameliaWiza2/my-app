# Contributing to MyApp

Thank you for your interest in contributing to MyApp! This document provides guidelines and instructions for contributing to this project.

## Development Setup

### Prerequisites

Ensure you have all the prerequisites listed in the README.md installed before proceeding.

### Initial Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/MyApp.git
   cd MyApp
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. For iOS development, install pods:
   ```bash
   cd ios && pod install && cd ..
   ```

## Development Workflow

### Creating a New Feature

1. Create a new branch from `main`:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our code style guidelines

3. Add tests for your changes

4. Run tests and ensure they pass:

   ```bash
   npm test
   npm run type-check
   npm run lint
   ```

5. Commit your changes (pre-commit hooks will run automatically):

   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

6. Push to your fork:

   ```bash
   git push origin feature/your-feature-name
   ```

7. Open a Pull Request

## Code Style

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type unless absolutely necessary
- Use path aliases for imports (e.g., `@components/Button`)

### React Native

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use StyleSheet.create for styles

### File Naming

- Components: PascalCase (e.g., `Button.tsx`, `HomeScreen.tsx`)
- Utilities/Hooks: camelCase (e.g., `useToggle.ts`, `formatDate.ts`)
- Test files: Same name as the file being tested with `.test.tsx` extension

### Component Structure

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MyComponentProps {
  title: string;
  onPress: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title, onPress }) => {
  return (
    <View style={styles.container}>
      <Text>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

## Testing

### Writing Tests

- Place tests in `__tests__` directories next to the code they test
- Use descriptive test names
- Follow the AAA pattern: Arrange, Act, Assert
- Mock external dependencies

### Test Coverage

- Aim for at least 80% code coverage
- All new features should include tests
- Bug fixes should include regression tests

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - A new feature
- `fix:` - A bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, missing semicolons, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:

```
feat: add user authentication
fix: resolve crash on profile screen
docs: update installation instructions
test: add tests for Button component
```

## Pull Request Process

1. Ensure all tests pass
2. Update documentation if needed
3. Add a clear description of the changes
4. Link any related issues
5. Request review from maintainers

### Pull Request Checklist

- [ ] Tests pass locally
- [ ] Code follows project style guidelines
- [ ] New code has appropriate test coverage
- [ ] Documentation updated (if needed)
- [ ] Commit messages follow conventions
- [ ] No console warnings or errors
- [ ] TypeScript compilation passes

## Project Structure

When adding new features, follow the established project structure:

- **Components**: Reusable UI components in `src/components/`
- **Screens**: Full screen components in `src/screens/`
- **Hooks**: Custom React hooks in `src/hooks/`
- **Utils**: Utility functions in `src/utils/`
- **Types**: TypeScript type definitions in `src/types/`
- **Services**: API and external service integrations in `src/services/`

## Questions?

If you have questions or need help:

1. Check the README.md
2. Search existing issues
3. Create a new issue with the `question` label

Thank you for contributing! 🎉
