import { useEffect, useState } from "react";
import { api } from "../../lib/api-client";
import { useListFilters } from "../../hooks/useListFilters";
import { useLocale } from "../../context/LocaleContext";
import { useAdminT, formatCurrency, formatTokens } from "../../lib/adminI18n";
import { formatPct } from "../../lib/format";
import { Alert, Badge, Button, Card, EmptyState, Icon, Select, Table } from "../../components/ui";

const DEFAULTS = { days: 30, plugin: "", quality: "", status: "" };
const DAYS_OPTIONS = [7, 30, 90];

export function AdminUsagePage() {
  const { locale } = useLocale();
  const t = useAdminT();
  const { filters, setFilter, reset, hasActive } = useListFilters(DEFAULTS);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    setLoading(true); setErr("");
    api.admin.usage(filters)
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

  return (
    <div className="stack" style={{ gap: "var(--s-6)" }}>
      <header className="row" style={{ justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "var(--s-4)" }}>
        <div className="stack" style={{ gap: "var(--s-2)" }}>
          <h1 style={{ margin: 0, fontSize: "var(--fs-32)" }}>{t.usage_title}</h1>
          <p style={{ margin: 0, color: "var(--text-2)" }}>{t.usage_subtitle}</p>
        </div>
      </header>

      {err && <Alert tone="danger" onDismiss={() => setErr("")}>{err}</Alert>}

      {/* ─── Filter bar ─── */}
      <Card style={{ padding: "var(--s-4)" }}>
        <div className="row" style={{ gap: "var(--s-3)", alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: "var(--fs-14)", color: "var(--text-2)" }}>{t.time_range}:</span>
          {DAYS_OPTIONS.map((d) => (
            <Button key={d} size="sm"
              variant={filters.days === d ? "primary" : "ghost"}
              onClick={() => setFilter("days", d)}>
              {d} {t.days}
            </Button>
          ))}
          <div style={{ width: "1px", height: "24px", background: "var(--hairline)", margin: "0 var(--s-2)" }} />
          <Select value={filters.plugin}
            onChange={(e) => setFilter("plugin", e.target.value)}
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
            options={[
              { label: `${t.all} quality`, value: "" },
              { label: "fast", value: "fast" },
              { label: "balanced", value: "balanced" },
              { label: "best", value: "best" },
            ]} />
          <Select value={filters.status}
            onChange={(e) => setFilter("status", e.target.value)}
            options={[
              { label: `${t.all} ${t.filter_status}`, value: "" },
              { label: t.success, value: "success" },
              { label: t.failed, value: "failed" },
            ]} />
          {hasActive && (
            <Button variant="ghost" size="sm" onClick={reset}>
              <Icon name="x" size={14} /> {t.clear}
            </Button>
          )}
        </div>
      </Card>

      {/* ─── Stat cards ─── */}
      <div className="grid --cols-auto" style={{ gap: "var(--s-4)" }}>
        <Stat label={t.total_calls} value={totalCalls.toLocaleString()} icon="bolt" />
        <Stat label={t.pi_tokens_spent} value={formatTokens(totalTokens)} icon="zap" accent />
        <Stat label={t.revenue_est} value={formatCurrency(revenueCents, locale)} icon="credit-card" />
        <Stat label={t.upstream_cost} value={formatCurrency(upstreamCostCents, locale)} icon="shield" warning />
        <Stat label={t.margin} value={formatPct(marginPct)} icon="spark" success />
        <Stat label={t.avg_latency} value={`${data?.avg_latency_ms || 0}ms`} icon="loader" />
      </div>

      {/* ─── Daily Bar Chart ─── */}
      <section className="stack" style={{ gap: "var(--s-3)" }}>
        <div className="row justify-between">
          <h2 style={{ margin: 0, fontSize: "var(--fs-20)" }}>{t.daily_traffic} ({filters.days} {t.days})</h2>
          <div className="row gap-3 text-12">
            <span className="row gap-1"><div style={{width: 10, height: 10, background: 'var(--brand)', borderRadius: 2}}/> {t.success}</span>
            <span className="row gap-1"><div style={{width: 10, height: 10, background: 'var(--danger)', borderRadius: 2}}/> {t.failed}</span>
          </div>
        </div>
        <Card style={{ height: "240px", padding: "var(--s-4) var(--s-3)", position: "relative" }}>
          {loading && <div className="muted text-center" style={{ paddingTop: "100px" }}>{t.loading}</div>}
          {!loading && data?.dailyStats?.length > 0 && (() => {
            const hasAnyData = data.dailyStats.some((d) => (d.success || 0) + (d.fail || 0) > 0);
            if (!hasAnyData) {
              return (
                <div className="stack" style={{ height: "100%", justifyContent: "center", alignItems: "center", gap: "var(--s-2)", color: "var(--text-3)" }}>
                  <Icon name="bolt" size={32} />
                  <div>{locale === "en" ? "No API calls in this period yet" : "Chưa có AI call nào trong kỳ này"}</div>
                  <div style={{ fontSize: "var(--fs-12)" }}>
                    {locale === "en" ? "Data appears when customers call /v1/ai/complete" : "Dữ liệu hiện khi khách gọi /v1/ai/complete"}
                  </div>
                </div>
              );
            }
            return (
              <div style={{ display: "flex", alignItems: "flex-end", height: "100%", gap: "2px" }}>
                {data.dailyStats.map((d) => {
                  const successHeight = ((d.success || 0) / data.maxDaily) * 100;
                  const failHeight = ((d.fail || 0) / data.maxDaily) * 100;
                  return (
                    <div key={d.date} style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%", gap: "1px" }}
                         title={`${d.date}: ${d.success || 0} OK, ${d.fail || 0} ERR`}>
                      <div style={{ height: `${failHeight}%`, background: "var(--danger)", borderRadius: "2px 2px 0 0", minHeight: (d.fail || 0) > 0 ? "2px" : "0" }} />
                      <div style={{ height: `${successHeight}%`, background: "var(--brand)", borderRadius: (d.fail || 0) === 0 ? "2px 2px 0 0" : "0" }} />
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </Card>
      </section>

      <div className="grid --cols-2" style={{ gap: "var(--s-6)" }}>
        {/* ─── Breakdown by plugin ─── */}
        <section className="stack" style={{ gap: "var(--s-3)" }}>
          <h2 style={{ margin: 0, fontSize: "var(--fs-20)" }}>{t.breakdown_by_plugin}</h2>
          <Card style={{ padding: 0, overflow: "hidden" }}>
            <Table>
              <thead>
                <tr>
                  <th>Plugin</th>
                  <th style={{ textAlign: "right" }}>Calls</th>
                  <th style={{ textAlign: "right" }}>Revenue</th>
                  <th style={{ textAlign: "right" }}>Margin</th>
                  <th>Share</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan="5" style={{ textAlign: "center", padding: "var(--s-6)", color: "var(--text-3)" }}>Đang tải…</td></tr>
                )}
                {!loading && byPlugin.length === 0 && (
                  <tr><td colSpan="5"><EmptyState icon="bolt" title="Chưa có dữ liệu" /></td></tr>
                )}
                {byPlugin.map((row) => {
                  const sharePct = totalTokens > 0 ? (row.tokens / totalTokens) * 100 : 0;
                  return (
                    <tr key={row.plugin}>
                      <td style={{ fontFamily: "monospace", fontSize: "var(--fs-13)", fontWeight: 500 }}>{row.plugin}</td>
                      <td style={{ textAlign: "right" }}>{row.calls.toLocaleString()}</td>
                      <td style={{ textAlign: "right", color: "var(--success)" }}>${row.revenue_usd.toFixed(2)}</td>
                      <td style={{ textAlign: "right", fontWeight: 500 }}>{(row.margin_pct * 100).toFixed(1)}%</td>
                      <td>
                        <div className="row" style={{ gap: "var(--s-2)", alignItems: "center" }}>
                          <div style={{ flex: 1, height: "6px", background: "var(--surface-2)", borderRadius: "999px", overflow: "hidden" }}>
                            <div style={{ width: `${sharePct}%`, height: "100%", background: "var(--brand)" }} />
                          </div>
                          <span style={{ fontSize: "var(--fs-11)", color: "var(--text-3)", minWidth: "30px" }}>{sharePct.toFixed(0)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card>
        </section>

        {/* ─── Error Breakdown (real data) ─── */}
        <section className="stack" style={{ gap: "var(--s-3)" }}>
          <h2 style={{ margin: 0, fontSize: "var(--fs-20)" }}>
            {locale === "en" ? "Top errors" : "Lỗi phổ biến"} ({data?.errors?.length || 0})
          </h2>
          <Card style={{ padding: 0, overflow: "hidden", height: "100%" }}>
            <Table>
              <thead>
                <tr>
                  <th>{locale === "en" ? "Code" : "Mã lỗi"}</th>
                  <th style={{ textAlign: "right" }}>{locale === "en" ? "Count" : "SL"}</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan="2" style={{ textAlign: "center", padding: "var(--s-6)", color: "var(--text-3)" }}>{t.loading}</td></tr>
                )}
                {!loading && (!data?.errors || data.errors.length === 0) && (
                  <tr><td colSpan="2" style={{ textAlign: "center", padding: "var(--s-6)", color: "var(--text-3)" }}>
                    {locale === "en" ? "No errors in period" : "Không có lỗi trong chu kỳ"}
                  </td></tr>
                )}
                {!loading && data?.errors && data.errors.map((e) => (
                  <tr key={e.code}>
                    <td><Badge tone="danger">{e.code}</Badge></td>
                    <td style={{ textAlign: "right", fontWeight: "bold" }}>{e.count}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value, icon, accent, success, warning }) {
  const color = accent ? "var(--brand)" :
                success ? "var(--success)" :
                warning ? "var(--warning)" : "var(--text-1)";
  return (
    <Card style={{ padding: "var(--s-4)" }}>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: "var(--fs-13)", color: "var(--text-2)" }}>{label}</div>
          <div style={{ fontSize: "var(--fs-24)", fontWeight: 600, color, marginTop: "var(--s-1)" }}>{value}</div>
        </div>
        <div style={{ color: "var(--text-3)" }}><Icon name={icon} size={18} /></div>
      </div>
    </Card>
  );
}
