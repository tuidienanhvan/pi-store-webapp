import './HomeCTA.css';
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui";
import { ArrowRight, Zap, Shield, Cpu, CloudLightning } from "lucide-react";

const AdvancedNetworkSVG = () => (
  <svg viewBox="0 0 400 400" className="cta-creative-svg">
    <defs>
      <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="var(--p)" stopOpacity="0.9" />
        <stop offset="30%" stopColor="var(--p)" stopOpacity="0.4" />
        <stop offset="100%" stopColor="var(--p)" stopOpacity="0" />
      </radialGradient>
      
      <linearGradient id="pathGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--p)" stopOpacity="0.8" />
        <stop offset="100%" stopColor="transparent" stopOpacity="0" />
      </linearGradient>

      <linearGradient id="pathGrad2" x1="100%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="var(--p)" stopOpacity="0.8" />
        <stop offset="100%" stopColor="transparent" stopOpacity="0" />
      </linearGradient>

      <filter id="neonBlur">
        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    {/* Abstract Background Radar / Rings */}
    <g className="spin-slow" stroke="var(--bc)" fill="none" opacity="0.15">
      <circle cx="200" cy="200" r="180" strokeWidth="0.5" strokeDasharray="1 6" />
      <circle cx="200" cy="200" r="130" strokeWidth="1" strokeDasharray="5 15" />
      <circle cx="200" cy="200" r="80" strokeWidth="0.5" />
    </g>

    <g className="spin-reverse-slow" stroke="var(--p)" fill="none" opacity="0.2">
      <circle cx="200" cy="200" r="150" strokeWidth="1.5" strokeDasharray="10 30" />
    </g>

    {/* Crosshairs & Scanners */}
    <g stroke="var(--p)" strokeWidth="1" opacity="0.3">
      <line x1="200" y1="0" x2="200" y2="40" />
      <line x1="200" y1="360" x2="200" y2="400" />
      <line x1="0" y1="200" x2="40" y2="200" />
      <line x1="360" y1="200" x2="400" y2="200" />
    </g>

    {/* Connecting Paths (Data Lines) */}
    <g strokeWidth="2" fill="none" filter="url(#neonBlur)">
      {/* Line to Top Left */}
      <path d="M200 200 Q 150 150 100 80" stroke="url(#pathGrad1)" strokeDasharray="5 5" className="data-flow-1" />
      {/* Line to Top Right */}
      <path d="M200 200 Q 250 150 320 100" stroke="url(#pathGrad2)" className="data-flow-2" />
      {/* Line to Bottom Left */}
      <path d="M200 200 Q 150 250 80 300" stroke="url(#pathGrad1)" className="data-flow-3" />
      {/* Line to Bottom Right */}
      <path d="M200 200 Q 250 250 300 320" stroke="url(#pathGrad2)" strokeDasharray="4 8" className="data-flow-4" />
      {/* Line to Far Right */}
      <path d="M200 200 L 350 200" stroke="var(--p)" opacity="0.4" strokeDasharray="2 4" className="data-flow-5" />
    </g>

    {/* Polygon Network Web */}
    <polygon 
      points="100,80 320,100 350,200 300,320 80,300" 
      fill="none" 
      stroke="var(--p)" 
      strokeWidth="0.5" 
      opacity="0.2" 
      strokeDasharray="4 4"
    />

    {/* Satellite Nodes */}
    <g className="satellite-nodes">
      {/* Top Left: DB / Storage Node */}
      <g transform="translate(100, 80)">
        <circle r="22" fill="var(--b1)" stroke="var(--p)" strokeWidth="1" opacity="0.8" />
        <circle r="30" fill="url(#centerGlow)" opacity="0.4" className="pulse-slow" />
        <rect x="-6" y="-6" width="12" height="12" fill="none" stroke="var(--p)" strokeWidth="2" filter="url(#neonBlur)" />
        <circle r="2" fill="var(--pc)" />
        <text x="-20" y="-10" fontSize="8" fill="var(--p)" fontFamily="monospace" opacity="0.7">LƯU TRỮ</text>
      </g>

      {/* Top Right: AI / Compute Node */}
      <g transform="translate(320, 100)">
        <polygon points="0,-24 20,-12 20,12 0,24 -20,12 -20,-12" fill="var(--b1)" stroke="var(--p)" strokeWidth="1" opacity="0.8" />
        <circle r="35" fill="url(#centerGlow)" opacity="0.5" className="pulse-fast" />
        <polygon points="0,-8 7,-4 7,4 0,8 -7,4 -7,-4" fill="var(--p)" filter="url(#neonBlur)" />
        <text x="15" y="-15" fontSize="8" fill="var(--p)" fontFamily="monospace" opacity="0.7">TÍNH TOÁN AI</text>
      </g>

      {/* Bottom Left: Edge / CDN Node */}
      <g transform="translate(80, 300)">
        <circle r="18" fill="var(--b1)" stroke="var(--bc)" strokeWidth="2" />
        <circle r="25" fill="url(#centerGlow)" opacity="0.3" className="pulse-slow" />
        <circle r="8" fill="none" stroke="var(--p)" strokeWidth="2" strokeDasharray="2 2" className="spin-normal" />
        <circle r="3" fill="var(--p)" filter="url(#neonBlur)" />
        <text x="-30" y="20" fontSize="8" fill="var(--p)" fontFamily="monospace" opacity="0.7">MẠNG LƯỚI</text>
      </g>

      {/* Bottom Right: Security Node */}
      <g transform="translate(300, 320)">
        <rect x="-18" y="-18" width="36" height="36" rx="8" fill="var(--b1)" stroke="var(--p)" strokeWidth="1.5" />
        <circle r="30" fill="url(#centerGlow)" opacity="0.4" className="pulse-slow" />
        <path d="M-8,-4 L0,2 L8,-4" fill="none" stroke="var(--p)" strokeWidth="2" filter="url(#neonBlur)" />
        <circle r="2" fill="var(--p)" cy="8" />
        <text x="15" y="25" fontSize="8" fill="var(--p)" fontFamily="monospace" opacity="0.7">BẢO MẬT</text>
      </g>

      {/* Far Right: Small Relay */}
      <g transform="translate(350, 200)">
        <circle r="10" fill="var(--b1)" stroke="var(--p)" strokeWidth="1" />
        <circle r="4" fill="var(--p)" className="pulse-fast" />
      </g>
    </g>

    {/* Center Core: VN Hub */}
    <g transform="translate(200, 200)">
      {/* Huge Outer Glow */}
      <circle r="80" fill="url(#centerGlow)" className="pulse-slow" />
      
      {/* Orbital Ring */}
      <circle r="45" fill="none" stroke="var(--p)" strokeWidth="1" strokeDasharray="10 5 2 5" className="spin-normal" opacity="0.8" />
      <circle r="55" fill="none" stroke="var(--bc)" strokeWidth="0.5" strokeDasharray="4 8" className="spin-reverse-slow" />
      
      {/* Center Hexagon & Node */}
      <polygon points="0,-30 26,-15 26,15 0,30 -26,15 -26,-15" fill="var(--b1)" stroke="var(--p)" strokeWidth="2" filter="url(#neonBlur)" />
      <polygon points="0,-22 19,-11 19,11 0,22 -19,11 -19,-11" fill="color-mix(in srgb, var(--p) 20%, transparent)" stroke="var(--p)" strokeWidth="1" />
      
      <circle r="8" fill="var(--p)" filter="url(#neonBlur)" className="pulse-fast" />
      <text x="0" y="4" fontSize="12" fill="#fff" fontFamily="sans-serif" fontWeight="900" textAnchor="middle" letterSpacing="1px">VN</text>
    </g>

    {/* Data Particles moving along lines */}
    <g fill="var(--p)" filter="url(#neonBlur)">
      <circle r="2" className="particle-travel t1" />
      <circle r="2.5" className="particle-travel t2" />
      <circle r="2" className="particle-travel t3" />
      <circle r="3" className="particle-travel t4" />
    </g>
  </svg>
);

