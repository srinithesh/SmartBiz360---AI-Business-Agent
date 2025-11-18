
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className, header, footer }) => {
  return (
    <div className={`bg-surface text-on-surface rounded-xl shadow-sm border border-outline/20 overflow-hidden ${className}`}>
      {header && (
        <div className="p-4 border-b border-outline/20">
          {header}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
      {footer && (
        <div className="p-4 bg-surface-variant/20 border-t border-outline/20">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;