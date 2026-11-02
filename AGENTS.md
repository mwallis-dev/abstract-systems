# Project instructions

## Component rebuilds

Before you start a component rebuild, read and follow [.agents/AGENTS.md](.agents/AGENTS.md). That file defines the agreed technology stack for all component rebuilds in this project.

## Checks for local experiments

This is a local experiment project. Keep checks small and relevant to the change.

- For small UI changes, review the changed code. Do not run builds, browser checks, screenshots, or automated tests by default.
- Small UI changes include text, spacing, colours, typography, borders, and simple layout changes.
- Run build or browser checks when Mark asks for them, or when a specific problem requires them.
- For behaviour changes, run only the checks needed to confirm the changed behaviour.
- For dependency or build configuration changes, run the relevant build check.
- Do not start a development server only to check a small UI change.
- Do not ask for permission to skip routine checks.
- In the final response, state briefly which checks ran, or that checks were not run under this policy.
