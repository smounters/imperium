# API Surface

Imperium exports only subpaths. Root import (`@smounters/imperium`) is intentionally disabled.

## `@smounters/imperium/core`

Runtime exports:

- `Application`
- `APP_GUARD`
- `APP_PIPE`
- `APP_INTERCEPTOR`
- `APP_FILTER`
- `Reflector`
- `consoleTransport` — built-in console log transport factory
- `ImperiumLogger` — native transport-based logger
- `HttpException`
- `BadRequestException`
- `UnauthorizedException`
- `ForbiddenException`
- `NotFoundException`
- `InternalServerErrorException`

Type exports (selected):

- `ModuleMeta`, `DynamicModule`, `Provider`
- `Guard`, `Interceptor`, `PipeTransform`, `ExceptionFilter`
- lifecycle hooks: `OnModuleInit`, `OnApplicationBootstrap`, `OnModuleDestroy`, `BeforeApplicationShutdown`, `OnApplicationShutdown`
- `ServerOptions`, `CorsOptions`, `HealthOptions`
- `LoggerOptions`, `ImperiumLoggerOptions`, `TslogOptions`, `LogLevel`, `LogEntry`, `LogTransport`
- `OnErrorCallback`, `ErrorContext`, `ErrorContextType`
- `BaseContext`, `ContextType`, `HttpArgumentsHost`, `RpcArgumentsHost`, `WsArgumentsHost`

## `@smounters/imperium/decorators`

- DI: `Module`, `Injectable`, `Inject`, `InjectAll`, `Optional`, `Scope`
- HTTP: `HttpController`, `Get`, `Post`, `Put`, `Patch`, `Delete`, `Body`, `Query`, `Param`, `Header`, `Req`, `Res`
- RPC: `RpcService`, `RpcMethod`, `RpcData`, `RpcContext`, `RpcHeaders`, `RpcHeader`, `RpcAbortSignal`
- WebSocket: `WsGateway`, `WsHandler`, `WsConnection`, `WsMessage`, `WsRequest`
- Enhancers: `UseGuards`, `UsePipes`, `UseInterceptors`, `UseFilters`, `Catch`
- Metadata: `SetMetadata`

## `@smounters/imperium/services`

- `ConfigService`
- `LoggerService`

## `@smounters/imperium/pipes`

- `ZodPipe`

## `@smounters/imperium/validation`

- `appConfigSchema`
- `AppConfig`
- `booleanSchema`
- `numberSchema`
- `nativeEnumSchema`
- `stringArraySchema`
- `enumArraySchema`

## `@smounters/imperium/ws`

- `registerWsGateways`
- `handleWsConnection`

Type exports:

- `WsGatewayLifecycle`
- `WsGatewayMeta`, `WsHandlerMeta`, `WsParamMeta`, `WsParamSource`

## `@smounters/imperium-cron` <Badge type="tip" text="separate package" />

- `Cron` — method decorator
- `CronModule` — dynamic module (`CronModule.register({ providers })`)
- `CronService` — injectable (`getJobs()`, `stopAll()`)

Install: `pnpm add @smounters/imperium-cron` — [Guide](/guide/cron)

## `@smounters/imperium-events` <Badge type="tip" text="separate package" />

- `OnEvent` — method decorator (supports wildcards)
- `EventModule` — dynamic module (`EventModule.register({ listeners })`)
- `EventService` — injectable (`emit()`, `getHandlers()`)

Install: `pnpm add @smounters/imperium-events` — [Guide](/guide/events)
