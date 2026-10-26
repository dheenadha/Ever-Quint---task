import { TASK_PRIORITIES } from './constants.js';

/**
 * Get priority weight for sorting (higher number = higher priority)
 * @param {string} priority - Priority level
 * @returns {number} Weight for sorting
 */
export function getPriorityWeight(priority) {
  switch (priority) {
    case TASK_PRIORITIES.HIGH:
      return 3;
    case TASK_PRIORITIES.MEDIUM:
      return 2;
    case TASK_PRIORITIES.LOW:
      return 1;
    default:
      return 0;
  }
}

/**
 * Get next priority level (for cycling through priorities)
 * @param {string} currentPriority - Current priority
 * @returns {string} Next priority level
 */
export function getNextPriority(currentPriority) {
  switch (currentPriority) {
    case TASK_PRIORITIES.LOW:
      return TASK_PRIORITIES.MEDIUM;
    case TASK_PRIORITIES.MEDIUM:
      return TASK_PRIORITIES.HIGH;
    case TASK_PRIORITIES.HIGH:
      return TASK_PRIORITIES.LOW;
    default:
      return TASK_PRIORITIES.MEDIUM;
  }
}

/**
 * Get previous priority level (for cycling through priorities)
 * @param {string} currentPriority - Current priority
 * @returns {string} Previous priority level
 */
export function getPreviousPriority(currentPriority) {
  switch (currentPriority) {
    case TASK_PRIORITIES.LOW:
      return TASK_PRIORITIES.HIGH;
    case TASK_PRIORITIES.MEDIUM:
      return TASK_PRIORITIES.LOW;
    case TASK_PRIORITIES.HIGH:
      return TASK_PRIORITIES.MEDIUM;
    default:
      return TASK_PRIORITIES.MEDIUM;
  }
}

/**
 * Validate if a priority value is valid
 * @param {string} priority - Priority to validate
 * @returns {boolean} True if valid priority
 */
export function isValidPriority(priority) {
  return Object.values(TASK_PRIORITIES).includes(priority);
}

/**
 * Get priority display name
 * @param {string} priority - Priority value
 * @returns {string} Display name for the priority
 */
export function getPriorityDisplayName(priority) {
  switch (priority) {
    case TASK_PRIORITIES.LOW:
      return 'Low';
    case TASK_PRIORITIES.MEDIUM:
      return 'Medium';
    case TASK_PRIORITIES.HIGH:
      return 'High';
    default:
      return 'Unknown';
  }
}

/**
 * Get priority abbreviation
 * @param {string} priority - Priority value
 * @returns {string} Abbreviation for the priority
 */
export function getPriorityAbbreviation(priority) {
  switch (priority) {
    case TASK_PRIORITIES.LOW:
      return 'L';
    case TASK_PRIORITIES.MEDIUM:
      return 'M';
    case TASK_PRIORITIES.HIGH:
      return 'H';
    default:
      return '?';
  }
}