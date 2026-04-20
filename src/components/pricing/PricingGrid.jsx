import React from "react";
import { Link } from "react-router-dom";
import { Card, Badge, Button, Icon, Skeleton } from "../ui";

function formatUSD(cents) {
  if (cents == null) return "—";
  const d = cents / 100;
  return d >= 100 ? `$${Math.round(d)}` : `$${d.toFixed(d % 1 === 0 ? 0 : 2)}`;
}

function formatTokens(n) {
  if (!n) return "0";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return n.toLocaleString();
}

export function PricingGrid({ packages, billing, loading }) {
  if (loading) {
    return (
      <div className="container grid --cols-4" style={{ paddingBottom: "var(--s-20)" }}>
        {[1, 2, 3, 4].map((i) => <Skeleton key={i} style={{ height: 520 }} />)}
      </div>
    );
  }

  return (
    <div className="container stack" style={{ gap: "var(--s-16)", paddingBottom: "var(--s-20)" }}>
      <div className="grid --cols-4" style={{ alignItems: "stretch" }}>
        {packages.map((p) => (
          <PackageCard key={p.slug} pkg={p} billing={billing} />
        ))}
      </div>

      {/* Quality Tier Quick-Specs */}
      <Card style={{ maxWidth: 900, margin: "0 auto", padding: "var(--s-6)" }}>
        <h2 style={{ margin: "0 0 var(--s-3)", fontSize: "var(--fs-24)" }}>3 mức chất lượng AI</h2>
        <div className="grid --cols-3" style={{ gap: "var(--s-4)" }}>
          <QualityTier icon="zap" name="fast" desc="Model tốc độ cao (Gemini Flash, Groq). Tối ưu cho draft và xử lý số lượng lớn." />
          <QualityTier icon="bolt" name="balanced" desc="Mix giữa tốc độ và chiều sâu. Chuẩn cho blog production và content marketing." />
          <QualityTier icon="spark" name="best" desc="Claude 3.5 Sonnet / GPT-4o. Tối ưu cho RAG, coding và content cao cấp nhất." />
        </div>
      </Card>
    </div>
  );
}

function PackageCard({ pkg, billing }) {
  const price = billing === "yearly" ? pkg.price_cents_yearly : pkg.price_cents_monthly;
  const period = billing === "yearly" ? "/năm" : "/tháng";
  const isEnterprise = pkg.slug === "enterprise";
  const isContact = price === 0 && isEnterprise;
  const isPopular = pkg.is_popular;

  return (
    <Card style={{
      padding: "var(--s-6)",
      position: "relative",
      border: isPopular ? "2px solid var(--brand)" : "1px solid var(--hairline)",
      display: "grid",
      gridTemplateRows: "auto auto 1fr auto",
      gap: "var(--s-4)",
    }}>
      {isPopular && (
        <div style={{
          position: "absolute", top: -12, right: "var(--s-5)",
          background: "var(--brand)", color: "var(--on-brand)",
          padding: "4px 12px", borderRadius: "var(--r-pill)",
          fontSize: "var(--fs-12)", fontWeight: 600,
        }}>PHỔ BIẾN NHẤT</div>
      )}

      {/* 1. Header */}
      <div className="stack" style={{ gap: "var(--s-1)" }}>
        <div style={{ fontSize: "var(--fs-20)", fontWeight: 600 }}>{pkg.display_name}</div>
        <div className="muted" style={{ fontSize: "var(--fs-14)", minHeight: "2.6em" }}>{pkg.description}</div>
      </div>

      {/* 2. Pricing */}
      <div>
        {isContact ? (
          <div style={{ fontSize: "var(--fs-30)", fontWeight: 600 }}>Liên hệ</div>
        ) : (
          <div className="row" style={{ alignItems: "baseline", gap: "var(--s-1)" }}>
            <span style={{ fontSize: "var(--fs-48)", fontWeight: 600, letterSpacing: "-0.03em" }}>{formatUSD(price)}</span>
            <span className="muted" style={{ fontSize: "var(--fs-14)" }}>{period}</span>
          </div>
        )}
        <div className="muted" style={{ fontSize: "var(--fs-14)", marginTop: "var(--s-2)" }}>
          <strong style={{ color: "var(--text-1)" }}>{formatTokens(pkg.token_quota_monthly)}</strong> Pi tokens/tháng
        </div>
      </div>

      {/* 3. Features */}
      <ul className="stack" style={{ gap: "var(--s-2)", margin: 0, padding: 0, listStyle: "none", fontSize: "var(--fs-14)", flex: 1 }}>
        {pkg.features.map((f, i) => (
          <li key={i} className="row" style={{ gap: "var(--s-2)", alignItems: "flex-start" }}>
            <Icon name="check" size={16} style={{ color: "var(--brand)", flexShrink: 0, marginTop: 2 }} />
            <span>{f}</span>
          </li>
        ))}
        <li className="row muted" style={{ gap: "var(--s-2)", alignItems: "flex-start", fontSize: "var(--fs-12)", marginTop: "var(--s-1)" }}>
          Quality: {pkg.allowed_qualities.map((q) => (
            <code key={q} style={{ background: "var(--surface-2)", padding: "1px 6px", borderRadius: "4px", marginRight: 4 }}>{q}</code>
          ))}
        </li>
      </ul>

      {/* 4. Action */}
      <Button
        as={Link}
        to={isContact ? "/contact" : `/signup?plan=${pkg.slug}`}
        variant={isPopular ? "primary" : "ghost"}
        style={{ width: "100%" }}
      >
        {isContact ? "Liên hệ sales" : `Chọn ${pkg.display_name}`}
      </Button>
    </Card>
  );
}

function QualityTier({ icon, name, desc }) {
  return (
    <div className="stack" style={{ gap: "var(--s-2)" }}>
      <div className="row" style={{ gap: "var(--s-2)", alignItems: "center" }}>
        <div style={{
          width: 32, height: 32, borderRadius: "var(--r-2)",
          background: "var(--brand-soft)", color: "var(--brand)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}><Icon name={icon} size={16} /></div>
        <code style={{ fontWeight: 600 }}>{name}</code>
      </div>
      <div className="muted" style={{ fontSize: "var(--fs-14)" }}>{desc}</div>
    </div>
  );
}
