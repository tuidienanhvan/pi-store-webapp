import './HomeCTA.css';
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui";

export function HomeCTA({ t }) {
  return (
    <section className="home-section">
      <div className="home-container">
        <div className="home-cta__box">
          <div className="home-cta__bg-1" />
          <div className="home-cta__bg-2" />
          
          <div className="home-cta__content">
            <h2 className="home-cta__title">{t.cta.title}</h2>
            <p className="home-cta__desc">
              {t.cta.description}
            </p>
            <div className="home-cta__actions">
              <Button as={Link} to="/pricing" className="home-cta__btn-primary">
                {t.cta.primary}
              </Button>
              <Button as={Link} to="/pricing" variant="outline" className="home-cta__btn-secondary">
                {t.cta.secondary}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
