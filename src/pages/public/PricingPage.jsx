import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLocale } from "@/context/LocaleContext";
import { Alert } from "@/components/ui";
import { billing } from "@/api/billing";
import { PricingHero } from "@/components/pricing/PricingHero";
import { PricingGrid } from "@/components/pricing/PricingGrid";
import { PricingEnterprise } from "@/components/pricing/PricingEnterprise";
import "./PricingPage.css";

const getTiers = (isVi) => [
  {
    id: "free",
    name: "Free",
    priceMonthly: 0,
    priceYearly: 0,
    monthlyTokens: "5,000",
    badge: null,
    accentVar: "--pi-tier-free",
    description: isVi ? "Kh?i d?ng m?t site v?i SEO audit v AI tokens co b?n." : "Start one site with SEO audit and essential AI tokens.",
    features: [
      { text: isVi ? "1 site" : "1 site", included: true },
      { text: isVi ? "SEO audit co b?n" : "Basic SEO audit", included: true },
      { text: isVi ? "50,000 AI tokens/thng" : "50,000 AI tokens/month", included: true },
      { text: "AI Chatbot", included: false },
      { text: "Lead pipeline", included: false },
      { text: "Analytics dashboard", included: false },
      { text: isVi ? "Uu tin h? tr?" : "Priority support", included: false },
    ],
    cta: isVi ? "B?t d?u mi?n ph" : "Start free",
  },
  {
    id: "pro",
    name: "Pro",
    priceMonthly: 19,
    priceYearly: 15,
    monthlyTokens: "100,000",
    badge: isVi ? "Ph? bi?n nh?t" : "Most popular",
    popular: true,
    accentVar: "--pi-tier-pro",
    description: isVi ? "Gi v?n hnh cho site thuong mi c?n chatbot, lead v analytics." : "Operating plan for commerce sites that need chatbot, lead and analytics.",
    features: [
      { text: isVi ? "5 sites" : "5 sites", included: true },
      { text: isVi ? "Tt c tnh nang Free" : "All Free features", included: true },
      { text: "AI Chatbot", included: true },
      { text: "Lead pipeline", included: true },
      { text: "Analytics dashboard", included: true },
      { text: isVi ? "1,000,000 AI tokens/thng" : "1,000,000 AI tokens/month", included: true },
      { text: isVi ? "N?p thm token" : "Top-up extra tokens", included: true },
    ],
    cta: isVi ? "Nng c?p Pro" : "Upgrade Pro",
  },
  {
    id: "max",
    name: "Max",
    priceMonthly: 49,
    priceYearly: 39,
    monthlyTokens: "500,000",
    badge: isVi ? "Cho d?i v?n hnh" : "For operations teams",
    accentVar: "--pi-tier-max",
    description: isVi ? "Multi-site, white-label v quota l?n cho d?i chuyn nghi?p." : "Multi-site, white-label and larger quotas for advanced teams.",
    features: [
      { text: isVi ? "25 sites" : "25 sites", included: true },
      { text: isVi ? "Tt c tnh nang Pro" : "All Pro features", included: true },
      { text: "Multi-site management", included: true },
      { text: "White-label branding", included: true },
      { text: isVi ? "3,000,000 AI tokens/thng" : "3,000,000 AI tokens/month", included: true },
      { text: isVi ? "H? tr? uu tin 24/7" : "Priority support 24/7", included: true },
      { text: "Custom integrations", included: true },
    ],
    cta: isVi ? "Nng c?p Max" : "Upgrade Max",
  },
];

