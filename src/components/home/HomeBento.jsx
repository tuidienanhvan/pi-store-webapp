import './HomeBento.css';

import React from "react";

import { Card, Badge, Icon } from "../ui";



export function HomeBento({ t }) {

  return (

    <section className="home-section">

      <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-10">

        <div className="home-bento__header">

          <Badge tone="brand">Why Pi</Badge>

          <h2 style={{ margin: 0, fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800, letterSpacing: 0 }}>{t?.whyPi?.title}</h2>

          {t?.whyPi?.description && <p className="muted" style={{ margin: 0, fontSize: "var(--fs-18)", lineHeight: 1.6 }}>{t?.whyPi?.description}</p>}

        </div>

        

        <div className="home-bento__grid">

          {t?.whyPi?.items?.map((usp, i) => (

            <div key={i} className="home-bento__card">

              <div className="home-bento__icon-wrap">

                {i === 0 && <Icon name="coins" size={24} />}

                {i === 1 && <Icon name="server" size={24} />}

                {i === 2 && <Icon name="network" size={24} />}

                {i === 3 && <div style={{ fontSize: "18px", fontWeight: "bold" }}>VN</div>}

              </div>

              <div className="stack" style={{ gap: "var(--s-2)" }}>

                <h3 className="home-bento__title">{usp.title}</h3>

                <p className="home-bento__desc">{usp.desc}</p>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
