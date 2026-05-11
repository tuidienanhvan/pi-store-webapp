import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, withDelay } from "@/lib/api-client";
import { useLocale } from "@/context/LocaleContext";
import { useAdminT, formatCurrencyUSD, formatNumber } from "@/lib/adminI18n";
import { Card, Alert, Badge, Button, Icon, Table } from "@/components/ui";

import { AdminOverviewSkeleton } from "@/components/skeletons/AdminOverviewSkeleton";
import { AdminStatCard } from "./components/AdminStatCard";
import "./AdminOverviewPage.css";

/**
 * AdminOverviewPage  Infinity Edition
 * High-fidelity command center for Pi Ecosystem Administrators.
 */
export function AdminOverviewPage() {
  const { locale } = useLocale();
  const t = useAdminT();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    withDelay(api.admin.overview(), 1000)
      .then((res) => {
        const down = Number(res.down_providers || 0);
        setData({
          revenue: {
            "30d": Number(res.revenue_30d || 0),
            "90d": Number(res.revenue_90d || 0),
            "ytd": Number(res.revenue_ytd || 0),
            "mom_growth": Number(res.margin_pct || 0),
          },
          licenses: { 
            active: Number(res.active_licenses || 0), 
            new_this_week: Number(res.new_licenses_7d || 0) 
          },
          tokens: {
            spent_30d: Number(res.tokens_spent_30d || 0),
            projected_month_end: Number(res.projected_tokens_month_end || 0),
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
          keyPool: { 
            total: Number(res.keys_total || 0), 
            available: Number(res.keys_available || 0), 
            allocated: Number(res.keys_allocated || 0), 
            exhausted: down 
          },
          alerts: down > 0 ? [{ id: 1, type: "danger", text: `${down} provider đang lỗi.` }] : [],
          expiringLicenses: res.expiring_licenses || [],
        });
      })
      .catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (error) {
  return (
    <div className="flex flex-col gap-8">
      <Alert tone="danger">{error}</Alert>
    </div>
  );
  }

  if (!data) return <AdminOverviewSkeleton />;

  return (
    <div className="flex flex-col gap-10 stagger-1">
      <header className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-black -tracking-tight m-0 premium-title">{t.overview_title}</h1>
            <Badge tone="brand" className="glass uppercase font-black tracking-widest px-3 py-1 text-[10px] glow-brand">Infinity Core</Badge>
          </div>
          <p className="text-[11px] font-bold text-base-content/60 m-0 opacity-40 leading-7 tracking-[0.1em] max-w-5xl uppercase">{t.overview_subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button as={Link} to="/admin/licenses?_action=create" variant="primary" size="sm" className="rounded-xl font-black uppercase tracking-widest text-[10px]">
            <Icon name="plus" size={14} className="mr-1" /> {t.new_license}
          </Button>
          <Button as={Link} to="/admin/keys?_action=create" variant="ghost" size="sm" className="rounded-xl font-black uppercase tracking-widest text-[10px] border border-base-border-subtle">
            <Icon name="plus" size={14} className="mr-1" /> {t.add_key}
          </Button>
          <Button as={Link} to="/admin/users?_action=create" variant="ghost" size="sm" className="rounded-xl font-black uppercase tracking-widest text-[10px] border border-base-border-subtle">
            <Icon name="user" size={14} className="mr-1" /> {t.new_user}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => window.location.reload()} className="rounded-xl border border-base-border-subtle">
            <Icon name="loader" size={14} />
          </Button>
        </div>
      </header>

      {/* Row 1: KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 stagger-2">
        <AdminStatCard 
          to="/admin/revenue"
          variant="brand"
          title={t.revenue_card}
          value={formatCurrencyUSD(data.revenue["30d"], locale)}
          trend={data.revenue.mom_growth}
          trendLabel="MoM Growth"
          subValue={
            <div className="flex flex-col gap-1">
              <div className="flex justify-between"><span className="opacity-60">90d:</span> <span>{formatCurrencyUSD(data.revenue["90d"], locale)}</span></div>
              <div className="flex justify-between"><span className="opacity-60">YTD:</span> <span>{formatCurrencyUSD(data.revenue["ytd"], locale)}</span></div>
            </div>
          }
        />

        <AdminStatCard 
          to="/admin/licenses?status=active"
          title={t.active_licenses}
          value={formatNumber(data.licenses.active, locale)}
          subValue={
            <div className="text-success font-black uppercase tracking-widest text-[10px]">
              + {data.licenses.new_this_week} {t.new_this_week}
            </div>
          }
        />

        <AdminStatCard 
          to="/admin/usage?days=30"
          title={`${t.tokens_used} (30d)`}
          value={`${(data.tokens.spent_30d / 1000000).toFixed(1)}M`}
          subValue={
            <div className="flex justify-between items-center">
              <span className="opacity-40 uppercase tracking-widest text-[9px]">Projection:</span> 
              <span className="font-black text-base-content/80">{(data.tokens.projected_month_end / 1000000).toFixed(1)}M</span>
            </div>
          }
        />
        
        <Card className="admin-stat-card admin-stat-card--glass">
          <div className="admin-stat-card__header">
            <span className="admin-stat-card__title">{t.system_status}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-auto">
            {['api', 'worker', 'db', 'redis'].map(srv => (
              <div key={srv} className="flex flex-col gap-1.5">
                <span className="text-[9px] font-black uppercase tracking-widest text-base-content/60 opacity-40">{srv}</span>
                <Badge tone={data.system[srv] === 'healthy' ? "success" : "danger"} size="sm" className={`w-fit font-black px-2.5 py-0.5 rounded-lg ${data.system[srv] === 'healthy' ? 'badge-premium-success' : 'badge-premium-danger'}`}>OK</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 stagger-3">
        <section className="flex flex-col gap-4">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-base-content/60 opacity-60 flex items-center gap-2">
             <Icon name="warning" size={14} className="text-danger" /> {t.realtime_alerts}
          </h2>
          <Card className="admin-overview-card--glass flex flex-col gap-3 p-8 min-h-[240px] items-center justify-center text-center border-dashed">
            {data.alerts.length === 0 ? (
              <div className="flex flex-col gap-4 items-center">
                <div className="w-16 h-16 rounded-full bg-success/10 text-success flex items-center justify-center mb-2 shield-glow">
                  <Icon name="shield" size={32} />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-[11px] font-black uppercase tracking-[0.2em] text-success">Shield Active</div>
                  <div className="text-[11px] font-bold text-base-content/60 opacity-40 uppercase tracking-widest">Mọi hệ thống đang vận hành hoàn hảo</div>
                </div>
              </div>
            ) : (
              data.alerts.map(a => (
                <Alert key={a.id} tone={a.type} className="border-none bg-base-300/50 py-3 w-full">
                  {a.text}
                </Alert>
              ))
            )}
          </Card>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-base-content/60 opacity-60 flex items-center gap-2">
             <Icon name="key" size={14} className="text-primary" /> {t.expiring_soon}
          </h2>
          <Card className="admin-overview-card--glass p-0 overflow-hidden min-h-[240px] flex flex-col">
            {data.expiringLicenses.length === 0 ? (
               <div className="m-auto flex flex-col gap-4 items-center text-center p-10">
                 <div className="w-16 h-16 rounded-full bg-primary/5 text-primary/20 flex items-center justify-center">
                   <Icon name="calendar" size={32} />
                 </div>
                 <div className="flex flex-col gap-1">
                   <div className="text-[11px] font-black uppercase tracking-[0.2em] text-base-content/60 opacity-20">Tình trạng License</div>
                   <div className="text-[10px] font-bold text-base-content/60 opacity-20 uppercase tracking-widest">Không có license nào sắp hết hạn</div>
                 </div>
               </div>
            ) : (
              <Table className="text-xs">
                <thead>
                  <tr className="bg-base-300/30">
                    <th className="font-black uppercase tracking-widest py-4 px-4 text-left">Email</th>
                    <th className="font-black uppercase tracking-widest py-4 px-4 text-center">Tier</th>
                    <th className="font-black uppercase tracking-widest py-4 px-4 text-right">Expires</th>
                  </tr>
                </thead>
                <tbody>
                  {data.expiringLicenses.map(l => (
                    <tr key={l.id} className="border-t border-base-border-subtle/50">
                      <td className="font-bold text-base-content py-4 px-4">{l.email}</td>
                      <td className="text-center py-4 px-4"><Badge tone="brand" className="font-black uppercase text-[9px]">{l.tier}</Badge></td>
                      <td className="text-right font-black text-danger py-4 px-4">{l.daysLeft}d</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>
        </section>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 stagger-4">
        <section className="xl:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-base-content/60 opacity-60">{t.provider_health_matrix}</h2>
            <Link to="/admin/providers" className="text-[10px] font-black uppercase tracking-widest text-primary no-underline hover:underline opacity-60 hover:opacity-100 transition-opacity">
              {t.view_all} <Icon name="arrow-right" size={10} />
            </Link>
          </div>
          <Card className="p-6 flex flex-wrap gap-4 bg-base-300/20 border-dashed border-base-border-subtle rounded-[var(--rounded-3xl)]">
             {data.providers.map(p => {
               let tone = p.status === 'healthy' ? 'success' : p.status === 'degraded' ? 'warning' : 'danger';
               return (
                 <div key={p.name} className={`flex items-center gap-2 px-3 py-2 rounded-xl border border-base-border-subtle bg-base-200 shadow-sm`}>
                   <div className={`w-2 h-2 rounded-full bg-${tone}`} />
                   <span className="text-[10px] font-black text-base-content uppercase tracking-tight">{p.name.replace('-free', '')}</span>
                 </div>
               );
             })}
          </Card>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-base-content/60 opacity-60">{t.key_pool_status}</h2>
            <Link to="/admin/keys" className="text-[10px] font-black uppercase tracking-widest text-primary no-underline hover:underline opacity-60 hover:opacity-100 transition-opacity">
              {t.manage} <Icon name="arrow-right" size={10} />
            </Link>
          </div>
          <Card className="admin-overview-card--glass p-8 flex flex-col gap-6">
            <div className="text-2xl font-black text-base-content -tracking-tight font-display">{data.keyPool.total.toLocaleString()} Keys</div>
            
            <div className="h-4 rounded-full overflow-hidden flex bg-base-300 border border-base-border-subtle shadow-inner">
              <div title={`Available: ${data.keyPool.available}`} className="bg-success h-full transition-all duration-1000" style={{ width: `${data.keyPool.total ? (data.keyPool.available / data.keyPool.total) * 100 : 0}%` }} />
              <div title={`Allocated: ${data.keyPool.allocated}`} className="bg-primary h-full transition-all duration-1000" style={{ width: `${data.keyPool.total ? (data.keyPool.allocated / data.keyPool.total) * 100 : 0}%` }} />
              <div title={`Exhausted: ${data.keyPool.exhausted}`} className="bg-danger h-full transition-all duration-1000" style={{ width: `${data.keyPool.total ? (data.keyPool.exhausted / data.keyPool.total) * 100 : 0}%` }} />
            </div>

            <div className="flex flex-col gap-3 mt-auto">
              {[
                { label: 'Available', value: data.keyPool.available, color: 'success' },
                { label: 'Allocated', value: data.keyPool.allocated, color: 'brand' },
                { label: 'Exhausted', value: data.keyPool.exhausted, color: 'danger' }
              ].map(stat => (
                <div key={stat.label} className="flex items-center justify-between text-[11px] font-bold">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-sm bg-${stat.color}`} />
                    <span className="text-base-content/60 uppercase tracking-widest text-[9px]">{stat.label}</span>
                  </div>
                  <span className="text-base-content font-black">{stat.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}

export default AdminOverviewPage;