export function PricingPage() {
  const { isAuthed } = useAuth();
  const { locale } = useLocale();
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [loadingTier, setLoadingTier] = useState("");
  const [error, setError] = useState("");
  const canceled = sp.get("status") === "canceled";
  const isVi = locale === "vi";
  const tiers = getTiers(isVi);

  const copy = isVi
    ? {
        hero: {
          title: "Pricing r rng cho WordPress AI operations",
          subtitle: "Tr? ti?n theo m?c s? d?ng. Nng c?p ho?c h?y b?t c? lc no. Free d? d? th? nghi?m, Pro v Max d? d? v?n hnh production.",
          monthly: "Thng",
          yearly: "Nam",
        },
        card: {
          pricePeriod: "/ thng",
          yearlyPayPrefix: "thanh ton",
          yearlyUnit: "nam",
          yearlySavePrefix: "ti?t ki?m",
          tokensPerMonth: "AI tokens/thng",
          monthlyBilled: "theo thng",
          yearlyBilled: "theo nam",
        },
        enterprise: {
          title: "C?n solution ring?",
          description: "Custom token limits, dedicated infrastructure, SLA cam k?t, SSO, white-label v tri?n khai ring cho d?i 50+ ngu?i.",
          features: ["Unlimited sites", "Custom SLA", "SSO / SAML", "Dedicated infrastructure", "24/7 premium support", "Custom integrations"],
          cta: "Lin h? sales",
          note: "Ph?n h?i trong 2 gi? lm vi?c",
        },
        alerts: {
          canceled: "Thanh ton d h?y. B?n c th? ch?n l?i gi b?t c? lc no.",
          stripeError: "Khng t?o du?c phin thanh ton Stripe.",
        },
      }
    : {
        hero: {
          title: "Clear pricing for WordPress AI operations",
          subtitle: "Pay based on usage. Upgrade or cancel anytime. Free is enough to test, Pro and Max are ready for production.",
          monthly: "Monthly",
          yearly: "Yearly",
        },
        card: {
          pricePeriod: "/ month",
          yearlyPayPrefix: "billed",
          yearlyUnit: "year",
          yearlySavePrefix: "save",
          tokensPerMonth: "AI tokens/month",
          monthlyBilled: "monthly",
          yearlyBilled: "yearly",
        },
        enterprise: {
          title: "Need a custom solution?",
          description: "Custom token limits, dedicated infrastructure, SLA commitments, SSO, white-label, and dedicated rollout for teams of 50+.",
          features: ["Unlimited sites", "Custom SLA", "SSO / SAML", "Dedicated infrastructure", "24/7 premium support", "Custom integrations"],
          cta: "Contact sales",
          note: "Response within 2 business hours",
        },
        alerts: {
          canceled: "Payment canceled. You can choose a plan again anytime.",
          stripeError: "Could not create Stripe checkout session.",
        },
      };

  const startCheckout = async (tier) => {
    setError("");
    if (tier === "free") {
      navigate("/signup?plan=free");
      return;
    }
    if (!isAuthed) {
      navigate(`/signup?plan=${tier}`);
      return;
    }
    setLoadingTier(tier);
    try {
      // Simulation mode bypasses Stripe
      if (import.meta.env.VITE_DEMO_MODE === "true") {
        await billing.simulateSuccess({ tier });
        navigate("/app/billing/success?tier=" + tier);
        return;
      }

      const res = await billing.subscribeCheckout({ tier });
      window.location.href = res.checkout_url;
    } catch (err) {
      setError(err.message || copy.alerts.stripeError);
    } finally {
      setLoadingTier("");
    }
  };

  return (
    <div className="pricing-page">
      <PricingHero billingCycle={billingCycle} setBillingCycle={setBillingCycle} copy={copy.hero} />

      <div className="pricing-alerts">
        {canceled && <Alert tone="warning">{copy.alerts.canceled}</Alert>}
        {error && (
          <Alert tone="danger" onDismiss={() => setError("")}>
            {error}
          </Alert>
        )}
      </div>

      <PricingGrid tiers={tiers} billingCycle={billingCycle} loadingTier={loadingTier} onCheckout={startCheckout} copy={copy.card} />
      <PricingEnterprise copy={copy.enterprise} />
    </div>
  );
}

export default PricingPage;
