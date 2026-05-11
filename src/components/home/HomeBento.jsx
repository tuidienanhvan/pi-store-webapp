import './HomeBento.css';

import React from "react";

import { Card, Badge, Icon } from "../ui";



export function HomeBento({ t }) {

  return (

    <section className="home-section home-bento">
      <div className="home-bento__bg-glow" aria-hidden="true" />
      <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-10 relative z-10">
        <div className="home-bento__header">
          <Badge tone="brand">Why Pi Ecosystem</Badge>
          <h2 className="home-bento__headline">{t?.whyPi?.title}</h2>
          {t?.whyPi?.description && <p className="home-bento__subline">{t?.whyPi?.description}</p>}
        </div>
        
        <div className="home-bento__grid">
          {t?.whyPi?.items?.map((usp, i) => (
            <div key={i} className={`home-bento__card home-bento__card--${i}`}>
              <div className="home-bento__card-inner glass-card">
                <div className="home-bento__icon-wrap">
                  {i === 0 && <Icon name="coins" size={28} />}
                  {i === 1 && <Icon name="server" size={24} />}
                  {i === 2 && <Icon name="network" size={24} />}
                  {i === 3 && <div className="vn-badge">VN</div>}
                  
                  {/* Decorative element for large card */}
                  {i === 0 && <div className="card-decoration" />}
                </div>
                
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
