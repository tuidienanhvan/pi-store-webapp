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
    <div className="flex flex-col gap-10 pb-20">
      <AdminPageHeader 
        title="Cấp giấy phép mới"
        tagline="Khởi tạo mã kích hoạt và quyền truy cập đặc quyền cho khách hàng trên hệ thống Pi"
        actions={
          <Button as={Link} to="/admin/licenses" variant="ghost" className="h-10 px-4 rounded-xl border border-white/5 font-semibold tracking-wider text-[11px]">
            <ArrowLeft size={14} className="mr-2" /> Quay lại danh sách
          </Button>
        }
      />

      <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột chính: Cấu hình License */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <FormSection title="Cấu hình định danh & Sản phẩm" icon={ShieldPlus}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <FormField label="Email khách hàng" required hint="Email dùng để đăng nhập và quản lý giấy phép">
                <Input
                  type="email"
                  required
                  value={form.email}
                  onChange={(event) => setField("email", event.target.value)}
                  placeholder="name@example.com"
                  className="h-12 bg-white/5 border-white/10 rounded-xl focus:border-primary/50 transition-all"
                />
              </FormField>
              <FormField label="Tên định danh (Công ty/Cá nhân)" hint="Hiển thị trên hồ sơ khách hàng">
                <Input
                  value={form.name}
                  onChange={(event) => setField("name", event.target.value)}
                  placeholder="Ví dụ: Pi Web Agency"
                  className="h-12 bg-white/5 border-white/10 rounded-xl focus:border-primary/50 transition-all"
                />
              </FormField>
              
              <FormField label="Sản phẩm tích hợp">
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60 z-10">
                    <Cpu size={16} />
                  </div>
                  <Select
                    value={form.plugin}
                    onChange={(event) => setField("plugin", event.target.value)}
                    className="h-12 pl-12 bg-white/5 border-white/10 rounded-xl focus:border-primary/50 transition-all font-semibold"
                    options={[
                      { label: "Pi-API Core", value: "pi-api" },
                      { label: "Pi-SEO Agent", value: "pi-seo" },
                      { label: "Pi-Chatbot", value: "pi-chatbot" },
                      { label: "Pi-Leads", value: "pi-leads" },
                    ]}
                  />
                </div>
              </FormField>

              <FormField label="Gói dịch vụ (Tier)">
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand/60 z-10">
                    <Zap size={16} />
                  </div>
                  <Select
                    value={form.tier}
                    onChange={(event) => setField("tier", event.target.value)}
                    className="h-12 pl-12 bg-white/5 border-white/10 rounded-xl focus:border-primary/50 transition-all font-semibold"
                    options={[
                      { label: "Dùng thử (Free)", value: "free" },
                      { label: "Chuyên nghiệp (Pro)", value: "pro" },
                      { label: "Cao cấp (Max)", value: "max" },
                    ]}
                  />
                </div>
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Hạn mức & Hiệu lực" icon={Zap}>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <FormField label="Giới hạn số trang (Max Sites)" hint="Số lượng tên miền được phép kích hoạt">
                  <Input
                    type="number"
                    min="1"
                    value={form.max_sites}
                    onChange={(event) => setField("max_sites", event.target.value)}
                    className="h-12 bg-white/5 border-white/10 rounded-xl"
                  />
                </FormField>
                <FormField label="Thời gian hiệu lực (Ngày)" hint="Nhập 0 để thiết lập vĩnh viễn">
                  <Input
                    type="number"
                    min="0"
                    value={form.expires_days}
                    onChange={(event) => setField("expires_days", event.target.value)}
                    className="h-12 bg-white/5 border-white/10 rounded-xl"
                  />
                </FormField>
             </div>
          </FormSection>
        </div>

        {/* Cột phụ: Thông tin bổ sung & Action */}
        <div className="flex flex-col gap-8">
          <FormSection title="Ghi chú & Bảo mật">
            <div className="flex flex-col gap-6">
              <FormField label="Ghi chú nội bộ" hint="Thông tin dành cho quản trị viên">
                <Textarea
                  rows={6}
                  value={form.notes}
                  onChange={(event) => setField("notes", event.target.value)}
                  placeholder="Lưu ý về hợp đồng, ưu đãi riêng hoặc yêu cầu đặc biệt từ khách hàng..."
                  className="bg-white/5 border-white/10 rounded-2xl p-4 focus:border-primary/50 transition-all resize-none"
                />
              </FormField>

              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                 <p className="text-[10px] text-primary/60 leading-relaxed">
                   Giấy phép sẽ được kích hoạt ngay lập tức sau khi xác nhận. Một mã định danh duy nhất sẽ được tạo cho người dùng này.
                 </p>
              </div>
            </div>
          </FormSection>

          <div className="flex flex-col gap-3">
             {err && <Alert tone="danger" onDismiss={() => setErr("")}>{err}</Alert>}
             
             <Button 
               type="submit" 
               variant="primary" 
               disabled={saving || !form.email.trim()} 
               className="h-14 w-full rounded-2xl font-bold tracking-wider text-xs shadow-xl shadow-primary/10"
             >
               {saving ? "ĐANG XỬ LÝ..." : "XÁC NHẬN TẠO GIẤY PHÉP"}
             </Button>
             
             <Button as={Link} to="/admin/licenses" variant="ghost" className="h-12 w-full rounded-xl border border-white/5 text-[11px] font-semibold text-base-content/40">
               Hủy bỏ và quay lại
             </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default LicenseCreatePage;




