# Getting Started

## 1. Install Dependencies

```bash
pnpm add @smounters/imperium reflect-metadata tsyringe fastify @connectrpc/connect @connectrpc/connect-fastify zod
```

## 2. Enable Decorator Metadata

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

## 3. Create Your First Module

```ts
import "reflect-metadata";

import { Application } from "@smounters/imperium/core";
import { Body, HttpController, Injectable, Module, Post } from "@smounters/imperium/decorators";

@Injectable()
class AuthService {
  signIn(email: string) {
    return { email, ok: true };
  }
}

@HttpController("/auth")
class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/sign-in")
  signIn(@Body("email") email: string) {
    return this.authService.signIn(email);
  }
}

@Module({
  providers: [AuthService],
  httpControllers: [AuthController],
})
class AppModule {}

const app = new Application(AppModule, {
  host: "0.0.0.0",
  port: 3000,
  accessLogs: true,
});

await app.start();
```

## 4. Add Config Validation (Optional)

```ts
import { z } from "zod";
import { ConfigService } from "@smounters/imperium/services";

const appConfigSchema = z.object({
  APP_PORT: z.coerce.number().default(3000),
});

const app = new Application(AppModule, { host: "0.0.0.0" });

app.configureConfig(appConfigSchema, process.env);
const config = app.resolve(ConfigService<z.infer<typeof appConfigSchema>>).getAll();

await app.start({ port: config.APP_PORT });
```
