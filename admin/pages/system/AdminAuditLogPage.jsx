import { useState, useEffect } from "react";

import { api, withDelay } from "@/lib/api-client";

import { useAdminT, formatDateTime, formatRelative } from "@/lib/translations";

import { useLocale } from "@/context/LocaleContext";

import { useListFilters, useDebouncedValue } from "@/hooks/useListFilters";

import { Card, Table, Badge, Input, Select, Button, Alert } from "@/components/ui";
import { 
  Search, X, FileText, ChevronDown, ChevronRight, 
  Plus, Edit2, Trash2, Shield, Check, Layers, Key, User, Info 
} from "lucide-react";

import { AdminTableSkeleton } from "@/components/skeletons/AdminTableSkeleton";

import { EmptyState } from "@/components/ui/EmptyState";

import "./AdminAuditLogPage.css";



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

const ACTION_ICONS = { create: Plus, update: Edit2, delete: Trash2, revoke: Shield, reactivate: Check, allocate: Layers, assign: Key, login: User };



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

  }, [debouncedQ, filters.q, setFilters]);



  useEffect(() => {

    setLoading(true);

    setErr("");

    withDelay(api.admin.auditLog(filters), 1000)

      .then((res) => setData(res))

      .catch((e) => setErr(e.message))

      .finally(() => setLoading(false));

  }, [filters]);



  const page = Math.floor(filters.offset / filters.limit) + 1;

  const totalPages = Math.max(1, Math.ceil(data.total / filters.limit));



  if (loading && data.items.length === 0) return <AdminTableSkeleton />;



  return (

    <div className="audit-page fade-in">

      <header className="audit-header stagger-1">

        <div className="flex flex-col gap-3">

          <h1 className="premium-title">{t.audit_title}</h1>

          <p className="text-base-content/60 opacity-60 font-medium tracking-wide">

            {t.audit_subtitle}

          </p>

        </div>

      </header>



      {err && <Alert tone="danger" onDismiss={() => setErr("")} className="stagger-1 mx-4 lg:mx-0">{err}</Alert>}



      <Card className="audit-filter-card stagger-2">

        <div className="flex flex-wrap items-end gap-4">

          <Input type="search" placeholder={t.search_audit} value={searchInput} onChange={(e) => setSearchInput(e.target.value)} leadingIcon={Search} className="flex-1 min-w-[200px]" />

          <Select value={filters.action} onChange={(e) => setFilters({ action: e.target.value, offset: 0 })} options={ACTION_OPTIONS} className="w-40" />

          <Select value={filters.resource_type} onChange={(e) => setFilters({ resource_type: e.target.value, offset: 0 })} options={RESOURCE_OPTIONS} className="w-40" />

          <Select

            value={filters.severity}

            onChange={(e) => setFilters({ severity: e.target.value, offset: 0 })}

            options={[

              { label: "All severity", value: "" },

              { label: "info", value: "info" },

              { label: "warning", value: "warning" },

              { label: "critical", value: "critical" },

            ]}

            className="w-40"

          />

          <Input type="date" label={t.from_date} value={filters.from_date || ""} onChange={(e) => setFilters({ from_date: e.target.value, offset: 0 })} className="w-40" />

          <Input type="date" label={t.to_date} value={filters.to_date || ""} onChange={(e) => setFilters({ to_date: e.target.value, offset: 0 })} className="w-40" />

          {hasActive && (

            <Button variant="ghost" onClick={() => { setSearchInput(""); reset(); }} className="h-12 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest">

              <X size={14} className="mr-1" /> {t.clear}

            </Button>

          )}

        </div>

      </Card>



      <div className="flex items-center justify-between px-4 lg:px-0 stagger-2">

        <div className="text-[10px] font-black uppercase tracking-widest text-base-content/60 opacity-60">

          Total: <strong className="text-base-content">{data.total.toLocaleString()}</strong> events

        </div>

        {loading && <div className="text-[10px] font-black uppercase tracking-widest text-primary animate-pulse">{t.loading}</div>}

      </div>



      <Card className="audit-table-card stagger-3">

        <Table className="audit-table">

          <thead>

            <tr>

              <th className="w-10" />

              <th>{t.event_time}</th>

              <th>{t.actor}</th>

              <th>{t.action}</th>

              <th>{t.resource}</th>

              <th>{t.message}</th>

              <th className="text-center">{t.severity}</th>

            </tr>

          </thead>

          <tbody className="divide-y divide-base-border-subtle">

            {!loading && data.items.length === 0 && (

              <tr>

                <td colSpan="7" className="py-20">

                  <EmptyState icon={FileText} title={t.no_events} description={hasActive ? t.no_match_desc : t.no_events_desc} />

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

        <footer className="flex flex-wrap items-center justify-between gap-6 px-4 lg:px-0 stagger-4">

          <div className="text-[11px] font-bold text-base-content/60 opacity-60 uppercase tracking-widest">

            Page <strong className="text-base-content">{page}</strong> / {totalPages}

          </div>

          <div className="flex items-center gap-4">

            <Select value={filters.limit} onChange={(e) => setFilters({ limit: Number(e.target.value), offset: 0 })} options={[50, 100, 200, 500].map((n) => ({ value: n, label: `${n}/page` }))} className="w-32" />

            <div className="flex gap-2">

              <Button variant="ghost" disabled={page <= 1} onClick={() => setFilter("offset", Math.max(0, filters.offset - filters.limit))} className="rounded-xl font-bold uppercase tracking-widest text-[10px]">

                ? Prev

              </Button>

              <Button variant="ghost" disabled={page >= totalPages} onClick={() => setFilter("offset", filters.offset + filters.limit)} className="rounded-xl font-bold uppercase tracking-widest text-[10px]">

                Next ?

              </Button>

            </div>

          </div>

        </footer>

      )}

    </div>

  );

}



