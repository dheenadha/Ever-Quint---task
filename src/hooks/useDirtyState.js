import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Hook for tracking form dirty state and preventing unsaved changes
 * @param {Object} initialValues - Initial form values
 * @param {Function} onSave - Save function
 * @param {Function} onCancel - Cancel function
 * @returns {Object} Dirty state management functions and state
 */
export function useDirtyState(initialValues = {}, onSave, onCancel) {
  const [dirtyFields, setDirtyFields] = useState(new Set());
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  
  const initialRef = useRef(initialValues);
  const formRef = useRef(null);

  // Check if field is dirty
  const isFieldDirty = useCallback((fieldName, currentValue) => {
    const initialValue = initialRef.current[fieldName];
    return currentValue !== initialValue;
  }, []);

  // Mark field as dirty
  const markFieldDirty = useCallback((fieldName, currentValue) => {
    if (isFieldDirty(fieldName, currentValue)) {
      setDirtyFields(prev => {
        const newSet = new Set(prev);
        newSet.add(fieldName);
        return newSet;
      });
      setIsDirty(true);
    } else {
      setDirtyFields(prev => {
        const newSet = new Set(prev);
        newSet.delete(fieldName);
        return newSet;
      });
      setIsDirty(new Set([...dirtyFields]).delete(fieldName).size > 0);
    }
  }, [isFieldDirty, dirtyFields]);

  // Reset dirty state
  const resetDirtyState = useCallback((newInitialValues = {}) => {
    initialRef.current = newInitialValues;
    setDirtyFields(new Set());
    setIsDirty(false);
    setShowWarning(false);
  }, []);

  // Save changes
  const saveChanges = useCallback(async () => {
    if (!isDirty || isSaving) return;

    setIsSaving(true);
    try {
      await onSave();
      resetDirtyState();
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  }, [isDirty, isSaving, onSave, resetDirtyState]);

  // Cancel changes
  const cancelChanges = useCallback(() => {
    if (!isDirty) {
      onCancel();
      return;
    }

    setShowWarning(true);
  }, [isDirty, onCancel]);

  // Confirm cancel
  const confirmCancel = useCallback(() => {
    setShowWarning(false);
    resetDirtyState();
    onCancel();
  }, [onCancel, resetDirtyState]);

  // Dismiss warning
  const dismissWarning = useCallback(() => {
    setShowWarning(false);
  }, []);

  // Handle beforeunload event to warn about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Auto-save on blur for specific fields
  const handleFieldBlur = useCallback((fieldName, currentValue) => {
    if (dirtyFields.has(fieldName) && onSave) {
      // Debounce auto-save
      setTimeout(() => {
        if (dirtyFields.has(fieldName)) {
          saveChanges();
        }
      }, 1000);
    }
  }, [dirtyFields, onSave, saveChanges]);

  // Get dirty field names
  const getDirtyFieldNames = useCallback(() => {
    return Array.from(dirtyFields);
  }, [dirtyFields]);

  // Check if specific field is dirty
  const isSpecificFieldDirty = useCallback((fieldName) => {
    return dirtyFields.has(fieldName);
  }, [dirtyFields]);

  return {
    // State
    isDirty,
    isSaving,
    showWarning,
    dirtyFields: getDirtyFieldNames(),
    dirtyFieldCount: dirtyFields.size,

    // Actions
    markFieldDirty,
    resetDirtyState,
    saveChanges,
    cancelChanges,
    confirmCancel,
    dismissWarning,

    // Utilities
    isFieldDirty: isSpecificFieldDirty,
    handleFieldBlur,
    getDirtyFieldNames
  };
}

/**
 * Hook for tracking general dirty state without form fields
 * @param {boolean} initialDirty - Initial dirty state
 * @returns {Object} Dirty state management
 */
export function useSimpleDirtyState(initialDirty = false) {
  const [isDirty, setIsDirty] = useState(initialDirty);

  const markDirty = useCallback(() => {
    setIsDirty(true);
  }, []);

  const markClean = useCallback(() => {
    setIsDirty(false);
  }, []);

  const toggleDirty = useCallback(() => {
    setIsDirty(prev => !prev);
  }, []);

  return {
    isDirty,
    markDirty,
    markClean,
    toggleDirty
  };
}