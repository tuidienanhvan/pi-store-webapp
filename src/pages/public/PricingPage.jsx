import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLocale } from "@/context/LocaleContext";
import { useAuth } from "@/context/AuthContext";
import { billing } from "@/api/billing";
import { Badge, Alert } from "@/components/ui";
import { Info, Cpu, Zap, Activity, ShieldCheck, ArrowRight } from "lucide-react";
import PricingCard from "@/components/pricing/PricingCard";
import "./PricingPage.css";

const getTiers = (isVi) => [
  {
    id: "free",
    name: "Free",
    price_monthly: 0,
    price_yearly: 0,
    description: isVi 
      ? "Khởi động một site với SEO audit và AI tokens cơ bản." 
      : "Start one site with basic SEO audit and AI tokens.",
    features: [
      "1 site",
      "5,000 PI_TKN",
      "SEO Audit (Basic)",
      "Community Support"
    ],
    cta: isVi ? "Bắt đầu miễn phí" : "Start for Free",
    popular: false
  },
  {
    id: "pro",
    name: "Pro",
    price_monthly: 50,
    price_yearly: 480, // $40/mo
    description: isVi 
      ? "Gói vận hành cho site thương mại cần chatbot, lead và analytics." 
      : "Professional operations for e-commerce sites needing chatbots and analytics.",
    features: [
      "5 sites",
      "100,000 PI_TKN",
      "SEO Audit (Pro)",
      "Priority Support",
      "Custom Branding"
    ],
    cta: isVi ? "Nâng cấp Pro" : "Upgrade to Pro",
    popular: true
  },
  {
    id: "max",
    name: "Max",
    price_monthly: 199,
    price_yearly: 1908, // $159/mo
    description: isVi 
      ? "Cho đội vận hành chuyên nghiệp với nhu cầu lớn." 
      : "For professional teams with high-scale AI operational needs.",
    features: [
      "25 sites",
      "500,000 PI_TKN",
      "Full SEO Suite",
      "24/7 Support",
      "API Access",
      "SLA Guarantee"
    ],
    cta: isVi ? "Liên hệ Max" : "Contact for Max",
    popular: false
  }
];

