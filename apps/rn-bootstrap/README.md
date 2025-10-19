# MyApp

A React Native application bootstrapped with TypeScript and modern tooling.

## Features

- ⚡️ React Native 0.82 with TypeScript
- 🎨 ESLint + Prettier configured
- 🧪 Jest + React Native Testing Library
- 🔧 Pre-commit hooks with Husky + lint-staged
- 📁 Clean project structure with path aliases
- 🎯 TypeScript path aliases for clean imports

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: >= 20.x
- **npm**: >= 9.x
- **Watchman**: Recommended for file watching (macOS/Linux)
- **Xcode**: >= 14.x (for iOS development)
- **CocoaPods**: >= 1.10 (for iOS dependencies)
- **Android Studio**: Latest stable (for Android development)
- **JDK**: Version 17 or higher

## Getting Started

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd MyApp
```

2. Install dependencies:

```bash
npm install
```

3. Install iOS dependencies (macOS only):

```bash
cd ios && pod install && cd ..
```

### Running the Application

#### iOS

```bash
npm run ios
```

Or open `ios/MyApp.xcworkspace` in Xcode and run from there.

#### Android

```bash
npm run android
```

Or open the `android` folder in Android Studio and run from there.

### Development Server

Start the Metro bundler:

```bash
npm start
```

## Project Structure

```
MyApp/
├── src/
│   ├── assets/         # Images, fonts, and other static assets
│   ├── components/     # Reusable UI components
│   ├── hooks/          # Custom React hooks
│   ├── navigation/     # Navigation configuration
│   ├── screens/        # Screen components
│   ├── services/       # API services and external integrations
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions and helpers
├── __tests__/          # Root level tests
├── android/            # Android native code
├── ios/                # iOS native code
├── .husky/             # Git hooks configuration
└── App.tsx             # Application entry point
```

## Available Scripts

### Development

- `npm start` - Start the Metro bundler
- `npm run android` - Run on Android emulator/device
- `npm run ios` - Run on iOS simulator/device

### Code Quality

- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint and auto-fix issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking

### Testing

- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report

## TypeScript Path Aliases

The project is configured with the following path aliases:

```typescript
import { Button } from '@components/Button';
import { HomeScreen } from '@screens/HomeScreen';
import { useToggle } from '@hooks/useToggle';
import { capitalize } from '@utils/index';
import type { User } from '@types/index';
```

Available aliases:

- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@screens/*` → `src/screens/*`
- `@navigation/*` → `src/navigation/*`
- `@services/*` → `src/services/*`
- `@utils/*` → `src/utils/*`
- `@hooks/*` → `src/hooks/*`
- `@types/*` → `src/types/*`
- `@assets/*` → `src/assets/*`

## Configuration

### Android

- **Application ID**: `com.myapp`
- **Minimum SDK**: 24 (Android 7.0)
- **Target SDK**: 36
- **Compile SDK**: 36

To change the application ID, update:

- `android/app/build.gradle` (namespace and applicationId)
- `android/app/src/main/AndroidManifest.xml`

### iOS

- **Bundle Identifier**: `org.reactjs.native.example.MyApp`
- **Minimum iOS Version**: 13.4
- **Deployment Target**: As specified in Podfile

To change the bundle identifier:

1. Open `ios/MyApp.xcworkspace` in Xcode
2. Select the project in the navigator
3. Update the Bundle Identifier in the General tab

## Git Hooks

Pre-commit hooks are configured with Husky to:

- Run ESLint on staged files
- Format code with Prettier
- Ensure code quality before commits

Hooks will run automatically on `git commit`. To skip hooks (not recommended):

```bash
git commit --no-verify
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Writing Tests

Tests are located next to the files they test in `__tests__` directories:

```
src/
  components/
    Button.tsx
    __tests__/
      Button.test.tsx
```

Example test:

```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '@components/Button';

describe('Button', () => {
  it('should render correctly', () => {
    const { getByText } = render(<Button onPress={() => {}} title="Press me" />);
    expect(getByText('Press me')).toBeTruthy();
  });
});
```

## Troubleshooting

### iOS

**Pods not installing:**

```bash
cd ios
rm -rf Pods Podfile.lock
pod install --repo-update
cd ..
```

**Build errors:**

```bash
cd ios
xcodebuild clean
cd ..
```

### Android

**Build errors:**

```bash
cd android
./gradlew clean
cd ..
```

**Metro bundler issues:**

```bash
npm start -- --reset-cache
```

### Common Issues

**Metro bundler port already in use:**

```bash
npx react-native start --port 8082
```

**Clear all caches:**

```bash
npm start -- --reset-cache
rm -rf node_modules
npm install
```

## Code Style

The project uses ESLint and Prettier for code formatting and linting:

- Single quotes for strings
- 2 spaces for indentation
- Trailing commas
- 100 character line width
- Arrow functions without parentheses for single parameters

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Create a pull request

## License

This project is licensed under the MIT License.

## Resources

- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
