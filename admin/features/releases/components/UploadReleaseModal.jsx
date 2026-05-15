import React, { useState } from "react";
import { 
  Button, 
  Input, 
  Select, 
  Textarea, 
  Modal
} from "@/_shared/components/ui";
import { UploadCloud } from "lucide-react";
import { AdminCard } from "../../../_shared/components";
import { releasesApi } from "../api";

/**
 * UploadReleaseModal: Form tải lên và phát hành phiên bản mới.
 */
export function UploadReleaseModal({ open, onClose, onUploaded }) {
  const [form, setForm] = useState({
    plugin_slug: "pi-api",
    version: "",
    tier_required: "free",
    changelog: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Vui lòng chọn tệp ZIP thực thi.");
    
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("plugin_slug", form.plugin_slug);
      fd.append("version", form.version);
      fd.append("tier_required", form.tier_required);
      fd.append("changelog", form.changelog);

      await releasesApi.upload(fd);
      onUploaded();
      onClose();
    } catch (e) {
      alert("Lỗi phát hành: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Phát hành phiên bản mới" size="lg">
      <div className="p-1">
        <AdminCard className="p-8 !bg-transparent border-none shadow-none">
          <form onSubmit={submit} className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-primary/60 ml-1">MÃ ỨNG DỤNG</label>
                <Select 
                  value={form.plugin_slug} 
                  onChange={(e) => setForm({ ...form, plugin_slug: e.target.value })}
                  options={[{ label: "HỆ THỐNG PI API", value: "pi-api" }]}
                  className="h-12 bg-white/5 border-white/10 rounded-xl font-bold uppercase text-xs"
                />
              </div>
              <div className="flex flex-col gap-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-primary/60 ml-1">MÃ PHIÊN BẢN</label>
                <Input 
                  placeholder="Ví dụ: 1.2.0" 
                  value={form.version} 
                  onChange={(e) => setForm({ ...form, version: e.target.value })} 
                  className="h-12 bg-white/5 border-white/10 rounded-xl font-mono font-bold text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-primary/60 ml-1">CẤP ĐỘ TRUY CẬP YÊU CẦU</label>
              <div className="grid grid-cols-3 gap-3">
                 {["free", "pro", "max"].map(tier => (
                    <button key={tier} type="button" onClick={() => setForm({...form, tier_required: tier})}
                      className={`h-11 rounded-xl border font-bold uppercase tracking-widest text-[9px] transition-all ${form.tier_required === tier ?'bg-primary/20 border-primary/40 text-primary' : 'bg-white/5 border-white/5 text-base-content/40 hover:bg-white/10'}`}>
                      {tier.toUpperCase()} TIER
                    </button>
                 ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-primary/60 ml-1">NHẬT KÝ THAY ĐỔI (CHANGELOG)</label>
              <Textarea 
                rows={4} 
                placeholder="Mô tả các thay đổi, tính năng mới và các lỗi đã sửa..." 
                value={form.changelog} 
                onChange={(e) => setForm({ ...form, changelog: e.target.value })} 
                className="bg-white/5 border-white/10 rounded-xl p-4 text-xs font-bold leading-relaxed"
              />
            </div>

            <div className="flex flex-col gap-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-primary/60 ml-1">TỆP THỰC THI (.ZIP)</label>
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
                    <span className="text-[11px] font-bold text-base-content/40 group-hover:text-white transition-colors uppercase tracking-widest">
                      {file ? file.name : "KÉO THẢ HOẶC CHỌN TỆP ZIP"}
                    </span>
                    <span className="text-[9px] font-bold text-white/10 uppercase tracking-widest">Yêu cầu tệp định dạng .zip</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-8 border-t border-white/5">
              <Button variant="ghost" onClick={onClose} type="button" className="h-12 px-8 font-bold uppercase tracking-widest text-[10px]">Hủy bỏ</Button>
              <Button variant="primary" type="submit" disabled={loading} className="h-12 px-10 rounded-xl font-bold uppercase tracking-widest text-[10px]">
                {loading ? "Đang xử lý..." : "Bắt đầu phát hành"}
              </Button>
            </div>
          </form>
        </AdminCard>
      </div>
    </Modal>
  );
}
