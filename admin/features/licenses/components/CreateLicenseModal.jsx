import { useState } from "react";
import { api } from "@/_shared/api/api-client";
import { Alert, Button, Input, Modal, Select, Textarea } from "@/_shared/components/ui";
import { AdminCard } from "../../../_shared/components/AdminCard";
import { ShieldPlus, Zap, Cpu } from "lucide-react";

const INITIAL_FORM = {
  email: "",
  name: "",
  plugin: "pi-api",
  tier: "pro",
  max_sites: 1,
  expires_days: 365,
  notes: "",
};

/**
 * CreateLicenseModal: Modal tạo giấy phép mới cho khách hàng.
 */
export function CreateLicenseModal({ open, onClose, onCreated }) {
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
      setForm(INITIAL_FORM);
      await onCreated?.();
      onClose();
    } catch (error) {
      setErr(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Cấp giấy phép mới" size="lg">
      <div className="p-1">
        <AdminCard className="p-8 !bg-transparent border-none shadow-none">
          <form onSubmit={submit} className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
               <div className="flex items-center gap-3">
                  <ShieldPlus size={20} className="text-primary" />
                  <h3 className="text-lg font-bold uppercase tracking-tight m-0">Cấu hình đăng ký</h3>
               </div>
               <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-widest">Khởi tạo mã kích hoạt mới trên hệ thống Pi</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <Input
                label="EMAIL KHÁCH HÀNG"
                type="email"
                required
                value={form.email}
                onChange={(event) => setField("email", event.target.value)}
                placeholder="customer@example.com"
                className="bg-white/5 border-white/10 rounded-xl focus:border-primary/50 transition-all font-bold"
              />
              <Input
                label="TÊN ĐỊNH DANH"
                value={form.name}
                onChange={(event) => setField("name", event.target.value)}
                placeholder="Tên khách hàng hoặc công ty"
                className="bg-white/5 border-white/10 rounded-xl focus:border-primary/50 transition-all font-bold"
              />
              
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-base-content/40 ml-1">SẢN PHẨM</label>
                <div className="relative group">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary z-10">
                      <Cpu size={14} />
                   </div>
                   <Select
                    value={form.plugin}
                    onChange={(event) => setField("plugin", event.target.value)}
                    className="pl-12 h-12 bg-white/5 border-white/10 rounded-xl font-bold uppercase tracking-widest text-[11px] focus:border-primary/50"
                    options={[
                      { label: "PI-API CORE", value: "pi-api" },
                      { label: "PI-SEO AGENT", value: "pi-seo" },
                      { label: "PI-CHATBOT", value: "pi-chatbot" },
                      { label: "PI-LEADS", value: "pi-leads" },
                    ]}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-base-content/40 ml-1">HẠNG DỊCH VỤ</label>
                <div className="relative group">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary z-10">
                      <Zap size={14} />
                   </div>
                   <Select
                    value={form.tier}
                    onChange={(event) => setField("tier", event.target.value)}
                    className="pl-12 h-12 bg-white/5 border-white/10 rounded-xl font-bold uppercase tracking-widest text-[11px] focus:border-primary/50"
                    options={[
                      { label: "DÙNG THỬ (FREE)", value: "free" },
                      { label: "CHUYÊN NGHIỆP (PRO)", value: "pro" },
                      { label: "CAO CẤP (MAX)", value: "max" },
                    ]}
                  />
                </div>
              </div>

              <Input
                label="GIỚI HẠN SỐ TRANG (MAX SITES)"
                type="number"
                min="1"
                value={form.max_sites}
                onChange={(event) => setField("max_sites", event.target.value)}
                className="bg-white/5 border-white/10 rounded-xl focus:border-primary/50 transition-all font-mono font-bold"
              />
              <Input
                label="THỜI GIAN HIỆU LỰC (NGÀY)"
                type="number"
                min="0"
                hint="0 = Vĩnh viễn"
                value={form.expires_days}
                onChange={(event) => setField("expires_days", event.target.value)}
                className="bg-white/5 border-white/10 rounded-xl focus:border-primary/50 transition-all font-mono font-bold"
              />
            </div>

            <div className="flex flex-col gap-2">
               <Textarea
                label="GHI CHÚ NỘI BỘ"
                rows={3}
                value={form.notes}
                onChange={(event) => setField("notes", event.target.value)}
                placeholder="Thông tin hỗ trợ, bối cảnh hợp đồng..."
                className="bg-white/5 border-white/10 rounded-xl focus:border-primary/50 transition-all font-medium text-sm"
              />
            </div>

            {err && <Alert tone="danger" className="rounded-xl border-danger/20 bg-danger/5">{err}</Alert>}

            <div className="flex items-center gap-4 pt-4 mt-2 border-t border-white/5">
              <Button type="button" variant="ghost" onClick={onClose} className="flex-1 h-12 rounded-xl font-bold uppercase tracking-widest text-[10px]">
                Hủy bỏ
              </Button>
              <Button type="submit" variant="primary" disabled={saving || !form.email.trim()} className="flex-1 h-12 rounded-xl font-bold uppercase tracking-widest text-[10px]">
                {saving ? "Đang xử lý..." : "Xác nhận tạo"}
              </Button>
            </div>
          </form>
        </AdminCard>
      </div>
    </Modal>
  );
}
