import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "@/_shared/api/api-client";
import { Alert, Button, Select, Input } from "@/_shared/components/ui";
import { AdminCard, AdminValue, AdminBadge, AdminConfirmDialog } from "../../_shared/components";
import { Package, Calendar, Database, RefreshCw, Zap, Cpu, ArrowLeft } from "lucide-react";
import { FormField, FormSection, AdminPageHeader } from "../../_shared/components";
import './LicenseAssignPackagePage.css';

function toDateInput(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

function toIsoDate(value) {
  if (!value) return null;
  return new Date(`${value}T23:59:59`).toISOString();
}

export function LicenseAssignPackagePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [packageSlug, setPackageSlug] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [license, setLicense] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErr("");
      try {
        const [lic, packageRes, current] = await Promise.all([
          api.admin.getLicense(id),
          api.admin.packages(),
          api.admin.getLicensePackage(id).catch(() => null),
        ]);
        setLicense(lic);
        const items = packageRes.items || [];
        setPackages(items);
        setCurrentPackage(current);
        setPackageSlug(current?.package_slug || lic.package_slug || items[0]?.slug || "");
        setExpiresAt(toDateInput(current?.expires_at || lic.expires_at));
      } catch (error) {
        setErr(error.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (!license) return <div className="p-10 text-center">{err || "Không tìm thấy giấy phép"}</div>;

  const submit = async (event) => {
    event.preventDefault();
    if (!packageSlug) return;
    setSaving(true);
    setErr("");
    try {
      await api.admin.assignPackage(id, {
        package_slug: packageSlug,
        expires_at: toIsoDate(expiresAt),
      });
      navigate(`/admin/licenses/${id}`);
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
      await api.admin.resetLicensePeriod(id);
      navigate(`/admin/licenses/${id}`);
    } catch (error) {
      setErr(error.message);
      setShowResetConfirm(false);
    } finally {
      setSaving(false);
    }
  };

  const selectedPackage = packages.find((item) => item.slug === packageSlug);

  return (
    <div className="pi-license-assign-package-page flex flex-col gap-10 pb-20">
      <AdminPageHeader 
        title="Gán gói dịch vụ"
        tagline={`Cấp quyền truy cập cho giấy phép #${id}`}
        actions={
          <Button as={Link} to={`/admin/licenses/${id}`} variant="ghost" className="h-10 px-4 rounded-xl border border-white/5 font-semibold tracking-wider text-xs">
            <ArrowLeft size={14} className="mr-2" /> Quay lại hồ sơ
          </Button>
        }
      />

      <form onSubmit={submit} className="pi-license-assign-package-page__form grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột chính: Cấu hình Gói Dịch Vụ */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <FormSection title="Thiết lập Gói Dịch Vụ">
            {loading ? (
              <div className="pi-license-assign-package-page__loading py-20 flex flex-col items-center justify-center gap-4 text-primary/40 rounded-3xl">
                <RefreshCw className="animate-spin" size={32} />
                <span className="text-xs font-medium tracking-widest uppercase">Đang tải danh sách gói...</span>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Chọn gói dịch vụ" required hint="Gói sẽ xác định hạn mức và quyền truy cập">
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary z-10">
                        <Package size={16} />
                      </div>
                      <Select
                        value={packageSlug}
                        onChange={(event) => setPackageSlug(event.target.value)}
                        className="pl-12 h-14 bg-white/5 border-white/10 rounded-xl font-bold text-sm"
                        options={[
                          { label: "--- CHƯA CHỌN GÓI ---", value: "" },
                          ...packages.map((item) => ({
                            value: item.slug,
                            label: `${item.display_name} (${item.slug})`,
                          })),
                        ]}
                      />
                    </div>
                  </FormField>
                  <FormField label="Ngày hết hạn" hint="Để trống nếu không giới hạn thời gian (Lifetime).">
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary z-10">
                        <Calendar size={16} />
                      </div>
                      <Input
                        type="date"
                        value={expiresAt}
                        onChange={(event) => setExpiresAt(event.target.value)}
                        className="pl-12 h-14 bg-white/5 border-white/10 rounded-xl font-mono text-sm"
                      />
                    </div>
                  </FormField>
                </div>

                {selectedPackage && (
                  <div className="pi-license-assign-package-page__package-card mt-2 p-6 rounded-2xl">
                    <div className="text-xs font-bold tracking-wider text-base-content/50 uppercase mb-4">Chi tiết gói được chọn</div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: 'Hạn mức / Tháng', val: Number(selectedPackage.token_quota_monthly || 0).toLocaleString(), icon: Zap },
                        { label: 'Định tuyến', val: (selectedPackage.routing_mode || "shared"), icon: RefreshCw },
                        { label: 'Số khóa riêng', val: selectedPackage.dedicated_key_count || 0, icon: Package },
                        { label: 'Chất lượng AI', val: (selectedPackage.allowed_qualities || []).join(", ") || "TẤT CẢ", icon: Cpu },
                      ].map(stat => (
                        <div key={stat.label} className="pi-license-assign-package-page__package-stat flex flex-col gap-1 p-3 rounded-xl">
                          <div className="text-xs font-semibold text-base-content/40 uppercase tracking-wider flex items-center gap-1.5">
                            <stat.icon size={12} className="text-primary/70" /> {stat.label}
                          </div>
                          <div className="text-sm font-bold truncate">{stat.val}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </FormSection>
        </div>

        {/* Cột phụ: Thông tin License & Vận hành */}
        <div className="flex flex-col gap-8">
          <FormSection title="Thông tin Mục Tiêu">
            <div className="pi-license-assign-package-page__target-card p-5 rounded-2xl flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider text-base-content/50 uppercase">Giấy phép đích</span>
                <div className="flex gap-2">
                  <AdminBadge tone="neutral">{license.plugin}</AdminBadge>
                  <AdminBadge tone={license.status === "active" ? "success" : "warning"}>
                    {license.status === "active" ? "Active" : "Paused"}
                  </AdminBadge>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="font-mono text-sm font-bold flex items-center gap-2 text-primary">
                  <Database size={14} /> #{id}
                </div>
                <div className="text-sm font-medium opacity-80">{license.email}</div>
              </div>
            </div>
          </FormSection>

          {currentPackage && (
            <FormSection title="Tình trạng chu kỳ">
              <div className="pi-license-assign-package-page__cycle-card p-5 rounded-2xl flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold tracking-wider text-primary uppercase">Hiệu năng tiêu thụ</div>
                  <Button type="button" variant="ghost" onClick={() => setShowResetConfirm(true)} className="h-8 px-2 rounded-lg border border-primary/20 hover:bg-primary/10 text-xs font-bold text-primary">
                    <RefreshCw size={12} className="mr-1.5" /> ĐẶT LẠI CHU KỲ
                  </Button>
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-end">
                    <div className="font-mono text-xl font-bold">
                      {Number(currentPackage.current_period_tokens_used || 0).toLocaleString()}
                      <span className="text-xs opacity-40 ml-1">/ {Number(currentPackage.token_quota_monthly || 0).toLocaleString()}</span>
                    </div>
                    <span className="text-xs font-bold text-primary px-2 py-1 bg-primary/10 rounded-md">
                      {Math.round((currentPackage.current_period_tokens_used / (currentPackage.token_quota_monthly || 1)) * 100)}%
                    </span>
                  </div>
                  <div className="pi-license-assign-package-page__progress-track w-full h-1.5 rounded-full overflow-hidden mt-1">
                    <div className="pi-license-assign-package-page__progress-bar h-full transition-all duration-1000" style={{ width: `${Math.min(100, (currentPackage.current_period_tokens_used / (currentPackage.token_quota_monthly || 1)) * 100)}%` }} />
                  </div>
                </div>
              </div>
            </FormSection>
          )}

          <div className="flex flex-col gap-3">
             {err && <Alert tone="danger" onDismiss={() => setErr("")}>{err}</Alert>}
             
             <Button 
               type="submit" 
               variant="primary" 
               disabled={saving || loading || !packageSlug} 
               className="h-14 w-full rounded-2xl font-bold tracking-wider text-xs shadow-primary"
             >
               {saving ? "ĐANG XỬ LÝ..." : "XÁC NHẬN GÁN GÓI"}
             </Button>
             
             <Button as={Link} to={`/admin/licenses/${id}`} variant="ghost" className="h-12 w-full rounded-xl border border-white/5 text-xs font-semibold text-base-content/40">
               Hủy bỏ
             </Button>
          </div>
        </div>
      </form>

      {showResetConfirm && (
        <AdminConfirmDialog 
          title="Đặt lại chu kỳ?"
          message={`Hành động này sẽ đặt lại bộ đếm token đã sử dụng trong chu kỳ hiện tại về 0 cho giấy phép #${id}.`}
          onConfirm={handleResetPeriod}
          onCancel={() => setShowResetConfirm(false)}
          tone="warning"
        />
      )}
    </div>
  );
}

export default LicenseAssignPackagePage;



