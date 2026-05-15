import React, { useState, useEffect } from "react";
import { 
  Button, 
  IconButton 
} from "@/_shared/components/ui";
import { Trash2, Plus, Zap } from "lucide-react";
import { AdminTable, AdminEmptyState } from "../../../_shared/components";

/**
 * PacksCard: Quản lý các gói nạp Token của hệ thống.
 */
export function PacksCard({ packs, onSave, saving }) {
  const [rows, setRows] = useState(packs);
  useEffect(() => setRows(packs), [packs]);

  const updateRow = (idx, key, value) => setRows(rows.map((r, i) => i === idx ? { ...r, [key]: value } : r));
  const removeRow = (idx) => setRows(rows.filter((_, i) => i !== idx));
  const addRow = () => setRows([...rows, { slug: "new-pack", tokens: 10000, price_cents: 100, discount_pct: 0, label: "Gói Token mới" }]);

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between px-2">
         <div className="flex items-center gap-3">
            <Zap size={18} className="text-primary/60" />
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-base-content/40">Gói nạp Token</h2>
         </div>
         <Button type="button" variant="ghost" onClick={addRow} className="h-8 px-4 rounded-lg border border-white/5 bg-white/[0.02] text-[9px] font-bold uppercase tracking-widest hover:border-primary/40">
            <Plus size={12} className="mr-1" /> Thêm gói nạp
         </Button>
      </div>

      <AdminTable>
        <thead>
          <tr className="bg-white/[0.02]">
            <th className="py-4 px-6 text-left font-bold uppercase tracking-widest text-[9px] opacity-40">Mã định danh (Slug)</th>
            <th className="py-4 px-6 text-left font-bold uppercase tracking-widest text-[9px] opacity-40">Tên hiển thị</th>
            <th className="py-4 px-6 text-right font-bold uppercase tracking-widest text-[9px] opacity-40">Số Token nhận</th>
            <th className="py-4 px-6 text-right font-bold uppercase tracking-widest text-[9px] opacity-40">Giá (Cents)</th>
            <th className="py-4 px-6 text-right font-bold uppercase tracking-widest text-[9px] opacity-40">Giảm giá %</th>
            <th className="py-4 px-6 text-right font-bold uppercase tracking-widest text-[9px] opacity-40">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {rows.map((r, i) => (
            <tr key={i} className="group hover:bg-white/[0.01]">
              <td className="py-4 px-6">
                 <input className="bg-transparent border-none text-xs font-mono font-bold text-primary focus:ring-0 p-0 lowercase" value={r.slug} onChange={(e) => updateRow(i, "slug", e.target.value)} />
              </td>
              <td className="py-4 px-6">
                 <input className="bg-transparent border-none text-xs font-bold text-base-content focus:ring-0 p-0" value={r.label} onChange={(e) => updateRow(i, "label", e.target.value)} />
              </td>
              <td className="py-4 px-6 text-right">
                 <input className="bg-transparent border-none text-xs font-mono font-bold text-white/80 focus:ring-0 p-0 text-right" type="number" value={r.tokens} onChange={(e) => updateRow(i, "tokens", Number(e.target.value))} />
              </td>
              <td className="py-4 px-6 text-right">
                 <input className="bg-transparent border-none text-xs font-mono font-bold text-white/80 focus:ring-0 p-0 text-right" type="number" value={r.price_cents} onChange={(e) => updateRow(i, "price_cents", Number(e.target.value))} />
              </td>
              <td className="py-4 px-6 text-right">
                 <input className="bg-transparent border-none text-xs font-mono font-bold text-primary focus:ring-0 p-0 text-right" type="number" value={r.discount_pct} onChange={(e) => updateRow(i, "discount_pct", Number(e.target.value))} />
              </td>
              <td className="py-4 px-6 text-right">
                 <IconButton icon={Trash2} label="Xóa" size="sm" onClick={() => removeRow(i)} className="hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity" />
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td colSpan="6" className="py-20"><AdminEmptyState title="Không có gói nạp nào" description="Hệ thống chưa có cấu hình gói nạp Token." /></td></tr>
          )}
        </tbody>
      </AdminTable>

      <div className="flex justify-end">
        <Button type="button" variant="primary" disabled={saving} onClick={() => onSave(rows)} className="h-11 px-10 rounded-xl font-bold uppercase tracking-widest text-[11px]">
          {saving ? "Đang lưu..." : "Lưu cấu hình gói nạp"}
        </Button>
      </div>
    </section>
  );
}
