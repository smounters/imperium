import "reflect-metadata";
import { Module, Injectable, Inject } from "@smounters/imperium/decorators";
import type { OnModuleInit, OnApplicationShutdown, Constructor } from "@smounters/imperium/core";
import type { DependencyContainer } from "tsyringe";

import { CronService } from "./cron.service.js";

const CRON_TARGETS = Symbol("cron:targets");

export interface CronModuleOptions {
  providers: Constructor[];
}

@Injectable()
class CronBootstrap implements OnModuleInit, OnApplicationShutdown {
  constructor(
    private readonly cronService: CronService,
    @Inject(CRON_TARGETS) private readonly targets: Constructor[],
    @Inject("cron:container") private readonly container: DependencyContainer,
  ) {}

  onModuleInit(): void {
    for (const target of this.targets) {
      const instance = this.container.resolve(target);
      this.cronService.registerProvider(instance as object, target.name);
    }
  }

  onApplicationShutdown(): void {
    this.cronService.stopAll();
  }
}

@Module({})
export class CronModule {
  static register(options: CronModuleOptions) {
    const cronTargets: Constructor[] = options.providers.filter((p) => CronService.hasCronJobs(p));

    return {
      module: CronModule,
      providers: [
        CronService,
        CronBootstrap,
        ...cronTargets,
        { provide: CRON_TARGETS, useValue: cronTargets },
        {
          provide: "cron:container",
          useFactory: (container: DependencyContainer) => container,
        },
      ],
      exports: [CronService],
    };
  }
}
