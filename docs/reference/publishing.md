# Publishing

Imperium is prepared for npm publication under the MIT license.

## Prerequisites

- Node.js 20+
- pnpm 10+
- npm token with publish permissions

## Local Prepublish Checklist

From repo root:

```bash
pnpm install
pnpm --filter @cryppex/imperium run typecheck
pnpm --filter @cryppex/imperium run build
pnpm --filter @cryppex/imperium pack
```

## Publish from Local Machine

```bash
pnpm --filter @cryppex/imperium publish --access public --no-git-checks
```

## GitHub Workflow: Package Publish

`.github/workflows/imperium-publish.yml` supports:

- Tag push: `imperium-v*`
- Manual run (`workflow_dispatch`) with optional dry-run

It performs:

1. `pnpm install`
2. `typecheck`
3. `build`
4. `publish` (or `pack` in dry-run)

Required secret:

- `NPM_TOKEN`

## GitHub Workflow: Docs Publish

`.github/workflows/imperium-docs.yml` builds docs with VitePress and deploys to GitHub Pages.

Trigger:

- push to `main` for docs/package changes
- manual run

The workflow sets `DOCS_BASE=/<repo>/` automatically for project pages.

## Versioning Recommendation

Before each publish:

1. bump `packages/imperium/package.json` version
2. update `packages/imperium/CHANGELOG.md`
3. create tag (`imperium-vX.Y.Z`)
