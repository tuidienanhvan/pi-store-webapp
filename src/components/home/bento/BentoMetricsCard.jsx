import React from "react";
import { Card, Badge } from "../../ui";
import { Zap } from "lucide-react";
import "./BentoMetricsCard.css";

export function BentoMetricsCard({ title, description }) {
  return (
    <div className="home-bento__card home-bento__card--metrics">
      <div className="home-bento__card-inner glass-shell">
        <div className="home-bento__visual-container">
          {/* Cost Comparison Engine */}
          <div className="cost-engine">
            <div className="comparison-bars">
              <div className="bar-group traditional">
                <div className="bar-label">TRADITIONAL</div>
                <div className="bar-rail">
                  <div className="bar-fill" />
                </div>
                <div className="bar-value">$12.4k</div>
              </div>
              
              <div className="bar-group pi-optimized">
                <div className="bar-label">PI OPTIMIZED</div>
                <div className="bar-rail">
                  <div className="bar-fill" />
                  {/* Floating Savings Tag */}
                  <div className="savings-badge">-85%</div>
                </div>
                <div className="bar-value">$1.8k</div>
              </div>
            </div>

            {/* Savings Breakdown HUD */}
            <div className="savings-breakdown">
              <div className="breakdown-item">
                <span className="label">API_EFFICIENCY</span>
                <span className="val">+72%</span>
              </div>
              <div className="breakdown-item">
                <span className="label">INFRA_COST</span>
                <span className="val">-48%</span>
              </div>
              <div className="breakdown-item">
                <span className="label">OP_EXPENSE</span>
                <span className="val">-31%</span>
              </div>
            </div>

            {/* Smart Routing Optimizer SVG */}
            <div className="savings-accumulator">
              <div className="flow-meta left">RAW_COST</div>
              
              <div className="prism-container">
                <svg viewBox="0 0 160 40" className="flow-svg">
                  {/* Angled data path */}
                  <path className="flow-line" d="M0,25 L65,25 L80,10 L95,25 L160,25" />
                  
                  {/* The Smart Router Node (Hexagon Tech) */}
                  <g className="router-node" transform="translate(80, 10)">
                    {/* Outer spinning ring */}
                    <circle className="router-ring" cx="0" cy="0" r="14" />
                    
                    {/* Hexagon core */}
                    <polygon points="-10,-5.77 0,-11.55 10,-5.77 10,5.77 0,11.55 -10,5.77" className="router-hex-outer" />
                    <polygon points="-5,-2.88 0,-5.77 5,-2.88 5,2.88 0,5.77 -5,2.88" className="router-hex-inner" />
                    <circle cx="0" cy="0" r="1.5" className="router-dot" />
                  </g>
                  
                  {/* Animated Particles */}
                  <circle className="flow-particle p-in" r="3.5" />
                  <circle className="flow-particle p-out" r="2" />
                </svg>
                <div className="prism-label">SMART_ROUTER</div>
              </div>

              <div className="flow-meta right">NET_SAVINGS</div>
            </div>
          </div>
        </div>

        <div className="home-bento__content">
          <div className="home-bento__icon-brand">
            <Zap size={18} />
          </div>
          <h3 className="home-bento__title">{title}</h3>
          <p className="home-bento__desc">{description}</p>
        </div>
      </div>
    </div>
  );
}
