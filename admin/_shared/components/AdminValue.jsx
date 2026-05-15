import React from 'react';

export function AdminValue({ children, className = '' }) {
  return (
    <span className={`hud-value ${className}`}>
      {children}
    </span>
  );
}
