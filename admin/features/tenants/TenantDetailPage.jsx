import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { withDelay } from "@/_shared/api/api-client";
import { formatDate } from "@/_shared/lib/translations";
import { Alert, Button, Input, IconButton } from "@/_shared/components/ui";
import { toast } from "sonner";
import {
  ArrowLeft, Building2, Save, Zap, Globe, Key, ShieldCheck,
  Clock, TrendingUp, AlertCircle, Plus,
} from "lucide-react";

import {
  AdminPageHeader,
  AdminCard,
  AdminBadge,
  AdminStatCard,
  FormField,
} from "../../_shared/components";

import { TenantDetailSkeleton } from "./skeleton";
import { tenantsApi } from "./api";
import "./TenantDetailPage.css";

const TIERS = ["free", "pro", "max", "enterprise"];
const STATUSES = ["active", "suspended", "pending"];
const RECHARGE_REASONS = [
  { value: "admin_recharge", label: "Admin nạp tay" },
  { value: "bonus",          label: "Bonus / promotion" },
  { value: "refund",         label: "Refund" },
  { value: "purchase",       label: "Customer purchase" },
];

function tierTone(tier) {
  return { enterprise: "warning", max: "info", pro: "primary" }[tier] || "neutral";
}
function statusTone(s) {
  return { active: "success", suspended: "error", pending: "warning" }[s] || "neutral";
}
function formatTokens(n) {
  if (n === -1) return "Không giới hạn";
  if (!n && n !== 0) return "-";
  return new Intl.NumberFormat("vi-VN").format(n);
}

