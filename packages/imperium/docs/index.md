# Imperium

> Inspired by NestJS, built on top of `tsyringe`, `Fastify`, and `ConnectRPC`.

Imperium is a modular DI framework for TypeScript services that need:

- a single server for HTTP, RPC, and WebSocket;
- module boundaries with explicit exports/imports;
- request-scoped handlers;
- Nest-like decorators and lifecycle hooks;
- structured logging and schema-validated runtime config.

## Start Here

- [Getting Started](/guide/getting-started)
- [Application Bootstrap](/guide/application-bootstrap)
- [Modules and DI](/guide/modules-and-di)
- [HTTP](/guide/http)
- [RPC](/guide/rpc)
- [WebSocket](/guide/websocket)
- [Config and Logging](/guide/config-and-logging)
- [Errors and Filters](/guide/errors-and-filters)
- [API Surface](/reference/api-surface)

## Installation

```bash
pnpm add @smounters/imperium reflect-metadata tsyringe fastify @connectrpc/connect @connectrpc/connect-fastify zod
```

In your entrypoint:

```ts
import "reflect-metadata";
```

## Public Import Paths

Root import is intentionally disabled. Use subpaths:

- `@smounters/imperium/core`
- `@smounters/imperium/decorators`
- `@smounters/imperium/services`
- `@smounters/imperium/pipes`
- `@smounters/imperium/validation`
- `@smounters/imperium/ws`

Validation subpath also exports the built-in app config schema:

- `appConfigSchema`
- `AppConfig`

## Ecosystem

| Package | Description |
|---|---|
| `@smounters/imperium` | Core framework (this package) |
| [`@smounters/imperium-cron`](https://www.npmjs.com/package/@smounters/imperium-cron) | Cron scheduling with `@Cron()` decorator |

All packages are in a single [monorepo](https://github.com/smounters/imperium).
