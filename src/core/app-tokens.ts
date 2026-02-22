import type { ExceptionFilterLike, GuardLike, InjectionToken, InterceptorLike, PipeLike } from "../types";

export const APP_GUARD: InjectionToken<GuardLike> = Symbol("app:guard");
export const APP_INTERCEPTOR: InjectionToken<InterceptorLike> = Symbol("app:interceptor");
export const APP_PIPE: InjectionToken<PipeLike> = Symbol("app:pipe");
export const APP_FILTER: InjectionToken<ExceptionFilterLike> = Symbol("app:filter");
