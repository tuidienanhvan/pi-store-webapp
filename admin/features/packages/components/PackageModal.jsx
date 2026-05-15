import React, { useState } from "react";
import { 
  Alert, 
  Button, 
  IconButton,
  Input, 
  Modal, 
  Textarea,
  Checkbox,
  Switch
} from "@/_shared/components/ui";
import { 
  X, 
  Plus,
  ShieldCheck,
} from "lucide-react";
import { AdminCard } from "../../../_shared/components";
import { packagesApi } from "../api";

const QUALITIES = ["fast", "balanced", "best"];

/**
 * PackageModal: Form tạo mới hoặc chỉnh sửa gói dịch vụ.
 */
export function PackageModal({ pkg, onClose, onSaved }) {
  const isNew = pkg === null;
  const [form, setForm] = useState(() => isNew ? {
    slug: "", display_name: "", description: "",
    price_cents_monthly: 0, price_cents_yearly: 0,
    token_quota_monthly: 0,
    allowed_qualities: ["fast"],
    routing_mode: "shared",
    allowed_tiers: ["free"],
    priority_boost: 0,
    dedicated_key_count: 0,
    features: [], sort_order: 100, is_active: true,
  } : {
    ...pkg,
    routing_mode: pkg.routing_mode || "shared",
    allowed_tiers: [...(pkg.allowed_tiers || ["free"])],
    priority_boost: pkg.priority_boost || 0,
    dedicated_key_count: pkg.dedicated_key_count || 0,
    features: [...(pkg.features || [])],
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const toggleQuality = (q) => {
    const cur = new Set(form.allowed_qualities);
    if (cur.has(q)) cur.delete(q); else cur.add(q);
    setForm({ ...form, allowed_qualities: Array.from(cur) });
  };

  const toggleTier = (t) => {
    const cur = new Set(form.allowed_tiers);
    if (cur.has(t)) cur.delete(t); else cur.add(t);
    setForm({ ...form, allowed_tiers: Array.from(cur) });
  };

  const submit = async (e) => {
    e.preventDefault(); setSaving(true); setErr("");
    try {
      if (isNew) await packagesApi.create(form);
      else await packagesApi.update(pkg.slug, form);
      onSaved();
    } catch (e2) { setErr(e2.message); }
    finally { setSaving(false); }
  };

  return (
    <Modal open={true} onClose={onClose} title={isNew ? "Tạo gói sản phẩm mới" : `Cấu hình gói: ${pkg.slug.toUpperCase()}`} size="lg">
      <div className="p-1">
        <AdminCard className="p-8 !bg-transparent border-none shadow-none">
          <form onSubmit={submit} className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <Input label="MÃ HỆ THỐNG (SLUG)" required disabled={!isNew} value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="pro" 
                className="bg-white/5 border-white/10 rounded-xl focus:border-primary/50 font-bold" />
              <Input label="TÊN HIỂN THỊ" required value={form.display_name}
                onChange={(e) => setForm({ ...form, display_name: e.target.value })} placeholder="Gói Chuyên nghiệp" 
                className="bg-white/5 border-white/10 rounded-xl focus:border-primary/50 font-bold" />
            </div>

            <Textarea label="MÔ TẢ SẢN PHẨM" rows={2} value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="bg-white/5 border-white/10 rounded-xl focus:border-primary/50 text-sm" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-base-content/40 ml-1">GIÁ HÀNG THÁNG (¢)</label>
                 <Input type="number" value={form.price_cents_monthly}
                   onChange={(e) => setForm({ ...form, price_cents_monthly: Number(e.target.value) })}
                   className="h-12 bg-white/5 border-white/10 rounded-xl font-mono font-bold" />
              </div>
              <div className="flex flex-col gap-2">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-base-content/40 ml-1">GIÁ HÀNG NĂM (¢)</label>
                 <Input type="number" value={form.price_cents_yearly}
                   onChange={(e) => setForm({ ...form, price_cents_yearly: Number(e.target.value) })}
                   className="h-12 bg-white/5 border-white/10 rounded-xl font-mono font-bold" />
              </div>
              <div className="flex flex-col gap-2">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-base-content/40 ml-1">HẠN MỨC TOKEN</label>
                 <Input type="number" value={form.token_quota_monthly}
                   onChange={(e) => setForm({ ...form, token_quota_monthly: Number(e.target.value) })}
                   className="h-12 bg-white/5 border-white/10 rounded-xl font-mono font-bold"
                   hint="Nhập 0 để không giới hạn" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="flex flex-col gap-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-primary/60 ml-1">CHẤT LƯỢNG CHO PHÉP</label>
                  <div className="flex flex-wrap gap-4 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5">
                    {QUALITIES.map((q) => (
                      <Checkbox key={q} label={q.toUpperCase()}
                        checked={form.allowed_qualities.includes(q)}
                        onChange={() => toggleQuality(q)}
                        className="text-[10px] font-bold tracking-widest" />
                    ))}
                  </div>
               </div>

               <div className="flex flex-col gap-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-primary/60 ml-1">TÍNH NĂNG HỆ THỐNG</label>
                  <div className="flex flex-col gap-2">
                    {form.features.map((f, i) => (
                      <div key={i} className="flex gap-2">
                        <Input value={f} className="flex-1 h-9 bg-white/5 border-white/10 rounded-lg text-xs" onChange={(e) => {
                          const nf = [...form.features]; nf[i] = e.target.value;
                          setForm({ ...form, features: nf });
                        }} />
                        <IconButton icon={X} size="sm" onClick={() => {
                          const nf = [...form.features]; nf.splice(i, 1);
                          setForm({ ...form, features: nf });
                        }} className="hover:text-danger" />
                      </div>
                    ))}
                    <Button type="button" variant="ghost" size="sm" onClick={() => {
                      setForm({ ...form, features: [...form.features, ""] });
                    }} className="h-8 w-fit text-[9px] font-bold uppercase tracking-widest hover:bg-white/5">
                      <Plus size={12} className="mr-1" /> Thêm tính năng
                    </Button>
                  </div>
               </div>
            </div>

            {/* Cấu hình Gateway */}
            <div className="p-8 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col gap-8 shadow-sm">
              <div className="flex items-center gap-3">
                 <ShieldCheck size={20} className="text-primary" />
                 <h3 className="text-sm font-bold uppercase tracking-tight m-0">Cấu hình điều phối Gateway</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="flex flex-col gap-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-base-content/40">CHIẾN LƯỢC ĐỊNH TUYẾN</label>
                    <div className="flex flex-wrap gap-4">
                      {[
                        { val: "shared", lab: "Bể chung (Shared)" },
                        { val: "dedicated", lab: "Khóa riêng" },
                        { val: "hybrid", lab: "Dự phòng (Hybrid)" }
                      ].map((m) => (
                        <label key={m.val} className="flex items-center gap-2 cursor-pointer group">
                          <input type="radio" name="routing_mode" value={m.val}
                            checked={form.routing_mode === m.val}
                            onChange={() => setForm({ ...form, routing_mode: m.val })}
                            className="w-3 h-3 accent-primary" />
                          <span className={`text-[10px] font-bold tracking-widest uppercase transition-colors ${form.routing_mode === m.val ?'text-primary' : 'text-base-content/40 group-hover:text-base-content/60'}`}>{m.lab}</span>
                        </label>
                      ))}
                    </div>
                 </div>

                 <div className="flex flex-col gap-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-base-content/40">CẤP ĐỘ TRUY CẬP</label>
                    <div className="flex gap-4">
                      {["free", "paid"].map((t) => (
                        <Checkbox key={t} label={t === 'free' ? 'MIỄN PHÍ' : 'TRẢ PHÍ'}
                          checked={form.allowed_tiers.includes(t)}
                          onChange={() => toggleTier(t)}
                          className="text-[10px] font-bold tracking-widest" />
                      ))}
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-base-content/40 ml-1">ĐỘ ƯU TIÊN (0-100)</label>
                   <Input type="number" min={0} max={100} value={form.priority_boost}
                     onChange={(e) => setForm({ ...form, priority_boost: Number(e.target.value) })}
                     className="h-10 bg-white/5 border-white/10 rounded-xl font-mono font-bold text-xs" />
                </div>
                <div className="flex flex-col gap-2">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-base-content/40 ml-1">TỰ ĐỘNG CẤP KHÓA</label>
                   <Input type="number" min={0} value={form.dedicated_key_count}
                     onChange={(e) => setForm({ ...form, dedicated_key_count: Number(e.target.value) })}
                     className="h-10 bg-white/5 border-white/10 rounded-xl font-mono font-bold text-xs"
                     hint="Số lượng khóa cấp tự động khi gán gói" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
               <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-base-content/40 ml-1">THỨ TỰ HIỂN THỊ</label>
                  <Input type="number" value={form.sort_order}
                    onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                    className="h-10 bg-white/5 border-white/10 rounded-xl font-mono font-bold text-xs" />
               </div>
               <div className="flex items-center gap-3 pt-6">
                  <Switch checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                  <span className="text-[11px] font-bold uppercase tracking-widest">Trạng thái kích hoạt</span>
               </div>
            </div>

            {err && <Alert tone="danger" className="rounded-xl">{err}</Alert>}

            <div className="flex items-center gap-4 pt-4 border-t border-white/5">
              <Button type="button" variant="ghost" onClick={onClose} className="flex-1 h-12 rounded-xl font-bold uppercase tracking-widest text-[10px]">Hủy bỏ</Button>
              <Button type="submit" variant="primary" disabled={saving} className="flex-1 h-12 rounded-xl font-bold uppercase tracking-widest text-[10px]">
                {saving ? "Đang lưu..." : (isNew ? "Tạo gói dịch vụ" : "Lưu thay đổi")}
              </Button>
            </div>
          </form>
        </AdminCard>
      </div>
    </Modal>
  );
}
