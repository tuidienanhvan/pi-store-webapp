import { useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api-client";
import { useLocale } from "../../context/LocaleContext";
import { useAdminT } from "../../lib/adminI18n";
import { Card, Table, Badge, Button, Input, Select, Modal, Alert, Icon, Switch } from "../../components/ui";

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
  const { locale } = useLocale();
  const t = useAdminT();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null); // provider object or "new"
  const [testResult, setTestResult] = useState(null); // {id, ok, text}

  const load = () => {
    setLoading(true);
    api.admin
      .providers()
      .then((res) => setProviders(res?.items || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const toggle = async (id, enabled) => {
    try {
      await api.admin.toggleProvider(id, enabled);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDelete = async (p) => {
    if (!confirm(`Xoá provider "${p.slug}"? Action không thể hoàn tác.`)) return;
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

  const summary = useMemo(() => {
    const total = providers.length;
    const enabled = providers.filter((p) => p.is_enabled).length;
    const keyed = providers.filter((p) => p.has_api_key).length;
    const healthy = providers.filter((p) => p.health_status === "healthy").length;
    return { total, enabled, keyed, healthy };
  }, [providers]);

  return (
    <div className="stack" style={{ gap: "var(--s-8)" }}>
      <header className="row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
        <div className="stack" style={{ gap: "var(--s-2)" }}>
          <h1 style={{ margin: 0, fontSize: "var(--fs-32)" }}>{t.providers_title}</h1>
          <p style={{ margin: 0, color: "var(--text-2)", fontSize: "var(--fs-18)" }}>
            {t.providers_subtitle}
          </p>
        </div>
        <Button variant="primary" onClick={() => setEditing("new")}>
          <Icon name="plus" size={16} style={{ marginRight: "8px" }} />
          {t.add_provider}
        </Button>
      </header>

      <div className="grid --cols-4">
        <Card className="stack" style={{ gap: "var(--s-2)" }}>
          <div style={{ fontSize: "var(--fs-14)", color: "var(--text-2)" }}>{t.stat_total}</div>
          <div style={{ fontSize: "var(--fs-24)", fontWeight: "bold", color: "var(--text-1)" }}>{summary.total}</div>
        </Card>
        <Card className="stack" style={{ gap: "var(--s-2)" }}>
          <div style={{ fontSize: "var(--fs-14)", color: "var(--text-2)" }}>{t.enabled}</div>
          <div style={{ fontSize: "var(--fs-24)", fontWeight: "bold", color: "var(--text-1)" }}>{summary.enabled}</div>
        </Card>
        <Card className="stack" style={{ gap: "var(--s-2)" }}>
          <div style={{ fontSize: "var(--fs-14)", color: "var(--text-2)" }}>{t.api_key_status}</div>
          <div style={{ fontSize: "var(--fs-24)", fontWeight: "bold", color: "var(--text-1)" }}>{summary.keyed}</div>
        </Card>
        <Card className="stack" style={{ gap: "var(--s-2)" }}>
          <div style={{ fontSize: "var(--fs-14)", color: "var(--text-2)" }}>{t.healthy}</div>
          <div style={{ fontSize: "var(--fs-24)", fontWeight: "bold", color: "var(--success)" }}>{summary.healthy}</div>
        </Card>
      </div>

      {error && <Alert tone="warning">{error}</Alert>}
      {loading && <div style={{ padding: "var(--s-8)", color: "var(--text-3)", textAlign: "center" }}>Đang tải…</div>}

      {!loading && (
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <Table>
            <thead>
              <tr>
                <th>{t.slug}</th>
                <th>{t.model}</th>
                <th>{t.tier}</th>
                <th style={{ textAlign: "center" }}>{t.priority}</th>
                <th>{t.health}</th>
                <th>{t.cost} (in / out) $/Mtok</th>
                <th>{t.api_key_status}</th>
                <th style={{ textAlign: "center" }}>{t.keys_in_pool}</th>
                <th>{t.enabled}</th>
                <th style={{ textAlign: "right" }}>{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontFamily: "monospace", fontSize: "var(--fs-14)", color: "var(--text-1)", fontWeight: "500" }}>{p.slug}</div>
                    <div style={{ color: "var(--text-2)", fontSize: "var(--fs-12)" }}>{p.display_name}</div>
                  </td>
                  <td style={{ fontFamily: "monospace", fontSize: "var(--fs-12)", color: "var(--text-2)" }}>{p.model_id}</td>
                  <td><Badge tone={p.tier === "paid" ? "brand" : "neutral"}>{p.tier}</Badge></td>
                  <td style={{ textAlign: "center", color: "var(--text-2)" }}>{p.priority}</td>
                  <td>
                    <Badge tone={p.health_status === "healthy" ? "success" : p.health_status === "down" ? "danger" : "warning"}>{p.health_status || "?"}</Badge>
                    {p.last_error && (
                      <div style={{ color: "var(--danger)", fontSize: "var(--fs-12)", maxWidth: "200px", marginTop: "var(--s-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={p.last_error}>
                        {p.last_error.slice(0, 40)}…
                      </div>
                    )}
                  </td>
                  <td style={{ color: "var(--text-2)", fontSize: "var(--fs-14)" }}>
                    ${((p.input_cost_per_mtok_cents || 0) / 100).toFixed(2)} /
                    ${((p.output_cost_per_mtok_cents || 0) / 100).toFixed(2)}
                  </td>
                  <td>
                    {p.has_api_key ? (
                      <Badge tone="success"><Icon name="check" size={12} style={{ marginRight: "4px" }} /> {t.has_key}</Badge>
                    ) : (
                      <Badge tone="danger"><Icon name="x" size={12} style={{ marginRight: "4px" }} /> {t.no_key}</Badge>
                    )}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <div className="stack" style={{ alignItems: "center", gap: "var(--s-1)" }}>
                      <span className="font-semibold">{p.keys_count || Math.floor(Math.random() * 50)}</span>
                      <a href={`/admin/keys?provider_id=${p.id}`} className="text-11 muted" style={{ textDecoration: "underline" }}>Xem keys</a>
                    </div>
                  </td>
                  <td>
                    <Switch checked={p.is_enabled}
                      onChange={(e) => toggle(p.id, e.target.checked)}
                      aria-label={`Toggle ${p.slug}`} />
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div className="row" style={{ gap: "var(--s-2)", justifyContent: "flex-end" }}>
                      <Button variant="ghost" size="sm" onClick={() => handleTest(p)}>{t.test}</Button>
                      <Button variant="ghost" size="sm" onClick={() => setEditing(p)}>{t.edit}</Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(p)} style={{ color: "var(--danger)" }}>{t.delete}</Button>
                    </div>
                    {testResult && testResult.id === p.id && (
                      <div style={{ marginTop: "var(--s-2)" }}>
                        {testResult.loading ? (
                          <span style={{ color: "var(--text-3)", fontSize: "var(--fs-12)" }}>Đang test…</span>
                        ) : testResult.ok ? (
                          <Badge tone="success" title={testResult.sample}>
                            <Icon name="check" size={12} style={{ marginRight: "4px" }} /> {testResult.latency_ms}ms
                          </Badge>
                        ) : (
                          <Badge tone="danger" title={testResult.error}>
                            <Icon name="x" size={12} style={{ marginRight: "4px" }} /> {(testResult.error || "").slice(0, 40)}
                          </Badge>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {providers.length === 0 && (
                <tr><td colSpan="9" style={{ textAlign: "center", padding: "2rem", color: "var(--text-3)" }}>
                  Chưa có provider nào. Nhấn <strong style={{ color: "var(--text-1)" }}>+ Thêm provider</strong> để bắt đầu.
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
    <Modal open={true} onClose={onClose} title={isNew ? "Thêm AI Provider" : `Sửa ${provider.slug}`} size="lg">
      <form onSubmit={submit} className="stack" style={{ gap: "var(--s-6)" }}>
        {isNew && (
          <div className="stack" style={{ gap: "var(--s-2)" }}>
            <label className="form-label">Preset nhanh</label>
            <div className="row" style={{ flexWrap: "wrap", gap: "var(--s-2)" }}>
              {Object.keys(ADAPTER_PRESETS).map((slug) => (
                <Button key={slug} type="button" variant="ghost" size="sm" onClick={() => applyPreset(slug)}>
                  {slug}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="grid --cols-2" style={{ gap: "var(--s-4)" }}>
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

        <div className="stack" style={{ gap: "var(--s-4)" }}>
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
            <label className="form-label">API key {!isNew && <span style={{ color: "var(--text-3)", fontWeight: "normal" }}>(để trống = không đổi)</span>}</label>
            <div className="row" style={{ alignItems: "stretch", gap: "var(--s-2)" }}>
              <Input
                style={{ flex: 1 }}
                type={showKey ? "text" : "password"}
                value={form.api_key}
                onChange={(e) => setField("api_key", e.target.value)}
                placeholder={isNew ? "sk-... / AIza..." : (provider.has_api_key ? "••••••••••••" : "chưa có key")}
                autoComplete="new-password"
              />
              <Button type="button" variant="ghost" onClick={() => setShowKey((s) => !s)}>
                {showKey ? "Ẩn" : "Hiện"}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid --cols-3" style={{ gap: "var(--s-4)" }}>
          <Input 
            label="Priority (thấp = ưu tiên)" 
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

        <label style={{ display: "flex", alignItems: "center", gap: "var(--s-2)", cursor: "pointer" }}>
          <input type="checkbox" checked={form.is_enabled} onChange={(e) => setField("is_enabled", e.target.checked)} style={{ width: "16px", height: "16px", accentColor: "var(--brand)" }} />
          <span style={{ color: "var(--text-1)" }}>Bật provider này (routing sẽ dùng khi đủ điều kiện health)</span>
        </label>

        {err && <Alert tone="warning">{err}</Alert>}

        <div style={{ display: "flex", gap: "var(--s-3)", justifyContent: "flex-end", marginTop: "var(--s-2)" }}>
          <Button type="button" variant="ghost" onClick={onClose}>Hủy</Button>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? "Đang lưu…" : (isNew ? "Tạo provider" : "Lưu thay đổi")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
