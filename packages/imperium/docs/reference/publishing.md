# Publishing

All packages live in a single [monorepo](https://github.com/smounters/imperium) with pnpm workspaces.

## Prerequisites

- Node.js 20+
- pnpm 10+
- `NPM_TOKEN` org-level secret in GitHub (smounters org)

## Tag Convention

Each package has its own tag format:

| Package | Tag format | Example |
|---|---|---|
| `@smounters/imperium` | `vX.Y.Z` | `v1.2.0` |
| `@smounters/imperium-cron` | `imperium-cron/vX.Y.Z` | `imperium-cron/v0.2.0` |

## Release Flow

1. Update `CHANGELOG.md` in the package directory
2. Create and push the tag:

```bash
# Core
git tag v1.2.0
git push origin v1.2.0

# Cron
git tag imperium-cron/v0.2.0
git push origin imperium-cron/v0.2.0
```

3. CI automatically:
   - Detects which package from the tag format
   - Syncs `package.json` version
   - Runs typecheck + tests
   - Builds and publishes to npm
   - Deploys docs to GitHub Pages (core only)
   - Creates a GitHub Release

## Local Verification

```bash
pnpm run typecheck    # typecheck all packages
pnpm run test         # run all tests
pnpm run build        # build all packages
```
