# Changelog

## 0.1.0 - 2026-03-30

- Initial release.
- `@Cron(expression, options?)` method decorator.
- `CronModule.register({ providers })` dynamic module.
- `CronService` with `getJobs()` and `stopAll()`.
- Auto-stop on application shutdown via `OnApplicationShutdown`.
- Built on croner v10.
