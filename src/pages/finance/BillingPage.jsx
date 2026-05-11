import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Alert, Badge, Button, Card, EmptyState, Skeleton } from "@/components/ui";
import { billing } from "@/api/billing";

const TIER_META = {
  free:       { label: "Free",       quota: 5_000,     color: "var(--pi-tier-free)" },
  pro:        { label: "Pro",        quota: 100_000,   color: "var(--pi-tier-pro)" },
  max:        { label: "Max",        quota: 500_000,   color: "var(--pi-tier-max)" },
  enterprise: { label: "Enterprise", quota: Infinity,  color: "var(--pi-tier-enterprise)" },
};

function formatDate(v) {
  if (!v) return "Chua c";
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "long" }).format(new Date(v));
}

function formatTokens(n) {
  if (!n && n !== 0) return "";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
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
    try { setStatus(await billing.status()); }
    catch (err) { setError(err.message || "Khng ti du?c tr?ng thi subscription."); }
    finally { setLoading(false); }
  };
     
  useEffect(() => { load(); }, []);

  const changeTier = async (tier) => {
    setBusy(tier);
    setError("");
    try { await billing.changeTier(tier); await load(); }
    catch (err) { setError(err.message || "Khng d?i du?c gi."); }
    finally { setBusy(""); }
  };

  const cancelSubscription = async () => {
    if (!confirm("H?y subscription ? cu?i chu k? hi?n ti?")) return;
    setBusy("cancel");
    setError("");
    try { await billing.cancel(); await load(); }
    catch (err) { setError(err.message || "Khng h?y du?c subscription."); }
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
            Thanh ton
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
          Qu?n l subscription, nng c?p v theo di token quota.
        </p>
      </header>

      {success && (
        <Alert tone="success" title="Subscription d kch ho?t!">
          Gi c?a anh dang ho?t d?ng. Email license v link dashboard s? du?c g?i sau khi Stripe webhook x? l.
        </Alert>
      )}
      {error && <Alert tone="danger" onDismiss={() => setError("")}>{error}</Alert>}

      {tier === "free" ? (
        <EmptyState
          icon="spark"
          title="Anh dang dng gi Free"
          description="Nng c?p d? m? kha AI Chatbot, Analytics, Lead Pipeline v quota tokens l?n hon."
          action={<Button as={Link} to="/pricing" variant="primary">Xem cc gi ?</Button>}
        />
      ) : (
        <>
          {/* --- Token Quota Card --- */}
          <Card style={{ padding: "var(--s-6)" }}>
            <div className="stack" style={{ gap: "var(--s-4)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "var(--s-2)" }}>
                <h3 style={{ margin: 0, fontSize: "var(--fs-16)", fontWeight: 700, color: "color-mix(in srgb, var(--base-content) 80%, transparent)" }}>
                  AI Token Quota  Thng ny
                </h3>
                <span style={{ fontSize: "var(--fs-13)", color: "color-mix(in srgb, var(--base-content) 60%, transparent)" }}>
                  Reset lc d?u thng
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
                    {quotaPct}% dng
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
                  {quotaPct >= 90 ? " G?n h?t quota! " : " dng hon 80% quota. "}
                  <Link to="/pricing" style={{ fontWeight: 700, color: "inherit" }}>Nng c?p gi</Link> ho?c <Link to="/app/wallet" style={{ fontWeight: 700, color: "inherit" }}>top-up token</Link>.
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
                    {status?.status === "past_due" ? "Qu h?n" : status?.cancel_at_period_end ? "ang ch? h?y" : "ang ho?t d?ng"}
                  </Badge>
                  <h2 style={{ margin: "var(--s-2) 0 0", fontSize: "var(--fs-24)", fontFamily: "var(--font-ui)", fontWeight: 800, letterSpacing: "-0.01em" }}>
                    Gi {meta.label}
                  </h2>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "var(--fs-12)", color: "color-mix(in srgb, var(--base-content) 60%, transparent)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Gia h?n</div>
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
                  <div style={{ fontSize: "var(--fs-14)", fontWeight: 600, color: "var(--base-content)" }}>   4242</div>
                  <div style={{ fontSize: "var(--fs-12)", color: "color-mix(in srgb, var(--base-content) 60%, transparent)" }}>H?t h?n 12/2026</div>
                </div>
                <Button variant="ghost" size="sm" style={{ marginLeft: "auto", fontSize: "var(--fs-13)" }}>C?p nh?t</Button>
              </div>

              {status?.cancel_at_period_end && (
                <Alert tone="warning" title="ang ch? h?y">
                  Subscription s? h?t h?n vo {formatDate(status.period_end)}.{" "}
                  <button onClick={() => changeTier(tier)} disabled={busy === tier} style={{ background: "none", border: "none", color: "inherit", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>
                    Khi ph?c gia h?n
                  </button>
                </Alert>
              )}
            </div>
          </Card>

          {/* --- Manage Subscription --- */}
          <Card style={{ padding: "var(--s-6)" }}>
            <h3 style={{ margin: "0 0 var(--s-5)", fontSize: "var(--fs-16)", fontWeight: 700, color: "color-mix(in srgb, var(--base-content) 80%, transparent)" }}>
              Qu?n l gi
            </h3>
            <div style={{ display: "flex", gap: "var(--s-3)", flexWrap: "wrap" }}>
              {tier === "pro" && (
                <Button variant="primary" size="sm" isLoading={busy === "max"} onClick={() => changeTier("max")}>
                  ? Nng c?p ln Max ($49/mo)
                </Button>
              )}
              {tier === "max" && (
                <Button variant="ghost" size="sm" isLoading={busy === "pro"} onClick={() => changeTier("pro")}>
                  ? H? xu?ng Pro ($19/mo)
                </Button>
              )}
              {status?.cancel_at_period_end ? (
                <Button variant="primary" size="sm" isLoading={busy === tier} onClick={() => changeTier(tier)}>
                  Khi ph?c gia h?n
                </Button>
              ) : (
                <Button variant="danger" size="sm" isLoading={busy === "cancel"} onClick={cancelSubscription}>
                  H?y subscription
                </Button>
              )}
              <Button as={Link} to="/pricing" variant="ghost" size="sm">
                Xem so snh cc gi
              </Button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

export default BillingPage;
