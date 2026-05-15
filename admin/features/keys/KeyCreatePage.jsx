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
    <div className="flex flex-col gap-10 pb-20">
      <AdminPageHeader 
        title="Đăng ký khóa bảo mật"
        tagline="Thêm khóa API mới vào hệ thống điều phối"
        actions={
          <Button as={Link} to="/admin/keys" variant="ghost" className="h-10 px-4 rounded-xl border border-white/5 font-semibold tracking-wider text-xs">
            <ArrowLeft size={14} className="mr-2" /> Quay lại danh sách
          </Button>
        }
      />

      <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột chính: Thông tin cốt lõi */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <FormSection title="Cấu hình khóa API chính">
            <div className="flex flex-col gap-6">
              <FormField label="Nhà cung cấp (Provider)" required hint="Chọn hệ thống đích để gắn khóa">
                <Select
                  value={form.provider_id}
                  required
                  onChange={(e) => setForm({ ...form, provider_id: e.target.value })}
                  className="h-12 bg-white/5 border-white/10 rounded-xl font-bold"
                  options={[
                    { label: "CHỌN NHÀ CUNG CẤP...", value: "" },
                    ...providers.map((p) => ({ label: `${p.slug} — ${p.display_name}`, value: String(p.id) })),
                  ]}
                />
              </FormField>
              
              <FormField label="Giá trị API Key (Bảo mật)" required hint="Khóa sẽ được mã hóa an toàn khi lưu trữ">
                <Textarea
                  required
                  rows={4}
                  value={form.key_value}
                  onChange={(e) => setForm({ ...form, key_value: e.target.value })}
                  placeholder="sk-..."
                  className="font-mono bg-white/5 border-white/10 rounded-2xl p-4 focus:border-primary/50 transition-all resize-none text-primary"
                />
              </FormField>

              <FormField label="Ghi chú triển khai (Tùy chọn)">
                <Textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Thêm ghi chú để dễ dàng quản lý sau này..."
                  className="bg-white/5 border-white/10 rounded-2xl p-4 focus:border-primary/50 transition-all resize-none text-sm"
                />
              </FormField>
            </div>
          </FormSection>
        </div>

        {/* Cột phụ: Quản lý & Giới hạn */}
        <div className="flex flex-col gap-8">
          <FormSection title="Quản lý định mức">
            <div className="flex flex-col gap-6">
              <FormField label="Nhãn hiển thị (Label)" hint="Tên gọi gợi nhớ cho khóa này">
                <Input
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  placeholder="Ví dụ: groq-main-key"
                  className="h-12 bg-white/5 border-white/10 rounded-xl"
                />
              </FormField>
              
              <FormField label="Hạn mức Token / Tháng" hint="Nhập 0 để không giới hạn">
                <Input
                  type="number"
                  min="0"
                  value={form.monthly_quota_tokens}
                  onChange={(e) => setForm({ ...form, monthly_quota_tokens: e.target.value })}
                  className="h-12 bg-white/5 border-white/10 rounded-xl font-mono text-primary font-bold"
                />
              </FormField>
            </div>
          </FormSection>

          <div className="flex flex-col gap-3">
             {err && <Alert tone="danger" onDismiss={() => setErr("")}>{err}</Alert>}
             
             <Button 
               type="submit" 
               variant="primary" 
               disabled={saving || !form.provider_id || !form.key_value.trim()} 
               className="h-14 w-full rounded-2xl font-bold tracking-wider text-xs shadow-primary"
             >
               {saving ? "ĐANG ĐĂNG KÝ..." : "XÁC NHẬN ĐĂNG KÝ KHÓA"}
             </Button>
             
             <Button as={Link} to="/admin/keys" variant="ghost" className="h-12 w-full rounded-xl border border-white/5 text-xs font-semibold text-base-content/40">
               Hủy bỏ
             </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default KeyCreatePage;




