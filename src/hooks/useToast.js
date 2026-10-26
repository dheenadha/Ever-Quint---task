import { useCallback, useState } from 'react';

/**
 * Hook for managing toast notifications
 * @returns {Object} Toast management functions and state
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  // Add a new toast
  const showToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    
    const toast = {
      id,
      message,
      type,
      duration,
      isVisible: true
    };

    setToasts(prevToasts => [...prevToasts, toast]);

    // Auto-dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        dismissToast(id);
      }, duration);
    }

    return id;
  }, []);

  // Dismiss a specific toast
  const dismissToast = useCallback((id) => {
    setToasts(prevToasts => 
      prevToasts.map(toast => 
        toast.id === id 
          ? { ...toast, isVisible: false }
          : toast
      )
    );

    // Remove from array after animation
    setTimeout(() => {
      setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, 300);
  }, []);

  // Dismiss all toasts
  const dismissAllToasts = useCallback(() => {
    setToasts(prevToasts => 
      prevToasts.map(toast => ({ ...toast, isVisible: false }))
    );

    setTimeout(() => {
      setToasts([]);
    }, 300);
  }, []);

  // Convenience methods for different toast types
  const showSuccess = useCallback((message, duration) => {
    return showToast(message, 'success', duration);
  }, [showToast]);

  const showError = useCallback((message, duration) => {
    return showToast(message, 'error', duration);
  }, [showToast]);

  const showWarning = useCallback((message, duration) => {
    return showToast(message, 'warning', duration);
  }, [showToast]);

  const showInfo = useCallback((message, duration) => {
    return showToast(message, 'info', duration);
  }, [showToast]);

  return {
    // State
    toasts,

    // Core methods
    showToast,
    dismissToast,
    dismissAllToasts,

    // Convenience methods
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
}

/**
 * Hook for managing a single toast with auto-dismiss
 * @param {string} message - Toast message
 * @param {string} type - Toast type
 * @param {number} duration - Auto-dismiss duration
 * @returns {Object} Toast state and dismiss function
 */
export function useSingleToast(message, type = 'info', duration = 5000) {
  const [isVisible, setIsVisible] = useState(!!message);

  const dismiss = useCallback(() => {
    setIsVisible(false);
  }, []);

  // Auto-dismiss after duration
  React.useEffect(() => {
    if (message && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  // Reset visibility when message changes
  React.useEffect(() => {
    if (message) {
      setIsVisible(true);
    }
  }, [message]);

  return {
    isVisible,
    dismiss
  };
}