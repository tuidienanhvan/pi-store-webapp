import './HomeBento.css';

import React from "react";

import { Card, Badge, Icon } from "../ui";



export function HomeBento({ t }) {

  return (

    <section className="home-section home-bento">
      <div className="home-bento__bg-glow" aria-hidden="true" />
      <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-10 relative z-10">
        <div className="home-bento__header">
          <Badge tone="brand">Standard of Excellence</Badge>
          <h2 className="home-bento__headline">{t?.whyPi?.title}</h2>
          {t?.whyPi?.description && <p className="home-bento__subline">{t?.whyPi?.description}</p>}
        </div>
        
        <div className="home-bento__grid">
          {t?.whyPi?.items?.map((usp, i) => (
            <div key={i} className={`home-bento__card home-bento__card--${i}`}>
              <div className="home-bento__card-inner glass-card">
                
                {/* Background Pattern */}
                <div className="card-pattern" />

                <div className="home-bento__top">
                  <div className="home-bento__icon-wrap">
                    {i === 0 && <Icon name="coins" size={24} />}
                    {i === 1 && <Icon name="server" size={24} />}
                    {i === 2 && <Icon name="network" size={24} />}
                    {i === 3 && <div className="vn-badge">VN</div>}
                  </div>
                </div>

                {/* VISUAL ELEMENTS FOR BIG CARDS */}
                {i === 0 && (
                  <div className="card-visual card-visual--tokens">
                    <div className="token-float token-1">5K</div>
                    <div className="token-float token-2">FREE</div>
                    <div className="token-float token-3">PI</div>
                  </div>
                )}
                
                {i === 1 && (
                  <div className="card-visual card-visual--server">
                    <div className="server-line" />
                    <div className="server-line" />
                    <div className="server-line" />
                  </div>
                )}

                <div className="home-bento__content">
                  <h3 className="home-bento__title">{usp.title}</h3>
                  <p className="home-bento__desc">{usp.desc}</p>
                </div>

                <div className="card-highlight" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

  );

}
