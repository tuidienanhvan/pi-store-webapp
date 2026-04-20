import { useEffect, useState } from "react";
import { api } from "../../lib/api-client";
import { useListFilters, useDebouncedValue } from "../../hooks/useListFilters";
import { useLocale } from "../../context/LocaleContext";
import { useAdminT, formatDateTime, formatRelative } from "../../lib/adminI18n";
import { Alert, Badge, Button, Card, EmptyState, Icon, Input, Select, Table } from "../../components/ui";

const DEFAULTS = {
  q: "", action: "", resource_type: "", severity: "",
  from_date: "", to_date: "",
  limit: 50, offset: 0,
};

const ACTION_OPTIONS = [
  { label: "Mọi action", value: "" },
  { label: "create", value: "create" },
  { label: "update", value: "update" },
  { label: "delete", value: "delete" },
  { label: "revoke", value: "revoke" },
  { label: "reactivate", value: "reactivate" },
  { label: "allocate", value: "allocate" },
  { label: "assign", value: "assign" },
  { label: "login", value: "login" },
];

const RESOURCE_OPTIONS = [
  { label: "Mọi resource", value: "" },
  { label: "license", value: "license" },
  { label: "key", value: "key" },
  { label: "package", value: "package" },
  { label: "provider", value: "provider" },
  { label: "user", value: "user" },
  { label: "release", value: "release" },
  { label: "settings", value: "settings" },
];

const SEVERITY_TONES = {
  info: "neutral",
  warning: "warning",
  critical: "danger",
};

const ACTION_ICONS = {
  create: "plus", update: "edit", delete: "trash",
  revoke: "shield", reactivate: "check", allocate: "layers",
  assign: "key", login: "user",
};

