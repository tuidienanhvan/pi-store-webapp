import { useCallback, useEffect, useState } from "react";
import { api, withDelay } from "@/lib/api-client";
import { useListFilters, useDebouncedValue } from "@/hooks/useListFilters";
import { useAdminT, formatTokens as i18nTokens } from "@/lib/translations";
import { copyToClipboard, maskKey } from "@/lib/format";
import { Alert, Badge, Button, Card, EmptyState, Input, Select, Table, IconButton } from "@/components/ui";
import { 
  Plus, Search, X, Key, ArrowLeft, ArrowRight, 
  EyeOff, Eye, Check, Copy, Edit2, Slash, Trash2 
} from "lucide-react";
import { AdminTableSkeleton } from "@/components/skeletons/AdminTableSkeleton";
import "./AdminLicensesPage.css";

// Lazy modals to keep main bundle smaller
import { CreateLicenseModal } from "./CreateLicenseModal";
import { LicenseDetailModal } from "./LicenseDetailModal";
import { AdjustTokensModal } from "./AdjustTokensModal";
import { AssignPackageModal } from "./AssignPackageModal";

const formatTokens = i18nTokens;

const PLUGIN_OPTIONS = [
  "pi-api",
];

const DEFAULTS = {
  q: "", tier: "", status: "", plugin: "", package: "", expires_in: "",
  sort: "-created_at", limit: 50, offset: 0,
};

