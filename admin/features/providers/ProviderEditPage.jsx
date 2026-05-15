import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { withDelay } from "@/_shared/api/api-client";
import {
  Button,
  Input,
  Select,
  Alert,
  Switch,
} from "@/_shared/components/ui";
import { EyeOff, Eye, Plus, Trash2, ArrowLeft } from "lucide-react";
import {
  AdminPageHeader,
  FormField,
  FormSection,
} from "../../_shared/components";
import { providersApi } from "./api";

const EMPTY_FORM = {
  slug: "",
  display_name: "",
  adapter: "openai_compat",
  base_url: "",
  api_key: "",
  models: [{ id: "", name: "", reasoning: false }],
  extra_headers: [],
  tier: "free",
  priority: 100,
  input_cost_per_mtok_cents: 0,
  output_cost_per_mtok_cents: 0,
  pi_tokens_per_input: 1.0,
  pi_tokens_per_output: 1.0,
  is_enabled: true,
};

const headersObjToList = (obj) =>
  Object.entries(obj || {}).map(([name, value]) => ({ name, value }));
const headersListToObj = (list) =>
  Object.fromEntries(
    (list || []).filter((h) => h.name?.trim()).map((h) => [h.name.trim(), h.value ?? ""])
  );

export function ProviderEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [showKey, setShowKey] = useState(false);

  const load = useCallback(async () => {
    if (isNew) return;
    setLoading(true);
    try {
      const res = await withDelay(providersApi.list(), 400);
      const found = (res.items || []).find((p) => p.id === id);
      if (!found) {
        setErr("Không tìm thấy nhà cung cấp");
        return;
      }
      setForm({
        ...EMPTY_FORM,
        ...found,
        api_key: "",
        models: found.models && found.models.length
          ? found.models.map((m) => ({ id: m.id, name: m.name || "", reasoning: !!m.reasoning }))
          : [{ id: found.model_id || "", name: found.display_name || "", reasoning: false }],
        extra_headers: headersObjToList(found.extra_headers),
      });
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }, [isNew, id]);

  useEffect(() => { load(); }, [load]);

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const addModel = () =>
    setForm((f) => ({ ...f, models: [...f.models, { id: "", name: "", reasoning: false }] }));
  const removeModel = (i) =>
    setForm((f) => ({ ...f, models: f.models.filter((_, idx) => idx !== i) }));
  const updateModel = (i, key, value) =>
    setForm((f) => ({
      ...f,
      models: f.models.map((m, idx) => (idx === i ? { ...m, [key]: value } : m)),
    }));

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
      model_id: validModels[0].id,
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
        await providersApi.update(id, patch);
      }
      navigate("/admin/providers");
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Đang tải dữ liệu...</div>;

  return (
    <div className="flex flex-col gap-6 pb-12 max-w-4xl mx-auto">
      <AdminPageHeader 
        title={isNew ? "Thêm nhà cung cấp" : `Cấu hình: ${form.display_name || form.slug}`}
        tagline="Cấu hình nhà cung cấp OpenAI-compatible"
        actions={
          <Button as={Link} to="/admin/providers" variant="ghost" size="sm">
            <ArrowLeft size={14} className="mr-1.5" /> Danh sách
          </Button>
        }
      />

      <form onSubmit={submit} className="flex flex-col gap-5">
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

        <FormSection title="Định danh">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Provider ID" required hint="Chữ thường, số, gạch ngang hoặc gạch dưới">
              <Input
                value={form.slug}
                onChange={(e) => setField("slug", e.target.value.toLowerCase())}
                placeholder="myprovider"
                disabled={!isNew}
                required
              />
            </FormField>
            <FormField label="Tên hiển thị" required>
              <Input
                value={form.display_name}
                onChange={(e) => setField("display_name", e.target.value)}
                placeholder="My AI Provider"
                required
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Kết nối">
          <div className="flex flex-col gap-4">
            <FormField label="Base URL" required>
              <Input
                type="url"
                value={form.base_url}
                onChange={(e) => setField("base_url", e.target.value)}
                placeholder="https://api.myprovider.com/v1"
                className="font-mono text-sm"
                required
              />
            </FormField>
            <FormField label="API key" hint="Tuỳ chọn. Để trống nếu xác thực qua headers tuỳ chỉnh.">
              <div className="flex gap-2">
                <Input
                  type={showKey ? "text" : "password"}
                  value={form.api_key}
                  onChange={(e) => setField("api_key", e.target.value)}
                  placeholder={
                    isNew
                      ? "API key"
                      : "••••••••••••••••  (để trống = giữ key cũ)"
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
            </FormField>
          </div>
        </FormSection>

        <FormSection
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
        </FormSection>

        <FormSection
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
        </FormSection>

        <FormSection title="Định tuyến & chi phí">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FormField label="Cấp dịch vụ">
              <Select
                value={form.tier}
                onChange={(e) => setField("tier", e.target.value)}
                options={[
                  { label: "Miễn phí", value: "free" },
                  { label: "Trả phí", value: "paid" },
                ]}
              />
            </FormField>
            <FormField label="Ưu tiên" hint="Số thấp = thử trước">
              <Input
                type="number"
                value={form.priority}
                onChange={(e) => setField("priority", Number(e.target.value))}
              />
            </FormField>
            <FormField label="Giá vào (¢/Mtok)">
              <Input
                type="number"
                step="0.1"
                value={form.input_cost_per_mtok_cents}
                onChange={(e) => setField("input_cost_per_mtok_cents", Number(e.target.value))}
              />
            </FormField>
            <FormField label="Giá ra (¢/Mtok)">
              <Input
                type="number"
                step="0.1"
                value={form.output_cost_per_mtok_cents}
                onChange={(e) => setField("output_cost_per_mtok_cents", Number(e.target.value))}
              />
            </FormField>
            <FormField label="Hệ số Pi vào">
              <Input
                type="number"
                step="0.1"
                value={form.pi_tokens_per_input}
                onChange={(e) => setField("pi_tokens_per_input", Number(e.target.value))}
              />
            </FormField>
            <FormField label="Hệ số Pi ra">
              <Input
                type="number"
                step="0.1"
                value={form.pi_tokens_per_output}
                onChange={(e) => setField("pi_tokens_per_output", Number(e.target.value))}
              />
            </FormField>
          </div>
        </FormSection>

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

        <div className="flex items-center gap-3 pt-3 sticky bottom-0 bg-base-100 py-4 -mx-6 px-6 border-t border-white/5">
          <Button as={Link} to="/admin/providers" type="button" variant="ghost" className="flex-1">
            Huỷ
          </Button>
          <Button type="submit" variant="primary" disabled={saving} className="flex-1">
            {saving ? "Đang lưu..." : isNew ? "Tạo provider" : "Lưu thay đổi"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ProviderEditPage;
