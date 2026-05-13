import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Alert, Badge, Button, Card, EmptyState, Skeleton } from "@/components/ui";
import { Sparkles } from "lucide-react";
import { billing } from "@/api/billing";

const TIER_META = {
  free:       { label: "Free",       quota: 5000,     color: "var(--pi-tier-free)" },
  pro:        { label: "Pro",        quota: 100000,   color: "var(--pi-tier-pro)" },
  max:        { label: "Max",        quota: 500000,   color: "var(--pi-tier-max)" },
  enterprise: { label: "Enterprise", quota: Infinity,  color: "var(--pi-tier-enterprise)" },
};

function formatDate(v) {
  if (!v) return "Ch\u01B0a c\u00F3";
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "long" }).format(new Date(v));
}

function formatTokens(n) {
  if (!n && n !== 0) return "";
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return String(n);
}

export function BillingPage() {
  const [sp] = useSearchParams();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const success = sp.get("status") === "success";

  const load = async () => {
    setLoading(true);
    setError("");
    try { 
      const data = await billing.status();
      setStatus(data); 
    }
    catch (err) { 
      setError(err.message || "Kh\u00F4ng t\u1EA3i \u0111\u01B0\u1EE3c tr\u1EA1ng th\u00E1i subscription."); 
    }
    finally { setLoading(false); }
  };
     
  useEffect(() => { load(); }, []);

  const changeTier = async (tier) => {
    setBusy(tier);
    setError("");
    try { 
      await billing.changeTier(tier); 
      await load(); 
    }
    catch (err) { 
      setError(err.message || "Kh\u00F4ng \u0111\u1ED5i \u0111\u01B0\u1EE3c g\u00F3i."); 
    }
    finally { setBusy(""); }
  };

  const cancelSubscription = async () => {
    if (!confirm("H\u1EE7y subscription \u1EDF cu\u1ED1i chu k\u1EF3 hi\u1EC7n t\u1EA1i?")) return;
    setBusy("cancel");
    setError("");
    try { 
      await billing.cancel(); 
      await load(); 
    }
    catch (err) { 
      setError(err.message || "Kh\u00F4ng h\u1EE7y \u0111\u01B0\u1EE3c subscription."); 
    }
    finally { setBusy(""); }
  };

  if (loading) return (
    <div className="stack" style={{ gap: "var(--s-6)" }}>
      <Skeleton height={80} /> <Skeleton height={160} /> <Skeleton height={140} />
    </div>
  );

  const tier = status?.tier || "free";
  const meta = TIER_META[tier] || TIER_META.free;
  const used = status?.tokens_used_this_month ?? 0;
  const quotaPct = meta.quota === Infinity ? 0 : Math.min(100, Math.round((used / meta.quota) * 100));
  const quotaTone = quotaPct >= 90 ? "--danger" : quotaPct >= 70 ? "--warning" : "";

  return (
    <div className="stack" style={{ gap: "var(--s-8)" }}>
      {/* --- Header --- */}
      <header className="stack" style={{ gap: "var(--s-2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--s-3)", flexWrap: "wrap" }}>
          <h1 style={{ margin: 0, fontSize: "var(--fs-32)", fontFamily: "var(--font-ui)", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Thanh to\u00E1n
          </h1>
          <span style={{
            padding: "3px 12px",
            borderRadius: "var(--r-pill)",
            background: `color-mix(in srgb, ${meta.color} 15%, transparent)`,
            border: `1px solid ${meta.color}`,
            color: meta.color,
            fontSize: "var(--fs-13)",
            fontWeight: 700,
          }}>{meta.label}</span>
        </div>
        <p style={{ margin: 0, color: "color-mix(in srgb, var(--base-content) 80%, transparent)", fontSize: "var(--fs-16)" }}>
          Qu\u1EA3n l\u00FD subscription, n\u00E2ng c\u1EA5p v\u00E0 theo d\u00F5i token quota.
        </p>
      </header>

      {success && (
        <Alert tone="success" title="Subscription \u0111\u00E3 k\u00EDch ho\u1EA1t!">
          G\u00F3i c\u1EE7a anh \u0111ang ho\u1EA1t \u0111\u1ED9ng. Email license v\u00E0 link dashboard s\u1EBD \u0111\u01B0\u1EE3c g\u1EEDi sau khi Stripe webhook x\u1EED l\u00FD.
        </Alert>
      )}
      {error && <Alert tone="danger" onDismiss={() => setError("")}>{error}</Alert>}

      {tier === "free" ? (
        <EmptyState
          icon={Sparkles}
          title="Anh \u0111ang d\u00F9ng g\u00F3i Free"
          description="N\u00E2ng c\u1EA5p \u0111\u1EC3 m\u1EDF kh\u00F3a AI Chatbot, Analytics, Lead Pipeline v\u00E0 quota tokens l\u1EDBn h\u01A1n."
          action={<Button as={Link} to="/pricing" variant="primary">Xem c\u00E1c g\u00F3i \u1EDF \u0111\u00E2y</Button>}
        />
      ) : (
        <>
          {/* --- Token Quota Card --- */}
          <Card style={{ padding: "var(--s-6)" }}>
            <div className="stack" style={{ gap: "var(--s-4)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "var(--s-2)" }}>
                <h3 style={{ margin: 0, fontSize: "var(--fs-16)", fontWeight: 700, color: "color-mix(in srgb, var(--base-content) 80%, transparent)" }}>
                  AI Token Quota - Th\u00E1ng n\u00E0y
                </h3>
                <span style={{ fontSize: "var(--fs-13)", color: "color-mix(in srgb, var(--base-content) 60%, transparent)" }}>
                  Reset l\u00FAc \u0111\u1EA7u th\u00E1ng
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "baseline", gap: "var(--s-2)" }}>
                <span style={{ fontSize: "var(--fs-32)", fontWeight: 900, fontFamily: "var(--font-ui)", color: "var(--base-content)", letterSpacing: "-0.02em" }}>
                  {formatTokens(used)}
                </span>
                <span style={{ fontSize: "var(--fs-16)", color: "color-mix(in srgb, var(--base-content) 60%, transparent)" }}>
                  / {meta.quota === Infinity ? "Unlimited" : formatTokens(meta.quota)}
                </span>
                {meta.quota !== Infinity && (
                  <span style={{ fontSize: "var(--fs-14)", color: quotaPct >= 90 ? "var(--danger)" : "color-mix(in srgb, var(--base-content) 60%, transparent)", marginLeft: "auto", fontWeight: 600 }}>
                    {quotaPct}% \u0111\u00E3 d\u00F9ng
                  </span>
                )}
              </div>

              {meta.quota !== Infinity && (
                <div className="billing-quota-bar">
                  <div
                    className={`billing-quota-fill${quotaTone}`}
                    style={{ width: `${quotaPct}%` }}
                  />
                </div>
              )}

              {quotaPct >= 80 && (
                <Alert tone={quotaPct >= 90 ? "danger" : "warning"}>
                  {quotaPct >= 90 ? "G\u1EA7n h\u1EBFt quota!" : " \u0110\u00E3 d\u00F9ng h\u01A1n 80% quota. "}
                  <Link to="/pricing" style={{ fontWeight: 700, color: "inherit" }}>N\u00E2ng c\u1EA5p g\u00F3i</Link> ho\u1EB7c <Link to="/app/wallet" style={{ fontWeight: 700, color: "inherit" }}>top-up token</Link>.
                </Alert>
              )}
            </div>
          </Card>

          {/* --- Subscription Status --- */}
          <Card style={{ padding: "var(--s-6)" }}>
            <div className="stack" style={{ gap: "var(--s-5)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "var(--s-4)" }}>
                <div>
                  <Badge tone={status?.status === "past_due" ? "danger" : status?.cancel_at_period_end ? "warning" : "success"}>
                    {status?.status === "past_due" ? "Qu\u00E1 h\u1EA1n" : status?.cancel_at_period_end ? "\u0110ang ch\u1EDD h\u1EE7y" : "\u0110ang ho\u1EB7t \u0111\u1ED9ng"}
                  </Badge>
                  <h2 style={{ margin: "var(--s-2) 0 0", fontSize: "var(--fs-24)", fontFamily: "var(--font-ui)", fontWeight: 800, letterSpacing: "-0.01em" }}>
                    G\u00F3i {meta.label}
                  </h2>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "var(--fs-12)", color: "color-mix(in srgb, var(--base-content) 60%, transparent)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Gia h\u1EA1n</div>
                  <div style={{ fontSize: "var(--fs-18)", fontWeight: 700, color: "var(--base-content)", marginTop: 2 }}>{formatDate(status?.period_end)}</div>
                </div>
              </div>

              {/* Mock payment method */}
              <div style={{
                display: "flex", alignItems: "center", gap: "var(--s-3)",
                padding: "var(--s-4)", borderRadius: "var(--r-3)",
                background: "var(--base-400)", border: "1px solid var(--base-border)",
              }}>
                <div style={{
                  width: 40, height: 26, borderRadius: 4, background: "linear-gradient(135deg, var(--color-chart-1), var(--color-chart-2))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, color: "white", fontWeight: 800, letterSpacing: "0.5px", flexShrink: 0,
                }}>VISA</div>
                <div>
                  <div style={{ fontSize: "var(--fs-14)", fontWeight: 600, color: "var(--base-content)" }}>**** 4242</div>
                  <div style={{ fontSize: "var(--fs-12)", color: "color-mix(in srgb, var(--base-content) 60%, transparent)" }}>H\u1EBFt h\u1EA1n 12/2026</div>
                </div>
                <Button variant="ghost" size="sm" style={{ marginLeft: "auto", fontSize: "var(--fs-13)" }}>C\u1EADp nh\u1EADt</Button>
              </div>

              {status?.cancel_at_period_end && (
                <Alert tone="warning" title="\u0110ang ch\u1EDD h\u1EE7y">
                  Subscription s\u1EBD h\u1EBFt h\u1EA1n v\u00E0o {formatDate(status.period_end)}.{" "}
                  <button onClick={() => changeTier(tier)} disabled={busy === tier} style={{ background: "none", border: "none", color: "inherit", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>
                    Kh\u00F4i ph\u1EE5c gia h\u1EA1n
                  </button>
                </Alert>
              )}
            </div>
          </Card>

          {/* --- Manage Subscription --- */}
          <Card style={{ padding: "var(--s-6)" }}>
            <h3 style={{ margin: "0 0 var(--s-5)", fontSize: "var(--fs-16)", fontWeight: 700, color: "color-mix(in srgb, var(--base-content) 80%, transparent)" }}>
              Qu\u1EA3n l\u00FD g\u00F3i
            </h3>
            <div style={{ display: "flex", gap: "var(--s-3)", flexWrap: "wrap" }}>
              {tier === "pro" && (
                <Button variant="primary" size="sm" isLoading={busy === "max"} onClick={() => changeTier("max")}>
                  \u2191 N\u00E2ng c\u1EA5p l\u00EAn Max ($199/mo)
                </Button>
              )}
              {tier === "max" && (
                <Button variant="ghost" size="sm" isLoading={busy === "pro"} onClick={() => changeTier("pro")}>
                  \u2193 H\u1EA1 xu\u1ED1ng Pro ($50/mo)
                </Button>
              )}
              {status?.cancel_at_period_end ? (
                <Button variant="primary" size="sm" isLoading={busy === tier} onClick={() => changeTier(tier)}>
                  Kh\u00F4i ph\u1EE5c gia h\u1EA1n
                </Button>
              ) : (
                <Button variant="danger" size="sm" isLoading={busy === "cancel"} onClick={cancelSubscription}>
                  H\u1EE7y subscription
                </Button>
              )}
              <Button as={Link} to="/pricing" variant="ghost" size="sm">
                Xem so s\u00E1nh c\u00E1c g\u00F3i
              </Button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

export default BillingPage;
