# Project Architecture

## Overview

This React Native codebase establishes the foundational architecture for a scalable mobile application. The structure focuses on:

- Typed React Navigation stacks and tabs for onboarding and authenticated user flows.
- Redux Toolkit state management with persistence and RTK Query integration.
- A reusable theming system with light/dark modes and accessible design tokens.
- Shared UI primitives that consume the theme tokens.
- Environment-aware configuration, standardized networking, and mock data support.
- Instrumentation hooks for analytics and logging with clear extension points.

## Core Modules

### Navigation (`src/navigation`)
- **AppNavigator.tsx** wires together the root stack navigator with onboarding and authenticated tab flows.
- **types.ts** exports strongly typed route definitions used throughout the codebase.
- Navigation events trigger analytics screen tracking via the instrumentation layer.

### State Management (`src/state`)
- Configured with **Redux Toolkit** and **redux-persist** to store authentication and user profile slices in `AsyncStorage`.
- `authSlice` manages tokens, authentication state, and onboarding completion.
- `userSlice` holds profile data and exposes mutation helpers.
- `services/baseApi.ts` defines the shared RTK Query instance using a custom Axios base query.
- `services/userApi.ts` injects user-focused endpoints and exports generated hooks.
- Listener middleware synchronizes the Axios client's auth header on sign-in, sign-out, and store rehydration.

### Theming & UI (`src/theme`, `src/components/ui`)
- `ThemeProvider` exposes the active theme, color scheme, and navigation-compatible theme instance.
- Token files define color palettes, typography scales, spacing, and radii for both light and dark modes.
- UI primitives (`Button`, `Input`, `Card`, `Typography`) consume theme tokens and follow accessibility best practices.

### Screens (`src/screens`)
- Onboarding stack contains welcome, sign-in, and sign-up experiences that dispatch auth actions and instrument events.
- Authenticated tabs include Home, Profile, and Settings examples that demonstrate RTK Query data fetching, profile editing, theming controls, and configuration display.

### Configuration (`src/config`)
- `env.ts` centralizes the mapping of environment variables provided via `react-native-config` and exposes typed accessors.
- `.env.example` documents expected variables for local development.

### Networking (`src/services/api`)
- `apiClient.ts` exports a preconfigured Axios instance with request/response instrumentation and error normalization.
- `baseQuery.ts` adapts the Axios client for RTK Query while supporting optional mock responses through `mockData.ts`.
- `setAuthToken` keeps the client in sync with authentication state.

### Instrumentation (`src/instrumentation`)
- `analytics.ts` and `logger.ts` provide centralized placeholders for event tracking and structured logging.
- All navigation changes, network activity, and key user actions emit instrumentation events.

## Development Notes

- TypeScript configuration is aligned with React Native defaults, with custom type declarations for `react-native-config`.
- The entry point (`App.tsx`) composes providers for Safe Area, Redux, persistence, theming, and navigation.
- Shared utilities, such as consistent API error handling, live under `src/utils`.

## Next Steps

- Integrate real authentication and profile endpoints.
- Expand component library with additional primitives (lists, modals, etc.).
- Replace console-based instrumentation with production analytics/observability SDKs.
- Wire environment variables into CI/CD for each deployment target.
