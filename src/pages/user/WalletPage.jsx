import { useEffect, useState } from "react";
import { api } from "../../lib/api-client";
import { Card, Alert, Button, Badge } from "../../components/ui";

export function WalletPage() {
  const [wallet, setWallet] = useState(null);
  const [packs, setPacks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState("");

  useEffect(() => {
    Promise.all([api.ai.wallet().catch((e) => ({ error: e })), api.ai.packs()])
      .then(([w, p]) => {
        if (w.error) setError(w.error.message);
        else setWallet(w);
        setPacks(p?.packs || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const onBuy = async (packId) => {
    setCheckoutLoading(packId);
    try {
      const origin = window.location.origin;
      const { checkout_url } = await api.ai.checkout(
        packId,
        `${origin}/app/wallet?topup=success`,
        `${origin}/app/wallet?topup=cancel`
      );
      window.location.href = checkout_url;
    } catch (e) {
      alert(e.message);
      setCheckoutLoading("");
    }
  };

  if (loading) return <div style={{ padding: "var(--s-8)", color: "var(--text-3)", textAlign: "center" }}>Đang tải…</div>;

  return (
    <div className="stack" style={{ gap: "var(--s-8)" }}>
      <header className="stack" style={{ gap: "var(--s-2)" }}>
        <h1 style={{ margin: 0, fontSize: "var(--fs-32)" }}>Ví Pi tokens</h1>
        <p style={{ margin: 0, color: "var(--text-2)", fontSize: "var(--fs-18)", maxWidth: "800px" }}>
          Token dùng chung cho tất cả Pi plugin Pro (SEO Bot, Chatbot AI, Leads scoring…).
        </p>
      </header>

      {error && <Alert tone="danger">{error}</Alert>}

      <div className="grid --cols-3">
        <Card className="stack" style={{ gap: "var(--s-2)", background: "var(--brand)", color: "white" }}>
          <div style={{ fontSize: "var(--fs-14)", opacity: 0.9 }}>Số dư hiện tại</div>
          <div style={{ fontSize: "var(--fs-32)", fontWeight: "bold" }}>{wallet?.balance?.toLocaleString() || 0}</div>
          <div style={{ fontSize: "var(--fs-12)", opacity: 0.7, marginTop: "auto" }}>tokens</div>
        </Card>
        <Card className="stack" style={{ gap: "var(--s-2)" }}>
          <div style={{ fontSize: "var(--fs-14)", color: "var(--text-2)" }}>Tổng nạp</div>
          <div style={{ fontSize: "var(--fs-24)", fontWeight: "bold", color: "var(--text-1)" }}>{wallet?.lifetime_topup?.toLocaleString() || 0}</div>
        </Card>
        <Card className="stack" style={{ gap: "var(--s-2)" }}>
          <div style={{ fontSize: "var(--fs-14)", color: "var(--text-2)" }}>Tổng đã dùng</div>
          <div style={{ fontSize: "var(--fs-24)", fontWeight: "bold", color: "var(--text-1)" }}>{wallet?.lifetime_spend?.toLocaleString() || 0}</div>
        </Card>
      </div>

      <section className="stack" style={{ gap: "var(--s-4)", marginTop: "var(--s-4)" }}>
        <h2 style={{ margin: 0, fontSize: "var(--fs-24)" }}>Mua thêm tokens</h2>
        <div className="grid --cols-4">
          {packs.map((p) => (
            <Card key={p.id} className="stack hover-lift" style={{ position: "relative", gap: "var(--s-4)", padding: "var(--s-6)", textAlign: "center", border: p.id === "100k" ? "2px solid var(--brand)" : undefined }}>
              {p.id === "100k" && (
                <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)" }}>
                  <Badge tone="brand">Phổ biến</Badge>
                </div>
              )}
              
              <div style={{ fontSize: "var(--fs-20)", fontWeight: "600", color: "var(--text-1)", marginTop: p.id === "100k" ? "var(--s-2)" : 0 }}>
                {p.tokens.toLocaleString()} <span style={{ fontSize: "var(--fs-14)", color: "var(--text-2)", fontWeight: "normal" }}>tokens</span>
              </div>
              
              <div className="stack" style={{ gap: "var(--s-1)", background: "var(--surface-2)", padding: "var(--s-3)", borderRadius: "var(--r-2)" }}>
                <div style={{ fontSize: "var(--fs-24)", fontWeight: "bold" }}>${p.price_usd.toFixed(2)}</div>
                <div style={{ fontSize: "var(--fs-12)", color: "var(--text-3)" }}>
                  ${(p.price_usd / (p.tokens / 100000)).toFixed(2)}/100k
                </div>
              </div>
              
              <Button
                variant={p.id === "100k" ? "primary" : "secondary"}
                onClick={() => onBuy(p.id)}
                isLoading={checkoutLoading === p.id}
                style={{ width: "100%", marginTop: "auto" }}
              >
                Mua ngay
              </Button>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
