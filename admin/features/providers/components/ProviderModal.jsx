import React, { useState } from "react";
import {
  Button,
  Input,
  Select,
  Modal,
  Alert,
  Switch,
} from "@/_shared/components/ui";
import { EyeOff, Eye, Plus, Trash2 } from "lucide-react";
import { providersApi } from "../api";

/* ─────────────────────────────────────────────────────────────
 * Kilo-Code-style custom provider config.
 * No hardcoded presets — everything is admin-defined.
 * ──────────────────────────────────────────────────────────── */

const EMPTY_FORM = {
  slug: "",
  display_name: "",
  adapter: "openai_compat",
  base_url: "",
  api_key: "",
  models: [{ id: "", name: "", reasoning: false }],
  extra_headers: [], // [{ name, value }, ...]
  tier: "free",
  priority: 100,
  input_cost_per_mtok_cents: 0,
  output_cost_per_mtok_cents: 0,
  pi_tokens_per_input: 1.0,
  pi_tokens_per_output: 1.0,
  is_enabled: true,
};

// Convert backend extra_headers {k:v} ↔ UI list [{name,value}]
const headersObjToList = (obj) =>
  Object.entries(obj || {}).map(([name, value]) => ({ name, value }));
const headersListToObj = (list) =>
  Object.fromEntries(
    (list || []).filter((h) => h.name?.trim()).map((h) => [h.name.trim(), h.value ?? ""])
  );

/** Field — compact labelled input row */
function Field({ label, hint, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-base-content/70">
        {label}
        {required && <span className="text-danger ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-base-content/40">{hint}</p>}
    </div>
  );
}

