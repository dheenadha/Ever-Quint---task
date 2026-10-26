import React from 'react';

/**
 * Select component with label and error message support
 * @param {Object} props - Component props
 * @param {string} props.label - Select label
 * @param {string} props.error - Error message
 * @param {string} props.value - Selected value
 * @param {Function} props.onChange - Change handler
 * @param {Array} props.options - Array of options
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.required - Whether field is required
 * @param {string} props.id - Select ID
 * @param {React.SelectHTMLAttributes} props.rest - Other select attributes
 */
const Select = React.forwardRef((
  {
    label,
    error,
    value = '',
    onChange,
    options = [],
    placeholder = 'Select an option',
    required = false,
    id,
    className = '',
    ...rest
  },
  ref
) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="space-y-1">
      {label && (
        <label 
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        value={value}
        onChange={onChange}
        className={`input appearance-none bg-white ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''} ${className}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${selectId}-error` : undefined}
        {...rest}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p 
          id={`${selectId}-error`}
          className="text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;