export function AdminAuditLogPage() {
  const { locale } = useLocale();
  const t = useAdminT();
  const { filters, setFilter, setFilters, reset, hasActive } = useListFilters(DEFAULTS);
  const [searchInput, setSearchInput] = useState(filters.q || "");
  const debouncedQ = useDebouncedValue(searchInput, 300);

  const [data, setData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (debouncedQ !== filters.q) setFilters({ q: debouncedQ, offset: 0 });
  }, [debouncedQ]); // eslint-disable-line

  useEffect(() => {
    setLoading(true); setErr("");
    api.admin.auditLog(filters)
      .then((res) => setData(res))
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [filters.q, filters.action, filters.resource_type, filters.severity,
      filters.from_date, filters.to_date, filters.limit, filters.offset]); // eslint-disable-line

  const page = Math.floor(filters.offset / filters.limit) + 1;
  const totalPages = Math.max(1, Math.ceil(data.total / filters.limit));

  return (
    <div className="stack" style={{ gap: "var(--s-6)" }}>
      <header className="stack" style={{ gap: "var(--s-2)" }}>
        <h1 style={{ margin: 0, fontSize: "var(--fs-32)" }}>{t.audit_title}</h1>
        <p style={{ margin: 0, color: "var(--text-2)" }}>{t.audit_subtitle}</p>
      </header>

      {err && <Alert tone="danger" onDismiss={() => setErr("")}>{err}</Alert>}

      <Card style={{ padding: "var(--s-4)" }}>
        <div className="row" style={{ gap: "var(--s-3)", flexWrap: "wrap", alignItems: "flex-end" }}>
          <Input type="search" placeholder={t.search_audit}
            value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
            leadingIcon="search" style={{ minWidth: "280px", flex: "1 1 280px" }} />
          <Select value={filters.action}
            onChange={(e) => setFilters({ action: e.target.value, offset: 0 })}
            options={ACTION_OPTIONS} style={{ minWidth: "150px" }} />
          <Select value={filters.resource_type}
            onChange={(e) => setFilters({ resource_type: e.target.value, offset: 0 })}
            options={RESOURCE_OPTIONS} style={{ minWidth: "150px" }} />
          <Select value={filters.severity}
            onChange={(e) => setFilters({ severity: e.target.value, offset: 0 })}
            options={[
              { label: "Mọi severity", value: "" },
              { label: "info", value: "info" },
              { label: "warning", value: "warning" },
              { label: "critical", value: "critical" },
            ]} style={{ minWidth: "150px" }} />
          <Input type="date" label={t.from_date} value={filters.from_date || ""}
            onChange={(e) => setFilters({ from_date: e.target.value, offset: 0 })}
            style={{ width: "160px" }} />
          <Input type="date" label={t.to_date} value={filters.to_date || ""}
            onChange={(e) => setFilters({ to_date: e.target.value, offset: 0 })}
            style={{ width: "160px" }} />
          {hasActive && (
            <Button variant="ghost" onClick={() => { setSearchInput(""); reset(); }}>
              <Icon name="x" size={14} /> {t.clear}
            </Button>
          )}
        </div>
      </Card>

      <div className="row" style={{ gap: "var(--s-4)", fontSize: "var(--fs-14)", color: "var(--text-2)" }}>
        <span>{t.total}: <strong style={{ color: "var(--text-1)" }}>{data.total.toLocaleString()}</strong> {t.events}</span>
        {loading && <span>{t.loading}</span>}
      </div>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <Table>
          <thead>
            <tr>
              <th style={{ width: "40px" }}></th>
              <th>{t.event_time}</th>
              <th>{t.actor}</th>
              <th>{t.action}</th>
              <th>{t.resource}</th>
              <th>{t.message}</th>
              <th style={{ textAlign: "center" }}>{t.severity}</th>
            </tr>
          </thead>
          <tbody>
            {!loading && data.items.length === 0 && (
              <tr><td colSpan="7">
                <EmptyState icon="file-text" title={t.no_events}
                  description={hasActive ? t.no_match_desc : t.no_events_desc} />
              </td></tr>
            )}
            {data.items.map((e) => (
              <AuditRow key={e.id} entry={e}
                expanded={expandedId === e.id}
                onToggle={() => setExpandedId(expandedId === e.id ? null : e.id)} />
            ))}
          </tbody>
        </Table>
      </Card>

      {data.total > filters.limit && (
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center", fontSize: "var(--fs-14)", color: "var(--text-2)" }}>
          <div>
            Trang <strong style={{ color: "var(--text-1)" }}>{page}</strong> / {totalPages} —
            hiện {filters.offset + 1}-{Math.min(filters.offset + filters.limit, data.total)} của {data.total.toLocaleString()}
          </div>
          <div className="row" style={{ gap: "var(--s-2)" }}>
            <Select value={filters.limit}
              onChange={(e) => setFilters({ limit: Number(e.target.value), offset: 0 })}
              options={[50, 100, 200, 500].map((n) => ({ value: n, label: `${n}/trang` }))}
              style={{ width: "120px" }} />
            <Button variant="ghost" disabled={page <= 1}
              onClick={() => setFilter("offset", Math.max(0, filters.offset - filters.limit))}>
              ← Prev
            </Button>
            <Button variant="ghost" disabled={page >= totalPages}
              onClick={() => setFilter("offset", filters.offset + filters.limit)}>
              Next →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function AuditRow({ entry, expanded, onToggle }) {
  const { locale } = useLocale();
  const t = useAdminT();
  const actionIcon = ACTION_ICONS[entry.action] || "info";
  const severityTone = SEVERITY_TONES[entry.severity] || "neutral";
  const hasDiff = entry.before || entry.after;

  return (
    <>
      <tr style={{ cursor: hasDiff ? "pointer" : "default" }} onClick={hasDiff ? onToggle : undefined}>
        <td style={{ textAlign: "center", color: "var(--text-3)" }}>
          {hasDiff ? <Icon name={expanded ? "chevron-down" : "chevron-right"} size={14} /> : null}
        </td>
        <td style={{ fontSize: "var(--fs-13)" }}>
          <div title={entry.created_at}>{formatRelative(entry.created_at, locale)}</div>
          <div style={{ fontSize: "var(--fs-11)", color: "var(--text-3)" }}>{formatDateTime(entry.created_at, locale)}</div>
        </td>
        <td style={{ fontSize: "var(--fs-13)" }}>
          {entry.actor_email || <span style={{ color: "var(--text-3)" }}>system</span>}
          {entry.ip_address && (
            <div style={{ fontSize: "var(--fs-11)", color: "var(--text-3)", fontFamily: "monospace" }}>
              {entry.ip_address}
            </div>
          )}
        </td>
        <td>
          <div className="row" style={{ gap: "var(--s-1)", alignItems: "center" }}>
            <Icon name={actionIcon} size={14} style={{ color: "var(--text-3)" }} />
            <code style={{ fontSize: "var(--fs-12)" }}>{entry.action}</code>
          </div>
        </td>
        <td style={{ fontSize: "var(--fs-13)" }}>
          <code style={{ fontSize: "var(--fs-12)", color: "var(--brand)" }}>{entry.resource_type}</code>
          {entry.resource_id && <span style={{ color: "var(--text-3)" }}> #{entry.resource_id}</span>}
          {entry.resource_label && (
            <div style={{ fontSize: "var(--fs-11)", color: "var(--text-3)" }}>{entry.resource_label}</div>
          )}
        </td>
        <td style={{ fontSize: "var(--fs-13)", color: "var(--text-1)" }}>
          {entry.message}
        </td>
        <td style={{ textAlign: "center" }}>
          <Badge tone={severityTone}>{entry.severity}</Badge>
        </td>
      </tr>
      {expanded && hasDiff && (
        <tr>
          <td colSpan="7" style={{ background: "var(--surface-2)", padding: "var(--s-4)" }}>
            <div className="grid --cols-2" style={{ gap: "var(--s-4)" }}>
              {entry.before && (
                <div>
                  <div style={{ fontSize: "var(--fs-13)", color: "var(--text-2)", marginBottom: "var(--s-2)" }}><strong>{t.before}:</strong></div>
                  <pre style={{
                    fontSize: "var(--fs-12)", fontFamily: "monospace",
                    background: "var(--surface)", padding: "var(--s-3)",
                    borderRadius: "var(--r-2)", overflow: "auto", margin: 0, maxHeight: "300px",
                  }}>{JSON.stringify(entry.before, null, 2)}</pre>
                </div>
              )}
              {entry.after && (
                <div>
                  <div style={{ fontSize: "var(--fs-13)", color: "var(--text-2)", marginBottom: "var(--s-2)" }}><strong>{t.after}:</strong></div>
                  <pre style={{
                    fontSize: "var(--fs-12)", fontFamily: "monospace",
                    background: "var(--surface)", padding: "var(--s-3)",
                    borderRadius: "var(--r-2)", overflow: "auto", margin: 0, maxHeight: "300px",
                  }}>{JSON.stringify(entry.after, null, 2)}</pre>
                </div>
              )}
              {entry.user_agent && (
                <div style={{ gridColumn: "1 / -1", fontSize: "var(--fs-11)", color: "var(--text-3)" }}>
                  <strong>UA:</strong> {entry.user_agent}
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
