import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/**
 * Modal component with accessibility features and focus management
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Close handler
 * @param {string} props.title - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.closeOnOverlayClick - Whether to close on overlay click
 * @param {boolean} props.closeOnEscape - Whether to close on escape key
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  ...rest
}) => {
  const modalRef = useRef(null);
  const initialFocusRef = useRef(null);
  const lastFocusedElement = useRef(null);

  // Handle focus management
  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      lastFocusedElement.current = document.activeElement;
      
      // Focus the modal after it opens
      setTimeout(() => {
        if (initialFocusRef.current) {
          initialFocusRef.current.focus();
        }
      }, 0);
    } else if (lastFocusedElement.current) {
      // Return focus to the previously focused element
      lastFocusedElement.current.focus();
      lastFocusedElement.current = null;
    }
  }, [isOpen]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isOpen) return;

      if (event.key === 'Escape' && closeOnEscape) {
        onClose();
      } else if (event.key === 'Tab') {
        // Handle tab navigation within modal
        handleTabNavigation(event);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);

  // Handle tab navigation within modal
  const handleTabNavigation = (event) => {
    if (!modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  };

  // Handle overlay click
  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  // Don't render if not open
  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby={title ? undefined : 'modal-title'}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0"
        onClick={handleOverlayClick}
      >
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity animate-fade-in"
          aria-hidden="true"
        />

        {/* Modal panel */}
        <div
          ref={modalRef}
          className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full animate-slide-up ${className}`}
          role="document"
        >
          {/* Close button */}
          <button
            ref={initialFocusRef}
            type="button"
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            onClick={onClose}
            aria-label="Close"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Modal content */}
          <div className="p-6">
            {title && (
              <h2 id="modal-title" className="text-lg font-semibold text-gray-900 mb-4">
                {title}
              </h2>
            )}
            <div {...rest}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render to portal
  return createPortal(modalContent, document.body);
};

export default Modal;