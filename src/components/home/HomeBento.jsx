import './HomeBento.css';

import React from "react";

import { Card, Badge, Icon } from "../ui";



export function HomeBento({ t }) {

  return (

    <section className="home-section home-bento">
      <div className="home-bento__bg-glow" aria-hidden="true" />
      <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-10 relative z-10">
        <div className="home-bento__header">
          <Badge tone="brand">The Core Engine</Badge>
          <h2 className="home-bento__headline">{t?.whyPi?.title}</h2>
          {t?.whyPi?.description && <p className="home-bento__subline">{t?.whyPi?.description}</p>}
        </div>
        
        <div className="home-bento__grid">
          {t?.whyPi?.items?.map((usp, i) => (
            <div key={i} className={`home-bento__card home-bento__card--${i}`}>
              <div className="home-bento__card-inner glass-shell">
                
                {/* INTERACTIVE VISUALS BASED ON ITEM TYPE */}
                <div className="home-bento__visual-container">
                  {i === 0 && (
                    <div className="mini-dashboard-wrapper">
                      <div className="mini-dashboard">
                        <div className="mini-dashboard__header"><span/><span/><span/><strong>pi-cloud-metrics</strong></div>
                        <div className="mini-dashboard__body">
                          <div className="mini-chart">
                            <div className="bar" style={{height: '40%'}}/>
                            <div className="bar" style={{height: '70%'}}/>
                            <div className="bar" style={{height: '50%'}}/>
                            <div className="bar" style={{height: '90%'}}/>
                            <div className="bar" style={{height: '60%'}}/>
                          </div>
                          <div className="mini-dashboard__stats">
                            <div className="mini-stat"><span>Tokens</span><strong>125K</strong></div>
                            <div className="mini-stat"><span>Saved</span><strong>$42.5</strong></div>
                          </div>
                        </div>
                      </div>
                      <div className="floating-badge badge-1">99.9% Uptime</div>
                      <div className="floating-badge badge-2">Auto-Scale</div>
                    </div>
                  )}
                  
                  {i === 1 && (
                    <div className="server-rack">
                      {[1,2,3].map(n => (
                        <div key={n} className="server-unit">
                          <div className="unit-lights"><span/><span/><span/></div>
                          <div className="unit-label">NODE-0{n}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {i === 2 && (
                    <div className="ai-nexus">
                      <div className="nexus-core"><Icon name="zap" size={32} /></div>
                      <div className="nexus-ring ring-1" />
                      <div className="nexus-ring ring-2" />
                      <div className="nexus-node n-1">Groq</div>
                      <div className="nexus-node n-2">GPT-4</div>
                      <div className="nexus-node n-3">Gemini</div>
                    </div>
                  )}

                  {i === 3 && (
                    <div className="vn-map-visual">
                      <div className="vn-dots-grid" />
                      <div className="vn-highlight-box">
                        <strong>LOCATED IN VN</strong>
                        <span>Low latency routing</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="home-bento__content">
                  <div className="home-bento__icon-brand">
                    {i === 0 && <Icon name="zap" size={18} />}
                    {i === 1 && <Icon name="shield-check" size={18} />}
                    {i === 2 && <Icon name="layers" size={18} />}
                    {i === 3 && <Icon name="globe" size={18} />}
                  </div>
                  <h3 className="home-bento__title">{usp.title}</h3>
                  <p className="home-bento__desc">{usp.desc}</p>
                </div>

                <div className="card-glass-reflection" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

  );

}
