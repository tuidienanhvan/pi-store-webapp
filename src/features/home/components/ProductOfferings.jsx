import "./ProductOfferings.css";
import React from "react";
import { Button, Badge } from "@/_shared/components/ui";
import { Check, Zap } from "lucide-react";

/**
 * ProductOfferings Component
 * High-fidelity redesign with SVG tech-deco, HUD elements, and glowing glassmorphism.
 */
export function ProductOfferings({ products }) {
  const platform = products.find(p => p.id === "pi-ecosystem");
  const addons = products.filter(p => p.type === "addon");
  const tiers = platform?.tiers || [];

  return (
    <section className="product-offerings">
      <div className="product-offerings__bg-deco">
        <div className="glow-orb p1" />
        <div className="glow-orb p2" />
      </div>

      <div className="mx-auto w-full max-w-[1400px] px-8 lg:px-20 relative z-10">
        
        {/* SECTION 1: SUBSCRIPTION TIERS (The Brains) */}
        <div className="offerings-section">
          <div className="offerings-header">
            <h2 className="offerings-headline">
              Pi Ecosystem <span>Subscriptions</span>
            </h2>
            <div className="hud-line" />
          </div>

          <div className="offerings-grid">
            {tiers.map((tier, idx) => (
              <div 
                key={tier.id} 
                className={`offering-card glass-shell ${tier.id ==='pro' ? 'popular' : ''}`}
                style={{ "--idx": idx }}
              >
                {/* Tech Deco SVG background */}
                <div className="card-deco">
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0,0 L10,0 L0,10 Z" className="corner-tip" />
                    <path d="M100,100 L90,100 L100,90 Z" className="corner-tip" />
                    <line x1="0" y1="20" x2="0" y2="80" className="side-line" />
                    <line x1="100" y1="20" x2="100" y2="80" className="side-line" />
                  </svg>
                </div>

                <div className="offering-card__header">
                  <div className="tier-meta">
                    <span className="tier-id">ID: {tier.id.toUpperCase()}</span>
                    {tier.id === 'pro' && <Badge tone="brand">MOST_POPULAR</Badge>}
                  </div>
                  <h3 className="offering-name">{tier.label}</h3>
                  <div className="offering-price">
                    <span className="amount">
                      {tier.priceUsd !== null ? `$${tier.priceUsd}` : tier.priceLabel}
                    </span>
                    {tier.priceUsd !== null && <span className="period">/mo</span>}
                  </div>
                </div>
                
                <div className="offering-card__body">
                  <div className="quota-hud">
                    <div className="quota-label">TOKEN_QUOTA</div>
                    <div className="quota-value">
                      {tier.tokens === -1 ? "∞" : tier.tokens.toLocaleString()}
                      <span className="unit">PI_TKN</span>
                    </div>
                    <div className="tech-linear-gauge">
                      <div className="gauge-visual">
                        <svg viewBox="0 0 200 8" className="linear-svg">
                          {/* Segmented Track */}
                          <rect x="0" y="0" width="200" height="4" rx="2" className="track-bg" />
                          <path 
                            d={tier.id === 'free' ? "M0,2 L20,2" : tier.id === 'pro' ? "M0,2 L100,2" : "M0,2 L200,2"} 
                            className="track-fill" 
                            strokeDasharray="3 1"
                          />
                          {/* Technical Markers */}
                          <line x1="0" y1="0" x2="0" y2="8" className="marker-line" />
                          <line x1="200" y1="0" x2="200" y2="8" className="marker-line" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <ul className="feature-list">
                    {tier.features.map((feat, fIdx) => (
                      <li key={fIdx} className="feature-item">
                        <div className="check-box">
                          <Check size={10} />
                        </div>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="offering-card__footer">
                  <Button 
                    variant={tier.id === 'pro' ? 'primary' : 'outline'} 
                    fullWidth 
                    className="tech-btn"
                  >
                    {tier.cta}
                    <Zap size={14} className="btn-icon" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: TOKEN PACKS (The Fuel) */}
        <div className="offerings-section mt-40">
          <div className="offerings-header align-left">
            <Badge tone="brand">ADD_ONS</Badge>
            <h2 className="offerings-headline small">AI Token <span>Top-ups</span></h2>
            <p className="offerings-subline">Nạp thêm nhiên liệu cho AI của bạn khi cần thiết.</p>
          </div>

          <div className="addons-container">
            {/* Visual connector line SVG */}
            <div className="addons-visual">
              <svg viewBox="0 0 100 400" className="visual-svg">
                <path d="M50,0 L50,400" className="main-path" />
                <circle cx="50" cy="50" r="4" className="node-pulse" />
                <circle cx="50" cy="180" r="4" className="node-pulse" />
                <circle cx="50" cy="310" r="4" className="node-pulse" />
              </svg>
            </div>

            <div className="addons-grid">
              {addons.map((pack, pIdx) => (
                <div key={pack.id} className="addon-row glass-shell" style={{ "--idx": pIdx }}>
                  <div className="addon-row__info">
                    <div className="addon-icon">
                      <Zap size={20} />
                      <div className="icon-glow" />
                    </div>
                    <div className="addon-details">
                      <h4>{pack.name}</h4>
                      <p>{pack.tagline}</p>
                    </div>
                  </div>
                  
                  <div className="addon-row__visual">
                    <div className="energy-radar-gauge">
                      <svg viewBox="0 0 100 100" className="radar-svg">
                        {/* Outer Orbit */}
                        <circle cx="50" cy="50" r="45" className="radar-orbit" strokeDasharray="2 4" />
                        
                        {/* Progress Ring */}
                        <circle 
                          cx="50" cy="50" r="38" 
                          className="radar-ring" 
                          strokeDasharray={pIdx === 0 ? "70 300" : pIdx === 1 ? "150 300" : "240 300"}
                          transform="rotate(-90 50 50)"
                        />

                        {/* Scanner Beam */}
                        <line x1="50" y1="50" x2="50" y2="10" className="radar-beam" transform={`rotate(${pIdx * 45} 50 50)`}>
                          <animateTransform 
                            attributeName="transform" 
                            type="rotate" 
                            from="0 50 50" 
                            to="360 50 50" 
                            dur="4s" 
                            repeatCount="indefinite" 
                          />
                        </line>

                        {/* Center Core (Removed big circle as per request) */}
                        <circle cx="50" cy="50" r="2" className="radar-core-mini" />
                      </svg>
                      
                      <div className="radar-info">
                        <span className="radar-label">RADAR_LINK</span>
                        <span className="radar-value">{pIdx === 0 ? '30%' : pIdx === 1 ? '60%' : '100%'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="addon-row__action">
                    <div className="addon-price">${pack.priceUsd}</div>
                    <Button variant="primary" size="sm" className="buy-btn">
                      MUA NGAY
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
