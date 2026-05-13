import { useEffect, useState } from "react";
import { api, withDelay } from "@/lib/api-client";
import { useListFilters } from "@/hooks/useListFilters";
import { useLocale } from "@/context/LocaleContext";
import { useAdminT, formatCurrency, formatTokens } from "@/lib/translations";
import { formatPct } from "@/lib/format";
import { Alert, Badge, Button, Card, EmptyState, Select, Table } from "@/components/ui";
import { Bolt, Zap, CreditCard, Shield, Sparkles, Loader2 } from "lucide-react";
import { AdminUsageSkeleton } from "@/components/skeletons/AdminUsageSkeleton";

import "./AdminUsagePage.css";

const DEFAULTS = { days: 30, plugin: "", quality: "", status: "" };
const DAYS_OPTIONS = [7, 30, 90];

/**
 * AdminUsagePage  Infinity Edition 5.0
 */
export function AdminUsagePage() {
  const { locale } = useLocale();
  const t = useAdminT();
  const { filters, setFilter, reset, hasActive } = useListFilters(DEFAULTS);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    setLoading(true); setErr("");
    withDelay(api.admin.usage(filters), 1000)
      .then((res) => {
        const daily = res.daily || [];
        const maxDaily = Math.max(1, ...daily.map((d) => (d.success || 0) + (d.fail || 0)));
        setData({ ...res, dailyStats: daily, maxDaily, errors: res.errors || [] });
      })
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [filters.days, filters.plugin, filters.quality, filters.status]); // eslint-disable-line

  const byPlugin = data?.by_plugin || [];
  const totalCalls = data?.total_calls || 0;
  const totalTokens = data?.tokens_spent || 0;
  const upstreamCostCents = data?.upstream_cost_cents || 0;
  const revenueCents = Math.round(totalTokens * 9 / 100_000 * 100);
  const marginPct = revenueCents > 0 ? 1 - (upstreamCostCents / revenueCents) : 0;

  if (loading && !data) return <AdminUsageSkeleton />;

  return (
    <div className="flex flex-col gap-10 p-8 min-h-screen max-w-full overflow-x-hidden animate-fade-up">

      {/* --- Header --- */}
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-black -tracking-tight leading-snug">{t.usage_title}</h1>
        <p className="text-sm font-medium text-base-content/60 opacity-80">{t.usage_subtitle}</p>
      </header>

      {err && <Alert tone="danger" onDismiss={() => setErr("")}>{err}</Alert>}

      {/* --- Filter bar --- */}
      <div className="flex items-center flex-wrap gap-6 px-5 py-3 rounded-2xl border border-base-border-default backdrop-blur-xl shadow-md"
           style={{ background: "color-mix(in srgb, var(--base-400) 30%, transparent)" }}>
        <span className="text-[11px] font-black text-base-content/60 uppercase tracking-[0.12em]">{t.time_range}</span>
        <div className="flex gap-1">
          {DAYS_OPTIONS.map((d) => (
            <Button key={d} size="sm"
              variant={filters.days === d ? "primary" : "ghost"}
              onClick={() => setFilter("days", d)}
              className="rounded-md text-[10px] font-bold px-3 py-1 h-8">
              {d} {t.days}
            </Button>
          ))}
        </div>
        <div className="w-px h-5 bg-base-border-subtle" />
        <Select value={filters.plugin}
          onChange={(e) => setFilter("plugin", e.target.value)}
          className="bg-transparent border-none text-[12px] font-bold h-8"
          options={[
            { label: `${t.all} ${t.filter_plugin}`, value: "" },
            { label: "pi-seo", value: "pi-seo" },
            { label: "pi-chatbot", value: "pi-chatbot" },
            { label: "pi-leads", value: "pi-leads" },
            { label: "pi-analytics", value: "pi-analytics" },
            { label: "pi-performance", value: "pi-performance" },
            { label: "pi-dashboard", value: "pi-dashboard" },
            { label: "direct (API)", value: "direct" },
          ]} />
        <Select value={filters.quality}
          onChange={(e) => setFilter("quality", e.target.value)}
          className="bg-transparent border-none text-[12px] font-bold h-8"
          options={[
            { label: `${t.all} quality`, value: "" },
            { label: "fast", value: "fast" },
            { label: "balanced", value: "balanced" },
            { label: "best", value: "best" },
          ]} />
        <Select value={filters.status}
          onChange={(e) => setFilter("status", e.target.value)}
          className="bg-transparent border-none text-[12px] font-bold h-8"
          options={[
            { label: `${t.all} ${t.filter_status}`, value: "" },
            { label: t.success, value: "success" },
            { label: t.failed, value: "failed" },
          ]} />
        {hasActive && (
          <Button variant="ghost" size="sm" onClick={reset} className="ml-auto rounded-md text-danger font-bold text-[10px] h-8">
            {t.clear}
          </Button>
        )}
      </div>

      {/* --- Stat cards --- */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6 w-full">
        <Stat label={t.total_calls}      value={totalCalls.toLocaleString()}            icon={Bolt} />
        <Stat label={t.pi_tokens_spent}  value={formatTokens(totalTokens)}              icon={Zap}         accent />
        <Stat label={t.revenue_est}      value={formatCurrency(revenueCents, locale)}   icon={CreditCard} success />
        <Stat label={t.upstream_cost}    value={formatCurrency(upstreamCostCents, locale)} icon={Shield}   warning />
        <Stat label={t.margin}           value={formatPct(marginPct)}                   icon={Sparkles}       success />
        <Stat label={t.avg_latency}      value={`${data?.avg_latency_ms || 0}ms`}       icon={Loader2} />
      </div>

      {/* --- Daily Bar Chart --- */}
      <section className="flex flex-col gap-6 mt-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-black uppercase tracking-[0.1em]">{t.daily_traffic}</h2>
          <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest opacity-60">
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-primary rounded-sm"/> {t.success}</span>
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-danger rounded-sm"/> {t.failed}</span>
          </div>
        </div>
        <div className="h-80 bg-base-200 border border-base-border-subtle rounded-3xl p-8 relative shadow-md">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 animate-pulse">{t.loading}</span>
            </div>
          )}
          {!loading && data?.dailyStats?.length > 0 && (() => {
            const hasAnyData = data.dailyStats.some((d) => (d.success || 0) + (d.fail || 0) > 0);
            if (!hasAnyData) {
              return (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-base-content/60">
                  <Bolt size={32} className="opacity-30" />
                  <div className="font-black uppercase tracking-[0.2em] text-[11px]">
                    {locale === "en" ? "No API calls recorded" : "Chua c AI call no"}
                  </div>
                </div>
              );
            }
            return (
              <div className="flex items-end h-full gap-1.5">
                {data.dailyStats.map((d) => {
                  const successHeight = ((d.success || 0) / data.maxDaily) * 100;
                  const failHeight = ((d.fail || 0) / data.maxDaily) * 100;
                  return (
                    <div key={d.date} className="flex-1 flex flex-col justify-end h-full gap-0.5"
                         title={`${d.date}: ${d.success || 0} OK, ${d.fail || 0} ERR`}>
                      <div className="bg-danger rounded-t-sm w-full" style={{ height: `${failHeight}%` }} />
                      <div className="bg-primary w-full bar-success-rounding" style={{ height: `${successHeight}%` }} />
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </section>

      {/* --- Breakdown tables --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Plugin breakdown */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-black uppercase tracking-[0.1em]">{t.breakdown_by_plugin}</h2>
          <div className="bg-base-200 border border-base-border-subtle rounded-3xl overflow-hidden shadow-md">
            <Table className="usage-table">
              <thead>
                <tr>
                  <th>Plugin</th>
                  <th className="text-right">Calls</th>
                  <th className="text-right">Revenue</th>
                  <th className="text-right">Margin</th>
                  <th>Share</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan="5" className="p-10 text-center opacity-30 animate-pulse">Syncing...</td></tr>
                )}
                {!loading && byPlugin.length === 0 && (
                  <tr><td colSpan="5" className="p-10 text-center"><EmptyState icon={Bolt} title="Chua c d liu" /></td></tr>
                )}
                {byPlugin.map((row) => {
                  const sharePct = totalTokens > 0 ? (row.tokens / totalTokens) * 100 : 0;
                  return (
                    <tr key={row.plugin}>
                      <td className="font-mono text-[12px] font-bold">{row.plugin}</td>
                      <td className="text-right font-mono">{row.calls.toLocaleString()}</td>
                      <td className="text-right font-mono font-bold text-success">${row.revenue_usd.toFixed(2)}</td>
                      <td className="text-right font-mono font-bold">{(row.margin_pct * 100).toFixed(1)}%</td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-[120px] bg-base-300 rounded-full overflow-hidden border border-base-border-subtle">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${sharePct}%` }} />
                          </div>
                          <span className="text-[10px] font-bold text-base-content/60">{sharePct.toFixed(0)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </section>

        {/* Error Breakdown */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-black uppercase tracking-[0.1em]">
            {locale === "en" ? "Top Errors" : "Li h thng"}
          </h2>
          <div className="bg-base-200 border border-base-border-subtle rounded-3xl overflow-hidden shadow-md h-full">
            <Table className="usage-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th className="text-right">Count</th>
                </tr>
              </thead>
              <tbody>
                {!loading && (!data?.errors || data.errors.length === 0) && (
                  <tr><td colSpan="2" className="p-10 text-center text-base-content/60 opacity-40 italic uppercase tracking-widest text-[10px]">
                    No errors detected
                  </td></tr>
                )}
                {!loading && data?.errors && data.errors.map((e) => (
                  <tr key={e.code}>
                    <td><Badge tone="danger" className="font-mono font-bold">{e.code}</Badge></td>
                    <td className="text-right font-mono font-bold text-danger">{e.count.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </section>

      </div>
    </div>
  );
}

function Stat({ label, value, icon: IconComponent, accent, success, warning }) {
  const valueColor = accent   ? "text-primary"   :
                     success  ? "text-success"  :
                     warning  ? "text-warning"  : "text-base-content";
  return (
    <div className="group bg-base-200 border border-base-border-subtle p-6 rounded-3xl flex flex-col gap-3 shadow-md
                    transition-all duration-300 hover:bg-base-400 hover:border-primary hover:-translate-y-1 hover:shadow-lg">
      <div className="flex justify-between items-center">
        <div className="text-[10px] font-black uppercase tracking-[0.15em] text-base-content/60">{label}</div>
        <div className="text-base-content/60 opacity-40 transition-opacity duration-300 group-hover:opacity-100 group-hover:text-primary">
          <IconComponent size={14} />
        </div>
      </div>
      <div className={`text-3xl font-black font-display -tracking-tight leading-none ${valueColor}`}>{value}</div>
    </div>
  );
}

export default AdminUsagePage;
