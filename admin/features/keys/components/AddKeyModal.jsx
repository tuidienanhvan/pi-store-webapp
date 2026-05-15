import React, { useState } from "react";
import {
  Alert, 
  Button, 
  Input,
  Select,
  Textarea,
  Modal
} from "@/_shared/components/ui";
import { AdminCard } from "../../../_shared/components";
import { keysApi } from "../api";

/**
 * AddKeyModal: Modal thêm khóa API mới vào hệ thống.
 */
export function AddKeyModal({ prefillProviderId, providers, onClose, onSaved }) {
  const [form, setForm] = useState({
    provider_id: prefillProviderId ? String(prefillProviderId) : "",
    key_value: "",
    label: "",
    monthly_quota_tokens: 0,
    notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr("");
    try {
      await keysApi.create({
        provider_id: Number(form.provider_id),
        key_value: form.key_value.trim(),
        label: form.label.trim(),
        monthly_quota_tokens: Number(form.monthly_quota_tokens || 0),
        notes: form.notes.trim(),
      });
      await onSaved?.();
      onClose();
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={true} onClose={onClose} title="Đăng ký khóa bảo mật" size="md">
      <div className="p-1">
        <AdminCard className="p-8 !bg-transparent border-none shadow-none">
          <form onSubmit={submit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-6">
              <Select
                label="NHÀ CUNG CẤP"
                value={form.provider_id}
                required
                onChange={(e) => setForm({ ...form, provider_id: e.target.value })}
                className="h-12 bg-white/5 border-white/10 rounded-xl font-bold uppercase tracking-widest text-[11px]"
                options={[
                  { label: "CHỌN NHÀ CUNG CẤP", value: "" },
                  ...providers.map((p) => ({ label: `${p.slug.toUpperCase()} — ${p.display_name}`, value: String(p.id) })),
                ]}
              />
              <Textarea
                label="GIÁ TRỊ API KEY (MÃ HÓA KHI LƯU)"
                required
                rows={3}
                value={form.key_value}
                onChange={(e) => setForm({ ...form, key_value: e.target.value })}
                placeholder="sk-..."
                className="bg-white/5 border-white/10 rounded-xl focus:border-primary/50 text-sm font-mono"
              />
              <Input
                label="NHÃN HIỂN THỊ"
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                placeholder="Ví dụ: groq-main-key"
                className="bg-white/5 border-white/10 rounded-xl focus:border-primary/50 font-bold"
              />
              <Input
                label="HẠN MỨC TOKEN HÀNG THÁNG"
                type="number"
                min="0"
                value={form.monthly_quota_tokens}
                onChange={(e) => setForm({ ...form, monthly_quota_tokens: e.target.value })}
                className="bg-white/5 border-white/10 rounded-xl focus:border-primary/50 font-mono font-bold"
                hint="Nhập 0 để không giới hạn"
              />
              <Textarea
                label="GHI CHÚ TRIỂN KHAI"
                rows={2}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="bg-white/5 border-white/10 rounded-xl focus:border-primary/50 text-sm"
              />
            </div>
            {err && <Alert tone="danger" className="rounded-xl">{err}</Alert>}
            <div className="flex items-center gap-4 pt-4 border-t border-white/5">
              <Button type="button" variant="ghost" onClick={onClose} className="flex-1 h-12 rounded-xl font-bold uppercase tracking-widest text-[10px]">Hủy bỏ</Button>
              <Button type="submit" variant="primary" disabled={saving || !form.provider_id || !form.key_value.trim()} className="flex-1 h-12 rounded-xl font-bold uppercase tracking-widest text-[10px]">
                {saving ? "Đang đăng ký..." : "Đăng ký khóa"}
              </Button>
            </div>
          </form>
        </AdminCard>
      </div>
    </Modal>
  );
}
