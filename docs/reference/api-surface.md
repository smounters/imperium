# API Surface

Imperium exports only subpaths. Root import (`@cryppex/imperium`) is intentionally disabled.

## `@cryppex/imperium/core`

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

## `@cryppex/imperium/decorators`

- DI: `Module`, `Injectable`, `Inject`, `InjectAll`, `Optional`, `Scope`
- HTTP: `HttpController`, `Get`, `Post`, `Put`, `Patch`, `Delete`, `Body`, `Query`, `Param`, `Header`, `Req`, `Res`
- RPC: `RpcService`, `RpcMethod`, `RpcData`, `RpcContext`, `RpcHeaders`, `RpcHeader`
- Enhancers: `UseGuards`, `UsePipes`, `UseInterceptors`, `UseFilters`, `Catch`
- Metadata: `SetMetadata`

## `@cryppex/imperium/services`

- `ConfigService`
- `LoggerService`

## `@cryppex/imperium/pipes`

- `ZodPipe`

## `@cryppex/imperium/validation`

- `booleanSchema`
- `numberSchema`
- `nativeEnumSchema`
- `stringArraySchema`
- `enumArraySchema`
