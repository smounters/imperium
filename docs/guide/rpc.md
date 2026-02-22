# RPC (Connect)

## Service Decorators

```ts
import { Injectable, RpcMethod, RpcService } from "@smounters/imperium/decorators";
import { AuthRPC } from "@smounters/proto/public/auth_pb";

@Injectable()
@RpcService(AuthRPC)
class AuthRpcController {
  @RpcMethod(AuthRPC.method.signIn)
  async signIn(payload: { email: string }) {
    return { email: payload.email };
  }
}
```

## RPC Parameter Decorators

- `@RpcData(key?)`
- `@RpcContext()`
- `@RpcHeaders()`
- `@RpcHeader(name)`

```ts
@RpcMethod(AuthRPC.method.signIn)
async signIn(
  @RpcData("email") email: string,
  @RpcHeader("x-request-id") requestId: string | undefined,
) {
  return { email, requestId };
}
```

## Unified Server

No separate RPC server is needed. Imperium auto-detects registered HTTP/RPC handlers and serves both on one Fastify instance.

```ts
await app.start({
  host: "0.0.0.0",
  port: 8000,
  prefix: "/api",
  httpPrefix: "/http",
  rpcPrefix: "/rpc",
});
```

Final RPC base URL = `prefix + rpcPrefix`.
