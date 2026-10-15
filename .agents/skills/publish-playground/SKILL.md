---
name: publish-playground
description: Commit and push this Abstract Systems playground directly to main, without build, browser, or deployment checks. Use when asked to publish, ship, push, or deploy this project; also supports an explicitly requested PR or revert.
---

# Publish the playground

Repository: https://github.com/mwallis-dev/abstract-systems
Target: `origin/main`
Live website: https://abstract-systems.vercel.app/

This is a personal learning playground. The user prioritizes speed and handles visual inspection and deployment monitoring. Vercel automatically deploys pushes to `main`.

## Default workflow

When asked to publish, ship, push, or deploy, commit and push directly to `main`. Invoking this skill without further instructions means publish the current changes. A request only to commit stays local. An editing request alone does not authorize publishing.

1. Check the repository, remote, branch, working tree, and diff only as needed to identify the requested changes and write a commit message. Accept HTTPS or SSH remotes for `mwallis-dev/abstract-systems`; stop if the repository differs. Preserve unrelated work and staged changes. Stage the intended files explicitly; ask about scope only when ambiguous.
2. Commit with a short descriptive message. Include already committed work only after confirming it belongs to the request. If nothing needs committing or pushing, report that briefly.
3. Push to `origin/main` using normal authenticated Git. On another branch, integrate only the intended work into `main` while preserving other work. Do not force-push, discard changes, or include unrelated branch history. If the remote rejects the push because it advanced, fetch and reconcile once where straightforward, then retry. Stop for unclear conflicts, repeated rejection, missing authentication, or branch restrictions.
4. Report the commit and whether the push succeeded. Stop after a successful push; no separate remote SHA check is required. Provide the live website link without claiming the deployment completed.

Do not run builds, tests, linters, dependency installs, local preview servers, browser inspection, screenshots, or GitHub/Vercel deployment checks as part of publishing unless the user explicitly requests them. Do not wait for deployment, trigger a separate Vercel deploy, or ask for a second confirmation when publishing is already authorized. A successful push completes this workflow.

## Only when explicitly requested

- **PR:** Create a descriptive `codex/` branch, commit and push the intended files, and open or reuse a PR against `main` with available authenticated GitHub tooling. Attach it to this chat with `attach_artifact` when available. Return the PR URL. Do not merge unless authorized. Respect required repository checks without adding local checks or deployment monitoring.
- **Revert:** Identify the requested commit and create a revert commit, then push normally to `main`. Preserve published history. Ask if the target or conflict resolution is unclear. No build or deployment verification is needed.

Use existing authentication; never store credentials in tracked files. Explain concrete Git or permission blockers briefly. Do not bypass repository protections.