export function HomeCTA({ t }) {
  if (!t || !t.cta) return null;

  return (
    <section className="home-section home-cta">
      <div className="mx-auto w-full max-w-[1200px] px-8">
        <div className="home-cta__container">
          <div className="home-cta__box glass-panel">
            <div className="cta-grid-bg" />
            <div className="cta-scan-line" />
            
            <div className="home-cta__content">
              <div className="cta-badge stagger-1">
                <div className="badge-glow-ring" />
                <Zap size={14} className="text-primary relative z-10" />
                <span className="relative z-10">BỨT PHÁ GIỚI HẠN CÙNG PI</span>
              </div>
              
              <h2 className="home-cta__title stagger-2">
                {t.cta.title}
              </h2>
              <p className="home-cta__desc stagger-3">
                {t.cta.description}
              </p>

              <div className="home-cta__actions stagger-4">
                <Button as={Link} to="/pricing" variant="primary" size="lg" className="cta-btn-primary">
                  {t.cta.primary}
                  <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
                </Button>

                <Button as={Link} to="/pricing" variant="ghost" size="lg" className="cta-btn-secondary">
                  {t.cta.secondary}
                </Button>
              </div>
            </div>

            <div className="cta-visual-decor">
              <AdvancedNetworkSVG />
            </div>
          </div>
          
          <div className="cta-outer-glow" />
        </div>
      </div>
    </section>
  );
}
