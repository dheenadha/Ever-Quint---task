import { STORAGE_KEYS, SCHEMA_VERSIONS } from '../utils/constants.js';

/**
 * Storage service for managing localStorage operations
 */
class StorageService {
  /**
   * Get data from localStorage
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if key doesn't exist
   * @returns {*} Parsed data or default value
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item);
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return defaultValue;
    }
  }

  /**
   * Save data to localStorage
   * @param {string} key - Storage key
   * @param {*} data - Data to save
   * @returns {boolean} Success status
   */
  set(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`Error saving to localStorage key "${key}":`, error);
      return false;
    }
  }

  /**
   * Remove item from localStorage
   * @param {string} key - Storage key
   * @returns {boolean} Success status
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage key "${key}":`, error);
      return false;
    }
  }

  /**
   * Clear all localStorage data for the app
   * @returns {boolean} Success status
   */
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  /**
   * Get current schema version
   * @returns {number} Current schema version
   */
  getSchemaVersion() {
    return this.get(STORAGE_KEYS.SCHEMA_VERSION, SCHEMA_VERSIONS.V1);
  }

  /**
   * Set schema version
   * @param {number} version - Schema version
   * @returns {boolean} Success status
   */
  setSchemaVersion(version) {
    return this.set(STORAGE_KEYS.SCHEMA_VERSION, version);
  }

  /**
   * Get tasks data with migration support
   * @returns {Array} Array of tasks
   */
  getTasks() {
    const rawTasks = this.get(STORAGE_KEYS.TASKS, []);
    const currentVersion = this.getSchemaVersion();
    
    // If no schema version exists, this is legacy data
    if (!this.hasSchemaVersion()) {
      return this.migrateLegacyTasks(rawTasks);
    }
    
    return rawTasks;
  }

  /**
   * Save tasks data
   * @param {Array} tasks - Array of tasks
   * @returns {boolean} Success status
   */
  setTasks(tasks) {
    return this.set(STORAGE_KEYS.TASKS, tasks);
  }

  /**
   * Check if schema version exists
   * @returns {boolean} True if schema version is set
   */
  hasSchemaVersion() {
    return localStorage.getItem(STORAGE_KEYS.SCHEMA_VERSION) !== null;
  }

  /**
   * Migrate legacy tasks to current schema
   * @param {Array} tasks - Legacy tasks array
   * @returns {Array} Migrated tasks array
   */
  migrateLegacyTasks(tasks) {
    if (!Array.isArray(tasks)) {
      return [];
    }

    const migratedTasks = tasks.map(task => {
      // Add missing fields for legacy tasks
      const migratedTask = { ...task };
      
      // Add default values for new fields
      if (!migratedTask.tags) {
        migratedTask.tags = [];
      }
      
      if (!migratedTask.assignee) {
        migratedTask.assignee = '';
      }
      
      if (!migratedTask.createdAt) {
        migratedTask.createdAt = new Date().toISOString();
      }
      
      if (!migratedTask.updatedAt) {
        migratedTask.updatedAt = new Date().toISOString();
      }

      return migratedTask;
    });

    // Update schema version
    this.setSchemaVersion(SCHEMA_VERSIONS.V1);
    this.setTasks(migratedTasks);

    return migratedTasks;
  }

  /**
   * Check if storage is available
   * @returns {boolean} True if localStorage is available
   */
  isAvailable() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Get storage usage info
   * @returns {Object} Storage usage information
   */
  getUsageInfo() {
    if (!this.isAvailable()) {
      return { available: false, used: 0, total: 0, percentage: 0 };
    }

    let used = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length;
      }
    }

    // Estimate total storage (typically 5-10MB)
    const total = 5 * 1024 * 1024; // 5MB estimate
    const percentage = Math.round((used / total) * 100);

    return {
      available: true,
      used,
      total,
      percentage
    };
  }
}

// Create and export singleton instance
export const storageService = new StorageService();

// Export class for testing
export default StorageService;