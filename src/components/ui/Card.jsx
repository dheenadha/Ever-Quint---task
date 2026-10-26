import React from 'react';

/**
 * Card component for displaying content in a container
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.title - Card title
 * @param {React.ReactNode} props.header - Custom header content
 * @param {React.ReactNode} props.footer - Custom footer content
 */
const Card = ({
  children,
  className = '',
  title,
  header,
  footer,
  ...rest
}) => {
  return (
    <div className={`card ${className}`} {...rest}>
      {(title || header) && (
        <div className="px-6 py-4 border-b border-gray-200">
          {title ? (
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          ) : (
            header
          )}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50">
          {footer}
        </div>
      )}
    </div>
  );
};

/**
 * CardHeader component for custom card headers
 */
const CardHeader = ({ children, className = '', ...rest }) => (
  <div className={`px-6 py-4 border-b border-gray-200 ${className}`} {...rest}>
    {children}
  </div>
);

/**
 * CardContent component for card body content
 */
const CardContent = ({ children, className = '', ...rest }) => (
  <div className={`p-6 ${className}`} {...rest}>
    {children}
  </div>
);

/**
 * CardFooter component for custom card footers
 */
const CardFooter = ({ children, className = '', ...rest }) => (
  <div className={`px-6 py-4 border-t border-gray-200 bg-gray-50/50 ${className}`} {...rest}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
