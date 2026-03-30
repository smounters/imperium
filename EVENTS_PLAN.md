# imperium-events — Typed Event Emitter

## Зачем

Развязка между сервисами. Вместо прямых вызовов между сервисами — эмит события,
на которое подписываются слушатели. Каждый слушатель — отдельный injectable сервис.

Синергия с WebSocket gateway: сервис эмитит событие → один слушатель пишет в БД,
другой пушит в WS gateway для real-time нотификации.

## API дизайн

### Декораторы

```ts
import { OnEvent } from "@smounters/imperium-events";
import { Injectable } from "@smounters/imperium/decorators";

@Injectable()
class TradeNotifier {
  @OnEvent("trade.opened")
  async notifyUser(payload: { userId: string; symbol: string; price: number }) {
    // push to WebSocket, send email, etc.
  }

  @OnEvent("trade.*")  // wildcard — любое событие trade.*
  async logAllTrades(payload: unknown) {
    // audit log
  }
}
```

### EventService (injectable)

```ts
import { EventService } from "@smounters/imperium-events";

@Injectable()
class BotEngine {
  constructor(private readonly events: EventService) {}

  async executeTrade() {
    const trade = await this.createTrade();
    // Эмит — все @OnEvent("trade.opened") слушатели вызываются
    await this.events.emit("trade.opened", {
      userId: trade.userId,
      symbol: trade.symbol,
      price: trade.price,
    });
  }
}
```

### EventModule

```ts
import { Module } from "@smounters/imperium/decorators";
import { EventModule } from "@smounters/imperium-events";

@Module({
  imports: [EventModule.register({ listeners: [TradeNotifier, AuditLogger] })],
})
class AppModule {}
```

## Внутренняя реализация

```
src/
├── event.decorators.ts  — @OnEvent(pattern), ON_EVENT_KEY metadata
├── event.service.ts     — EventService: emit(), addListener(), removeListener()
├── event.module.ts      — EventModule.register({ listeners })
└── index.ts
```

### event.service.ts

- In-process EventEmitter (не Redis pub/sub — это уровень приложения, не инфры)
- `emit(event, payload)` — вызывает все зарегистрированные обработчики
- `emit()` возвращает Promise — дожидается всех async обработчиков
- Ошибка в одном слушателе не блокирует остальных (каждый обёрнут в try/catch, ошибки логируются)
- Wildcard matching: `trade.*` матчит `trade.opened`, `trade.closed`

### event.module.ts

- `EventModule.register({ listeners })` — сканирует @OnEvent() метаданные
- При OnModuleInit: резолвит listener instances из DI, регистрирует в EventService
- EventService — singleton, доступен через DI для эмита из любого сервиса

### Типизация

```ts
// Опционально — пользователь может определить карту событий
interface AppEvents {
  "trade.opened": { userId: string; symbol: string; price: number };
  "trade.closed": { userId: string; symbol: string; pnl: number };
  "user.registered": { userId: string; email: string };
}

// EventService<AppEvents> — типизированный emit/on
const events = app.resolve(EventService<AppEvents>);
await events.emit("trade.opened", { userId, symbol, price }); // типы проверяются
```

## Зависимости

- **Runtime:** 0 (только Node.js EventEmitter или кастомный)
- **Peer:** `@smounters/imperium ^1.1.0`, `reflect-metadata`, `tsyringe`

## Оценка объёма

~250 строк кода + ~100 строк тестов.

---

## Использование в проектах

### scalping-bot

Текущая проблема: BotEngine напрямую вызывает логирование, нотификацию, WebSocket broadcast.
С events:

```ts
// bot.ts — только эмитит
await this.events.emit("trade.opened", { botId, symbol, side, price });

// notifications.listener.ts — слушает и пушит в WS
@OnEvent("trade.opened")
async pushToWs(payload) {
  this.gateway.broadcast(`bot:${payload.botId}`, "trade_opened", payload);
}

// audit.listener.ts — слушает и пишет в БД
@OnEvent("trade.*")
async logTrade(payload) {
  await this.eventsRepo.insert({ type: "trade", data: payload });
}
```

Регистрация:
```ts
@Module({
  imports: [
    EventModule.register({ listeners: [NotificationsListener, AuditListener] }),
  ],
})
class TradingModule {}
```

### cronika-app

Потенциальные use cases:
- `bet.resolved` → начислить выигрыш + обновить статистику + отправить push
- `payment.completed` → зачислить баланс + логировать + отправить email
- `user.registered` → создать кошелёк + отправить welcome email + аналитика

Сейчас всё это — прямые вызовы в одном сервисе (BillingService, UserService).
Events позволят разделить на независимые listener-сервисы.

Инструкция по миграции будет создана после публикации imperium-events.
