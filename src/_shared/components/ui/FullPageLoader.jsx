import React from "react";
import PiLogo from "@pi-ui/base/PiLogo";
import "./FullPageLoader.css";

export function FullPageLoader() {
  return (
    <div className="pi-loader-container">
      {/* Dynamic Cyber Grid Background */}
      <div className="pi-loader-grid">
        <div className="grid-horizontal" />
        <div className="grid-vertical" />
      </div>

      <div className="pi-loader-core">
        {/* Intricate SVG Animation Ring System */}
        <svg className="pi-svg-rings" viewBox="0 0 300 300">
          <defs>
            <linearGradient id="neon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e03154" />
              <stop offset="50%" stopColor="#ff5f56" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-light" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer Orbit (Dashed) */}
          <circle cx="150" cy="150" r="140" fill="none" stroke="color-mix(in srgb, var(--bc) 5%, transparent)" strokeWidth="1" />
          <circle cx="150" cy="150" r="140" fill="none" stroke="url(#neon-gradient)" strokeWidth="2" strokeDasharray="150 50 50 100" strokeLinecap="round" className="orbit-outer" filter="url(#glow-light)" />

          {/* Middle Radar Track */}
          <circle cx="150" cy="150" r="110" fill="none" stroke="color-mix(in srgb, var(--bc) 3%, transparent)" strokeWidth="10" />
          <circle cx="150" cy="150" r="110" fill="none" stroke="#e03154" strokeWidth="2" strokeDasharray="1 10" className="orbit-radar" />
          
          {/* Inner Quantum Hexagon */}
          <g className="orbit-hex">
            <polygon points="150,55 232,102 232,198 150,245 68,198 68,102" fill="none" stroke="color-mix(in srgb, var(--bc) 10%, transparent)" strokeWidth="1" />
            <polygon points="150,55 232,102 232,198 150,245 68,198 68,102" fill="none" stroke="#ff3366" strokeWidth="3" strokeDasharray="40 120" strokeLinecap="round" className="hex-tracer" filter="url(#glow)" />
          </g>

          {/* Target Reticle Crosshairs */}
          <path d="M150,10 L150,30 M150,270 L150,290 M10,150 L30,150 M270,150 L290,150" stroke="color-mix(in srgb, var(--bc) 30%, transparent)" strokeWidth="1" className="reticle-pulse" />
        </svg>

        {/* Central Logo & Core Energy */}
        <div className="pi-core-energy">
          <div className="core-pulse-1" />
          <div className="core-pulse-2" />
          <div className="pi-logo-wrapper">
            <PiLogo size={56} />
          </div>
        </div>
      </div>

      {/* Cyberpunk HUD Info */}
      <div className="pi-hud-display">
        <div className="hud-title" data-text="ĐANG KHỞI TẠO">ĐANG KHỞI TẠO</div>
        <div className="hud-progress-track">
          <div className="hud-progress-fill" />
        </div>
        <div className="hud-details">
          <div className="hud-status">
            <span>ĐANG ĐỒNG BỘ DỮ LIỆU</span>
            <span className="dot-blink">...</span>
          </div>
          <div className="hud-counter">99.9%</div>
        </div>
      </div>
    </div>
  );
}
