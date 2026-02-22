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
- `ServerOptions`, `CorsOptions`, `HealthOptions`, `LoggerOptions`

## `@smounters/imperium/decorators`

- DI: `Module`, `Injectable`, `Inject`, `InjectAll`, `Optional`, `Scope`
- HTTP: `HttpController`, `Get`, `Post`, `Put`, `Patch`, `Delete`, `Body`, `Query`, `Param`, `Header`, `Req`, `Res`
- RPC: `RpcService`, `RpcMethod`, `RpcData`, `RpcContext`, `RpcHeaders`, `RpcHeader`
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
