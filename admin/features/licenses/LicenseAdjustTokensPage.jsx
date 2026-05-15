import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "@/_shared/api/api-client";
import { Alert, Button, Input, Textarea } from "@/_shared/components/ui";
import { AdminBadge, AdminConfirmDialog } from "../../_shared/components";
import { Database, TrendingUp, FileText, ArrowLeft } from "lucide-react";
import { FormField, FormSection, AdminPageHeader } from "../../_shared/components";

export function LicenseAdjustTokensPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [license, setLicense] = useState(null);
  const [delta, setDelta] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    api.admin.getLicense(id).then(setLicense).catch(e => setErr(e.message));
  }, [id]);

  if (!license) return <div className="p-10 text-center">Đang tải hoặc không tìm thấy giấy phép...</div>;

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
      await api.admin.adjustTokens(id, Number(delta), note.trim());
      navigate(`/admin/licenses/${id}`);
    } catch (error) {
      setErr(error.message);
      setShowConfirm(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12 max-w-4xl mx-auto">
      <AdminPageHeader 
        title="Điều chỉnh Token"
        tagline={`Thay đổi hạn mức cho giấy phép #${id}`}
        actions={
          <Button as={Link} to={`/admin/licenses/${id}`} variant="ghost" size="sm">
            <ArrowLeft size={14} className="mr-1.5" /> Quay lại
          </Button>
        }
      />

      <form onSubmit={handleOpenConfirm} className="flex flex-col gap-5">
        <FormSection title="Thông tin giấy phép">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-primary/60">Giấy phép mục tiêu</span>
              <AdminBadge tone="brand">{license.tier}</AdminBadge>
            </div>
            <div className="font-mono text-sm font-bold flex items-center gap-2">
              <Database size={14} className="text-base-content/20" />
              #{id} — {license.email}
            </div>
          </div>
        </FormSection>

        <FormSection title="Chi tiết điều chỉnh">
          <div className="flex flex-col gap-4">
            <FormField label="Số lượng thay đổi (±)" hint="Số dương để nạp thêm, số âm để khấu trừ.">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary z-10">
                  <TrendingUp size={16} />
                </div>
                <Input
                  type="number"
                  required
                  value={delta}
                  onChange={(event) => setDelta(event.target.value)}
                  placeholder="1000000"
                  className="pl-12"
                />
              </div>
            </FormField>

            <FormField label="Ghi chú hệ thống" required>
              <div className="relative">
                <div className="absolute left-4 top-3 text-primary z-10">
                  <FileText size={16} />
                </div>
                <Textarea
                  rows={3}
                  required
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Lý do điều chỉnh (hỗ trợ thủ công, hoàn tiền...)"
                  className="pl-12"
                />
              </div>
            </FormField>
          </div>
        </FormSection>

        {err && <Alert tone="danger" onDismiss={() => setErr("")}>{err}</Alert>}

        <div className="flex items-center gap-3 pt-3 sticky bottom-0 bg-base-100 py-4 -mx-6 px-6 border-t border-white/5">
          <Button as={Link} to={`/admin/licenses/${id}`} type="button" variant="ghost" className="flex-1">
            Hủy bỏ
          </Button>
          <Button type="submit" variant="primary" disabled={saving || !delta || !note.trim()} className="flex-1">
            {saving ? "Đang xử lý..." : "Xác nhận thay đổi"}
          </Button>
        </div>
      </form>

      {showConfirm && (
        <AdminConfirmDialog 
          title="Xác nhận điều chỉnh Token?"
          message={`Bạn sắp thực hiện điều chỉnh ${Number(delta).toLocaleString()} tokens cho giấy phép #${id}. Hành động này sẽ được lưu lại trong lịch sử hệ thống.`}
          onConfirm={submit}
          onCancel={() => setShowConfirm(false)}
          tone={Number(delta) < 0 ? "danger" : "primary"}
        />
      )}
    </div>
  );
}

export default LicenseAdjustTokensPage;
