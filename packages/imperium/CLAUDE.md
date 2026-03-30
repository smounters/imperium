# @smounters/imperium

Core framework package. Part of the [imperium monorepo](../../CLAUDE.md).

## What this package is

NestJS-like modular DI container with unified HTTP + ConnectRPC + WebSocket server for TypeScript.

- **npm:** `@smounters/imperium` (v1.1.2)
- **Runtime:** Node.js >=20.0.0, ESM only
- **Zero runtime dependencies** — all deps are peer (fastify, connectrpc, tsyringe, zod, tslog)

## Subpath exports (no root import)

```ts
import { Application } from "@smounters/imperium/core";
import { Module, Injectable, HttpController, Get, RpcService, RpcMethod, RpcAbortSignal, WsGateway, WsHandler } from "@smounters/imperium/decorators";
import { ZodPipe } from "@smounters/imperium/pipes";
import { ConfigService, LoggerService } from "@smounters/imperium/services";
import { appConfigSchema } from "@smounters/imperium/validation";
import { registerWsGateways } from "@smounters/imperium/ws";
```

## Key architecture

- **Module system:** `@Module({ providers, controllers, httpControllers, imports, exports, global })`
- **DI:** tsyringe-based, singleton by default, request-scoped via AsyncLocalStorage
- **Request lifecycle:** Guards → Pipes → Interceptors → Handler → Filters (same for HTTP, RPC, WS)
- **Transport:** HTTP (Fastify), RPC unary + server streaming (ConnectRPC), WebSocket (@fastify/websocket optional)
- **BaseContext:** unified `switchToHttp()` / `switchToRpc()` / `switchToWs()`
- **Interceptors** do NOT apply to streaming RPC or WebSocket — by design

## Tests

22 integration tests in `tests/`:
- `http.test.ts` — GET/POST, query/path params, prefix
- `guards-pipes.test.ts` — class guards, global APP_GUARD
- `ws.test.ts` — ping/pong, echo, guard reject/allow
- `lifecycle.test.ts` — onModuleInit, onModuleDestroy

## Current limitations

- Only unary + server streaming RPC — client/bidi streaming throw
- `Constructor<T>` uses `any[]` (tsyringe requirement)

## Package-specific commands

```bash
pnpm --filter @smounters/imperium run typecheck
pnpm --filter @smounters/imperium run test
pnpm --filter @smounters/imperium run build
pnpm --filter @smounters/imperium run docs:dev
```

## Publishing

Tag `vX.Y.Z` from repo root. Before tagging:
1. Update CHANGELOG.md in this directory
2. Update VitePress docs if API changed
3. Verify: `pnpm run typecheck && pnpm run test && pnpm run docs:build`