export function TenantDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Edit state
  const [tier, setTier] = useState("free");
  const [status, setStatus] = useState("active");
  const [saving, setSaving] = useState(false);

  // Recharge state
  const [rechargeOpen, setRechargeOpen] = useState(false);
  const [rechargeDelta, setRechargeDelta] = useState("");
  const [rechargeReason, setRechargeReason] = useState("admin_recharge");
  const [rechargeNote, setRechargeNote] = useState("");
  const [recharging, setRecharging] = useState(false);

  const fetchTenant = useCallback(async () => {
    setLoading(true);
    try {
      const t = await withDelay(tenantsApi.get(id), 400);
      setTenant(t);
      setTier(t.tier);
      setStatus(t.status);
      setErr("");
    } catch (e) {
      console.error("[tenant detail] failed", e);
      setErr("Không tải được tenant. Có thể đã bị xoá hoặc backend lỗi.");
      setTenant(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchTenant(); }, [fetchTenant]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await tenantsApi.update(id, { tier, status });
      setTenant(updated);
      toast.success("Đã cập nhật tenant");
    } catch (e) {
      toast.error(e?.message || "Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleRecharge = async () => {
    const delta = parseInt(rechargeDelta, 10);
    if (!delta || delta < 1) {
      toast.error("Nhập số token > 0");
      return;
    }
    setRecharging(true);
    try {
      const res = await tenantsApi.recharge(id, {
        delta,
        reason: rechargeReason,
        note: rechargeNote,
      });
      toast.success(`Đã nạp ${formatTokens(delta)} token. Số dư mới: ${formatTokens(res.balance)}`);
      setRechargeOpen(false);
      setRechargeDelta("");
      setRechargeNote("");
      await fetchTenant();
    } catch (e) {
      toast.error(e?.message || "Nạp token thất bại");
    } finally {
      setRecharging(false);
    }
  };

  if (loading) return <TenantDetailSkeleton />;
  if (!tenant) {
    return (
      <div className="pi-tenant-detail flex flex-col gap-6">
        <AdminPageHeader
          icon={Building2}
          title="Tenant không tồn tại"
          actions={<Link to="/admin/tenants"><Button variant="ghost"><ArrowLeft className="w-4 h-4" /> Quay lại</Button></Link>}
        />
        {err && <Alert tone="error">{err}</Alert>}
      </div>
    );
  }

  const dirty = tier !== tenant.tier || status !== tenant.status;

  return (
    <div className="pi-tenant-detail flex flex-col gap-8">
      <AdminPageHeader
        icon={Building2}
        title={tenant.domain}
        description={tenant.site_url || "Không có site URL"}
        actions={
          <Link to="/admin/tenants">
            <Button variant="ghost"><ArrowLeft className="w-4 h-4" /> Quay lại</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <AdminStatCard icon={Zap} label="Số dư token" value={formatTokens(tenant.tokens_balance)} tone="info" />
        <AdminStatCard icon={TrendingUp} label="Đã dùng tháng này" value={formatTokens(tenant.tokens_used_this_month)} tone="warning" />
        <AdminStatCard icon={ShieldCheck} label="Quota/tháng" value={formatTokens(tenant.tokens_monthly_quota)} tone="primary" />
        <AdminStatCard icon={Clock} label="Last seen" value={tenant.last_seen_at ? formatDate(tenant.last_seen_at) : "—"} tone="neutral" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" /> Thông tin định danh
          </h3>
          <div className="flex flex-col gap-3 text-sm">
            <Row label="Tenant ID"><code>{tenant.id}</code></Row>
            <Row label="Domain"><code>{tenant.domain}</code></Row>
            <Row label="Site URL">{tenant.site_url || <span className="opacity-40">—</span>}</Row>
            <Row label="License key"><code className="text-xs">{tenant.license_key || <span className="opacity-40">—</span>}</code></Row>
            <Row label="Activated"><span className="opacity-70">{tenant.activated_at ? formatDate(tenant.activated_at) : "Chưa"}</span></Row>
            <Row label="Last seen"><span className="opacity-70">{tenant.last_seen_at ? formatDate(tenant.last_seen_at) : "Chưa"}</span></Row>
            <Row label="Features">
              <div className="flex flex-wrap gap-1.5">
                {(tenant.features || []).length === 0
                  ? <span className="opacity-40">—</span>
                  : tenant.features.map((f) => (
                      <AdminBadge key={f} tone="neutral" size="sm">{f}</AdminBadge>
                    ))}
              </div>
            </Row>
          </div>
        </AdminCard>

        <AdminCard>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" /> Quản trị
          </h3>
          <div className="flex flex-col gap-4">
            <FormField label="Tier">
              <select
                className="h-11 px-4 rounded-xl bg-base-200/30 border border-base-content/10"
                value={tier}
                onChange={(e) => setTier(e.target.value)}
                disabled={saving}
              >
                {TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <p className="text-xs opacity-50 mt-1">
                Đổi tier sẽ reset feature list về default tier mới (nếu features không được override).
              </p>
            </FormField>

            <FormField label="Status">
              <select
                className="h-11 px-4 rounded-xl bg-base-200/30 border border-base-content/10"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={saving}
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>

            <div className="flex items-center gap-2 pt-2">
              <Button variant="primary" onClick={handleSave} disabled={!dirty || saving}>
                <Save className="w-4 h-4" />
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
              <div className="flex items-center gap-2 ml-2">
                <AdminBadge tone={tierTone(tenant.tier)}>{tenant.tier}</AdminBadge>
                <AdminBadge tone={statusTone(tenant.status)}>{tenant.status}</AdminBadge>
              </div>
            </div>
          </div>
        </AdminCard>
      </div>

      <AdminCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" /> Token wallet
          </h3>
          <Button
            variant={rechargeOpen ? "ghost" : "primary"}
            size="sm"
            onClick={() => setRechargeOpen((o) => !o)}
          >
            {rechargeOpen ? "Hủy" : <><Plus className="w-4 h-4" /> Nạp token</>}
          </Button>
        </div>

        {!rechargeOpen ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider opacity-50 mb-1">Số dư</p>
              <p className="text-2xl font-bold">{formatTokens(tenant.tokens_balance)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider opacity-50 mb-1">Đã dùng tháng này</p>
              <p className="text-2xl font-bold">{formatTokens(tenant.tokens_used_this_month)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider opacity-50 mb-1">Quota/tháng</p>
              <p className="text-2xl font-bold">{formatTokens(tenant.tokens_monthly_quota)}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <FormField label="Số token nạp" required>
              <Input
                type="number"
                min="1"
                max="1000000"
                placeholder="VD: 100000"
                value={rechargeDelta}
                onChange={(e) => setRechargeDelta(e.target.value)}
                disabled={recharging}
              />
            </FormField>
            <FormField label="Lý do">
              <select
                className="h-11 px-4 rounded-xl bg-base-200/30 border border-base-content/10"
                value={rechargeReason}
                onChange={(e) => setRechargeReason(e.target.value)}
                disabled={recharging}
              >
                {RECHARGE_REASONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </FormField>
            <FormField label="Ghi chú (optional)">
              <Input
                placeholder="VD: refund cho ticket #123"
                value={rechargeNote}
                onChange={(e) => setRechargeNote(e.target.value)}
                disabled={recharging}
              />
            </FormField>
            <div className="flex items-center gap-2 pt-2">
              <Button variant="primary" onClick={handleRecharge} disabled={recharging}>
                <Zap className="w-4 h-4" />
                {recharging ? "Đang nạp..." : "Xác nhận nạp"}
              </Button>
              <Button variant="ghost" onClick={() => setRechargeOpen(false)} disabled={recharging}>
                Hủy
              </Button>
            </div>
          </div>
        )}
      </AdminCard>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-base-content/5 last:border-b-0">
      <span className="text-xs uppercase tracking-wider opacity-50 pt-0.5">{label}</span>
      <div className="text-right">{children}</div>
    </div>
  );
}

export default TenantDetailPage;
