import "./HomeFeatured.css";
import { Link } from "react-router-dom";
import { Button, Icon } from "../ui";

export function HomeFeatured({ tiers = [], t }) {
  return (
    <section id="featured-products" className="home-section">
      <div className="home-container">
        <div className="stack" style={{ textAlign: "center", gap: "var(--s-4)", maxWidth: 720, margin: "0 auto var(--s-10)" }}>
          <h2 style={{ margin: 0, fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: 0 }}>
            {t.featured?.title || "4 gói giá"}
          </h2>
          {t.featured?.description && <p className="muted" style={{ margin: 0, fontSize: "var(--fs-18)" }}>{t.featured.description}</p>}
        </div>

        <div className="home-featured__grid">
          {tiers.map((tier) => (
            <div key={tier.id} className={`home-featured__card ${tier.id === "pro" ? "home-featured__card--pro" : ""}`}>
              {tier.id === "pro" && <div className="home-featured__ribbon">PHỔ BIẾN</div>}
              <div className="stack" style={{ gap: "var(--s-2)" }}>
                <h3 style={{ margin: 0, fontSize: "var(--fs-20)", fontWeight: 800, color: tier.id === "pro" ? "var(--brand)" : "var(--text-1)" }}>{tier.label}</h3>
                <div className="home-featured__price-block">
                  <span className="home-featured__price">
                    {tier.priceUsd === 0 ? "Free" : tier.priceUsd == null ? (tier.priceLabel || "Liên hệ") : `$${tier.priceUsd}`}
                  </span>
                  {typeof tier.priceUsd === "number" && tier.priceUsd > 0 && <span className="home-featured__period">/mo</span>}
                </div>
                <span className="home-featured__tokens">
                  {tier.tokens === -1 ? "Tokens không giới hạn" : `${tier.tokens.toLocaleString()} tokens/tháng`}
                </span>
              </div>

              <ul className="home-featured__features">
                {tier.features.slice(0, 3).map((f, i) => (
                  <li key={i} className="home-featured__feature">
                    <Icon name="check" size={16} style={{ color: "var(--success)", flexShrink: 0, marginTop: 2 }} />
                    <span>{f.replace(/^\+\s*/, "")}</span>
                  </li>
                ))}
              </ul>

              <Button as={Link} to={`/signup?plan=${tier.id}`} variant={tier.id === "pro" ? "primary" : "ghost"} style={{ width: "100%", marginTop: "auto" }}>
                {tier.cta}
              </Button>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "var(--s-10)" }}>
          <Button as={Link} to="/pricing" variant="ghost">
            {t.featured?.ctaAll || "So sánh đầy đủ"} <Icon name="arrow-right" size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
}
