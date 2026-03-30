# @smounters/imperium-cron

Cron scheduling for [`@smounters/imperium`](https://www.npmjs.com/package/@smounters/imperium). Decorate methods with `@Cron()` and they run on a schedule. Jobs auto-stop on application shutdown.

Part of the [Imperium monorepo](https://github.com/smounters/imperium).

Built on [croner](https://github.com/Hexagon/croner) — lightweight, zero-dependency cron scheduler.

## Install

```bash
pnpm add @smounters/imperium-cron
```

## Usage

```ts
import { Injectable, Module } from "@smounters/imperium/decorators";
import { Cron, CronModule } from "@smounters/imperium-cron";

@Injectable()
class MarketSync {
  @Cron("*/30 * * * * *") // every 30 seconds
  async syncPrices() {
    // fetch latest prices
  }

  @Cron("0 0 * * *", { name: "daily-cleanup" })
  async cleanup() {
    // remove old data
  }
}

@Module({
  imports: [CronModule.register({ providers: [MarketSync] })],
})
class AppModule {}
```

## API

### `@Cron(expression, options?)`

Method decorator. Registers the method to run on a cron schedule.

- `expression` — cron expression (supports seconds: `* * * * * *`)
- `options.name` — optional human-readable name for logging

### `CronModule.register({ providers })`

Dynamic module. Pass providers that contain `@Cron()` methods. Only providers with at least one `@Cron()` method are scanned.

### `CronService`

Injectable service for introspection:

- `getJobs()` — returns list of registered jobs with name, expression, running status
- `stopAll()` — stops all jobs (called automatically on shutdown)

## Documentation

Full guide: **[smounters.github.io/imperium/guide/cron](https://smounters.github.io/imperium/guide/cron)**

## License

MIT
