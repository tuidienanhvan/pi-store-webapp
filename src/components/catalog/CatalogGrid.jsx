import React from "react";
import { ProductCard } from "../ProductCard";
import { Icon } from "../ui";
import "./CatalogGrid.css";

const SECTION_META = {
  tokens: {
    icon: "",
    title: "Pi AI Cloud Tokens",
    hint: "Ví AI tokens dùng chung cho toàn bộ Pi Pro plugins — mua 1 lần, xài mọi nơi.",
  },
  bundle: {
    icon: "",
    title: "Bundles — tiết kiệm đến 55%",
    hint: "Gói combo plugin Pro + Pi AI tokens kèm sẵn. Rẻ hơn mua lẻ 25-55%.",
  },
  plugin: {
    icon: "",
    title: "Plugin lẻ",
    hint: "Mua từng plugin riêng theo nhu cầu. Free tier đủ xài, Pro tier trả qua tokens.",
  },
};

export function CatalogGrid({ bucketed, visibleSections, billingCycle, onConsult, totalVisible, dict }) {
  if (totalVisible === 0) {
    return (
      <div className="container" style={{ padding: "var(--s-16) var(--s-4)" }}>
        <article style={{
          textAlign: "center",
          padding: "var(--s-16)",
          background: "var(--surface-2)",
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
              <h3 className="row text-24" style={{ margin: 0 }}>
                <span>{meta.icon}</span>
                <span>{meta.title}</span>
                <span className="muted" style={{ fontWeight: "normal", fontSize: "var(--fs-18)" }}>— {items.length}</span>
              </h3>
              <p className="muted">{meta.hint}</p>
            </div>
            <div className="grid --cols-3" aria-live="polite">
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
