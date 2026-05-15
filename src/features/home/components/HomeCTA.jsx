import './HomeCTA.css';
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/_shared/components/ui";
import { Activity, ArrowRight, Bot, FileSearch, KeyRound, ReceiptText, Zap } from "lucide-react";

const CTA_PROOF_POINTS = [
  { icon: KeyRound, label: "Pi API", text: "Một endpoint bảo mật" },
  { icon: Bot, label: "AI Tools", text: "SEO, Chatbot, Post AI" },
  { icon: ReceiptText, label: "Token Log", text: "Admin theo dõi sử dụng" },
];

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
                <span className="relative z-10">Mở rộng website bằng Pi API</span>
              </div>
              
              <div className="cta-api-map stagger-1" aria-hidden="true">
                <div className="cta-api-node">
                  <FileSearch size={18} />
                  <span>WordPress</span>
                </div>
                <svg className="cta-api-line" viewBox="0 0 180 32" fill="none">
                  {/* Static Rail Paths */}
                  <path d="M8 16H68C82 16 82 6 96 6H172" className="rail-path" />
                  <path d="M8 16H68C82 16 82 26 96 26H172" className="rail-path" />
                  {/* Pulsing Laser Paths */}
                  <path d="M8 16H68C82 16 82 6 96 6H172" className="pulse-path" />
                  <path d="M8 16H68C82 16 82 26 96 26H172" className="pulse-path" />
                  <circle cx="90" cy="16" r="3" />
                </svg>
                <div className="cta-api-node is-primary">
                  <Zap size={18} />
                  <span>Plugin PiAPI</span>
                </div>
                <svg className="cta-api-line" viewBox="0 0 180 32" fill="none">
                   {/* Static Rail Paths */}
                   <path d="M8 16H68C82 16 82 6 96 6H172" className="rail-path" />
                  <path d="M8 16H68C82 16 82 26 96 26H172" className="rail-path" />
                  {/* Pulsing Laser Paths */}
                  <path d="M8 16H68C82 16 82 6 96 6H172" className="pulse-path" />
                  <path d="M8 16H68C82 16 82 26 96 26H172" className="pulse-path" />
                  <circle cx="90" cy="16" r="3" />
                </svg>
                <div className="cta-api-node">
                  <Activity size={18} />
                  <span>Pi Dashboard</span>
                </div>
              </div>
              
              <h2 className="home-cta__title stagger-2">
                {t.cta.title}
              </h2>
              <p className="home-cta__desc stagger-3">
                {t.cta.description}
              </p>

              <div className="cta-proof-row stagger-3">
                {CTA_PROOF_POINTS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div className="cta-proof-item" key={item.label}>
                      <Icon size={17} />
                      <div>
                        <strong>{item.label}</strong>
                        <span>{item.text}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="home-cta__actions stagger-4">
                <Button as={Link} to="/pricing" variant="primary" size="lg" className="cta-btn-primary">
                  {t.cta.primary}
                  <ArrowRight size={18} className="ml-2 transition-transform group-" />
                </Button>

                <Button as={Link} to="/pricing" variant="ghost" size="lg" className="cta-btn-secondary">
                  {t.cta.secondary}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="cta-outer-glow" />
        </div>
      </div>
    </section>
  );
}

