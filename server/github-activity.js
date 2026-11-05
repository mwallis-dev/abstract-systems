export function githubActivityPlugin({ token, username, fetcher = fetch, clock = () => new Date() }) {
  let cached;

  async function handle(req, res, next) {
    if (req.url?.split('?')[0] !== '/api/github-activity') return next();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');
    const send = (code, body) => {
      res.statusCode = code;
      res.end(JSON.stringify(body));
    };
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return send(405, { error: 'Use GET to load contributions.' });
    }
    if (!token) return send(503, { error: 'Add GITHUB_TOKEN to .env.local, then restart the local server.' });
    const now = clock();
    const today = now.toISOString().slice(0, 10);
    if (cached?.date === today && now.getTime() - cached.time < 300000) return send(200, cached.body);
    const start = new Date(`${today}T00:00:00Z`);
    start.setUTCDate(start.getUTCDate() - 29);
    try {
      const response = await fetcher('https://api.github.com/graphql', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(15000),
        body: JSON.stringify({
          query: `query($login: String!, $from: DateTime!, $to: DateTime!) {
            viewer { login }
            user(login: $login) {
              contributionsCollection(from: $from, to: $to) {
                contributionCalendar { weeks { contributionDays { date contributionCount } } }
              }
            }
          }`,
          variables: { login: username, from: start.toISOString(), to: now.toISOString() },
        }),
      });
      if (response.status === 401) return send(502, { error: 'GitHub token is invalid or expired. Update .env.local and restart the local server.' });
      if (!response.ok) return send(502, { error: 'GitHub could not load contributions. Try again later.' });
      const scopes = response.headers.get('x-oauth-scopes')?.split(',').map((scope) => scope.trim());
      if (!scopes?.some((scope) => scope === 'read:user' || scope === 'user')) {
        return send(502, { error: 'Use a classic GitHub token with read:user access to include private contributions.' });
      }
      const result = await response.json();
      if (result.errors?.length || !result.data?.user) return send(502, { error: 'GitHub could not return the contribution calendar. Check the account and token access.' });
      if (result.data.viewer?.login.toLowerCase() !== username.toLowerCase()) {
        return send(502, { error: 'The GitHub token must belong to the account shown in the graph.' });
      }
      const weeks = result.data.user.contributionsCollection?.contributionCalendar?.weeks;
      if (!Array.isArray(weeks)) throw new Error('Invalid calendar');
      const byDate = new Map(weeks.flatMap((week) => week.contributionDays).map((day) => [day.date, day.contributionCount]));
      const days = Array.from({ length: 30 }, (_, index) => {
        const date = new Date(start);
        date.setUTCDate(date.getUTCDate() + index);
        const key = date.toISOString().slice(0, 10);
        const count = byDate.get(key);
        if (!Number.isInteger(count) || count < 0) throw new Error('Missing contribution count');
        return { date: key, count };
      });
      const body = { days };
      cached = { date: today, time: now.getTime(), body };
      return send(200, body);
    } catch (error) {
      return send(502, { error: error.name === 'TimeoutError'
        ? 'GitHub took too long to respond. Try again.'
        : 'Could not load GitHub contributions. Try again later.' });
    }
  }

  return {
    name: 'github-activity',
    configureServer(server) { server.middlewares.use(handle); },
    configurePreviewServer(server) { server.middlewares.use(handle); },
  };
}
