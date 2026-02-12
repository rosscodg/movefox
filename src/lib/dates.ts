/**
 * Shared date / time formatting utilities.
 * All functions use the `en-GB` locale for UK-style output.
 */

/** e.g. "12 Feb 2026" */
export function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'Flexible';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** e.g. "12 Feb 2026, 18:30" */
export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** e.g. "5m ago", "3h ago", "2d ago" */
export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
