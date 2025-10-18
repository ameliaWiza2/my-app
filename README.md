# Mobile App - Cross-Platform React Native Application

A production-ready React Native mobile application with comprehensive security, testing, and accessibility features.

## Features

- 🔒 **Security First**: HTTPS enforcement, secure storage, input sanitization
- ✅ **Comprehensive Testing**: Unit, integration, and E2E tests with high coverage
- 🌍 **Internationalization**: Multi-language support with i18next
- ♿ **Accessibility**: Full VoiceOver/TalkBack compliance
- 🔐 **Privacy**: Permission rationale screens and privacy policy integration
- 🚀 **CI/CD**: Automated testing and building with GitHub Actions
- 📱 **Cross-Platform**: iOS and Android support

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- React Native development environment:
  - For iOS: Xcode 14+, CocoaPods
  - For Android: Android Studio, JDK 17

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd mobile-app

# Install dependencies
npm install

# iOS only: Install CocoaPods dependencies
cd ios && pod install && cd ..
```

## Running the App

```bash
# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## Testing

### Unit Tests
```bash
# Run all unit tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm test -- --watch
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
# iOS
npm run test:e2e:ios

# Android
npm run test:e2e:android
```

## Development

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Check formatting
npm run format:check

# Format code
npm run format

# Type check
npm run type-check
```

### Security Audit

```bash
npm run security-audit
```

## Project Structure

```
mobile-app/
├── .github/
│   └── workflows/          # CI/CD workflows
├── android/                # Android native code
├── ios/                    # iOS native code
├── e2e/                    # End-to-end tests
├── src/
│   ├── components/         # React components
│   ├── config/             # Configuration files
│   ├── locales/            # Internationalization
│   ├── screens/            # Screen components
│   ├── services/           # Business logic and API
│   ├── utils/              # Utility functions
│   └── __tests__/          # Test files
├── package.json
├── tsconfig.json
└── RELEASE_NOTES.md        # Comprehensive release documentation
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
API_BASE_URL=https://api.example.com
ENVIRONMENT=development
```

### Security Configuration

Edit `src/config/security.ts` to configure:
- Allowed API domains
- HTTPS enforcement
- Certificate pinning
- Token expiry settings

## Building for Production

### iOS

```bash
cd ios
xcodebuild -workspace MobileApp.xcworkspace \
  -scheme MobileApp \
  -configuration Release \
  -archivePath MobileApp.xcarchive \
  archive
```

### Android

```bash
cd android
./gradlew assembleRelease
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Ensure all tests pass
4. Submit a pull request

## CI/CD

Automated workflows run on every push and pull request:
- ✅ Linting and type checking
- ✅ Unit and integration tests
- ✅ iOS and Android builds
- ✅ E2E tests (scheduled)
- ✅ Security audits (weekly)

## Documentation

- [Release Notes](./RELEASE_NOTES.md) - Comprehensive release documentation
- [API Documentation](./docs/API.md) - API integration guide
- [Security Guide](./docs/SECURITY.md) - Security best practices
- [Accessibility Guide](./docs/ACCESSIBILITY.md) - Accessibility compliance

## License

[Your License Here]

## Support

For issues and questions, please open an issue on GitHub.
