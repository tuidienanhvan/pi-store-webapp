import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "@/_shared/api/api-client";
import { Alert, Button, Input, Select, Textarea } from "@/_shared/components/ui";
import { ShieldPlus, Zap, ArrowLeft, Info } from "lucide-react";
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

  const setField = (field, value) => setForm((cur) => ({ ...cur, [field]: value }));

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
    <div className="max-w-5xl mx-auto flex flex-col gap-6 pb-12">
      <AdminPageHeader
        title="Cấp giấy phép mới"
        tagline="Khởi tạo mã kích hoạt và quyền truy cập cho khách hàng"
        actions={
          <Button as={Link} to="/admin/licenses" variant="ghost" size="sm">
            <ArrowLeft size={14} className="mr-1.5" /> Danh sách
          </Button>
        }
      />

      <form onSubmit={submit} className="flex flex-col gap-5">
        {/* ─── Định danh & Sản phẩm ─── */}
        <FormSection title="Định danh & Sản phẩm" icon={ShieldPlus}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Email khách hàng"
              required
              hint="Dùng để đăng nhập và quản lý giấy phép"
            >
              <Input
                type="email"
                required
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                placeholder="name@example.com"
              />
            </FormField>

            <FormField
              label="Tên định danh"
              hint="Công ty hoặc cá nhân, hiển thị trên hồ sơ"
            >
              <Input
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="VD: Pi Web Agency"
              />
            </FormField>

            <FormField label="Sản phẩm tích hợp">
              <Select
                value={form.plugin}
                onChange={(e) => setField("plugin", e.target.value)}
                options={[
                  { label: "Pi-API Core", value: "pi-api" },
                  { label: "Pi-SEO Agent", value: "pi-seo" },
                  { label: "Pi-Chatbot", value: "pi-chatbot" },
                  { label: "Pi-Leads", value: "pi-leads" },
                ]}
              />
            </FormField>

            <FormField label="Gói dịch vụ">
              <Select
                value={form.tier}
                onChange={(e) => setField("tier", e.target.value)}
                options={[
                  { label: "Dùng thử (Free)", value: "free" },
                  { label: "Chuyên nghiệp (Pro)", value: "pro" },
                  { label: "Cao cấp (Max)", value: "max" },
                ]}
              />
            </FormField>
          </div>
        </FormSection>

        {/* ─── Hạn mức & Hiệu lực ─── */}
        <FormSection title="Hạn mức & Hiệu lực" icon={Zap}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Giới hạn số tên miền"
              hint="Số sites tối đa được phép kích hoạt"
            >
              <Input
                type="number"
                min="1"
                value={form.max_sites}
                onChange={(e) => setField("max_sites", e.target.value)}
              />
            </FormField>

            <FormField
              label="Thời gian hiệu lực (ngày)"
              hint="Nhập 0 để thiết lập vĩnh viễn"
            >
              <Input
                type="number"
                min="0"
                value={form.expires_days}
                onChange={(e) => setField("expires_days", e.target.value)}
              />
            </FormField>
          </div>
        </FormSection>

        {/* ─── Ghi chú nội bộ ─── */}
        <FormSection title="Ghi chú nội bộ">
          <FormField
            label="Ghi chú quản trị"
            hint="Lưu ý về hợp đồng, ưu đãi riêng, yêu cầu đặc biệt"
          >
            <Textarea
              rows={3}
              value={form.notes}
              onChange={(e) => setField("notes", e.target.value)}
              placeholder="VD: KH cam kết thanh toán quý — ưu tiên xử lý tickets..."
            />
          </FormField>

          <div className="flex items-start gap-2.5 p-3 rounded-md bg-base-content/5 border border-white/5">
            <Info size={14} className="text-base-content/50 mt-0.5 shrink-0" />
            <p className="text-xs text-base-content/60 leading-relaxed">
              Giấy phép sẽ được kích hoạt <strong className="text-base-content">ngay sau khi xác nhận</strong>.
              Mã định danh duy nhất tự sinh và gửi tới email khách hàng.
            </p>
          </div>
        </FormSection>

        {err && <Alert tone="danger" onDismiss={() => setErr("")}>{err}</Alert>}

        {/* Sticky footer save bar */}
        <div className="flex items-center gap-3 pt-3 sticky bottom-0 bg-base-100 py-3 border-t border-white/5">
          <Button as={Link} to="/admin/licenses" type="button" variant="ghost" className="flex-1">
            Huỷ
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={saving || !form.email.trim()}
            className="flex-1"
          >
            {saving ? "Đang xử lý..." : "Cấp giấy phép"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default LicenseCreatePage;
