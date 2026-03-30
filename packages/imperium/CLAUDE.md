# @smounters/imperium

NestJS-like modular DI container with unified HTTP + ConnectRPC server for TypeScript.

## Package Overview

- **Published:** `@smounters/imperium` on npm (v1.0.3)
- **Runtime:** Node.js >=20.0.0, ESM only (ES2022)
- **Zero runtime dependencies** — all deps are peer (fastify, connectrpc, tsyringe, zod, tslog)
- **Author:** Sergio (@smounters)

## Exports (subpath only, no root import)

```ts
import { Application } from "@smounters/imperium/core";
import { Module, Injectable, RpcService, RpcMethod, RpcAbortSignal, HttpController, Get, WsGateway, WsHandler } from "@smounters/imperium/decorators";
import { ZodPipe } from "@smounters/imperium/pipes";
import { ConfigService, LoggerService } from "@smounters/imperium/services";
import { appConfigSchema } from "@smounters/imperium/validation";
import { registerWsGateways } from "@smounters/imperium/ws";
```

## Source Structure

```
src/
├── core/
│   ├── application.ts       — Application class (entry point, lifecycle, options)
│   ├── container.ts         — AppContainer (DI engine, module loading, request scoping)
│   ├── server.ts            — Fastify server factory, route registration, hooks
│   ├── errors.ts            — HttpException hierarchy + HTTP↔ConnectRPC error mapping
│   ├── logger.ts            — Logger factory (tslog), LOGGER_TOKEN
│   ├── config.ts            — CONFIG_TOKEN
│   ├── app-tokens.ts        — APP_GUARD, APP_INTERCEPTOR, APP_PIPE, APP_FILTER
│   ├── reflector.ts         — Metadata reflection utility
│   └── types.ts             — HttpRouteMeta, RpcMethodDescriptor, param metadata types
├── decorators/
│   ├── di.decorators.ts     — @Module, @Injectable, @Inject, @InjectAll, @Optional, @Scope
│   ├── http.decorators.ts   — @HttpController, @Get/@Post/@Put/@Patch/@Delete, @Body/@Query/@Param/@Header/@Req/@Res
│   ├── rpc.decorators.ts    — @RpcService, @RpcMethod, @RpcData, @RpcContext, @RpcHeaders, @RpcHeader, @RpcAbortSignal
│   ├── guards.decorators.ts — @UseGuards
│   ├── interceptors.decorators.ts — @UseInterceptors
│   ├── pipes.decorators.ts  — @UsePipes
│   ├── filters.decorators.ts — @Catch, @UseFilters
│   ├── ws.decorators.ts     — @WsGateway, @WsHandler, @WsConnection, @WsMessage, @WsRequest
│   └── metadata.decorators.ts — @SetMetadata, appendArrayMetadata
├── http/
│   ├── adapter.ts           — createHttpHandler() — param extraction, guard/pipe/interceptor/filter chain
│   ├── router-builder.ts    — registerHttpRoutes() — reads metadata, registers Fastify routes
│   └── utils.ts             — collectGuards/Pipes/Interceptors/Filters for HTTP
├── rpc/
│   ├── adapter.ts           — createRpcHandler() — same chain for ConnectRPC (unary)
│   ├── streaming-adapter.ts — createStreamingRpcHandler() — async function* for server streaming
│   ├── router-builder.ts    — buildConnectRoutes() — reads metadata, registers via fastifyConnectPlugin
│   └── utils.ts             — collectGuards/Pipes/Interceptors/Filters for RPC
├── ws/
│   ├── adapter.ts           — handleWsConnection() — WS lifecycle, message routing, guards
│   ├── router-builder.ts    — registerWsGateways() — @fastify/websocket integration
│   ├── types.ts             — WsHandlerMeta, WsGatewayLifecycle, WsParamMeta
│   └── index.ts
├── pipes/
│   └── zod.pipe.ts          — ZodPipe (Zod schema validation)
├── services/
│   ├── config.service.ts    — ConfigService<T> (get, getAll, getOrThrow, has)
│   └── logger.service.ts    — LoggerService (wraps tslog)
├── validation/
│   ├── app-config.ts        — appConfigSchema (APP_HOST, APP_PORT, CORS, LOG_*, etc.)
│   └── common.ts            — booleanSchema, numberSchema, stringArraySchema, enumArraySchema
└── types.ts                 — Provider, ModuleMeta, Guard, Interceptor, PipeTransform, ExceptionFilter, ServerOptions, BaseContext, lifecycle hooks
```

