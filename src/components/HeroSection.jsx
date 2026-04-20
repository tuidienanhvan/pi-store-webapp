import { Link } from "react-router-dom";
import { useLocale } from "../context/LocaleContext";
import { getLocalizedProduct } from "../lib/catalog";
import { Button, Card, Badge, Icon } from "./ui";

export function HeroSection({ featuredProduct, billingCycle, detailSearch = "" }) {
  const { dict, locale } = useLocale();
  const featured = featuredProduct ? getLocalizedProduct(featuredProduct, locale, billingCycle) : null;

  return (
    <section className="container py-16">
      <div className="grid --cols-2 gap-12 items-center">
        <div className="stack gap-6">
          <Badge tone="brand" className="text-14 w-fit px-3 py-1">
            {dict.hero.saleBadge}
          </Badge>
          <p className="text-14 muted uppercase tracking-wide m-0 font-semibold">
            {dict.hero.eyebrow}
          </p>
          <h1 className="text-48 leading-tight m-0">
            {dict.hero.title}
          </h1>
          <p className="text-18 muted leading-relaxed">
            {dict.hero.description}
          </p>
          <ul className="stack gap-2 list-none p-0">
            {(dict.hero.points ?? []).map((point) => (
              <li key={point} className="row gap-2 items-center">
                <Icon name="check" size={16} className="text-brand" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <div className="row gap-4 mt-4">
            <Button as="a" href="#catalog-grid" variant="secondary" size="lg">
              {dict.hero.ctaPrimary}
            </Button>
            {featured ? (
              <Button as={Link} to={`/product/${featured.slug}${detailSearch}`} variant="ghost" size="lg">
                {dict.hero.ctaSecondary}
              </Button>
            ) : null}
          </div>
        </div>

        <div>
          {featured ? (
            <Card className="overflow-hidden bg-surface-2 p-0" style={{ display: "flex", flexDirection: "column" }}>
              <div className="row justify-between items-center px-5 py-4 border-b border-hairline">
                <p className="text-14 font-semibold text-1 m-0">
                  {dict.hero.spotlight}
                </p>
                <Badge tone="info">{featured.type === "plugin" ? dict.common.plugin : dict.common.theme}</Badge>
              </div>

              <div style={{
                position: "relative",
                aspectRatio: "16/10",
                background: "var(--surface-3)",
                overflow: "hidden",
                borderBottom: "1px solid var(--hairline)"
              }}>
                <img src={featured.media.cover} alt={featured.localizedName} loading="eager" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>

              <div className="stack gap-3 p-5 bg-surface">
                <h2 className="text-24 m-0">
                  {featured.localizedName}
                </h2>
                <p className="muted m-0">
                  {featured.localizedTagline}
                </p>
                <div className="row justify-between mt-2">
                  <div className="row items-baseline gap-2">
                    <strong className="text-20">{featured.localizedPricing.label}</strong>
                    <span className="text-14 muted">{featured.localizedPricing.billing}</span>
                  </div>
                  <Button as={Link} to={`/product/${featured.slug}${detailSearch}`} variant="primary">
                    {dict.card.detail}
                  </Button>
                </div>
              </div>
            </Card>
          ) : null}
        </div>
      </div>
    </section>
  );
}
