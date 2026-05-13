import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { useAdminT, formatCurrencyUSD } from "@/lib/translations";
import { api, withDelay } from "@/lib/api-client";
import { Card, Table, Badge, Alert } from "@/components/ui";
import { PieChart } from "lucide-react";
import { AdminRevenueSkeleton } from "@/components/skeletons/AdminRevenueSkeleton";
import { AdminStatCard } from "@/pages/core/components/AdminStatCard";
import "./AdminRevenuePage.css";

const DAYS_OPTIONS = [7, 30, 90, 365];
const COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
  "var(--color-chart-6)"
];

export function AdminRevenuePage() {
  const { locale } = useLocale();
  const t = useAdminT();
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    setErr("");
    withDelay(api.admin.revenue({ days }), 1000)
      .then(setData)
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [days]);

  useEffect(() => {
    load();
  }, [load]);

  const products = useMemo(() => data?.by_product || [], [data?.by_product]);
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
    : "conic-gradient(var(--base-300) 0 100%)";

  return (
    <div className="revenue-page fade-in">
      <header className="revenue-header stagger-1">
        <div className="flex flex-col gap-3">
          <h1 className="premium-title">{t.revenue_title}</h1>
          <p className="text-base-content/60 opacity-60 font-medium tracking-wide">
            D liu doanh thu th?t t? backend admin API.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-base-300/40 p-1.5 rounded-2xl border border-base-border-subtle">
          {DAYS_OPTIONS.map((d) => (
            <button key={d} 
              onClick={() => setDays(d)}
              className={`h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${days === d ? "bg-primary text-primary-content shadow-lg shadow-brand/20" : "text-base-content/60 hover:text-base-content hover:bg-base-content/[0.05]"}`}>
              {d === 365 ? "1 nam" : `${d} ngy`}
            </button>
          ))}
        </div>
      </header>

      {err && <Alert tone="danger" onDismiss={() => setErr("")} className="stagger-1 mx-4 lg:mx-0">{err}</Alert>}

      {loading && !data ? <AdminRevenueSkeleton /> : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-2">
            <div className="revenue-card-primary">
              <span className="revenue-card-label">{t.mrr}</span>
              <span className="revenue-card-value">{formatCurrencyUSD(revenue, locale)}</span>
              <span className="revenue-card-sub">{days}-day revenue</span>
            </div>
            <AdminStatCard title={t.arr} value={formatCurrencyUSD(arr, locale)} trend="Annualized run rate" />
            <AdminStatCard title="Upstream cost" value={formatCurrencyUSD(cost, locale)} trend="AI/provider spend" variant="outline" />
            <AdminStatCard title="Margin" value={`${margin.toFixed(1)}%`} trend="Revenue - cost" 
              className={margin >= 0 ? "text-success" : "text-danger"} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 stagger-3">
            <Card className="pie-card">
              <h2 className="section-title">Revenue by package</h2>
              <div className="flex flex-col md:flex-row items-center gap-10 py-6">
                <div className="relative w-48 h-48">
                  <div className="absolute inset-0 rounded-full shadow-inner" style={{ background: conicGradient }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[68%] h-[68%] bg-base-200 rounded-full shadow-2xl flex items-center justify-center border border-base-border-subtle">
                      <PieChart size={24} className="text-base-content/60 opacity-20" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3 flex-1">
                  {pie.map((item) => (
                    <div key={item.sku} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                        <span className="text-[13px] font-bold text-base-content/80">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-black text-base-content">{formatCurrencyUSD(Number(item.revenue_cents || 0) / 100, locale)}</span>
                        <span className="text-[10px] font-bold text-base-content/60 opacity-40">({item.pct.toFixed(0)}%)</span>
                      </div>
                    </div>
                  ))}
                  {pie.length === 0 && <div className="text-center py-10 text-base-content/60 opacity-30 text-[10px] font-black uppercase tracking-widest">No data.</div>}
                </div>
              </div>
            </Card>

            <Card className="revenue-table-card">
              <Table className="revenue-table">
                <thead>
                  <tr>
                    <th>SKU / Product</th>
                    <th className="text-center">Type</th>
                    <th className="text-right">Count</th>
                    <th className="text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-border-subtle">
                  {products.map((item) => (
                    <tr key={item.sku} className="group hover:bg-base-content/[0.02]">
                      <td>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-base-content">{item.name}</span>
                          <span className="font-mono text-[10px] text-base-content/60 opacity-50">{item.sku}</span>
                        </div>
                      </td>
                      <td className="text-center">
                        <Badge tone="neutral" className="uppercase text-[8px] font-black tracking-widest px-1.5 py-0.5">
                          {item.type}
                        </Badge>
                      </td>
                      <td className="text-right font-mono text-xs font-bold text-base-content/80">{item.count}</td>
                      <td className="text-right font-mono text-sm font-black text-primary">{formatCurrencyUSD(Number(item.revenue_cents || 0) / 100, locale)}</td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr><td colSpan="4" className="py-20 text-center opacity-30 uppercase font-black tracking-[0.2em] text-[10px]">Khng c d liu.</td></tr>
                  )}
                </tbody>
              </Table>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminRevenuePage;
