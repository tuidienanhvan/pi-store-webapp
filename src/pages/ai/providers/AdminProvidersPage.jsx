import { useCallback, useEffect, useMemo, useState } from "react";
import { api, withDelay } from "@/lib/api-client";
import { useAdminT } from "@/lib/adminI18n";
import { Card, Table, Badge, Button, Input, Select, Modal, Alert, Icon, Switch } from "@/components/ui";
import { AdminTableSkeleton } from "@/components/skeletons/AdminTableSkeleton";
import { AdminStatCard } from "@/pages/core/components/AdminStatCard";

import "./AdminProvidersPage.css";

const EMPTY_FORM = {
  slug: "",
  display_name: "",
  adapter: "openai_compat",
  base_url: "",
  model_id: "",
  api_key: "",
  tier: "free",
  priority: 100,
  input_cost_per_mtok_cents: 0,
  output_cost_per_mtok_cents: 0,
  pi_tokens_per_input: 1.0,
  pi_tokens_per_output: 1.0,
  is_enabled: true,
};

const ADAPTER_PRESETS = {
  "groq-free": { base_url: "https://api.groq.com/openai/v1", model_id: "llama-3.3-70b-versatile" },
  "gemini-free": { base_url: "https://generativelanguage.googleapis.com/v1beta/openai", model_id: "gemini-2.0-flash-exp" },
  "mistral-free": { base_url: "https://api.mistral.ai/v1", model_id: "mistral-small-latest" },
  "cohere-free": { base_url: "https://api.cohere.ai/compatibility/v1", model_id: "command-r" },
  "openai-paid": { base_url: "https://api.openai.com/v1", model_id: "gpt-4o-mini" },
  "anthropic-paid": { base_url: "https://api.anthropic.com/v1", model_id: "claude-3-5-haiku-20241022" },
};

