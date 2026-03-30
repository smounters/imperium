# @smounters/imperium-events

Typed in-process event emitter for [`@smounters/imperium`](https://www.npmjs.com/package/@smounters/imperium). Decorate methods with `@OnEvent()` and emit from any service. Supports wildcard patterns.

Part of the [Imperium monorepo](https://github.com/smounters/imperium).

## Install

```bash
pnpm add @smounters/imperium-events
```

## Usage

```ts
import { Injectable, Module } from "@smounters/imperium/decorators";
import { OnEvent, EventModule, EventService } from "@smounters/imperium-events";

// --- Listener ---

@Injectable()
class TradeNotifier {
  @OnEvent("trade.opened")
  async onTradeOpened(payload: { symbol: string; price: number }) {
    // push notification, log, update stats
  }

  @OnEvent("trade.*") // wildcard — matches trade.opened, trade.closed, etc.
  async auditLog(payload: unknown) {
    // write to audit log
  }
}

// --- Emitter ---

@Injectable()
class TradingEngine {
  constructor(private readonly events: EventService) {}

  async executeTrade(symbol: string, price: number) {
    // ... execute trade logic
    await this.events.emit("trade.opened", { symbol, price });
  }
}

// --- Module ---

@Module({
  imports: [EventModule.register({ listeners: [TradeNotifier] })],
  providers: [TradingEngine],
})
class TradingModule {}
```

## API

### `@OnEvent(pattern)`

Method decorator. Registers the method as a handler for events matching the pattern.

- `"trade.opened"` — exact match
- `"trade.*"` — wildcard, matches any single segment

### `EventModule.register({ listeners })`

Dynamic module. Pass providers that contain `@OnEvent()` methods.

### `EventService`

Injectable service:

- `emit(event, payload?)` — emit an event. All matching handlers run concurrently. Errors in individual handlers are caught and logged without blocking others.
- `getHandlers()` — returns registered handlers (for introspection/testing)

## License

MIT
