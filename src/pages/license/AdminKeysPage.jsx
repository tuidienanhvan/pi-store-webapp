import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminTableSkeleton } from "@/components/skeletons/AdminTableSkeleton";
import { api, withDelay } from "@/lib/api-client";
import { useListFilters, useDebouncedValue } from "@/hooks/useListFilters";
import { useAdminT } from "@/lib/translations";
import {
  Alert, Badge, Button, Card, Checkbox, EmptyState, Input,
  Modal, Select, Table, Textarea,
} from "@/components/ui";
import { Loader2, Upload, Plus, Key, Search, X, EyeOff, Eye, Check, Copy } from "lucide-react";
import { AdminStatCard } from "@/pages/core/components/AdminStatCard";
import "./AdminKeysPage.css";

const STATUS_TONES = {
  available: "neutral",
  allocated: "brand",
  exhausted: "warning",
  banned: "danger",
};

// External signup links for quickly getting free API keys
const PROVIDER_SIGNUP_LINKS = {
  "groq-llama-70b-free": "https://console.groq.com/keys",
  "cerebras-llama-free": "https://cloud.cerebras.ai/platform/",
  "gemini-2-flash-free": "https://aistudio.google.com/apikey",
  "gemini-25-flash-free": "https://aistudio.google.com/apikey",
  "mistral-small-free": "https://console.mistral.ai/api-keys",
  "cohere-command-free": "https://dashboard.cohere.com/api-keys",
  "openrouter-free": "https://openrouter.ai/keys",
  "siliconflow-qwen-free": "https://cloud.siliconflow.cn/account/ak",
  "github-models-free": "https://github.com/settings/tokens",
  "cloudflare-llama-free": "https://dash.cloudflare.com/profile/api-tokens",
  "nvidia-nim-free": "https://build.nvidia.com/",
  "zhipu-glm-flash-free": "https://open.bigmodel.cn/usercenter/apikeys",
  "moonshot-kimi-free": "https://platform.moonshot.cn/console/api-keys",
  "deepseek-chat-trial": "https://platform.deepseek.com/api_keys",
  "together-llama-free": "https://api.together.xyz/settings/api-keys",
  "fireworks-llama-free": "https://fireworks.ai/api-keys",
  "sambanova-llama-free": "https://cloud.sambanova.ai/apis",
  "hyperbolic-llama-trial": "https://app.hyperbolic.xyz/settings",
  "qwen-turbo-trial": "https://dashscope.console.aliyun.com/apiKey",
  "nebius-llama-trial": "https://studio.nebius.com/settings/api-keys",
  "openai-gpt4o-paid": "https://platform.openai.com/api-keys",
  "anthropic-sonnet-paid": "https://console.anthropic.com/settings/keys",
  "grok-4-paid": "https://console.x.ai/",
  "huggingface-free": "https://huggingface.co/settings/tokens",
  "perplexity-online-paid": "https://www.perplexity.ai/settings/api",
  "replicate-api": "https://replicate.com/account/api-tokens",
  "anyscale-endpoints": "https://app.endpoints.anyscale.com/credentials",
  "huggingface-pro": "https://huggingface.co/settings/tokens",
  "aws-bedrock-api": "https://console.aws.amazon.com/bedrock",
  "azure-openai-api": "https://portal.azure.com/",
  "google-vertex-api": "https://console.cloud.google.com/vertex-ai",
  "databricks-dbrx-api": "https://docs.databricks.com/en/machine-learning/model-serving/index.html",
  "ai21-studio-api": "https://studio.ai21.com/account/api-key",
  "aleph-alpha-api": "https://app.aleph-alpha.com/profile",
  "baseten-api": "https://app.baseten.co/settings/api_keys",
  "runpod-api": "https://www.runpod.io/console/serverless/user/settings",
  "ollama-local": "http://localhost:11434",
  "lmstudio-local": "http://localhost:1234",
};

const KEY_DEFAULTS = {
  q: "", provider_id: "", status: "", health_status: "", license_id: "",
  sort: "-id", limit: 100, offset: 0,
};

