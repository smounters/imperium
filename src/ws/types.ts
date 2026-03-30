import type { FastifyRequest } from "fastify";
import type { WebSocket } from "@fastify/websocket";

export interface WsHandlerMeta {
  messageType: string;
  handlerName: string;
}

export interface WsGatewayMeta {
  path: string;
}

export type WsParamSource = "connection" | "message" | "request";

export interface WsParamMeta {
  index: number;
  source: WsParamSource;
}

export interface WsGatewayLifecycle {
  onConnection?(socket: WebSocket, req: FastifyRequest): void | Promise<void>;
  onDisconnect?(socket: WebSocket): void | Promise<void>;
}
