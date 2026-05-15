import React from 'react';

export function AdminCard({ children, className = '' }) {
  return (
    <div className={`hud-card ${className}`}>
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
}
