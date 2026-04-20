import { useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api-client";
import { useListFilters, useDebouncedValue } from "../../hooks/useListFilters";
import { useLocale } from "../../context/LocaleContext";
import { useAdminT, formatTokens as i18nTokens, formatRelative as i18nRel } from "../../lib/adminI18n";
import {
  Alert, Badge, Button, Card, Checkbox, EmptyState, Icon, Input,
  Modal, Select, Table, Textarea,
} from "../../components/ui";

// Aliases so existing calls in this file keep working
const formatTokens = i18nTokens;
const formatRelative = i18nRel;

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
  const { locale } = useLocale();
  const t = useAdminT();
  const { filters, setFilter, setFilters, reset, hasActive } = useListFilters(KEY_DEFAULTS);
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
  }, [debouncedQ]); // eslint-disable-line

  const load = async () => {
    setLoading(true); setError("");
    try {
      const [k, s, p] = await Promise.all([
        api.admin.keys(filters),
        api.admin.keysSummary(),
        api.admin.providers(),
      ]);
      setKeys(k.items || []);
      setSummary(s.items || []);
      setProviders(p.items || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [
    filters.q, filters.provider_id, filters.status, filters.health_status, filters.license_id,
    filters.sort, filters.limit, filters.offset,
  ]); // eslint-disable-line

  const totals = useMemo(() => summary.reduce((acc, r) => ({
    total: acc.total + r.total,
    available: acc.available + r.available,
    allocated: acc.allocated + r.allocated,
    exhausted: acc.exhausted + r.exhausted,
    banned: acc.banned + r.banned,
  }), { total: 0, available: 0, allocated: 0, exhausted: 0, banned: 0 }), [summary]);

  const isEmpty = !loading && totals.total === 0;

  const handleDelete = async (k) => {
    if (!confirm(`Xoá key "${k.label || k.key_masked}"?`)) return;
    try { await api.admin.deleteKey(k.id); load(); } catch (e) { setError(e.message); }
  };
  const handleRevoke = async (k) => {
    try { await api.admin.revokeKey(k.id); load(); } catch (e) { setError(e.message); }
  };
  
  const [testingKeyId, setTestingKeyId] = useState(null);
  const handleTestKey = async (k) => {
    setTestingKeyId(k.id);
    try {
      // Dummy mock delay since endpoint doesn't exist yet
      await new Promise(r => setTimeout(r, 600));
      // const res = await api.admin.testKey(k.id);
      // alert(`Test success! Latency: ${res.latency_ms}ms\nResponse: ${res.response}`);
      alert(`Test giả lập thành công! (Endpoint GET /v1/admin/keys/${k.id}/test đang chưa có).`);
      load();
    } catch (e) {
      alert(`Test failed: ${e.message}`);
    } finally {
      setTestingKeyId(null);
    }
  };
  const handleResetPeriod = async () => {
    if (!confirm("Reset monthly counters cho TẤT CẢ keys? (Bình thường cron tự chạy đầu tháng)")) return;
    try { await api.admin.resetKeyPeriod(); load(); } catch (e) { setError(e.message); }
  };

  return (
    <div className="stack" style={{ gap: "var(--s-8)" }}>
      <header className="row" style={{ justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "var(--s-4)" }}>
        <div className="stack" style={{ gap: "var(--s-2)" }}>
          <h1 style={{ margin: 0, fontSize: "var(--fs-32)" }}>{t.keys_title}</h1>
          <p style={{ margin: 0, color: "var(--text-2)", fontSize: "var(--fs-16)" }}>
            {t.keys_subtitle}
          </p>
        </div>
        <div className="row" style={{ gap: "var(--s-2)" }}>
          {totals.total > 0 && (
            <Button variant="ghost" onClick={handleResetPeriod}>
              <Icon name="loader" size={16} /> {t.reset_period}
            </Button>
          )}
          <Button variant="ghost" onClick={() => setShowBulk(true)}>
            <Icon name="upload" size={16} /> {t.bulk_import}
          </Button>
          <Button variant="primary" onClick={() => setAddModal({})}>
            <Icon name="plus" size={16} /> {t.add_key_btn}
          </Button>
        </div>
      </header>

      <div className="grid --cols-auto" style={{ gap: "var(--s-4)" }}>
        <StatCard label={t.stat_total} value={totals.total} />
        <StatCard label={t.stat_available} value={totals.available} tone="neutral" />
        <StatCard label={t.stat_allocated} value={totals.allocated} tone="brand" />
        <StatCard label={t.stat_exhausted} value={totals.exhausted} tone="warning" />
        <StatCard label={t.stat_banned} value={totals.banned} tone="danger" />
      </div>

      {error && <Alert tone="danger" onDismiss={() => setError("")}>{error}</Alert>}

      {/* ─── Empty state / onboarding ─── */}
      {isEmpty && (
        <Card style={{ padding: "var(--s-8)" }}>
          <div className="stack" style={{ gap: "var(--s-5)", textAlign: "center", maxWidth: "620px", margin: "0 auto" }}>
            <div>
              <div style={{
                width: 64, height: 64, borderRadius: "50%", background: "var(--brand-soft)", color: "var(--brand)",
                display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto var(--s-3)",
              }}>
                <Icon name="key" size={28} />
              </div>
              <h2 style={{ margin: "0 0 var(--s-2)", fontSize: "var(--fs-24)" }}>{t.pool_empty_title}</h2>
              <p style={{ margin: 0, color: "var(--text-2)" }}>{t.pool_empty_desc}</p>
            </div>

            <div className="grid --cols-3" style={{ gap: "var(--s-3)", textAlign: "left" }}>
              <OnboardStep
                num={1} title="Đăng ký free key"
                desc="Khuyến nghị bắt đầu với Groq (30 req/phút, miễn phí, không cần thẻ)."
                actionLabel="Mở Groq →"
                actionHref="https://console.groq.com/keys"
              />
              <OnboardStep
                num={2} title="Thêm key đầu tiên"
                desc="Paste key vào dialog — Pi tự mask key, ẩn với khách."
                actionLabel="+ Thêm key"
                onAction={() => setAddModal({ provider_id: providers.find((p) => p.slug === "groq-llama-70b-free")?.id || providers[0]?.id })}
              />
              <OnboardStep
                num={3} title="Hoặc nhập hàng loạt"
                desc="Có sẵn 50 keys? Paste CSV để import 1 lần."
                actionLabel="Bulk import"
                onAction={() => setShowBulk(true)}
              />
            </div>
          </div>
        </Card>
      )}

      {/* ─── Pool by provider ─── */}
      {!isEmpty && (
        <section>
          <h2 style={{ fontSize: "var(--fs-20)", margin: "0 0 var(--s-3)" }}>Pool by provider</h2>
          <Card style={{ padding: 0, overflow: "hidden" }}>
            <Table>
              <thead>
                <tr>
                  <th>Provider</th>
                  <th style={{ textAlign: "right" }}>Tổng</th>
                  <th style={{ textAlign: "right" }}>Available</th>
                  <th style={{ textAlign: "right" }}>Allocated</th>
                  <th style={{ textAlign: "right" }}>Exhausted</th>
                  <th style={{ textAlign: "right" }}>Banned</th>
                  <th style={{ textAlign: "right" }}></th>
                </tr>
              </thead>
              <tbody>
                {summary.map((r) => {
                  const signupUrl = PROVIDER_SIGNUP_LINKS[r.slug];
                  return (
                    <tr key={r.provider_id}>
                      <td>
                        <div style={{ fontFamily: "monospace", fontSize: "var(--fs-13)" }}>{r.slug}</div>
                        {signupUrl && (
                          <a href={signupUrl} target="_blank" rel="noreferrer noopener"
                            style={{ fontSize: "var(--fs-11)", color: "var(--text-3)", textDecoration: "underline" }}>
                            Lấy key tại đây →
                          </a>
                        )}
                      </td>
                      <td style={{ textAlign: "right", fontWeight: 600 }}>{r.total}</td>
                      <td style={{ textAlign: "right", color: r.available > 0 ? "var(--text-1)" : "var(--text-3)" }}>{r.available}</td>
                      <td style={{ textAlign: "right", color: r.allocated > 0 ? "var(--brand)" : "var(--text-3)" }}>{r.allocated}</td>
                      <td style={{ textAlign: "right", color: r.exhausted > 0 ? "var(--warning)" : "var(--text-3)" }}>{r.exhausted}</td>
                      <td style={{ textAlign: "right", color: r.banned > 0 ? "var(--danger)" : "var(--text-3)" }}>{r.banned}</td>
                      <td style={{ textAlign: "right" }}>
                        <Button size="sm" variant="ghost"
                          onClick={() => setAddModal({ provider_id: r.provider_id })}
                          title={`Thêm key cho ${r.slug}`}>
                          <Icon name="plus" size={14} /> Key
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

      {/* ─── All keys table ─── */}
      {!isEmpty && (
        <section>
          <div className="row" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: "var(--s-3)", flexWrap: "wrap", gap: "var(--s-3)" }}>
            <h2 style={{ fontSize: "var(--fs-20)", margin: 0 }}>All keys ({keys.length})</h2>
            <div className="row" style={{ gap: "var(--s-2)", flexWrap: "wrap" }}>
              <Input type="search" placeholder="Tìm label/notes…"
                value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
                leadingIcon="search" style={{ width: "220px" }} />
              <Input type="number" placeholder="License ID…"
                value={filters.license_id || ""} onChange={(e) => setFilters({ license_id: e.target.value, offset: 0 })}
                style={{ width: "120px" }} />
              <Select value={filters.provider_id}
                onChange={(e) => setFilters({ provider_id: e.target.value, offset: 0 })}
                options={[
                  { label: "Tất cả providers", value: "" },
                  ...providers.map((p) => ({ value: String(p.id), label: p.slug })),
                ]} />
              <Select value={filters.status}
                onChange={(e) => setFilters({ status: e.target.value, offset: 0 })}
                options={[
                  { label: "Mọi status", value: "" },
                  { label: "available", value: "available" },
                  { label: "allocated", value: "allocated" },
                  { label: "exhausted", value: "exhausted" },
                  { label: "banned", value: "banned" },
                ]} />
              <Select value={filters.health_status}
                onChange={(e) => setFilters({ health_status: e.target.value, offset: 0 })}
                options={[
                  { label: "Mọi health", value: "" },
                  { label: "healthy", value: "healthy" },
                  { label: "degraded", value: "degraded" },
                  { label: "down", value: "down" },
                ]} />
              <Select value={filters.sort}
                onChange={(e) => setFilters({ sort: e.target.value })}
                options={[
                  { label: "Mới nhất", value: "-id" },
                  { label: "Used nhiều nhất", value: "-monthly_used_tokens" },
                  { label: "Fail nhiều nhất", value: "-consecutive_failures" },
                  { label: "Success gần nhất", value: "-last_success_at" },
                ]} />
              {hasActive && (
                <Button variant="ghost" size="sm" onClick={() => { setSearchInput(""); reset(); }}>
                  <Icon name="x" size={14} /> Clear
                </Button>
              )}
            </div>
          </div>

          <Card style={{ padding: 0, overflow: "hidden" }}>
            <Table>
              <thead>
                <tr>
                  <th>Provider</th>
                  <th>Label / Key</th>
                  <th>Status</th>
                  <th>Owner</th>
                  <th>Health</th>
                  <th>Quota</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {keys.map((k) => (
                  <tr key={k.id}>
                    <td style={{ fontFamily: "monospace", fontSize: "var(--fs-13)" }}>{k.provider_slug}</td>
                    <td><KeyCell k={k} /></td>
                    <td><Badge tone={STATUS_TONES[k.status] || "neutral"}>{k.status}</Badge></td>
                    <td>
                      {k.allocated_to_license_id
                        ? <span style={{ fontSize: "var(--fs-13)" }}>#{k.allocated_to_license_id}<br /><span style={{ color: "var(--text-3)" }}>{k.allocated_to_email}</span></span>
                        : <span style={{ color: "var(--text-3)" }}>—</span>}
                    </td>
                    <td>
                      <Badge tone={k.health_status === "healthy" ? "success" : k.health_status === "down" ? "danger" : "warning"}>
                        {k.health_status}
                      </Badge>
                      {k.consecutive_failures > 0 && (
                        <div style={{ fontSize: "var(--fs-11)", color: "var(--text-3)" }}>{k.consecutive_failures} fails</div>
                      )}
                    </td>
                    <td style={{ fontSize: "var(--fs-13)" }}>
                      {k.monthly_quota_tokens > 0
                        ? `${formatNum(k.monthly_used_tokens)} / ${formatNum(k.monthly_quota_tokens)}`
                        : formatNum(k.monthly_used_tokens)}
                    </td>
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <Button size="sm" variant="ghost" disabled={testingKeyId === k.id} onClick={() => handleTestKey(k)}>
                        {testingKeyId === k.id ? "Testing…" : "Test"}
                      </Button>
                      {" "}
                      {k.status === "allocated" && (
                        <Button size="sm" variant="ghost" onClick={() => handleRevoke(k)}>Revoke</Button>
                      )}
                      {k.status === "available" && (
                        <Button size="sm" variant="ghost" onClick={() => setAllocTarget(k)}>Allocate</Button>
                      )}
                      {" "}
                      <Button size="sm" variant="danger" onClick={() => handleDelete(k)}>Xoá</Button>
                    </td>
                  </tr>
                ))}
                {keys.length === 0 && !loading && (
                  <tr><td colSpan="7"><EmptyState title="Không có key match filter" description="Đổi filter." /></td></tr>
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

function StatCard({ label, value, tone = "neutral" }) {
  const color = tone === "brand" ? "var(--brand)" :
                tone === "warning" ? "var(--warning)" :
                tone === "danger" ? "var(--danger)" : "var(--text-1)";
  return (
    <Card style={{ padding: "var(--s-4)" }}>
      <div style={{ fontSize: "var(--fs-13)", color: "var(--text-2)" }}>{label}</div>
      <div style={{ fontSize: "var(--fs-30)", fontWeight: 600, color }}>{value}</div>
    </Card>
  );
}

function OnboardStep({ num, title, desc, actionLabel, actionHref, onAction }) {
  const btnProps = actionHref
    ? { as: "a", href: actionHref, target: "_blank", rel: "noreferrer noopener" }
    : { onClick: onAction };
  return (
    <Card style={{ padding: "var(--s-4)", display: "flex", flexDirection: "column", gap: "var(--s-3)" }}>
      <div style={{
        width: 28, height: 28, borderRadius: "50%", background: "var(--brand)", color: "var(--on-brand)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 600, fontSize: "var(--fs-14)",
      }}>{num}</div>
      <div style={{ fontWeight: 600, fontSize: "var(--fs-15)" }}>{title}</div>
      <div style={{ fontSize: "var(--fs-13)", color: "var(--text-2)", flex: 1 }}>{desc}</div>
      <Button size="sm" variant="ghost" {...btnProps}>{actionLabel}</Button>
    </Card>
  );
}

function AddKeyModal({ prefillProviderId, providers, onClose, onSaved }) {
  const initialForm = () => ({
    provider_id: String(prefillProviderId ?? providers[0]?.id ?? ""),
    key_value: "",
    label: "",
    monthly_quota_tokens: 0,
    notes: "",
  });
  const [form, setForm] = useState(initialForm);
  const [keepOpen, setKeepOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [justSaved, setJustSaved] = useState(null);

  // Auto-generate label if empty, based on provider slug + suffix of key
  const providerSlug = useMemo(() => {
    const p = providers.find((pp) => String(pp.id) === String(form.provider_id));
    return p?.slug || "";
  }, [form.provider_id, providers]);

  const autoLabel = useMemo(() => {
    if (!providerSlug) return "";
    const ts = new Date().toISOString().slice(5, 10).replace("-", "");
    const suffix = form.key_value.slice(-4) || Math.floor(Math.random() * 900 + 100);
    return `${providerSlug}-${ts}-${suffix}`;
  }, [providerSlug, form.key_value]);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true); setErr(""); setJustSaved(null);
    try {
      const payload = {
        ...form,
        provider_id: Number(form.provider_id),
        label: form.label.trim() || autoLabel,
      };
      const r = await api.admin.createKey(payload);
      setJustSaved({ provider_slug: r.provider_slug, masked: r.key_masked });
      onSaved();
      if (keepOpen) {
        setForm({ ...initialForm(), provider_id: form.provider_id }); // keep provider
        setTimeout(() => setJustSaved(null), 2500);
      } else {
        onClose();
      }
    } catch (e2) { setErr(e2.message); }
    finally { setSaving(false); }
  };

  const providerOptions = providers.map((p) => ({
    value: String(p.id),
    label: `${p.slug} — ${p.display_name}`,
  }));

  return (
    <Modal open={true} onClose={onClose} title="Thêm API Key mới" size="lg">
      <form onSubmit={submit} className="stack add-key-form" style={{ gap: "var(--s-6)", paddingTop: "var(--s-2)" }}>
        
        {/* Row 1: Provider selection & Alert */}
        <div className="grid --cols-2 add-key-form__provider-row" style={{ gap: "var(--s-6)", alignItems: "flex-start" }}>
          <Select label="1. Chọn Provider" required value={form.provider_id}
            onChange={(e) => setForm({ ...form, provider_id: e.target.value })}
            options={providerOptions} />

          <div className="add-key-form__provider-hint">
            {providerSlug ? (
              PROVIDER_SIGNUP_LINKS[providerSlug] ? (
                <div className="add-key-form__provider-link" style={{
                  padding: "var(--s-3) var(--s-4)", 
                  background: "var(--brand-soft)", 
                  border: "1px solid var(--brand)", 
                  borderRadius: "var(--r-2)",
                  display: "flex", gap: "var(--s-3)", alignItems: "center"
                }}>
                  <Icon name="link" size={18} style={{ color: "var(--brand)" }} />
                  <div>
                    <strong style={{ display: "block", fontSize: "var(--fs-13)", color: "var(--brand)" }}>Lấy API key tại:</strong>
                    <a href={PROVIDER_SIGNUP_LINKS[providerSlug]} target="_blank" rel="noreferrer noopener"
                      style={{ color: "var(--brand)", textDecoration: "underline", fontSize: "var(--fs-14)", fontWeight: 600 }}>
                      {PROVIDER_SIGNUP_LINKS[providerSlug].replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                </div>
              ) : (
                <div className="add-key-form__provider-empty" style={{
                  padding: "var(--s-3) var(--s-4)", 
                  background: "var(--surface-3)", 
                  borderRadius: "var(--r-2)",
                  color: "var(--text-2)", fontSize: "var(--fs-14)"
                }}>
                  Chưa có link hướng dẫn lấy key cho provider này.
                </div>
              )
            ) : null}
          </div>
        </div>

        {/* Row 2: API Key Input (Full width) */}
        <div className="add-key-form__key-row">
          <Input label="2. Paste API Key vào đây" required type="password" value={form.key_value}
            onChange={(e) => setForm({ ...form, key_value: e.target.value })}
            placeholder="sk-... / AIza... / gsk_..." autoComplete="off" 
            style={{ fontFamily: "monospace", fontSize: "var(--fs-16)", padding: "var(--s-3) var(--s-4)" }} />
        </div>

        {/* Row 3: Meta metadata - 2 columns */}
        <div className="grid --cols-2 add-key-form__meta-row" style={{ gap: "var(--s-6)" }}>
          <Input label={`Label gợi ý (bỏ trống = ${autoLabel || "tự động"})`}
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            placeholder={autoLabel || "groq-acct-xx"} />

          <Input label="Quota Tokens / tháng (0 = unlimited)"
            type="number" value={form.monthly_quota_tokens}
            onChange={(e) => setForm({ ...form, monthly_quota_tokens: Number(e.target.value) })} />
        </div>

        {/* Row 4: Notes */}
        <div className="add-key-form__notes-row">
          <Textarea label="Ghi chú nội bộ (chỉ team mình xem)" value={form.notes} rows={2}
            onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </div>

        <Card className="add-key-form__keep-open" style={{ padding: "var(--s-3) var(--s-4)", background: "var(--surface-2)" }}>
          <Checkbox label="Thêm liên tục - giữ form mở để paste key tiếp theo" checked={keepOpen}
            onChange={(e) => setKeepOpen(e.target.checked)} />
        </Card>

        {err && <Alert tone="danger">{err}</Alert>}
        {justSaved && keepOpen && (
          <Alert tone="success">
            ✓ Đã lưu thành công <code>{justSaved.masked}</code> cho <code>{justSaved.provider_slug}</code>. Paste key tiếp theo ở trên.
          </Alert>
        )}

        <div className="row add-key-form__actions" style={{ justifyContent: "flex-end", gap: "var(--s-3)", marginTop: "var(--s-2)", borderTop: "1px solid var(--hairline)", paddingTop: "var(--s-4)" }}>
          <Button type="button" variant="ghost" onClick={onClose} size="md">Hủy đóng</Button>
          <Button type="submit" variant="primary" disabled={saving} size="md">
            {saving ? "Đang mã hóa & lưu…" : "Thêm vào Pool"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function BulkImportModal({ open, onClose, onSaved, providers }) {
  const SAMPLE = "provider_slug,key_value,label,monthly_quota_tokens\n" +
    "groq-llama-70b-free,gsk_xxxxxxxxxxxxxx,groq-acct-01,0\n" +
    "gemini-2-flash-free,AIzaSyXXXXXXXXXXXXX,gemini-acct-01,0\n";
  const [csv, setCsv] = useState(SAMPLE);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => { if (open) { setCsv(SAMPLE); setErr(""); setResult(null); } }, [open]); // eslint-disable-line

  const submit = async (e) => {
    e.preventDefault(); setSaving(true); setErr(""); setResult(null);
    try {
      const lines = csv.trim().split("\n");
      const header = lines[0].split(",").map((s) => s.trim());
      const rows = lines.slice(1).filter(Boolean).map((ln) => {
        const cols = ln.split(",").map((s) => s.trim());
        const obj = {};
        header.forEach((h, i) => { obj[h] = cols[i]; });
        if (obj.monthly_quota_tokens) obj.monthly_quota_tokens = Number(obj.monthly_quota_tokens);
        return obj;
      });
      const r = await api.admin.bulkImportKeys(rows);
      setResult(r);
      if (r.added > 0) onSaved();
    } catch (e2) { setErr(e2.message); }
    finally { setSaving(false); }
  };

  return (
    <Modal open={open} onClose={onClose} title="Bulk import keys (CSV)" size="lg">
      <form onSubmit={submit} className="stack" style={{ gap: "var(--s-4)" }}>
        <Alert tone="info">
          Format: <code>provider_slug,key_value,label,monthly_quota_tokens</code>. Dòng đầu là header.
          <br />
          Provider slug phải match {providers.length} provider hiện có (vd: <code>groq-llama-70b-free</code>, <code>gemini-2-flash-free</code>…).
        </Alert>
        <Textarea rows={14} value={csv} onChange={(e) => setCsv(e.target.value)}
          style={{ fontFamily: "monospace", fontSize: "var(--fs-13)" }} />
        {err && <Alert tone="danger">{err}</Alert>}
        {result && (
          <Alert tone={result.added > 0 ? "success" : "warning"}>
            Added {result.added}, skipped {result.skipped}.
            {result.errors?.length > 0 && (
              <ul style={{ margin: "var(--s-2) 0 0", paddingLeft: "1.2rem" }}>
                {result.errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            )}
          </Alert>
        )}
        <div className="row" style={{ justifyContent: "flex-end", gap: "var(--s-2)" }}>
          <Button type="button" variant="ghost" onClick={onClose}>Đóng</Button>
          <Button type="submit" variant="primary" disabled={saving}>{saving ? "Đang import…" : "Import"}</Button>
        </div>
      </form>
    </Modal>
  );
}

function AllocateModal({ keyObj, onClose, onSaved }) {
  const [licenseId, setLicenseId] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault(); setSaving(true); setErr("");
    try {
      await api.admin.allocateKeys({ license_id: Number(licenseId), key_ids: [keyObj.id] });
      onSaved(); onClose(); setLicenseId("");
    } catch (e2) { setErr(e2.message); }
    finally { setSaving(false); }
  };

  return (
    <Modal open={!!keyObj} onClose={onClose} title={`Allocate key ${keyObj?.key_masked || ""}`} size="sm">
      <form onSubmit={submit} className="stack" style={{ gap: "var(--s-4)" }}>
        <p style={{ margin: 0, fontSize: "var(--fs-14)", color: "var(--text-2)" }}>
          Cấp key <code>{keyObj?.provider_slug}</code> cho license nào?
        </p>
        <Input label="License ID" type="number" required value={licenseId}
          onChange={(e) => setLicenseId(e.target.value)} placeholder="42" />
        {err && <Alert tone="danger">{err}</Alert>}
        <div className="row" style={{ justifyContent: "flex-end", gap: "var(--s-2)" }}>
          <Button type="button" variant="ghost" onClick={onClose}>Huỷ</Button>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? "Đang cấp…" : "Cấp key"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function formatNum(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
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
      <div style={{ fontSize: "var(--fs-13)" }}>
        {k.label || <span style={{ color: "var(--text-3)" }}>—</span>}
      </div>
      <div className="row" style={{ gap: "var(--s-1)", alignItems: "center", marginTop: 2 }}>
        <code style={{
          fontFamily: "monospace",
          fontSize: "var(--fs-12)",
          color: fullKey ? "var(--text-1)" : "var(--text-3)",
          wordBreak: "break-all",
          background: fullKey ? "var(--surface-2)" : "transparent",
          padding: fullKey ? "2px 6px" : 0,
          borderRadius: "4px",
          maxWidth: "340px",
          display: "inline-block",
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
