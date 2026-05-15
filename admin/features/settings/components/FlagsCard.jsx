import React, { useState, useEffect } from "react";
import { 
  Button, 
  Switch
} from "@/_shared/components/ui";
import { Flag, UserPlus, CreditCard, Layers, Shield } from "lucide-react";
import { AdminCard } from "../../../_shared/components";

/**
 * FlagsCard: Quản lý các tính năng bật/tắt của hệ thống (Feature Flags).
 */
export function FlagsCard({ flags, onSave, saving }) {
  const [form, setForm] = useState(flags);
  useEffect(() => setForm(flags), [flags]);
  const toggleFlag = (key) => setForm({ ...form, [key]: !form[key] });

  const FLAG_SPEC = [
    { key: "signup_enabled", label: "ĐĂNG KÝ CÔNG KHAI", icon: UserPlus },
    { key: "billing_enabled", label: "NẠP TIỀN HỆ THỐNG", icon: CreditCard },
    { key: "marketplace_enabled", label: "CHỢ ỨNG DỤNG", icon: Layers },
    { key: "maintenance_mode", label: "CHẾ ĐỘ BẢO TRÌ", icon: Shield, danger: true },
  ];

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center gap-3 px-2">
         <Flag size={18} className="text-primary/60" />
         <h2 className="text-xs font-semibold tracking-wider text-base-content/40">Tính năng hệ thống (Flags)</h2>
      </div>
      <AdminCard className="p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FLAG_SPEC.map((f) => (
            <div key={f.key} onClick={() => toggleFlag(f.key)} 
              className={`flex flex-col gap-6 p-6 rounded-2xl border transition-all duration-300 cursor-pointer group ${form[f.key] ? (f.danger ?"bg-danger/5 border-danger/20" : "bg-primary/5 border-primary/20") : "bg-white/[0.02] border-white/5 hover:border-white/10"}`}>
              <div className="flex items-center justify-between">
                 <div className={`p-2 rounded-lg border ${form[f.key] ? (f.danger ?"bg-danger/10 border-danger/20 text-danger" : "bg-primary/10 border-primary/20 text-primary") : "bg-white/5 border-white/5 text-base-content/20"}`}>
                    <f.icon size={16} />
                 </div>
                 <Switch checked={!!form[f.key]} onChange={() => {}} className={f.danger ? "data-[state=checked]:bg-danger" : ""} />
              </div>
              <div className="flex flex-col gap-1">
                <span className={`text-xs font-semibold tracking-wider ${form[f.key] ? (f.danger ?"text-danger" : "text-white") : "text-base-content/40"}`}>{f.label}</span>
                <span className="text-xs font-mono font-bold opacity-20 lowercase tracking-tighter">{f.key}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-10 pt-8 border-t border-white/5">
          <Button type="button" variant="primary" disabled={saving} onClick={() => onSave(form)} className="h-10 px-10 rounded-xl font-semibold tracking-wider text-xs">
            {saving ? "Đang đồng bộ..." : "Lưu cấu hình hệ thống"}
          </Button>
        </div>
      </AdminCard>
    </section>
  );
}





