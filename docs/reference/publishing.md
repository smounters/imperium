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
pnpm run typecheck
pnpm run build
pnpm pack
```

## Publish from Local Machine

```bash
pnpm publish --access public --no-git-checks
```

## GitHub Workflow: Unified Publish

`.github/workflows/publish.yml` handles package publish and docs deploy.

- Trigger: tag push `v*.*.*`

It performs:

1. `pnpm install`
2. `typecheck`
3. `build`
4. `publish` to npm
5. `build` + deploy docs to GitHub Pages

Required secret:

- `NPM_TOKEN`

The workflow sets `DOCS_BASE=/<repo>/` automatically for project pages.

## Versioning Model

Package version is derived from the git tag during CI publish:

1. update `CHANGELOG.md`
2. create and push tag (`vX.Y.Z`)
3. workflow syncs `package.json` version to the tag and publishes
