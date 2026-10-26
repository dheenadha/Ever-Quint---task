import { SCHEMA_VERSIONS, TASK_STATUSES } from '../utils/constants.js';
import { storageService } from './storageService.js';

/**
 * Migration service for handling data schema migrations
 */
class MigrationService {
  /**
   * Check if migration is needed and perform if necessary
   * @returns {Object} Migration result
   */
  async migrateIfNeeded() {
    const currentVersion = storageService.getSchemaVersion();
    const latestVersion = SCHEMA_VERSIONS.V2;

    if (currentVersion >= latestVersion) {
      return { migrated: false, version: currentVersion };
    }

    try {
      // Create backup before migration
      this.createBackup();

      const tasks = storageService.getTasks();
      const migratedTasks = this.migrateTasks(tasks, currentVersion, latestVersion);
      
      // Save migrated data
      storageService.setTasks(migratedTasks);
      storageService.setSchemaVersion(latestVersion);

      // Clean up old backups
      this.cleanupBackups();

      return {
        migrated: true,
        fromVersion: currentVersion,
        toVersion: latestVersion,
        taskCount: migratedTasks.length
      };
    } catch (error) {
      console.error('Migration failed:', error);
      throw new Error(`Migration from version ${currentVersion} failed: ${error.message}`);
    }
  }

  /**
   * Migrate tasks from one version to another
   * @param {Array} tasks - Current tasks array
   * @param {number} fromVersion - Source version
   * @param {number} toVersion - Target version
   * @returns {Array} Migrated tasks array
   */
  migrateTasks(tasks, fromVersion, toVersion) {
    if (fromVersion === SCHEMA_VERSIONS.V1 && toVersion === SCHEMA_VERSIONS.V2) {
      return this.migrateV1ToV2(tasks);
    }
    
    // If no specific migration path, return tasks as-is
    return tasks;
  }

  /**
   * Migrate from schema version 1 to version 2
   * Version 1: { id, title, status }
   * Version 2: { id, title, description, status, priority, assignee, tags, createdAt, updatedAt }
   * @param {Array} tasks - V1 tasks array
   * @returns {Array} V2 tasks array
   */
  migrateV1ToV2(tasks) {
    const timestamp = Date.now();
    let migratedCount = 0;
    
    const migratedTasks = tasks.map(task => {
      // Check if task needs migration (missing new fields)
      const needsMigration = !task.description || !task.priority || !task.assignee || !task.tags;
      
      if (needsMigration) migratedCount++;

      return {
        id: task.id,
        title: task.title,
        description: task.description || '', // New field with default
        status: this.normalizeStatus(task.status),
        priority: task.priority || 'Medium', // New field with default
        assignee: task.assignee || '', // New field with default
        tags: task.tags || [], // New field with default
        createdAt: task.createdAt || timestamp, // New field with default
        updatedAt: task.updatedAt || timestamp // New field with default
      };
    });

    if (migratedCount > 0) {
      console.log(`Migrated ${migratedCount} tasks from V1 to V2 schema`);
    }

    return migratedTasks;
  }

  /**
   * Normalize status values from older versions
   * @param {string} status - Status from old schema
   * @returns {string} Normalized status
   */
  normalizeStatus(status) {
    if (!status) return TASK_STATUSES.BACKLOG;
    
    const normalized = status.toLowerCase().trim();
    
    switch (normalized) {
      case 'backlog':
      case 'todo':
        return TASK_STATUSES.BACKLOG;
      case 'in progress':
      case 'progress':
      case 'doing':
        return TASK_STATUSES.IN_PROGRESS;
      case 'done':
      case 'completed':
      case 'finished':
        return TASK_STATUSES.DONE;
      default:
        console.warn(`Unknown status "${status}", defaulting to Backlog`);
        return TASK_STATUSES.BACKLOG;
    }
  }

  /**
   * Create a backup of current data before migration
   * @returns {boolean} Success status
   */
  createBackup() {
    try {
      const tasks = storageService.getTasks();
      const version = storageService.getSchemaVersion();
      const timestamp = Date.now();
      
      const backupData = {
        version,
        tasks,
        createdAt: timestamp,
        type: 'backup'
      };
      
      localStorage.setItem(`team_workflow_backup_${timestamp}`, JSON.stringify(backupData));
      console.log('Created backup before migration');
      return true;
    } catch (error) {
      console.error('Failed to create backup:', error);
      return false;
    }
  }

  /**
   * Get all available backups
   * @returns {Array} Array of backup objects
   */
  getBackups() {
    const backups = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('team_workflow_backup_')) {
        try {
          const backup = JSON.parse(localStorage.getItem(key));
          if (backup && backup.type === 'backup') {
            backups.push(backup);
          }
        } catch (error) {
          console.warn(`Failed to parse backup ${key}:`, error);
        }
      }
    }
    
    // Sort by creation date (newest first)
    return backups.sort((a, b) => b.createdAt - a.createdAt);
  }

  /**
   * Restore from a specific backup
   * @param {number} timestamp - Backup timestamp
   * @returns {boolean} Success status
   */
  restoreFromBackup(timestamp) {
    try {
      const key = `team_workflow_backup_${timestamp}`;
      const backupData = JSON.parse(localStorage.getItem(key));
      
      if (!backupData || backupData.type !== 'backup') {
        throw new Error('Invalid backup data');
      }
      
      // Create backup of current data before restoring
      this.createBackup();
      
      // Restore data
      storageService.setTasks(backupData.tasks);
      storageService.setSchemaVersion(backupData.version);
      
      console.log(`Restored data from backup created on ${new Date(backupData.createdAt).toLocaleString()}`);
      return true;
    } catch (error) {
      console.error('Failed to restore from backup:', error);
      return false;
    }
  }

  /**
   * Clean up old backups (keep last 5)
   * @returns {boolean} Success status
   */
  cleanupBackups() {
    try {
      const backups = this.getBackups();
      
      // Keep only the 5 most recent backups
      const toRemove = backups.slice(5);
      
      toRemove.forEach(backup => {
        const key = `team_workflow_backup_${backup.createdAt}`;
        localStorage.removeItem(key);
      });

      if (toRemove.length > 0) {
        console.log(`Cleaned up ${toRemove.length} old backups`);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to cleanup backups:', error);
      return false;
    }
  }

  /**
   * Get migration status and statistics
   * @returns {Object} Migration status information
   */
  getMigrationStatus() {
    const currentVersion = storageService.getSchemaVersion();
    const tasks = storageService.getTasks();
    const backups = this.getBackups();

    return {
      currentVersion,
      latestVersion: SCHEMA_VERSIONS.V2,
      isUpToDate: currentVersion >= SCHEMA_VERSIONS.V2,
      taskCount: tasks.length,
      backupCount: backups.length,
      lastBackup: backups.length > 0 ? new Date(backups[0].createdAt) : null,
      needsMigration: currentVersion < SCHEMA_VERSIONS.V2
    };
  }
}

// Create and export singleton instance
export const migrationService = new MigrationService();

// Export class for testing
export default MigrationService;
