import React from "react";



export function ProductFAQ({ view, dict }) {

  if (!view.localizedFaq || view.localizedFaq.length === 0) return null;



  return (

    <section className="container" style={{ paddingTop: "var(--s-16)", paddingBottom: "var(--s-16)", borderTop: "1px solid var(--base-border)" }}>

      <div style={{ maxWidth: 720, margin: "0 auto" }}>

        <h2 style={{ margin: "0 0 var(--s-5)", fontSize: "var(--fs-30)", textAlign: "center" }}>{dict.detail.faq}</h2>

        <div className="stack" style={{ gap: "var(--s-3)" }}>

          {view.localizedFaq.map((item, i) => (

            <details key={i} className="faq-item">

              <summary>{item.q}</summary>

              <p>{item.a}</p>

            </details>

          ))}

        </div>

      </div>

    </section>

  );

}

