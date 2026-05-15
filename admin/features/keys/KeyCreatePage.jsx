import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Alert, Button, Input, Select, Textarea } from "@/_shared/components/ui";
import { ArrowLeft } from "lucide-react";
import { FormField, FormSection, AdminPageHeader } from "../../_shared/components";
import { keysApi } from "./api";
import { providersApi } from "../providers/api";

export function KeyCreatePage() {
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [form, setForm] = useState({
    provider_id: "",
    key_value: "",
    label: "",
    monthly_quota_tokens: 0,
    notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    providersApi.list().then(res => setProviders(res.items || []));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr("");
    try {
      await keysApi.create({
        provider_id: Number(form.provider_id),
        key_value: form.key_value.trim(),
        label: form.label.trim(),
        monthly_quota_tokens: Number(form.monthly_quota_tokens || 0),
        notes: form.notes.trim(),
      });
      navigate("/admin/keys");
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12 max-w-4xl mx-auto">
      <AdminPageHeader 
        title="Đăng ký khóa bảo mật"
        tagline="Thêm khóa API mới vào hệ thống điều phối"
        actions={
          <Button as={Link} to="/admin/keys" variant="ghost" size="sm">
            <ArrowLeft size={14} className="mr-1.5" /> Danh sách
          </Button>
        }
      />

      <form onSubmit={submit} className="flex flex-col gap-5">
        <FormSection title="Cấu hình khóa API">
          <div className="flex flex-col gap-4">
            <FormField label="Nhà cung cấp" required>
              <Select
                value={form.provider_id}
                required
                onChange={(e) => setForm({ ...form, provider_id: e.target.value })}
                options={[
                  { label: "CHỌN NHÀ CUNG CẤP", value: "" },
                  ...providers.map((p) => ({ label: `${p.slug.toUpperCase()} — ${p.display_name}`, value: String(p.id) })),
                ]}
              />
            </FormField>
            <FormField label="Giá trị API Key (mã hóa khi lưu)" required>
              <Textarea
                required
                rows={3}
                value={form.key_value}
                onChange={(e) => setForm({ ...form, key_value: e.target.value })}
                placeholder="sk-..."
                className="font-mono"
              />
            </FormField>
            <FormField label="Nhãn hiển thị">
              <Input
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                placeholder="Ví dụ: groq-main-key"
              />
            </FormField>
            <FormField label="Hạn mức token hàng tháng" hint="Nhập 0 để không giới hạn">
              <Input
                type="number"
                min="0"
                value={form.monthly_quota_tokens}
                onChange={(e) => setForm({ ...form, monthly_quota_tokens: e.target.value })}
              />
            </FormField>
            <FormField label="Ghi chú triển khai">
              <Textarea
                rows={2}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </FormField>
          </div>
        </FormSection>

        {err && <Alert tone="danger" onDismiss={() => setErr("")}>{err}</Alert>}

        <div className="flex items-center gap-3 pt-3 sticky bottom-0 bg-base-100 py-4 -mx-6 px-6 border-t border-white/5">
          <Button as={Link} to="/admin/keys" type="button" variant="ghost" className="flex-1">
            Hủy bỏ
          </Button>
          <Button type="submit" variant="primary" disabled={saving || !form.provider_id || !form.key_value.trim()} className="flex-1">
            {saving ? "Đang đăng ký..." : "Đăng ký khóa"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default KeyCreatePage;
