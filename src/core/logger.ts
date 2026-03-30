import { Logger } from "tslog";
import type { LoggerOptions } from "../types.js";

type LoggerPayload = Record<string, unknown>;

export type AppLogger = Logger<LoggerPayload>;

export const LOGGER_TOKEN = Symbol("app:logger");

const DEFAULT_LOGGER_OPTIONS: LoggerOptions = {
  name: "app",
  type: "pretty",
};

export function createLogger(options?: LoggerOptions): AppLogger {
  return new Logger({
    ...DEFAULT_LOGGER_OPTIONS,
    ...(options ?? {}),
  });
}
