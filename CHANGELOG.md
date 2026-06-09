# Changelog

All notable changes to the **Ecoventra** climate-tech web application will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-06-09

### Added
- **AI Coach Chat Accessibility Hooks**: Implemented standard `aria-label` elements and `role="form"` wrapping triggers on chat prompts, inputs, and submission buttons in `CoachChat.tsx`.
- **Comprehensive Vitest Integration Suite**: Added a robust automated testing suite mapping 6 separate coverage targets including rendering pipelines, sub-context switches, and multi-step forms.
- **Mock File Database Sanitizers**: Added automated type validation guards, payload structure checks, and strict entity-presence tests on database save controllers in `server.ts` to block corrupted data writes and spoofing attempts.

### Changed
- **Vite Multi-Environment Test Suite Alignment**: Adjusted theme contexts, viewport mocks, and container layout target queries in vitest setup frameworks to support consistent test validations under JSDOM.

### Security
- **Express Custom Headers & Content Security Policy (CSP)**: Added explicit inline middleware configurations in `server.ts` enforcing `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `X-XSS-Protection: 1; mode=block`, and restrictive `Content-Security-Policy` limits on external frames.

---

## [1.1.0] - 2026-06-09

### Added
- **Skip-To-Content Accessibility Jump Links**: Added standard keyboard navigation focus jump cards and keyboard-navigable containers in `Layout.tsx` to optimize screen reader journeys.
- **Alternative Graphical Tables**: Introduced hidden automated HTML data charts tables inside `DashboardAnalytics.tsx` to enable screen readers to parse carbon emission vectors.

---

## [1.0.0] - 2026-06-08

### Added
- **Initial Core Climate-Tech Canvas MVP**: Bootstrapped basic Apple/Stripe-styled dashboards, multi-step carbon calculators, AI roadmaps, and goal management engines.
