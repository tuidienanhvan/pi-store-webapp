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
    <div className="flex flex-col gap-10 pb-20">
      <AdminPageHeader 
        title={isNew ? "Thêm nhà cung cấp" : `Cấu hình: ${form.display_name || form.slug}`}
        tagline="Định nghĩa kết nối và mô hình học máy cho bộ định tuyến"
        actions={
          <Button as={Link} to="/admin/providers" variant="ghost" className="h-10 px-4 rounded-xl border border-white/5 font-semibold tracking-wider text-[11px]">
            <ArrowLeft size={14} className="mr-2" /> Quay lại danh sách
          </Button>
        }
      />

      <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột chính: Thông tin & Kết nối */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <FormSection title="Thông tin định danh">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <FormField label="Provider ID" required hint="Chữ thường, không dấu (VD: openai)">
                <Input
                  value={form.slug}
                  onChange={(e) => setField("slug", e.target.value.toLowerCase())}
                  placeholder="myprovider"
                  disabled={!isNew}
                  required
                  className="h-12 bg-white/5 border-white/10 rounded-xl"
                />
              </FormField>
              <FormField label="Tên hiển thị" required hint="Tên hiển thị trên giao diện">
                <Input
                  value={form.display_name}
                  onChange={(e) => setField("display_name", e.target.value)}
                  placeholder="My AI Provider"
                  required
                  className="h-12 bg-white/5 border-white/10 rounded-xl"
                />
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Kết nối Upstream">
            <div className="flex flex-col gap-6">
              <FormField label="Base URL" required hint="Đường dẫn gốc của API tương thích OpenAI">
                <Input
                  type="url"
                  value={form.base_url}
                  onChange={(e) => setField("base_url", e.target.value)}
                  placeholder="https://api.myprovider.com/v1"
                  className="h-12 font-mono text-sm bg-white/5 border-white/10 rounded-xl"
                  required
                />
              </FormField>
              <FormField label="API Key" hint="Để trống nếu xác thực qua Header tùy chỉnh">
                <div className="flex gap-2">
                  <Input
                    type={showKey ? "text" : "password"}
                    value={form.api_key}
                    onChange={(e) => setField("api_key", e.target.value)}
                    placeholder={
                      isNew
                        ? "Nhập API Key hệ thống..."
                        : "••••••••••••••••  (để trống để giữ nguyên key cũ)"
                    }
                    autoComplete="new-password"
                    className="flex-1 h-12 font-mono bg-white/5 border-white/10 rounded-xl"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowKey((s) => !s)}
                    className="h-12 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10"
                    aria-label={showKey ? "Ẩn key" : "Hiện key"}
                  >
                    {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </FormField>
            </div>
          </FormSection>

          <FormSection
            title="Danh sách Models hỗ trợ"
            description="Định nghĩa các mô hình học máy mà nhà cung cấp này hỗ trợ xử lý."
          >
            <div className="flex flex-col gap-3">
              <div className="hidden md:grid grid-cols-[1.5fr_1fr_auto_auto] gap-3 px-2 text-[11px] font-bold tracking-wider text-base-content/50 uppercase">
                <span>Model ID</span>
                <span>Tên hiển thị</span>
                <span className="text-center px-4">Reasoning</span>
                <span className="w-10"></span>
              </div>
              {form.models.map((m, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_auto_auto] gap-3 items-center p-3 rounded-2xl bg-white/[0.02] border border-white/5 group transition-colors hover:bg-white/[0.04]"
                >
                  <Input
                    value={m.id}
                    onChange={(e) => updateModel(i, "id", e.target.value)}
                    placeholder="gpt-4o-mini"
                    className="font-mono text-sm h-12 bg-white/5 border-white/10 rounded-xl"
                  />
                  <Input
                    value={m.name}
                    onChange={(e) => updateModel(i, "name", e.target.value)}
                    placeholder="GPT-4o Mini"
                    className="h-12 bg-white/5 border-white/10 rounded-xl"
                  />
                  <label className="flex items-center justify-center gap-2 text-xs font-medium px-4 h-12 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                    <Switch
                      checked={m.reasoning}
                      onChange={(e) => updateModel(i, "reasoning", e.target.checked)}
                      className="accent-primary"
                    />
                    <span className="md:hidden">Hỗ trợ Reasoning</span>
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removeModel(i)}
                    disabled={form.models.length === 1}
                    className="h-12 w-12 rounded-xl bg-danger/5 text-danger hover:bg-danger/10 border border-danger/10 disabled:opacity-30"
                    aria-label="Xoá model"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="ghost" onClick={addModel} className="self-start h-10 px-4 mt-2 rounded-xl border border-dashed border-white/10 text-[11px] font-semibold text-base-content/60 hover:text-white">
                <Plus size={14} className="mr-2" /> Thêm mô hình mới
              </Button>
            </div>
          </FormSection>
        </div>

        {/* Cột phụ: Cấu hình nâng cao & Vận hành */}
        <div className="flex flex-col gap-8">
          <FormSection title="Định tuyến & Chi phí">
            <div className="flex flex-col gap-6">
              <FormField label="Cấp dịch vụ (Tier)">
                <Select
                  value={form.tier}
                  onChange={(e) => setField("tier", e.target.value)}
                  className="h-12 bg-white/5 border-white/10 rounded-xl font-semibold"
                  options={[
                    { label: "Dành cho gói Miễn Phí", value: "free" },
                    { label: "Dành cho gói Trả Phí", value: "paid" },
                  ]}
                />
              </FormField>
              
              <FormField label="Độ ưu tiên (Priority)" hint="Số càng thấp càng được ưu tiên gọi trước">
                <Input
                  type="number"
                  value={form.priority}
                  onChange={(e) => setField("priority", Number(e.target.value))}
                  className="h-12 bg-white/5 border-white/10 rounded-xl font-mono"
                />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Chi phí Input (¢)">
                  <Input
                    type="number"
                    step="0.1"
                    value={form.input_cost_per_mtok_cents}
                    onChange={(e) => setField("input_cost_per_mtok_cents", Number(e.target.value))}
                    className="h-12 bg-white/5 border-white/10 rounded-xl"
                  />
                </FormField>
                <FormField label="Chi phí Output (¢)">
                  <Input
                    type="number"
                    step="0.1"
                    value={form.output_cost_per_mtok_cents}
                    onChange={(e) => setField("output_cost_per_mtok_cents", Number(e.target.value))}
                    className="h-12 bg-white/5 border-white/10 rounded-xl"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Hệ số Token In">
                  <Input
                    type="number"
                    step="0.1"
                    value={form.pi_tokens_per_input}
                    onChange={(e) => setField("pi_tokens_per_input", Number(e.target.value))}
                    className="h-12 bg-white/5 border-white/10 rounded-xl"
                  />
                </FormField>
                <FormField label="Hệ số Token Out">
                  <Input
                    type="number"
                    step="0.1"
                    value={form.pi_tokens_per_output}
                    onChange={(e) => setField("pi_tokens_per_output", Number(e.target.value))}
                    className="h-12 bg-white/5 border-white/10 rounded-xl"
                  />
                </FormField>
              </div>
            </div>
          </FormSection>

          <FormSection title="Custom Headers" description="Header tĩnh gắn thêm vào HTTP Request">
             <div className="flex flex-col gap-3">
              {form.extra_headers.map((h, i) => (
                <div key={i} className="flex flex-col gap-2 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="flex gap-2">
                    <Input
                      value={h.name}
                      onChange={(e) => updateHeader(i, "name", e.target.value)}
                      placeholder="Tên Header (VD: X-Custom-Auth)"
                      className="flex-1 font-mono text-[11px] h-10 bg-white/5 border-white/10 rounded-xl"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeHeader(i)}
                      className="h-10 w-10 shrink-0 rounded-xl bg-danger/5 text-danger hover:bg-danger/10 border border-danger/10"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                  <Input
                    value={h.value}
                    onChange={(e) => updateHeader(i, "value", e.target.value)}
                    placeholder="Giá trị Header..."
                    className="font-mono text-[11px] h-10 bg-white/5 border-white/10 rounded-xl"
                  />
                </div>
              ))}
              <Button type="button" variant="ghost" onClick={addHeader} className="h-10 rounded-xl border border-dashed border-white/10 text-[11px] font-semibold text-base-content/60 hover:text-white">
                <Plus size={14} className="mr-2" /> Thêm Header
              </Button>
            </div>
          </FormSection>

          <FormSection title="Trạng thái">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-bold text-white">Kích hoạt Node</span>
                <span className="text-xs text-base-content/40 leading-snug">Tham gia vào mạng lưới load balancing</span>
              </div>
              <Switch
                checked={form.is_enabled}
                onChange={(e) => setField("is_enabled", e.target.checked)}
              />
            </div>
          </FormSection>

          <div className="flex flex-col gap-3">
             {err && <Alert tone="danger" onDismiss={() => setErr("")}>{err}</Alert>}
             
             <Button 
               type="submit" 
               variant="primary" 
               disabled={saving} 
               className="h-14 w-full rounded-2xl font-bold tracking-wider text-xs shadow-xl shadow-primary/10"
             >
               {saving ? "ĐANG LƯU..." : isNew ? "THÊM NHÀ CUNG CẤP" : "LƯU THAY ĐỔI CẤU HÌNH"}
             </Button>
             
             <Button as={Link} to="/admin/providers" variant="ghost" className="h-12 w-full rounded-xl border border-white/5 text-[11px] font-semibold text-base-content/40">
               Hủy bỏ
             </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ProviderEditPage;




