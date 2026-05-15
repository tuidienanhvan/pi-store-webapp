import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { withDelay } from "@/_shared/api/api-client";
import { useAdminT, formatCurrencyUSD, formatNumber } from "@/_shared/lib/translations";
import { Button } from "@/_shared/components/ui";
import {
  Plus,
  RefreshCw,
  AlertTriangle,
  Shield,
  Calendar,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Cpu,
  Database,
  Globe,
  TrendingUp,
  Key,
  Zap,
  DollarSign,
} from "lucide-react";

import { AdminOverviewSkeleton } from "@/_shared/components/skeletons/AdminOverviewSkeleton";
import {
  AdminPageHeader,
  AdminCard,
  AdminBadge,
} from "../../_shared/components";

import { fetchOverviewData } from "./api";

/* ─────────────────────────────────────────────────────────────
 * Compact KPI tile — Linear / Vercel / shadcn density.
 * Một dòng số chính, một dòng phụ. Không hero, không glow.
 * ──────────────────────────────────────────────────────────── */
function Kpi({ to, icon: Icon, label, value, delta, deltaLabel, hint }) {
  const positive = (delta ?? 0) >= 0;
  const body = (
    <AdminCard className="p-5 h-full flex flex-col gap-3 hover:border-primary/30 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-base-content/50">{label}</span>
        {Icon && <Icon size={14} className="text-base-content/30" />}
      </div>
      <div className="text-2xl font-semibold tracking-tight tabular-nums">{value}</div>
      <div className="flex items-center justify-between text-xs">
        {delta !== undefined ? (
          <span className={`inline-flex items-center gap-1 font-medium ${positive ?"text-success" : "text-danger"}`}>
            {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(delta)}%
          </span>
        ) : <span />}
        {(hint || deltaLabel) && (
          <span className="text-base-content/40">{hint || deltaLabel}</span>
        )}
      </div>
    </AdminCard>
  );
  return to ? <Link to={to} className="block h-full">{body}</Link> : body;
}

function ServiceRow({ icon: Icon, label, status }) {
  const healthy = status === "healthy";
  return (
    <div className="flex items-center gap-3 py-1.5">
      <Icon size={13} className="text-base-content/40 shrink-0" />
      <span className="text-xs text-base-content/70 flex-1 truncate">{label}</span>
      <span className={`w-1.5 h-1.5 rounded-full ${healthy ?"bg-success" : "bg-danger"}`} />
      <span className={`text-[11px] font-medium tabular-nums w-16 text-right ${healthy ?"text-success" : "text-danger"}`}>
        {healthy ? "online" : "offline"}
      </span>
    </div>
  );
}

