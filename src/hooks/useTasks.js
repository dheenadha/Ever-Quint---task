import { useCallback, useEffect, useMemo, useState } from 'react';
import { storageService } from '../services/storageService.js';
import { migrationService } from '../services/migrationService.js';
import { TASK_STATUSES, TASK_PRIORITIES, VALIDATION_RULES } from '../utils/constants.js';
import { getPriorityWeight } from '../utils/priorityUtils.js';
import { getCurrentTimestamp } from '../utils/dateUtils.js';

/**
 * Hook for managing tasks with full CRUD operations and validation
 * @returns {Object} Tasks management functions and state
 */
export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load tasks from storage
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if migration is needed
      const migrationResult = await migrationService.migrateIfNeeded();
      
      if (migrationResult.migrated) {
        console.log(`Data migrated from version ${migrationResult.fromVersion} to ${migrationResult.toVersion}`);
      }

      const storedTasks = storageService.getTasks();
      setTasks(storedTasks);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  // Save tasks to storage
  const saveTasks = useCallback((newTasks) => {
    try {
      const success = storageService.setTasks(newTasks);
      if (success) {
        setTasks(newTasks);
        setError(null);
        return true;
      } else {
        throw new Error('Failed to save tasks');
      }
    } catch (err) {
      console.error('Error saving tasks:', err);
      setError('Failed to save tasks');
      return false;
    }
  }, []);

  // Validate task data
  const validateTask = useCallback((task) => {
    const errors = {};

    // Title validation
    if (!task.title || task.title.trim().length < VALIDATION_RULES.title.minLength) {
      errors.title = `Title must be at least ${VALIDATION_RULES.title.minLength} characters`;
    } else if (task.title.length > VALIDATION_RULES.title.maxLength) {
      errors.title = `Title cannot exceed ${VALIDATION_RULES.title.maxLength} characters`;
    }

    // Description validation
    if (task.description && task.description.length > VALIDATION_RULES.description.maxLength) {
      errors.description = `Description cannot exceed ${VALIDATION_RULES.description.maxLength} characters`;
    }

    // Assignee validation
    if (task.assignee && task.assignee.length > VALIDATION_RULES.assignee.maxLength) {
      errors.assignee = `Assignee name cannot exceed ${VALIDATION_RULES.assignee.maxLength} characters`;
    }

    // Tags validation
    if (task.tags && task.tags.some(tag => tag.length > VALIDATION_RULES.tag.maxLength)) {
      errors.tags = `Each tag cannot exceed ${VALIDATION_RULES.tag.maxLength} characters`;
    }

    // Status validation
    if (!Object.values(TASK_STATUSES).includes(task.status)) {
      errors.status = 'Invalid status';
    }

    // Priority validation
    if (!Object.values(TASK_PRIORITIES).includes(task.priority)) {
      errors.priority = 'Invalid priority';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }, []);

  // Create new task
  const createTask = useCallback((taskData) => {
    const validation = validateTask(taskData);
    
    if (!validation.isValid) {
      setError('Validation failed');
      return { success: false, errors: validation.errors };
    }

    const newTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...taskData,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    };

    const newTasks = [...tasks, newTask];
    const success = saveTasks(newTasks);

    return {
      success,
      task: success ? newTask : null,
      errors: success ? null : validation.errors
    };
  }, [tasks, validateTask, saveTasks]);

  // Update existing task
  const updateTask = useCallback((taskId, updates) => {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) {
      setError('Task not found');
      return { success: false };
    }

    const currentTask = tasks[taskIndex];
    const updatedTask = {
      ...currentTask,
      ...updates,
      updatedAt: getCurrentTimestamp()
    };

    const validation = validateTask(updatedTask);
    
    if (!validation.isValid) {
      setError('Validation failed');
      return { success: false, errors: validation.errors };
    }

    const newTasks = [...tasks];
    newTasks[taskIndex] = updatedTask;
    
    const success = saveTasks(newTasks);

    return {
      success,
      task: success ? updatedTask : null,
      errors: success ? null : validation.errors
    };
  }, [tasks, validateTask, saveTasks]);

  // Delete task
  const deleteTask = useCallback((taskId) => {
    const newTasks = tasks.filter(task => task.id !== taskId);
    const success = saveTasks(newTasks);
    
    return { success };
  }, [tasks, saveTasks]);

  // Move task between columns
  const moveTask = useCallback((taskId, newStatus) => {
    return updateTask(taskId, { status: newStatus });
  }, [updateTask]);

  // Bulk operations
  const bulkUpdateStatus = useCallback((taskIds, newStatus) => {
    const newTasks = tasks.map(task => 
      taskIds.includes(task.id) 
        ? { ...task, status: newStatus, updatedAt: getCurrentTimestamp() }
        : task
    );
    
    const success = saveTasks(newTasks);
    return { success };
  }, [tasks, saveTasks]);

  const bulkDeleteTasks = useCallback((taskIds) => {
    const newTasks = tasks.filter(task => !taskIds.includes(task.id));
    const success = saveTasks(newTasks);
    return { success };
  }, [tasks, saveTasks]);

  // Get tasks by status
  const getTasksByStatus = useCallback((status) => {
    return tasks.filter(task => task.status === status);
  }, [tasks]);

  // Get task by ID
  const getTaskById = useCallback((taskId) => {
    return tasks.find(task => task.id === taskId) || null;
  }, [tasks]);

  // Initialize tasks on mount
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Computed values
  const taskCounts = useMemo(() => ({
    backlog: tasks.filter(task => task.status === TASK_STATUSES.BACKLOG).length,
    inProgress: tasks.filter(task => task.status === TASK_STATUSES.IN_PROGRESS).length,
    done: tasks.filter(task => task.status === TASK_STATUSES.DONE).length
  }), [tasks]);

  const hasTasks = tasks.length > 0;
  const hasCompletedTasks = tasks.some(task => task.status === TASK_STATUSES.DONE);

  return {
    // State
    tasks,
    loading,
    error,
    taskCounts,
    hasTasks,
    hasCompletedTasks,

    // CRUD operations
    createTask,
    updateTask,
    deleteTask,
    moveTask,

    // Bulk operations
    bulkUpdateStatus,
    bulkDeleteTasks,

    // Query methods
    getTasksByStatus,
    getTaskById,

    // Utilities
    validateTask,
    reload: loadTasks
  };
}