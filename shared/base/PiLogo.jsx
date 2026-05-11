import React from 'react';
import './PiLogo.css';

/**
 * PiLogo — The official brand mark for Pi Ecosystem.
 * Unified version with premium animations and flexible sizing.
 * @param {number} size - Square size in pixels.
 * @param {boolean} disabled - Applies grayscale/muted state.
 */
export const PiLogo = ({ size = 48, disabled = false, className = '', ...props }) => {
  const stateClass = disabled ? 'is-disabled' : '';
  
  return (
    <div 
      className={`pi-logo-container ${stateClass} ${className}`}
      style={{ width: size, height: size }}
      {...props}
    >
      <img 
        src="/logo-optimized.svg" 
        alt="Pi Logo" 
        className="pi-logo-img"
      />
    </div>
  );
};

export default PiLogo;
