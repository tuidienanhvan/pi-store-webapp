import React from "react";
import { Globe } from "lucide-react";
import "./BentoRegionalHubCard.css";

export function BentoRegionalHubCard({ title, description }) {
  return (
    <div className="home-bento__card home-bento__card--4">
      <div className="home-bento__card-inner glass-shell">
        <div className="home-bento__visual-container">
          <div className="vn-edge-node">
            {/* Radar System */}
            <div className="radar-circle">
              <div className="radar-sweep" />
              <div className="pulse-ring r1" />
              <div className="pulse-ring r2" />
              <div className="vn-core">
                <span className="vn-text">VN</span>
              </div>
            </div>

            {/* Floating Status Tags */}
            <div className="edge-tag t1">UPTIME: 99.99%</div>
            <div className="edge-tag t2">VN_NODE: OPTIMIZED</div>
            <div className="edge-tag t3">LOCAL_CDN: ACTIVE</div>
          </div>
        </div>

        <div className="home-bento__content">
          <div className="home-bento__icon-brand">
            <Globe size={18} />
          </div>
          <h3 className="home-bento__title">{title}</h3>
          <p className="home-bento__desc">{description}</p>
        </div>
      </div>
    </div>
  );
}
