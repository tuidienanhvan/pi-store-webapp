import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { withDelay } from "@/_shared/api/api-client";
import { formatDate } from "@/_shared/lib/translations";
import { Alert, Button, Input } from "@/_shared/components/ui";
import {
  Search, BookText, TrendingUp, TrendingDown, Hash, Plus, Minus,
  Filter, X, ChevronLeft, ChevronRight, Building2,
} from "lucide-react";

import {
  AdminPageHeader,
  AdminBadge,
  AdminTable,
  AdminEmptyState,
  AdminStatCard,
  AdminFilterBar,
} from "../../_shared/components";

import { TokenLedgerSkeleton } from "./skeleton";
import { tokenLedgerApi } from "./api";
import "./TokenLedgerPage.css";

const REASON_OPTIONS = [
  { value: "",                label: "Tất cả lý do" },
  { value: "admin_recharge",  label: "Admin nạp tay" },
  { value: "bonus",           label: "Bonus / promotion" },
  { value: "refund",          label: "Refund" },
  { value: "purchase",        label: "Customer purchase" },
  { value: "adjust",          label: "Admin adjust" },
];

const SIGN_OPTIONS = [
  { value: "",       label: "Tất cả giao dịch" },
  { value: "credit", label: "Chỉ cộng (+)" },
  { value: "debit",  label: "Chỉ trừ (−)" },
];

const PAGE_SIZE = 50;

function reasonTone(reason) {
  return {
    admin_recharge: "primary",
    bonus:          "success",
    refund:         "warning",
    purchase:       "info",
    adjust:         "neutral",
  }[reason] || "neutral";
}

function formatTokens(n) {
  if (!n && n !== 0) return "-";
  const abs = Math.abs(n);
  const sign = n < 0 ? "−" : (n > 0 ? "+" : "");
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000)     return `${sign}${(abs / 1_000).toFixed(1)}K`;
  return `${sign}${abs}`;
}

function formatTokensRaw(n) {
  if (!n && n !== 0) return "-";
  return new Intl.NumberFormat("vi-VN").format(Math.abs(n));
}

/**
 * TokenLedgerPage — full audit log of token movements per tenant.
 * Backend: GET /v1/admin/tokens/ledger
 */
