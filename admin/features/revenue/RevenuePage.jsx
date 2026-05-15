import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale } from "@/_shared/context/LocaleContext";
import { useAdminT, formatCurrencyUSD } from "@/_shared/lib/translations";
import { withDelay } from "@/_shared/api/api-client";
import { 
  Alert, 
  Button,
} from "@/_shared/components/ui";
import { 
  PieChart, 
  TrendingUp, 
  CreditCard, 
  Activity, 
  BarChart3,
  Target
} from "lucide-react";

import { 
  AdminPageHeader, 
  AdminCard, 
  AdminValue, 
  AdminBadge, 
  AdminTable, 
  AdminEmptyState,
  AdminStatCard
} from "../../_shared/components";

import { RevenueSkeleton } from "./skeleton/RevenueSkeleton";
import { fetchRevenueData } from "./api";

const DAYS_OPTIONS = [7, 30, 90, 365];
const COLORS = [
  "var(--p)",
  "var(--s)",
  "var(--a)",
  "var(--p-soft)",
  "var(--s-soft)",
  "var(--a-soft)"
];

/**
 * RevenuePage: Báo cáo doanh thu và chỉ số tài chính.
 */
export function RevenuePage() {
  const { locale } = useLocale();
  const t = useAdminT();
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await withDelay(fetchRevenueData({ days }), 600);
      setData(res);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
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
    : "conic-gradient(var(--white-5) 0 100%)";

  return (
    <div className="p-6 lg:p-10 flex flex-col gap-8">
      <AdminPageHeader 
        title="Báo cáo Doanh thu"
        tagline="Dữ liệu tài chính thời gian thực từ hệ thống Pi"
        actions={
          <div className="flex items-center gap-2 bg-white/[0.03] p-1 rounded-xl border border-white/5">
            {DAYS_OPTIONS.map((d) => (
              <button key={d} 
                onClick={() => setDays(d)}
                className={`h-8 px-4 rounded-lg text-[9px] font-semibold tracking-wider transition-all duration-300 ${days === d ?"bg-primary text-white" : "text-base-content/40 hover:text-base-content/60 hover:bg-white/5"}`}>
                {d === 365 ? "Năm" : `${d} Ngày`}
              </button>
            ))}
          </div>
        }
      />

      {err && <Alert tone="danger" onDismiss={() => setErr("")}>{err}</Alert>}

      {loading && !data ? <RevenueSkeleton /> : (
        <div className="flex flex-col gap-8">
          {/* Chỉ số hiệu năng chính */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <AdminStatCard 
              label={t.mrr} 
              value={formatCurrencyUSD(revenue, locale)} 
              icon={CreditCard} 
              trend={`Doanh thu ${days} ngày`}
              tone="primary"
            />
            <AdminStatCard 
              label={t.arr} 
              value={formatCurrencyUSD(arr, locale)} 
              icon={TrendingUp} 
              trend="Tỷ lệ tăng trưởng"
            />
            <AdminStatCard 
              label="Chi phí hạ tầng" 
              value={formatCurrencyUSD(cost, locale)} 
              icon={Activity} 
              trend="Chi phí AI"
              tone="warning"
            />
            <AdminStatCard 
              label="Lợi nhuận ròng" 
              value={`${margin.toFixed(1)}%`} 
              icon={Target} 
              trend="Hiệu suất"
              tone={margin >= 0 ? "success" : "danger"}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Phân bổ danh mục (Biểu đồ tròn) */}
            <AdminCard className="p-8">
              <div className="flex items-center gap-3 mb-8">
                 <PieChart size={18} className="text-primary" />
                 <h2 className="text-[10px] font-semibold tracking-wider text-base-content/40">Phân bổ danh mục</h2>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="relative w-56 h-56 shrink-0">
                  <div className="absolute inset-0 rounded-full" style={{ background: conicGradient }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[70%] h-[70%] bg-base-300 rounded-full flex flex-col items-center justify-center border border-white/5 shadow-inner">
                      <span className="text-[8px] font-bold text-base-content/30 tracking-wider mb-1">Tổng cộng</span>
                      <AdminValue className="text-lg">{formatCurrencyUSD(revenue, locale)}</AdminValue>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 flex-1 w-full">
                  {pie.map((item) => (
                    <div key={item.sku} className="group flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.03] transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                        <div className="flex flex-col">
                           <span className="text-xs font-bold text-base-content group-hover:text-primary transition-colors">{item.name}</span>
                           <span className="text-[8px] font-bold text-base-content/20 tracking-wider">{item.sku}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-base-content">{formatCurrencyUSD(Number(item.revenue_cents || 0) / 100, locale)}</span>
                        <span className="text-[9px] font-bold text-primary">{item.pct.toFixed(0)}%</span>
                      </div>
                    </div>
                  ))}
                  {pie.length === 0 && <AdminEmptyState title="Không có dữ liệu phân bổ" description="Hiện chưa có dữ liệu danh mục." />}
                </div>
              </div>
            </AdminCard>

            {/* Nhật ký sản phẩm */}
            <section className="flex flex-col gap-4">
               <div className="flex items-center gap-3 px-2">
                  <BarChart3 size={18} className="text-primary/60" />
                  <h2 className="text-[10px] font-semibold tracking-wider text-base-content/40">Nhật ký doanh thu sản phẩm</h2>
               </div>

               <AdminTable>
                 <thead>
                    <tr className="bg-white/[0.02]">
                       <th className="py-4 px-6 text-left font-semibold tracking-wider text-[9px] opacity-40">Sản phẩm / Mã</th>
                       <th className="py-4 px-6 text-center font-semibold tracking-wider text-[9px] opacity-40">Phân loại</th>
                       <th className="py-4 px-6 text-right font-semibold tracking-wider text-[9px] opacity-40">Số lượng</th>
                       <th className="py-4 px-6 text-right font-semibold tracking-wider text-[9px] opacity-40">Doanh thu</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {products.map((item) => (
                      <tr key={item.sku} className="group hover:bg-white/[0.01] transition-colors">
                        <td className="py-5 px-6">
                           <div className="flex flex-col">
                              <span className="text-xs font-bold text-base-content group-hover:text-primary transition-colors">{item.name}</span>
                              <span className="text-[9px] font-mono font-bold text-base-content/20 tracking-tighter">{item.sku}</span>
                           </div>
                        </td>
                        <td className="py-5 px-6 text-center">
                           <AdminBadge tone="neutral">{item.type}</AdminBadge>
                        </td>
                        <td className="py-5 px-6 text-right font-mono text-xs font-bold opacity-60">
                           {item.count.toLocaleString()}
                        </td>
                        <td className="py-5 px-6 text-right">
                           <div className="flex flex-col items-end">
                              <span className="text-xs font-bold text-primary">{formatCurrencyUSD(Number(item.revenue_cents || 0) / 100, locale)}</span>
                              <span className="text-[8px] font-bold text-white/10 tracking-wider">Doanh thu gộp</span>
                           </div>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr><td colSpan="4" className="py-32"><AdminEmptyState title="Không có dữ liệu" description="Chưa phát hiện dữ liệu doanh thu trong chu kỳ này." /></td></tr>
                    )}
                 </tbody>
               </AdminTable>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

export default RevenuePage;