export function OverviewPage() {
  const t = useAdminT();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await withDelay(fetchOverviewData(), 600);
      setData(res);
      setError("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (error) {
    return (
      <div className="p-6 lg:p-8">
        <AdminCard className="p-10 border-danger/30 bg-danger/5 text-center">
          <AlertTriangle size={32} className="text-danger mx-auto mb-3" />
          <h2 className="text-lg font-semibold mb-1">Lỗi kết nối hệ thống</h2>
          <p className="text-sm text-base-content/60 mb-6">{error}</p>
          <Button onClick={load} variant="primary">Thử lại</Button>
        </AdminCard>
      </div>
    );
  }

  if (loading && !data) return <AdminOverviewSkeleton />;

  const tokenPctOfCap = Math.min(100, Math.round((data.tokens.projected_month_end / Math.max(data.tokens.spent_30d, 1)) * 100));

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Tổng quan"
        tagline="Tình trạng hạ tầng và kinh doanh"
        actions={
          <>
            <Button as={Link} to="/admin/licenses" variant="primary" size="sm">
              <Plus size={14} className="mr-1.5" /> Cấp giấy phép
            </Button>
            <Button variant="ghost" size="sm" onClick={load} aria-label="Tải lại">
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </Button>
          </>
        }
      />

      {/* KPI row — 4 thẻ gọn */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi
          to="/admin/revenue"
          icon={DollarSign}
          label="Doanh thu 30 ngày"
          value={formatCurrencyUSD(data.revenue["30d"])}
          delta={data.revenue.mom_growth}
          deltaLabel="vs tháng trước"
        />
        <Kpi
          to="/admin/revenue"
          icon={TrendingUp}
          label="Doanh thu YTD"
          value={formatCurrencyUSD(data.revenue["ytd"])}
          hint={`90d ${formatCurrencyUSD(data.revenue["90d"])}`}
        />
        <Kpi
          to="/admin/licenses"
          icon={Key}
          label="Giấy phép hoạt động"
          value={formatNumber(data.licenses.active)}
          hint={`+${data.licenses.new_this_week} tuần này`}
        />
        <Kpi
          to="/admin/usage"
          icon={Zap}
          label="Token đã dùng 30d"
          value={`${(data.tokens.spent_30d / 1_000_000).toFixed(1)}M`}
          hint={`dự báo ${(data.tokens.projected_month_end / 1_000_000).toFixed(1)}M`}
        />
      </div>

      {/* Row 2: system status + alerts + expiring */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* System status */}
        <AdminCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Trạng thái hệ thống</h3>
            <AdminBadge tone="success">Hoạt động</AdminBadge>
          </div>
          <div className="flex flex-col divide-y divide-white/5">
            <ServiceRow icon={Globe} label="API Node" status={data.system.api} />
            <ServiceRow icon={Cpu} label="Worker Node" status={data.system.worker} />
            <ServiceRow icon={Database} label="Database" status={data.system.db} />
            <ServiceRow icon={Activity} label="Cache / Redis" status={data.system.redis} />
          </div>
        </AdminCard>

        {/* Alerts */}
        <AdminCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <AlertTriangle size={14} className="text-warning" /> Cảnh báo
            </h3>
            <span className="text-xs text-base-content/40 tabular-nums">{data.alerts.length}</span>
          </div>
          {data.alerts.length === 0 ? (
            <div className="flex items-center gap-3 py-6 text-sm text-base-content/50">
              <Shield size={16} className="text-success" />
              Không có sự cố nghiêm trọng
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {data.alerts.map(a => (
                <li key={a.id} className="flex items-start gap-2 p-2.5 rounded-md bg-danger/5 border border-danger/15 text-sm text-danger">
                  <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                  <span className="leading-snug">{a.text}</span>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>

        {/* Token capacity meter */}
        <AdminCard className="p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Dung lượng token</h3>
            <Link to="/admin/usage" className="text-xs text-primary hover:underline">Chi tiết</Link>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-semibold tabular-nums">{tokenPctOfCap}%</span>
            <span className="text-xs text-base-content/40">dự báo cuối tháng</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-primary transition-all duration-700" style={{ width: `${tokenPctOfCap}%` }} />
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs mt-auto">
            <div>
              <div className="text-base-content/40">Đã dùng</div>
              <div className="font-medium tabular-nums">{(data.tokens.spent_30d / 1_000_000).toFixed(2)}M</div>
            </div>
            <div>
              <div className="text-base-content/40">Dự báo</div>
              <div className="font-medium tabular-nums">{(data.tokens.projected_month_end / 1_000_000).toFixed(2)}M</div>
            </div>
          </div>
        </AdminCard>
      </div>

      {/* Expiring licenses */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Calendar size={14} className="text-base-content/50" /> Giấy phép sắp hết hạn
          </h2>
          <Link to="/admin/licenses" className="text-xs text-primary hover:underline">
            Xem tất cả <ArrowRight size={11} className="inline" />
          </Link>
        </div>
        <AdminCard className="overflow-hidden">
          {data.expiringLicenses.length === 0 ? (
            <div className="py-10 text-center text-sm text-base-content/40">
              Không có giấy phép sắp hết hạn
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-base-content/50 bg-white/[0.02]">
                  <th className="font-medium text-left py-2.5 px-4">Người dùng</th>
                  <th className="font-medium text-left py-2.5 px-4">Gói</th>
                  <th className="font-medium text-right py-2.5 px-4">Còn lại</th>
                </tr>
              </thead>
              <tbody>
                {data.expiringLicenses.map(l => (
                  <tr key={l.id} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="py-2.5 px-4 font-medium">{l.email}</td>
                    <td className="py-2.5 px-4"><AdminBadge tone="brand">{l.tier}</AdminBadge></td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-danger font-medium">{l.daysLeft} ngày</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </AdminCard>
      </section>

      {/* Provider chips */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Nhà cung cấp AI</h2>
          <Link to="/admin/providers" className="text-xs text-primary hover:underline">
            Quản lý <ArrowRight size={11} className="inline" />
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.providers.map(p => {
            const tone = p.status === "healthy" ? "bg-success" : p.status === "degraded" ? "bg-warning" : "bg-danger";
            return (
              <div key={p.name} className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/5 bg-base-300/40 text-xs">
                <span className={`w-1.5 h-1.5 rounded-full ${tone}`} />
                <span className="font-medium text-base-content/80">{p.name}</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default OverviewPage;
