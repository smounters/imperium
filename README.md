# @smounters/imperium

`@smounters/imperium` is **inspired by NestJS** and provides a modular DI-first runtime for TypeScript services using Fastify + ConnectRPC.

It is designed for teams that want Nest-like architecture but with explicit control over runtime wiring and exported API surface.

## Key Features

- Nest-like modules and decorators (`@Module`, `@Injectable`, guards/pipes/interceptors/filters).
- Unified HTTP + RPC server on one Fastify instance.
- Request-scoped handler execution.
- Typed runtime config via `zod` + `ConfigService`.
- Built-in `LoggerService` (tslog-based).
- Global enhancer tokens (`APP_GUARD`, `APP_PIPE`, `APP_INTERCEPTOR`, `APP_FILTER`).
- Multi-provider array injection (`InjectAll`) and manual array resolution (`resolveAll`).

## Public Imports

Root import is intentionally disabled.

Use subpaths only:

- `@smounters/imperium/core`
- `@smounters/imperium/decorators`
- `@smounters/imperium/services`
- `@smounters/imperium/pipes`
- `@smounters/imperium/validation`

## Installation

```bash
pnpm add @smounters/imperium reflect-metadata tsyringe fastify @connectrpc/connect @connectrpc/connect-fastify zod
```

TypeScript requirements:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

Entry point must import metadata:

```ts
import "reflect-metadata";
```

## Quick Start

```ts
import "reflect-metadata";

import { Application } from "@smounters/imperium/core";
import { Body, HttpController, Injectable, Module, Post } from "@smounters/imperium/decorators";

@Injectable()
class AuthService {
  signIn(email: string) {
    return { ok: true, email };
  }
}

@HttpController("/auth")
class AuthHttpController {
  constructor(private readonly authService: AuthService) {}

  @Post("/sign-in")
  signIn(@Body("email") email: string) {
    return this.authService.signIn(email);
  }
}

@Module({
  providers: [AuthService],
  httpControllers: [AuthHttpController],
})
class AppModule {}

const app = new Application(AppModule, {
  host: "0.0.0.0",
  accessLogs: true,
});

await app.start({ port: 3000 });
```

## Recommended Bootstrap Flow

```ts
import { Application } from "@smounters/imperium/core";
import { ConfigService, LoggerService } from "@smounters/imperium/services";
import { appConfigSchema, type AppConfig } from "@smounters/imperium/validation";

const app = new Application(AppModule, {
  host: "0.0.0.0",
  accessLogs: true,
});

app.configureConfig(appConfigSchema, process.env);

const config = app.resolve(ConfigService<AppConfig>).getAll();

app.configureLogger({
  name: "backend",
  minLevel: 3,
});

await app.start({
  port: config.APP_PORT,
  prefix: config.APP_GLOBAL_PREFIX,
});

app.resolve(LoggerService).info({ event: "app.started", port: config.APP_PORT });
```

If your app needs extra config fields, extend the exported base schema:

```ts
import { appConfigSchema } from "@smounters/imperium/validation";
import { z } from "zod";

const projectConfigSchema = appConfigSchema.extend({
  REDIS_URL: z.url(),
});
```

## Multi Providers

```ts
import { InjectAll, Injectable, Module } from "@smounters/imperium/decorators";

const AML_RULES = Symbol("AML_RULES");

@Module({
  providers: [
    { provide: AML_RULES, multi: true, useClass: SanctionsRule },
    { provide: AML_RULES, multi: true, useClass: MixerRule },
    { provide: AML_RULES, multi: true, useClass: FreshAddressRule },
  ],
  exports: [AML_RULES],
})
class AmlModule {}

@Injectable()
class AmlEngine {
  constructor(@InjectAll(AML_RULES) private readonly rules: AmlRule[]) {}
}
```

Manual resolution is also available:

```ts
const rules = app.resolveAll<AmlRule>(AML_RULES);
```

## HTTP and RPC

Use decorators from `@smounters/imperium/decorators`:

- HTTP: `HttpController`, `Get`, `Post`, `Put`, `Patch`, `Delete`, `Body`, `Query`, `Param`, `Header`, `Req`, `Res`
- RPC: `RpcService`, `RpcMethod`, `RpcData`, `RpcContext`, `RpcHeaders`, `RpcHeader`

Imperium auto-detects registered HTTP/RPC handlers and serves both protocols from one server.

## Services

From `@smounters/imperium/services`:

- `ConfigService`
- `LoggerService`

## Pipes and Validation

- `ZodPipe` from `@smounters/imperium/pipes`
- validation helpers from `@smounters/imperium/validation`
  - `appConfigSchema`
  - `AppConfig`
  - `booleanSchema`
  - `numberSchema`
  - `nativeEnumSchema`
  - `stringArraySchema`
  - `enumArraySchema`

## Error Classes

From `@smounters/imperium/core`:

- `HttpException`
- `BadRequestException`
- `UnauthorizedException`
- `ForbiddenException`
- `NotFoundException`
- `InternalServerErrorException`

## Documentation

Full docs (VitePress) are located in:

- `docs`

Local docs commands:

```bash
pnpm run docs:dev
pnpm run docs:build
```

GitHub Pages deployment is configured via `.github/workflows/publish.yml`.

## Publish to npm

```bash
pnpm install
pnpm run typecheck
pnpm run build
pnpm publish --access public --no-git-checks
```

Automated npm publishing workflow:

- `.github/workflows/publish.yml`

Required secret:

- `NPM_TOKEN`

## License

MIT
