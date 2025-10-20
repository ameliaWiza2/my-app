# Health Integration (Apple HealthKit and Android Fallback)

This document describes how to set up Apple HealthKit synchronization, implement selective write-back of pregnancy-related metrics, and provide graceful fallbacks for non-iOS platforms.

Scope implemented in this repo:
- A HealthService abstraction with permission handling, read APIs, and write-back helpers.
- Data parsing/mapping utilities with unit tests for weight, blood pressure, and steps.
- UI toggles in the Pregnancy Settings screen to enable health sync and write-back of pregnancy metrics.
- iOS Info.plist usage description keys added to the sample iOS app under apps/rn-bootstrap.

What you still need to do locally (native configuration):
- Install native libraries and enable HealthKit capability in the iOS project.
- Optionally, integrate Google Fit on Android or keep the provided no-op fallback.

---

## 1) Dependencies (optional but recommended)

We use a dynamic import pattern in JS to avoid hard failing tests when the native libs are missing. For actual device builds, install:

- iOS (Apple HealthKit):
  - react-native-health (or your preferred HealthKit bridge)

- Android (Google Fit):
  - react-native-google-fit (optional; we currently use a placeholder fallback)

Install commands:
- npm i react-native-health
- (optional) npm i react-native-google-fit
- cd ios && pod install

Note: CI may not build native apps here; these steps are for local development.

## 2) iOS Setup (HealthKit)

1. Enable HealthKit capability in Xcode for your iOS target:
   - Targets -> Signing & Capabilities -> + Capability -> HealthKit
   - Ensure an entitlements file (.entitlements) is created containing HealthKit keys.

2. Add usage descriptions to Info.plist:
   - NSHealthShareUsageDescription: Explain what and why you read.
   - NSHealthUpdateUsageDescription: Explain what and why you write.

We added these to the sample app at:
- apps/rn-bootstrap/ios/MyApp/Info.plist

Adjust wording as needed for your app.

3. Configure the HealthKit types you plan to read/write (weight, blood pressure, steps, pregnancy) in your bridge configuration.

## 3) Android Setup (Fallback / Google Fit)

By default, our HealthService returns no data on Android and write-back is disabled. This preserves parity in UX by exposing toggles that noop on Android.

Optional: integrate Google Fit
- Install react-native-google-fit
- Request ACTIVITY_RECOGNITION (and BODY_SENSORS where needed)
- Implement data reads for steps, weight (if available), and BP via connected devices or third-party libs

## 4) HealthService API

Location: src/services/health/HealthService.ts

- ensurePermissions(): Request appropriate permissions per-platform
- isSyncEnabled(), setSyncEnabled(enabled)
- isPregnancyWritebackEnabled(), setPregnancyWritebackEnabled(enabled)
- readMetrics({ weight, bloodPressure, steps, startDate, endDate })
- writePregnancyData({ lmpDate, edd, gestationalAgeWeeks }): iOS only; no-op elsewhere

Data parsing utilities:
- src/services/health/mappers.ts (unit-tested)

Types:
- src/services/health/types.ts

## 5) UI Toggles

We added two toggles in the pregnancy settings component:
- Sync health data (Apple Health / Google Fit)
- Write pregnancy data back to Health (iOS only)

File: src/components/SettingsPregnancySection.tsx

Behavior:
- Enabling sync triggers permission requests. If denied, the toggle reverts and an alert is shown.
- Write-back requires write permission on iOS. It is stored per-platform in secure storage.

## 6) Testing

- Unit tests for parsing logic are under src/services/health/__tests__/parsing.test.ts
- They validate conversion from raw samples into normalized app-level metrics (kg, mmHg, count).

Run:
- npm test

## 7) Privacy and Consent

- SecureStorage persists per-platform consent and toggles.
- You are responsible for respecting user consent in actual data operations and for presenting clear, accessible rationale to the user.

## 8) Future Enhancements

- Implement full Google Fit integration
- Add background sync scheduling and conflict resolution
- Store ingested samples in local DB for analytics/history
- Localization of permission rationale and settings copy
