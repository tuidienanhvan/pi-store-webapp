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
import './LicenseCreatePage.css';

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
    <div className="pi-license-create-page flex flex-col gap-10 pb-20">
      <AdminPageHeader
        title="Cấp giấy phép mới"
        tagline="Khởi tạo mã kích hoạt và quyền truy cập cho khách hàng"
        actions={
          <Button as={Link} to="/admin/licenses" variant="ghost" className="h-10 px-4 rounded-xl border border-base-content/5 font-semibold tracking-wider text-xs">
            <ArrowLeft size={14} className="mr-2" /> Quay lại danh sách
          </Button>
        }
      />

      <form onSubmit={submit} className="pi-license-create-page__form grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột chính: Thông tin cốt lõi */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <FormSection title="Định danh & Sản phẩm" icon={ShieldPlus}>
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    className="h-14 bg-base-content/5 border-base-content/10 rounded-xl"
                  />
                </FormField>

                <FormField
                  label="Tên định danh (Tùy chọn)"
                  hint="Công ty hoặc cá nhân, hiển thị trên hồ sơ"
                >
                  <Input
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                    placeholder="VD: Pi Web Agency"
                    className="h-14 bg-base-content/5 border-base-content/10 rounded-xl"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Sản phẩm tích hợp">
                  <Select
                    value={form.plugin}
                    onChange={(e) => setField("plugin", e.target.value)}
                    className="h-14 bg-base-content/5 border-base-content/10 rounded-xl font-bold text-sm"
                    options={[
                      { label: "Pi-API Core", value: "pi-api" },
                      { label: "Pi-SEO Agent", value: "pi-seo" },
                      { label: "Pi-Chatbot", value: "pi-chatbot" },
                      { label: "Pi-Leads", value: "pi-leads" },
                    ]}
                  />
                </FormField>

                <FormField label="Gói dịch vụ ban đầu">
                  <Select
                    value={form.tier}
                    onChange={(e) => setField("tier", e.target.value)}
                    className="h-14 bg-base-content/5 border-base-content/10 rounded-xl font-bold text-sm"
                    options={[
                      { label: "Dùng thử (Free)", value: "free" },
                      { label: "Chuyên nghiệp (Pro)", value: "pro" },
                      { label: "Cao cấp (Max)", value: "max" },
                    ]}
                  />
                </FormField>
              </div>
              
              <div className="flex items-start gap-3 p-5 rounded-2xl bg-base-content/[0.02] border border-base-content/5 mt-2">
                <Info size={16} className="text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-base-content/60 leading-relaxed uppercase tracking-wider font-semibold">
                  Giấy phép sẽ được kích hoạt <strong className="text-primary font-bold">ngay sau khi xác nhận</strong>.
                  Mã định danh duy nhất tự sinh và gửi tới email khách hàng.
                </p>
              </div>
            </div>
          </FormSection>
        </div>

        {/* Cột phụ: Giới hạn & Quản trị */}
        <div className="flex flex-col gap-8">
          <FormSection title="Giới hạn & Hiệu lực" icon={Zap}>
            <div className="flex flex-col gap-6">
              <FormField
                label="Giới hạn số Sites (Domains)"
                hint="Số website tối đa được phép kích hoạt"
              >
                <Input
                  type="number"
                  min="1"
                  value={form.max_sites}
                  onChange={(e) => setField("max_sites", e.target.value)}
                  className="h-12 bg-base-content/5 border-base-content/10 rounded-xl font-mono text-primary font-bold text-lg"
                />
              </FormField>

              <FormField
                label="Thời gian hiệu lực (Ngày)"
                hint="Nhập 0 để thiết lập vĩnh viễn (Lifetime)"
              >
                <Input
                  type="number"
                  min="0"
                  value={form.expires_days}
                  onChange={(e) => setField("expires_days", e.target.value)}
                  className="h-12 bg-base-content/5 border-base-content/10 rounded-xl font-mono text-lg"
                />
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Ghi chú Quản Trị">
            <Textarea
              rows={4}
              value={form.notes}
              onChange={(e) => setField("notes", e.target.value)}
              placeholder="Ghi chú về hợp đồng, ưu đãi, yêu cầu đặc biệt... Chỉ nội bộ xem được."
              className="bg-base-content/5 border-base-content/10 rounded-2xl p-4 focus:border-primary/50 transition-all resize-none text-sm"
            />
          </FormSection>

          <div className="flex flex-col gap-3">
             {err && <Alert tone="danger" onDismiss={() => setErr("")}>{err}</Alert>}
             
             <Button 
               type="submit" 
               variant="primary" 
               disabled={saving || !form.email.trim()} 
               className="h-14 w-full rounded-2xl font-bold tracking-wider text-xs shadow-primary"
             >
               {saving ? "ĐANG XỬ LÝ..." : "CẤP GIẤY PHÉP MỚI"}
             </Button>
             
             <Button as={Link} to="/admin/licenses" variant="ghost" className="h-12 w-full rounded-xl border border-base-content/5 text-xs font-semibold text-base-content/40">
               Hủy bỏ
             </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default LicenseCreatePage;
