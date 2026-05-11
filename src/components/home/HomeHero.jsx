import "./HomeHero.css";

import { Link } from "react-router-dom";

import { Button, Icon } from "../ui";



export function HomeHero({ t }) {

  if (!t || !t.hero) return null;



  return (

    <section className="home-section home-hero">

      <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-10">

        <div className="home-hero__grid">

          <div className="home-hero__copy">

            <div className="home-hero__badge">

              <span className="badge-glow" />

              {t?.hero?.saleBadge}  {t?.hero?.eyebrow}

            </div>

            <h1 className="home-hero__title">

              {t?.hero?.title}

              <span>{t?.hero?.subtitle}</span>

            </h1>

            <p className="home-hero__desc">

              {t?.hero?.description}

            </p>







            <div className="home-hero__actions">

              <Button as={Link} to="/pricing" variant="primary" size="lg">

                {t?.hero?.ctaPrimary}

              </Button>

              <Button as={Link} to="/about" variant="ghost" size="lg">

                {t?.hero?.ctaSecondary} <Icon name="arrow-right" size={16} />

              </Button>

            </div>



            <div className="home-hero__stats" aria-label="Pi ecosystem highlights">

              <div><strong>5K</strong><span>{t?.hero?.stats?.freeTokens || "free tokens/mo"}</span></div>

              <div><strong>4</strong><span>{t?.hero?.stats?.tiers || "tiers"}</span></div>

              <div><strong>VN</strong><span>{t?.hero?.stats?.market || "Vietnam market"}</span></div>

            </div>

          </div>



          <div className="home-hero__product" aria-label="Pi dashboard preview">

            <div className="product-shell">

              <div className="product-shell__bar">

                <span />

                <span />

                <span />

                <strong>Pi Dashboard</strong>

              </div>

              <div className="product-shell__body">

                <aside>

                  {["Overview", "SEO Bot", "AI Cloud"].map((item, index) => (

                    <div key={item} className={index === 0 ? "is-active" : ""}>{item}</div>

                  ))}

                </aside>

                <main>

                  <div className="preview-kpi preview-kpi--wide">

                    <span>System status</span>

                    <strong>Operational</strong>

                    <small>All plugins synced</small>

                  </div>

                  <div className="preview-grid">

                    <div className="preview-kpi"><span>Tokens</span><strong>100K</strong><small>Pro quota</small></div>

                    <div className="preview-kpi"><span>SEO jobs</span><strong>38</strong><small>Queued</small></div>

                    <div className="preview-kpi"><span>Leads</span><strong>12</strong><small>This week</small></div>

                  </div>

                  <div className="preview-chart">

                    <span style={{ height: "42%" }} />

                    <span style={{ height: "64%" }} />

                    <span style={{ height: "38%" }} />

                    <span style={{ height: "78%" }} />

                    <span style={{ height: "58%" }} />

                    <span style={{ height: "88%" }} />

                  </div>

                </main>

              </div>

            </div>



            <div className="home-hero__callout home-hero__callout--top">

              <Icon name="zap" size={16} />

              <div><strong>Server-side logic</strong><span>Code never ships to customers</span></div>

            </div>

            <div className="home-hero__callout home-hero__callout--bottom">

              <Icon name="cpu" size={16} />

              <div><strong>Provider failover</strong><span>Groq, Gemini, OpenAI, Anthropic</span></div>

            </div>

          </div>

        </div>

      </div>

    </section>

  );

}

