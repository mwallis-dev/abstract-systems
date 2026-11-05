# GitHub activity layout

Mark chose Strip after comparing three versions in the prototype picker.

- **Strip** uses one row of 30 equal tiles. The heading and 30-day total sit above the row. Green shades show the daily counts.
- **Latest** adds the date and count for the most recent active day above the strip.
- **Bars** uses bar height to show the daily counts.

The lab uses the Strip layout on the standalone GitHub activity page.

## Live data

The page shows GitHub contribution counts for today and the previous 29 UTC dates. Counts include public and private contributions available to the account. GitHub contribution rules still apply; this is not a count of every account action.

The local Vite server calls GitHub GraphQL. Only dates and counts reach the browser. The server caches counts for five minutes. Static hosting needs a server endpoint at `/api/github-activity`.

### Set up access

1. Create a classic personal access token for the account shown in the graph. Select `read:user` and set an expiry date. Repository access is not needed for this calendar query.
2. Open `.env.local` in the project root. Paste the token after `GITHUB_TOKEN=` and save.
3. Restart the local server with `pnpm dev` and reload the page.

`.env.local` is excluded from Git. Never use a `VITE_` prefix for the token, because Vite exposes those values to the browser.

The account is set by `username` in `lab/config/github-activity.json`. Restart the local server after a change. Each tooltip uses the format `3 NOV: 7 CONTRIBUTIONS`.

Sources: [GitHub contribution API](https://docs.github.com/en/graphql/reference/users), [GitHub token setup](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).
