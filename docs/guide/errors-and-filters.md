# Errors and Filters

## Built-in HTTP Exceptions

From `@smounters/imperium/core`:

- `HttpException`
- `BadRequestException`
- `UnauthorizedException`
- `ForbiddenException`
- `NotFoundException`
- `InternalServerErrorException`

```ts
import { BadRequestException } from "@smounters/imperium/core";

if (!payload.email) {
  throw new BadRequestException("email is required");
}
```

## Exception Filters

```ts
import type { BaseContext, ExceptionFilter } from "@smounters/imperium/core";
import { Catch, Injectable } from "@smounters/imperium/decorators";

@Catch(Error)
@Injectable()
class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, ctx: BaseContext) {
    if (ctx.getType() === "http") {
      return { statusCode: 500, message: "Unhandled error" };
    }

    return { message: "Unhandled rpc error" };
  }
}
```

Register globally with `APP_FILTER`:

```ts
import { APP_FILTER } from "@smounters/imperium/core";

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
class AppModule {}
```

## Internal Error Exposure

Use `exposeInternalErrors` only in trusted environments:

```ts
await app.start({
  exposeInternalErrors: process.env.NODE_ENV !== "production",
});
```
