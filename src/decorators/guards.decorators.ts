import "reflect-metadata";
import type { GuardLike } from "../types";
import { appendArrayMetadata } from "./metadata.decorators";

export const GUARDS_KEY = Symbol("guards");

export function UseGuards(...guards: GuardLike[]): ClassDecorator & MethodDecorator {
  return (target: object, propertyKey?: string | symbol) => {
    appendArrayMetadata(GUARDS_KEY, guards, target, propertyKey);
  };
}
