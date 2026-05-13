import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, withDelay } from "@/lib/api-client";
import { useLocale } from "@/context/LocaleContext";
import { useAdminT, formatCurrencyUSD, formatNumber } from "@/lib/translations";
import { Card, Alert, Badge, Button, Table } from "@/components/ui";
import { Plus, User, Loader2, AlertTriangle, Shield, Key, Calendar, ArrowRight } from "lucide-react";

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
        if (!res) throw new Error("No data received from system");

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
            api: res.system_api || "healthy",
            worker: res.system_worker || "healthy",
            db: res.system_db || "healthy",
            redis: res.system_redis || "healthy",
          },
          providers: res.providers || [
            { name: "Upstream", status: Number(res.healthy_providers || 0) > 0 ? "healthy" : "degraded" },
            { name: "Downstream", status: down > 0 ? "down" : "healthy" },
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
    <div className="flex flex-col gap-12 relative min-h-screen">
      {/* Ambient Decorators */}
      <div className="ambient-glow ambient-glow--tl" />
      <div className="ambient-glow ambient-glow--br" />

      <div className="flex flex-col gap-12 stagger-1 relative z-10">
      <header className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <h1 className="text-5xl font-black -tracking-tight m-0 premium-title uppercase">
              {t.overview_title}
            </h1>
            <Badge tone="brand" className="glass uppercase font-black tracking-[0.2em] px-4 py-1.5 text-[10px] glow-brand border-primary/20 bg-primary/10">
              Infinity Core v2
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-[1px] bg-primary/40" />
            <p className="text-[11px] font-black text-primary m-0 tracking-[0.2em] uppercase">
              {t.overview_subtitle}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button as={Link} to="/admin/licenses?_action=create" variant="primary" size="sm" className="rounded-xl font-black uppercase tracking-widest text-[10px]">
            <Plus size={14} className="mr-1" /> {t.new_license}
          </Button>
          <Button as={Link} to="/admin/keys?_action=create" variant="ghost" size="sm" className="rounded-xl font-black uppercase tracking-widest text-[10px] border border-base-border-subtle">
            <Plus size={14} className="mr-1" /> {t.add_key}
          </Button>
          <Button as={Link} to="/admin/users?_action=create" variant="ghost" size="sm" className="rounded-xl font-black uppercase tracking-widest text-[10px] border border-base-border-subtle">
            <User size={14} className="mr-1" /> {t.new_user}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => window.location.reload()} className="rounded-xl border border-base-border-subtle">
            <Loader2 size={14} className="animate-spin" />
          </Button>
        </div>
      </header>

      {/* Row 1: Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 stagger-2">
        {/* Main Revenue Bento (Huge) */}
        <div className="md:col-span-8">
          <AdminStatCard 
            to="/admin/revenue"
            variant="brand"
            title={t.revenue_card}
            value={formatCurrencyUSD(data.revenue["30d"])}
            trend={data.revenue.mom_growth}
            trendLabel="MoM Growth"
            className="h-full !min-h-[320px] !p-12"
            subValue={
              <div className="flex flex-wrap gap-12 mt-8 border-t border-white/5 pt-8">
                <div className="flex flex-col gap-2">
                  <span className="opacity-40 uppercase tracking-[0.3em] text-[10px]">90 Day Volume</span> 
                  <span className="text-2xl font-black font-display text-white/90">{formatCurrencyUSD(data.revenue["90d"])}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="opacity-40 uppercase tracking-[0.3em] text-[10px]">Year to Date</span> 
                  <span className="text-2xl font-black font-display text-white/90">{formatCurrencyUSD(data.revenue["ytd"])}</span>
                </div>
                {/* Visual Chart Placeholder (High Fidelity) */}
                <div className="flex-1 min-w-[200px] h-20 flex items-end gap-1 px-4">
                   {[40, 70, 45, 90, 65, 80, 100, 85, 95, 110, 105, 120].map((h, i) => (
                     <div key={i} className="flex-1 bg-primary/20 rounded-t-sm hover:bg-primary/60 transition-all duration-500" style={{ height: `${h}%` }} />
                   ))}
                </div>
              </div>
            }
          />
        </div>

        {/* System Health Bento (Vertical) */}
        <div className="md:col-span-4">
          <Card className="admin-stat-card admin-stat-card--glass h-full !p-10 flex flex-col gap-8 relative overflow-hidden group">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="admin-stat-card__header !opacity-100">
              <span className="admin-stat-card__title flex items-center gap-3 text-primary">
                <Shield size={14} /> {t.system_status}
              </span>
            </div>
            
            <div className="flex flex-col gap-6 mt-4">
              {['api', 'worker', 'db', 'redis'].map(srv => (
                <div key={srv} className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">{srv} node</span>
                    <Badge tone={data.system[srv] === 'healthy' ? "success" : "danger"} size="sm" className="font-black px-3 py-1 rounded-full text-[9px] uppercase tracking-widest border-none bg-white/5 backdrop-blur-md">
                      {data.system[srv] === 'healthy' ? 'Active' : 'Down'}
                    </Badge>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                     <div className={`h-full transition-all duration-1000 ${data.system[srv] === 'healthy' ? 'bg-success shadow-[0_0_10px_var(--su)]' : 'bg-danger shadow-[0_0_10px_var(--er)]'}`} style={{ width: data.system[srv] === 'healthy' ? '100%' : '20%' }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
               <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Operational Integrity</span>
               <div className="flex gap-1">
                 {[1,2,3,4,5].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-success/40" />)}
               </div>
            </div>
          </Card>
        </div>

        {/* Licenses Bento */}
        <div className="md:col-span-4">
          <AdminStatCard 
            to="/admin/licenses?status=active"
            title={t.active_licenses}
            value={formatNumber(data.licenses.active)}
            className="h-full !p-10"
            subValue={
              <div className="flex flex-col gap-4 mt-6">
                <div className="text-success font-black uppercase tracking-[0.2em] text-[11px] flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-success animate-ping" />
                   + {data.licenses.new_this_week} {t.new_this_week}
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full relative">
                   <div className="absolute inset-0 bg-success/40 blur-[2px]" style={{ width: '65%' }} />
                   <div className="absolute inset-0 bg-success" style={{ width: '65%' }} />
                </div>
              </div>
            }
          />
        </div>

        {/* Usage Bento */}
        <div className="md:col-span-8">
          <AdminStatCard 
            to="/admin/usage?days=30"
            title={`${t.tokens_used} (30d)`}
            value={`${(data.tokens.spent_30d / 1000000).toFixed(1)}M`}
            className="h-full !p-10"
            subValue={
              <div className="flex items-center gap-12 mt-8">
                <div className="flex flex-col gap-1">
                  <span className="opacity-40 uppercase tracking-[0.3em] text-[9px]">Month End Forecast</span> 
                  <span className="text-xl font-black font-display text-white/80">{(data.tokens.projected_month_end / 1000000).toFixed(1)}M Tokens</span>
                </div>
                <div className="flex-1 relative h-12 flex items-center group">
                   <div className="absolute inset-0 bg-primary/5 rounded-2xl border border-primary/10 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary/10 to-primary/30 transition-all duration-1000" style={{ width: '78%' }} />
                   </div>
                   <div className="relative z-10 w-full px-6 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-primary">
                      <span>Consumption Threshold</span>
                      <span>78% Capacity</span>
                   </div>
                </div>
              </div>
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 stagger-3">
        <section className="flex flex-col gap-6">
          <h2 className="section-label">
             <AlertTriangle size={14} className="text-danger" /> {t.realtime_alerts}
          </h2>
          <Card className="admin-overview-card--glass flex flex-col gap-3 p-8 min-h-[240px] items-center justify-center text-center border-dashed">
            {data.alerts.length === 0 ? (
              <div className="flex flex-col gap-4 items-center">
                <div className="w-16 h-16 rounded-full bg-success/10 text-success flex items-center justify-center mb-2 shield-glow">
                  <Shield size={32} />
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

        <section className="flex flex-col gap-6">
          <h2 className="section-label">
             <Calendar size={14} className="text-primary" /> {t.expiring_soon}
          </h2>
          <Card className="admin-overview-card--glass p-0 overflow-hidden min-h-[240px] flex flex-col">
            {data.expiringLicenses.length === 0 ? (
               <div className="m-auto flex flex-col gap-4 items-center text-center p-10">
                 <div className="w-16 h-16 rounded-full bg-primary/5 text-primary/20 flex items-center justify-center">
                   <Calendar size={32} />
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
        <section className="xl:col-span-2 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="section-label flex-1">{t.provider_health_matrix}</h2>
            <Link to="/admin/providers" className="text-[10px] font-black uppercase tracking-widest text-primary no-underline hover:underline transition-all hover:tracking-[0.2em]">
              {t.view_all} <ArrowRight size={10} className="inline ml-1" />
            </Link>
          </div>
          <Card className="p-8 flex flex-wrap gap-6 bg-base-300/10 border-dashed border-base-border-subtle/30 rounded-3xl relative overflow-hidden">
             <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(white,transparent)]" />
             {data.providers.map(p => {
               let tone = p.status === 'healthy' ? 'success' : p.status === 'degraded' ? 'warning' : 'danger';
               return (
                 <div key={p.name} className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-base-border-subtle/50 bg-base-200/50 backdrop-blur-sm shadow-xl hover:border-primary/30 transition-colors group relative z-10">
                   <div className={`w-2.5 h-2.5 rounded-full bg-${tone} shadow-[0_0_12px_var(--${tone === 'success' ? 'su' : tone === 'warning' ? 'wa' : 'er'})]`} />
                   <span className="text-[11px] font-black text-base-content uppercase tracking-widest">{p.name.replace('-free', '')}</span>
                   <Badge tone={tone} size="sm" className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">Active</Badge>
                 </div>
               );
             })}
          </Card>
        </section>

        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="section-label flex-1">
              <Key size={14} className="text-primary" /> {t.key_pool_status}
            </h2>
            <Link to="/admin/keys" className="text-[10px] font-black uppercase tracking-widest text-primary no-underline hover:underline transition-all hover:tracking-[0.2em]">
              {t.manage} <ArrowRight size={10} className="inline ml-1" />
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
    </div>
  );
}

export default AdminOverviewPage;
