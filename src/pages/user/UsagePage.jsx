import { useEffect, useState } from "react";
import { api } from "../../lib/api-client";
import { useListFilters } from "../../hooks/useListFilters";
import { formatTokens } from "../../lib/format";
import { Alert, Badge, Button, Card, EmptyState, Icon, Skeleton, Table } from "../../components/ui";

const DEFAULTS = { days: 30, plugin: "" };
const DAYS_OPTIONS = [7, 30, 90];

export function UsagePage() {
  const { filters, setFilter, reset, hasActive } = useListFilters(DEFAULTS);
  const [pkg, setPkg] = useState(null);
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    setLoading(true);
    setErr("");
    Promise.all([api.cloud.myPackage().catch(() => null), api.cloud.myUsage(filters.days).catch(() => null)])
      .then(([p, u]) => {
        setPkg(p);
        if (u && filters.plugin) {
          u = { ...u, by_plugin: (u.by_plugin || []).filter((r) => r.plugin === filters.plugin) };
        }
        setUsage(u);
      })
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [filters.days, filters.plugin]);

  const daily = usage?.daily || [];
  const byPlugin = usage?.by_plugin || [];
  const totalTokens = daily.reduce((a, d) => a + d.tokens, 0);
  const totalCalls = daily.reduce((a, d) => a + d.calls, 0);

  return (
    <div className="stack gap-6">
      <header className="stack gap-2">
        <h1 className="m-0 text-32">Usage details</h1>
        <p className="m-0 muted">Breakdown by day and plugin for your Pi AI Cloud usage.</p>
      </header>

      {err && <Alert tone="danger" onDismiss={() => setErr("")}>{err}</Alert>}

      <Card className="p-4">
        <div className="row gap-3 flex-wrap items-center">
          <span className="text-14 muted">Time range:</span>
          {DAYS_OPTIONS.map((d) => (
            <Button key={d} size="sm" variant={filters.days === d ? "primary" : "ghost"} onClick={() => setFilter("days", d)}>
              {d} days
            </Button>
          ))}
          <span className="text-3">|</span>
          <span className="text-14 muted">Plugin:</span>
          <Button size="sm" variant={!filters.plugin ? "primary" : "ghost"} onClick={() => setFilter("plugin", "")}>All</Button>
          {byPlugin.map((p) => (
            <Button key={p.plugin} size="sm" variant={filters.plugin === p.plugin ? "primary" : "ghost"} onClick={() => setFilter("plugin", p.plugin)}>
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

      {pkg && (
        <div className="grid --cols-3 gap-4">
          <StatCard label={`Total (${filters.days} days)`} value={formatTokens(totalTokens)} sub={`${totalCalls.toLocaleString()} calls`} />
          <StatCard label="Current package" value={pkg.package_name} sub={`Quota: ${formatTokens(pkg.token_quota_monthly)}/month`} />
          <StatCard
            label="Remaining this month"
            value={formatTokens(pkg.current_period_remaining)}
            sub={`${((pkg.current_period_tokens_used / pkg.token_quota_monthly) * 100).toFixed(1)}% used`}
          />
        </div>
      )}

      <Card className="p-6">
        <div className="row justify-between items-center mb-4">
          <h3 className="m-0 text-18">Daily chart</h3>
          <div className="text-13 text-3">{filters.days} days</div>
        </div>
        {loading ? <Skeleton style={{ height: 180 }} /> : daily.length === 0 ? <EmptyState title="No calls yet" description="Call APIs to see chart data." /> : <DailyChart daily={daily} />}
      </Card>

      {daily.length > 0 && (
        <section className="stack gap-3">
          <h2 className="m-0 text-18">Daily rows</h2>
          <Card className="p-0 overflow-hidden">
            <Table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th className="text-right">Calls</th>
                  <th className="text-right">Pi tokens</th>
                  <th>Share</th>
                </tr>
              </thead>
              <tbody>
                {[...daily].reverse().map((d) => {
                  const pct = totalTokens > 0 ? (d.tokens / totalTokens) * 100 : 0;
                  return (
                    <tr key={d.date}>
                      <td className="font-mono text-13">{d.date?.slice(0, 10)}</td>
                      <td className="text-right">{d.calls.toLocaleString()}</td>
                      <td className="text-right text-brand">{formatTokens(d.tokens)}</td>
                      <td>
                        <Progress pct={pct} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card>
        </section>
      )}

      {byPlugin.length > 0 && (
        <section className="stack gap-3">
          <h2 className="m-0 text-18">By plugin</h2>
          <Card className="p-0 overflow-hidden">
            <Table>
              <thead>
                <tr>
                  <th>Plugin</th>
                  <th className="text-right">Calls</th>
                  <th className="text-right">Pi tokens</th>
                  <th>Share</th>
                </tr>
              </thead>
              <tbody>
                {byPlugin.map((row) => {
                  const pct = totalTokens > 0 ? (row.tokens / totalTokens) * 100 : 0;
                  return (
                    <tr key={row.plugin}>
                      <td className="font-mono text-13 font-medium">{row.plugin}</td>
                      <td className="text-right">{row.calls.toLocaleString()}</td>
                      <td className="text-right text-brand">{formatTokens(row.tokens)}</td>
                      <td>
                        <Progress pct={pct} rounded={0} />
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

function Progress({ pct, rounded = 1 }) {
  return (
    <div className="row gap-2 items-center">
      <div style={{ flex: 1, height: 6, background: "var(--surface-2)", borderRadius: 999, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: "var(--brand)" }} />
      </div>
      <span className="text-12 text-3" style={{ minWidth: 40 }}>{pct.toFixed(rounded)}%</span>
    </div>
  );
}

function StatCard({ label, value, sub }) {
  return (
    <Card className="p-4">
      <div className="text-13 muted">{label}</div>
      <div className="text-24 font-semibold mt-1">{value}</div>
      {sub ? <div className="text-12 text-3 mt-1">{sub}</div> : null}
    </Card>
  );
}

function DailyChart({ daily }) {
  const max = Math.max(...daily.map((d) => d.tokens), 1);
  return (
    <>
      <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 160, paddingBottom: 8, borderBottom: "1px solid var(--hairline)" }}>
        {daily.map((d) => (
          <div key={d.date} style={{ flex: 1 }} title={`${d.date}: ${formatTokens(d.tokens)} tokens • ${d.calls} calls`}>
            <div style={{ height: `${Math.max(2, (d.tokens / max) * 100)}%`, background: "var(--brand)", borderRadius: "2px 2px 0 0", opacity: 0.85 }} />
          </div>
        ))}
      </div>
      <div className="row justify-between mt-2 text-12 text-3">
        <span>{daily[0]?.date?.slice(5, 10) || ""}</span>
        <span>{daily[Math.floor(daily.length / 2)]?.date?.slice(5, 10) || ""}</span>
        <span>{daily[daily.length - 1]?.date?.slice(5, 10) || ""}</span>
      </div>
    </>
  );
}
