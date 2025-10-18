# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.1] - 2024-10-18

### Added

- Initial React Native project setup with TypeScript
- Project structure with organized directories:
  - `src/components/` for reusable UI components
  - `src/screens/` for screen components
  - `src/hooks/` for custom React hooks
  - `src/navigation/` for navigation configuration
  - `src/services/` for API services
  - `src/utils/` for utility functions
  - `src/types/` for TypeScript type definitions
  - `src/assets/` for static assets
- TypeScript path aliases for clean imports
- ESLint configuration with React Native, TypeScript, and React Hooks plugins
- Prettier for code formatting
- Jest with React Native Testing Library
- Husky and lint-staged for pre-commit hooks
- Example components:
  - Button component with tests
  - HomeScreen component
- Example utilities:
  - capitalize and isValidEmail functions with tests
- Example custom hooks:
  - useToggle hook with tests
- API service class example
- Comprehensive README with setup instructions
- CONTRIBUTING.md with contribution guidelines
- EditorConfig for consistent editor configuration
- Environment variable template (.env.example)

### Configured

- Android project with minimum SDK 24, target SDK 36
- iOS project with minimum iOS 13.4
- Metro bundler configuration
- Babel with module-resolver plugin for path aliases
- Git hooks for automated linting and formatting on commit