/** Section — grouped block with a small heading */
function Section({ title, description, children }) {
  return (
    <section className="flex flex-col gap-3">
      <div>
        <h3 className="text-sm font-semibold text-base-content">{title}</h3>
        {description && (
          <p className="text-xs text-base-content/50 mt-0.5">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

export function ProviderModal({ provider, onClose, onSaved }) {
  const isNew = provider === null;

  const [form, setForm] = useState(() => {
    if (isNew) return { ...EMPTY_FORM };
    return {
      ...EMPTY_FORM,
      ...provider,
      api_key: "", // never prefill secret
      models:
        provider.models && provider.models.length
          ? provider.models.map((m) => ({ id: m.id, name: m.name || "", reasoning: !!m.reasoning }))
          : [{ id: provider.model_id || "", name: provider.display_name || "", reasoning: false }],
      extra_headers: headersObjToList(provider.extra_headers),
    };
  });
  const [showKey, setShowKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // Models list ops
  const addModel = () =>
    setForm((f) => ({ ...f, models: [...f.models, { id: "", name: "", reasoning: false }] }));
  const removeModel = (i) =>
    setForm((f) => ({ ...f, models: f.models.filter((_, idx) => idx !== i) }));
  const updateModel = (i, key, value) =>
    setForm((f) => ({
      ...f,
      models: f.models.map((m, idx) => (idx === i ? { ...m, [key]: value } : m)),
    }));

  // Headers list ops
  const addHeader = () =>
    setForm((f) => ({ ...f, extra_headers: [...f.extra_headers, { name: "", value: "" }] }));
  const removeHeader = (i) =>
    setForm((f) => ({ ...f, extra_headers: f.extra_headers.filter((_, idx) => idx !== i) }));
  const updateHeader = (i, key, value) =>
    setForm((f) => ({
      ...f,
      extra_headers: f.extra_headers.map((h, idx) => (idx === i ? { ...h, [key]: value } : h)),
    }));

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    // Client-side validation
    const validModels = form.models
      .map((m) => ({ id: m.id.trim(), name: (m.name || "").trim(), reasoning: !!m.reasoning }))
      .filter((m) => m.id);
    if (validModels.length === 0) {
      setErr("Cần ít nhất 1 model có ID hợp lệ");
      return;
    }
    if (!/^[a-z0-9_-]+$/.test(form.slug)) {
      setErr("Provider ID chỉ gồm chữ thường, số, dấu gạch ngang/gạch dưới");
      return;
    }

    const payload = {
      ...form,
      slug: form.slug.trim(),
      display_name: form.display_name.trim(),
      base_url: form.base_url.trim(),
      model_id: validModels[0].id, // legacy mirror
      models: validModels,
      extra_headers: headersListToObj(form.extra_headers),
    };

    setSaving(true);
    try {
      if (isNew) {
        await providersApi.create(payload);
      } else {
        const patch = { ...payload };
        if (!patch.api_key) delete patch.api_key;
        await providersApi.update(provider.id, patch);
      }
      onSaved();
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      title={isNew ? "Thêm nhà cung cấp" : `Cấu hình: ${provider.display_name || provider.slug}`}
      size="lg"
    >
      <form onSubmit={submit} className="flex flex-col gap-6 p-1">
        <p className="text-xs text-base-content/50">
          Cấu hình nhà cung cấp OpenAI-compatible. Xem{" "}
          <a
            href="https://platform.openai.com/docs/api-reference/chat"
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            tài liệu provider config
          </a>
          .
        </p>

        {/* ─── Identity ─── */}
        <Section title="Định danh">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Provider ID" required hint="Chữ thường, số, gạch ngang hoặc gạch dưới">
              <Input
                value={form.slug}
                onChange={(e) => setField("slug", e.target.value.toLowerCase())}
                placeholder="myprovider"
                disabled={!isNew}
                required
              />
            </Field>
            <Field label="Tên hiển thị" required>
              <Input
                value={form.display_name}
                onChange={(e) => setField("display_name", e.target.value)}
                placeholder="My AI Provider"
                required
              />
            </Field>
          </div>
        </Section>

        {/* ─── Connection ─── */}
        <Section title="Kết nối">
          <div className="flex flex-col gap-4">
            <Field label="Base URL" required>
              <Input
                type="url"
                value={form.base_url}
                onChange={(e) => setField("base_url", e.target.value)}
                placeholder="https://api.myprovider.com/v1"
                className="font-mono text-sm"
                required
              />
            </Field>
            <Field label="API key" hint="Tuỳ chọn. Để trống nếu xác thực qua headers tuỳ chỉnh.">
              <div className="flex gap-2">
                <Input
                  type={showKey ? "text" : "password"}
                  value={form.api_key}
                  onChange={(e) => setField("api_key", e.target.value)}
                  placeholder={
                    isNew
                      ? "API key"
                      : provider.has_api_key
                      ? "••••••••••••••••  (để trống = giữ key cũ)"
                      : "API key"
                  }
                  autoComplete="new-password"
                  className="flex-1 font-mono"
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowKey((s) => !s)}
                  className="px-3"
                  aria-label={showKey ? "Ẩn key" : "Hiện key"}
                >
                  {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                </Button>
              </div>
            </Field>
          </div>
        </Section>

        {/* ─── Models ─── */}
        <Section
          title="Models"
          description="Danh sách model mà provider này cung cấp. Model đầu tiên là mặc định."
        >
          <div className="flex flex-col gap-2">
            <div className="hidden md:grid grid-cols-[1fr_1fr_auto_auto] gap-2 px-1 text-xs font-medium text-base-content/50">
              <span>ID</span>
              <span>Tên hiển thị</span>
              <span className="text-center">Reasoning</span>
              <span />
            </div>
            {form.models.map((m, i) => (
              <div
                key={i}
                className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto] gap-2 items-center p-2 rounded-md bg-white/[0.02] border border-white/5"
              >
                <Input
                  value={m.id}
                  onChange={(e) => updateModel(i, "id", e.target.value)}
                  placeholder="model-id"
                  className="font-mono text-sm"
                />
                <Input
                  value={m.name}
                  onChange={(e) => updateModel(i, "name", e.target.value)}
                  placeholder="Display Name"
                />
                <label className="flex items-center justify-center gap-2 text-xs text-base-content/60 px-2">
                  <Switch
                    checked={m.reasoning}
                    onChange={(e) => updateModel(i, "reasoning", e.target.checked)}
                  />
                  <span className="md:hidden">Reasoning</span>
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => removeModel(i)}
                  disabled={form.models.length === 1}
                  className="px-2 text-base-content/40 hover:text-danger"
                  aria-label="Xoá model"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}
            <Button type="button" variant="ghost" size="sm" onClick={addModel} className="self-start mt-1">
              <Plus size={13} className="mr-1" /> Thêm model
            </Button>
          </div>
        </Section>

        {/* ─── Headers (optional) ─── */}
        <Section
          title="Headers (tuỳ chọn)"
          description="HTTP header tuỳ chỉnh gắn vào mọi request gửi lên upstream."
        >
          <div className="flex flex-col gap-2">
            {form.extra_headers.length > 0 && (
              <div className="hidden md:grid grid-cols-[1fr_1fr_auto] gap-2 px-1 text-xs font-medium text-base-content/50">
                <span>Header</span>
                <span>Value</span>
                <span />
              </div>
            )}
            {form.extra_headers.map((h, i) => (
              <div
                key={i}
                className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2 items-center p-2 rounded-md bg-white/[0.02] border border-white/5"
              >
                <Input
                  value={h.name}
                  onChange={(e) => updateHeader(i, "name", e.target.value)}
                  placeholder="Header-Name"
                  className="font-mono text-sm"
                />
                <Input
                  value={h.value}
                  onChange={(e) => updateHeader(i, "value", e.target.value)}
                  placeholder="value"
                  className="font-mono text-sm"
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => removeHeader(i)}
                  className="px-2 text-base-content/40 hover:text-danger"
                  aria-label="Xoá header"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}
            <Button type="button" variant="ghost" size="sm" onClick={addHeader} className="self-start mt-1">
              <Plus size={13} className="mr-1" /> Thêm header
            </Button>
          </div>
        </Section>

        {/* ─── Routing / pricing (advanced) ─── */}
        <Section title="Định tuyến & chi phí">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Field label="Cấp dịch vụ">
              <Select
                value={form.tier}
                onChange={(e) => setField("tier", e.target.value)}
                options={[
                  { label: "Miễn phí", value: "free" },
                  { label: "Trả phí", value: "paid" },
                ]}
              />
            </Field>
            <Field label="Ưu tiên" hint="Số thấp = thử trước">
              <Input
                type="number"
                value={form.priority}
                onChange={(e) => setField("priority", Number(e.target.value))}
              />
            </Field>
            <Field label="Giá vào (¢/Mtok)">
              <Input
                type="number"
                step="0.1"
                value={form.input_cost_per_mtok_cents}
                onChange={(e) => setField("input_cost_per_mtok_cents", Number(e.target.value))}
              />
            </Field>
            <Field label="Giá ra (¢/Mtok)">
              <Input
                type="number"
                step="0.1"
                value={form.output_cost_per_mtok_cents}
                onChange={(e) => setField("output_cost_per_mtok_cents", Number(e.target.value))}
              />
            </Field>
            <Field label="Hệ số Pi vào">
              <Input
                type="number"
                step="0.1"
                value={form.pi_tokens_per_input}
                onChange={(e) => setField("pi_tokens_per_input", Number(e.target.value))}
              />
            </Field>
            <Field label="Hệ số Pi ra">
              <Input
                type="number"
                step="0.1"
                value={form.pi_tokens_per_output}
                onChange={(e) => setField("pi_tokens_per_output", Number(e.target.value))}
              />
            </Field>
          </div>
        </Section>

        {/* ─── Enable toggle ─── */}
        <div className="flex items-center gap-3 p-3 rounded-md bg-white/[0.02] border border-white/5">
          <Switch
            checked={form.is_enabled}
            onChange={(e) => setField("is_enabled", e.target.checked)}
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium">Kích hoạt</span>
            <span className="text-xs text-base-content/50">
              Router sẽ điều phối lưu lượng nếu provider khoẻ.
            </span>
          </div>
        </div>

        {err && <Alert tone="warning">{err}</Alert>}

        <div className="flex items-center gap-3 pt-3 border-t border-white/5">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
            Huỷ
          </Button>
          <Button type="submit" variant="primary" disabled={saving} className="flex-1">
            {saving ? "Đang lưu..." : isNew ? "Tạo provider" : "Lưu thay đổi"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ProviderModal;
