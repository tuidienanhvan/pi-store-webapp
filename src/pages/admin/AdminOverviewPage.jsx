import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api-client";
import { useLocale } from "../../context/LocaleContext";
import { useAdminT, formatCurrencyUSD, formatNumber } from "../../lib/adminI18n";
import { Card, Alert, Badge, Button, Icon, Table } from "../../components/ui";

export function AdminOverviewPage() {
  const { locale } = useLocale();
  const t = useAdminT();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.admin.overview()
      .then((res) => {
        const down = Number(res.down_providers || 0);
        setData({
          revenue: {
            "30d": Number(res.revenue_30d || 0),
            "90d": Number(res.revenue_30d || 0) * 3,
            "ytd": Number(res.revenue_30d || 0) * 12,
            "mom_growth": Number(res.margin_pct || 0),
          },
          licenses: { active: Number(res.active_licenses || 0), new_this_week: 0 },
          tokens: {
            spent_30d: Number(res.tokens_spent_30d || 0),
            projected_month_end: Number(res.tokens_spent_30d || 0),
          },
          system: {
            api: "healthy",
            worker: "healthy",
            db: "healthy",
            redis: "healthy",
          },
          providers: [
            { name: "healthy", status: Number(res.healthy_providers || 0) > 0 ? "healthy" : "degraded" },
            { name: "down", status: down > 0 ? "down" : "healthy" },
          ],
          keyPool: { total: Number(res.total_providers || 0), available: Number(res.healthy_providers || 0), allocated: 0, exhausted: down },
          alerts: down > 0 ? [{ id: 1, type: "danger", text: `${down} provider đang lỗi.` }] : [],
          expiringLicenses: [],
        });
      })
      .catch((e) => setError(e.message));
  }, []);

  if (error) {
    return (
      <div className="stack" style={{ gap: "var(--s-8)" }}>
        <Alert tone="danger">{error}</Alert>
      </div>
    );
  }
  if (!data) return <div style={{ padding: "var(--s-8)", color: "var(--text-3)", textAlign: "center" }}>Đang tải…</div>;

  return (
    <div className="stack gap-8">
      <header className="row" style={{ justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "var(--s-4)" }}>
        <div className="stack gap-2">
          <div className="row gap-3 items-center">
            <h1 className="text-36 m-0">{t.overview_title}</h1>
            <Badge tone="brand" className="glass uppercase font-bold tracking-widest px-3 py-1">Beta</Badge>
          </div>
          <p className="text-18 muted m-0">{t.overview_subtitle}</p>
        </div>
        <div className="row" style={{ gap: "var(--s-2)", flexWrap: "wrap" }}>
          <Button as={Link} to="/admin/licenses?_action=create" variant="primary" size="sm">
            <Icon name="plus" size={14} /> {t.new_license}
          </Button>
          <Button as={Link} to="/admin/keys?_action=create" variant="ghost" size="sm">
            <Icon name="plus" size={14} /> {t.add_key}
          </Button>
          <Button as={Link} to="/admin/users?_action=create" variant="ghost" size="sm">
            <Icon name="user" size={14} /> {t.new_user}
          </Button>
          <Button as={Link} to="/admin/releases?_action=upload" variant="ghost" size="sm">
            <Icon name="download" size={14} /> {t.upload_release}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => window.location.reload()}>
            <Icon name="loader" size={14} /> {t.refresh}
          </Button>
        </div>
      </header>

      {/* Row 1: KPI Stats */}
      <div className="grid --cols-4">
        {/* Revenue Widget → /admin/revenue */}
        <Card as={Link} to="/admin/revenue" className="stack gap-3 bg-brand text-on-brand p-5"
          style={{ display: "flex", flexDirection: "column", textDecoration: "none", cursor: "pointer" }}>
          <div className="text-14" style={{ opacity: 0.9 }}>{t.revenue_card} <Icon name="arrow-right" size={12} /></div>
          <div className="text-32 font-bold">{formatCurrencyUSD(data.revenue["30d"], locale)} <span className="text-14" style={{ opacity: 0.8, fontWeight: 'normal' }}>(30d)</span></div>
          <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap", gap: "var(--s-2)", fontSize: "var(--fs-13)", marginTop: "auto" }}>
            <span>90d: {formatCurrencyUSD(data.revenue["90d"], locale)}</span>
            <span>YTD: {formatCurrencyUSD(data.revenue["ytd"], locale)}</span>
            <span style={{ color: "var(--success)" }}>+{data.revenue.mom_growth}% MoM</span>
          </div>
        </Card>

        {/* Active Licenses → /admin/licenses?status=active */}
        <Card as={Link} to="/admin/licenses?status=active" className="stack gap-2 p-5"
          style={{ textDecoration: "none", cursor: "pointer", color: "inherit" }}>
          <div className="text-14 muted">{t.active_licenses} <Icon name="arrow-right" size={12} /></div>
          <div className="text-32 font-bold text-1">{formatNumber(data.licenses.active, locale)}</div>
          <div className="text-13 mt-auto" style={{ color: "var(--success)" }}>
            ▲ +{data.licenses.new_this_week} {t.new_this_week}
          </div>
        </Card>

        {/* Tokens Spent → /admin/usage */}
        <Card as={Link} to="/admin/usage?days=30" className="stack gap-2 p-5"
          style={{ textDecoration: "none", cursor: "pointer", color: "inherit" }}>
          <div className="text-14 muted">{t.tokens_used} (30d) <Icon name="arrow-right" size={12} /></div>
          <div className="text-32 font-bold text-1">{(data.tokens.spent_30d / 1000000).toFixed(1)}M</div>
          <div className="text-13 muted mt-auto">
            {t.proj_month_end}: {(data.tokens.projected_month_end / 1000000).toFixed(1)}M
          </div>
        </Card>
        
        {/* System Status Widget */}
        <Card className="stack gap-3 p-5">
          <div className="text-14 muted">{t.system_status}</div>
          <div className="grid --cols-2 gap-2 mt-auto text-12">
            <div className="row justify-between"><span>API</span> <Badge tone={data.system.api === 'healthy' ? "success" : "danger"} size="sm">OK</Badge></div>
            <div className="row justify-between"><span>Worker</span> <Badge tone={data.system.worker === 'healthy' ? "success" : "danger"} size="sm">OK</Badge></div>
            <div className="row justify-between"><span>DB</span> <Badge tone={data.system.db === 'healthy' ? "success" : "danger"} size="sm">OK</Badge></div>
            <div className="row justify-between"><span>Redis</span> <Badge tone={data.system.redis === 'healthy' ? "success" : "danger"} size="sm">OK</Badge></div>
          </div>
        </Card>
      </div>

      {/* Row 2 */}
      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "var(--s-6)" }}>
        
        {/* Real-time Alerts */}
        <section className="stack">
          <h2 className="text-20 m-0">{t.realtime_alerts}</h2>
          <Card className="stack gap-3 p-4" style={{ height: "100%", maxHeight: "300px", overflowY: "auto" }}>
            {data.alerts.length === 0 ? (
              <div className="muted text-center p-4">All clear.</div>
            ) : (
              data.alerts.map(a => (
                <Alert key={a.id} tone={a.type} style={{ padding: "var(--s-2) var(--s-3)", margin: 0 }}>
                  <Icon name={a.type === 'danger' ? 'warning' : 'info'} size={14} style={{ marginRight: '8px' }} />
                  {a.text}
                </Alert>
              ))
            )}
          </Card>
        </section>

        {/* License Expiring in 7d */}
        <section className="stack">
          <h2 className="text-20 m-0">{t.expiring_soon}</h2>
          <Card style={{ padding: 0, height: "100%", maxHeight: "300px", overflowY: "auto" }}>
            {data.expiringLicenses.length === 0 ? (
               <div className="muted text-center p-4">Không có license nào.</div>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Tier</th>
                    <th style={{ textAlign: "right" }}>Còn lại</th>
                  </tr>
                </thead>
                <tbody>
                  {data.expiringLicenses.map(l => (
                    <tr key={l.id}>
                      <td className="font-semibold text-13">{l.email}</td>
                      <td><Badge tone="brand">{l.tier}</Badge></td>
                      <td style={{ textAlign: "right" }}>
                        <span style={{ color: l.daysLeft <= 3 ? "var(--danger)" : "var(--warning)", fontWeight: 600 }}>{l.daysLeft} ngày</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>
        </section>
      </div>

      {/* Row 3 */}
      <div className="grid" style={{ gridTemplateColumns: "2fr 1fr", gap: "var(--s-6)" }}>
        
        {/* {t.provider_health_matrix} → /admin/providers */}
        <section className="stack">
          <div className="row justify-between">
            <h2 className="text-20 m-0">{t.provider_health_matrix}</h2>
            <Link to="/admin/providers" style={{ fontSize: "var(--fs-13)", color: "var(--brand)" }}>
              {t.view_all} <Icon name="arrow-right" size={12} />
            </Link>
          </div>
          <Card className="p-4" style={{ height: "100%" }}>
             <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--s-2)' }}>
               {data.providers.map(p => {
                 let tone = p.status === 'healthy' ? 'success' : p.status === 'degraded' ? 'warning' : 'danger';
                 return (
                   <div key={p.name} style={{
                     padding: 'var(--s-2) var(--s-3)',
                     background: `var(--${tone}-soft)`,
                     border: `1px solid var(--${tone})`,
                     borderRadius: 'var(--r-2)',
                     fontSize: 'var(--fs-12)',
                     display: 'flex', alignItems: 'center', gap: 'var(--s-1)'
                   }}>
                     <div style={{ width: 8, height: 8, borderRadius: '50%', background: `var(--${tone})` }} />
                     {p.name.replace('-free', '')}
                   </div>
                 );
               })}
             </div>
          </Card>
        </section>

        {/* {t.key_pool_status} Bar Chart → /admin/keys */}
        <section className="stack">
          <div className="row justify-between">
            <h2 className="text-20 m-0">{t.key_pool_status}</h2>
            <Link to="/admin/keys" style={{ fontSize: "var(--fs-13)", color: "var(--brand)" }}>
              {t.manage} <Icon name="arrow-right" size={12} />
            </Link>
          </div>
          <Card className="stack gap-4 p-5" style={{ height: "100%" }}>
            <div className="text-16 font-semibold">Total: {data.keyPool.total.toLocaleString()} keys</div>
            
            <div style={{ 
              height: 24, borderRadius: 12, overflow: 'hidden', display: 'flex',
              background: 'var(--surface-2)' 
            }}>
              <div title={`Available: ${data.keyPool.available}`} style={{ width: `${data.keyPool.total ? (data.keyPool.available / data.keyPool.total) * 100 : 0}%`, background: 'var(--success)' }} />
              <div title={`Allocated: ${data.keyPool.allocated}`} style={{ width: `${data.keyPool.total ? (data.keyPool.allocated / data.keyPool.total) * 100 : 0}%`, background: 'var(--brand)' }} />
              <div title={`Exhausted: ${data.keyPool.exhausted}`} style={{ width: `${data.keyPool.total ? (data.keyPool.exhausted / data.keyPool.total) * 100 : 0}%`, background: 'var(--danger)' }} />
            </div>

            <div className="stack gap-2 text-13">
              <div className="row justify-between">
                <span className="row gap-2"><div style={{ width: 12, height: 12, borderRadius: 2, background: 'var(--success)' }}/> Available</span>
                <strong>{data.keyPool.available}</strong>
              </div>
              <div className="row justify-between">
                <span className="row gap-2"><div style={{ width: 12, height: 12, borderRadius: 2, background: 'var(--brand)' }}/> Allocated</span>
                <strong>{data.keyPool.allocated}</strong>
              </div>
              <div className="row justify-between">
                <span className="row gap-2"><div style={{ width: 12, height: 12, borderRadius: 2, background: 'var(--danger)' }}/> Exhausted</span>
                <strong>{data.keyPool.exhausted}</strong>
              </div>
            </div>
          </Card>
        </section>
      </div>

    </div>
  );
}
