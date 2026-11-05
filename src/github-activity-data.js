export async function fetchContributions() {
  const response = await fetch('/api/github-activity', { signal: AbortSignal.timeout(20000) });
  if (!response.headers.get('content-type')?.includes('application/json')) {
    throw new Error('The contribution service is unavailable. Start the local server.');
  }
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Could not load contributions. Try again.');
  if (!Array.isArray(result.days) || result.days.length !== 30 || result.days.some((day) => (
    !/^\d{4}-\d{2}-\d{2}$/.test(day.date) || !Number.isInteger(day.count) || day.count < 0
  ))) {
    throw new Error('The contribution service returned invalid data.');
  }
  return result;
}
