import "reflect-metadata";
import type { PipeLike } from "../types";
import { appendArrayMetadata } from "./metadata.decorators";

export const PIPES_KEY = Symbol("pipes");

export function UsePipes(...pipes: PipeLike[]): ClassDecorator & MethodDecorator {
  return (target: object, propertyKey?: string | symbol) => {
    appendArrayMetadata(PIPES_KEY, pipes, target, propertyKey);
  };
}
