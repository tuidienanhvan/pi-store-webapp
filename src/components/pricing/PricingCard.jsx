import React from "react";
import { Check, Loader2, ArrowRight, Zap } from "lucide-react";
import "./PricingCard.css";

const HUDCorner = () => (
  <div className="card-hud-corners">
    <div className="hud-corner tl" />
    <div className="hud-corner tr" />
    <div className="hud-corner bl" />
    <div className="hud-corner br" />
  </div>
);

export function PricingCard({ tier, billingCycle, loadingTier, onCheckout, copy }) {
  const isYearly = billingCycle === "yearly";
  
  const displayPrice = isYearly 
    ? Math.floor(tier.price_yearly / 12) 
    : tier.price_monthly;

  return (
    <div className={`pricing-card glass-shell ${tier.popular ? "pricing-card--popular" : ""}`}>
      <HUDCorner />
      <div className="card-scan-line" />
      
      {tier.popular && (
        <div className="popular-glow-back" />
      )}

      {tier.popular && (
        <div className="popular-badge">
          <Zap size={10} className="mr-1" />
          MOST_POPULAR_NODE
        </div>
      )}
      
      <div className="pricing-card__header">
        <div className="pricing-tier-meta">
          <span className="pricing-tier-id">NODE_ID: {tier.id.toUpperCase()}</span>
          <span className="pricing-status">ONLINE</span>
        </div>
        <h2 className="pricing-tier-name">{tier.name}</h2>
        <p className="pricing-tier-desc">{tier.description}</p>
      </div>

      <div className="pricing-card__price">
        <div className="price-main">
          <span className="price-symbol">$</span>
          <span className="price-amount tracking-tighter">{displayPrice}</span>
          <span className="price-period">/{copy.pricePeriod}</span>
        </div>
        
        {tier.price_monthly > 0 && isYearly && (
          <div className="price-cycle-note">
            {copy.yearlyPayPrefix} ${tier.price_yearly}/{copy.yearlyUnit}
          </div>
        )}
      </div>

      <div className="pricing-card__gauge">
        <div className="gauge-header">
          <span className="gauge-title">QUANTUM_TOKEN_QUOTA</span>
          <span className="gauge-val">
            {tier.features.find(f => f.includes('PI_TKN'))?.split(' ')[0] || "5K"}
          </span>
        </div>
        <div className="tech-linear-gauge">
          <div className="gauge-track">
            <div 
              className="gauge-fill" 
              style={{ width: tier.id === 'free' ? "5%" : tier.id === 'pro' ? "50%" : "100%" }}
            />
            <div className="gauge-shimmer" />
          </div>
        </div>
      </div>

      <ul className="pricing-features">
        {tier.features.map((f, idx) => (
          <li key={idx} className="pricing-feature">
            <div className="feature-marker" />
            <span className="feature-text">{f}</span>
          </li>
        ))}
      </ul>

      <div className="pricing-card__footer">
        <button 
          className={`pricing-cta ${tier.popular ? "primary" : "outline"}`}
          disabled={loadingTier === tier.id}
          onClick={() => onCheckout(tier.id)}
        >
          {loadingTier === tier.id ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <span className="cta-label">{tier.cta}</span>
          )}
          {!loadingTier && <ArrowRight size={18} className="cta-icon" />}
        </button>
      </div>
    </div>
  );
}

export default PricingCard;
