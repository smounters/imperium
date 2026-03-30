# @smounters/imperium

NestJS-inspired modular DI framework for TypeScript services. Unified HTTP + ConnectRPC + WebSocket server on a single Fastify instance.

## Features

- **Module system** with `@Module`, `@Injectable`, guards, pipes, interceptors, filters
- **HTTP controllers** with `@HttpController`, `@Get`, `@Post`, `@Body`, `@Query`, `@Param`
- **ConnectRPC** with `@RpcService`, `@RpcMethod` (unary + server streaming)
- **WebSocket gateway** with `@WsGateway`, `@WsHandler`, message routing, lifecycle hooks
- **Request-scoped DI** via AsyncLocalStorage (tsyringe-based)
- **Typed config** via Zod + `ConfigService`
- **Structured logging** via tslog + `LoggerService`

## Install

```bash
pnpm add @smounters/imperium reflect-metadata tsyringe fastify @connectrpc/connect @connectrpc/connect-fastify zod tslog
```

TypeScript config requires:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

## Quick Start

```ts
import "reflect-metadata";
import { Application } from "@smounters/imperium/core";
import { Body, HttpController, Injectable, Module, Post } from "@smounters/imperium/decorators";

@Injectable()
class GreetService {
  greet(name: string) {
    return { message: `Hello, ${name}` };
  }
}

@HttpController("/api")
class ApiController {
  constructor(private readonly greetService: GreetService) {}

  @Post("/greet")
  greet(@Body("name") name: string) {
    return this.greetService.greet(name);
  }
}

@Module({
  providers: [GreetService],
  httpControllers: [ApiController],
})
class AppModule {}

await new Application(AppModule).start({ port: 3000 });
```

## WebSocket

```ts
import { WsGateway, WsHandler, WsConnection, WsMessage } from "@smounters/imperium/decorators";
import type { WsGatewayLifecycle } from "@smounters/imperium/ws";
import type { WebSocket } from "@fastify/websocket";

@WsGateway("/ws")
class EventsGateway implements WsGatewayLifecycle {
  private clients = new Set<WebSocket>();

  onConnection(socket: WebSocket) { this.clients.add(socket); }
  onDisconnect(socket: WebSocket) { this.clients.delete(socket); }

  @WsHandler("ping")
  onPing(@WsConnection() ws: WebSocket) {
    ws.send(JSON.stringify({ type: "pong" }));
  }
}
```

Requires optional peer dependency: `pnpm add @fastify/websocket`

## Import Paths

No root import. Use subpaths:

```ts
import { Application } from "@smounters/imperium/core";
import { Module, Injectable, HttpController, Get } from "@smounters/imperium/decorators";
import { ConfigService, LoggerService } from "@smounters/imperium/services";
import { ZodPipe } from "@smounters/imperium/pipes";
import { appConfigSchema } from "@smounters/imperium/validation";
import { registerWsGateways } from "@smounters/imperium/ws";
```

## Documentation

Full guide and API reference: **[smounters.github.io/imperium](https://smounters.github.io/imperium/)**

## License

MIT
