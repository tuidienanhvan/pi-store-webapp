import React from "react";
import { Cpu, Layers } from "lucide-react";
import "./BentoAINexusCard.css";

export function BentoAINexusCard({ title, description }) {
  return (
    <div className="home-bento__card home-bento__card--ai">
      <div className="home-bento__card-inner glass-shell">
        <div className="home-bento__visual-container">
          <div className="nexus-scene">
            {/* Neural Background Grid */}
            <div className="nexus-grid-bg" />

            {/* Central Energy Core */}
            <div className="nexus-core">
              <div className="core-glow" />
              <div className="core-inner">
                <Cpu size={24} />
              </div>
            </div>

            {/* Complex Neural Links (SVG) */}
            <svg className="neural-web" viewBox="0 0 200 200">
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Dynamic Paths connecting to orbits */}
              <path className="neural-path p1" d="M100,100 Q120,50 150,40" />
              <path className="neural-path p2" d="M100,100 Q60,40 30,70" />
              <path className="neural-path p3" d="M100,100 Q130,150 160,140" />
              <path className="neural-path p4" d="M100,100 Q50,150 40,110" />
              
              {/* Pulsing Energy Rings */}
              <circle className="nexus-ring r1" cx="100" cy="100" r="35" />
              <circle className="nexus-ring r2" cx="100" cy="100" r="65" />
            </svg>

            {/* Orbiting AI Orbs */}
            <div className="ai-orbit o1">
              <div className="ai-orb gpt">ChatGPT 5o</div>
            </div>
            <div className="ai-orbit o2">
              <div className="ai-orb claude">Claude 4.5</div>
            </div>
            <div className="ai-orbit o3">
              <div className="ai-orb gemini">Gemini 3.0</div>
            </div>
          </div>
        </div>

        <div className="home-bento__content">
          <div className="home-bento__icon-brand">
            <Layers size={18} />
          </div>
          <h3 className="home-bento__title">{title}</h3>
          <p className="home-bento__desc">{description}</p>
        </div>
      </div>
    </div>
  );
}
