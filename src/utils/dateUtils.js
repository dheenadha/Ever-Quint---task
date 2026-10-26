/**
 * Format a date to a relative time string
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {string} Relative time string (e.g., "2 hours ago", "yesterday")
 */
export function formatRelativeTime(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  
  if (diff < minute) {
    return 'just now';
  } else if (diff < hour) {
    const minutes = Math.floor(diff / minute);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diff < day) {
    const hours = Math.floor(diff / hour);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diff < week) {
    const days = Math.floor(diff / day);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() === new Date().getFullYear() ? undefined : 'numeric'
    });
  }
}

/**
 * Format a date to a full date string
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {string} Formatted date string
 */
export function formatFullDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Get current timestamp
 * @returns {number} Current timestamp in milliseconds
 */
export function getCurrentTimestamp() {
  return Date.now();
}

/**
 * Check if a timestamp is today
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {boolean} True if the timestamp is from today
 */
export function isToday(timestamp) {
  const today = new Date();
  const date = new Date(timestamp);
  
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
}

/**
 * Check if a timestamp is yesterday
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {boolean} True if the timestamp is from yesterday
 */
export function isYesterday(timestamp) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  const date = new Date(timestamp);
  
  return date.getDate() === yesterday.getDate() &&
         date.getMonth() === yesterday.getMonth() &&
         date.getFullYear() === yesterday.getFullYear();
}