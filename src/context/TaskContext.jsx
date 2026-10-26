import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTasks } from '../hooks/useTasks.js';
import { useFilters } from '../hooks/useFilters.js';
import { useToast } from '../hooks/useToast.js';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

/**
 * Task Context for global state management
 */
const TaskContext = createContext();

/**
 * Provider component for TaskContext
 */
export function TaskProvider({ children }) {
  // Initialize hooks
  const tasksHook = useTasks();
  const filtersHook = useFilters(tasksHook.tasks);
  const toastHook = useToast();
  
  // Local state for modals and selections
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState(new Set());

  // Load migration status from localStorage
  const [migrationCompleted, setMigrationCompleted] = useLocalStorage('migration_completed', false);

  // Handle migration completion
  useEffect(() => {
    if (tasksHook.tasks.length > 0 && !migrationCompleted) {
      setMigrationCompleted(true);
      toastHook.showInfo('Data has been migrated to the latest version');
    }
  }, [tasksHook.tasks.length, migrationCompleted, setMigrationCompleted, toastHook]);

  // Computed values
  const selectedTask = tasksHook.getTaskById(selectedTaskId);
  const filteredTasks = filtersHook.filteredTasks;
  const hasSelection = selectedTaskIds.size > 0;

  // Task modal handlers
  const openTaskModal = (taskId = null) => {
    setSelectedTaskId(taskId);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setSelectedTaskId(null);
  };

  // Delete modal handlers
  const openDeleteModal = (taskId) => {
    setSelectedTaskId(taskId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedTaskId(null);
  };

  // Selection handlers
  const selectTask = (taskId) => {
    setSelectedTaskIds(prev => {
      const newSet = new Set(prev);
      newSet.add(taskId);
      return newSet;
    });
  };

  const deselectTask = (taskId) => {
    setSelectedTaskIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(taskId);
      return newSet;
    });
  };

  const toggleTaskSelection = (taskId) => {
    setSelectedTaskIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const selectAllTasks = () => {
    const allTaskIds = filteredTasks.map(task => task.id);
    setSelectedTaskIds(new Set(allTaskIds));
  };

  const clearSelection = () => {
    setSelectedTaskIds(new Set());
  };

  // Bulk operations
  const bulkDeleteSelected = async () => {
    const taskIds = Array.from(selectedTaskIds);
    const success = tasksHook.bulkDeleteTasks(taskIds);
    
    if (success) {
      toastHook.showSuccess(`Deleted ${taskIds.length} task(s)`);
      clearSelection();
    } else {
      toastHook.showError('Failed to delete tasks');
    }
  };

  const bulkUpdateStatusSelected = (newStatus) => {
    const taskIds = Array.from(selectedTaskIds);
    const success = tasksHook.bulkUpdateStatus(taskIds, newStatus);
    
    if (success) {
      toastHook.showSuccess(`Moved ${taskIds.length} task(s) to ${newStatus}`);
      clearSelection();
    } else {
      toastHook.showError('Failed to update task status');
    }
  };

  // Task operations with toast feedback
  const createTaskWithToast = (taskData) => {
    const result = tasksHook.createTask(taskData);
    
    if (result.success) {
      toastHook.showSuccess('Task created successfully');
      closeTaskModal();
    } else {
      toastHook.showError('Failed to create task');
    }
    
    return result;
  };

  const updateTaskWithToast = (taskId, updates) => {
    const result = tasksHook.updateTask(taskId, updates);
    
    if (result.success) {
      toastHook.showSuccess('Task updated successfully');
      closeTaskModal();
    } else {
      toastHook.showError('Failed to update task');
    }
    
    return result;
  };

  const deleteTaskWithToast = (taskId) => {
    const result = tasksHook.deleteTask(taskId);
    
    if (result.success) {
      toastHook.showSuccess('Task deleted successfully');
      closeDeleteModal();
    } else {
      toastHook.showError('Failed to delete task');
    }
    
    return result;
  };

  const moveTaskWithToast = (taskId, newStatus) => {
    const result = tasksHook.moveTask(taskId, newStatus);
    
    if (result.success) {
      toastHook.showSuccess(`Task moved to ${newStatus}`);
    } else {
      toastHook.showError('Failed to move task');
    }
    
    return result;
  };

  // Context value
  const contextValue = {
    // Task hooks
    ...tasksHook,
    
    // Filter hooks
    ...filtersHook,
    
    // Toast hooks
    ...toastHook,
    
    // Selection state
    selectedTaskId,
    selectedTask,
    selectedTaskIds,
    isTaskModalOpen,
    isDeleteModalOpen,
    hasSelection,
    
    // Filtered tasks
    filteredTasks,
    
    // Modal handlers
    openTaskModal,
    closeTaskModal,
    openDeleteModal,
    closeDeleteModal,
    
    // Selection handlers
    selectTask,
    deselectTask,
    toggleTaskSelection,
    selectAllTasks,
    clearSelection,
    
    // Task operations with toast
    createTask: createTaskWithToast,
    updateTask: updateTaskWithToast,
    deleteTask: deleteTaskWithToast,
    moveTask: moveTaskWithToast,
    
    // Bulk operations
    bulkDeleteSelected,
    bulkUpdateStatusSelected,
    
    // Migration status
    migrationCompleted
  };

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
}

/**
 * Hook to use TaskContext
 */
export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}

export default TaskContext;