---
name: publish-playground
description: Publish this Abstract Systems playground to GitHub and Vercel, open a PR when requested, or revert a published change. Use for requests to ship, publish, push and deploy, create a PR, or undo a release in this repository.
---

# Publish the playground

## Project

- Repository: https://github.com/mwallis-dev/abstract-systems
- Default publishing target: `origin/main`.
- Vercel project: https://vercel.com/markjohnwallis-4777s-projects/abstract-systems
- Live website: https://abstract-systems.vercel.app/
- This small HTML/CSS playground uses Vite. Read `package.json` for current scripts; the checked-in lockfile is `pnpm-lock.yaml`.
- Verified on 2026-10-15: Vercel is connected to this repository, tracks `main` for production, and automatically assigns production domains. A push triggers deployment; no separate Vercel CLI deployment or GitHub Actions pipeline is needed.

## Choose the workflow

Default to a direct commit and push to `main` when asked to publish, ship, or deploy. The user prefers this simple workflow and accepts reverting changes if needed. Do not require a PR, preview approval, or a second confirmation for an already requested publish. An editing request alone does not request publishing. A request only to commit stays local; a request only to create a PR does not authorize merging it.

Apply this skill only in this repository. Verify the Git root and `origin` before writing or pushing; HTTPS and SSH remotes identifying `mwallis-dev/abstract-systems` are valid. If they identify another repository, stop and clarify.

## Publish

1. Inspect the branch, working tree, staged changes, and diff. Select files belonging to the requested release. Preserve unrelated work and staged changes; avoid blanket staging that could include unrelated files or credentials. Ask about scope only if ambiguous.
2. Fetch `origin` and inspect incoming and outgoing commits. On `main`, fast-forward if needed and compatible with local work. On another branch, inspect its relationship to `origin/main` and integrate only the requested work through a normal merge or selected commits, preserving work in other checkouts. Do not push unrelated branch history to `main`. Resolve routine conflicts within scope; stop if the intended result is unclear. Never force-push or discard local changes.
3. Run the production build with the current package manager (`pnpm build` with the existing lockfile). Install missing dependencies using the lockfile without upgrading them. For visual changes, check the relevant rendered page when browser access is available. Fix build failures within scope before pushing. If the runtime is unavailable, report the concrete blocker rather than claiming validation passed.
4. Review the final diff, stage the selected paths, and commit with a concise descriptive message. Inspect existing unpublished commits before including them. If there are neither changes nor unpublished commits, report that there is nothing to publish.
5. Push the intended commit to `origin/main`. If rejected because the remote advanced, fetch and reconcile once, rerun validation if source changed, and retry normally. Stop if rejection repeats or authentication, branch rules, or permissions block the push. Do not bypass protections or repeatedly retry unchanged failures.
6. Confirm remote `main` matches the pushed SHA. Use available GitHub deployment/check status or the signed-in Vercel dashboard to verify that the production deployment for that commit reaches Ready and serves the production domain. Open the live site for a basic smoke check. HTTP success alone does not prove the new commit deployed. Bound status checks to five minutes with waits no longer than 60 seconds; accurately report pending, failed, or unverifiable status. Do not trigger a duplicate deployment just because status is unavailable.
7. Report the commit, validation result, deployment status, and live website link. Distinguish a successful push from a verified successful deployment.

Use available authenticated Git transport. GitHub CLI is optional for direct publishing. If credentials are missing, ask the user to sign in through the normal tool or application flow; never store tokens in this skill or tracked files.

## Optional pull request

When explicitly asked for a PR, use a descriptive `codex/` branch, build and commit selected work, push the branch, and open a PR against `main` through an available authenticated GitHub tool or CLI. Include a concise description and validation result. Reuse an existing PR for the branch. Attach the PR to this chat with `attach_artifact` when available and return its URL. Identify any Vercel branch deployment as a preview.

Merge only when requested or already authorized in the current task. Check current changes, head commit, and required checks before merging; use squash merge and remove the source branch if appropriate. Respect repository rules. Verify the resulting production commit and deployment as above. If GitHub tooling is unavailable, explain the missing capability; a pushed branch is not an opened PR.

## Undo a published change

Identify the offending commit or PR from history and the user's description. Ask only if the target is ambiguous. Revert the selected change with a new commit, build, push normally to `main`, and verify deployment. Preserve history; do not reset published history or force-push. Inspect merge commits before choosing the parent. If conflicts with later work have an unclear resolution, stop and explain.

A Vercel-only rollback restores a deployment without reverting Git. Use it when specifically requested; explain any remaining repository mismatch and inspect Vercel's current promotion state before the next publish. Do not silently roll back another release after a deployment failure.
