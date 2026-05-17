import React, { useEffect, useState, useCallback, useMemo } from "react";
import { withDelay, api } from "@/_shared/api/api-client";
import { formatDate } from "@/_shared/lib/translations";
import { Alert, Button, Input, IconButton } from "@/_shared/components/ui";
import {
  Search, Activity, AlertTriangle, Zap, Clock, X,
  ChevronLeft, ChevronRight, Filter, ChevronDown, ChevronRight as ChevronRightIcon,
} from "lucide-react";

import {
  AdminPageHeader,
  AdminBadge,
  AdminTable,
  AdminEmptyState,
  AdminStatCard,
  AdminFilterBar,
  AdminCard,
} from "../../_shared/components";

import "./UsageExplorerPage.css";

const SOURCE_OPTIONS = [
  { value: "",          label: "Tất cả source" },
  { value: "seo",       label: "SEO (audit, schema, generate)" },
  { value: "chat",      label: "Chat (rag, reply)" },
  { value: "content",   label: "Content (post)" },
  { value: "leads",     label: "Leads" },
  { value: "analytics", label: "Analytics" },
];

const STATUS_OPTIONS = [
  { value: "",             label: "Tất cả trạng thái" },
  { value: "success",      label: "Success" },
  { value: "error",        label: "Error" },
  { value: "rate_limited", label: "Rate limited" },
];

const DIMENSION_OPTIONS = [
  { value: "source",   label: "Theo Source (seo/chat/...)" },
  { value: "license",  label: "Theo License (khách)" },
  { value: "endpoint", label: "Theo Endpoint" },
  { value: "status",   label: "Theo Status" },
];

const PAGE_SIZE = 50;

function statusTone(s) {
  return { success: "success", error: "error", rate_limited: "warning" }[s] || "neutral";
}

function sourceTone(s) {
  return {
    seo:       "primary",
    chat:      "info",
    content:   "warning",
    leads:     "success",
    analytics: "neutral",
  }[s] || "neutral";
}

function formatNum(n) {
  if (!n && n !== 0) return "-";
  return new Intl.NumberFormat("vi-VN").format(n);
}

