import React, { useCallback, useEffect, useState } from "react";
import { withDelay } from "@/_shared/api/api-client";
import { useAdminT } from "@/_shared/lib/translations";
import { 
  Button, 
  Alert 
} from "@/_shared/components/ui";
import { 
  Shield, 
  RefreshCw,
  Key,
  Clock,
  Terminal,
  Cpu
} from "lucide-react";

import { 
  AdminPageHeader, 
  AdminCard
} from "../../_shared/components";

import { SettingsSkeleton } from "./skeleton/SettingsSkeleton";
import { settingsApi } from "./api";
import { BrandingCard } from "./components/BrandingCard";
import { PacksCard } from "./components/PacksCard";
import { FlagsCard } from "./components/FlagsCard";
import { CronCard } from "./components/CronCard";
import './SettingsPage.css';

/**
 * SettingsPage: Trung tâm cấu hình và vận hành hệ thống lõi.
 */
export function SettingsPage() {
  const t = useAdminT();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setErr("");
    try {
      const res = await withDelay(settingsApi.get(), 600);
      setSettings(res);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const update = async (payload) => {
    setSaving(true); setErr(""); setOk("");
    try {
      const res = await settingsApi.update(payload);
      setSettings(res);
      setOk("Cấu hình đã được đồng bộ thành công.");
      setTimeout(() => setOk(""), 2500);
    } catch (e) { setErr(e.message); }
    finally { setSaving(false); }
  };

  if (loading) return <SettingsSkeleton />;
  
  if (!settings) return (
    <div className="p-20 flex flex-col items-center">
       <AdminCard className="p-12 text-center max-w-md">
          <Alert tone="warning" className="mb-6">{err || "Không thể kết nối với cài đặt hệ thống."}</Alert>
          <Button onClick={load} variant="primary" className="h-10 px-8 rounded-xl font-semibold text-xs tracking-widest">
             <RefreshCw size={14} className="mr-2" /> Thử kết nối lại
          </Button>
       </AdminCard>
    </div>
  );

  return (
    <div className="p-6 lg:p-10 flex flex-col gap-10">
      <AdminPageHeader 
        title="Cài đặt hệ thống"
        tagline="Quản lý thông số vận hành, nhận diện thương hiệu và tự động hóa tác vụ ngầm"
      />

      {err && <Alert tone="danger" onDismiss={() => setErr("")}>{err}</Alert>}
      {ok && <Alert tone="success" onDismiss={() => setOk("")}>{ok}</Alert>}

      <div className="flex flex-col gap-16">
        {/* Cấu hình thương hiệu */}
        <BrandingCard branding={settings.branding} onSave={(v) => update({ branding: v })} saving={saving} />

        {/* Cấu hình gói nạp */}
        <PacksCard packs={settings.token_packs} onSave={(v) => update({ token_packs: v })} saving={saving} />

        {/* Cấu hình tính năng */}
        <FlagsCard flags={settings.feature_flags} onSave={(v) => update({ feature_flags: v })} saving={saving} />

        {/* Tự động hóa Cron */}
        <CronCard />

        {/* Thông số bảo mật môi trường */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-3 px-2">
             <Shield size={18} className="text-primary/60" />
             <h2 className="text-xs font-semibold tracking-wider text-base-content/40">Thông số bảo mật (Chỉ đọc)</h2>
          </div>
          <AdminCard className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-4">
                 {[
                   { label: 'Khóa mã hóa JWT', val: 'JWT_SECRET', icon: Key },
                   { label: 'Thời hạn JWT', val: 'JWT_EXPIRE_MINUTES', icon: Clock },
                 ].map(item => (
                    <div key={item.val} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                       <div className="flex items-center gap-3">
                          <item.icon size={14} className="text-white/20" />
                          <span className="text-xs font-semibold text-base-content/60 tracking-wider">{item.label}</span>
                       </div>
                       <code className="text-xs font-mono font-bold text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/20">{item.val}</code>
                    </div>
                 ))}
              </div>
              <div className="flex flex-col gap-4">
                 {[
                   { label: 'Số vòng băm mật khẩu', val: '12 (Bcrypt)', icon: Shield },
                   { label: 'Nguồn CORS được phép', val: import.meta.env.VITE_PI_API_URL || "http://localhost:8000", icon: Terminal },
                 ].map(item => (
                    <div key={item.val} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                       <div className="flex items-center gap-3">
                          <item.icon size={14} className="text-white/20" />
                          <span className="text-xs font-semibold text-base-content/60 tracking-wider">{item.label}</span>
                       </div>
                       <code className="text-xs font-mono font-bold text-base-content/40 truncate max-w-[180px]">{item.val}</code>
                    </div>
                 ))}
              </div>
            </div>
          </AdminCard>
        </section>
      </div>
    </div>
  );
}

export default SettingsPage;




