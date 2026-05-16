import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "@/_shared/api/api-client";
import { 
  Alert, 
  Button, 
  Input, 
  Select, 
  Tabs, 
  Textarea 
} from "@/_shared/components/ui";
import { 
  AdminCard, 
  AdminValue, 
  AdminBadge, 
  AdminTable 
} from "../../_shared/components";
import { 
  User, 
  Key, 
  Package, 
  Activity, 
  Shield, 
  Zap, 
  History, 
  ExternalLink,
  Info,
  Database,
  Cpu,
  RefreshCw,
  ArrowLeft
} from "lucide-react";
import { FormField, FormSection, AdminPageHeader } from "../../_shared/components";
import { LicenseDetailSkeleton } from "./skeleton";
import './LicenseDetailPage.css';

function toDateInput(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

function toIsoDate(value) {
  if (!value) return null;
  return new Date(`${value}T23:59:59`).toISOString();
}

function formatNum(value) {
  return Number(value || 0).toLocaleString("vi-VN");
}

export function LicenseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [license, setLicense] = useState(null);
  const [packages, setPackages] = useState([]);
  const [form, setForm] = useState({
    tier: "pro",
    status: "active",
    max_sites: 1,
    expires_at: "",
    notes: "",
  });
  const [packageInfo, setPackageInfo] = useState(null);
  const [keys, setKeys] = useState([]);
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErr("");
      try {
        const [lic, pkgList, pkgInfo, keyRes, usageRes] = await Promise.all([
          api.admin.getLicense(id).catch(() => null),
          api.admin.packages().catch(() => ({ items: [] })),
          api.admin.getLicensePackage(id).catch(() => null),
          api.admin.keys({ license_id: id, limit: 50 }).catch(() => ({ items: [] })),
          api.admin.usage({ days: 30, plugin: (await api.admin.getLicense(id).catch(() => ({}))).plugin }).catch(() => null),
        ]);

        if (!lic) {
          setErr("Không tìm thấy giấy phép");
          return;
        }

        setLicense(lic);
        setPackages(pkgList.items || []);
        setPackageInfo(pkgInfo);
        setKeys(keyRes.items || []);
        setUsage(usageRes);
        setForm({
          tier: lic.tier || "pro",
          status: lic.status || "active",
          max_sites: lic.max_sites || 1,
          expires_at: toDateInput(lic.expires_at),
          notes: lic.notes || "",
        });
      } catch (error) {
        setErr(error.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const selectedPackage = useMemo(
    () => packages.find((item) => item.slug === (packageInfo?.package_slug || license?.package_slug)),
    [packages, packageInfo, license],
  );

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const saveGeneral = async (event) => {
    event.preventDefault();
    setSaving(true);
    setErr("");
    try {
      await api.admin.updateLicense(id, {
        tier: form.tier,
        status: form.status,
        max_sites: Number(form.max_sites || 1),
        expires_at: toIsoDate(form.expires_at),
        notes: form.notes.trim() || undefined,
      });
      // Refresh data
      const lic = await api.admin.getLicense(id);
      setLicense(lic);
      setForm({
        tier: lic.tier || "pro",
        status: lic.status || "active",
        max_sites: lic.max_sites || 1,
        expires_at: toDateInput(lic.expires_at),
        notes: lic.notes || "",
      });
    } catch (error) {
      setErr(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LicenseDetailSkeleton />;
  if (!license) return <div className="p-10 text-center">{err || "Không tìm thấy dữ liệu"}</div>;

  const generalTab = (
    <div className="flex flex-col gap-5">
      <form onSubmit={saveGeneral} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Hạng dịch vụ">
            <Select
              value={form.tier}
              onChange={(event) => setField("tier", event.target.value)}
              options={[
                { label: "Dùng thử (Free)", value: "free" },
                { label: "Chuyên nghiệp (Pro)", value: "pro" },
                { label: "Cao cấp (Max)", value: "max" },
              ]}
            />
          </FormField>
          <FormField label="Trạng thái hoạt động">
            <Select
              value={form.status}
              onChange={(event) => setField("status", event.target.value)}
              options={[
                { label: "Đang hoạt động", value: "active" },
                { label: "Đã thu hồi / Tạm dừng", value: "revoked" },
                { label: "Đã hết hạn", value: "expired" },
              ]}
            />
          </FormField>
          <FormField label="Giới hạn số trang (Sites)">
            <Input
              type="number"
              min="1"
              value={form.max_sites}
              onChange={(event) => setField("max_sites", event.target.value)}
            />
          </FormField>
          <FormField label="Ngày hết hạn">
            <Input
              type="date"
              value={form.expires_at}
              onChange={(event) => setField("expires_at", event.target.value)}
            />
          </FormField>
        </div>

        <FormField label="Ghi chú nội bộ">
          <Textarea
            rows={3}
            value={form.notes}
            onChange={(event) => setField("notes", event.target.value)}
            placeholder="Nhập ghi chú hỗ trợ hoặc bối cảnh triển khai..."
          />
        </FormField>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-base-content/5">
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </form>
    </div>
  );

  const packageTab = (
    <div className="flex flex-col gap-6">
      {packageInfo || license.package_slug ? (
        <AdminCard className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Package size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-primary/60 mb-0.5">Gói dịch vụ hiện tại</span>
                <h2 className="text-lg font-bold tracking-tight m-0">{packageInfo?.package_name || license.package_name || license.package_slug}</h2>
                <span className="text-xs font-mono text-base-content/40 mt-1">{packageInfo?.package_slug || license.package_slug}</span>
              </div>
            </div>
            <AdminBadge tone={packageInfo?.status === "active" ? "success" : "neutral"}>
              {packageInfo?.status === "active" ? "Đang sử dụng" : "Đã gán"}
            </AdminBadge>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-6 rounded-2xl bg-base-content/20 border border-base-content/5">
            {[
              { label: 'Đã dùng', val: packageInfo?.current_period_tokens_used ?? license.quota_used, icon: Activity },
              { label: 'Hạn mức', val: packageInfo?.token_quota_monthly ?? license.quota_limit, icon: Zap },
              { label: 'Số khóa', val: packageInfo?.allocated_keys_count ?? license.allocated_keys_count ?? 0, icon: Key },
              { label: 'Định tuyến', val: selectedPackage?.routing_mode || license.routing_mode || "shared", icon: Cpu },
            ].map(stat => (
              <div key={stat.label} className="flex flex-col gap-1">
                <span className="text-xs font-medium text-base-content/30 flex items-center gap-2">
                  <stat.icon size={10} /> {stat.label}
                </span>
                <AdminValue className="text-lg truncate">{typeof stat.val === 'number' ? formatNum(stat.val) : stat.val}</AdminValue>
              </div>
            ))}
          </div>
        </AdminCard>
      ) : (
        <AdminCard className="p-12 text-center border-dashed opacity-50">
          <Package size={32} className="mx-auto mb-4 text-base-content/20" />
          <p className="text-xs font-medium">Khách hàng chưa đăng ký gói dịch vụ.</p>
        </AdminCard>
      )}
      <div className="flex justify-end">
        <Button as={Link} to={`/admin/licenses/${id}/assign-package`} variant="primary">
          <ExternalLink size={14} className="mr-2" /> Thay đổi gói dịch vụ
        </Button>
      </div>
    </div>
  );

  const keysTab = (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <Shield size={14} className="text-primary/60" />
          <span className="text-xs font-medium text-base-content/40">Hạ tầng cấp phép: {keys.length} Mã API</span>
        </div>
        <Link to={`/admin/keys?license_id=${id}`} className="flex items-center gap-2 text-primary text-xs font-medium hover:gap-3 transition-all">
          Quản lý mã chi tiết <ExternalLink size={12} />
        </Link>
      </div>
      
      <AdminTable>
        <thead>
          <tr className="bg-base-content/[0.02]">
            <th className="py-4 px-6 text-left font-medium text-xs opacity-40">Nhà cung cấp</th>
            <th className="py-4 px-6 text-left font-medium text-xs opacity-40">Mã API</th>
            <th className="py-4 px-6 text-center font-medium text-xs opacity-40">Trạng thái</th>
            <th className="py-4 px-6 text-right font-medium text-xs opacity-40">Hạn mức sử dụng</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {keys.map((key) => (
            <tr key={key.id} className="hover:bg-base-content/[0.01] transition-colors">
              <td className="py-4 px-6 font-bold text-xs text-primary">{key.provider_slug}</td>
              <td className="py-4 px-6 font-mono text-xs text-base-content/60"><code>{key.key_masked}</code></td>
              <td className="py-4 px-6 text-center">
                <AdminBadge tone={key.status === "allocated" ? "brand" : "neutral"}>{key.status === "allocated" ? "Đã cấp" : "Trống"}</AdminBadge>
              </td>
              <td className="py-4 px-6 text-right font-mono text-xs text-base-content/80">
                {formatNum(key.monthly_used_tokens)} <span className="opacity-30">/</span> {formatNum(key.monthly_quota_tokens)}
              </td>
            </tr>
          ))}
          {keys.length === 0 && (
            <tr>
              <td colSpan="4" className="py-16 text-center opacity-30">
                <Database size={24} className="mx-auto mb-3" />
                <p className="text-xs font-medium">Không có mã API riêng</p>
              </td>
            </tr>
          )}
        </tbody>
      </AdminTable>
    </div>
  );

  const usageTab = (
    <div className="flex flex-col gap-6">
      <AdminCard className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Số lượt gọi', val: formatNum(usage?.total_calls), icon: Activity },
            { label: 'Token đã dùng', val: formatNum(usage?.tokens_spent), icon: Zap },
            { label: 'Độ trễ trung bình', val: `${formatNum(usage?.avg_latency_ms)}ms`, icon: RefreshCw },
            { label: 'Sản phẩm', val: license.plugin, icon: Cpu },
          ].map(u => (
            <div key={u.label} className="flex flex-col gap-1">
              <span className="text-xs font-medium text-base-content/30 flex items-center gap-2">
                <u.icon size={10} /> {u.label}
              </span>
              <AdminValue className="text-xl">{u.val}</AdminValue>
            </div>
          ))}
        </div>
      </AdminCard>
      
      <div className="flex items-start gap-4 p-5 rounded-2xl bg-info/5 border border-info/20 text-info">
        <Info size={18} className="shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium">Lưu ý thống kê</span>
          <p className="text-xs font-medium leading-relaxed opacity-80">
            Dữ liệu thống kê được tổng hợp trong 30 ngày gần nhất. Việc xử lý dữ liệu thực tế có thể chậm từ 5-10 phút trên toàn hệ thống hạ tầng.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pi-license-detail-page flex flex-col gap-8 pb-12">
      <AdminPageHeader 
        title={`Chi tiết Giấy phép: #${license.id}`}
        tagline={license.email}
        actions={
          <div className="flex items-center gap-3">
            <Button as={Link} to="/admin/licenses" variant="ghost" className="h-10 px-4 rounded-xl border border-base-content/5 font-semibold tracking-wider text-xs">
              <ArrowLeft size={14} className="mr-2" /> Quay lại danh sách
            </Button>
            <Button as={Link} to={`/admin/licenses/${id}/adjust-tokens`} variant="primary" className="h-10 px-6 rounded-xl font-bold tracking-wider text-xs shadow-primary">
              <Zap size={14} className="mr-2" /> ĐIỀU CHỈNH TOKEN
            </Button>
          </div>
        }
      />

      <div className="pi-license-detail-page__grid grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column: Readonly Summary - Sticky if possible */}
        <div className="lg:col-span-1">
          <AdminCard className="p-8 flex flex-col gap-6 border-primary/10 bg-primary/[0.02]">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-20 h-20 rounded-3xl bg-base-content/5 flex items-center justify-center text-primary border border-base-content/10 shadow-2xl">
                <User size={36} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-bold text-base-content leading-tight">{license.email}</h3>
                <span className="text-xs font-medium text-base-content/40">{license.name || 'Người dùng ẩn danh'}</span>
              </div>
            </div>

            <div className="h-px bg-base-content/5" />

            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center px-2">
                <span className="text-xs font-semibold text-base-content/30 tracking-wide">Trạng thái</span>
                <AdminBadge tone={license.status === "active" ? "success" : license.status === "revoked" ? "danger" : "warning"}>
                  {license.status === "active" ? "Hoạt động" : license.status === "revoked" ? "Đã thu hồi" : "Hết hạn"}
                </AdminBadge>
              </div>
              <div className="flex justify-between items-center px-2">
                <span className="text-xs font-semibold text-base-content/30 tracking-wide">Sản phẩm</span>
                <AdminBadge tone="neutral">{license.plugin}</AdminBadge>
              </div>
              <div className="flex justify-between items-center px-2">
                <span className="text-xs font-semibold text-base-content/30 tracking-wide">Hạng gói</span>
                <AdminBadge tone="brand">{license.tier}</AdminBadge>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-4 border-t border-base-content/5">
               <span className="text-xs font-semibold text-primary/40 tracking-wide ml-2">Mã kích hoạt</span>
               <div className="flex items-center gap-3 px-4 py-3 bg-base-content/40 rounded-2xl border border-base-content/5 group hover:border-primary/30 transition-all">
                  <Key size={14} className="text-primary/60" />
                  <code className="text-xs font-mono text-base-content/60 truncate">{license.key}</code>
               </div>
            </div>
          </AdminCard>
        </div>

        {/* Right Column: Tabs for detailed control */}
        <div className="lg:col-span-3">
          {err && <Alert tone="danger" onDismiss={() => setErr("")} className="mb-6">{err}</Alert>}
          <div className="rounded-xl border border-base-content/10 backdrop-blur-md shadow-glass rounded-[2rem] overflow-hidden">
            <Tabs
              items={[
                { id: "general", label: "Cấu hình hệ thống", content: generalTab },
                { id: "package", label: "Gói dịch vụ", content: packageTab },
                { id: "keys", label: "Hạ tầng API", content: keysTab },
                { id: "usage", label: "Thống kê lưu lượng", content: usageTab },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LicenseDetailPage;



