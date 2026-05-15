import React from "react";

import { Link } from "react-router-dom";

import { Badge, Button, Icon, Card } from "@/_shared/components/ui";

import { BillingCycleToggle } from "../finance/BillingCycleToggle";
import './ProductHero.css';



export function ProductHero({ view, product, billingCycle, setBillingCycle, addItem, dict, backHref }) {

  const isPlugin = view.type === "plugin";



  return (

    <section className="container" style={{ paddingTop: "var(--s-12)", paddingBottom: "var(--s-16)" }}>

      {/* Breadcrumb */}

      <nav className="row" style={{ gap: "var(--s-2)", marginBottom: "var(--s-8)" }}>

        <Link to={backHref} style={{ color: "color-mix(in srgb, var(--base-content) 80%, transparent)" }}>{dict.detail.breadcrumbHome}</Link>

        <span style={{ color: "color-mix(in srgb, var(--base-content) 60%, transparent)" }}>/</span>

        <strong>{view.localizedName}</strong>

      </nav>



      <div className="grid grid-cols-2" style={{ gap: "var(--s-8)", alignItems: "start" }}>

        {/* Left: Copy & Pricing */}

        <div className="stack" style={{ gap: "var(--s-6)" }}>

          <div className="stack" style={{ gap: "var(--s-2)" }}>

            <div className="row" style={{ gap: "var(--s-3)" }}>

              <Badge tone="info">{isPlugin ? dict.common.plugin : dict.common.theme}</Badge>

              <span className="text-xs muted">{dict.card.version} {view.version}</span>

            </div>

            <h1 style={{ margin: 0, fontSize: "var(--fs-48)", letterSpacing: "var(--tracking-tight)" }}>

              {view.localizedName}

            </h1>

            <p className="text-lg" style={{ margin: 0, color: "var(--primary)", fontWeight: 500 }}>

              {view.localizedTagline}

            </p>

            <p className="muted" style={{ margin: 0, fontSize: "var(--fs-16)", lineHeight: 1.6, maxWidth: 600 }}>

              {view.localizedDescription}

            </p>

          </div>



          {/* Pricing Card */}

          <Card style={{

            padding: "var(--s-6)", background: "var(--brand-soft)",

            border: "1px solid var(--primary)", borderRadius: "var(--r-4)",

          }}>

            <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-end", marginBottom: "var(--s-4)" }}>

              <div>

                <div className="row" style={{ alignItems: "baseline", gap: "var(--s-1)" }}>

                  <span style={{ fontSize: "var(--fs-48)", fontWeight: 600, letterSpacing: "-0.03em" }}>

                    {view.localizedPricing.label}

                  </span>

                  {view.localizedPricing.billing && (

                    <span className="muted" style={{ fontSize: "var(--fs-14)" }}>

                      /{view.localizedPricing.billing.replace(/^\//, "")}

                    </span>

                  )}

                </div>

              </div>

              <div className="stack" style={{ gap: "var(--s-2)", alignItems: "flex-end" }}>

                <BillingCycleToggle billingCycle={billingCycle} onChange={setBillingCycle} />

                {billingCycle === "yearly" && view.localizedPricing.savingsPct && (

                  <Badge tone="success">Save {view.localizedPricing.savingsPct}%</Badge>

                )}

              </div>

            </div>



            <div className="row" style={{ gap: "var(--s-2)", flexWrap: "wrap" }}>

              <Button variant="primary" size="lg" onClick={() => addItem(product, billingCycle)} style={{ flex: 1 }}>

                 {dict.detail.primaryCta}

              </Button>

              {view.hasDemoCta && (

                <Button as="a" href={view.cta.demoUrl} target="_blank" variant="ghost" size="lg">

                  {dict.detail.secondaryCta}

                </Button>

              )}

              {view.hasDocsCta && (

                <Button as="a" href={view.cta.docsUrl} target="_blank" variant="ghost" size="lg">

                  {dict.detail.docsCta}

                </Button>

              )}

            </div>

          </Card>

        </div>



        {/* Right: Media */}

        <div className="stack" style={{ gap: "var(--s-4)" }}>

          <div style={{

            borderRadius: "var(--r-4)", overflow: "hidden",

            border: "1px solid var(--base-border)",

          }}>

            <img

              src={view.media.cover}

              alt={view.localizedName}

              style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }}

              loading="eager"

            />

          </div>

          <dl className="row" style={{ gap: "var(--s-4)", margin: 0 }}>

            <div>

              <dt className="text-xs muted" style={{ margin: 0 }}>{dict.card.version}</dt>

              <dd style={{ margin: 0, fontWeight: 600 }}>{view.version}</dd>

            </div>

            <div>

              <dt className="text-xs muted" style={{ margin: 0 }}>{dict.common.typeLabel}</dt>

              <dd style={{ margin: 0, fontWeight: 600 }}>{isPlugin ? dict.common.plugin : dict.common.theme}</dd>

            </div>

          </dl>

        </div>

      </div>

    </section>

  );

}

