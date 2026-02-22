# Config and Logging

## ConfigService

`ConfigService` is always available in DI.

- Without explicit schema: wraps `process.env`.
- With schema: `configureConfig(schema, source)` validates and stores typed config.

```ts
import { ConfigService } from "@smounters/imperium/services";
import { z } from "zod";

const appConfigSchema = z.object({
  APP_PORT: z.coerce.number().default(8000),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

type AppConfig = z.infer<typeof appConfigSchema>;

app.configureConfig(appConfigSchema, process.env);

const cfg = app.resolve(ConfigService<AppConfig>);
const port = cfg.get("APP_PORT");
```

`ConfigService` methods:

- `getAll()`
- `get(key)`
- `has(key)`
- `getOrThrow(key, message?)`

## LoggerService

`LoggerService` is injectable and uses `tslog` under the hood.

```ts
import { LoggerService } from "@smounters/imperium/services";

@Injectable()
class OrdersService {
  constructor(private readonly logger: LoggerService) {}

  createOrder(id: string) {
    this.logger.info({ event: "order.create", id });
  }
}
```

## Logger Configuration

```ts
app.configureLogger({
  name: "backend",
  minLevel: 3,
  prettyLogTemplate: "{{yyyy}}-{{mm}}-{{dd}} {{hh}}:{{MM}}:{{ss}} | {{logLevelName}} |",
});

await app.start({ accessLogs: true });
```

- `accessLogs: true` enables request access logs.
- Logger can still be customized per app before startup.
