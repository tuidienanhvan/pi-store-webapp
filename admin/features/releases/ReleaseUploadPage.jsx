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
    <div className="flex flex-col gap-10 pb-20">
      <AdminPageHeader 
        title="Phát hành phiên bản mới"
        tagline="Tải lên tệp thực thi và định nghĩa lộ trình cập nhật cho hệ thống ứng dụng Pi"
        actions={
          <Button as={Link} to="/admin/releases" variant="ghost" className="h-10 px-4 rounded-xl border border-white/5 font-semibold tracking-wider text-xs">
            <ArrowLeft size={14} className="mr-2" /> Quay lại danh sách
          </Button>
        }
      />

      <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột chính: Thông tin phiên bản & Upload */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <FormSection title="Thông tin phiên bản & Tệp ZIP" icon={UploadCloud}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <FormField label="Ứng dụng mục tiêu" required hint="Sản phẩm sẽ nhận bản cập nhật này">
                <Select 
                  value={form.plugin_slug} 
                  onChange={(e) => setForm({ ...form, plugin_slug: e.target.value })}
                  className="h-10 bg-white/5 border-white/10 rounded-xl font-semibold"
                  options={[{ label: "Pi-API Core", value: "pi-api" }]}
                />
              </FormField>
              <FormField label="Mã phiên bản (Version)" required hint="Định dạng Semantic Versioning (VD: 1.2.0)">
                <Input 
                  placeholder="1.2.0" 
                  value={form.version} 
                  onChange={(e) => setForm({ ...form, version: e.target.value })} 
                  className="h-10 font-mono bg-white/5 border-white/10 rounded-xl text-primary"
                  required
                />
              </FormField>
            </div>

            <div className="mt-8">
              <FormField label="Tải lên tệp thực thi (.zip)">
                <div className="relative group">
                  <input 
                    type="file" 
                    accept=".zip" 
                    onChange={(e) => setFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center justify-center gap-4 h-48 rounded-[2rem] border border-dashed border-white/10 bg-white/[0.02] group-hover:bg-primary/[0.04] group-hover:border-primary/40 transition-all duration-500">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-primary/20 group-hover:bg-primary/10 transition-all">
                      <UploadCloud size={32} className="text-white/20 group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-sm font-bold text-base-content/40 group-hover:text-white transition-colors tracking-wider">
                        {file ? file.name : "Kéo thả hoặc nhấn để chọn tệp .zip"}
                      </span>
                      <span className="text-xs font-semibold text-white/10 tracking-wide">Yêu cầu file nén zip thực thi</span>
                    </div>
                  </div>
                </div>
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Nhật ký thay đổi" icon={Zap}>
            <FormField label="Changelog (Markdown hỗ trợ)" hint="Thông tin này sẽ hiển thị cho người dùng khi cập nhật">
              <Textarea 
                rows={8} 
                placeholder="Mô tả các tính năng mới, cải tiến và các bản sửa lỗi trong phiên bản này..." 
                value={form.changelog} 
                onChange={(e) => setForm({ ...form, changelog: e.target.value })} 
                className="bg-white/5 border-white/10 rounded-2xl p-4 focus:border-primary/50 transition-all resize-none"
              />
            </FormField>
          </FormSection>
        </div>

        {/* Cột phụ: Phân quyền & Hành động */}
        <div className="flex flex-col gap-8">
          <FormSection title="Phân quyền truy cập" icon={ShieldPlus}>
            <div className="flex flex-col gap-6">
              <FormField label="Cấp độ tối thiểu (Tier)">
                <div className="grid grid-cols-1 gap-2">
                  {["free", "pro", "max"].map(tier => (
                    <button 
                      key={tier} 
                      type="button" 
                      onClick={() => setForm({...form, tier_required: tier})}
                      className={`flex items-center justify-between h-14 px-5 rounded-2xl border transition-all ${form.tier_required === tier ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-white/5 border-white/5 text-base-content/40 hover:bg-white/10'}`}
                    >
                      <span className="text-sm font-bold capitalize">{tier} Tier</span>
                      <div className={`w-2 h-2 rounded-full ${form.tier_required === tier ? 'bg-primary shadow-[0_0_8px_rgba(var(--color-primary),0.8)]' : 'bg-white/10'}`} />
                    </button>
                  ))}
                </div>
              </FormField>
              
              <div className="p-4 rounded-2xl bg-info/5 border border-info/10">
                 <p className="text-xs text-info/60 leading-relaxed italic">
                   Bản phát hành sẽ được kích hoạt ngay lập tức cho các khách hàng thuộc Tier đã chọn trở lên.
                 </p>
              </div>
            </div>
          </FormSection>

          <div className="flex flex-col gap-3">
             {err && <Alert tone="danger" onDismiss={() => setErr("")}>{err}</Alert>}
             
             <Button 
               type="submit" 
               variant="primary" 
               disabled={loading || !file} 
               className="h-14 w-full rounded-2xl font-bold tracking-wider text-xs shadow-xl shadow-primary/10"
             >
               {loading ? "ĐANG XỬ LÝ..." : "XÁC NHẬN PHÁT HÀNH"}
             </Button>
             
             <Button as={Link} to="/admin/releases" variant="ghost" className="h-10 w-full rounded-xl border border-white/5 text-xs font-semibold text-base-content/40">
               Hủy bỏ
             </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ReleaseUploadPage;