## Architecture

### Module System
```ts
@Module({
  providers: [MyService],           // DI providers
  controllers: [MyRpcController],   // ConnectRPC handlers
  httpControllers: [MyHttpCtrl],    // Fastify HTTP handlers
  imports: [OtherModule],           // Import other modules
  exports: [MyService],             // Export to parent modules
  global: true,                     // Export to ALL modules
})
export class MyModule {}
```

### DI Container (tsyringe-based)
- **Scoping:** Singleton by default, request-scoped via AsyncLocalStorage
- **Tokens:** Constructor, Symbol, string
- **Providers:** ClassProvider, ValueProvider, FactoryProvider, ExistingProvider
- **Multi-providers:** `{ provide: TOKEN, useClass: Impl, multi: true }`

### Request Lifecycle
```
Request → Create Scope → Extract Params → Guards → Pipes → Interceptors → Handler → [Filters on error] → Response → Dispose Scope
```
Same flow for HTTP and RPC. Guards/pipes/interceptors/filters collected: global → class → method.

### RPC Pattern
```ts
@RpcService(MyServiceProto)
class MyController {
  @RpcMethod(MyServiceProto.method.doSomething)
  async doSomething(@RpcData() req: DoRequest, @RpcContext() ctx: HandlerContext) {
    return { result: "ok" };
  }
}
```

### HTTP Pattern
```ts
@HttpController('/users')
class UsersController {
  @Get('/:id')
  async getUser(@Param('id') id: string, @Req() req: FastifyRequest) {
    return { id };
  }
}
```

### Error Mapping
`HttpException` ↔ `ConnectError` bidirectional conversion. Subclasses: BadRequest(400), Unauthorized(401), Forbidden(403), NotFound(404), InternalServerError(500).

## Development Commands

```bash
pnpm install            # Install dependencies
pnpm run build          # tsc → dist/
pnpm run typecheck      # tsc --noEmit
pnpm run lint           # ESLint
pnpm run lint:fix       # ESLint --fix
pnpm run format         # Prettier
pnpm run docs:dev       # VitePress dev server
pnpm run docs:build     # Build docs for GitHub Pages
pnpm run clean          # rm -rf dist
```

## Publishing

Tag-triggered via GitHub Actions (`.github/workflows/publish.yml`):
```bash
git tag v1.0.4
git push origin v1.0.4
```
Workflow: typecheck → build → npm publish → build docs → deploy to GH Pages → create GH release.

## Key Design Decisions

- **Subpath exports only** — no root `@smounters/imperium` import to keep tree-shaking clean
- **Zero runtime deps** — everything is peerDependencies (fastify, connectrpc, tsyringe, zod, tslog)
- **experimentalDecorators** — required for tsyringe DI (not TC39 decorators)
- **Unified BaseContext** — HTTP, RPC, and WS share same Guard/Interceptor/Pipe/Filter interfaces via `ctx.switchToHttp()` / `ctx.switchToRpc()` / `ctx.switchToWs()`
- **AsyncLocalStorage** for request scoping — no manual scope passing
- **Server streaming RPC** — `async function*` handlers via ConnectRPC (SSE in browsers)
- **WebSocket gateway** — `@fastify/websocket` (optional peer dep), message routing by `type` field, guards at connection time
- **Interceptors skipped for streaming** — by design, interceptors wrap single responses and don't apply to server streaming or WebSocket handlers

## Current Limitations

- **Only unary + server streaming RPC** — client streaming and bidi streaming throw
- **No tests** — framework has no test suite

---

## Memory Update Protocol
During any session, if you:
- Discover a non-obvious behavior or gotcha
- Make an architectural decision
- Get corrected on an implementation detail

→ Immediately update this CLAUDE.md.
