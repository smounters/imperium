# Changelog

All notable changes to `@smounters/imperium` are documented in this file.

## 1.0.3 - 2026-03-20

### Fixed
- Controller handler methods now correctly bind `this` to the controller instance.

### Changed
- Config examples use exported `appConfigSchema` instead of inline definitions.
- Package exports restricted to subpath-only; added `prepack` build enforcement.
- Added ESLint and Prettier tooling.

### CI
- Publish workflow consolidated into single tag-based `publish.yml` with GitHub Release creation.
- npm publish via classic `NPM_TOKEN` secret.

## 0.1.0 - 2026-02-22

- Initial public package setup.
- Unified HTTP + ConnectRPC runtime on Fastify.
- NestJS-inspired module/decorator/DI API.
- Typed `Application` bootstrap with pre-start `configureConfig` and `configureLogger`.
- Multi provider intent metadata (`multi`) and array resolution via `InjectAll` / `resolveAll`.
- VitePress documentation and GitHub Pages workflow.
- npm publish workflow with `pnpm`.
