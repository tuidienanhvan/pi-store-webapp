import React from "react";

import { PricingCard } from "./PricingCard";

import "./PricingGrid.css";



export function PricingGrid({ tiers, billingCycle, loadingTier, onCheckout, copy }) {

  return (

    <div className="pricing-grid">

      {tiers.map((tier) => (

        <PricingCard

          key={tier.id}

          tier={tier}

          billingCycle={billingCycle}

          loadingTier={loadingTier}

          onCheckout={onCheckout}

          copy={copy}

        />

      ))}

    </div>

  );

}

