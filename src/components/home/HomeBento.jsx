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
                    <div className="mini-dashboard">
                      <div className="mini-dashboard__header"><span/><span/><span/></div>
                      <div className="mini-dashboard__stats">
                        <div className="mini-stat"><span>Usage</span><strong>$0.02</strong></div>
                        <div className="mini-stat"><span>Saving</span><strong>90%</strong></div>
                      </div>
                      <div className="mini-callout">LOW LATENCY</div>
                    </div>
                  )}
                  
                  {i === 1 && (
                    <div className="server-cluster">
                      {[1,2,3,4].map(n => (
                        <div key={n} className="server-node"><div className="node-indicator"/></div>
                      ))}
                      <div className="mini-callout mini-callout--alt">NODE ACTIVE</div>
                    </div>
                  )}

                  {i === 2 && (
                    <div className="provider-orbit">
                      <div className="orbit-center"><Icon name="cpu" size={20} /></div>
                      <div className="orbit-item item-1">G</div>
                      <div className="orbit-item item-2">A</div>
                      <div className="orbit-item item-3">O</div>
                    </div>
                  )}

                  {i === 3 && (
                    <div className="vn-visual">
                      <div className="map-dots" />
                      <div className="vn-callout">OPTIMIZED FOR VN</div>
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
