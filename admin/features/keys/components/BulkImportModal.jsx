import React, { useState } from "react";
import {
  Alert, 
  Button, 
  Textarea,
  Modal
} from "@/_shared/components/ui";
import { Info } from "lucide-react";
import { AdminCard } from "../../../_shared/components";
import { keysApi } from "../api";

/**
 * BulkImportModal: Nhập khóa số lượng lớn từ định dạng CSV.
 */
export function BulkImportModal({ open, onClose, onSaved, providers }) {
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr("");
    setResult(null);
    try {
      const rows = text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [provider_slug, key_value, label = "", quota = "0"] = line.split(",").map((part) => part.trim());
          return {
            provider_slug,
            key_value,
            label,
            monthly_quota_tokens: Number(quota || 0),
          };
        })
        .filter((row) => row.provider_slug && row.key_value);

      if (!rows.length) throw new Error("Nhập ít nhất 1 dòng theo định dạng: provider_slug, key_value, label, quota");
      const res = await keysApi.bulkImport(rows);
      setResult(res);
      await onSaved?.();
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={true} onClose={onClose} title="Nhập khóa (Bulk Import)" size="lg">
      <div className="p-1">
        <AdminCard className="p-8 !bg-transparent border-none shadow-none">
          <form onSubmit={submit} className="flex flex-col gap-6">
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-primary/5 border border-primary/20 text-primary">
               <Info size={18} className="shrink-0 mt-0.5" />
               <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest">ĐỊNH DẠNG CSV</span>
                  <p className="text-xs font-medium leading-relaxed opacity-80">
                    Quy tắc: <code>provider_slug, key_value, label, quota</code>
                  </p>
               </div>
            </div>
            
            <Textarea
              rows={10}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`groq-llama-70b-free, gsk_xxx, khóa-01, 1000000\nopenai-gpt4o-paid, sk_xxx, khóa-02, 0`}
              className="bg-white/5 border-white/10 rounded-xl focus:border-primary/50 text-xs font-mono"
            />
            
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[8px] font-bold uppercase tracking-widest text-base-content/30 mb-2 block">Mã nhà cung cấp được hỗ trợ</span>
              <div className="flex flex-wrap gap-2">
                 {providers.map(p => (
                    <span key={p.slug} className="text-[9px] font-bold text-base-content/40 px-2 py-0.5 rounded-lg bg-white/5 border border-white/5">{p.slug}</span>
                 ))}
              </div>
            </div>

            {err && <Alert tone="danger" className="rounded-xl">{err}</Alert>}
            {result && (
              <Alert tone={result.errors?.length ? "warning" : "success"} className="rounded-xl">
                 Thành công: {result.added} khóa | Bỏ qua: {result.skipped}
              </Alert>
            )}

            <div className="flex items-center gap-4 pt-4 border-t border-white/5">
              <Button type="button" variant="ghost" onClick={onClose} className="flex-1 h-12 rounded-xl font-bold uppercase tracking-widest text-[10px]">Đóng</Button>
              <Button type="submit" variant="primary" disabled={saving || !text.trim()} className="flex-1 h-12 rounded-xl font-bold uppercase tracking-widest text-[10px]">
                {saving ? "Đang xử lý..." : "Bắt đầu nhập dữ liệu"}
              </Button>
            </div>
          </form>
        </AdminCard>
      </div>
    </Modal>
  );
}
