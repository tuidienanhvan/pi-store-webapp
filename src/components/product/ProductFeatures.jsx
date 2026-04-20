import React from "react";
import { Icon } from "../ui";

export function ProductFeatures({ view, dict }) {
  return (
    <section className="container" style={{ paddingTop: "var(--s-16)", paddingBottom: "var(--s-16)", borderTop: "1px solid var(--hairline)" }}>
      <div className="grid --cols-2" style={{ gap: "var(--s-8)", alignItems: "start" }}>
        {/* Left: Features */}
        <div className="stack" style={{ gap: "var(--s-4)" }}>
          <h2 style={{ margin: 0, fontSize: "var(--fs-24)" }}>{dict.detail.features}</h2>
          <ul className="stack" style={{ gap: "var(--s-2)", margin: 0, padding: 0, listStyle: "none" }}>
            {view.localizedFeatures.map((feature) => (
              <li key={feature} className="row" style={{ gap: "var(--s-2)", alignItems: "flex-start" }}>
                <Icon name="check" size={16} style={{ color: "var(--brand)", flexShrink: 0, marginTop: 2 }} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Use Cases */}
        <div className="stack" style={{ gap: "var(--s-4)" }}>
          <h2 style={{ margin: 0, fontSize: "var(--fs-24)" }}>{dict.detail.useCases}</h2>
          <ul className="stack" style={{ gap: "var(--s-2)", margin: 0, padding: 0, listStyle: "none" }}>
            {view.localizedUseCases.map((useCase) => (
              <li key={useCase} className="row" style={{ gap: "var(--s-2)", alignItems: "flex-start" }}>
                <span style={{ color: "var(--info)", flexShrink: 0, marginTop: 6, width: 6, height: 6, borderRadius: "50%", background: "var(--info)", display: "inline-block" }} />
                <span className="muted">{useCase}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
