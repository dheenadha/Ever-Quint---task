import React from 'react';

/**
 * TextArea component with label and error message support
 * @param {Object} props - Component props
 * @param {string} props.label - Input label
 * @param {string} props.error - Error message
 * @param {string} props.placeholder - Input placeholder
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {number} props.rows - Number of rows
 * @param {boolean} props.required - Whether field is required
 * @param {string} props.id - Input ID
 * @param {React.TextareaHTMLAttributes} props.rest - Other textarea attributes
 */
const TextArea = React.forwardRef((
  {
    label,
    error,
    placeholder = '',
    value = '',
    onChange,
    rows = 4,
    required = false,
    id,
    className = '',
    ...rest
  },
  ref
) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="space-y-1">
      {label && (
        <label 
          htmlFor={textareaId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={`input resize-y ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''} ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        aria-invalid={!!error}
        aria-describedby={error ? `${textareaId}-error` : undefined}
        {...rest}
      />
      {error && (
        <p 
          id={`${textareaId}-error`}
          className="text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;