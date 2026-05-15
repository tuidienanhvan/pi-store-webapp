import { useEffect, useState } from "react";
import { api } from "@/_shared/api/api-client";
import { Alert, Button, Modal, Select, Input } from "@/_shared/components/ui";
import { AdminCard, AdminValue, AdminBadge, AdminConfirmDialog } from "../../../_shared/components";
import { Package, Calendar, Database, RefreshCw, Zap, Cpu } from "lucide-react";

function toDateInput(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

function toIsoDate(value) {
  if (!value) return null;
  return new Date(`${value}T23:59:59`).toISOString();
}

/**
 * AssignPackageModal: Modal gán gói dịch vụ cho giấy phép.
 */
export function AssignPackageModal({ license, packages: initialPackages = [], onClose, onChanged }) {
  const [packages, setPackages] = useState(initialPackages);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [packageSlug, setPackageSlug] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    if (!license) return;
    setLoading(true);
    setErr("");
    Promise.all([
      initialPackages.length ? Promise.resolve({ items: initialPackages }) : api.admin.packages(),
      api.admin.getLicensePackage(license.id).catch(() => null),
    ])
      .then(([packageRes, current]) => {
        const items = packageRes.items || [];
        setPackages(items);
        setCurrentPackage(current);
        setPackageSlug(current?.package_slug || license.package_slug || items[0]?.slug || "");
        setExpiresAt(toDateInput(current?.expires_at || license.expires_at));
      })
      .catch((error) => setErr(error.message))
      .finally(() => setLoading(false));
  }, [license, initialPackages]);

  if (!license) return null;

  const submit = async (event) => {
    event.preventDefault();
    if (!packageSlug) return;
    setSaving(true);
    setErr("");
    try {
      await api.admin.assignPackage(license.id, {
        package_slug: packageSlug,
        expires_at: toIsoDate(expiresAt),
      });
      await onChanged?.();
      onClose();
    } catch (error) {
      setErr(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleResetPeriod = async () => {
    setSaving(true);
    setErr("");
    try {
      await api.admin.resetLicensePeriod(license.id);
      await onChanged?.();
      onClose();
    } catch (error) {
      setErr(error.message);
      setShowResetConfirm(false);
    } finally {
      setSaving(false);
    }
  };

  const selectedPackage = packages.find((item) => item.slug === packageSlug);

  return (
    <>
      <Modal open={true} onClose={onClose} title="Gán gói dịch vụ" size="lg">
        <div className="p-1">
          <AdminCard className="p-8 !bg-transparent border-none shadow-none">
            <form onSubmit={submit} className="flex flex-col gap-8">
              {/* Thông tin giấy phép */}
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                   <div className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Giấy phép mục tiêu</div>
                   <div className="flex gap-2">
                     <AdminBadge tone="neutral">{license.plugin}</AdminBadge>
                     <AdminBadge tone={license.status === "active" ? "success" : "warning"}>
                        {license.status === "active" ? "Hoạt động" : "Tạm dừng"}
                     </AdminBadge>
                   </div>
                </div>
                <div className="font-mono text-sm font-bold flex items-center gap-3">
                   <Database size={16} className="text-base-content/20" />
                   #{license.id} — {license.email}
                </div>
              </div>

              {loading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-4 text-primary/40">
                   <RefreshCw className="animate-spin" size={32} />
                   <span className="text-[10px] font-bold uppercase tracking-widest">Đang tải danh sách gói...</span>
                </div>
              ) : (
                <div className="flex flex-col gap-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="relative">
                      <div className="absolute left-4 top-11 text-primary z-10">
                        <Package size={16} />
                      </div>
                      <Select
                        label="CHỌN GÓI DỊCH VỤ"
                        value={packageSlug}
                        onChange={(event) => setPackageSlug(event.target.value)}
                        className="pl-12 h-12 bg-white/5 border-white/10 rounded-xl font-bold uppercase tracking-widest text-[11px] focus:border-primary/50"
                        options={[
                          { label: "CHƯA CHỌN GÓI", value: "" },
                          ...packages.map((item) => ({
                            value: item.slug,
                            label: `${item.display_name.toUpperCase()} (${item.slug})`,
                          })),
                        ]}
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute left-4 top-11 text-primary z-10">
                        <Calendar size={16} />
                      </div>
                      <Input
                        label="NGÀY HẾT HẠN"
                        type="date"
                        value={expiresAt}
                        onChange={(event) => setExpiresAt(event.target.value)}
                        className="pl-12 h-12 bg-white/5 border-white/10 rounded-xl focus:border-primary/50 transition-all font-mono font-bold"
                        hint="Để trống nếu không giới hạn thời gian."
                      />
                    </div>
                  </div>

                  {selectedPackage && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: 'HẠN MỨC', val: Number(selectedPackage.token_quota_monthly || 0).toLocaleString(), icon: Zap },
                        { label: 'ĐỊNH TUYẾN', val: (selectedPackage.routing_mode || "shared").toUpperCase(), icon: RefreshCw },
                        { label: 'SỐ KHÓA', val: selectedPackage.dedicated_key_count || 0, icon: Package },
                        { label: 'CHẤT LƯỢNG', val: (selectedPackage.allowed_qualities || []).join(", ") || "TẤT CẢ", icon: Cpu },
                      ].map(stat => (
                        <AdminCard key={stat.label} className="p-4 bg-white/[0.01]">
                          <div className="text-[8px] font-bold uppercase tracking-widest opacity-40 mb-1 flex items-center gap-2">
                             <stat.icon size={10} /> {stat.label}
                          </div>
                          <AdminValue className="text-xs truncate block">{stat.val}</AdminValue>
                        </AdminCard>
                      ))}
                    </div>
                  )}

                  {currentPackage && (
                    <AdminCard className="p-6 bg-primary/5 border-primary/20">
                      <div className="flex items-center justify-between mb-4">
                         <div className="text-[10px] font-bold uppercase tracking-widest text-primary">Hiệu năng chu kỳ hiện tại</div>
                         <Button type="button" variant="ghost" size="sm" onClick={() => setShowResetConfirm(true)} className="h-8 rounded-lg border-primary/20 hover:bg-primary/10 text-[9px] font-bold uppercase">
                            <RefreshCw size={12} className="mr-2" /> Đặt lại chu kỳ
                         </Button>
                      </div>
                      <div className="flex flex-col gap-3">
                         <div className="flex justify-between items-end">
                            <AdminValue className="text-xl">
                               {Number(currentPackage.current_period_tokens_used || 0).toLocaleString()} <span className="text-xs opacity-40">/ {Number(currentPackage.token_quota_monthly || 0).toLocaleString()}</span>
                            </AdminValue>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                               {Math.round((currentPackage.current_period_tokens_used / (currentPackage.token_quota_monthly || 1)) * 100)}% Đã dùng
                            </span>
                         </div>
                         <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${Math.min(100, (currentPackage.current_period_tokens_used / (currentPackage.token_quota_monthly || 1)) * 100)}%` }} />
                         </div>
                      </div>
                    </AdminCard>
                  )}
                </div>
              )}

              {err && <Alert tone="danger" className="rounded-xl border-danger/20 bg-danger/5">{err}</Alert>}

              <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                <Button type="button" variant="ghost" onClick={onClose} className="flex-1 h-12 rounded-xl font-bold uppercase tracking-widest text-[10px]">
                  Hủy bỏ
                </Button>
                <Button type="submit" variant="primary" disabled={saving || loading || !packageSlug} className="flex-1 h-12 rounded-xl font-bold uppercase tracking-widest text-[10px]">
                  {saving ? "Đang xử lý..." : "Xác nhận gán gói"}
                </Button>
              </div>
            </form>
          </AdminCard>
        </div>
      </Modal>

      {showResetConfirm && (
        <AdminConfirmDialog 
          title="Đặt lại chu kỳ?"
          message={`Hành động này sẽ đặt lại bộ đếm token đã sử dụng trong chu kỳ hiện tại về 0 cho giấy phép #${license.id}.`}
          onConfirm={handleResetPeriod}
          onCancel={() => setShowResetConfirm(false)}
          tone="warning"
        />
      )}
    </>
  );
}
