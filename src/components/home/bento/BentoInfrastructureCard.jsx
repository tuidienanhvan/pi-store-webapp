import React from "react";
import { Server } from "lucide-react";
import "./BentoInfrastructureCard.css";

export function BentoInfrastructureCard({ title, description }) {
  return (
    <div className="home-bento__card home-bento__card--infra">
      <div className="home-bento__card-inner glass-shell">
        <div className="home-bento__content infra-content">
          <div className="home-bento__icon-brand">
            <Server size={18} />
          </div>
          <h3 className="home-bento__title">{title}</h3>
          <p className="home-bento__desc">{description}</p>
        </div>

        <div className="home-bento__visual-container infra-visual">
          <div className="infra-scene">
            {/* Isometric Server Blade Base */}
            <div className="server-blade">
              <div className="blade-side side-top" />
              <div className="blade-side side-front">
                <div className="led-strip" />
                <div className="ports">
                  <span /><span /><span /><span />
                </div>
              </div>
              <div className="blade-side side-right" />
              
              {/* Internal Glow / Logic Core */}
              <div className="logic-core" />
            </div>

            {/* Data Streams / Neural Circuitry */}
            <svg className="data-streams" viewBox="0 0 200 120">
              <path className="stream-path s1" d="M20,60 L60,60 L80,40 L120,40" />
              <path className="stream-path s2" d="M20,80 L70,80 L90,100 L140,100" />
              <path className="stream-path s3" d="M180,60 L140,60 L120,80 L80,80" />
            </svg>

            {/* Security Shield Overlay */}
            <div className="security-shield" />

            {/* Micro HUD status */}
            <div className="infra-hud">
              <div className="hud-bit">PI_NODE: SECURED</div>
              <div className="hud-bit">LATENCY: 12ms</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
