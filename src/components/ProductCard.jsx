import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useLocale } from "../context/LocaleContext";
import { getLocalizedProduct } from "../lib/catalog";
import { Card, Badge, Icon } from "./ui";

export function ProductCard({ product, onConsult, billingCycle = "yearly", className = "", style = {} }) {
  const { dict, locale } = useLocale();
  const location = useLocation();
  const view = getLocalizedProduct(product, locale, billingCycle);
  const detailHref = `/product/${view.slug}${location.search}`;

  const isBundle = product.slug.startsWith("bundle-");
  const savingsText = billingCycle === "yearly" && view.localizedPricing.savingsPct
    ? `${locale === "vi" ? "TI\u1ebeT KI\u1ec6M" : "SAVE"} ${view.localizedPricing.savingsPct}%`
    : "";
  const contactText = locale === "vi" ? "Li\u00ean h\u1ec7" : "Contact";

  return (
    <Card
      as={Link}
      to={detailHref}
      className={`product-card hover-glow p-0 overflow-hidden ${className}`}
      style={{
        ...style,
      }}
    >
      <div className="product-card__media">
        <img
          src={view.media.cover}
          alt={view.localizedName}
          loading="lazy"
          className="product-card__image"
        />
        <div className="product-card__badge">
          <Badge tone="info">
            {isBundle ? "BUN" : "PLG"}
          </Badge>
        </div>
      </div>

      <div className="product-card__body">
        <h3 className="product-card__title text-18 m-0">{view.localizedName}</h3>

        <p className="product-card__tagline text-12 muted m-0 uppercase" style={{ WebkitBoxOrient: "vertical" }}>
          {view.localizedTagline || "Premium Product"}
        </p>

        <p className="product-card__description text-14 muted m-0" style={{ WebkitBoxOrient: "vertical" }}>
          {view.localizedDescription}
        </p>
      </div>

      <div className="product-card__footer">
        <div className="product-card__meta">
          <span className={`product-card__savings text-12 text-brand uppercase${savingsText ? " is-visible" : ""}`}>
            {savingsText || "\u00a0"}
          </span>

          <div className="product-card__row">
            <div className="product-card__price">
              {Number.isFinite(view.localizedPricing.amount) ? (
                <div className="product-card__price-main">
                  <span className="product-card__amount text-18 text-brand">{view.localizedPricing.label}</span>
                  {view.localizedPricing.billing && (
                    <span className="product-card__billing text-12 muted">
                      /{view.localizedPricing.billing.replace(/^\//, "")}
                    </span>
                  )}
                </div>
              ) : (
                <span className="product-card__contact text-18">{view.localizedPricing.label || contactText}</span>
              )}
            </div>

            <div className="product-card__link text-brand">
              <span>{dict.card.detail || "Details"}</span>
              <Icon name="arrow-right" size={12} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