function AuditRow({ entry, locale, expanded, onToggle }) {

  const t = useAdminT();

  const ActionIcon = ACTION_ICONS[entry.action] || Info;

  const severityTone = SEVERITY_TONES[entry.severity] || "neutral";

  const hasDiff = Boolean(entry.before || entry.after);



  return (

    <>

      <tr className={`group transition-colors ${hasDiff ? "cursor-pointer hover:bg-base-content/[0.02]" : ""} ${expanded ? "bg-base-content/[0.03]" : ""}`} 

        onClick={hasDiff ? onToggle : undefined}>

        <td className="text-center">

          {hasDiff ? (
            expanded ? (
              <ChevronDown size={14} className="transition-transform text-primary" />
            ) : (
              <ChevronRight size={14} className="transition-transform text-base-content/60 opacity-20" />
            )
          ) : null}

        </td>

        <td className="whitespace-nowrap">

          <div className="text-[12px] font-bold text-base-content" title={entry.created_at}>{formatRelative(entry.created_at, locale)}</div>

          <div className="text-[10px] font-mono text-base-content/60 opacity-40">{formatDateTime(entry.created_at, locale)}</div>

        </td>

        <td className="max-w-[180px]">

          <div className="text-[12px] font-bold text-base-content/80 truncate">{entry.actor_email || <span className="opacity-30 italic">system</span>}</div>

          {entry.ip_address ? <div className="text-[10px] font-mono text-base-content/60 opacity-40">{entry.ip_address}</div> : null}

        </td>

        <td>

          <div className="flex items-center gap-1.5">

            <ActionIcon size={14} className="text-base-content/60 opacity-40" />

            <code className="text-[11px] font-black uppercase tracking-widest text-base-content/80">{entry.action}</code>

          </div>

        </td>

        <td>

          <div className="flex flex-col">

            <code className="text-[11px] font-black uppercase tracking-widest text-primary-soft">{entry.resource_type}</code>

            {entry.resource_id ? <span className="text-[10px] font-mono text-base-content/60 opacity-40">#{entry.resource_id}</span> : null}

          </div>

        </td>

        <td className="min-w-[200px]">

          <div className="text-[13px] font-medium text-base-content leading-relaxed">{entry.message}</div>

        </td>

        <td className="text-center">

          <Badge tone={severityTone} className="uppercase text-[9px] font-black tracking-widest px-2 py-1">

            {entry.severity}

          </Badge>

        </td>

      </tr>

      {expanded && hasDiff && (

        <tr className="bg-base-300/40">

          <td colSpan="7" className="p-8">

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

              {entry.before ? <DiffCard title={`${t.before}:`} payload={entry.before} tone="danger" /> : null}

              {entry.after ? <DiffCard title={`${t.after}:`} payload={entry.after} tone="success" /> : null}

            </div>

          </td>

        </tr>

      )}

    </>

  );

}



function DiffCard({ title, payload, tone }) {

  const isDanger = tone === "danger";

  return (

    <div className="flex flex-col gap-3">

      <div className={`text-[10px] font-black uppercase tracking-widest ${isDanger ? "text-danger" : "text-success"} opacity-80`}>

        {title}

      </div>

      <pre className="audit-diff-pre">

        {JSON.stringify(payload, null, 2)}

      </pre>

    </div>

  );

}


export default AdminAuditLogPage;
