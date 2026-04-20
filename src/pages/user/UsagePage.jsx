import { useEffect, useState } from "react";
import { api } from "../../lib/api-client";
import { useListFilters } from "../../hooks/useListFilters";
import { formatTokens } from "../../lib/format";
import { Alert, Badge, Button, Card, EmptyState, Icon, Skeleton, Table } from "../../components/ui";

const DEFAULTS = { days: 30, plugin: "" };
const DAYS_OPTIONS = [7, 30, 90];

export function UsagePage() {
  const { filters, setFilter, setFilters, reset, hasActive } = useListFilters(DEFAULTS);
  const [pkg, setPkg] = useState(null);
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    setLoading(true); setErr("");
    Promise.all([
      api.cloud.myPackage().catch(() => null),
      api.cloud.myUsage(filters.days).catch(() => null),
    ]).then(([p, u]) => {
      setPkg(p);
      // Filter client-side by plugin if specified
      if (u && filters.plugin) {
        u = {
          ...u,
          by_plugin: u.by_plugin.filter((r) => r.plugin === filters.plugin),
        };
      }
      setUsage(u);
    }).catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [filters.days, filters.plugin]);

  const daily = usage?.daily || [];
  const byPlugin = usage?.by_plugin || [];
  const totalTokens = daily.reduce((a, d) => a + d.tokens, 0);
  const totalCalls = daily.reduce((a, d) => a + d.calls, 0);

  return (
    <div className="stack" style={{ gap: "var(--s-6)" }}>
      <header className="stack" style={{ gap: "var(--s-2)" }}>
        <h1 style={{ margin: 0, fontSize: "var(--fs-32)" }}>Usage chi tiết</h1>
        <p style={{ margin: 0, color: "var(--text-2)" }}>
          Phân tích việc sử dụng Pi AI Cloud của bạn theo ngày, plugin.
        </p>
      </header>

      {err && <Alert tone="danger" onDismiss={() => setErr("")}>{err}</Alert>}

      {/* Filter bar */}
      <Card style={{ padding: "var(--s-4)" }}>
        <div className="row" style={{ gap: "var(--s-3)", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "var(--fs-14)", color: "var(--text-2)" }}>Khoảng thời gian:</span>
          {DAYS_OPTIONS.map((d) => (
            <Button key={d} size="sm"
              variant={filters.days === d ? "primary" : "ghost"}
              onClick={() => setFilter("days", d)}>
              {d} ngày
            </Button>
          ))}
          <div style={{ width: "1px", height: "24px", background: "var(--hairline)", margin: "0 var(--s-2)" }} />
          <span style={{ fontSize: "var(--fs-14)", color: "var(--text-2)" }}>Plugin:</span>
          <Button size="sm" variant={!filters.plugin ? "primary" : "ghost"}
            onClick={() => setFilter("plugin", "")}>Tất cả</Button>
          {byPlugin.map((p) => (
            <Button key={p.plugin} size="sm"
              variant={filters.plugin === p.plugin ? "primary" : "ghost"}
              onClick={() => setFilter("plugin", p.plugin)}>
              {p.plugin}
            </Button>
          ))}
          {hasActive && (
            <Button variant="ghost" size="sm" onClick={reset}>
              <Icon name="x" size={14} /> Clear
            </Button>
          )}
        </div>
      </Card>

      {/* Summary stats */}
      {pkg && (
        <div className="grid --cols-auto" style={{ gap: "var(--s-4)" }}>
          <StatCard label={`Tổng (${filters.days} ngày)`} value={formatTokens(totalTokens)} sub={`${totalCalls.toLocaleString()} calls`} />
          <StatCard label="Gói hiện tại" value={pkg.package_name} sub={`Quota: ${formatTokens(pkg.token_quota_monthly)}/tháng`} />
          <StatCard label="Còn lại tháng này" value={formatTokens(pkg.current_period_remaining)} sub={`${((pkg.current_period_tokens_used / pkg.token_quota_monthly) * 100).toFixed(1)}% đã dùng`} />
        </div>
      )}

      {/* Daily chart */}
      <Card style={{ padding: "var(--s-6)" }}>
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: "var(--s-4)" }}>
          <h3 style={{ margin: 0, fontSize: "var(--fs-18)" }}>Biểu đồ ngày</h3>
          <div style={{ fontSize: "var(--fs-13)", color: "var(--text-3)" }}>
            {filters.days} ngày qua
          </div>
        </div>
        {loading ? <Skeleton style={{ height: 180 }} /> : daily.length === 0 ? (
          <EmptyState title="Chưa có call nào" description="Gọi /v1/ai/complete để thấy chart." />
        ) : <DailyChart daily={daily} />}
      </Card>

      {/* Daily table */}
      {daily.length > 0 && (
        <section className="stack" style={{ gap: "var(--s-3)" }}>
          <h2 style={{ margin: 0, fontSize: "var(--fs-18)" }}>Chi tiết theo ngày</h2>
          <Card style={{ padding: 0, overflow: "hidden" }}>
            <Table>
              <thead><tr>
                <th>Ngày</th>
                <th style={{ textAlign: "right" }}>Calls</th>
                <th style={{ textAlign: "right" }}>Pi tokens</th>
                <th>Share</th>
              </tr></thead>
              <tbody>
                {[...daily].reverse().map((d) => {
                  const pct = totalTokens > 0 ? (d.tokens / totalTokens) * 100 : 0;
                  return (
                    <tr key={d.date}>
                      <td style={{ fontFamily: "monospace", fontSize: "var(--fs-13)" }}>{d.date?.slice(0, 10)}</td>
                      <td style={{ textAlign: "right" }}>{d.calls.toLocaleString()}</td>
                      <td style={{ textAlign: "right", color: "var(--brand)" }}>{formatTokens(d.tokens)}</td>
                      <td>
                        <div className="row" style={{ gap: "var(--s-2)", alignItems: "center" }}>
                          <div style={{ flex: 1, height: "4px", background: "var(--surface-2)", borderRadius: "999px", overflow: "hidden" }}>
                            <div style={{ width: `${pct}%`, height: "100%", background: "var(--brand)" }} />
                          </div>
                          <span style={{ fontSize: "var(--fs-11)", color: "var(--text-3)", minWidth: "40px" }}>{pct.toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card>
        </section>
      )}

      {/* By plugin */}
      {byPlugin.length > 0 && (
        <section className="stack" style={{ gap: "var(--s-3)" }}>
          <h2 style={{ margin: 0, fontSize: "var(--fs-18)" }}>Phân bổ theo plugin</h2>
          <Card style={{ padding: 0, overflow: "hidden" }}>
            <Table>
              <thead><tr>
                <th>Plugin</th>
                <th style={{ textAlign: "right" }}>Calls</th>
                <th style={{ textAlign: "right" }}>Pi tokens</th>
                <th>Share</th>
              </tr></thead>
              <tbody>
                {byPlugin.map((row) => {
                  const pct = totalTokens > 0 ? (row.tokens / totalTokens) * 100 : 0;
                  return (
                    <tr key={row.plugin}>
                      <td style={{ fontFamily: "monospace", fontSize: "var(--fs-13)", fontWeight: 500 }}>{row.plugin}</td>
                      <td style={{ textAlign: "right" }}>{row.calls.toLocaleString()}</td>
                      <td style={{ textAlign: "right", color: "var(--brand)" }}>{formatTokens(row.tokens)}</td>
                      <td>
                        <div className="row" style={{ gap: "var(--s-2)", alignItems: "center" }}>
                          <div style={{ flex: 1, height: "6px", background: "var(--surface-2)", borderRadius: "999px", overflow: "hidden" }}>
                            <div style={{ width: `${pct}%`, height: "100%", background: "var(--brand)" }} />
                          </div>
                          <span style={{ fontSize: "var(--fs-11)", color: "var(--text-3)", minWidth: "40px" }}>{pct.toFixed(0)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card>
        </section>
      )}
    </div>
  );
}

function StatCard({ label, value, sub }) {
  return (
    <Card style={{ padding: "var(--s-4)" }}>
      <div style={{ fontSize: "var(--fs-13)", color: "var(--text-2)" }}>{label}</div>
      <div style={{ fontSize: "var(--fs-24)", fontWeight: 600, marginTop: "var(--s-1)" }}>{value}</div>
      {sub && <div style={{ fontSize: "var(--fs-12)", color: "var(--text-3)", marginTop: "var(--s-1)" }}>{sub}</div>}
    </Card>
  );
}

function DailyChart({ daily }) {
  const max = Math.max(...daily.map((d) => d.tokens), 1);
  return (
    <>
      <div style={{ display: "flex", gap: "3px", alignItems: "flex-end", height: "160px", paddingBottom: "var(--s-2)", borderBottom: "1px solid var(--hairline)" }}>
        {daily.map((d) => {
          const h = Math.max(2, (d.tokens / max) * 100);
          return (
            <div key={d.date} style={{ flex: 1, position: "relative" }}
              title={`${d.date}: ${formatTokens(d.tokens)} tokens • ${d.calls} calls`}>
              <div style={{
                height: `${h}%`,
                background: "var(--brand)",
                borderRadius: "2px 2px 0 0",
                opacity: 0.85,
              }} />
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "var(--s-2)", fontSize: "var(--fs-11)", color: "var(--text-3)" }}>
        <span>{daily[0]?.date?.slice(5, 10) || ""}</span>
        <span>{daily[Math.floor(daily.length / 2)]?.date?.slice(5, 10) || ""}</span>
        <span>{daily[daily.length - 1]?.date?.slice(5, 10) || ""}</span>
      </div>
    </>
  );
}