export function AdminLicensesPage() {
  const t = useAdminT();
  const { filters, setFilter, setFilters, reset, hasActive } = useListFilters(DEFAULTS);
  const [searchInput, setSearchInput] = useState(filters.q || "");
  const debouncedQ = useDebouncedValue(searchInput, 300);

  const [data, setData] = useState({ items: [], total: 0, facets: {} });
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [detailLicense, setDetailLicense] = useState(null);
  const [tokenTarget, setTokenTarget] = useState(null);
  const [packageTarget, setPackageTarget] = useState(null);

  useEffect(() => {
    if (debouncedQ !== filters.q) setFilters({ q: debouncedQ, offset: 0 });
  }, [debouncedQ, filters.q, setFilters]);

  useEffect(() => { api.admin.packages().then((r) => setPackages(r.items || [])); }, []);

  const load = useCallback(() => {
    setLoading(true); setErr("");
    withDelay(api.admin.licenses(filters), 1000)
      .then((res) => setData(res))
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  const refresh = () => load();

  const handleRevoke = async (l) => {
    if (!confirm(`Revoke license #${l.id} (${l.email})?`)) return;
    try { await api.admin.revokeLicense(l.id); refresh(); } catch (e) { setErr(e.message); }
  };
  const handleReactivate = async (l) => {
    try { await api.admin.reactivateLicense(l.id); refresh(); } catch (e) { setErr(e.message); }
  };
  const handleDelete = async (l) => {
    if (!confirm(`XO VINH VI?N license #${l.id} (${l.email})?`)) return;
    try { await api.admin.deleteLicense(l.id); refresh(); } catch (e) { setErr(e.message); }
  };

  const page = Math.floor(filters.offset / filters.limit) + 1;
  const totalPages = Math.max(1, Math.ceil(data.total / filters.limit));
  const facets = data.facets || {};

  if (loading && data.items.length === 0) return <AdminTableSkeleton />;

  return (
    <div className="licenses-page fade-in">
      <header className="licenses-header stagger-1">
        <div className="flex flex-col gap-3">
          <h1 className="premium-title">{t.licenses_title}</h1>
          <p className="text-base-content/60 opacity-60 font-medium tracking-wide">{t.licenses_subtitle}</p>
        </div>
        <Button variant="primary" onClick={() => setShowCreate(true)} className="h-[48px] px-8 rounded-2xl shadow-brand/20 shadow-lg font-black uppercase tracking-widest text-xs">
          <Plus size={18} className="mr-2" /> {t.create_license}
        </Button>
      </header>

      {err && <Alert tone="danger" onDismiss={() => setErr("")} className="mx-4 lg:mx-0 stagger-1">{err}</Alert>}

      <Card className="licenses-toolbar-card stagger-2">
        <div className="licenses-toolbar">
          <div className="licenses-toolbar__search">
            <Input
              type="search" 
              placeholder={t.search_license_placeholder}
              value={searchInput} 
              onChange={(e) => setSearchInput(e.target.value)}
              leadingIcon={Search}
              className="flex-1"
            />
            {hasActive && (
              <Button variant="ghost" onClick={() => { setSearchInput(""); reset(); }} className="h-[48px] rounded-xl border border-base-border-subtle">
                <X size={16} className="mr-2" /> {t.clear}
              </Button>
            )}
          </div>
          
          <div className="licenses-toolbar__filters">
            <Select value={filters.status}
              onChange={(e) => setFilters({ status: e.target.value, offset: 0 })}
              className="filter-select"
              options={[
                { label: `?? Tr?ng thi`, value: "" },
                { label: `? Active (${facets.by_status?.active || 0})`, value: "active" },
                { label: `?? Revoked (${facets.by_status?.revoked || 0})`, value: "revoked" },
                { label: `? Expired (${facets.by_status?.expired || 0})`, value: "expired" },
              ]} />
            <Select value={filters.tier}
              onChange={(e) => setFilters({ tier: e.target.value, offset: 0 })}
              className="filter-select"
              options={[
                { label: `?? Tier`, value: "" },
                { label: `Free (${facets.by_tier?.free || 0})`, value: "free" },
                { label: `Pro (${facets.by_tier?.pro || 0})`, value: "pro" },
                { label: `Max (${facets.by_tier?.max || 0})`, value: "max" },
              ]} />
            <Select value={filters.package}
              onChange={(e) => setFilters({ package: e.target.value, offset: 0 })}
              className="filter-select"
              options={[
                { label: `?? Gi Cloud`, value: "" },
                ...packages.map((p) => ({
                  value: p.slug,
                  label: `${p.display_name}`,
                })),
              ]} />
            <Select value={filters.plugin}
              onChange={(e) => setFilters({ plugin: e.target.value, offset: 0 })}
              className="filter-select"
              options={[
                { label: `?? Plugin`, value: "" },
                ...PLUGIN_OPTIONS.map((s) => ({
                  value: s,
                  label: s,
                })),
              ]} />
            <Select value={filters.expires_in}
              onChange={(e) => setFilters({ expires_in: e.target.value, offset: 0 })}
              className="filter-select"
              options={[
                { label: `? Th?i h?n`, value: "" },
                { label: "7 ngy ti", value: "7d" },
                { label: "30 ngy ti", value: "30d" },
                { label: " h?t h?n", value: "expired" },
              ]} />
            <Select value={filters.sort}
              onChange={(e) => setFilters({ sort: e.target.value })}
              className="filter-select"
              options={[
                { label: "Mi nh?t", value: "-created_at" },
                { label: "Cu nh?t", value: "created_at" },
                { label: "S?p h?t h?n", value: "expires_at" },
              ]} />
          </div>
        </div>
      </Card>

      <div className="licenses-stats stagger-2">
        <span>T?ng c?ng: <strong>{data.total}</strong> b?n ghi</span>
        {loading && <div className="h-3 w-3 bg-primary rounded-full animate-ping" />}
      </div>

      <Card className="licenses-table-card stagger-3">
        <Table className="w-full licenses-table">
          <thead>
            <tr>
              <th>{t.license_id}</th>
              <th>{t.license_key}</th>
              <th>{t.customer}</th>
              <th>{t.plugin}</th>
              <th>{t.package_quota}</th>
              <th className="text-center">{t.sites}</th>
              <th className="text-center">{t.status}</th>
              <th className="text-right">Hnh d?ng</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-border-subtle">
            {data.items.length === 0 && !loading ? (
              <tr><td colSpan="8" className="py-32">
                <EmptyState
                  icon={Key}
                  title={hasActive ? "Khng tm th?y k?t qu?" : "Chua c license no"}
                  description={hasActive ? "Hy th? di?u chnh l?i b? l?c tm ki?m." : "Hy t?o license d?u tin d? khch hng b?t d?u s? d?ng."}
                  action={hasActive
                    ? <Button variant="ghost" onClick={() => { setSearchInput(""); reset(); }} className="rounded-xl border border-base-border-subtle">Xa b? l?c</Button>
                    : <Button variant="primary" onClick={() => setShowCreate(true)} className="rounded-xl">+ To ngay</Button>}
                />
              </td></tr>
            ) : (
              data.items.map((l) => (
                <LicenseRow 
                  key={l.id} 
                  l={l}
                  onOpen={() => setDetailLicense(l)}
                  onRevoke={() => handleRevoke(l)}
                  onReactivate={() => handleReactivate(l)}
                  onDelete={() => handleDelete(l)}
                />
              ))
            )}
          </tbody>
        </Table>
      </Card>

      {data.total > filters.limit && (
        <div className="licenses-pagination stagger-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Trang</span>
            <strong className="text-base-content font-black text-sm">{page}</strong>
            <span className="text-base-content/60 opacity-20">/</span>
            <span className="text-base-content/60 font-bold">{totalPages}</span>
            <span className="ml-4 opacity-10"></span>
            <span className="ml-4 italic text-[11px] opacity-40">Hi?n th? {filters.offset + 1}-{Math.min(filters.offset + filters.limit, data.total)} / {data.total}</span>
          </div>
          <div className="licenses-pagination__controls">
            <Select value={filters.limit}
              onChange={(e) => setFilters({ limit: Number(e.target.value), offset: 0 })}
              options={[25, 50, 100].map((n) => ({ value: n, label: `${n} dng/trang` }))}
              className="w-40 filter-select" />
            <Button variant="ghost" disabled={page <= 1} className="rounded-xl border border-base-border-subtle p-2"
              onClick={() => setFilter("offset", Math.max(0, filters.offset - filters.limit))}>
              <ArrowLeft size={16} />
            </Button>
            <Button variant="ghost" disabled={page >= totalPages} className="rounded-xl border border-base-border-subtle p-2"
              onClick={() => setFilter("offset", filters.offset + filters.limit)}>
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      )}

      <CreateLicenseModal open={showCreate} onClose={() => setShowCreate(false)} onCreated={refresh} />
      {detailLicense !== null && (
        <LicenseDetailModal
          license={detailLicense}
          packages={packages}
          onClose={() => setDetailLicense(null)}
          onChanged={refresh}
          onAdjustTokens={(license) => setTokenTarget(license)}
          onAssignPackage={(license) => setPackageTarget(license)}
        />
      )}
      {tokenTarget !== null && (
        <AdjustTokensModal
          license={tokenTarget}
          onClose={() => setTokenTarget(null)}
          onChanged={refresh}
        />
      )}
      {packageTarget !== null && (
        <AssignPackageModal
          license={packageTarget}
          packages={packages}
          onClose={() => setPackageTarget(null)}
          onChanged={refresh}
        />
      )}
    </div>
  );
}

function LicenseRow({ l, onOpen, onRevoke, onReactivate, onDelete }) {
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const copy = async () => {
    if (await copyToClipboard(l.key)) {
      setCopied(true); setTimeout(() => setCopied(false), 1500);
    }
  };

  const statusTone = l.status === "active" ? "success" : l.status === "revoked" ? "danger" : "warning";
  const quotaColor = l.quota_pct >= 90 ? "var(--color-danger)" : l.quota_pct >= 70 ? "var(--color-warning)" : "var(--color-brand)";

  return (
    <tr className="group transition-colors hover:bg-base-content/[0.02]">
      <td className="px-6 py-5 font-mono text-xs text-base-content/60">#{l.id}</td>
      <td className="px-6 py-5">
        <div className="key-cell-wrap">
          <code className={`key-cell-code ${showKey ? "is-revealed" : "is-masked"}`}>
            {showKey ? l.key : maskKey(l.key, 8, 4)}
          </code>
          <div className="flex items-center gap-0.5 ml-2 border-l border-base-border pl-2">
            <button type="button" onClick={() => setShowKey(!showKey)} className="text-base-content/60 hover:text-base-content transition-colors p-1">
              {showKey ? <EyeOff size={12} /> : <Eye size={12} />}
            </button>
            <button type="button" onClick={copy} className={`${copied ? "text-success" : "text-base-content/60 hover:text-base-content"} transition-colors p-1`}>
              {copied ? <Check size={12} /> : <Copy size={12} />}
            </button>
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-bold text-base-content group-hover:text-primary transition-colors">{l.email}</span>
          {l.name && <span className="text-[11px] text-base-content/60 font-medium opacity-60">{l.name}</span>}
        </div>
      </td>
      <td className="px-6 py-5">
        <span className="text-xs font-mono font-bold text-base-content/80 lowercase">{l.plugin}</span>
      </td>
      <td className="px-6 py-5">
        {l.plugin === "pi-ai-cloud" && l.package_slug ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge tone="brand" className="text-[9px] font-black tracking-widest">{l.package_name}</Badge>
              {/* Routing badge (T-20260513-001) */}
              {l.routing_mode && (
                <Badge tone={l.routing_mode === "dedicated" ? "primary" : l.routing_mode === "hybrid" ? "warning" : "neutral"}
                  className="uppercase text-[8px] font-black tracking-widest px-1.5 py-0.5">
                  {l.routing_mode}
                </Badge>
              )}
              <span className="text-[10px] font-mono text-base-content/60 italic">
                {formatTokens(l.quota_used)}/{formatTokens(l.quota_limit)}
              </span>
            </div>
            {/* Dedicated keys hint */}
            {(l.dedicated_keys_count !== undefined && l.routing_mode && l.routing_mode !== "shared") && (
              <div className="text-[9px] font-mono text-base-content/60">
                🔑 dedicated: {l.dedicated_keys_count}{l.dedicated_keys_target ? `/${l.dedicated_keys_target}` : ""}
              </div>
            )}
            {l.quota_limit > 0 && (
              <div className="h-1.5 w-32 bg-base-content/5 rounded-full overflow-hidden p-[1px]">
                <div className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, l.quota_pct)}%`, backgroundColor: quotaColor }}
                />
              </div>
            )}
          </div>
        ) : <span className="text-base-content/60 opacity-30 italic text-xs"> none </span>}
      </td>
      <td className="px-6 py-5 text-center">
        <span className={`text-sm font-bold ${l.activated_sites >= l.max_sites ? "text-warning" : "text-base-content/80"}`}>
          {l.activated_sites}
        </span>
        <span className="text-base-content/60 mx-1">/</span>
        <span className="text-sm font-medium text-base-content/60">{l.max_sites}</span>
      </td>
      <td className="px-6 py-5 text-center">
        <Badge tone={statusTone} className="uppercase text-[9px] font-black tracking-widest px-2.5 py-1">
          {l.status}
        </Badge>
      </td>
      <td className="px-6 py-5 text-right">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <IconButton icon={Edit2} label="Sa" size="sm" onClick={onOpen} />
          {l.status === "active" ? (
             <IconButton icon={Slash} label="H?y" size="sm" onClick={onRevoke} className="hover:text-danger" />
          ) : (
             <IconButton icon={Check} label="Kch ho?t" size="sm" onClick={onReactivate} className="hover:text-success" />
          )}
          <IconButton icon={Trash2} label="Xa" size="sm" onClick={onDelete} className="hover:text-danger" />
        </div>
      </td>
    </tr>
  );
}

export default AdminLicensesPage;
