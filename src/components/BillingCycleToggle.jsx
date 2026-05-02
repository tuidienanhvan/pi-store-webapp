import { useLocale } from "../context/LocaleContext";
import "./BillingCycleToggle.css";

export function BillingCycleToggle({ billingCycle, onChange }) {
  const { dict, locale } = useLocale();

  return (
    <div className="billing-toggle" role="group" aria-label={locale === "vi" ? "Chu kỳ thanh toán" : "Billing cycle"}>
      <button
        type="button"
        className={billingCycle === "monthly" ? "billing-btn active" : "billing-btn"}
        onClick={() => onChange("monthly")}
        aria-pressed={billingCycle === "monthly"}
      >
        {dict.pricing.monthly}
      </button>
      <button
        type="button"
        className={billingCycle === "yearly" ? "billing-btn active" : "billing-btn"}
        onClick={() => onChange("yearly")}
        aria-pressed={billingCycle === "yearly"}
      >
        {dict.pricing.yearly}
      </button>
    </div>
  );
}