export function TokenLedgerPage() {
  const [data, setData] = useState({ items: [], summary: {}, total: 0 });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Filters
  const [tenantId, setTenantId] = useState("");
  const [reason, setReason] = useState("");
  const [deltaSign, setDeltaSign] = useState("");
  const [q, setQ] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [offset, setOffset] = useState(0);

  const fetchLedger = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: PAGE_SIZE, offset };
      if (tenantId) params.tenant_id = tenantId;
      if (reason) params.reason = reason;
      if (deltaSign) params.delta_sign = deltaSign;
      if (q) params.q = q;
      if (dateFrom) params.date_from = dateFrom;
      if (dateTo) params.date_to = dateTo;

      const res = await withDelay(tokenLedgerApi.list(params), 400);
      setData(res || { items: [], summary: {}, total: 0 });
      setErr("");
    } catch (e) {
      console.error("[token-ledger] fetch failed", e);
      setErr("Không tải được sổ cái. Backend có lên không?");
      setData({ items: [], summary: {}, total: 0 });
    } finally {
      setLoading(false);
    }
  }, [tenantId, reason, deltaSign, q, dateFrom, dateTo, offset]);

  useEffect(() => { fetchLedger(); }, [fetchLedger]);

  // Reset offset when filters change (not pagination itself)
  useEffect(() => { setOffset(0); }, [tenantId, reason, deltaSign, q, dateFrom, dateTo]);

  const clearFilters = () => {
    setTenantId(""); setReason(""); setDeltaSign("");
    setQ(""); setDateFrom(""); setDateTo(""); setOffset(0);
  };

  const hasFilters = useMemo(
    () => !!(tenantId || reason || deltaSign || q || dateFrom || dateTo),
    [tenantId, reason, deltaSign, q, dateFrom, dateTo],
  );

  const items = data.items || [];
  const summary = data.summary || {};
  const total = data.total || 0;
  const page = Math.floor(offset / PAGE_SIZE) + 1;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  if (loading && items.length === 0) return <TokenLedgerSkeleton />;

  return (
    <div className="pi-token-ledger flex flex-col gap-8">
      <AdminPageHeader
        icon={BookText}
        title="Sổ cái Token"
        description="Toàn bộ giao dịch cộng/trừ token theo tenant — recharge, bonus, refund, admin adjust. Lọc theo tenant/lý do/thời gian."
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <AdminStatCard
          icon={TrendingUp}
          label="Tổng cộng (+)"
          value={formatTokens(summary.total_credits || 0)}
          tone="success"
        />
        <AdminStatCard
          icon={TrendingDown}
          label="Tổng trừ (−)"
          value={formatTokens(-(summary.total_debits || 0))}
          tone="error"
        />
        <AdminStatCard
          icon={Hash}
          label="Net (cộng − trừ)"
          value={formatTokens(summary.net || 0)}
          tone={(summary.net || 0) >= 0 ? "info" : "warning"}
        />
        <AdminStatCard
          icon={BookText}
          label="Tổng giao dịch"
          value={new Intl.NumberFormat("vi-VN").format(summary.transaction_count || 0)}
          tone="primary"
        />
      </div>

      <AdminFilterBar>
        <Input
          icon={Search}
          placeholder="Tìm trong ghi chú (note)..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Input
          icon={Building2}
          placeholder="Tenant ID (0 = all)"
          type="number"
          min="0"
          value={tenantId}
          onChange={(e) => setTenantId(e.target.value)}
        />
        <select
          className="h-10 px-3 rounded-xl bg-base-200/30 border border-base-content/10 text-sm"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        >
          {REASON_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select
          className="h-10 px-3 rounded-xl bg-base-200/30 border border-base-content/10 text-sm"
          value={deltaSign}
          onChange={(e) => setDeltaSign(e.target.value)}
        >
          {SIGN_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <Input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          aria-label="Từ ngày"
        />
        <Input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          aria-label="Đến ngày"
        />
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="w-4 h-4" /> Xóa lọc
          </Button>
        )}
      </AdminFilterBar>

      {err && <Alert tone="error">{err}</Alert>}

      {items.length === 0 && !loading ? (
        <AdminEmptyState
          icon={Filter}
          title={hasFilters ? "Không có giao dịch khớp lọc" : "Chưa có giao dịch token"}
          description={hasFilters
            ? "Thử bỏ bớt filter hoặc mở rộng khoảng thời gian."
            : "Khi admin nạp token cho tenant hoặc customer mua, giao dịch sẽ xuất hiện ở đây."}
          action={hasFilters
            ? <Button variant="primary" onClick={clearFilters}><X className="w-4 h-4" /> Xóa lọc</Button>
            : null}
        />
      ) : (
        <>
          <AdminTable
            columns={[
              { key: "timestamp", label: "Thời gian",  width: "18%" },
              { key: "tenant",    label: "Tenant",     width: "22%" },
              { key: "delta",     label: "Delta",      width: "14%", align: "right" },
              { key: "reason",    label: "Lý do",      width: "14%" },
              { key: "note",      label: "Ghi chú",    width: "32%" },
            ]}
            rows={items.map((row) => ({
              id: row.id,
              cells: {
                timestamp: (
                  <span className="text-xs opacity-70 font-mono">{formatDate(row.timestamp)}</span>
                ),
                tenant: (
                  <Link
                    to={`/admin/tenants/${row.tenant_id}`}
                    className="flex items-center gap-2 hover:text-primary"
                  >
                    <Building2 className="w-4 h-4 opacity-50" />
                    <span className="font-semibold">{row.tenant_domain || `#${row.tenant_id}`}</span>
                  </Link>
                ),
                delta: (
                  <span className={`font-mono font-bold flex items-center gap-1 justify-end ${
                    row.delta > 0 ? "text-success" : row.delta < 0 ? "text-error" : "opacity-70"
                  }`}>
                    {row.delta > 0 ? <Plus className="w-3 h-3" /> : row.delta < 0 ? <Minus className="w-3 h-3" /> : null}
                    {formatTokensRaw(row.delta)}
                  </span>
                ),
                reason: <AdminBadge tone={reasonTone(row.reason)} size="sm">{row.reason}</AdminBadge>,
                note:   row.note ? <span className="text-xs">{row.note}</span> : <span className="opacity-40">—</span>,
              },
            }))}
          />

          {/* Pagination */}
          <div className="flex items-center justify-between pt-4 border-t border-base-content/5">
            <p className="text-xs opacity-50">
              Hiển thị <strong>{items.length}</strong> / <strong>{total}</strong> giao dịch (trang {page}/{totalPages})
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={offset === 0 || loading}
                onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
              >
                <ChevronLeft className="w-4 h-4" /> Trang trước
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={offset + PAGE_SIZE >= total || loading}
                onClick={() => setOffset(offset + PAGE_SIZE)}
              >
                Trang sau <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default TokenLedgerPage;
