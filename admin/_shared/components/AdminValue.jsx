import React from 'react';

export function AdminValue({ children, className = '' }) {
  return (
    <span className={`font-semibold tabular-nums ${className}`}>
      {children}
    </span>
  );
}
