import React from 'react';

export function AdminCard({ children, className = '' }) {
  return (
    <div className={`rounded-xl border border-base-content/10 bg-base-200/40 backdrop-blur-md shadow-md transition-all duration-200 ${className}`}>
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
}
