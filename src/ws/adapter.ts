import type { FastifyRequest } from "fastify";
import type { WebSocket } from "@fastify/websocket";
import "reflect-metadata";

import type { AppContainer } from "../core/container";

import { GUARDS_KEY } from "../decorators/guards.decorators";
import { WS_HANDLERS_KEY, WS_PARAMS_KEY } from "../decorators/ws.decorators";
import { Reflector } from "../core/reflector";
import { LoggerService } from "../services";
import type { BaseContext, Constructor, Guard, GuardLike, WsArgumentsHost } from "../types";
import type { WsGatewayLifecycle, WsHandlerMeta, WsParamMeta } from "./types";

type RequestScope = ReturnType<AppContainer["createRequestScope"]>;

const reflector = new Reflector();

function collectGuardsForWs(gateway: Constructor, app: AppContainer): GuardLike[] {
  const classGuards = (reflector.get<GuardLike[]>(GUARDS_KEY, gateway) ?? []) as GuardLike[];
  return [...app.getGlobalGuards(), ...classGuards];
}

function resolveEnhancer<T>(scope: RequestScope, enhancer: Constructor<T> | T): T {
  if (typeof enhancer === "function") {
    return scope.resolve(enhancer as Constructor<T>);
  }

  return enhancer;
}

function buildWsArgs(
  socket: WebSocket,
  request: FastifyRequest,
  message: unknown,
  handler: Function,
): unknown[] {
  const metas: WsParamMeta[] = Reflect.getMetadata(WS_PARAMS_KEY, handler) ?? [];

  if (!metas.length) {
    return [socket, message, request];
  }

  const args: unknown[] = [];

  for (const meta of metas) {
    switch (meta.source) {
      case "connection":
        args[meta.index] = socket;
        break;
      case "message":
        args[meta.index] = message;
        break;
      case "request":
        args[meta.index] = request;
        break;
    }
  }

  return args;
}

function buildWsContext(
  gateway: Constructor,
  methodName: string,
  handler: Constructor | Function,
  socket: WebSocket,
  request: FastifyRequest,
  message?: unknown,
): BaseContext {
  return {
    type: "ws",
    method: methodName,
    controller: gateway,
    handler,
    ws: {
      socket,
      request,
      message,
    },
    getType: () => "ws",
    getClass: () => gateway,
    getHandler: () => handler,
    switchToHttp: () => ({
      getRequest: () => undefined,
      getResponse: () => undefined,
    }),
    switchToRpc: () => ({
      getData: () => undefined,
      getContext: () => undefined,
    }),
    switchToWs: (): WsArgumentsHost => ({
      getSocket: () => socket,
      getRequest: () => request,
      getMessage: <T = unknown>() => message as T | undefined,
    }),
  };
}

function logWsError(
  app: AppContainer,
  scope: RequestScope,
  details: Record<string, unknown>,
  error: unknown,
): void {
  try {
    scope.resolve(LoggerService).error(details, error);
    return;
  } catch {
    // fallback
  }

  try {
    app.getLogger().error(details, error);
    return;
  } catch {
    // final fallback
  }

  console.error("[imperium] ws_error", details, error);
}

export function handleWsConnection(
  app: AppContainer,
  gateway: Constructor,
  socket: WebSocket,
  request: FastifyRequest,
): void {
  const scope = app.createRequestScope(gateway);
  const handlers: WsHandlerMeta[] = Reflect.getMetadata(WS_HANDLERS_KEY, gateway) ?? [];

  const runAsync = async () => {
    const instance = scope.resolve(gateway) as Record<string, unknown> & Partial<WsGatewayLifecycle>;

    // Run guards at connection time
    const guardLikes = collectGuardsForWs(gateway, app);
    const guards = guardLikes.map((g) => resolveEnhancer<Guard>(scope, g));
    const ctx = buildWsContext(gateway, "onConnection", gateway, socket, request);

    for (const guard of guards) {
      const ok = await guard.canActivate(ctx);
      if (!ok) {
        socket.close(4403, "Forbidden");
        await app.disposeRequestScope(scope);
        return;
      }
    }

    // Call onConnection lifecycle
    if (typeof instance.onConnection === "function") {
      await instance.onConnection(socket, request);
    }

    // Route messages to handlers
    socket.on("message", (raw: Buffer | ArrayBuffer | Buffer[]) => {
      (async () => {
        try {
          const msg = JSON.parse(raw.toString()) as { type?: string; data?: unknown };
          const handler = handlers.find((h) => h.messageType === msg.type);

          if (!handler) {
            return;
          }

          const handlerFn = (instance as Record<string, Function>)[handler.handlerName]!;
          const args = buildWsArgs(socket, request, msg.data, handlerFn);
          await handlerFn.apply(instance, args);
        } catch (error) {
          logWsError(app, scope, {
            type: "ws_message_error",
            gateway: gateway.name,
          }, error);
        }
      })();
    });

    // Cleanup on disconnect
    socket.on("close", () => {
      (async () => {
        try {
          if (typeof instance.onDisconnect === "function") {
            await instance.onDisconnect(socket);
          }
        } catch (error) {
          logWsError(app, scope, {
            type: "ws_disconnect_error",
            gateway: gateway.name,
          }, error);
        } finally {
          try {
            await app.disposeRequestScope(scope);
          } catch (error) {
            logWsError(app, scope, {
              type: "ws_scope_dispose_error",
              gateway: gateway.name,
            }, error);
          }
        }
      })();
    });
  };

  runAsync().catch((error) => {
    logWsError(app, scope, {
      type: "ws_connection_error",
      gateway: gateway.name,
    }, error);

    try {
      socket.close(4500, "Internal Server Error");
    } catch {
      // socket may already be closed
    }

    app.disposeRequestScope(scope).catch(() => {});
  });
}
