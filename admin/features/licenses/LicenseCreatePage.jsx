import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "@/_shared/api/api-client";
import { Alert, Button, Input, Select, Textarea } from "@/_shared/components/ui";
import { ShieldPlus, Zap, Cpu, ArrowLeft } from "lucide-react";
import {
  AdminPageHeader,
  FormField,
  FormSection,
} from "../../_shared/components";

const INITIAL_FORM = {
  email: "",
  name: "",
  plugin: "pi-api",
  tier: "pro",
  max_sites: 1,
  expires_days: 365,
  notes: "",
};

export function LicenseCreatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setErr("");
    try {
      await api.admin.createLicense({
        plugin: form.plugin,
        email: form.email.trim(),
        name: form.name.trim(),
        tier: form.tier,
        max_sites: Number(form.max_sites || 1),
        expires_days: Number(form.expires_days || 0),
        notes: form.notes.trim(),
      });
      navigate("/admin/licenses");
    } catch (error) {
      setErr(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12 max-w-4xl mx-auto">
      <AdminPageHeader 
        title="Cấp giấy phép mới"
        tagline="Khởi tạo mã kích hoạt mới trên hệ thống Pi"
        actions={
          <Button as={Link} to="/admin/licenses" variant="ghost" size="sm">
            <ArrowLeft size={14} className="mr-1.5" /> Danh sách
          </Button>
        }
      />

      <form onSubmit={submit} className="flex flex-col gap-5">
        <FormSection title="Cấu hình đăng ký" icon={ShieldPlus}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Email khách hàng" required>
              <Input
                type="email"
                required
                value={form.email}
                onChange={(event) => setField("email", event.target.value)}
                placeholder="customer@example.com"
              />
            </FormField>
            <FormField label="Tên định danh">
              <Input
                value={form.name}
                onChange={(event) => setField("name", event.target.value)}
                placeholder="Tên khách hàng hoặc công ty"
              />
            </FormField>
            
            <FormField label="Sản phẩm">
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary z-10">
                  <Cpu size={14} />
                </div>
                <Select
                  value={form.plugin}
                  onChange={(event) => setField("plugin", event.target.value)}
                  className="pl-12"
                  options={[
                    { label: "PI-API CORE", value: "pi-api" },
                    { label: "PI-SEO AGENT", value: "pi-seo" },
                    { label: "PI-CHATBOT", value: "pi-chatbot" },
                    { label: "PI-LEADS", value: "pi-leads" },
                  ]}
                />
              </div>
            </FormField>

            <FormField label="Hạng dịch vụ">
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary z-10">
                  <Zap size={14} />
                </div>
                <Select
                  value={form.tier}
                  onChange={(event) => setField("tier", event.target.value)}
                  className="pl-12"
                  options={[
                    { label: "Dùng thử (Free)", value: "free" },
                    { label: "Chuyên nghiệp (Pro)", value: "pro" },
                    { label: "Cao cấp (Max)", value: "max" },
                  ]}
                />
              </div>
            </FormField>

            <FormField label="Giới hạn số trang (Max sites)">
              <Input
                type="number"
                min="1"
                value={form.max_sites}
                onChange={(event) => setField("max_sites", event.target.value)}
              />
            </FormField>
            <FormField label="Thời gian hiệu lực (Ngày)" hint="0 = Vĩnh viễn">
              <Input
                type="number"
                min="0"
                value={form.expires_days}
                onChange={(event) => setField("expires_days", event.target.value)}
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Thông tin bổ sung">
          <FormField label="Ghi chú nội bộ">
            <Textarea
              rows={3}
              value={form.notes}
              onChange={(event) => setField("notes", event.target.value)}
              placeholder="Thông tin hỗ trợ, bối cảnh hợp đồng..."
            />
          </FormField>
        </FormSection>

        {err && <Alert tone="danger" onDismiss={() => setErr("")}>{err}</Alert>}

        <div className="flex items-center gap-3 pt-3 sticky bottom-0 bg-base-100 py-4 -mx-6 px-6 border-t border-white/5">
          <Button as={Link} to="/admin/licenses" type="button" variant="ghost" className="flex-1">
            Hủy bỏ
          </Button>
          <Button type="submit" variant="primary" disabled={saving || !form.email.trim()} className="flex-1">
            {saving ? "Đang xử lý..." : "Xác nhận tạo"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default LicenseCreatePage;
