import React, { useEffect, useState, useMemo } from "react";
import { withDelay } from "@/_shared/api/api-client";
import { useListFilters } from "@/_shared/hooks/useListFilters";
import { useLocale } from "@/_shared/context/LocaleContext";
import { useAdminT, formatCurrency, formatTokens } from "@/_shared/lib/translations";
import { formatPct } from "@/_shared/lib/format";
import { 
  Alert, 
  Button, 
  Select, 
} from "@/_shared/components/ui";
import { 
  Bolt, 
  Zap, 
  CreditCard, 
  Shield, 
  Sparkles, 
  Loader2, 
  Activity, 
  BarChart3, 
  AlertTriangle,
  Layers,
} from "lucide-react";

import { 
  AdminPageHeader, 
  AdminCard, 
  AdminValue, 
  AdminBadge, 
  AdminTable, 
  AdminEmptyState,
  AdminStatCard,
  AdminFilterBar
} from "../../_shared/components";

import { AdminUsageSkeleton } from "@/_shared/components/skeletons/AdminUsageSkeleton";
import { fetchUsageData } from "./api";

const DEFAULTS = { days: 30, plugin: "", quality: "", status: "" };
const DAYS_OPTIONS = [7, 30, 90];

/**
 * UsagePage: Trang thống kê sử dụng API và hiệu suất hệ thống.
 */
