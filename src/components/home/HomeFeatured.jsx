import "./HomeFeatured.css";

import { Link } from "react-router-dom";

import { Button, Icon } from "../ui";


export function HomeFeatured({ tiers = [], t }) {

  return (

    <section id="featured-products" className="home-featured">

      <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-10">

        <header className="home-featured__header">

          <h2 className="home-featured__title">

            {t?.featured?.title || "4 gói dịch vụ"}

          </h2>

          {t?.featured?.description && (

            <p className="home-featured__subhead">

              {t?.featured?.description}

            </p>

          )}

        </header>


        <div className="home-featured__grid">

          {tiers.map((tier) => (

            <div 

              key={tier.id} 

              className={`home-featured__card ${tier.id === "pro" ? "home-featured__card--pro" : ""}`}

            >

              {tier.id === "pro" && <div className="home-featured__ribbon">PHỔ BIẾN</div>}

              

              <div className="home-featured__card-header">

                <h3 className="home-featured__card-name">{tier.label}</h3>

                <div className="home-featured__price-block">

                  <span className="home-featured__price">

                    {tier.priceUsd === 0 ? "Free" : tier.priceUsd == null ? (tier.priceLabel || "Liên hệ") : `$${tier.priceUsd}`}

                  </span>

                  {typeof tier.priceUsd === "number" && tier.priceUsd > 0 && <span className="home-featured__period">/mo</span>}

                </div>

                <div className="home-featured__tokens">

                  {tier.tokens === -1 ? "Tokens không giới hạn" : `${tier.tokens.toLocaleString()} tokens/tháng`}

                </div>

              </div>


              <ul className="home-featured__features">

                {tier.features.slice(0, 3).map((f, i) => (

                  <li key={i} className="home-featured__feature">

                    <Icon name="check" size={16} className="feature-icon" />

                    <span>{f.replace(/^\+\s*/, "")}</span>

                  </li>

                ))}

              </ul>


              <Button 

                as={Link} 

                to={`/signup?plan=${tier.id}`} 

                variant={tier.id === "pro" ? "primary" : "ghost"} 

                className="home-featured__cta"

              >

                {tier.cta}

              </Button>

            </div>

          ))}

        </div>


        <footer className="home-featured__footer">

          <Button as={Link} to="/pricing" variant="ghost" className="comparison-btn">

            {t?.featured?.ctaAll || "So sánh đầy đủ"} <Icon name="arrow-right" size={16} />

          </Button>

        </footer>

      </div>

    </section>

  );

}