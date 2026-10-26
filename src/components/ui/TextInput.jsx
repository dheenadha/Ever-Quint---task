import React from 'react';

/**
 * TextInput component with label, error message, and clearable support
 * @param {Object} props - Component props
 * @param {string} props.label - Input label
 * @param {string} props.error - Error message
 * @param {string} props.placeholder - Input placeholder
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.type - Input type
 * @param {boolean} props.required - Whether field is required
 * @param {string} props.id - Input ID
 * @param {boolean} props.clearable - Whether to show clear button
 * @param {Function} props.onClear - Clear handler
 * @param {React.ReactNode} props.icon - Optional icon
 * @param {React.InputHTMLAttributes} props.rest - Other input attributes
 */
const TextInput = React.forwardRef((
  {
    label,
    error,
    placeholder = '',
    value = '',
    onChange,
    type = 'text',
    required = false,
    id,
    clearable = false,
    onClear = null,
    icon = null,
    className = '',
    ...rest
  },
  ref
) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      onChange({ target: { value: '' } });
    }
  };

  return (
    <div className="space-y-1">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-gray-400">
              {icon}
            </div>
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200 ${
            icon ? 'pl-10' : ''
          } ${
            clearable && value ? 'pr-10' : ''
          } ${
            error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'focus:ring-blue-500 focus:border-blue-500'
          } ${className}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...rest}
        />
        {clearable && value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear input"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      {error && (
        <p 
          id={`${inputId}-error`}
          className="text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
});

TextInput.displayName = 'TextInput';

export default TextInput;
