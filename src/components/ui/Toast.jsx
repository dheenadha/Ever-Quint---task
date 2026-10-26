import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/**
 * Toast component for displaying individual notifications
 * @param {Object} props - Component props
 * @param {string} props.message - Toast message
 * @param {string} props.type - Toast type (success, error, warning, info)
 * @param {number} props.duration - Auto-dismiss duration in ms
 * @param {Function} props.onDismiss - Dismiss handler
 * @param {boolean} props.isVisible - Whether toast is visible
 * @param {boolean} props.isPersistent - Whether toast should not auto-dismiss
 * @param {string} props.className - Additional CSS classes
 */
const Toast = ({
  message,
  type = 'info',
  duration = 5000,
  onDismiss,
  isVisible = false,
  isPersistent = false,
  className = '',
  ...rest
}) => {
  const progressRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isVisible || duration <= 0 || isPersistent) return;

    // Reset progress bar
    if (progressRef.current) {
      progressRef.current.style.width = '100%';
      progressRef.current.style.transition = `width ${duration}ms linear`;
    }

    timerRef.current = setTimeout(() => {
      onDismiss();
    }, duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isVisible, duration, onDismiss, isPersistent]);

  // Handle pause on hover
  const handleMouseEnter = () => {
    if (timerRef.current && progressRef.current) {
      clearTimeout(timerRef.current);
      const computedStyle = window.getComputedStyle(progressRef.current);
      const currentWidth = computedStyle.width;
      progressRef.current.style.transition = 'none';
      progressRef.current.style.width = currentWidth;
    }
  };

  const handleMouseLeave = () => {
    if (!isPersistent && progressRef.current) {
      const computedStyle = window.getComputedStyle(progressRef.current);
      const currentWidth = computedStyle.width;
      const remainingWidth = parseFloat(currentWidth);
      const remainingTime = (remainingWidth / 100) * duration;
      
      progressRef.current.style.transition = `width ${remainingTime}ms linear`;
      progressRef.current.style.width = '0%';
      
      timerRef.current = setTimeout(() => {
        onDismiss();
      }, remainingTime);
    }
  };

  if (!isVisible) return null;

  // Toast styles based on type
  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          icon: 'text-green-400',
          progress: 'bg-green-500'
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: 'text-red-400',
          progress: 'bg-red-500'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          icon: 'text-yellow-400',
          progress: 'bg-yellow-500'
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          icon: 'text-blue-400',
          progress: 'bg-blue-500'
        };
    }
  };

  const styles = getToastStyles();

  // Icon based on type
  const getToastIcon = () => {
    const iconClass = `h-5 w-5 ${styles.icon}`;
    switch (type) {
      case 'success':
        return (
          <svg className={iconClass} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg className={iconClass} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg className={iconClass} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg className={iconClass} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const toastContent = (
    <div
      className={`fixed top-4 right-4 w-full max-w-md rounded-lg border p-4 shadow-lg bg-white ${styles.bg} ${styles.border} ${styles.text} animate-slide-up ${className}`}
      role="alert"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...rest}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          {getToastIcon()}
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={onDismiss}
            aria-label="Close"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      {!isPersistent && duration > 0 && (
        <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
          <div
            ref={progressRef}
            className={`h-1 rounded-full ${styles.progress} transition-all duration-100`}
            style={{ width: '100%' }}
          />
        </div>
      )}
    </div>
  );

  return createPortal(toastContent, document.body);
};

/**
 * Toaster component for managing multiple toasts
 */
export const Toaster = () => {
  // This component would be used to render all active toasts
  // For now, it's a placeholder since the Toast component handles rendering via createPortal
  return null;
};

export default Toast;