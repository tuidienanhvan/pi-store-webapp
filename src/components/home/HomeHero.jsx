import "./HomeHero.css";

import { Link } from "react-router-dom";

import { Button } from "../ui";
import { ArrowRight, Zap, Cpu } from "lucide-react";



export function HomeHero({ t }) {

  if (!t || !t.hero) return null;



  return (

    <section className="home-section home-hero">

      <div className="mx-auto w-full max-w-[1400px] px-8 lg:px-20">

        <div className="home-hero__grid">

          <div className="home-hero__copy">

            <div className="home-hero__badge">

              <span className="badge-glow" />

              {t?.hero?.saleBadge}  {t?.hero?.eyebrow}

            </div>

            <h1 className="home-hero__title">

              {t?.hero?.title}

              <span>{t?.hero?.subtitle}</span>

            </h1>

            <p className="home-hero__desc">

              {t?.hero?.description}

            </p>







            <div className="home-hero__actions">

              <Button as={Link} to="/pricing" variant="primary" size="lg">

                {t?.hero?.ctaPrimary}

              </Button>

              <Button as={Link} to="/about" variant="ghost" size="lg">

                {t?.hero?.ctaSecondary} <ArrowRight size={16} />

              </Button>

            </div>



            <div className="home-hero__stats" aria-label="Pi ecosystem highlights">

              <div><strong>5K</strong><span>{t?.hero?.stats?.freeTokens || "free tokens/mo"}</span></div>

              <div><strong>3</strong><span>{t?.hero?.stats?.tiers || "tiers"}</span></div>

              <div><strong>VN</strong><span>{t?.hero?.stats?.market || "Vietnam market"}</span></div>

            </div>

          </div>



          <div className="home-hero__product" aria-label="Pi dashboard preview">
            <div className="pd-window">
              <div className="pd-header">
                <div className="pd-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="pd-title">PI DASHBOARD</div>
              </div>
              
              <div className="pd-body">
                <div className="pd-sidebar">
                  <div className="pd-nav-item active">Overview</div>
                  <div className="pd-nav-item">SEO Bot</div>
                  <div className="pd-nav-item">AI Cloud</div>
                </div>
                
                <div className="pd-main">
                  <div className="pd-status-panel">
                    <div className="pd-status-label">SYSTEM STATUS</div>
                    <div className="pd-status-value">Operational</div>
                    <div className="pd-status-sub">All plugins synced</div>
                  </div>
                  
                  <div className="pd-stats-row">
                    <div className="pd-stat">
                      <div className="pd-stat-label">TOKENS</div>
                      <div className="pd-stat-value">100K</div>
                      <div className="pd-stat-sub">Pro quota</div>
                    </div>
                    <div className="pd-stat">
                      <div className="pd-stat-label">SEO JOBS</div>
                      <div className="pd-stat-value">38</div>
                      <div className="pd-stat-sub">Queued</div>
                    </div>
                    <div className="pd-stat">
                      <div className="pd-stat-label">LEADS</div>
                      <div className="pd-stat-value">12</div>
                      <div className="pd-stat-sub">This week</div>
                    </div>
                  </div>

                  <div className="pd-chart-container">
                    <div className="pd-bar b1" />
                    <div className="pd-bar b2" />
                    <div className="pd-bar b3" />
                    <div className="pd-bar b4" />
                    <div className="pd-bar b5" />
                    <div className="pd-bar b6" />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Tooltips */}
            <div className="pd-float-tooltip top-right">
              <div className="tooltip-header">
                <Zap size={16} className="tooltip-icon" />
                <span>SERVER-SIDE LOGIC</span>
              </div>
              <div className="tooltip-text">Code never ships to customers</div>
            </div>

            <div className="pd-float-tooltip bottom-left">
              <div className="tooltip-header">
                <Cpu size={16} className="tooltip-icon" />
                <span>PROVIDER FAILOVER</span>
              </div>
              <div className="tooltip-text">Groq, Gemini, OpenAI, Anthropic</div>
            </div>
          </div>

        </div>

      </div>

    </section>

  );

}

