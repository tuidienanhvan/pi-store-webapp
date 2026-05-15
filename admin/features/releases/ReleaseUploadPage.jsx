import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Alert, Button, Input, Select, Textarea } from "@/_shared/components/ui";
import { UploadCloud, ArrowLeft } from "lucide-react";
import { FormField, FormSection, AdminPageHeader } from "../../_shared/components";
import { releasesApi } from "./api";

export function ReleaseUploadPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    plugin_slug: "pi-api",
    version: "",
    tier_required: "free",
    changelog: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!file) {
      setErr("Vui lòng chọn tệp ZIP thực thi.");
      return;
    }
    
    setLoading(true);
    setErr("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("plugin_slug", form.plugin_slug);
      fd.append("version", form.version);
      fd.append("tier_required", form.tier_required);
      fd.append("changelog", form.changelog);

      await releasesApi.upload(fd);
      navigate("/admin/releases");
    } catch (e) {
      setErr("Lỗi phát hành: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12 max-w-4xl mx-auto">
      <AdminPageHeader 
        title="Phát hành phiên bản mới"
        tagline="Tải lên tệp thực thi và định nghĩa phiên bản cho hệ thống"
        actions={
          <Button as={Link} to="/admin/releases" variant="ghost" size="sm">
            <ArrowLeft size={14} className="mr-1.5" /> Danh sách
          </Button>
        }
      />

      <form onSubmit={submit} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Mã ứng dụng" required>
            <Select 
              value={form.plugin_slug} 
              onChange={(e) => setForm({ ...form, plugin_slug: e.target.value })}
              options={[{ label: "HỆ THỐNG PI API", value: "pi-api" }]}
            />
          </FormField>
          <FormField label="Mã phiên bản" required>
            <Input 
              placeholder="Ví dụ: 1.2.0" 
              value={form.version} 
              onChange={(e) => setForm({ ...form, version: e.target.value })} 
              className="font-mono"
              required
            />
          </FormField>
        </div>

        <FormSection title="Phân quyền & Nội dung">
          <div className="flex flex-col gap-4">
            <FormField label="Cấp độ truy cập yêu cầu">
              <div className="grid grid-cols-3 gap-3">
                {["free", "pro", "max"].map(tier => (
                  <button 
                    key={tier} 
                    type="button" 
                    onClick={() => setForm({...form, tier_required: tier})}
                    className={`h-11 rounded-xl border font-medium uppercase transition-all ${form.tier_required === tier ?'bg-primary/20 border-primary/40 text-primary' : 'bg-white/5 border-white/5 text-base-content/40 hover:bg-white/10'}`}
                  >
                    {tier.toUpperCase()} TIER
                  </button>
                ))}
              </div>
            </FormField>
            <FormField label="Nhật ký thay đổi (Changelog)">
              <Textarea 
                rows={4} 
                placeholder="Mô tả các thay đổi, tính năng mới và các lỗi đã sửa..." 
                value={form.changelog} 
                onChange={(e) => setForm({ ...form, changelog: e.target.value })} 
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Tải lên tệp thực thi">
          <div className="relative group">
            <input 
              type="file" 
              accept=".zip" 
              onChange={(e) => setFile(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="flex flex-col items-center justify-center gap-4 h-40 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] group-hover:bg-primary/[0.03] group-hover:border-primary/40 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-primary/20 group-hover:bg-primary/10 transition-all">
                <UploadCloud size={28} className="text-white/20 group-hover:text-primary transition-colors" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-sm font-medium text-base-content/40 group-hover:text-white transition-colors uppercase tracking-widest">
                  {file ? file.name : "KÉO THẢ HOẶC CHỌN TỆP ZIP"}
                </span>
                <span className="text-xs font-medium text-white/10 uppercase tracking-widest">Yêu cầu tệp định dạng .zip</span>
              </div>
            </div>
          </div>
        </FormSection>

        {err && <Alert tone="danger" onDismiss={() => setErr("")}>{err}</Alert>}

        <div className="flex items-center justify-end gap-4 pt-8 border-t border-white/5 sticky bottom-0 bg-base-100 py-4 -mx-6 px-6">
          <Button variant="ghost" onClick={() => navigate("/admin/releases")} type="button" className="flex-1">Hủy bỏ</Button>
          <Button variant="primary" type="submit" disabled={loading} className="flex-1">
            {loading ? "Đang xử lý..." : "Bắt đầu phát hành"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ReleaseUploadPage;
