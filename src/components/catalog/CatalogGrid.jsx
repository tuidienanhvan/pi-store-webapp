import React from "react";
import { ProductCard } from "../ProductCard";
import { Icon } from "../ui";

const SECTION_META = {
  tokens: {
    icon: "",
    title: "Pi AI Cloud Tokens",
    hint: "V AI tokens dng chung cho ton b? Pi Pro plugins  mua 1 l?n, xi mi noi.",
  },
  bundle: {
    icon: "",
    title: "Bundles  ti?t ki?m d?n 55%",
    hint: "Gi combo plugin Pro + Pi AI tokens km s?n. R? hon mua l? 25-55%.",
  },
  plugin: {
    icon: "",
    title: "Plugin l?",
    hint: "Mua tng plugin ring theo nhu c?u. Free tier d? xi, Pro tier tr? qua tokens.",
  },
};

export function CatalogGrid({ bucketed, visibleSections, billingCycle, onConsult, totalVisible, dict }) {
  if (totalVisible === 0) {
    return (
      <div className="container" style={{ padding: "var(--s-16) var(--s-4)" }}>
        <article style={{
          textAlign: "center",
          padding: "var(--s-16)",
          background: "var(--base-300)",
          borderRadius: "var(--r-3)",
        }}>
          <h3 style={{ margin: 0, fontSize: "var(--fs-24)" }}>{dict.common.empty}</h3>
          <p className="muted" style={{ margin: 0 }}>{dict.common.emptyHint}</p>
        </article>
      </div>
    );
  }

  return (
    <div className="container stack" style={{ gap: "var(--s-10)", paddingBottom: "var(--s-20)" }}>
      {visibleSections.map((bucket) => {
        const items = bucketed[bucket];
        if (items.length === 0) return null;
        const meta = SECTION_META[bucket];

        return (
          <div key={bucket} className="stack" style={{ gap: "var(--s-4)", marginTop: "var(--s-8)" }}>
            <div className="stack" style={{ gap: "var(--s-2)" }}>
              <h3 className="row text-2xl" style={{ margin: 0 }}>
                <span>{meta.icon}</span>
                <span>{meta.title}</span>
                <span className="muted" style={{ fontWeight: "normal", fontSize: "var(--fs-18)" }}> {items.length}</span>
              </h3>
              <p className="muted">{meta.hint}</p>
            </div>
            <div className="grid grid-cols-3" aria-live="polite">
              {items.map((product) => (
                <ProductCard
                  key={product.slug}
                  product={product}
                  onConsult={onConsult}
                  billingCycle={billingCycle}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
