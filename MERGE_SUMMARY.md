Merge Report: Consolidation of remote branches into main

Date: 2025-10-19 (UTC)

Overview
- Multiple remote branches contained distinct applications (React Native mobile, Vite/React web apps, and a full-stack client/server app).
- To preserve all work and keep main stable with CI, we:
  1) Squash-merged hardening-qa-release-readiness into main at the repository root (enables CI for tests/lint/e2e and Android/iOS builds).
  2) Imported all remaining branches under apps/ as separate subprojects using a squash-like archive import to avoid cross-project conflicts while preserving content.

Branches handled
- Root app via squash merge: hardening-qa-release-readiness
- Imported under apps/ subdirectories:
  - chore/bootstrap-react-native-ts-tooling -> apps/rn-bootstrap/
  - feat-core-architecture-navigation-state-theme-ui-foundation -> apps/rn-core/
  - feat/auth-family-onboarding -> apps/rn-auth-onboarding/
  - feat-ui-enhance-dark-mode -> apps/task-center-dark-mode/
  - feat/family-task-center-assignments-notifications -> apps/task-center/
  - feat-ai-health-chat-integration -> apps/ai-health-chat/

Remote cleanup
- Deleted remote branches after import: chore/bootstrap-react-native-ts-tooling, feat-core-architecture-navigation-state-theme-ui-foundation, feat/auth-family-onboarding, feat-ui-enhance-dark-mode, feat/family-task-center-assignments-notifications, hardening-qa-release-readiness, feat-ai-health-chat-integration.

Validation
- CI from the root app is now active on main. iOS/Android, lint, tests, and e2e will run in GitHub Actions for pushes to main.

Next steps (optional)
- Consider adopting a monorepo tool (e.g., Turborepo/Nx/Yarn workspaces) and adding selective CI for apps/* as needed.
