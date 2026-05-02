import { Badge } from "../ui";
import "./PricingHero.css";

export function PricingHero({ billingCycle, setBillingCycle, copy }) {
  const isYearly = billingCycle === "yearly";

  return (
    <header className="pricing-header">
      <Badge tone="brand">Pi SaaS Pricing</Badge>
      <h1 className="pricing-headline">{copy.title}</h1>
      <p className="pricing-subhead">{copy.subtitle}</p>

      <div className="billing-toggle mt-4" role="group" aria-label="Billing cycle">
        <button className={`billing-btn${!isYearly ? " is-active" : ""}`} onClick={() => setBillingCycle("monthly")}>
          {copy.monthly}
        </button>
        <button className={`billing-btn${isYearly ? " is-active" : ""}`} onClick={() => setBillingCycle("yearly")}>
          {copy.yearly} <span className="billing-save-badge">-20%</span>
        </button>
      </div>
    </header>
  );
}
