import { useEffect, useState } from "react";

import { api } from "@/_shared/api/api-client";

import { useListFilters } from "@/_shared/hooks/useListFilters";

import { formatTokens } from "@/_shared/lib/format";

import { Alert, Badge, Button, Card, EmptyState, Skeleton, Table } from "@/_shared/components/ui";
import { X, Zap } from "lucide-react";



import "./UsagePage.css";



const DEFAULTS = { days: 30, plugin: "" };

const DAYS_OPTIONS = [7, 30, 90];



/**

 * UserUsagePage  Infinity Edition

 * Premium personal usage analytics for Pi AI Cloud.

 */

export function UserUsagePage() {

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

    <div className="user-usage-container">

      <header className="user-usage-header stagger-1">

        <h1 className="user-usage-title">Usage details</h1>

        <p className="user-usage-subtitle">Breakdown by day and plugin for your Pi AI Cloud usage.</p>

      </header>



      {err && <Alert tone="danger" onDismiss={() => setErr("")} className="stagger-1">{err}</Alert>}



      <Card className="p-4 stagger-1 bg-base-200/30 backdrop-blur-xl border-base-border-subtle">

        <div className="row gap-3 flex-wrap items-center">

          <span className="text-[13px] font-bold tracking-wide opacity-40 mr-2">Time range:</span>

          {DAYS_OPTIONS.map((d) => (

            <Button key={d} size="sm" 

              variant={filters.days === d ? "primary" : "ghost"} 

              onClick={() => setFilter("days", d)}

              className="rounded-lg text-xs font-bold">

              {d} days

            </Button>

          ))}

          <div className="w-[1px] h-4 bg-base-border-subtle mx-2" />

          <span className="text-[13px] font-bold tracking-wide opacity-40 mr-2">Plugin:</span>

          <Button size="sm" variant={!filters.plugin ? "primary" : "ghost"} onClick={() => setFilter("plugin", "")} className="rounded-lg text-xs font-bold">All</Button>

          {byPlugin.map((p) => (

            <Button key={p.plugin} size="sm" variant={filters.plugin === p.plugin ? "primary" : "ghost"} onClick={() => setFilter("plugin", p.plugin)} className="rounded-lg text-xs font-bold">

              {p.plugin}

            </Button>

          ))}

          {hasActive && (

            <Button variant="ghost" size="sm" onClick={reset} className="rounded-lg text-danger/70 hover:text-danger ml-auto">

              <X size={14} className="mr-1" /> Clear

            </Button>

          )}

        </div>

      </Card>



      {pkg && (

        <div className="user-stats-grid stagger-2">

          <StatCard label={`Total (${filters.days} days)`} value={formatTokens(totalTokens)} sub={`${totalCalls.toLocaleString()} calls`} />

          <StatCard label="Current package" value={pkg.package_name} sub={`Quota: ${formatTokens(pkg.token_quota_monthly)}/month`} />

          <StatCard

            label="Remaining this month"

            value={formatTokens(pkg.current_period_remaining)}

            sub={`${((pkg.current_period_tokens_used / pkg.token_quota_monthly) * 100).toFixed(1)}% used`}

          />

        </div>

      )}



      <Card className="user-chart-card stagger-3">

        <div className="row justify-between items-center mb-6">

          <h3 className="m-0 text-[14px] font-semibold tracking-wide opacity-60">Daily chart</h3>

          <Badge tone="brand" className="font-bold tracking-widest px-3 opacity-80">{filters.days} days</Badge>

        </div>

        {loading ? (

          <Skeleton style={{ height: 160 }} className="opacity-20" />

        ) : daily.length === 0 ? (

          <EmptyState title="No calls yet" description="Call APIs to see chart data." icon={Zap} />

        ) : (

          <DailyChart daily={daily} />

        )}

      </Card>



      {daily.length > 0 && (

        <section className="stack gap-4 stagger-4">

          <h2 className="m-0 text-[18px] font-semibold tracking-wide opacity-80 px-1">Daily rows</h2>

          <div className="user-table-card p-0">

            <Table className="user-usage-table">

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

                      <td className="font-mono text-[13px] font-bold text-base-content opacity-80">{d.date?.slice(0, 10)}</td>

                      <td className="text-right text-[13px] font-mono">{d.calls.toLocaleString()}</td>

                      <td className="text-right text-[13px] font-mono font-bold text-primary">{formatTokens(d.tokens)}</td>

                      <td>

                        <Progress pct={pct} />

                      </td>

                    </tr>

                  );

                })}

              </tbody>

            </Table>

          </div>

        </section>

      )}



      {byPlugin.length > 1 && (

        <section className="stack gap-4 stagger-4">

          <h2 className="m-0 text-[18px] font-semibold tracking-wide opacity-80 px-1">By plugin</h2>

          <div className="user-table-card p-0">

            <Table className="user-usage-table">

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

                      <td className="font-mono text-[13px] font-bold text-base-content">{row.plugin}</td>

                      <td className="text-right text-[13px] font-mono">{row.calls.toLocaleString()}</td>

                      <td className="text-right text-[13px] font-mono font-bold text-primary">{formatTokens(row.tokens)}</td>

                      <td>

                        <Progress pct={pct} rounded={0} />

                      </td>

                    </tr>

                  );

                })}

              </tbody>

            </Table>

          </div>

        </section>

      )}

    </div>

  );

}



function Progress({ pct, rounded = 1 }) {

  return (

    <div className="flex items-center gap-3">

      <div className="flex-1 h-[6px] bg-base-300/50 rounded-full overflow-hidden">

        <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />

      </div>

      <span className="text-xs font-semibold text-base-content/60 min-w-[40px]">{pct.toFixed(rounded)}%</span>

    </div>

  );

}



function StatCard({ label, value, sub }) {

  return (

    <div className="user-stat-card">

      <div className="user-stat-label">{label}</div>

      <div className="user-stat-value">{value}</div>

      {sub ? <div className="user-stat-sub">{sub}</div> : null}

    </div>

  );

}



function DailyChart({ daily }) {

  const max = Math.max(...daily.map((d) => d.tokens), 1);

  return (

    <div className="flex flex-col gap-3">

      <div className="user-bar-container">

        {daily.map((d) => (

          <div 

            key={d.date} 

            className="user-bar" 

            style={{ height: `${Math.max(4, (d.tokens / max) * 100)}%` }}

            title={`${d.date}: ${formatTokens(d.tokens)} tokens  ${d.calls} calls`} 

          />

        ))}

      </div>

      <div className="flex justify-between px-1 text-xs font-bold tracking-wide opacity-40">

        <span>{daily[0]?.date?.slice(5, 10) || ""}</span>

        <span>{daily[Math.floor(daily.length / 2)]?.date?.slice(5, 10) || ""}</span>

        <span>{daily[daily.length - 1]?.date?.slice(5, 10) || ""}</span>

      </div>

    </div>

  );

}

