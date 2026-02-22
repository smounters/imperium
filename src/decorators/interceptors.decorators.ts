import "reflect-metadata";
import type { InterceptorLike } from "../types";
import { appendArrayMetadata } from "./metadata.decorators";

export const INTERCEPTORS_KEY = Symbol("interceptors");

export function UseInterceptors(...inters: InterceptorLike[]): ClassDecorator & MethodDecorator {
  return (target: object, propertyKey?: string | symbol) => {
    appendArrayMetadata(INTERCEPTORS_KEY, inters, target, propertyKey);
  };
}
