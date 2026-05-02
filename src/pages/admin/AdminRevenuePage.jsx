import { useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api-client";
import { useLocale } from "../../context/LocaleContext";
import { useAdminT, formatCurrencyUSD } from "../../lib/adminI18n";
import { Alert, Badge, Button, Card, Skeleton, Table } from "../../components/ui";

const DAYS_OPTIONS = [7, 30, 90, 365];
const COLORS = ["#7c3aed", "#2563eb", "#059669", "#d97706", "#db2777"];

export function AdminRevenuePage() {
  const { locale } = useLocale();
  const t = useAdminT();
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    setLoading(true);
    setErr("");
    api.admin.revenue({ days })
      .then(setData)
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [days]);

  const products = data?.by_product || [];
  const revenue = Number(data?.revenue_cents || 0) / 100;
  const cost = Number(data?.cost_cents || 0) / 100;
  const margin = Number(data?.margin_pct || 0);
  const arr = days > 0 ? revenue * (365 / days) : revenue * 12;
  const totalProductRevenue = products.reduce((sum, item) => sum + Number(item.revenue_cents || 0), 0);

  const pie = useMemo(() => {
    let start = 0;
    return products.map((item, index) => {
      const pct = totalProductRevenue ? (Number(item.revenue_cents || 0) / totalProductRevenue) * 100 : 0;
      const segment = { ...item, pct, start, end: start + pct, color: COLORS[index % COLORS.length] };
      start += pct;
      return segment;
    });
  }, [products, totalProductRevenue]);

  const conicGradient = pie.length
    ? `conic-gradient(${pie.map((s) => `${s.color} ${s.start.toFixed(1)}% ${s.end.toFixed(1)}%`).join(", ")})`
    : "conic-gradient(var(--surface-3) 0 100%)";

  return (
    <div className="stack" style={{ gap: "var(--s-8)" }}>
      <header className="row" style={{ justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "var(--s-4)" }}>
        <div className="stack" style={{ gap: "var(--s-2)" }}>
          <h1 style={{ margin: 0, fontSize: "var(--fs-32)" }}>{t.revenue_title}</h1>
          <p style={{ margin: 0, color: "var(--text-2)" }}>Dữ liệu doanh thu thật từ backend admin API.</p>
        </div>
        <div className="row gap-2">
          {DAYS_OPTIONS.map((d) => (
            <Button key={d} size="sm" variant={days === d ? "primary" : "ghost"} onClick={() => setDays(d)}>
              {d === 365 ? "1 năm" : `${d} ngày`}
            </Button>
          ))}
        </div>
      </header>

      {err && <Alert tone="danger" onDismiss={() => setErr("")}>{err}</Alert>}

      {loading ? (
        <div className="grid --cols-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} height={140} />)}
        </div>
      ) : (
        <>
          <div className="grid --cols-4">
            <Card className="stack gap-2 bg-brand text-on-brand p-5">
              <div style={{ fontSize: "var(--fs-14)", opacity: 0.9 }}>{t.mrr}</div>
              <div style={{ fontSize: "var(--fs-32)", fontWeight: "bold" }}>{formatCurrencyUSD(revenue, locale)}</div>
              <div style={{ fontSize: "var(--fs-12)", opacity: 0.75 }}>{days}-day revenue</div>
            </Card>
            <Card className="stack gap-2 p-5">
              <div style={{ fontSize: "var(--fs-14)", color: "var(--text-2)" }}>{t.arr}</div>
              <div style={{ fontSize: "var(--fs-24)", fontWeight: "bold", color: "var(--text-1)" }}>{formatCurrencyUSD(arr, locale)}</div>
              <div style={{ fontSize: "var(--fs-12)", color: "var(--text-3)" }}>Annualized run rate</div>
            </Card>
            <Card className="stack gap-2 p-5">
              <div style={{ fontSize: "var(--fs-14)", color: "var(--text-2)" }}>Upstream cost</div>
              <div style={{ fontSize: "var(--fs-24)", fontWeight: "bold", color: "var(--text-1)" }}>{formatCurrencyUSD(cost, locale)}</div>
              <div style={{ fontSize: "var(--fs-12)", color: "var(--text-3)" }}>AI/provider spend</div>
            </Card>
            <Card className="stack gap-2 p-5">
              <div style={{ fontSize: "var(--fs-14)", color: "var(--text-2)" }}>Margin</div>
              <div style={{ fontSize: "var(--fs-24)", fontWeight: "bold", color: margin >= 0 ? "var(--success)" : "var(--danger)" }}>{margin.toFixed(1)}%</div>
              <div style={{ fontSize: "var(--fs-12)", color: "var(--text-3)" }}>Revenue - cost</div>
            </Card>
          </div>

          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "var(--s-6)" }}>
            <Card className="stack gap-4 p-5">
              <h2 style={{ margin: 0, fontSize: "var(--fs-20)" }}>{t.revenue_by_package}</h2>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ width: 148, height: 148, borderRadius: "50%", background: conicGradient, boxShadow: "0 0 0 34px var(--surface-1) inset" }} />
              </div>
              <div className="stack gap-2">
                {pie.map((item) => (
                  <div key={item.sku} className="row justify-between text-13">
                    <span className="row gap-2">
                      <span style={{ width: 12, height: 12, borderRadius: 3, background: item.color, marginTop: 2 }} />
                      {item.name}
                    </span>
                    <strong>{formatCurrencyUSD(Number(item.revenue_cents || 0) / 100, locale)} <span className="muted">({item.pct.toFixed(0)}%)</span></strong>
                  </div>
                ))}
                {pie.length === 0 && <div className="muted">Chưa có doanh thu trong khoảng này.</div>}
              </div>
            </Card>

            <Card style={{ padding: 0, overflow: "hidden" }}>
              <Table>
                <thead><tr><th>SKU</th><th>Type</th><th style={{ textAlign: "right" }}>Count</th><th style={{ textAlign: "right" }}>Revenue</th></tr></thead>
                <tbody>
                  {products.map((item) => (
                    <tr key={item.sku}>
                      <td><strong>{item.name}</strong><div className="muted text-12">{item.sku}</div></td>
                      <td><Badge tone="neutral">{item.type}</Badge></td>
                      <td style={{ textAlign: "right" }}>{item.count}</td>
                      <td style={{ textAlign: "right", fontWeight: 700 }}>{formatCurrencyUSD(Number(item.revenue_cents || 0) / 100, locale)}</td>
                    </tr>
                  ))}
                  {products.length === 0 && <tr><td colSpan="4" className="text-center p-8 muted">Không có dữ liệu.</td></tr>}
                </tbody>
              </Table>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
