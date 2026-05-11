import { Icon } from "../ui";

import "./PricingCard.css";



export function PricingCard({ tier, billingCycle, loadingTier, onCheckout, copy }) {

  const isYearly = billingCycle === "yearly";

  const price = isYearly ? tier.priceYearly : tier.priceMonthly;



  return (

    <div className={`pricing-card${tier.popular ? " pricing-card--popular" : ""}`} style={{ "--tier-accent": `var(${tier.accentVar})` }}>

      {tier.popular && <div className="pricing-popular-badge">{tier.badge}</div>}

      {!tier.popular && tier.badge && <div className="pricing-tier-badge">{tier.badge}</div>}



      <div className="pricing-card__header">

        <h2 className="pricing-tier-name">{tier.name}</h2>

        <p className="pricing-tier-desc">{tier.description}</p>

      </div>



      <div className="pricing-card__price">

        <div className="pricing-price-row">

          <span className="pricing-price tracking-tighter">

            {price === 0 ? "Free" : (

              <>

                <span className="text-2xl align-top mr-0.5">$</span>

                {price}

              </>

            )}

          </span>

          {price > 0 && <span className="pricing-price-period font-bold uppercase opacity-50">{copy.pricePeriod}</span>}

        </div>

        

        {tier.priceMonthly > 0 && (

          <div className="pricing-other-cycle">

            {isYearly ? (

              <span>${tier.priceMonthly} {copy.monthlyBilled}</span>

            ) : (

              <span>${tier.priceYearly} {copy.yearlyBilled}</span>

            )}

          </div>

        )}



        {isYearly && tier.priceMonthly > 0 && (

          <p className="pricing-yearly-note">

            {copy.yearlyPayPrefix} ${tier.priceYearly * 12}/{copy.yearlyUnit}  {copy.yearlySavePrefix} ${(tier.priceMonthly - tier.priceYearly) * 12}

          </p>

        )}

        <p className="pricing-tokens">{tier.monthlyTokens} {copy.tokensPerMonth}</p>

      </div>



      <ul className="pricing-features">

        {tier.features.map((f) => (

          <li key={f.text} className={`pricing-feature${f.included ? "" : " pricing-feature--excluded"}`}>

            <span className="pricing-feature-check">

              <Icon name={f.included ? "check" : "x"} size={15} />

            </span>

            {f.text}

          </li>

        ))}

      </ul>



      <button className={`pricing-cta${tier.popular ? " pricing-cta--popular" : ""}`} disabled={loadingTier === tier.id} onClick={() => onCheckout(tier.id)}>

        {loadingTier === tier.id ? <Icon name="loader" className="auth-spinner" size={16} /> : tier.cta}

      </button>

    </div>

  );

}

