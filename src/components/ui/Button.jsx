import React from 'react';

/**
 * Button component with multiple variants and sizes
 * @param {Object} props - Component props
 * @param {string} props.variant - Button variant (primary, secondary, destructive)
 * @param {string} props.size - Button size (sm, md, lg)
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {boolean} props.loading - Whether button is in loading state
 * @param {React.ReactNode} props.children - Button content
 * @param {React.ButtonHTMLAttributes} props.rest - Other button attributes
 */
const Button = React.forwardRef((
  {
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className = '',
    children,
    ...rest
  },
  ref
) => {
  // Variant styles
  const variantStyles = {
    primary: 'btn-primary hover:shadow-md active:translate-y-px',
    secondary: 'btn-secondary hover:shadow-md active:translate-y-px',
    destructive: 'btn-destructive hover:shadow-md active:translate-y-px'
  };

  // Size styles
  const sizeStyles = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base'
  };

  // Combine styles
  const buttonClasses = [
    'btn',
    variantStyles[variant],
    sizeStyles[size],
    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    loading ? 'opacity-75 cursor-wait' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={buttonClasses}
      {...rest}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;