const HeroHUD = () => {
  // Tạo mảng ngẫu nhiên cho Grid Matrix
  const matrixNodes = Array.from({ length: 24 }).map((_, i) => ({
    id: i,
    opacity: Math.random() > 0.4 ? 0.8 : 0.2,
    delay: `${Math.random() * 2}s`
  }));

  return (
    <div className="hero-hud-decorators">
      {/* Top Schematic Border */}
      <svg className="hud-schematic-border top" viewBox="0 0 1200 40" preserveAspectRatio="none">
        <path d="M0,10 L40,10 L60,30 L1140,30 L1160,10 L1200,10" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" />
        {/* Tick marks left */}
        <g stroke="currentColor" strokeOpacity="0.4" strokeWidth="1">
          <line x1="80" y1="30" x2="80" y2="35" />
          <line x1="90" y1="30" x2="90" y2="33" />
          <line x1="100" y1="30" x2="100" y2="38" />
          <line x1="110" y1="30" x2="110" y2="33" />
          <line x1="120" y1="30" x2="120" y2="35" />
        </g>
        {/* Center Tech Patterns instead of text */}
        <g stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" transform="translate(540, 15)">
          <path d="M0,5 L20,5 M30,5 L50,5 M60,5 L120,5" strokeDasharray="4 2" />
          <polygon points="55,2 65,2 60,8" fill="currentColor" opacity="0.5" />
        </g>
        {/* Tick marks right */}
        <g stroke="currentColor" strokeOpacity="0.4" strokeWidth="1">
          <line x1="1120" y1="30" x2="1120" y2="35" />
          <line x1="1110" y1="30" x2="1110" y2="33" />
          <line x1="1100" y1="30" x2="1100" y2="38" />
          <line x1="1090" y1="30" x2="1090" y2="33" />
          <line x1="1080" y1="30" x2="1080" y2="35" />
        </g>
      </svg>

      {/* Left Stat: Animated Nodes Matrix */}
      <div className="hud-stat tl">
        <svg className="node-matrix-svg" width="140" height="60">
          {/* Decorative scanner frame */}
          <path d="M0,10 L0,0 L10,0 M130,0 L140,0 L140,10 M0,50 L0,60 L10,60 M130,60 L140,60 L140,50" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5"/>
          <g transform="translate(14, 10)">
            {matrixNodes.map(node => (
              <rect 
                key={node.id} 
                x={(node.id % 8) * 14} 
                y={Math.floor(node.id / 8) * 14} 
                width="10" 
                height="10" 
                fill="currentColor" 
                className="matrix-rect"
                style={{ opacity: node.opacity, animationDelay: node.delay }}
              />
            ))}
          </g>
        </svg>
      </div>

      {/* Right Stat: AI Token Waveform */}
      <div className="hud-stat tr">
        <svg className="token-wave-svg" width="140" height="60" viewBox="0 0 140 60">
          {/* Decorative frame */}
          <path d="M0,10 L0,0 L10,0 M130,0 L140,0 L140,10 M0,50 L0,60 L10,60 M130,60 L140,60 L140,50" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5"/>
          {/* Grid bg */}
          <g transform="translate(10, 10)">
            <path d="M0,10 L120,10 M0,20 L120,20 M0,30 L120,30" stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" />
            <path d="M20,0 L20,40 M40,0 L40,40 M60,0 L60,40 M80,0 L80,40 M100,0 L100,40" stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" />
            {/* Sine wave */}
            <polyline 
              points="0,20 15,20 25,10 35,30 45,15 55,25 70,5 80,35 95,20 120,20" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              className="wave-line" 
            />
            <circle cx="120" cy="20" r="3" fill="currentColor" className="wave-dot" />
          </g>
        </svg>
      </div>

      <div className="hud-corners">
        <svg className="corner-svg tl" viewBox="0 0 40 40">
          <path d="M0,20 L0,0 L20,0" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="5" cy="5" r="1.5" fill="currentColor" />
        </svg>
        <svg className="corner-svg tr" viewBox="0 0 40 40">
          <path d="M20,0 L40,0 L40,20" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="35" cy="5" r="1.5" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
};

export default function PricingPage() {
  const { locale } = useLocale();
  const { isAuthed } = useAuth();
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [loadingTier, setLoadingTier] = useState("");
  const [_error, setError] = useState("");
  const isVi = locale === "vi";
  const tiers = getTiers(isVi);

  const copy = isVi
    ? {
        hero: {
          title: "Bảng giá rõ ràng cho",
          titleHighlight: "WordPress AI Operations",
          subtitle: "Trả tiền theo mức sử dụng. Nâng cấp hoặc hủy bất cứ lúc nào. Free đủ để thử nghiệm, Pro và Max đủ để vận hành sản xuất (production).",
          monthly: "HÀNG THÁNG",
          yearly: "HÀNG NĂM",
        },
        card: {
          pricePeriod: "THÁNG",
          yearlyPayPrefix: "thanh toán",
          yearlyUnit: "năm",
          yearlySavePrefix: "tiết kiệm",
          tokensPerMonth: "AI tokens/tháng",
          monthlyBilled: "thanh toán hàng tháng",
          yearlyBilled: "thanh toán hàng năm",
        },
        savingsLabel: "TIẾT KIỆM 20%",
        alerts: {
          canceled: "Thanh toán đã hủy. Bạn có thể chọn lại gói bất cứ lúc nào.",
        }
      }
    : {
        hero: {
          title: "Clear pricing for",
          titleHighlight: "WordPress AI Operations",
          subtitle: "Pay based on usage. Upgrade or cancel anytime. Free is enough to test, Pro and Max are ready for production.",
          monthly: "MONTHLY",
          yearly: "YEARLY",
        },
        card: {
          pricePeriod: "mo",
          yearlyPayPrefix: "pay",
          yearlyUnit: "year",
          yearlySavePrefix: "save",
          tokensPerMonth: "AI tokens/month",
          monthlyBilled: "billed monthly",
          yearlyBilled: "billed yearly",
        },
        savingsLabel: "SAVE 20%",
        alerts: {
          canceled: "Payment canceled. You can choose a plan again anytime.",
        }
      };

  const startCheckout = async (tierId) => {
    setError("");
    if (tierId === "free") {
      navigate("/signup?plan=free");
      return;
    }
    if (!isAuthed) {
      navigate(`/signup?plan=${tierId}`);
      return;
    }
    setLoadingTier(tierId);
    try {
      if (import.meta.env.VITE_DEMO_MODE === "true") {
        await billing.simulateSuccess({ tier: tierId });
        navigate("/app/billing/success?tier=" + tierId);
        return;
      }
      const { url } = await billing.subscribeCheckout({
        tier: tierId,
        cycle: billingCycle,
      });
      window.location.href = url;
    } catch (err) {
      console.error(err);
      setError("stripeError");
      setLoadingTier("");
    }
  };

  const handleCheckout = (tierId) => {
    startCheckout(tierId);
  };

  return (
    <div className="pricing-page">
      <div className="pricing-hero">
        <div className="hero-glow-back" />
        <div className="mx-auto w-full max-w-[1200px] px-8 relative">
          <HeroHUD />
          
          <div className="hero-content">
            <Badge tone="brand" className="pricing-badge">
              <Zap size={12} className="mr-2" />
              <span>PI_INFRA_V2_PRICING</span>
            </Badge>
            
            <h1 className="pricing-headline">
              {copy.hero.title}<br />
              <span className="text-gradient">{copy.hero.titleHighlight}</span>
            </h1>
            
            <p className="pricing-subline">
              {copy.hero.subtitle}
            </p>

            <div className="billing-switcher-quantum">
              <button 
                className={`switcher-tab ${billingCycle === "monthly" ? "active" : ""}`}
                onClick={() => setBillingCycle("monthly")}
              >
                <div className="tab-bg" />
                <span>{copy.hero.monthly}</span>
              </button>
              <button 
                className={`switcher-tab ${billingCycle === "yearly" ? "active" : ""}`}
                onClick={() => setBillingCycle("yearly")}
              >
                <div className="tab-bg" />
                <span>{copy.hero.yearly}</span>
                <Badge tone="success" className="save-badge">{copy.savingsLabel}</Badge>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1400px] px-8 lg:px-20 py-20">
        {sp.get("status") === "canceled" && (
          <div className="mb-12">
            <Alert tone="warning" title="THÔNG BÁO HỆ THỐNG" icon={Info}>
              {copy.alerts.canceled}
            </Alert>
          </div>
        )}

        <div className="pricing-grid">
          {tiers.map((tier) => (
            <PricingCard
              key={tier.id}
              tier={tier}
              billingCycle={billingCycle}
              loadingTier={loadingTier}
              onCheckout={handleCheckout}
              copy={copy.card}
            />
          ))}
        </div>
        
        {/* Support Footer */}
        <div className="pricing-footer-hud">
          <div className="footer-hud-unit">
             <ShieldCheck size={20} className="text-primary" />
             <div className="unit-text">
                <span className="label">SECURE_PAYMENTS</span>
                <span className="desc">ENCRYPTED VIA STRIPE GATEWAY</span>
             </div>
          </div>
          <div className="footer-hud-unit">
             <Activity size={20} className="text-primary" />
             <div className="unit-text">
                <span className="label">SLA_GUARANTEE</span>
                <span className="desc">99.9% UPTIME FOR PRO/MAX</span>
             </div>
          </div>
          <div className="footer-hud-unit clickable">
             <div className="unit-text text-right">
                <span className="label">NEED_CUSTOM_PLAN?</span>
                <span className="desc">CONTACT ENTERPRISE SUPPORT</span>
             </div>
             <ArrowRight size={20} className="text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
}
