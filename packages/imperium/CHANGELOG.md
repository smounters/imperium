# Changelog

All notable changes to `@smounters/imperium` are documented in this file.

## 1.1.3 - 2026-03-30

### Added
- VitePress documentation for `@smounters/imperium-cron` and `@smounters/imperium-events`.
- Integration tests (16 tests across HTTP, guards, WebSocket, lifecycle).
- ESM compatibility: all relative imports use `.js` extensions.

### Changed
- Migrated to `typescript-eslint` unified package with type-checked rules.
- Modernized ESLint config (`recommendedTypeChecked` + `stylisticTypeChecked`).
- Fixed floating promises, redundant types, unused imports.
- Rewritten README for external users.
- Monorepo restructure with pnpm workspaces.

## 1.1.0 - 2026-03-29

### Added
- **Server Streaming RPC** — `async function*` handlers via ConnectRPC. Delivered as SSE (Server-Sent Events) in browsers without WebSocket.
- **`@RpcAbortSignal()` decorator** — injects `AbortSignal` from `HandlerContext.signal` for detecting client disconnects in streaming handlers.
- **WebSocket Gateway** — real-time bidirectional communication via `@fastify/websocket` (optional peer dependency).
  - `@WsGateway(path)` — marks a class as a WebSocket gateway, registers on the specified path.
  - `@WsHandler(messageType)` — routes incoming JSON messages by `type` field.
  - `@WsConnection()`, `@WsMessage()`, `@WsRequest()` — parameter decorators for handler methods.
  - Lifecycle hooks: `onConnection(socket, req)`, `onDisconnect(socket)`.
  - Guards execute at connection time (upgrade request).
- **`./ws` subpath export** — `@smounters/imperium/ws` exposes `registerWsGateways`, `WsGatewayLifecycle`, and related types.
- `BaseContext` extended with `type: "ws"`, `switchToWs()`, and `WsArgumentsHost` interface.

### Changed
- `ContextType` is now `"http" | "rpc" | "ws"` (was `"http" | "rpc"`).
- `RpcParamSource` extended with `"abort_signal"`.
- RPC router builder no longer throws on `server_streaming` methods; only `client_streaming` and `bidi_streaming` are unsupported.
- `WsArgumentsHost` methods return `| undefined` for type safety across context switches (no unsafe casts).
- Peer dependency `@fastify/websocket ^11.0.0` added as optional.

### Updated
- `@types/node` 24.x → 25.x.
- `@typescript-eslint/*` 8.56 → 8.57.
- `eslint` 10.0 → 10.1.
- `fastify` 5.7 → 5.8.

## 1.0.3 - 2026-03-20

### Fixed
- Controller handler methods now correctly bind `this` to the controller instance.

### Changed
- Config examples use exported `appConfigSchema` instead of inline definitions.
- Package exports restricted to subpath-only; added `prepack` build enforcement.
- Added ESLint and Prettier tooling.

### CI
- Publish workflow consolidated into single tag-based `publish.yml` with GitHub Release creation.
- npm publish via classic `NPM_TOKEN` secret.

## 0.1.0 - 2026-02-22

- Initial public package setup.
- Unified HTTP + ConnectRPC runtime on Fastify.
- NestJS-inspired module/decorator/DI API.
- Typed `Application` bootstrap with pre-start `configureConfig` and `configureLogger`.
- Multi provider intent metadata (`multi`) and array resolution via `InjectAll` / `resolveAll`.
- VitePress documentation and GitHub Pages workflow.
- npm publish workflow with `pnpm`.
