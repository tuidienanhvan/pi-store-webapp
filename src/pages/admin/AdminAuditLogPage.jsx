import { useEffect, useState } from "react";
import { api } from "../../lib/api-client";
import { useDebouncedValue, useListFilters } from "../../hooks/useListFilters";
import { useLocale } from "../../context/LocaleContext";
import { formatDateTime, formatRelative, useAdminT } from "../../lib/adminI18n";
import { Alert, Badge, Button, Card, EmptyState, Icon, Input, Select, Table } from "../../components/ui";

const DEFAULTS = { q: "", action: "", resource_type: "", severity: "", from_date: "", to_date: "", limit: 50, offset: 0 };
const ACTION_OPTIONS = [
  { label: "All actions", value: "" },
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
  { label: "All resources", value: "" },
  { label: "license", value: "license" },
  { label: "key", value: "key" },
  { label: "package", value: "package" },
  { label: "provider", value: "provider" },
  { label: "user", value: "user" },
  { label: "release", value: "release" },
  { label: "settings", value: "settings" },
];
const SEVERITY_TONES = { info: "neutral", warning: "warning", critical: "danger" };
const ACTION_ICONS = { create: "plus", update: "edit", delete: "trash", revoke: "shield", reactivate: "check", allocate: "layers", assign: "key", login: "user" };

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
    setLoading(true);
    setErr("");
    api.admin
      .auditLog(filters)
      .then((res) => setData(res))
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [filters.q, filters.action, filters.resource_type, filters.severity, filters.from_date, filters.to_date, filters.limit, filters.offset]); // eslint-disable-line

  const page = Math.floor(filters.offset / filters.limit) + 1;
  const totalPages = Math.max(1, Math.ceil(data.total / filters.limit));

  return (
    <div className="stack gap-6">
      <header className="stack gap-2">
        <h1 className="m-0 text-32">{t.audit_title}</h1>
        <p className="m-0 muted">{t.audit_subtitle}</p>
      </header>

      {err && <Alert tone="danger" onDismiss={() => setErr("")}>{err}</Alert>}

      <Card className="p-4">
        <div className="row gap-3 flex-wrap items-end">
          <Input type="search" placeholder={t.search_audit} value={searchInput} onChange={(e) => setSearchInput(e.target.value)} leadingIcon="search" />
          <Select value={filters.action} onChange={(e) => setFilters({ action: e.target.value, offset: 0 })} options={ACTION_OPTIONS} />
          <Select value={filters.resource_type} onChange={(e) => setFilters({ resource_type: e.target.value, offset: 0 })} options={RESOURCE_OPTIONS} />
          <Select
            value={filters.severity}
            onChange={(e) => setFilters({ severity: e.target.value, offset: 0 })}
            options={[
              { label: "All severity", value: "" },
              { label: "info", value: "info" },
              { label: "warning", value: "warning" },
              { label: "critical", value: "critical" },
            ]}
          />
          <Input type="date" label={t.from_date} value={filters.from_date || ""} onChange={(e) => setFilters({ from_date: e.target.value, offset: 0 })} />
          <Input type="date" label={t.to_date} value={filters.to_date || ""} onChange={(e) => setFilters({ to_date: e.target.value, offset: 0 })} />
          {hasActive && (
            <Button variant="ghost" onClick={() => { setSearchInput(""); reset(); }}>
              <Icon name="x" size={14} /> {t.clear}
            </Button>
          )}
        </div>
      </Card>

      <div className="row gap-4 text-14 muted">
        <span>{t.total}: <strong className="text-1">{data.total.toLocaleString()}</strong> events</span>
        {loading && <span>{t.loading}</span>}
      </div>

      <Card className="p-0 overflow-hidden">
        <Table>
          <thead>
            <tr>
              <th style={{ width: 40 }} />
              <th>{t.event_time}</th>
              <th>{t.actor}</th>
              <th>{t.action}</th>
              <th>{t.resource}</th>
              <th>{t.message}</th>
              <th className="text-center">{t.severity}</th>
            </tr>
          </thead>
          <tbody>
            {!loading && data.items.length === 0 && (
              <tr>
                <td colSpan="7">
                  <EmptyState icon="file-text" title={t.no_events} description={hasActive ? t.no_match_desc : t.no_events_desc} />
                </td>
              </tr>
            )}
            {data.items.map((entry) => (
              <AuditRow key={entry.id} entry={entry} locale={locale} expanded={expandedId === entry.id} onToggle={() => setExpandedId(expandedId === entry.id ? null : entry.id)} />
            ))}
          </tbody>
        </Table>
      </Card>

      {data.total > filters.limit && (
        <div className="row justify-between items-center text-14 muted">
          <div>
            Page <strong className="text-1">{page}</strong> / {totalPages}
          </div>
          <div className="row gap-2">
            <Select value={filters.limit} onChange={(e) => setFilters({ limit: Number(e.target.value), offset: 0 })} options={[50, 100, 200, 500].map((n) => ({ value: n, label: `${n}/page` }))} />
            <Button variant="ghost" disabled={page <= 1} onClick={() => setFilter("offset", Math.max(0, filters.offset - filters.limit))}>← Prev</Button>
            <Button variant="ghost" disabled={page >= totalPages} onClick={() => setFilter("offset", filters.offset + filters.limit)}>Next →</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function AuditRow({ entry, locale, expanded, onToggle }) {
  const t = useAdminT();
  const actionIcon = ACTION_ICONS[entry.action] || "info";
  const severityTone = SEVERITY_TONES[entry.severity] || "neutral";
  const hasDiff = Boolean(entry.before || entry.after);

  return (
    <>
      <tr style={{ cursor: hasDiff ? "pointer" : "default" }} onClick={hasDiff ? onToggle : undefined}>
        <td className="text-center text-3">{hasDiff ? <Icon name={expanded ? "chevron-down" : "chevron-right"} size={14} /> : null}</td>
        <td className="text-13">
          <div title={entry.created_at}>{formatRelative(entry.created_at, locale)}</div>
          <div className="text-12 text-3">{formatDateTime(entry.created_at, locale)}</div>
        </td>
        <td className="text-13">
          {entry.actor_email || <span className="text-3">system</span>}
          {entry.ip_address ? <div className="text-12 text-3 font-mono">{entry.ip_address}</div> : null}
        </td>
        <td>
          <div className="row gap-1 items-center">
            <Icon name={actionIcon} size={14} className="text-3" />
            <code className="text-12">{entry.action}</code>
          </div>
        </td>
        <td className="text-13">
          <code className="text-12 text-brand">{entry.resource_type}</code>
          {entry.resource_id ? <span className="text-3"> #{entry.resource_id}</span> : null}
        </td>
        <td className="text-13 text-1">{entry.message}</td>
        <td className="text-center"><Badge tone={severityTone}>{entry.severity}</Badge></td>
      </tr>
      {expanded && hasDiff && (
        <tr>
          <td colSpan="7" style={{ background: "var(--surface-2)", padding: "var(--s-4)" }}>
            <div className="grid --cols-2 gap-4">
              {entry.before ? <DiffCard title={`${t.before}:`} payload={entry.before} /> : null}
              {entry.after ? <DiffCard title={`${t.after}:`} payload={entry.after} /> : null}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function DiffCard({ title, payload }) {
  return (
    <div>
      <div className="text-13 muted mb-2"><strong>{title}</strong></div>
      <pre style={{ fontSize: 12, fontFamily: "monospace", background: "var(--surface)", padding: "var(--s-3)", borderRadius: "var(--r-2)", overflow: "auto", margin: 0, maxHeight: 300 }}>
        {JSON.stringify(payload, null, 2)}
      </pre>
    </div>
  );
}