function formatTokensShort(n) {
  if (!n && n !== 0) return "0";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function formatCents(c) {
  if (!c && c !== 0) return "-";
  return `$${(c / 100).toFixed(4)}`;
}

/**
 * UsageExplorerPage — drilldown explorer for /admin/usage/events + /aggregate.
 * Two tabs: Events (per-request log) + Aggregates (pivot by dimension).
 */
export function UsageExplorerPage() {
  const [tab, setTab] = useState("events");

  return (
    <div className="pi-usage-explorer flex flex-col gap-6">
      <AdminPageHeader
        icon={Activity}
        title="Khám phá Usage"
        description="Drilldown từng request AI: license/source/status/error. Hoặc pivot theo dimension để tìm hotspot."
      />

      {/* Tab nav */}
      <div className="flex items-center gap-1 border-b border-base-content/10">
        <TabButton active={tab === "events"} onClick={() => setTab("events")}>
          <Activity className="w-4 h-4" /> Events
        </TabButton>
        <TabButton active={tab === "aggregate"} onClick={() => setTab("aggregate")}>
          <Filter className="w-4 h-4" /> Aggregate
        </TabButton>
      </div>

      {tab === "events" ? <EventsTab /> : <AggregateTab />}
    </div>
  );
}

function TabButton({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 ${
        active
          ? "border-primary text-primary"
          : "border-transparent text-base-content/60 hover:text-base-content"
      }`}
    >
      {children}
    </button>
  );
}

/* ─── Events tab ─────────────────────────────────────────── */
function EventsTab() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  // Filters
  const [licenseId, setLicenseId] = useState("");
  const [source, setSource] = useState("");
  const [status, setStatus] = useState("");
  const [endpoint, setEndpoint] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [offset, setOffset] = useState(0);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: PAGE_SIZE, offset };
      if (licenseId) params.license_id = licenseId;
      if (source) params.source = source;
      if (status) params.status = status;
      if (endpoint) params.endpoint = endpoint;
      if (dateFrom) params.date_from = dateFrom;
      if (dateTo) params.date_to = dateTo;

      const res = await withDelay(api.admin.usageEvents(params), 300);
      setItems(res.items || []);
      setTotal(res.total || 0);
      setErr("");
    } catch (e) {
      console.error("[usage events] fetch failed", e);
      setErr("Không tải được events. Backend có lên không?");
      setItems([]); setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [licenseId, source, status, endpoint, dateFrom, dateTo, offset]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);
  useEffect(() => { setOffset(0); }, [licenseId, source, status, endpoint, dateFrom, dateTo]);

  const clearFilters = () => {
    setLicenseId(""); setSource(""); setStatus("");
    setEndpoint(""); setDateFrom(""); setDateTo(""); setOffset(0);
  };

  const hasFilters = !!(licenseId || source || status || endpoint || dateFrom || dateTo);
  const page = Math.floor(offset / PAGE_SIZE) + 1;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Quick stats from the visible page
  const stats = useMemo(() => {
    const success = items.filter((e) => e.status === "success").length;
    const errors = items.filter((e) => e.status === "error").length;
    const tokens = items.reduce((s, e) => s + (e.tokens_total || 0), 0);
    const avgLatency = items.length
      ? Math.round(items.reduce((s, e) => s + (e.latency_ms || 0), 0) / items.length)
      : 0;
    return { success, errors, tokens, avgLatency };
  }, [items]);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <AdminStatCard icon={Activity} label="Hiển thị" value={`${items.length}/${formatNum(total)}`} tone="primary" />
        <AdminStatCard icon={Zap} label="Tokens (page)" value={formatTokensShort(stats.tokens)} tone="info" />
        <AdminStatCard icon={AlertTriangle} label="Errors (page)" value={stats.errors} tone={stats.errors > 0 ? "error" : "neutral"} />
        <AdminStatCard icon={Clock} label="Avg latency (page)" value={`${stats.avgLatency}ms`} tone="neutral" />
      </div>

      <AdminFilterBar>
        <Input
          icon={Search}
          placeholder="Endpoint chứa..."
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
        />
        <Input
          placeholder="License ID (0 = all)"
          type="number"
          min="0"
          value={licenseId}
          onChange={(e) => setLicenseId(e.target.value)}
        />
        <select
          className="h-10 px-3 rounded-xl bg-base-200/30 border border-base-content/10 text-sm"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        >
          {SOURCE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select
          className="h-10 px-3 rounded-xl bg-base-200/30 border border-base-content/10 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} aria-label="Từ" />
        <Input type="date" value={dateTo}   onChange={(e) => setDateTo(e.target.value)}   aria-label="Đến" />
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="w-4 h-4" /> Xóa lọc
          </Button>
        )}
      </AdminFilterBar>

      {err && <Alert tone="error">{err}</Alert>}

      {items.length === 0 && !loading ? (
        <AdminEmptyState
          icon={Activity}
          title={hasFilters ? "Không có event khớp lọc" : "Chưa có request AI nào"}
          description={hasFilters ? "Thử bỏ filter hoặc mở rộng khoảng thời gian." : "Khi customer dùng AI (seo/chat/post), event sẽ xuất hiện ở đây."}
        />
      ) : (
        <>
          <AdminTable
            columns={[
              { key: "expand",    label: "",           width: "3%" },
              { key: "timestamp", label: "Thời gian",  width: "14%" },
              { key: "license",   label: "License",    width: "18%" },
              { key: "endpoint",  label: "Endpoint",   width: "18%" },
              { key: "source",    label: "Source",     width: "10%" },
              { key: "tokens",    label: "Tokens",     width: "10%", align: "right" },
              { key: "latency",   label: "Latency",    width: "8%",  align: "right" },
              { key: "cost",      label: "Cost",       width: "8%",  align: "right" },
              { key: "status",    label: "Status",     width: "11%" },
            ]}
            rows={items.map((e) => ({
              id: e.id,
              cells: {
                expand: (
                  <IconButton
                    size="sm"
                    variant="ghost"
                    onClick={() => setExpandedId(expandedId === e.id ? null : e.id)}
                    aria-label="Toggle details"
                  >
                    {expandedId === e.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRightIcon className="w-4 h-4" />}
                  </IconButton>
                ),
                timestamp: <span className="text-xs opacity-70 font-mono">{formatDate(e.timestamp)}</span>,
                license: (
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{e.license_email || `#${e.license_id}`}</span>
                    <span className="text-xs opacity-50 font-mono">{e.license_key || "—"}</span>
                  </div>
                ),
                endpoint: <code className="text-xs">{e.endpoint}</code>,
                source: <AdminBadge tone={sourceTone(e.source)} size="sm">{e.source}</AdminBadge>,
                tokens: (
                  <div className="flex flex-col items-end font-mono text-xs">
                    <span className="font-bold">{formatTokensShort(e.tokens_total)}</span>
                    <span className="opacity-50">in {formatTokensShort(e.tokens_input)} · out {formatTokensShort(e.tokens_output)}</span>
                  </div>
                ),
                latency: <span className="font-mono text-xs">{e.latency_ms}ms</span>,
                cost: <span className="font-mono text-xs opacity-70">{formatCents(e.cost_cents)}</span>,
                status: <AdminBadge tone={statusTone(e.status)} size="sm">{e.status}</AdminBadge>,
              },
              expand: expandedId === e.id ? (
                <div className="px-8 py-4 bg-base-200/30 border-t border-base-content/5 flex flex-col gap-2 text-xs">
                  <div><strong>Site:</strong> {e.site_domain || "—"}</div>
                  <div><strong>License ID:</strong> {e.license_id}</div>
                  <div><strong>Tokens in/out:</strong> {formatNum(e.tokens_input)} / {formatNum(e.tokens_output)}</div>
                  <div><strong>Cost:</strong> {formatCents(e.cost_cents)} ({e.cost_cents}c)</div>
                  {e.error_message && (
                    <div className="text-error">
                      <strong>Error:</strong> {e.error_message}
                    </div>
                  )}
                </div>
              ) : null,
            }))}
          />

          <div className="flex items-center justify-between pt-4 border-t border-base-content/5">
            <p className="text-xs opacity-50">
              <strong>{items.length}</strong> / <strong>{formatNum(total)}</strong> events (trang {page}/{totalPages})
            </p>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" disabled={offset === 0 || loading}
                onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}>
                <ChevronLeft className="w-4 h-4" /> Trang trước
              </Button>
              <Button variant="ghost" size="sm" disabled={offset + PAGE_SIZE >= total || loading}
                onClick={() => setOffset(offset + PAGE_SIZE)}>
                Trang sau <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Aggregate tab ─────────────────────────────────────── */