export function AdminKeysPage() {
  const t = useAdminT();
  const { filters, setFilters, reset, hasActive } = useListFilters(KEY_DEFAULTS);
  const [searchInput, setSearchInput] = useState(filters.q || "");
  const debouncedQ = useDebouncedValue(searchInput, 300);

  const [keys, setKeys] = useState([]);
  const [summary, setSummary] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addModal, setAddModal] = useState(null);
  const [showBulk, setShowBulk] = useState(false);
  const [allocTarget, setAllocTarget] = useState(null);

  useEffect(() => {
    if (debouncedQ !== filters.q) setFilters({ q: debouncedQ, offset: 0 });
  }, [debouncedQ, filters.q, setFilters]);

  const load = useCallback(async () => {
    withDelay(Promise.all([
      api.admin.keys(filters),
      api.admin.keysSummary(),
      api.admin.providers(),
    ]), 1000)
      .then(([k, s, p]) => {
        setKeys(k.items || []);
        setSummary(s.items || []);
        setProviders(p.items || []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  const totals = useMemo(() => summary.reduce((acc, r) => ({
    total: acc.total + r.total,
    available: acc.available + r.available,
    allocated: acc.allocated + r.allocated,
    exhausted: acc.exhausted + r.exhausted,
    banned: acc.banned + r.banned,
  }), { total: 0, available: 0, allocated: 0, exhausted: 0, banned: 0 }), [summary]);

  const isEmpty = !loading && totals.total === 0;

  const handleDelete = async (k) => {
    if (!confirm(`Xo key "${k.label || k.key_masked}"?`)) return;
    try { await api.admin.deleteKey(k.id); load(); } catch (e) { setError(e.message); }
  };
  const handleRevoke = async (k) => {
    try { await api.admin.revokeKey(k.id); load(); } catch (e) { setError(e.message); }
  };
  
  const [testingKeyId, setTestingKeyId] = useState(null);
  const handleTestKey = async (k) => {
    setTestingKeyId(k.id);
    try {
      await new Promise(r => setTimeout(r, 600));
      alert(`Test gi? l?p thnh cng! (Endpoint GET /v1/admin/keys/${k.id}/test dang chua c).`);
      load();
    } catch (e) {
      alert(`Test failed: ${e.message}`);
    } finally {
      setTestingKeyId(null);
    }
  };
  const handleResetPeriod = async () => {
    if (!confirm("Reset monthly counters cho T?T C? keys? (Bnh thu?ng cron t? ch?y d?u thng)")) return;
    try { await api.admin.resetKeyPeriod(); load(); } catch (e) { setError(e.message); }
  };

  if (loading && keys.length === 0) return <AdminTableSkeleton />;

  return (
    <div className="keys-page fade-in">
      <header className="keys-header stagger-1">
        <div className="flex flex-col gap-3">
          <h1 className="premium-title">{t.keys_title}</h1>
          <p className="text-base-content/60 opacity-60 font-medium tracking-wide">
            {t.keys_subtitle}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {totals.total > 0 && (
            <Button variant="ghost" onClick={handleResetPeriod} className="h-[48px] px-6 rounded-2xl border border-base-border-subtle font-black uppercase tracking-widest text-[10px]">
              <Loader2 size={16} className="mr-2 animate-spin" /> {t.reset_period}
            </Button>
          )}
          <Button variant="ghost" onClick={() => setShowBulk(true)} className="h-[48px] px-6 rounded-2xl border border-base-border-subtle font-black uppercase tracking-widest text-[10px]">
            <Upload size={16} className="mr-2" /> {t.bulk_import}
          </Button>
          <Button variant="primary" onClick={() => setAddModal({})} className="h-[48px] px-8 rounded-2xl shadow-brand/20 shadow-lg font-black uppercase tracking-widest text-xs">
            <Plus size={18} className="mr-2" /> {t.add_key_btn}
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 stagger-2">
        <AdminStatCard title={t.stat_total} value={totals.total} />
        <AdminStatCard title={t.stat_available} value={totals.available} variant="outline" />
        <AdminStatCard title={t.stat_allocated} value={totals.allocated} variant="brand" />
        <AdminStatCard title={t.stat_exhausted} value={totals.exhausted} className="text-warning" />
        <AdminStatCard title={t.stat_banned} value={totals.banned} className="text-danger" />
      </div>

      {error && <Alert tone="danger" onDismiss={() => setError("")} className="stagger-1">{error}</Alert>}

      {isEmpty && (
        <Card className="onboard-card stagger-3">
          <div className="onboard-content">
            <div className="onboard-icon-wrap">
              <Key size={32} />
            </div>
            <h2 className="premium-title text-2xl text-center mb-2">{t.pool_empty_title}</h2>
            <p className="onboard-desc">{t.pool_empty_desc}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              <OnboardStep
                num={1} title="ang k free key"
                desc="Khuy?n ngh? b?t d?u v?i Groq (30 req/pht, mi?n ph, khng c?n th?)."
                actionLabel="M? Groq ?"
                actionHref="https://console.groq.com/keys"
              />
              <OnboardStep
                num={2} title="Thm key d?u tin"
                desc="Paste key vo dialog  Pi t? mask key, ?n v?i khch."
                actionLabel="+ Thm key"
                onAction={() => setAddModal({ provider_id: providers.find((p) => p.slug === "groq-llama-70b-free")?.id || providers[0]?.id })}
              />
              <OnboardStep
                num={3} title="Ho?c nh?p hng lo?t"
                desc="C s?n 50 keys? Paste CSV d? import 1 l?n."
                actionLabel="Bulk import"
                onAction={() => setShowBulk(true)}
              />
            </div>
          </div>
        </Card>
      )}

      {!isEmpty && (
        <section className="stagger-3">
          <h2 className="section-title">Pool by provider</h2>
          <Card className="keys-table-card">
            <Table className="keys-table">
              <thead>
                <tr>
                  <th>Provider</th>
                  <th className="text-right">T?ng</th>
                  <th className="text-right">Available</th>
                  <th className="text-right">Allocated</th>
                  <th className="text-right">Exhausted</th>
                  <th className="text-right">Banned</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {summary.map((r) => {
                  const signupUrl = PROVIDER_SIGNUP_LINKS[r.slug];
                  return (
                    <tr key={r.provider_id}>
                      <td>
                        <div className="slug-group">
                          <span className="slug-text">{r.slug}</span>
                          {signupUrl && (
                            <a href={signupUrl} target="_blank" rel="noreferrer noopener" className="slug-link">
                              L?y key ti dy ?
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="text-right font-black">{r.total}</td>
                      <td className={`text-right ${r.available > 0 ? "text-base-content" : "opacity-30"}`}>{r.available}</td>
                      <td className={`text-right ${r.allocated > 0 ? "text-primary" : "opacity-30"}`}>{r.allocated}</td>
                      <td className={`text-right ${r.exhausted > 0 ? "text-warning" : "opacity-30"}`}>{r.exhausted}</td>
                      <td className={`text-right ${r.banned > 0 ? "text-danger" : "opacity-30"}`}>{r.banned}</td>
                      <td className="text-right">
                        <Button size="sm" variant="ghost" onClick={() => setAddModal({ provider_id: r.provider_id })} className="rounded-xl border border-base-border hover:border-primary-soft text-[10px] font-black uppercase tracking-widest">
                          <Plus size={14} className="mr-1.5" /> Key
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card>
        </section>
      )}

      {!isEmpty && (
        <section className="stagger-4">
          <header className="flex flex-wrap items-center justify-between gap-6 mb-6">
            <h2 className="section-title m-0">All keys ({keys.length})</h2>
            <div className="flex flex-wrap items-center gap-3">
              <Input type="search" placeholder="Tm label/notes"
                value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
                leadingIcon={Search} className="w-56" />
              <Input type="number" placeholder="License ID"
                value={filters.license_id || ""} onChange={(e) => setFilters({ license_id: e.target.value, offset: 0 })}
                className="w-32" />
              <Select value={filters.provider_id}
                onChange={(e) => setFilters({ provider_id: e.target.value, offset: 0 })}
                options={[
                  { label: "Tt c providers", value: "" },
                  ...providers.map((p) => ({ value: String(p.id), label: p.slug })),
                ]} />
              <Select value={filters.status}
                onChange={(e) => setFilters({ status: e.target.value, offset: 0 })}
                options={[
                  { label: "Mi status", value: "" },
                  { label: "available", value: "available" },
                  { label: "allocated", value: "allocated" },
                  { label: "exhausted", value: "exhausted" },
                  { label: "banned", value: "banned" },
                ]} />
              <Select value={filters.health_status}
                onChange={(e) => setFilters({ health_status: e.target.value, offset: 0 })}
                options={[
                  { label: "Mi health", value: "" },
                  { label: "healthy", value: "healthy" },
                  { label: "degraded", value: "degraded" },
                  { label: "down", value: "down" },
                ]} />
              <Select value={filters.sort}
                onChange={(e) => setFilters({ sort: e.target.value })}
                options={[
                  { label: "Mi nh?t", value: "-id" },
                  { label: "Used nhi?u nh?t", value: "-monthly_used_tokens" },
                  { label: "Fail nhi?u nh?t", value: "-consecutive_failures" },
                  { label: "Success g?n nh?t", value: "-last_success_at" },
                ]} />
              {hasActive && (
                <Button variant="ghost" size="sm" onClick={() => { setSearchInput(""); reset(); }} className="rounded-xl font-black uppercase text-[10px]">
                  <X size={14} className="mr-1" /> Clear
                </Button>
              )}
            </div>
          </header>

          <Card className="keys-table-card">
            <Table className="keys-table">
              <thead>
                <tr>
                  <th>Provider</th>
                  <th>Label / Key</th>
                  <th>Status</th>
                  <th>Owner</th>
                  <th>Health</th>
                  <th>Quota</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {keys.map((k) => (
                  <tr key={k.id} className="group hover:bg-base-content/[0.01]">
                    <td className="font-mono text-xs opacity-60">{k.provider_slug}</td>
                    <td><KeyCell k={k} /></td>
                    <td>
                      <Badge tone={STATUS_TONES[k.status] || "neutral"} className="uppercase text-[9px] font-black tracking-widest px-2.5 py-1">
                        {k.status}
                      </Badge>
                    </td>
                    <td>
                      {k.allocated_to_license_id
                        ? <div className="flex flex-col">
                            <span className="text-xs font-black text-primary tracking-widest">#{k.allocated_to_license_id}</span>
                            <span className="text-[11px] text-base-content/60 opacity-50 truncate max-w-[120px]">{k.allocated_to_email}</span>
                          </div>
                        : <span className="opacity-20"></span>}
                    </td>
                    <td>
                      <Badge tone={k.health_status === "healthy" ? "success" : k.health_status === "down" ? "danger" : "warning"} className="uppercase text-[9px] font-black tracking-widest px-2.5 py-1">
                        {k.health_status}
                      </Badge>
                      {k.consecutive_failures > 0 && (
                        <div className="text-[10px] text-danger opacity-60 mt-1 font-bold">{k.consecutive_failures} fails</div>
                      )}
                    </td>
                    <td className="font-mono text-xs">
                      {k.monthly_quota_tokens > 0
                        ? <div className="flex flex-col">
                            <span className="font-bold text-base-content/80">{formatNum(k.monthly_used_tokens)}</span>
                            <span className="text-[10px] opacity-30">/ {formatNum(k.monthly_quota_tokens)}</span>
                          </div>
                        : <span className="font-bold text-base-content/60">{formatNum(k.monthly_used_tokens)}</span>}
                    </td>
                    <td className="text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <Button size="sm" variant="ghost" disabled={testingKeyId === k.id} onClick={() => handleTestKey(k)} className="h-8 text-[10px] font-black uppercase tracking-widest rounded-lg">
                          {testingKeyId === k.id ? "Testing" : "Test"}
                        </Button>
                        {k.status === "allocated" && (
                          <Button size="sm" variant="ghost" onClick={() => handleRevoke(k)} className="h-8 text-[10px] font-black uppercase tracking-widest rounded-lg">Revoke</Button>
                        )}
                        {k.status === "available" && (
                          <Button size="sm" variant="ghost" onClick={() => setAllocTarget(k)} className="h-8 text-[10px] font-black uppercase tracking-widest rounded-lg">Allocate</Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(k)} className="h-8 text-[10px] font-black uppercase tracking-widest rounded-lg hover:text-danger">Xo</Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {keys.length === 0 && !loading && (
                  <tr><td colSpan="7" className="py-20"><EmptyState icon={Key} title="Khng c key match filter" description="?i filter." /></td></tr>
                )}
              </tbody>
            </Table>
          </Card>
        </section>
      )}

      {addModal !== null && (
        <AddKeyModal prefillProviderId={addModal.provider_id} providers={providers}
          onClose={() => setAddModal(null)} onSaved={load} />
      )}
      <BulkImportModal open={showBulk} onClose={() => setShowBulk(false)} onSaved={load} providers={providers} />
      <AllocateModal keyObj={allocTarget} onClose={() => setAllocTarget(null)} onSaved={load} />
    </div>
  );
}

const formatNum = (num) => Number(num || 0).toLocaleString("vi-VN");

function OnboardStep({ num, title, desc, actionLabel, actionHref, onAction }) {
  return (
    <div className="flex flex-col items-start gap-3 p-5 rounded-2xl bg-base-300/50 border border-base-border-subtle">
      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-xs">{num}</div>
      <h3 className="text-sm font-bold text-base-content">{title}</h3>
      <p className="text-[11px] text-base-content/60 opacity-70 leading-relaxed">{desc}</p>
      {actionHref ? (
        <a href={actionHref} target="_blank" rel="noreferrer" className="text-[10px] font-black uppercase text-primary hover:text-primary-soft mt-auto pt-2">{actionLabel}</a>
      ) : (
        <button type="button" onClick={onAction} className="text-[10px] font-black uppercase text-primary hover:text-primary-soft mt-auto pt-2">{actionLabel}</button>
      )}
    </div>
  );
}

function AddKeyModal({ _prefillProviderId, _providers, onClose, _onSaved }) {
  return (
    <Modal open={true} onClose={onClose} title="Thm Key" size="md">
      <div className="p-4 text-center">
        <p className="text-base-content/60 mb-4 opacity-50">Component AddKeyModal placeholder...</p>
        <Button variant="primary" onClick={onClose}>ng</Button>
      </div>
    </Modal>
  );
}

function BulkImportModal({ open, onClose, _onSaved, _providers }) {
  if (!open) return null;
  return (
    <Modal open={true} onClose={onClose} title="Import hng lo?t" size="lg">
      <div className="p-4 text-center">
        <p className="text-base-content/60 mb-4 opacity-50">Component BulkImportModal placeholder...</p>
        <Button variant="primary" onClick={onClose}>ng</Button>
      </div>
    </Modal>
  );
}

function AllocateModal({ keyObj, onClose, _onSaved }) {
  if (!keyObj) return null;
  return (
    <Modal open={true} onClose={onClose} title="C?p pht Key" size="md">
      <div className="p-4 text-center">
        <p className="text-base-content/60 mb-4 opacity-50">Component AllocateModal placeholder...</p>
        <Button variant="primary" onClick={onClose}>ng</Button>
      </div>
    </Modal>
  );
}

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
    <div className="key-cell-root">
      <div className="text-[13px] font-bold text-base-content group-hover:text-primary transition-colors mb-1">
        {k.label || <span className="opacity-20"></span>}
      </div>
      <div className="flex items-center gap-2">
        <code className={`key-cell-code ${fullKey ? "is-revealed" : "is-masked"}`}>
          {fullKey || k.key_masked}
        </code>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {(() => {
            const IconComponent = fullKey ? EyeOff : Eye;
            const CopyIcon = copied ? Check : Copy;
            return (
              <>
                <button type="button" onClick={toggle} disabled={loading}
                  title={fullKey ? "?n key" : "Hi?n full key"}
                  className="p-1.5 rounded-lg hover:bg-base-content/[0.05] text-base-content/60 transition-colors">
                  <IconComponent size={14} />
                </button>
                <button type="button" onClick={copy}
                  title={copied ? " copy" : "Copy key"}
                  className={`p-1.5 rounded-lg hover:bg-base-content/[0.05] transition-colors ${copied ? "text-success" : "text-base-content/60"}`}>
                  <CopyIcon size={14} />
                </button>
              </>
            );
          })()}
        </div>
      </div>
      {err && <div className="text-[10px] text-danger mt-1">{err}</div>}
    </div>
  );
}

export default AdminKeysPage;
