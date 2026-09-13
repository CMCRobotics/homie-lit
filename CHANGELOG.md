# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.8.0] - 2026-09-13

### Changed

- Migrated from Node to Bun.js :
    - Migrated the complete build, bundling, and testing pipeline from Webpack and Jest to **Bun**.
    - Replaced Webpack Dev Server with a fast, lightweight native static file server based on `Bun.serve` (`server.ts`).
    - Replaced Jest and `ts-jest` with Bun's built-in fast test runner (`bun test`).
    - Configured automatic `"prepare": "bun run build"` in `package.json` so that the library dynamically compiles the `dist/` directory on installation when referenced via GitHub-style URLs.
    - Safely encapsulated browser bundles (`dist/homie-lit.js` and `dist/homie-lit.min.js`) in self-executing IIFE wrappers, preventing global scope pollution while cleanly exposing `window.HomieLit`.
    - Modified TypeScript compilation (`tsconfig.json`) to isolate type-declaration generation (`.d.ts`) strictly to source directories, improving reliability.

### Fixed

- Resolved critical compilation errors in `PropertyBindingManager.ts` (making `observer` constructor argument optional) and `HomieNodeComponent.ts` (calling correct `bindPath` method).
- Corrected a long-standing assertion bug in `integrationtest/HomieObserver.integration.test.ts` where the update subscriber incorrectly expected the initial state instead of the updated value.


## [0.7.4] - 2025-12-11

### Added

- `onConnect` and `onDisconnect` subjects to `HomieObserver` to notify observers of MQTT connection and disconnection events.
- `connected$` and `disconnected$` observables to `HomieObserver` to allow external code to subscribe to these events.
