# Changelog

## 0.1.0 - 2026-03-30

- Initial release.
- `@OnEvent(pattern)` method decorator with wildcard support.
- `EventModule.register({ listeners })` dynamic module.
- `EventService` with `emit()` and `getHandlers()`.
- Concurrent handler execution with per-handler error isolation.
- Zero runtime dependencies.
