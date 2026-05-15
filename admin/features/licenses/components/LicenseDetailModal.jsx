import { useEffect, useMemo, useState } from "react";
import { api } from "@/_shared/api/api-client";
import { 
  Alert, 
  Button, 
  Input, 
  Modal, 
  Select, 
  Tabs, 
  Textarea 
} from "@/_shared/components/ui";
import { 
  AdminCard, 
  AdminValue, 
  AdminBadge, 
  AdminTable 
} from "../../../_shared/components";
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
  RefreshCw
} from "lucide-react";

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

/**
 * LicenseDetailModal: Hiển thị chi tiết và quản lý giấy phép.
 */
export function LicenseDetailModal({
  license,
  packages = [],
  onClose,
  onChanged,
  onAdjustTokens,
  onAssignPackage,
}) {
  const [form, setForm] = useState({
    tier: license?.tier || "pro",
    status: license?.status || "active",
    max_sites: license?.max_sites || 1,
    expires_at: toDateInput(license?.expires_at),
    notes: "",
  });
  const [packageInfo, setPackageInfo] = useState(null);
  const [keys, setKeys] = useState([]);
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!license) return;
    setForm({
      tier: license.tier || "pro",
      status: license.status || "active",
      max_sites: license.max_sites || 1,
      expires_at: toDateInput(license.expires_at),
      notes: "",
    });
    setLoading(true);
    setErr("");
    Promise.all([
      api.admin.getLicensePackage(license.id).catch(() => null),
      api.admin.keys({ license_id: license.id, limit: 50 }).catch(() => ({ items: [] })),
      api.admin.usage({ days: 30, plugin: license.plugin }).catch(() => null),
    ])
      .then(([pkg, keyRes, usageRes]) => {
        setPackageInfo(pkg);
        setKeys(keyRes.items || []);
        setUsage(usageRes);
      })
      .catch((error) => setErr(error.message))
      .finally(() => setLoading(false));
  }, [license]);

  const selectedPackage = useMemo(
    () => packages.find((item) => item.slug === (packageInfo?.package_slug || license?.package_slug)),
    [packages, packageInfo, license],
  );

  if (!license) return null;

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const saveGeneral = async (event) => {
    event.preventDefault();
    setSaving(true);
    setErr("");
    try {
      await api.admin.updateLicense(license.id, {
        tier: form.tier,
        status: form.status,
        max_sites: Number(form.max_sites || 1),
        expires_at: toIsoDate(form.expires_at),
        notes: form.notes.trim() || undefined,
      });
      await onChanged?.();
    } catch (error) {
      setErr(error.message);
    } finally {
      setSaving(false);
    }
  };

  const generalTab = (
    <div className="">
      <form onSubmit={saveGeneral} className="flex flex-col gap-8">
        <AdminCard className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary/40">Thông tin khách hàng</span>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary border border-white/5">
                   <User size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-base-content leading-tight">{license.email}</span>
                  <span className="text-[10px] font-bold text-base-content/40 uppercase tracking-widest">{license.name || 'Người dùng ẩn danh'}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary/40">Mã kích hoạt (Security Key)</span>
              <div className="flex items-center gap-3 px-4 py-2 bg-black/20 rounded-xl border border-white/5">
                 <Key size={14} className="text-primary/60" />
                 <code className="text-[11px] font-mono font-bold text-base-content/60 truncate max-w-[200px]">{license.key}</code>
              </div>
            </div>
          </div>
        </AdminCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="HẠNG DỊCH VỤ"
            value={form.tier}
            onChange={(event) => setField("tier", event.target.value)}
            className="h-12 bg-white/5 border-white/10 rounded-xl font-bold uppercase tracking-widest text-[11px]"
            options={[
              { label: "DÙNG THỬ (FREE)", value: "free" },
              { label: "CHUYÊN NGHIỆP (PRO)", value: "pro" },
              { label: "CAO CẤP (MAX)", value: "max" },
            ]}
          />
          <Select
            label="TRẠNG THÁI HOẠT ĐỘNG"
            value={form.status}
            onChange={(event) => setField("status", event.target.value)}
            className="h-12 bg-white/5 border-white/10 rounded-xl font-bold uppercase tracking-widest text-[11px]"
            options={[
              { label: "ĐANG HOẠT ĐỘNG", value: "active" },
              { label: "ĐÃ THU HỒI / TẠM DỪNG", value: "revoked" },
              { label: "ĐÃ HẾT HẠN", value: "expired" },
            ]}
          />
          <Input
            label="GIỚI HẠN SỐ TRANG (SITES)"
            type="number"
            min="1"
            value={form.max_sites}
            onChange={(event) => setField("max_sites", event.target.value)}
            className="bg-white/5 border-white/10 rounded-xl focus:border-primary/50 font-mono font-bold"
          />
          <Input
            label="NGÀY HẾT HẠN"
            type="date"
            value={form.expires_at}
            onChange={(event) => setField("expires_at", event.target.value)}
            className="bg-white/5 border-white/10 rounded-xl focus:border-primary/50 font-mono font-bold"
          />
        </div>

        <Textarea
          label="GHI CHÚ NỘI BỘ"
          rows={3}
          value={form.notes}
          onChange={(event) => setField("notes", event.target.value)}
          placeholder="Nhập ghi chú hỗ trợ hoặc bối cảnh triển khai..."
          className="bg-white/5 border-white/10 rounded-xl focus:border-primary/50 text-sm"
        />

        <div className="flex items-center justify-between pt-6 border-t border-white/5">
          <Button type="button" variant="ghost" onClick={() => onAdjustTokens?.(license)} className="h-11 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-white/5">
            <Zap size={14} className="mr-2" /> Điều chỉnh Token
          </Button>
          <Button type="submit" variant="primary" disabled={saving} className="h-11 px-8 rounded-xl text-[10px] font-bold uppercase tracking-widest">
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </form>
    </div>
  );

  const packageTab = (
    <div className="flex flex-col gap-6">
      {packageInfo || license.package_slug ? (
        <AdminCard className="p-8">
          <div className="flex flex-wrap items-start justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                 <Package size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60 mb-0.5">Gói dịch vụ hiện tại</span>
                <h2 className="text-xl font-bold uppercase tracking-tight m-0">{packageInfo?.package_name || license.package_name || license.package_slug}</h2>
                <span className="text-[10px] font-mono font-bold text-base-content/40 uppercase mt-1">{packageInfo?.package_slug || license.package_slug}</span>
              </div>
            </div>
            <AdminBadge tone={packageInfo?.status === "active" ? "success" : "neutral"}>
              {packageInfo?.status === "active" ? "Đang sử dụng" : "Đã gán"}
            </AdminBadge>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-6 rounded-2xl bg-black/20 border border-white/5">
            {[
              { label: 'Đã dùng', val: packageInfo?.current_period_tokens_used ?? license.quota_used, icon: Activity },
              { label: 'Hạn mức', val: packageInfo?.token_quota_monthly ?? license.quota_limit, icon: Zap },
              { label: 'Số khóa', val: packageInfo?.allocated_keys_count ?? license.allocated_keys_count ?? 0, icon: Key },
              { label: 'Định tuyến', val: selectedPackage?.routing_mode || license.routing_mode || "shared", icon: Cpu },
            ].map(stat => (
              <div key={stat.label} className="flex flex-col gap-1">
                <span className="text-[9px] font-bold uppercase tracking-widest text-base-content/30 flex items-center gap-2">
                   <stat.icon size={10} /> {stat.label}
                </span>
                <AdminValue className="text-lg truncate">{typeof stat.val === 'number' ? formatNum(stat.val) : stat.val.toUpperCase()}</AdminValue>
              </div>
            ))}
          </div>
        </AdminCard>
      ) : (
        <AdminCard className="p-12 text-center border-dashed opacity-50">
           <Package size={32} className="mx-auto mb-4 text-base-content/20" />
           <p className="text-[10px] font-bold uppercase tracking-widest">Khách hàng chưa đăng ký gói dịch vụ.</p>
        </AdminCard>
      )}

      <div className="flex justify-end">
        <Button type="button" variant="primary" onClick={() => onAssignPackage?.(license)} className="h-11 rounded-xl text-[10px] font-bold uppercase tracking-widest">
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
           <span className="text-[10px] font-bold uppercase tracking-widest text-base-content/40">Hạ tầng cấp phép: {keys.length} Mã API</span>
        </div>
        <a href={`/admin/keys?license_id=${license.id}`} className="flex items-center gap-2 text-primary text-[10px] font-bold uppercase tracking-widest hover:gap-3 transition-all">
          Quản lý mã chi tiết <ExternalLink size={12} />
        </a>
      </div>
      
      <AdminTable>
        <thead>
          <tr className="bg-white/[0.02]">
            <th className="py-4 px-6 text-left font-bold uppercase tracking-widest text-[9px] opacity-40">Nhà cung cấp</th>
            <th className="py-4 px-6 text-left font-bold uppercase tracking-widest text-[9px] opacity-40">Mã API</th>
            <th className="py-4 px-6 text-center font-bold uppercase tracking-widest text-[9px] opacity-40">Trạng thái</th>
            <th className="py-4 px-6 text-right font-bold uppercase tracking-widest text-[9px] opacity-40">Hạn mức sử dụng</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {keys.map((key) => (
            <tr key={key.id} className="hover:bg-white/[0.01] transition-colors">
              <td className="py-4 px-6 font-bold text-[11px] text-primary uppercase">{key.provider_slug}</td>
              <td className="py-4 px-6 font-mono text-[11px] text-base-content/60"><code>{key.key_masked}</code></td>
              <td className="py-4 px-6 text-center">
                <AdminBadge tone={key.status === "allocated" ? "brand" : "neutral"}>{key.status === "allocated" ? "Đã cấp" : "Trống"}</AdminBadge>
              </td>
              <td className="py-4 px-6 text-right font-mono text-[11px] text-base-content/80">
                {formatNum(key.monthly_used_tokens)} <span className="opacity-30">/</span> {formatNum(key.monthly_quota_tokens)}
              </td>
            </tr>
          ))}
          {keys.length === 0 && (
            <tr>
              <td colSpan="4" className="py-16 text-center opacity-30">
                 <Database size={24} className="mx-auto mb-3" />
                 <p className="text-[10px] font-bold uppercase tracking-widest">Không có mã API riêng</p>
              </td>
            </tr>
          )}
        </tbody>
      </AdminTable>
    </div>
  );

  const usageTab = (
    <div className="flex flex-col gap-6">
      <AdminCard className="p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Số lượt gọi', val: formatNum(usage?.total_calls), icon: Activity },
            { label: 'Token đã dùng', val: formatNum(usage?.tokens_spent), icon: Zap },
            { label: 'Độ trễ trung bình', val: `${formatNum(usage?.avg_latency_ms)}ms`, icon: RefreshCw },
            { label: 'Sản phẩm', val: license.plugin.toUpperCase(), icon: Cpu },
          ].map(u => (
            <div key={u.label} className="flex flex-col gap-1">
               <span className="text-[9px] font-bold uppercase tracking-widest text-base-content/30 flex items-center gap-2">
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
           <span className="text-[10px] font-bold uppercase tracking-widest">Lưu ý thống kê</span>
           <p className="text-xs font-medium leading-relaxed opacity-80">
             Dữ liệu thống kê được tổng hợp trong 30 ngày gần nhất. Việc xử lý dữ liệu thực tế có thể chậm từ 5-10 phút trên toàn hệ thống hạ tầng.
           </p>
        </div>
      </div>
    </div>
  );

  return (
    <Modal open={true} onClose={onClose} title={`Chi tiết Giấy phép: #${license.id}`} size="lg">
      <div className="p-1 flex flex-col gap-8">
        {/* Tiêu đề Modal */}
        <div className="flex flex-wrap items-center justify-between gap-6 px-4">
          <div className="flex flex-col gap-1">
             <div className="flex items-center gap-3">
                <AdminBadge tone={license.status === "active" ? "success" : license.status === "revoked" ? "danger" : "warning"}>
                  {license.status === "active" ? "HOẠT ĐỘNG" : license.status === "revoked" ? "THU HỒI" : "HẾT HẠN"}
                </AdminBadge>
                <AdminBadge tone="neutral">{license.plugin.toUpperCase()}</AdminBadge>
                <AdminBadge tone="brand">{license.tier.toUpperCase()}</AdminBadge>
             </div>
             {loading && (
               <div className="flex items-center gap-2 mt-2">
                  <RefreshCw size={10} className="animate-spin text-primary" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-primary/60">Đang tải dữ liệu...</span>
               </div>
             )}
          </div>
          <div className="flex items-center gap-3 text-base-content/20">
             <History size={16} />
             <div className="h-8 w-[1px] bg-white/5 mx-2" />
             <Activity size={16} />
          </div>
        </div>

        {err && <Alert tone="danger" className="rounded-xl border-danger/20 bg-danger/5">{err}</Alert>}

        <div className="min-h-[500px]">
          <Tabs
            items={[
              { id: "general", label: "CẤU HÌNH CHUNG", content: generalTab },
              { id: "package", label: "GÓI DỊCH VỤ", content: packageTab },
              { id: "keys", label: "MÃ API CHI TIẾT", content: keysTab },
              { id: "usage", label: "THỐNG KÊ SỬ DỤNG", content: usageTab },
            ]}
          />
        </div>
      </div>
    </Modal>
  );
}
