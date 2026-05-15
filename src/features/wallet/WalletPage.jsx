import { useEffect, useState } from "react";
import { api } from "@/_shared/api/api-client";
import { Card, Alert, Button, Badge } from "@/_shared/components/ui";
import { Loader2 } from "lucide-react";

import "./WalletPage.css";

/**
 * WalletPage  Infinity Edition
 * Premium token balance and top-up interface.
 */
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
      window.location.assign(checkout_url);
    } catch (e) {
      alert(e.message);
      setCheckoutLoading("");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4 opacity-40">
        <Loader2 size={40} className="animate-spin" />
        <div className="font-bold uppercase tracking-[0.2em] text-[12px]">ang ti v...</div>
      </div>
    );
  }

  return (
    <div className="wallet-container">
      <header className="wallet-header stagger-1">
        <h1 className="wallet-title">V Pi tokens</h1>
        <p className="wallet-subtitle">
          Token dng chung cho t?t c? Pi plugin Pro (SEO Bot, Chatbot AI, Leads scoring).
        </p>
      </header>

      {error && <Alert tone="danger" className="stagger-1">{error}</Alert>}

      <div className="balance-grid stagger-2">
        <div className="balance-card-primary">
          <div className="balance-label">S? du hi?n ti</div>
          <div className="balance-value">{wallet?.balance?.toLocaleString() || 0}</div>
          <div className="balance-unit">tokens</div>
        </div>
        
        <div className="balance-card-glass">
          <div className="balance-label">T?ng n?p</div>
          <div className="balance-value-sub">{wallet?.lifetime_topup?.toLocaleString() || 0}</div>
          <div className="balance-unit">lifetime tokens</div>
        </div>

        <div className="balance-card-glass">
          <div className="balance-label">T?ng d dng</div>
          <div className="balance-value-sub text-danger/80">{wallet?.lifetime_spend?.toLocaleString() || 0}</div>
          <div className="balance-unit">lifetime spent</div>
        </div>
      </div>

      <section className="packs-section stagger-3">
        <h2 className="packs-title">Mua thm tokens</h2>
        <div className="packs-grid">
          {packs.map((p) => {
            const isFeatured = p.id === "100k";
            return (
              <div key={p.id} className={`pack-card ${isFeatured ?"pack-card-featured" : ""}`}>
                {isFeatured && <div className="pack-badge">Ph? bi?n</div>}
                
                <div className="pack-tokens">
                  {p.tokens.toLocaleString()} <span className="pack-tokens-unit">tokens</span>
                </div>
                
                <div className="pack-price-container">
                  <div className="pack-price">${p.price_usd.toFixed(2)}</div>
                  <div className="pack-unit-price">
                    ${(p.price_usd / (p.tokens / 100000)).toFixed(2)}/100k
                  </div>
                </div>
                
                <Button
                  variant={isFeatured ? "primary" : "ghost"}
                  onClick={() => onBuy(p.id)}
                  isLoading={checkoutLoading === p.id}
                  className={`w-full mt-auto rounded-xl font-bold uppercase tracking-widest text-[11px] ${isFeatured ?"glow-brand" : "border border-base-border-subtle hover:border-primary-soft"}`}
                >
                  Mua ngay
                </Button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
