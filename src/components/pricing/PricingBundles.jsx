import React from "react";

import { Link } from "react-router-dom";

import { Card, Badge, Button } from "../ui";

import { getLocalizedProduct } from "@/lib/catalog";

import "./PricingBundles.css";



function formatVND(n) {

  if (!Number.isFinite(n)) return null;

  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(n);

}



export function PricingBundles({ bundles, locale }) {

  if (!bundles || bundles.length === 0) return null;



  return (

    <section className="pricing-bundles">

      <header className="pricing-bundles__header">

        <h2 className="pricing-bundles__title">Plugin Bundles</h2>

        <p className="muted">

          Mua nhi?u plugin cng lc  ti?t ki?m d?n 55%.

        </p>

      </header>

      <div className="pricing-bundles__grid">

        {bundles.map((b) => <BundleCard key={b.slug} bundle={b} locale={locale} />)}

      </div>

    </section>

  );

}



function BundleCard({ bundle, locale }) {

  const view = getLocalizedProduct(bundle, locale, "yearly");

  const yearly = bundle.pricing?.yearly?.amount;

  const savings = bundle.pricing?.yearly?.savingsPct;

  const isLifetime = bundle.slug === "bundle-founder";



  return (

    <Card className="bundle-card">

      <img

        src={view.media.cover} alt={view.localizedName}

        className="bundle-card__image"

        loading="lazy"

      />

      <h3 className="bundle-card__title">{view.localizedName}</h3>

      <p className="muted text-sm">{view.localizedTagline}</p>

      <div className="bundle-card__price-row">

        <span className="bundle-card__price">{yearly ? formatVND(yearly) : ""}</span>

        <span className="muted text-sm">{isLifetime ? "one-time" : "/nam"}</span>

        {savings && <Badge tone="success" className="ml-auto">Save {savings}%</Badge>}

      </div>

      <Button as={Link} to={`/product/${bundle.slug}`} variant="ghost" className="w-full">Chi ti?t</Button>

    </Card>

  );

}

