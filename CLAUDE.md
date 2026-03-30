# Imperium Monorepo

pnpm workspaces monorepo for `@smounters/imperium` ecosystem.

## Structure

```
packages/
├── imperium/        — @smounters/imperium (core framework)
└── imperium-cron/   — @smounters/imperium-cron (cron scheduling)
```

## Commands

```bash
pnpm install             # install all dependencies
pnpm run typecheck       # typecheck all packages (builds core first)
pnpm run lint            # lint all packages
pnpm run test            # test all packages (builds core first)
pnpm run build           # build all packages
pnpm run docs:dev        # VitePress dev server (core docs)
pnpm run docs:build      # build docs
```

## Publishing

Tag convention:
- `vX.Y.Z` — publishes `@smounters/imperium`
- `imperium-cron/vX.Y.Z` — publishes `@smounters/imperium-cron`

CI auto-detects package from tag, runs typecheck + test + build + publish.

## Cross-package development

`imperium-cron` depends on `imperium` via `workspace:*` in devDependencies.
TypeScript resolves types from `imperium/dist/`, so **core must be built first** before typechecking or testing other packages. Root scripts handle this automatically.

## Rules

- Commit messages: short, no AI references
- All relative imports must use `.js` extensions (Node ESM compatibility)
- Run `pnpm run typecheck && pnpm run test` before pushing
