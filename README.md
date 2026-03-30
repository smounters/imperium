# Imperium

NestJS-inspired modular DI framework for TypeScript services. Monorepo for all `@smounters/imperium` packages.

## Packages

| Package | Description | npm |
|---|---|---|
| [`@smounters/imperium`](packages/imperium/) | Core framework — HTTP + ConnectRPC + WebSocket on Fastify | [![npm](https://img.shields.io/npm/v/@smounters/imperium)](https://www.npmjs.com/package/@smounters/imperium) |
| [`@smounters/imperium-cron`](packages/imperium-cron/) | Cron scheduling with `@Cron()` decorator | [![npm](https://img.shields.io/npm/v/@smounters/imperium-cron)](https://www.npmjs.com/package/@smounters/imperium-cron) |
| [`@smounters/imperium-events`](packages/imperium-events/) | Typed event emitter with `@OnEvent()` and wildcards | [![npm](https://img.shields.io/npm/v/@smounters/imperium-events)](https://www.npmjs.com/package/@smounters/imperium-events) |

## Quick Start

```bash
pnpm add @smounters/imperium reflect-metadata tsyringe fastify @connectrpc/connect @connectrpc/connect-fastify zod tslog
```

```ts
import "reflect-metadata";
import { Application } from "@smounters/imperium/core";
import { HttpController, Get, Injectable, Module } from "@smounters/imperium/decorators";

@Injectable()
class HelloService {
  greet() { return { message: "Hello from Imperium" }; }
}

@HttpController("/api")
class ApiController {
  constructor(private readonly hello: HelloService) {}

  @Get("/hello")
  greet() { return this.hello.greet(); }
}

@Module({ providers: [HelloService], httpControllers: [ApiController] })
class AppModule {}

await new Application(AppModule).start({ port: 3000 });
```

## Documentation

Full guide and API reference: **[smounters.github.io/imperium](https://smounters.github.io/imperium/)**

## Development

```bash
pnpm install          # install all dependencies
pnpm run typecheck    # typecheck all packages
pnpm run test         # run all tests
pnpm run build        # build all packages
pnpm run docs:dev     # VitePress dev server
```

## Publishing

Tag-based, one tag per package:

```bash
# Core framework
git tag v1.2.0 && git push origin v1.2.0

# Cron package
git tag imperium-cron/v0.2.0 && git push origin imperium-cron/v0.2.0
```

CI auto-detects which package to publish from the tag format.

## License

MIT
