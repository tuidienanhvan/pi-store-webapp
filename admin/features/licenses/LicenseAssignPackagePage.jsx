import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "@/_shared/api/api-client";
import { Alert, Button, Select, Input } from "@/_shared/components/ui";
import { AdminCard, AdminValue, AdminBadge, AdminConfirmDialog } from "../../_shared/components";
import { Package, Calendar, Database, RefreshCw, Zap, Cpu, ArrowLeft } from "lucide-react";
import { FormField, FormSection, AdminPageHeader } from "../../_shared/components";

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
    <div className="flex flex-col gap-6 pb-12 max-w-7xl">
      <AdminPageHeader 
        title="Gán gói dịch vụ"
        tagline={`Cấp quyền truy cập cho giấy phép #${id}`}
        actions={
          <Button as={Link} to={`/admin/licenses/${id}`} variant="ghost" size="sm">
            <ArrowLeft size={14} className="mr-1.5" /> Quay lại
          </Button>
        }
      />

      <form onSubmit={submit} className="flex flex-col gap-5">
        <FormSection title="Thông tin giấy phép">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-primary/60">Giấy phép mục tiêu</span>
              <div className="flex gap-2">
                <AdminBadge tone="neutral">{license.plugin}</AdminBadge>
                <AdminBadge tone={license.status === "active" ? "success" : "warning"}>
                  {license.status === "active" ? "Hoạt động" : "Tạm dừng"}
                </AdminBadge>
              </div>
            </div>
            <div className="font-mono text-sm font-bold flex items-center gap-3">
              <Database size={16} className="text-base-content/20" />
              #{id} — {license.email}
            </div>
          </div>
        </FormSection>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-4 text-primary/40">
            <RefreshCw className="animate-spin" size={32} />
            <span className="text-xs font-medium">Đang tải danh sách gói...</span>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Chọn gói dịch vụ" required>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary z-10">
                    <Package size={16} />
                  </div>
                  <Select
                    value={packageSlug}
                    onChange={(event) => setPackageSlug(event.target.value)}
                    className="pl-12"
                    options={[
                      { label: "CHƯA CHỌN GÓI", value: "" },
                      ...packages.map((item) => ({
                        value: item.slug,
                        label: `${item.display_name} (${item.slug})`,
                      })),
                    ]}
                  />
                </div>
              </FormField>
              <FormField label="Ngày hết hạn" hint="Để trống nếu không giới hạn thời gian.">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary z-10">
                    <Calendar size={16} />
                  </div>
                  <Input
                    type="date"
                    value={expiresAt}
                    onChange={(event) => setExpiresAt(event.target.value)}
                    className="pl-12"
                  />
                </div>
              </FormField>
            </div>

            {selectedPackage && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Hạn mức', val: Number(selectedPackage.token_quota_monthly || 0).toLocaleString(), icon: Zap },
                  { label: 'Định tuyến', val: (selectedPackage.routing_mode || "shared"), icon: RefreshCw },
                  { label: 'Số khóa', val: selectedPackage.dedicated_key_count || 0, icon: Package },
                  { label: 'Chất lượng', val: (selectedPackage.allowed_qualities || []).join(", ") || "TẤT CẢ", icon: Cpu },
                ].map(stat => (
                  <AdminCard key={stat.label} className="p-4 bg-white/[0.01]">
                    <div className="text-xs font-medium text-base-content/30 mb-1 flex items-center gap-2">
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
                  <div className="text-xs font-medium text-primary">Hiệu năng chu kỳ hiện tại</div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setShowResetConfirm(true)} className="h-8 rounded-lg border-primary/20 hover:bg-primary/10 text-xs font-medium">
                    <RefreshCw size={12} className="mr-2" /> Đặt lại chu kỳ
                  </Button>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-end">
                    <AdminValue className="text-xl">
                      {Number(currentPackage.current_period_tokens_used || 0).toLocaleString()} <span className="text-xs opacity-40">/ {Number(currentPackage.token_quota_monthly || 0).toLocaleString()}</span>
                    </AdminValue>
                    <span className="text-xs font-medium text-primary">
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

        {err && <Alert tone="danger" onDismiss={() => setErr("")}>{err}</Alert>}

        <div className="flex items-center gap-3 pt-3 sticky bottom-0 bg-base-100 py-4 -mx-6 px-6 border-t border-white/5">
          <Button as={Link} to={`/admin/licenses/${id}`} type="button" variant="ghost" className="flex-1">
            Hủy bỏ
          </Button>
          <Button type="submit" variant="primary" disabled={saving || loading || !packageSlug} className="flex-1">
            {saving ? "Đang xử lý..." : "Xác nhận gán gói"}
          </Button>
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