export function AdminProvidersPage() {
  const t = useAdminT();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null); // provider object or "new"
  const [testResult, setTestResult] = useState(null); // {id, ok, text}

  const summary = useMemo(() => {
    const total = providers.length;
    const enabled = providers.filter((p) => p.is_enabled).length;
    const keyed = providers.filter((p) => p.has_api_key).length;
    const healthy = providers.filter((p) => p.health_status === "healthy").length;
    return { total, enabled, keyed, healthy };
  }, [providers]);

  const load = useCallback(() => {
    setLoading(true);
    withDelay(api.admin.providers(), 1000)
      .then((res) => setProviders(res?.items || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading && providers.length === 0) return <AdminTableSkeleton />;

  const toggle = async (id, enabled) => {
    try {
      await api.admin.toggleProvider(id, enabled);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDelete = async (p) => {
    if (!confirm(`Xo provider "${p.slug}"? Action khng th? hon tc.`)) return;
    try {
      await api.admin.deleteProvider(p.id);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleTest = async (p) => {
    setTestResult({ id: p.id, loading: true });
    try {
      const res = await api.admin.testProvider(p.id);
      setTestResult({ id: p.id, ...res });
    } catch (e) {
      setTestResult({ id: p.id, ok: false, error: e.message });
    }
  };

  return (
    <div className="providers-page fade-in">
      <header className="providers-header stagger-1">
        <div className="flex flex-col gap-3">
          <h1 className="premium-title">{t.providers_title}</h1>
          <p className="text-base-content/60 opacity-60 font-medium tracking-wide">{t.providers_subtitle}</p>
        </div>
        <Button variant="primary" onClick={() => setEditing("new")} className="h-[48px] px-8 rounded-2xl shadow-brand/20 shadow-lg font-black uppercase tracking-widest text-xs">
          <Icon name="plus" size={18} className="mr-2" />
          {t.add_provider}
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-2">
        <AdminStatCard title={t.stat_total} value={summary.total} />
        <AdminStatCard title={t.enabled} value={summary.enabled} />
        <AdminStatCard title={t.api_key_status} value={summary.keyed} />
        <AdminStatCard title={t.healthy} value={summary.healthy} className="text-success" />
      </div>

      {error && <Alert tone="warning" className="stagger-3">{error}</Alert>}

      {loading && (
        <div className="p-8 flex flex-col gap-4 animate-pulse stagger-3">
          <div className="h-64 w-full bg-base-300 rounded-2xl opacity-20" />
        </div>
      )}

      {!loading && (
        <Card className="table-card stagger-3 p-0">
          <Table className="providers-table">
            <thead>
              <tr>
                <th>{t.slug}</th>
                <th>{t.model}</th>
                <th>{t.tier}</th>
                <th className="text-center">{t.priority}</th>
                <th>{t.health}</th>
                <th>{t.cost} (in / out) $/Mtok</th>
                <th>{t.api_key_status}</th>
                <th className="text-center">{t.keys_in_pool}</th>
                <th>{t.enabled}</th>
                <th className="text-right">{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="slug-group">
                      <div className="slug-text">{p.slug}</div>
                      <div className="display-name-text">{p.display_name}</div>
                    </div>
                  </td>
                  <td className="model-text">{p.model_id}</td>
                  <td>
                    <Badge tone={p.tier === "paid" ? "brand" : "neutral"} className="badge-premium">
                      {p.tier}
                    </Badge>
                  </td>
                  <td className="text-center opacity-60 font-mono text-[13px]">{p.priority}</td>
                  <td>
                    <Badge tone={p.health_status === "healthy" ? "success" : p.health_status === "down" ? "danger" : "warning"} className="badge-premium">
                      {p.health_status || "?"}
                    </Badge>
                    {p.last_error && (
                      <div className="text-danger text-[11px] max-w-[180px] mt-1.5 opacity-60 truncate" title={p.last_error}>
                        {p.last_error}
                      </div>
                    )}
                  </td>
                  <td className="cost-text">
                    ${((p.input_cost_per_mtok_cents || 0) / 100).toFixed(2)} /
                    ${((p.output_cost_per_mtok_cents || 0) / 100).toFixed(2)}
                  </td>
                  <td>
                    {p.has_api_key ? (
                      <Badge tone="success" className="badge-premium"><Icon name="check" size={12} className="mr-1" /> {t.has_key}</Badge>
                    ) : (
                      <Badge tone="danger" className="badge-premium"><Icon name="x" size={12} className="mr-1" /> {t.no_key}</Badge>
                    )}
                  </td>
                  <td className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-black text-base-content text-[14px]">{p.keys_count || 0}</span>
                      <a href={`/admin/keys?provider_id=${p.id}`} className="text-[10px] font-bold text-primary uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">
                        Xem keys
                      </a>
                    </div>
                  </td>
                  <td>
                    <Switch checked={p.is_enabled}
                      onChange={(e) => toggle(p.id, e.target.checked)}
                      aria-label={`Toggle ${p.slug}`} />
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleTest(p)} className="rounded-lg border border-base-border-subtle hover:border-primary-soft text-[11px] font-bold uppercase tracking-wider">
                        {t.test}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setEditing(p)} className="rounded-lg border border-base-border-subtle hover:border-primary-soft text-[11px] font-bold uppercase tracking-wider">
                        {t.edit}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(p)} className="rounded-lg border border-base-border-subtle hover:border-danger/30 text-danger text-[11px] font-bold uppercase tracking-wider">
                        {t.delete}
                      </Button>
                    </div>
                    {testResult && testResult.id === p.id && (
                      <div className="mt-2 flex justify-end">
                        {testResult.loading ? (
                          <span className="text-base-content/60 text-[10px] uppercase font-bold tracking-widest animate-pulse">ang test</span>
                        ) : testResult.ok ? (
                          <Badge tone="success" title={testResult.sample} className="badge-premium">
                            <Icon name="check" size={12} className="mr-1" /> {testResult.latency_ms}ms
                          </Badge>
                        ) : (
                          <Badge tone="danger" title={testResult.error} className="badge-premium">
                            <Icon name="x" size={12} className="mr-1" /> Error
                          </Badge>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {providers.length === 0 && (
                <tr><td colSpan="10" className="text-center py-20 text-base-content/60 opacity-40 uppercase font-bold tracking-[0.2em] text-[12px]">
                  Chua c provider no. Nh?n <strong className="text-base-content">+ Thm provider</strong> d? b?t d?u.
                </td></tr>
              )}
            </tbody>
          </Table>
        </Card>
      )}

      {editing !== null && (
        <ProviderModal
          provider={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
        />
      )}
    </div>
  );
}

function ProviderModal({ provider, onClose, onSaved }) {
  const isNew = provider === null;
  const [form, setForm] = useState(() => isNew ? { ...EMPTY_FORM } : {
    ...EMPTY_FORM,
    ...provider,
    api_key: "", // never pre-fill; empty means "don't change"
  });
  const [showKey, setShowKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const applyPreset = (slug) => {
    const preset = ADAPTER_PRESETS[slug];
    if (!preset) return;
    setForm((f) => ({ ...f, slug, base_url: preset.base_url, model_id: preset.model_id }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr("");
    try {
      if (isNew) {
        await api.admin.createProvider(form);
      } else {
        const patch = { ...form };
        if (!patch.api_key) delete patch.api_key;
        await api.admin.updateProvider(provider.id, patch);
      }
      onSaved();
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={true} onClose={onClose} title={isNew ? "Thm AI Provider" : `Sa ${provider.slug}`} size="lg">
      <form onSubmit={submit} className="stack gap-6">
        {isNew && (
          <div className="preset-container">
            <label className="form-label label-premium opacity-100 mb-1">Preset nhanh</label>
            <div className="preset-row">
              {Object.keys(ADAPTER_PRESETS).map((slug) => (
                <Button key={slug} type="button" variant="ghost" size="sm" onClick={() => applyPreset(slug)} className="rounded-lg border border-base-border-subtle text-[11px] font-bold">
                  {slug}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="form-grid">
          <Input 
            label="Slug (unique, kebab-case)" 
            required 
            disabled={!isNew} 
            value={form.slug} 
            onChange={(e) => setField("slug", e.target.value)} 
            placeholder="gemini-free" 
          />
          <Input 
            label="Display name" 
            required 
            value={form.display_name} 
            onChange={(e) => setField("display_name", e.target.value)} 
            placeholder="Gemini 2.0 Flash (Free)" 
          />
          <Select 
            label="Adapter" 
            value={form.adapter} 
            onChange={(e) => setField("adapter", e.target.value)}
            options={[
              { label: "openai_compat", value: "openai_compat" },
              { label: "anthropic (TODO)", value: "anthropic" },
              { label: "gemini (TODO)", value: "gemini" },
            ]}
          />
          <Select 
            label="Tier" 
            value={form.tier} 
            onChange={(e) => setField("tier", e.target.value)}
            options={[
              { label: "free", value: "free" },
              { label: "paid", value: "paid" },
            ]}
          />
        </div>

        <div className="stack gap-4">
          <Input 
            label="Base URL" 
            required 
            type="url" 
            value={form.base_url} 
            onChange={(e) => setField("base_url", e.target.value)} 
            placeholder="https://api.groq.com/openai/v1" 
          />
          <Input 
            label="Model ID" 
            required 
            value={form.model_id} 
            onChange={(e) => setField("model_id", e.target.value)} 
            placeholder="llama-3.3-70b-versatile" 
          />
          <div className="form-group">
            <label className="form-label label-premium opacity-100 mb-1">API key {!isNew && <span className="opacity-40 font-normal lowercase">(d? tr?ng = khng d?i)</span>}</label>
            <div className="api-key-input-group">
              <Input
                type={showKey ? "text" : "password"}
                value={form.api_key}
                onChange={(e) => setField("api_key", e.target.value)}
                placeholder={isNew ? "sk-... / AIza..." : (provider.has_api_key ? "" : "chua c key")}
                autoComplete="new-password"
              />
              <Button type="button" variant="ghost" onClick={() => setShowKey((s) => !s)} className="rounded-xl border border-base-border-subtle font-bold uppercase text-[10px] tracking-widest">
                {showKey ? "?n" : "Hi?n"}
              </Button>
            </div>
          </div>
        </div>

        <div className="form-grid-3">
          <Input 
            label="Priority (th?p = uu tin)" 
            type="number" 
            value={form.priority} 
            onChange={(e) => setField("priority", Number(e.target.value))} 
          />
          <Input 
            label="Input $/Mtok (cents)" 
            type="number" 
            value={form.input_cost_per_mtok_cents} 
            onChange={(e) => setField("input_cost_per_mtok_cents", Number(e.target.value))} 
          />
          <Input 
            label="Output $/Mtok (cents)" 
            type="number" 
            value={form.output_cost_per_mtok_cents} 
            onChange={(e) => setField("output_cost_per_mtok_cents", Number(e.target.value))} 
          />
          <Input 
            label="Pi tokens / input" 
            type="number" 
            step="0.1" 
            value={form.pi_tokens_per_input} 
            onChange={(e) => setField("pi_tokens_per_input", Number(e.target.value))} 
          />
          <Input 
            label="Pi tokens / output" 
            type="number" 
            step="0.1" 
            value={form.pi_tokens_per_output} 
            onChange={(e) => setField("pi_tokens_per_output", Number(e.target.value))} 
          />
        </div>

        <label className="checkbox-label">
          <input type="checkbox" checked={form.is_enabled} onChange={(e) => setField("is_enabled", e.target.checked)} className="checkbox-input" />
          <span className="text-[13px] font-medium opacity-80">B?t provider ny (routing s? dng khi d? di?u ki?n health)</span>
        </label>

        {err && <Alert tone="warning">{err}</Alert>}

        <div className="modal-footer">
          <Button type="button" variant="ghost" onClick={onClose} className="font-bold uppercase tracking-widest text-[11px] px-6">H?y</Button>
          <Button type="submit" variant="primary" disabled={saving} className="rounded-xl font-bold uppercase tracking-widest text-[11px] px-8 glow-brand">
            {saving ? "ang luu" : (isNew ? "To provider" : "Luu thay d?i")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default AdminProvidersPage;
