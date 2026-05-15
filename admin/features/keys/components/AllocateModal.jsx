import React, { useState } from "react";
import {
  Alert, 
  Button, 
  Input,
  Modal
} from "@/_shared/components/ui";
import { Key } from "lucide-react";
import { AdminCard } from "../../../_shared/components";
import { keysApi } from "../api";

/**
 * AllocateModal: Modal cấp phát khóa API cho một giấy phép cụ thể.
 */
export function AllocateModal({ keyObj, onClose, onSaved }) {
  const [licenseId, setLicenseId] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  if (!keyObj) return null;

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr("");
    try {
      await keysApi.allocate({
        license_id: Number(licenseId),
        key_ids: [keyObj.id],
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
    <Modal open={true} onClose={onClose} title="Cấp phát khóa bảo mật" size="md">
      <div className="p-1">
        <AdminCard className="p-8 !bg-transparent border-none shadow-none">
          <form onSubmit={submit} className="flex flex-col gap-8">
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col gap-3">
               <div className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Khóa đã chọn</div>
               <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                    <Key size={16} />
                  </div>
                  <div className="flex flex-col">
                     <code className="text-xs font-mono font-bold text-base-content/60">{keyObj.key_masked}</code>
                     <span className="text-[10px] font-bold uppercase tracking-widest text-base-content/20">{keyObj.provider_slug}</span>
                  </div>
               </div>
            </div>

            <Input
              label="ID GIẤY PHÉP MỤC TIÊU"
              required
              type="number"
              min="1"
              value={licenseId}
              onChange={(e) => setLicenseId(e.target.value)}
              placeholder="Ví dụ: 20260514"
              className="bg-white/5 border-white/10 rounded-xl focus:border-primary/50 font-mono font-bold"
            />

            {err && <Alert tone="danger" className="rounded-xl">{err}</Alert>}

            <div className="flex items-center gap-4 pt-4 border-t border-white/5">
              <Button type="button" variant="ghost" onClick={onClose} className="flex-1 h-12 rounded-xl font-bold uppercase tracking-widest text-[10px]">Hủy bỏ</Button>
              <Button type="submit" variant="primary" disabled={saving || !licenseId} className="flex-1 h-12 rounded-xl font-bold uppercase tracking-widest text-[10px]">
                {saving ? "Đang cấp phát..." : "Xác nhận cấp phát"}
              </Button>
            </div>
          </form>
        </AdminCard>
      </div>
    </Modal>
  );
}