export function UsagePage() {
  const { locale } = useLocale();
  const t = useAdminT();
  const { filters, setFilter, reset, hasActive } = useListFilters(DEFAULTS);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true); setErr("");
      try {
        const res = await withDelay(fetchUsageData(filters), 600);
        setData(res);
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filters.days, filters.plugin, filters.quality, filters.status]);

  const byPlugin = data?.by_plugin || [];
  const totalCalls = data?.total_calls || 0;
  const totalTokens = data?.tokens_spent || 0;
  const upstreamCostCents = data?.upstream_cost_cents || 0;
  const revenueCents = Math.round(totalTokens * 9 / 100_000 * 100);
  const marginPct = revenueCents > 0 ? 1 - (upstreamCostCents / revenueCents) : 0;

  if (loading && !data) return <AdminUsageSkeleton />;

  return (
    <div className="p-6 lg:p-10 flex flex-col gap-8">
      <AdminPageHeader 
        title="Thống kê Sử dụng"
        tagline="Phân tích lưu lượng API và hiệu suất hạ tầng toàn cầu"
        badge="Hệ thống API"
      />

      {err && <Alert tone="danger" onDismiss={() => setErr("")}>{err}</Alert>}

      {/* Bộ lọc nâng cao */}
      <AdminFilterBar
        onClear={reset}
        hasActive={hasActive}
      >
        <div className="flex flex-wrap items-center gap-4">
           <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
             {DAYS_OPTIONS.map((d) => (
               <button key={d} 
                 onClick={() => setFilter("days", d)}
                 className={`h-8 px-4 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${filters.days === d ?"bg-primary text-white" : "text-base-content/40 hover:text-base-content/60"}`}>
                 {d} Ngày
               </button>
             ))}
           </div>
           
           <div className="w-px h-6 bg-white/5 mx-2" />
           
           <Select value={filters.plugin}
             onChange={(e) => setFilter("plugin", e.target.value)}
             className="h-10 min-w-[160px] bg-white/5 border-white/10 rounded-xl font-bold uppercase text-[10px] tracking-widest"
             options={[
               { label: "Tất cả sản phẩm", value: "" },
               { label: "PI-SEO", value: "pi-seo" },
               { label: "PI-CHATBOT", value: "pi-chatbot" },
               { label: "PI-LEADS", value: "pi-leads" },
               { label: "PI-ANALYTICS", value: "pi-analytics" },
               { label: "PI-PERFORMANCE", value: "pi-performance" },
               { label: "PI-DASHBOARD", value: "pi-dashboard" },
               { label: "TRỰC TIẾP (API)", value: "direct" },
             ]} />

           <Select value={filters.quality}
             onChange={(e) => setFilter("quality", e.target.value)}
             className="h-10 min-w-[160px] bg-white/5 border-white/10 rounded-xl font-bold uppercase text-[10px] tracking-widest"
             options={[
               { label: "Tất cả chất lượng", value: "" },
               { label: "NHANH (FAST)", value: "fast" },
               { label: "CÂN BẰNG", value: "balanced" },
               { label: "TỐT NHẤT", value: "best" },
             ]} />

           <Select value={filters.status}
             onChange={(e) => setFilter("status", e.target.value)}
             className="h-10 min-w-[160px] bg-white/5 border-white/10 rounded-xl font-bold uppercase text-[10px] tracking-widest"
             options={[
               { label: "Tất cả trạng thái", value: "" },
               { label: "THÀNH CÔNG", value: "success" },
               { label: "THẤT BẠI", value: "failed" },
             ]} />
        </div>
      </AdminFilterBar>

      {/* Báo cáo chỉ số vận hành */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <AdminStatCard label="Tổng lượt gọi" value={totalCalls.toLocaleString()} icon={Bolt} trend="API Hits" />
        <AdminStatCard label="Token đã dùng" value={formatTokens(totalTokens)} icon={Zap} tone="primary" />
        <AdminStatCard label="Doanh thu dự tính" value={formatCurrency(revenueCents, locale)} icon={CreditCard} tone="success" />
        <AdminStatCard label="Chi phí AI" value={formatCurrency(upstreamCostCents, locale)} icon={Shield} tone="warning" />
        <AdminStatCard label="Lợi nhuận ròng" value={formatPct(marginPct)} icon={Sparkles} tone="success" />
        <AdminStatCard label="Độ trễ TB" value={`${data?.avg_latency_ms || 0}ms`} icon={Loader2} trend="Hiệu suất" />
      </div>

      {/* Biểu đồ lưu lượng hàng ngày */}
      <AdminCard className="p-8">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
             <BarChart3 size={18} className="text-primary" />
             <h2 className="text-[10px] font-bold uppercase tracking-widest text-base-content/40">Lưu lượng hàng ngày</h2>
          </div>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 bg-primary rounded-sm"/>
               <span className="text-[9px] font-bold uppercase tracking-widest text-base-content/40">Thành công</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 bg-danger rounded-sm"/>
               <span className="text-[9px] font-bold uppercase tracking-widest text-base-content/40">Thất bại</span>
            </div>
          </div>
        </div>

        <div className="h-64 relative">
          {!loading && data?.dailyStats?.length > 0 ? (
            <div className="flex items-end h-full gap-2 px-2">
              {data.dailyStats.map((d) => {
                const successHeight = ((d.success || 0) / data.maxDaily) * 100;
                const failHeight = ((d.fail || 0) / data.maxDaily) * 100;
                return (
                  <div key={d.date} className="group relative flex-1 flex flex-col justify-end h-full gap-0.5">
                    <div className="bg-danger/30 group-hover:bg-danger/60 rounded-t-[2px] w-full transition-all duration-300" style={{ height: `${failHeight}%` }} />
                    <div className="bg-primary/30 group-hover:bg-primary/60 w-full transition-all duration-300" style={{ height: `${successHeight}%` }} />
                    
                    {/* Tooltip khi di chuột */}
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-base-300 border border-white/10 px-2 py-1 rounded text-[8px] font-bold text-base-content whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none uppercase tracking-widest shadow-xl">
                       {d.date}: {d.success || 0} OK / {d.fail || 0} Lỗi
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 opacity-20">
               <Activity size={48} />
               <span className="text-[10px] font-bold uppercase tracking-widest">Không có hoạt động API nào</span>
            </div>
          )}
          {/* Lưới tọa độ ẩn */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5">
             <div className="w-full h-px bg-white" />
             <div className="w-full h-px bg-white" />
             <div className="w-full h-px bg-white" />
             <div className="w-full h-px bg-white" />
          </div>
        </div>
      </AdminCard>

      {/* Bảng phân tích chi tiết */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Phân bổ theo sản phẩm */}
        <section className="flex flex-col gap-6">
           <div className="flex items-center gap-3 px-2">
              <Layers size={18} className="text-primary/60" />
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-base-content/40">Phân bổ theo sản phẩm</h2>
           </div>
           <AdminTable>
             <thead>
               <tr className="bg-white/[0.02]">
                 <th className="py-4 px-6 text-left font-bold uppercase tracking-widest text-[9px] opacity-40">Sản phẩm</th>
                 <th className="py-4 px-6 text-right font-bold uppercase tracking-widest text-[9px] opacity-40">Lượt gọi</th>
                 <th className="py-4 px-6 text-right font-bold uppercase tracking-widest text-[9px] opacity-40">Doanh thu</th>
                 <th className="py-4 px-6 text-right font-bold uppercase tracking-widest text-[9px] opacity-40">Lợi nhuận</th>
                 <th className="py-4 px-6 text-right font-bold uppercase tracking-widest text-[9px] opacity-40">Tỷ trọng</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-white/5">
               {byPlugin.map((row) => {
                 const sharePct = totalTokens > 0 ? (row.tokens / totalTokens) * 100 : 0;
                 return (
                   <tr key={row.plugin} className="group hover:bg-white/[0.01]">
                     <td className="py-5 px-6">
                        <span className="text-[11px] font-bold text-primary uppercase tracking-widest">{row.plugin}</span>
                     </td>
                     <td className="py-5 px-6 text-right font-mono text-[11px] font-bold text-base-content/60">
                        {row.calls.toLocaleString()}
                     </td>
                     <td className="py-5 px-6 text-right font-mono text-[11px] font-bold text-success">
                        ${row.revenue_usd.toFixed(2)}
                     </td>
                     <td className="py-5 px-6 text-right">
                        <AdminBadge tone="neutral">{(row.margin_pct * 100).toFixed(1)}%</AdminBadge>
                     </td>
                     <td className="py-5 px-6">
                       <div className="flex items-center justify-end gap-3">
                         <div className="h-1.5 w-20 bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
                           <div className="absolute inset-0 bg-primary/40 rounded-full" style={{ width: `${sharePct}%` }} />
                         </div>
                         <span className="text-[10px] font-bold text-base-content/20 w-8 text-right">{sharePct.toFixed(0)}%</span>
                       </div>
                     </td>
                   </tr>
                 );
               })}
             </tbody>
           </AdminTable>
        </section>

        {/* Danh sách lỗi hệ thống */}
        <section className="flex flex-col gap-6">
           <div className="flex items-center gap-3 px-2">
              <AlertTriangle size={18} className="text-danger/60" />
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-base-content/40">Danh sách lỗi hệ thống</h2>
           </div>
           <AdminTable>
              <thead>
                <tr className="bg-white/[0.02]">
                  <th className="py-4 px-6 text-left font-bold uppercase tracking-widest text-[9px] opacity-40">Mã lỗi</th>
                  <th className="py-4 px-6 text-right font-bold uppercase tracking-widest text-[9px] opacity-40">Số lần xuất hiện</th>
                  <th className="py-4 px-6 text-right font-bold uppercase tracking-widest text-[9px] opacity-40">Mức độ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data?.errors?.length > 0 ? data.errors.map((e) => (
                  <tr key={e.code} className="group hover:bg-danger/[0.02]">
                    <td className="py-5 px-6">
                       <AdminBadge tone="danger">{e.code}</AdminBadge>
                    </td>
                    <td className="py-5 px-6 text-right font-mono text-[11px] font-bold text-danger/60">
                       {e.count.toLocaleString()}
                    </td>
                    <td className="py-5 px-6 text-right">
                       <div className="h-1 w-24 bg-danger/10 rounded-full overflow-hidden ml-auto">
                          <div className="h-full bg-danger" style={{ width: `${Math.min(100, (e.count / totalCalls) * 1000)}%` }} />
                       </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="3" className="py-20"><AdminEmptyState title="Không phát hiện lỗi" description="Hệ thống API đang hoạt động ổn định trong các tham số cho phép." /></td></tr>
                )}
              </tbody>
           </AdminTable>
        </section>
      </div>
    </div>
  );
}

export default UsagePage;
