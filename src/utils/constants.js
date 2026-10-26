// Task statuses
export const TASK_STATUSES = {
  BACKLOG: 'Backlog',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done'
};

// Task priorities
export const TASK_PRIORITIES = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High'
};

// Storage keys
export const STORAGE_KEYS = {
  TASKS: 'team_workflow_tasks',
  SCHEMA_VERSION: 'team_workflow_schema_version'
};

// Schema versions
export const SCHEMA_VERSIONS = {
  V1: 1,
  V2: 2
};

// Default task data
export const DEFAULT_TASK = {
  title: '',
  description: '',
  status: TASK_STATUSES.BACKLOG,
  priority: TASK_PRIORITIES.MEDIUM,
  assignee: '',
  tags: []
};

// Priority colors for styling
export const PRIORITY_COLORS = {
  [TASK_PRIORITIES.LOW]: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200'
  },
  [TASK_PRIORITIES.MEDIUM]: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200'
  },
  [TASK_PRIORITIES.HIGH]: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200'
  }
};

// Status colors for styling
export const STATUS_COLORS = {
  [TASK_STATUSES.BACKLOG]: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200'
  },
  [TASK_STATUSES.IN_PROGRESS]: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200'
  },
  [TASK_STATUSES.DONE]: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200'
  }
};

// Validation rules
export const VALIDATION_RULES = {
  title: {
    minLength: 2,
    maxLength: 100
  },
  description: {
    maxLength: 500
  },
  assignee: {
    maxLength: 50
  },
  tag: {
    maxLength: 20
  }
};

// Sorting options
export const SORT_OPTIONS = {
  CREATED_AT: 'created_at',
  UPDATED_AT: 'updated_at',
  PRIORITY: 'priority',
  TITLE: 'title'
};

// Filter keys for URL params
export const FILTER_KEYS = {
  STATUS: 'status',
  PRIORITY: 'priority',
  SEARCH: 'search',
  SORT: 'sort'
};