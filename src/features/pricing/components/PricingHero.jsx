import { Badge } from "@/_shared/components/ui";
import './PricingHero.css';




export function PricingHero({ billingCycle, setBillingCycle, copy }) {

  const isYearly = billingCycle === "yearly";



  return (

    <header className="pricing-header">

      <div className="mx-auto mb-6">

        <Badge tone="brand" className="px-4 py-1.5 text-xs font-semibold tracking-wide">Pi SaaS Pricing</Badge>

      </div>

      <h1 className="pricing-headline">{copy.title}</h1>

      <p className="pricing-subhead">{copy.subtitle}</p>



      <div className="billing-toggle mt-12" role="group" aria-label="Billing cycle">

        <button className={`billing-btn transition-all duration-300 ${!isYearly ?"is-active" : "hover:text-base-content"}`} onClick={() => setBillingCycle("monthly")}>

          {copy.monthly}

        </button>

        <button className={`billing-btn transition-all duration-300 ${isYearly ?"is-active" : "hover:text-base-content"}`} onClick={() => setBillingCycle("yearly")}>

          {copy.yearly} <span className="billing-save-badge">Ti?t ki?m 20%</span>

        </button>

      </div>

    </header>

  );

}

