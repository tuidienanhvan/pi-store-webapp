import React from "react";
import { Link } from "react-router-dom";
import { Card, Badge, Button } from "../ui";
import { getLocalizedProduct } from "../../lib/catalog";
import "./PricingBundles.css";

function formatVND(n) {
  if (!Number.isFinite(n)) return null;
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(n);
}

export function PricingBundles({ bundles, locale }) {
  if (!bundles || bundles.length === 0) return null;

  return (
    <section style={{ maxWidth: 1240, margin: "0 auto", padding: "0 var(--s-4)" }}>
      <header style={{ textAlign: "center", marginBottom: "var(--s-8)" }}>
        <h2 style={{ margin: "0 0 var(--s-2)", fontSize: "var(--fs-36)" }}>Plugin Bundles</h2>
        <p className="muted" style={{ margin: 0, fontSize: "var(--fs-16)" }}>
          Mua nhiều plugin cùng lúc — tiết kiệm đến 55%.
        </p>
      </header>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "var(--s-4)",
      }}>
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
    <Card style={{ padding: "var(--s-5)", display: "flex", flexDirection: "column", gap: "var(--s-3)" }}>
      <img
        src={view.media.cover} alt={view.localizedName}
        style={{ width: "100%", borderRadius: "var(--r-3)", aspectRatio: "16/10", objectFit: "cover" }}
        loading="lazy"
      />
      <h3 style={{ margin: 0, fontSize: "var(--fs-20)" }}>{view.localizedName}</h3>
      <p className="muted" style={{ margin: 0, fontSize: "var(--fs-14)" }}>{view.localizedTagline}</p>
      <div className="row" style={{ alignItems: "baseline", gap: "var(--s-2)" }}>
        <span style={{ fontSize: "var(--fs-30)", fontWeight: 600 }}>{yearly ? formatVND(yearly) : "—"}</span>
        <span className="muted" style={{ fontSize: "var(--fs-14)" }}>{isLifetime ? "one-time" : "/năm"}</span>
        {savings && <Badge tone="success" style={{ marginLeft: "auto" }}>Save {savings}%</Badge>}
      </div>
      <Button as={Link} to={`/product/${bundle.slug}`} variant="ghost" style={{ width: "100%" }}>Chi tiết</Button>
    </Card>
  );
}
