# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.7.4] - 2025-12-11

### Added

- `onConnect` and `onDisconnect` subjects to `HomieObserver` to notify observers of MQTT connection and disconnection events.
- `connected$` and `disconnected$` observables to `HomieObserver` to allow external code to subscribe to these events.
