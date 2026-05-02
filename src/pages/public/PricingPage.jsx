import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLocale } from "../../context/LocaleContext";
import { Alert } from "../../components/ui";
import { billing } from "../../api/billing";
import { PricingHero } from "../../components/pricing/PricingHero";
import { PricingGrid } from "../../components/pricing/PricingGrid";
import { PricingEnterprise } from "../../components/pricing/PricingEnterprise";

const getTiers = (isVi) => [
  {
    id: "free",
    name: "Free",
    priceMonthly: 0,
    priceYearly: 0,
    monthlyTokens: "5,000",
    badge: null,
    accentVar: "--pi-tier-free",
    description: isVi ? "Khởi động một site với SEO audit và AI tokens cơ bản." : "Start one site with SEO audit and essential AI tokens.",
    features: [
      { text: isVi ? "1 site" : "1 site", included: true },
      { text: isVi ? "SEO audit cơ bản" : "Basic SEO audit", included: true },
      { text: isVi ? "5,000 AI tokens/tháng" : "5,000 AI tokens/month", included: true },
      { text: "AI Chatbot", included: false },
      { text: "Lead pipeline", included: false },
      { text: "Analytics dashboard", included: false },
      { text: isVi ? "Ưu tiên hỗ trợ" : "Priority support", included: false },
    ],
    cta: isVi ? "Bắt đầu miễn phí" : "Start free",
  },
  {
    id: "pro",
    name: "Pro",
    priceMonthly: 19,
    priceYearly: 15,
    monthlyTokens: "100,000",
    badge: isVi ? "Phổ biến nhất" : "Most popular",
    popular: true,
    accentVar: "--pi-tier-pro",
    description: isVi ? "Gói vận hành cho site thương mại cần chatbot, lead và analytics." : "Operating plan for commerce sites that need chatbot, lead and analytics.",
    features: [
      { text: isVi ? "5 sites" : "5 sites", included: true },
      { text: isVi ? "Tất cả tính năng Free" : "All Free features", included: true },
      { text: "AI Chatbot", included: true },
      { text: "Lead pipeline", included: true },
      { text: "Analytics dashboard", included: true },
      { text: isVi ? "100,000 AI tokens/tháng" : "100,000 AI tokens/month", included: true },
      { text: isVi ? "Nạp thêm token" : "Top-up extra tokens", included: true },
    ],
    cta: isVi ? "Nâng cấp Pro" : "Upgrade Pro",
  },
  {
    id: "max",
    name: "Max",
    priceMonthly: 49,
    priceYearly: 39,
    monthlyTokens: "500,000",
    badge: isVi ? "Cho đội vận hành" : "For operations teams",
    accentVar: "--pi-tier-max",
    description: isVi ? "Multi-site, white-label và quota lớn cho đội chuyên nghiệp." : "Multi-site, white-label and larger quotas for advanced teams.",
    features: [
      { text: isVi ? "25 sites" : "25 sites", included: true },
      { text: isVi ? "Tất cả tính năng Pro" : "All Pro features", included: true },
      { text: "Multi-site management", included: true },
      { text: "White-label branding", included: true },
      { text: isVi ? "500,000 AI tokens/tháng" : "500,000 AI tokens/month", included: true },
      { text: isVi ? "Hỗ trợ ưu tiên 24/7" : "Priority support 24/7", included: true },
      { text: "Custom integrations", included: true },
    ],
    cta: isVi ? "Nâng cấp Max" : "Upgrade Max",
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
          title: "Pricing rõ ràng cho WordPress AI operations",
          subtitle: "Trả tiền theo mức sử dụng. Nâng cấp hoặc hủy bất cứ lúc nào. Free đủ để thử nghiệm, Pro và Max đủ để vận hành production.",
          monthly: "Tháng",
          yearly: "Năm",
        },
        card: {
          pricePeriod: "/ tháng",
          yearlyPayPrefix: "thanh toán",
          yearlyUnit: "năm",
          yearlySavePrefix: "tiết kiệm",
          tokensPerMonth: "AI tokens/tháng",
        },
        enterprise: {
          title: "Cần solution riêng?",
          description: "Custom token limits, dedicated infrastructure, SLA cam kết, SSO, white-label và triển khai riêng cho đội 50+ người.",
          features: ["Unlimited sites", "Custom SLA", "SSO / SAML", "Dedicated infrastructure", "24/7 premium support", "Custom integrations"],
          cta: "Liên hệ sales",
          note: "Phản hồi trong 2 giờ làm việc",
        },
        alerts: {
          canceled: "Thanh toán đã hủy. Bạn có thể chọn lại gói bất cứ lúc nào.",
          stripeError: "Không tạo được phiên thanh toán Stripe.",
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
