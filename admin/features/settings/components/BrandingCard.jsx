import React, { useState, useEffect } from "react";
import { 
  Button, 
  Input 
} from "@/_shared/components/ui";
import { Palette } from "lucide-react";
import { AdminCard } from "../../../_shared/components";
import './BrandingCard.css';

/**
 * BrandingCard: Cấu hình nhận diện thương hiệu của hệ thống.
 */
export function BrandingCard({ branding, onSave, saving }) {
  const [form, setForm] = useState(branding);
  useEffect(() => setForm(branding), [branding]);

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center gap-3 px-2">
         <Palette size={18} className="text-primary/60" />
         <h2 className="text-xs font-semibold tracking-wider text-base-content/40">Nhận diện thương hiệu</h2>
      </div>
      <AdminCard className="p-10">
        <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="flex flex-col gap-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <Input 
              label="TÊN HỆ THỐNG"
              required 
              value={form.site_name} 
              onChange={(e) => setForm({ ...form, site_name: e.target.value })} 
              className="h-10 bg-white/5 border-white/10 rounded-xl font-bold"
            />
            <Input 
              label="URL LOGO CHÍNH"
              value={form.logo_url} 
              onChange={(e) => setForm({ ...form, logo_url: e.target.value })} 
              placeholder="/logo.svg" 
              className="h-10 bg-white/5 border-white/10 rounded-xl font-mono text-xs"
            />
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-wider text-primary/60 ml-1">MÀU CHỦ ĐẠO (PRIMARY)</label>
              <div className="flex gap-3">
                <input type="color" value={form.primary_color} 
                  onChange={(e) => setForm({ ...form, primary_color: e.target.value })} 
                  className="h-10 w-16 p-1 bg-base-200 border border-white/10 rounded-xl cursor-pointer" />
                <Input className="flex-1 bg-white/5 border-white/10 rounded-xl font-mono text-sm" value={form.primary_color} 
                  onChange={(e) => setForm({ ...form, primary_color: e.target.value })} 
                  placeholder="#7c3aed" />
              </div>
            </div>
            <Input 
              label="EMAIL HỖ TRỢ VẬN HÀNH"
              type="email" 
              value={form.support_email} 
              onChange={(e) => setForm({ ...form, support_email: e.target.value })} 
              placeholder="support@piwebagency.com" 
              className="h-10 bg-white/5 border-white/10 rounded-xl font-bold"
            />
          </div>
          <div className="flex justify-end pt-8 border-t border-white/5">
            <Button type="submit" variant="primary" disabled={saving} className="h-10 px-10 rounded-xl font-semibold tracking-wider text-xs">
              {saving ? "Đang đồng bộ..." : "Lưu cấu hình thương hiệu"}
            </Button>
          </div>
        </form>
      </AdminCard>
    </section>
  );
}





