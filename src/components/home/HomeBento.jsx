import './HomeBento.css';

import React from "react";

import { Card, Badge, Icon } from "../ui";



export function HomeBento({ t }) {

  return (

    <section className="home-section home-bento">
      <div className="home-bento__bg-glow" aria-hidden="true" />
      <div className="mx-auto w-full max-w-[1400px] px-8 lg:px-20 relative z-10">
        <div className="home-bento__header">
          <Badge tone="brand" icon="zap" className="premium-engine-badge">The Core Engine</Badge>
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
                    <div className="infrastructure-visual">
                      <div className="traffic-lines">
                        <span className="line l-1"/><span className="line l-2"/><span className="line l-3"/>
                      </div>
                      <div className="node-group">
                        <div className="node primary"><strong>Master</strong><div className="pulse-line"/></div>
                        <div className="node-grid">
                          <div className="node mini"/>
                          <div className="node mini"/>
                          <div className="node mini"/>
                          <div className="node mini"/>
                        </div>
                      </div>
                    </div>
                  )}

                  {i === 2 && (
                    <div className="ai-nexus-v2">
                      <div className="nexus-core-glow" />
                      <div className="model-orbits">
                        <div className="model-tag gpt">GPT-4o</div>
                        <div className="model-tag gemini">Gemini</div>
                        <div className="model-tag claude">Claude 3</div>
                      </div>
                    </div>
                  )}

                  {i === 3 && (
                    <div className="vn-digital-map-v2">
                      <div className="vn-map-svg-wrapper">
                        <svg viewBox="0 0 120 180" className="vn-map-svg">
                          <path d="M50,10 L55,15 L52,25 L58,35 L55,45 L60,55 L58,65 L65,75 L62,85 L68,95 L65,105 L72,115 L68,125 L75,135 L70,145 L78,155 L72,165 L65,155 L68,145 L62,135 L65,125 L60,115 L62,105 L55,95 L58,85 L52,75 L55,65 L48,55 L52,45 L45,35 L48,25 L42,15 Z" fill="currentColor" />
                        </svg>
                        <div className="vn-map-grid" />
                        <div className="vn-node hanoi"><div className="pulse"/><span className="node-label">HN</span></div>
                        <div className="vn-node hcm"><div className="pulse"/><span className="node-label">HCM</span></div>
                        <div className="data-stream stream-1" />
                        <div className="data-stream stream-2" />
                      </div>
                      <div className="vn-badge-floating">
                        <Badge tone="brand">VN REGION</Badge>
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
