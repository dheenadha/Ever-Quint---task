import React from 'react';

/**
 * Badge component for displaying status, priority, or tags
 * @param {Object} props - Component props
 * @param {string} props.variant - Badge variant (status, priority, tag)
 * @param {string} props.value - Badge value
 * @param {string} props.color - Custom color class
 * @param {React.ReactNode} props.children - Badge content
 * @param {string} props.className - Additional CSS classes
 */
const Badge = ({
  variant = 'tag',
  value,
  color,
  children,
  className = '',
  ...rest
}) => {
  // Default colors based on variant
  const getBadgeColor = () => {
    if (color) return color;
    
    switch (variant) {
      case 'status':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'priority':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'tag':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const badgeClasses = [
    'badge',
    getBadgeColor(),
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={badgeClasses} {...rest}>
      {children || value}
    </span>
  );
};

export default Badge;