function AggregateTab() {
  const [data, setData] = useState({ rows: [], total_calls: 0, total_tokens: 0, total_cost_cents: 0 });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [dimension, setDimension] = useState("source");
  const [days, setDays] = useState(30);
  const [status, setStatus] = useState("");

  const fetchAggregate = useCallback(async () => {
    setLoading(true);
    try {
      const params = { dimension, days };
      if (status) params.status = status;
      const res = await withDelay(api.admin.usageAggregate(params), 300);
      setData(res);
      setErr("");
    } catch (e) {
      console.error("[usage aggregate] fetch failed", e);
      setErr("Không tải được aggregate.");
      setData({ rows: [], total_calls: 0, total_tokens: 0, total_cost_cents: 0 });
    } finally {
      setLoading(false);
    }
  }, [dimension, days, status]);

  useEffect(() => { fetchAggregate(); }, [fetchAggregate]);

  const rows = data.rows || [];
  const maxCalls = Math.max(1, ...rows.map((r) => r.calls));

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AdminStatCard icon={Activity} label="Total calls" value={formatNum(data.total_calls)} tone="primary" />
        <AdminStatCard icon={Zap} label="Total tokens" value={formatTokensShort(data.total_tokens)} tone="info" />
        <AdminStatCard icon={AlertTriangle} label="Total cost" value={formatCents(data.total_cost_cents)} tone="warning" />
      </div>

      <AdminFilterBar>
        <select
          className="h-10 px-3 rounded-xl bg-base-200/30 border border-base-content/10 text-sm"
          value={dimension}
          onChange={(e) => setDimension(e.target.value)}
        >
          {DIMENSION_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select
          className="h-10 px-3 rounded-xl bg-base-200/30 border border-base-content/10 text-sm"
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
        >
          <option value={7}>7 ngày qua</option>
          <option value={30}>30 ngày qua</option>
          <option value={90}>90 ngày qua</option>
          <option value={365}>365 ngày qua</option>
        </select>
        <select
          className="h-10 px-3 rounded-xl bg-base-200/30 border border-base-content/10 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </AdminFilterBar>

      {err && <Alert tone="error">{err}</Alert>}

      <AdminCard>
        {rows.length === 0 && !loading ? (
          <AdminEmptyState
            icon={Filter}
            title="Không có dữ liệu"
            description="Không có request AI nào trong khoảng thời gian này."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {rows.map((r) => {
              const pct = (r.calls / maxCalls) * 100;
              const errPct = r.calls > 0 ? (r.error_count / r.calls) * 100 : 0;
              return (
                <div key={r.group_key} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{r.group_key}</span>
                      {errPct > 5 && (
                        <AdminBadge tone="error" size="sm">{errPct.toFixed(0)}% error</AdminBadge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs opacity-70 font-mono">
                      <span><strong>{formatNum(r.calls)}</strong> calls</span>
                      <span><strong>{formatTokensShort(r.tokens_total)}</strong> tokens</span>
                      <span><strong>{formatCents(r.cost_cents)}</strong></span>
                      <span>p? {r.avg_latency_ms}ms</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-base-300 overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </AdminCard>
    </div>
  );
}

export default UsageExplorerPage;
