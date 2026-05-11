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
                        <div className="node primary"><strong>Master</strong><div className="pulse"/></div>
                        <div className="node-grid">
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
                      <div className="connection-mesh" />
                    </div>
                  )}

                  {i === 3 && (
                    <div className="vn-digital-map">
                      <div className="map-container">
                        <div className="vn-dots" />
                        <div className="signal-pulse p-1" />
                        <div className="signal-pulse p-2" />
                      </div>
                      <div className="vn-label-overlay">
                        <Badge tone="brand">VN REGION</Badge>
                        <strong>Ultra Low Latency</strong>
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
