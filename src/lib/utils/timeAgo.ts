/**
 * Converts a date string to a human-readable "time ago" format
 * @param timestamp - ISO date string or Date object
 * @returns Formatted time ago string (e.g., "just now", "2m ago", "3h ago", "1d ago")
 */
export function timeAgo(timestamp: string | Date | undefined): string {
  if (!timestamp) return "";

  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    return `${mins}m ago`;
  }
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return `${hours}h ago`;
  }
  if (seconds < 604800) {
    const days = Math.floor(seconds / 86400);
    return `${days}d ago`;
  }
  if (seconds < 2592000) {
    const weeks = Math.floor(seconds / 604800);
    return `${weeks}w ago`;
  }
  if (seconds < 31536000) {
    const months = Math.floor(seconds / 2592000);
    return `${months}mo ago`;
  }
  const years = Math.floor(seconds / 31536000);
  return `${years}y ago`;
}
