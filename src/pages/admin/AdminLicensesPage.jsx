import { useEffect, useState } from "react";
import { api } from "../../lib/api-client";
import { useListFilters, useDebouncedValue } from "../../hooks/useListFilters";
import { useLocale } from "../../context/LocaleContext";
import { useAdminT, formatDate as i18nDate, formatRelative as i18nRel, formatTokens as i18nTokens } from "../../lib/adminI18n";
import { copyToClipboard, maskKey } from "../../lib/format";
import { Alert, Badge, Button, Card, Checkbox, EmptyState, Icon, Input, Modal, Select, Table, Textarea } from "../../components/ui";
import "./AdminLicensesPage.css";

// Alias for drop-in replacement with old names in this file
const formatDate = i18nDate;
const formatRelative = i18nRel;
const formatTokens = i18nTokens;

const PLUGIN_OPTIONS = [
  "pi-seo", "pi-chatbot", "pi-leads", "pi-analytics",
  "pi-performance", "pi-dashboard",
  "pi-bundle-business", "pi-bundle-agency",
];

const DEFAULTS = {
  q: "", tier: "", status: "", plugin: "", package: "", expires_in: "",
  sort: "-created_at", limit: 50, offset: 0,
};

export function AdminLicensesPage() {
  const { locale } = useLocale();
  const t = useAdminT();
  const { filters, setFilter, setFilters, reset, hasActive } = useListFilters(DEFAULTS);
  const [searchInput, setSearchInput] = useState(filters.q || "");
  const debouncedQ = useDebouncedValue(searchInput, 300);

  const [data, setData] = useState({ items: [], total: 0, facets: {} });
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [detailId, setDetailId] = useState(null);

  // Push debounced search to URL
  useEffect(() => {
    if (debouncedQ !== filters.q) setFilters({ q: debouncedQ, offset: 0 });
  }, [debouncedQ]); // eslint-disable-line

  // Load packages once for filter dropdown + detail modal
  useEffect(() => { api.admin.packages().then((r) => setPackages(r.items || [])); }, []);

  // Load data whenever filters change
  useEffect(() => {
    setLoading(true); setErr("");
    api.admin.licenses(filters)
      .then((res) => setData(res))
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [filters.q, filters.tier, filters.status, filters.plugin, filters.package,
      filters.expires_in, filters.sort, filters.limit, filters.offset]); // eslint-disable-line

  const handleRevoke = async (l) => {
    if (!confirm(`Revoke license #${l.id} (${l.email})?`)) return;
    try { await api.admin.revokeLicense(l.id); refresh(); } catch (e) { setErr(e.message); }
  };
  const handleReactivate = async (l) => {
    try { await api.admin.reactivateLicense(l.id); refresh(); } catch (e) { setErr(e.message); }
  };
  const handleDelete = async (l) => {
    if (!confirm(`XOÁ VĨNH VIỄN license #${l.id} (${l.email})?\nKeys đã cấp sẽ tự động trả về pool. Không undo được.`)) return;
    try { await api.admin.deleteLicense(l.id); refresh(); } catch (e) { setErr(e.message); }
  };
  const refresh = () => setFilter("offset", filters.offset); // re-fetch

  const page = Math.floor(filters.offset / filters.limit) + 1;
  const totalPages = Math.max(1, Math.ceil(data.total / filters.limit));
  const facets = data.facets || {};

  return (
    <div className="licenses-page">
      <header className="licenses-header">
        <div className="stack" style={{ gap: "var(--s-2)" }}>
          <h1>{t.licenses_title}</h1>
          <p>{t.licenses_subtitle}</p>
        </div>
        <Button variant="primary" onClick={() => setShowCreate(true)}>
          <Icon name="plus" size={16} /> {t.create_license}
        </Button>
      </header>

      {err && <Alert tone="danger" onDismiss={() => setErr("")}>{err}</Alert>}

      {/* ─── Filter toolbar ─── */}
      <Card className="licenses-toolbar-card" style={{ padding: "var(--s-4)" }}>
        <div className="licenses-toolbar">
          <Input
            type="search" placeholder={t.search_license_placeholder}
            value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
            leadingIcon="search"
          />
          <Select value={filters.status}
            onChange={(e) => setFilters({ status: e.target.value, offset: 0 })}
            options={[
              { label: `${t.all} ${t.filter_status}`, value: "" },
              { label: `${t.status_active} (${facets.by_status?.active || 0})`, value: "active" },
              { label: `${t.status_revoked} (${facets.by_status?.revoked || 0})`, value: "revoked" },
              { label: `${t.status_expired} (${facets.by_status?.expired || 0})`, value: "expired" },
            ]} />
          <Select value={filters.tier}
            onChange={(e) => setFilters({ tier: e.target.value, offset: 0 })}
            options={[
              { label: `${t.all} ${t.filter_tier}`, value: "" },
              { label: `Free (${facets.by_tier?.free || 0})`, value: "free" },
              { label: `Pro (${facets.by_tier?.pro || 0})`, value: "pro" },
            ]} />
          <Select value={filters.package}
            onChange={(e) => setFilters({ package: e.target.value, offset: 0 })}
            options={[
              { label: `${t.all} ${t.filter_package}`, value: "" },
              ...packages.map((p) => ({
                value: p.slug,
                label: `${p.display_name} (${facets.by_package?.[p.slug] || 0})`,
              })),
            ]} />
          <Select value={filters.plugin}
            onChange={(e) => setFilters({ plugin: e.target.value, offset: 0 })}
            options={[
              { label: `${t.all} ${t.filter_plugin}`, value: "" },
              ...PLUGIN_OPTIONS.map((s) => ({
                value: s,
                label: `${s} (${facets.by_plugin?.[s] || 0})`,
              })),
            ]} />
          <Select value={filters.expires_in}
            onChange={(e) => setFilters({ expires_in: e.target.value, offset: 0 })}
            options={[
              { label: `${t.all} ${t.filter_expires}`, value: "" },
              { label: t.expires_7d, value: "7d" },
              { label: t.expires_30d, value: "30d" },
              { label: t.expires_90d, value: "90d" },
              { label: t.expires_past, value: "expired" },
            ]} />
          <Select value={filters.sort}
            onChange={(e) => setFilters({ sort: e.target.value })}
            options={[
              { label: t.sort_newest, value: "-created_at" },
              { label: t.sort_oldest, value: "created_at" },
              { label: t.sort_expiring, value: "expires_at" },
              { label: t.sort_expires_far, value: "-expires_at" },
            ]} />
          {hasActive && (
            <Button variant="ghost" onClick={() => { setSearchInput(""); reset(); }}>
              <Icon name="x" size={14} /> {t.clear}
            </Button>
          )}
        </div>
      </Card>

      {/* ─── Stats summary ─── */}
      <div className="licenses-stats">
        <span>Tổng: <strong>{data.total}</strong></span>
        {hasActive && <span>(đã lọc từ {Object.values(facets.by_status || {}).reduce((a, b) => a + b, 0)} licenses)</span>}
        {loading && <span>Đang tải…</span>}
      </div>

      {/* ─── Table ─── */}
      <Card className="licenses-table-card">
        <Table className="licenses-table">
          <thead>
            <tr>
              <th>{t.license_id}</th>
              <th className="column-key">{t.license_key}</th>
              <th>{t.customer}</th>
              <th>{t.plugin}</th>
              <th>{t.package_quota}</th>
              <th className="column-sites">{t.sites}</th>
              <th className="column-status">{t.status}</th>
              <th className="column-keys">{t.keys}</th>
              <th>{t.expires}</th>
              <th className="column-actions"></th>
            </tr>
          </thead>
          <tbody>
            {data.items.length === 0 && !loading && (
              <tr><td colSpan="10">
                <EmptyState
                  icon="key"
                  title={hasActive ? "Không match filter" : "Chưa có license"}
                  description={hasActive ? "Thử đổi filter hoặc Clear." : "Tạo license đầu tiên cho khách."}
                  action={hasActive
                    ? <Button variant="ghost" onClick={() => { setSearchInput(""); reset(); }}>Clear filters</Button>
                    : <Button variant="primary" onClick={() => setShowCreate(true)}>+ Tạo license</Button>}
                />
              </td></tr>
            )}
            {data.items.map((l) => (
              <LicenseRow key={l.id} l={l}
                onOpen={() => setDetailId(l.id)}
                onRevoke={() => handleRevoke(l)}
                onReactivate={() => handleReactivate(l)}
                onDelete={() => handleDelete(l)}
              />
            ))}
          </tbody>
        </Table>
      </Card>

      {/* ─── Pagination ─── */}
      {data.total > filters.limit && (
        <div className="licenses-pagination">
          <div>
            {t.page} <strong style={{ color: "var(--text-1)" }}>{page}</strong> {t.of} {totalPages} — {t.showing} {filters.offset + 1}-{Math.min(filters.offset + filters.limit, data.total)} / {data.total}
          </div>
          <div className="licenses-pagination__controls">
            <Select value={filters.limit}
              onChange={(e) => setFilters({ limit: Number(e.target.value), offset: 0 })}
              options={[25, 50, 100, 200].map((n) => ({ value: n, label: `${n}${t.per_page}` }))}
              style={{ width: "120px" }} />
            <Button variant="ghost" disabled={page <= 1}
              onClick={() => setFilter("offset", Math.max(0, filters.offset - filters.limit))}>
              {t.prev}
            </Button>
            <Button variant="ghost" disabled={page >= totalPages}
              onClick={() => setFilter("offset", filters.offset + filters.limit)}>
              {t.next}
            </Button>
          </div>
        </div>
      )}

      {/* ─── Modals ─── */}
      <CreateLicenseModal open={showCreate} onClose={() => setShowCreate(false)} onCreated={refresh} />
      {detailId !== null && (
        <LicenseDetailModal licenseId={detailId} packages={packages}
          onClose={() => setDetailId(null)} onChanged={refresh} />
      )}
    </div>
  );
}

function LicenseRow({ l, onOpen, onRevoke, onReactivate, onDelete }) {
  const { locale } = useLocale();
  const t = useAdminT();
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const copy = async () => {
    if (await copyToClipboard(l.key)) {
      setCopied(true); setTimeout(() => setCopied(false), 1500);
    }
  };

  const statusTone = l.status === "active" ? "success" : l.status === "revoked" ? "danger" : "warning";
  const quotaColor = l.quota_pct >= 90 ? "var(--danger)" : l.quota_pct >= 70 ? "var(--warning)" : "var(--brand)";

  return (
    <tr>
      <td className="column-id">#{l.id}</td>
      <td className="column-key">
        <div className="key-cell-wrap">
          <code className={`key-cell-code ${showKey ? "is-revealed" : "is-masked"}`}>
            {showKey ? l.key : maskKey(l.key, 8, 4)}
          </code>
          <button type="button" onClick={() => setShowKey(!showKey)} title={showKey ? "Ẩn key" : "Hiện key"}
            style={{ background: "none", border: 0, color: "var(--text-3)", cursor: "pointer", padding: 2, display: "inline-flex", flexShrink: 0 }}>
            <Icon name={showKey ? "eye-off" : "eye"} size={12} />
          </button>
          <button type="button" onClick={copy} aria-label="Copy key" title={copied ? "Đã copy" : "Copy key"}
            style={{ background: "none", border: 0, color: copied ? "var(--success)" : "var(--text-3)", cursor: "pointer", padding: 2, display: "inline-flex", flexShrink: 0 }}>
            <Icon name={copied ? "check" : "copy"} size={12} />
          </button>
        </div>
      </td>
      <td>
        <div style={{ fontWeight: 600, fontSize: "var(--fs-14)" }}>{l.email}</div>
        {l.name && <div style={{ color: "var(--text-3)", fontSize: "var(--fs-12)" }}>{l.name}</div>}
      </td>
      <td style={{ fontSize: "var(--fs-13)", color: "var(--text-2)" }}>{l.plugin}</td>
      <td>
        {/* Package + Quota only applies to Pi AI Cloud licenses (token wallet).
            Plugin licenses (pi-seo-pro, pi-chatbot-pro, …) use tier-based gating, not tokens. */}
        {l.plugin === "pi-ai-cloud" && l.package_slug ? (
          <div className="stack" style={{ gap: "var(--s-1)" }}>
            <div className="row" style={{ gap: "var(--s-2)", alignItems: "center" }}>
              <Badge tone="brand">{l.package_name}</Badge>
              <span style={{ fontSize: "var(--fs-11)", color: "var(--text-3)" }}>
                {formatTokens(l.quota_used)}{l.quota_limit > 0 ? ` / ${formatTokens(l.quota_limit)}` : ""}
              </span>
            </div>
            {l.quota_limit > 0 && (
              <div style={{ height: "4px", width: "120px", background: "var(--surface-2)", borderRadius: "999px", overflow: "hidden" }}>
                <div style={{ width: `${Math.min(100, l.quota_pct)}%`, height: "100%", background: quotaColor }} />
              </div>
            )}
          </div>
        ) : <span style={{ color: "var(--text-3)" }}>—</span>}
      </td>
      <td className="column-sites">{l.activated_sites}/{l.max_sites}</td>
      <td className="column-status"><Badge tone={statusTone}>{l.status}</Badge></td>
      <td className="column-keys">
        {l.allocated_keys_count > 0
          ? <Badge tone="neutral">{l.allocated_keys_count}</Badge>
          : <span style={{ color: "var(--danger)", fontSize: "var(--fs-12)" }}>0</span>}
      </td>
      <td style={{ fontSize: "var(--fs-13)", color: "var(--text-2)" }} title={l.expires_at || ""}>
        {l.expires_at ? formatRelative(l.expires_at, locale) : "—"}
      </td>
      <td className="column-actions">
        <div className="row-actions">
          <Button size="sm" variant="ghost" onClick={onOpen}>{t.details}</Button>
          {l.status === "active"
            ? <Button size="sm" variant="ghost" onClick={onRevoke}>{t.revoke}</Button>
            : <Button size="sm" variant="ghost" onClick={onReactivate}>{t.reactivate}</Button>}
          <Button size="sm" variant="danger" onClick={onDelete}>{t.delete}</Button>
        </div>
      </td>
    </tr>
  );
}

// ─── Detail modal ────────────────────────────────────────

function LicenseDetailModal({ licenseId, packages, onClose, onChanged }) {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [pkg, setPkg] = useState(null);
  const [keys, setKeys] = useState([]);
  const [providers, setProviders] = useState([]);
  const [showAlloc, setShowAlloc] = useState(false);

  const load = async () => {
    setLoading(true); setErr("");
    try {
      const [p, keysRes, provRes] = await Promise.all([
        api.admin.getLicensePackage(licenseId).catch(() => null),
        api.admin.keys({ license_id: licenseId, limit: 200 }),
        api.admin.providers(),
      ]);
      setPkg(p); setKeys(keysRes?.items || []); setProviders(provRes?.items || []);
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [licenseId]); // eslint-disable-line

  const assignPkg = async (slug) => {
    try { await api.admin.assignPackage(licenseId, { package_slug: slug }); await load(); onChanged(); }
    catch (e) { setErr(e.message); }
  };
  const revokeKey = async (kid) => {
    try { await api.admin.revokeKey(kid); load(); onChanged(); } catch (e) { setErr(e.message); }
  };
  const resetPeriod = async () => {
    if (!confirm("Reset current_period_tokens_used về 0?")) return;
    try { await api.admin.resetLicensePeriod(licenseId); load(); } catch (e) { setErr(e.message); }
  };

  return (
    <Modal open={true} onClose={onClose} title={`License #${licenseId}`} size="lg">
      {err && <Alert tone="danger" onDismiss={() => setErr("")}>{err}</Alert>}

      {loading ? <p style={{ color: "var(--text-3)" }}>Đang tải…</p> : (
        <div className="stack" style={{ gap: "var(--s-6)" }}>

          <section>
            <h3 style={{ margin: "0 0 var(--s-3)", fontSize: "var(--fs-18)" }}>Cloud Package</h3>
            {pkg ? (
              <Card style={{ padding: "var(--s-5)" }}>
                <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap", gap: "var(--s-3)" }}>
                  <div>
                    <div style={{ fontSize: "var(--fs-20)", fontWeight: 600 }}>{pkg.package_name}</div>
                    <div style={{ fontSize: "var(--fs-13)", color: "var(--text-2)", marginTop: "var(--s-1)" }}>
                      {formatTokens(pkg.current_period_tokens_used)} / {formatTokens(pkg.token_quota_monthly)} Pi tokens
                      <span style={{ margin: "0 var(--s-2)" }}>•</span>
                      Period: {formatDate(pkg.current_period_started_at)}
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={resetPeriod}>Reset period</Button>
                </div>
                {pkg.token_quota_monthly > 0 && (
                  <div style={{ height: "6px", background: "var(--surface-2)", borderRadius: "999px", marginTop: "var(--s-3)", overflow: "hidden" }}>
                    <div style={{
                      width: `${Math.min(100, (pkg.current_period_tokens_used / pkg.token_quota_monthly) * 100)}%`,
                      height: "100%", background: "var(--brand)",
                    }} />
                  </div>
                )}
              </Card>
            ) : (
              <Card style={{ padding: "var(--s-5)", textAlign: "center", color: "var(--text-3)" }}>
                Chưa assign gói. Chọn bên dưới ↓
              </Card>
            )}

            <div className="row" style={{ gap: "var(--s-2)", marginTop: "var(--s-3)", flexWrap: "wrap" }}>
              <span style={{ fontSize: "var(--fs-13)", color: "var(--text-2)", alignSelf: "center" }}>Đổi gói:</span>
              {packages.map((p) => (
                <Button key={p.slug} size="sm"
                  variant={pkg?.package_slug === p.slug ? "primary" : "ghost"}
                  onClick={() => assignPkg(p.slug)}>
                  {p.display_name} (${(p.price_cents_monthly / 100).toFixed(0)}/mo)
                </Button>
              ))}
            </div>
          </section>

          <section>
            <div className="row" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: "var(--s-3)" }}>
              <h3 style={{ margin: 0, fontSize: "var(--fs-18)" }}>Allocated keys ({keys.length})</h3>
              <Button size="sm" variant="primary" onClick={() => setShowAlloc(true)}>
                <Icon name="plus" size={14} /> Cấp thêm
              </Button>
            </div>
            {keys.length === 0 ? (
              <Card style={{ padding: "var(--s-5)", textAlign: "center", color: "var(--text-3)" }}>
                Chưa cấp key nào. Khách không gọi được API.
              </Card>
            ) : (
              <Card style={{ padding: 0, overflow: "hidden" }}>
                <Table>
                  <thead><tr>
                    <th>Provider</th><th>Key</th><th>Health</th><th>Used</th>
                    <th style={{ textAlign: "right" }}></th>
                  </tr></thead>
                  <tbody>
                    {keys.map((k) => (
                      <tr key={k.id}>
                        <td style={{ fontFamily: "monospace", fontSize: "var(--fs-13)" }}>{k.provider_slug}</td>
                        <td><KeyCell k={k} /></td>
                        <td><Badge tone={k.health_status === "healthy" ? "success" : k.health_status === "down" ? "danger" : "warning"}>{k.health_status}</Badge></td>
                        <td style={{ fontSize: "var(--fs-13)" }}>{formatTokens(k.monthly_used_tokens)}</td>
                        <td style={{ textAlign: "right" }}>
                          <Button size="sm" variant="ghost" onClick={() => revokeKey(k.id)}>Revoke</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card>
            )}
          </section>

          <div className="row" style={{ justifyContent: "flex-end" }}>
            <Button variant="ghost" onClick={onClose}>Đóng</Button>
          </div>
        </div>
      )}

      {showAlloc && (
        <AllocateKeysSubModal licenseId={licenseId} providers={providers}
          onClose={() => setShowAlloc(false)}
          onSaved={() => { setShowAlloc(false); load(); onChanged(); }} />
      )}
    </Modal>
  );
}

/**
 * Key cell — shows label + masked key by default.
 * Click "Show" to fetch raw key from backend (audited).
 * Click again to hide. Copy button always available (copies masked or revealed).
 */
function KeyCell({ k }) {
  const [fullKey, setFullKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [err, setErr] = useState("");

  const toggle = async () => {
    setErr("");
    if (fullKey) {
      setFullKey(null);
      return;
    }
    setLoading(true);
    try {
      const res = await api.admin.revealKey(k.id);
      setFullKey(res.key_value || "");
    } catch (e) {
      setErr(e.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    const text = fullKey || k.key_masked || "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div>
      <div className="row" style={{ gap: "var(--s-1)", alignItems: "center", marginTop: 2 }}>
        <code style={{
          fontFamily: "monospace",
          fontSize: "var(--fs-12)",
          color: fullKey ? "var(--text-1)" : "var(--text-3)",
          background: fullKey ? "var(--surface-2)" : "transparent",
          padding: fullKey ? "2px 6px" : 0,
          borderRadius: "4px",
          maxWidth: "340px",
          display: "inline-block",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}>
          {fullKey || k.key_masked}
        </code>
        <button type="button" onClick={toggle} disabled={loading}
          title={fullKey ? "Ẩn key" : "Hiện full key"}
          style={{
            background: "none", border: 0, cursor: "pointer",
            padding: 2, color: "var(--text-3)", display: "inline-flex",
          }}>
          <Icon name={fullKey ? "eye-off" : "eye"} size={12} />
        </button>
        <button type="button" onClick={copy}
          title={copied ? "Đã copy" : "Copy key"}
          style={{
            background: "none", border: 0, cursor: "pointer",
            padding: 2, color: copied ? "var(--success)" : "var(--text-3)", display: "inline-flex",
          }}>
          <Icon name={copied ? "check" : "copy"} size={12} />
        </button>
      </div>
      {err && <div style={{ fontSize: "var(--fs-11)", color: "var(--danger)" }}>{err}</div>}
    </div>
  );
}

function AllocateKeysSubModal({ licenseId, providers, onClose, onSaved }) {
  const [providerId, setProviderId] = useState(providers[0]?.id || "");
  const [count, setCount] = useState(1);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault(); setSaving(true); setErr("");
    try {
      await api.admin.allocateKeys({
        license_id: licenseId,
        provider_id: Number(providerId),
        count: Number(count),
      });
      onSaved();
    } catch (e2) { setErr(e2.message); }
    finally { setSaving(false); }
  };

  return (
    <Modal open={true} onClose={onClose} title="Cấp keys từ pool" size="md">
      <form onSubmit={submit} className="stack" style={{ gap: "var(--s-4)" }}>
        <Select label="Provider" value={providerId} onChange={(e) => setProviderId(e.target.value)}
          options={providers.map((p) => ({
            value: p.id,
            label: `${p.slug}  •  ${p.keys_available} available / ${p.keys_total} total`,
          }))} />
        <Input label="Số lượng keys" type="number" min={1} max={20} value={count}
          onChange={(e) => setCount(e.target.value)} />
        {err && <Alert tone="danger">{err}</Alert>}
        <div className="row" style={{ justifyContent: "flex-end", gap: "var(--s-2)" }}>
          <Button type="button" variant="ghost" onClick={onClose}>Huỷ</Button>
          <Button type="submit" variant="primary" disabled={saving}>{saving ? "Đang cấp…" : "Cấp keys"}</Button>
        </div>
      </form>
    </Modal>
  );
}

function CreateLicenseModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState({
    plugin: "pi-seo", email: "", name: "", tier: "pro", max_sites: 1, expires_days: 365,
  });
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (open) {
      setResult(null); setErr("");
      setForm({ plugin: "pi-seo", email: "", name: "", tier: "pro", max_sites: 1, expires_days: 365 });
    }
  }, [open]);

  const submit = async (e) => {
    e.preventDefault(); setErr("");
    try {
      const res = await api.admin.createLicense(form);
      setResult(res); onCreated();
    } catch (e2) { setErr(e2.message); }
  };

  return (
    <Modal open={open} onClose={onClose} title="Tạo license mới">
      {result ? (
        <div className="stack" style={{ gap: "var(--s-4)" }}>
          <Alert tone="success">License tạo thành công. Gửi key cho khách:</Alert>
          <Card style={{ background: "var(--surface-2)", border: "1px dashed var(--hairline-strong)", padding: "var(--s-4)" }}>
            <code style={{ fontSize: "var(--fs-16)", fontWeight: 600, color: "var(--brand)", wordBreak: "break-all" }}>{result.key}</code>
          </Card>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button variant="primary" onClick={onClose}>Đóng</Button>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="stack" style={{ gap: "var(--s-3)" }}>
          <Select label="Plugin" value={form.plugin}
            onChange={(e) => setForm({ ...form, plugin: e.target.value })}
            options={PLUGIN_OPTIONS.map((s) => ({ label: s, value: s }))} />
          <Input label="Email" type="email" required value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Tên khách hàng" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <div className="grid --cols-3" style={{ gap: "var(--s-3)" }}>
            <Select label="Tier" value={form.tier}
              onChange={(e) => setForm({ ...form, tier: e.target.value })}
              options={[{ label: "Free", value: "free" }, { label: "Pro", value: "pro" }]} />
            <Input label="Max sites" type="number" min={1} value={form.max_sites}
              onChange={(e) => setForm({ ...form, max_sites: +e.target.value })} />
            <Input label="Hết hạn (ngày)" type="number" min={0} value={form.expires_days}
              onChange={(e) => setForm({ ...form, expires_days: +e.target.value })} />
          </div>
          {err && <Alert tone="danger">{err}</Alert>}
          <div className="row" style={{ justifyContent: "flex-end", gap: "var(--s-2)" }}>
            <Button type="button" variant="ghost" onClick={onClose}>Huỷ</Button>
            <Button type="submit" variant="primary">Tạo</Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
