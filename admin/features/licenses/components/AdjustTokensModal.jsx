import { useState } from "react";
import { api } from "@/_shared/api/api-client";
import { Alert, Button, Input, Modal, Textarea } from "@/_shared/components/ui";
import { AdminCard, AdminBadge, AdminConfirmDialog } from "../../../_shared/components";
import { Database, TrendingUp, FileText } from "lucide-react";

/**
 * AdjustTokensModal: Modal điều chỉnh số lượng token cho giấy phép.
 */
export function AdjustTokensModal({ license, onClose, onChanged }) {
  const [delta, setDelta] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  if (!license) return null;

  const handleOpenConfirm = (e) => {
    e.preventDefault();
    const parsedDelta = Number(delta);
    if (!Number.isFinite(parsedDelta) || parsedDelta === 0) {
      setErr("Vui lòng nhập số lượng token hợp lệ (khác 0).");
      return;
    }
    if (!note.trim()) {
      setErr("Cần ghi chú lý do để lưu lịch sử hệ thống.");
      return;
    }
    setShowConfirm(true);
  };

  const submit = async () => {
    setSaving(true);
    setErr("");
    try {
      await api.admin.adjustTokens(license.id, Number(delta), note.trim());
      await onChanged?.();
      onClose();
    } catch (error) {
      setErr(error.message);
      setShowConfirm(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Modal open={true} onClose={onClose} title="Điều chỉnh Token" size="md">
        <div className="p-1">
          <AdminCard className="p-8 !bg-transparent border-none shadow-none">
            <form onSubmit={handleOpenConfirm} className="flex flex-col gap-6">
              {/* Thông tin giấy phép */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                   <div className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Giấy phép mục tiêu</div>
                   <AdminBadge tone="brand">{license.tier}</AdminBadge>
                </div>
                <div className="font-mono text-sm font-bold flex items-center gap-2">
                   <Database size={14} className="text-base-content/20" />
                   #{license.id} — {license.email}
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="relative">
                  <div className="absolute left-4 top-11 text-primary">
                    <TrendingUp size={16} />
                  </div>
                  <Input
                    label="SỐ LƯỢNG THAY ĐỔI (±)"
                    type="number"
                    required
                    value={delta}
                    onChange={(event) => setDelta(event.target.value)}
                    hint="Số dương để nạp thêm, số âm để khấu trừ."
                    placeholder="1000000"
                    className="pl-12 bg-white/5 border-white/10 rounded-xl focus:border-primary/50 transition-all font-mono font-bold"
                  />
                </div>

                <div className="relative">
                  <div className="absolute left-4 top-11 text-primary">
                    <FileText size={16} />
                  </div>
                  <Textarea
                    label="GHI CHÚ HỆ THỐNG"
                    rows={3}
                    required
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Lý do điều chỉnh (hỗ trợ thủ công, hoàn tiền...)"
                    className="pl-12 bg-white/5 border-white/10 rounded-xl focus:border-primary/50 transition-all font-medium text-sm"
                  />
                </div>
              </div>

              {err && <Alert tone="danger" className="rounded-xl border-danger/20 bg-danger/5">{err}</Alert>}

              <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                <Button type="button" variant="ghost" onClick={onClose} className="flex-1 h-12 rounded-xl font-bold uppercase tracking-widest text-[10px]">
                  Hủy bỏ
                </Button>
                <Button type="submit" variant="primary" disabled={saving || !delta || !note.trim()} className="flex-1 h-12 rounded-xl font-bold uppercase tracking-widest text-[10px]">
                  {saving ? "Đang xử lý..." : "Xác nhận thay đổi"}
                </Button>
              </div>
            </form>
          </AdminCard>
        </div>
      </Modal>

      {showConfirm && (
        <AdminConfirmDialog 
          title="Xác nhận điều chỉnh Token?"
          message={`Bạn sắp thực hiện điều chỉnh ${Number(delta).toLocaleString()} tokens cho giấy phép #${license.id}. Hành động này sẽ được lưu lại trong lịch sử hệ thống.`}
          onConfirm={submit}
          onCancel={() => setShowConfirm(false)}
          tone={Number(delta) < 0 ? "danger" : "primary"}
        />
      )}
    </>
  );
}
