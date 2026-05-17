import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { withDelay } from "@/_shared/api/api-client";
import { useAdminT, formatDate } from "@/_shared/lib/translations";
import { Alert, Input, Button, IconButton } from "@/_shared/components/ui";
import {
  Search, Building2, Plus, ChevronRight, Activity,
  CheckCircle2, AlertCircle, Globe,
} from "lucide-react";

import {
  AdminPageHeader,
  AdminBadge,
  AdminTable,
  AdminEmptyState,
  AdminStatCard,
  AdminValue,
  AdminFilterBar,
} from "../../_shared/components";

import { TenantsPageSkeleton } from "./skeleton";
import { tenantsApi } from "./api";
import "./TenantsPage.css";

const TIER_FILTERS = [
  { value: "", label: "Tất cả tier" },
  { value: "free", label: "Free" },
  { value: "pro", label: "Pro" },
  { value: "max", label: "Max" },
  { value: "enterprise", label: "Enterprise" },
];

const STATUS_FILTERS = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
  { value: "pending", label: "Pending" },
];

function tierTone(tier) {
  switch (tier) {
    case "enterprise": return "warning";
    case "max":        return "info";
    case "pro":        return "primary";
    default:           return "neutral";
  }
}

function statusTone(status) {
  switch (status) {
    case "active":    return "success";
    case "suspended": return "error";
    case "pending":   return "warning";
    default:          return "neutral";
  }
}

function formatTokens(n) {
  if (n === -1) return "∞";
  if (!n && n !== 0) return "-";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

/**
 * TenantsPage — SaaS customer management.
 * Lists tenants from /v1/admin/saas/tenants with search, tier, status filters.
 */
export function TenantsPage() {
  // useAdminT reserved for future i18n; not used yet — call once to avoid hook lint warning.
  useAdminT();

  const [tenants, setTenants] = useState([]);
  const [search, setSearch] = useState("");
  const [tier, setTier] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const fetchTenants = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.q = search;
      if (tier) params.tier = tier;
      if (status) params.status = status;
      const items = await withDelay(tenantsApi.list(params), 400);
      setTenants(Array.isArray(items) ? items : []);
      setErr("");
    } catch (e) {
      console.error("[tenants] fetch failed", e);
      setErr("Không thể tải danh sách khách hàng. Backend có lên không?");
      setTenants([]);
    } finally {
      setLoading(false);
    }
  }, [search, tier, status]);

  useEffect(() => { fetchTenants(); }, [fetchTenants]);

  const stats = useMemo(() => {
    const total = tenants.length;
    const active = tenants.filter((t) => t.status === "active").length;
    const suspended = tenants.filter((t) => t.status === "suspended").length;
    const totalBalance = tenants.reduce((sum, t) => sum + (t.tokens_balance || 0), 0);
    return { total, active, suspended, totalBalance };
  }, [tenants]);

  if (loading && tenants.length === 0) return <TenantsPageSkeleton />;

  return (
    <div className="pi-tenants-page flex flex-col gap-8">
      <AdminPageHeader
        icon={Building2}
        title="Khách hàng (SaaS Tenants)"
        description="Quản lý site/license/tier/token của khách hàng đã activate plugin pi-api."
        actions={
          <Link to="/admin/tenants/new">
            <Button variant="primary" size="md">
              <Plus className="w-4 h-4" />
              Thêm khách hàng
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <AdminStatCard icon={Building2} label="Tổng tenant" value={stats.total} tone="primary" />
        <AdminStatCard icon={CheckCircle2} label="Đang hoạt động" value={stats.active} tone="success" />
        <AdminStatCard icon={AlertCircle} label="Đình chỉ" value={stats.suspended} tone="error" />
        <AdminStatCard icon={Activity} label="Tổng số dư token" value={formatTokens(stats.totalBalance)} tone="info" />
      </div>

      <AdminFilterBar>
        <Input
          icon={Search}
          placeholder="Tìm domain hoặc license key..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="h-10 px-3 rounded-xl bg-base-200/30 border border-base-content/10 text-sm"
          value={tier}
          onChange={(e) => setTier(e.target.value)}
        >
          {TIER_FILTERS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>
        <select
          className="h-10 px-3 rounded-xl bg-base-200/30 border border-base-content/10 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {STATUS_FILTERS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>
      </AdminFilterBar>

      {err && <Alert tone="error">{err}</Alert>}

      {tenants.length === 0 && !loading ? (
        <AdminEmptyState
          icon={Building2}
          title="Chưa có khách hàng"
          description="Khi customer cài plugin pi-api + activate license, tenant sẽ tự xuất hiện ở đây. Anh cũng có thể tạo thủ công."
          action={
            <Link to="/admin/tenants/new">
              <Button variant="primary">
                <Plus className="w-4 h-4" /> Thêm khách hàng
              </Button>
            </Link>
          }
        />
      ) : (
        <AdminTable
          columns={[
            { key: "domain",       label: "Domain",  width: "26%" },
            { key: "license",      label: "License", width: "20%" },
            { key: "tier",         label: "Tier",    width: "10%" },
            { key: "status",       label: "Trạng thái", width: "12%" },
            { key: "tokens",       label: "Token",   width: "14%" },
            { key: "last_seen",    label: "Last seen", width: "12%" },
            { key: "actions",      label: "",        width: "6%", align: "right" },
          ]}
          rows={tenants.map((t) => ({
            id: t.id,
            cells: {
              domain: (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Globe className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <Link to={`/admin/tenants/${t.id}`} className="font-semibold text-base-content hover:text-primary">
                      {t.domain}
                    </Link>
                    <span className="text-xs opacity-50">{t.site_url || "—"}</span>
                  </div>
                </div>
              ),
              license: <code className="text-xs opacity-70">{t.license_key || "—"}</code>,
              tier:    <AdminBadge tone={tierTone(t.tier)}>{t.tier}</AdminBadge>,
              status:  <AdminBadge tone={statusTone(t.status)}>{t.status}</AdminBadge>,
              tokens: (
                <AdminValue
                  value={formatTokens(t.tokens_balance)}
                  suffix={t.tokens_monthly_quota ? `/ ${formatTokens(t.tokens_monthly_quota)}` : ""}
                />
              ),
              last_seen: t.last_seen_at ? formatDate(t.last_seen_at) : <span className="opacity-40">Chưa</span>,
              actions: (
                <Link to={`/admin/tenants/${t.id}`}>
                  <IconButton size="sm" variant="ghost" aria-label="Mở chi tiết">
                    <ChevronRight className="w-4 h-4" />
                  </IconButton>
                </Link>
              ),
            },
          }))}
        />
      )}
    </div>
  );
}

export default TenantsPage;
