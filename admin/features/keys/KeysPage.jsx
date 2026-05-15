import React, { useCallback, useEffect, useMemo, useState } from "react";
import { withDelay } from "@/_shared/api/api-client";
import { useListFilters, useDebouncedValue } from "@/_shared/hooks/useListFilters";
import { useAdminT } from "@/_shared/lib/translations";
import {
  Alert, 
  Button, 
  IconButton,
  Input,
  Select,
} from "@/_shared/components/ui";
import { 
  Upload, 
  Plus, 
  Key, 
  Search, 
  X, 
  Zap,
  Activity,
  Shield,
  Trash2,
  RefreshCw,
  ExternalLink,
  Cpu,
  Database,
  BarChart3,
  Slash
} from "lucide-react";
import { Link } from "react-router-dom";

import { 
  AdminPageHeader, 
  AdminCard, 
  AdminValue, 
  AdminBadge, 
  AdminTable, 
  AdminEmptyState,
  AdminConfirmDialog,
  AdminStatCard,
  AdminFilterBar
} from "../../_shared/components";

import { AdminTableSkeleton } from "@/_shared/skeletons/AdminTableSkeleton";
import { keysApi } from "./api";
import { KeyCell } from "./components/KeyCell";

const STATUS_TONES = {
  available: "neutral",
  allocated: "brand",
  exhausted: "warning",
  banned: "danger",
};

const PROVIDER_SIGNUP_LINKS = {
  "groq-llama-70b-free": "https://console.groq.com/keys",
  "gemini-2-flash-free": "https://aistudio.google.com/apikey",
  "mistral-small-free": "https://console.mistral.ai/api-keys",
  "cohere-command-free": "https://dashboard.cohere.com/api-keys",
  "openrouter-free": "https://openrouter.ai/keys",
};

const KEY_DEFAULTS = {
  q: "", provider_id: "", status: "", health_status: "", license_id: "",
  sort: "-id", limit: 100, offset: 0,
};

/**
 * KeysPage: Quản lý kho khóa API và tài nguyên hạ tầng.
 */
export function KeysPage() {
  const t = useAdminT();
  const { filters, setFilters, reset } = useListFilters(KEY_DEFAULTS);
  const [searchInput, setSearchInput] = useState(filters.q || "");
  const debouncedQ = useDebouncedValue(searchInput, 300);

  const [keys, setKeys] = useState([]);
  const [summary, setSummary] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    if (debouncedQ !== filters.q) setFilters({ q: debouncedQ, offset: 0 });
  }, [debouncedQ, filters.q, setFilters]);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const [k, s, p] = await withDelay(Promise.all([
        keysApi.list(filters),
        keysApi.summary(),
        // Ở đây mình lấy list provider từ API chung
        import("../providers/api").then(m => m.providersApi.list())
      ]), 600);
      setKeys(k.items || []);
      setSummary(s.items || []);
      setProviders(p.items || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  const totals = useMemo(() => summary.reduce((acc, r) => ({
    total: acc.total + r.total,
    available: acc.available + r.available,
    allocated: acc.allocated + r.allocated,
    exhausted: acc.exhausted + r.exhausted,
    banned: acc.banned + r.banned,
  }), { total: 0, available: 0, allocated: 0, exhausted: 0, banned: 0 }), [summary]);

  const handleAction = async (type, k) => {
    try {
      if (type === 'delete') await keysApi.delete(k.id);
      if (type === 'revoke') await keysApi.revoke(k.id);
      if (type === 'reset_all') await keysApi.resetPeriod();
      if (type === 'release_license') {
         await keysApi.releaseLicense(parseInt(filters.license_id, 10));
      }
      load();
      setConfirmAction(null);
    } catch (e) {
      setError(e.message);
      setConfirmAction(null);
    }
  };

  const formatNum = (num) => Number(num || 0).toLocaleString("vi-VN");

  if (loading && keys.length === 0) return <AdminTableSkeleton />;

  return (
    <div className="p-6 lg:p-10 flex flex-col gap-8">
      <AdminPageHeader 
        title="Kho khóa API"
        tagline="Quản lý tài nguyên, cấp phát và giám sát mức độ tiêu thụ của các API Key"
        actions={
          <div className="flex items-center gap-3">
             <Button variant="ghost" onClick={() => setConfirmAction({ type: 'reset_all' })} className="h-10 px-4 rounded-xl border border-white/5 font-semibold tracking-wider text-xs">
                <RefreshCw size={14} className="mr-2" /> Làm mới hạn mức
             </Button>
             <Button as={Link} to="/admin/keys/bulk-import" variant="ghost" className="h-10 px-4 rounded-xl border border-white/5 font-semibold tracking-wider text-xs">
                <Upload size={14} className="mr-2" /> Nhập Bulk
             </Button>
             <Button as={Link} to="/admin/keys/new" variant="primary" className="h-10 px-6 rounded-xl font-semibold tracking-wider text-xs">
                <Plus size={14} className="mr-2" /> {t.add_key_btn}
             </Button>
          </div>
        }
      />

      {/* Chỉ số vận hành */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <AdminStatCard label="Tổng số" value={totals.total} icon={Database} trend="+2.4%" />
        <AdminStatCard label="Sẵn sàng" value={totals.available} icon={Shield} tone="success" />
        <AdminStatCard label="Đã cấp" value={totals.allocated} icon={Zap} tone="primary" />
        <AdminStatCard label="Hết hạn mức" value={totals.exhausted} icon={Activity} tone="warning" />
        <AdminStatCard label="Bị khóa" value={totals.banned} icon={Trash2} tone="danger" />
      </div>

      {error && <Alert tone="danger" onDismiss={() => setError("")}>{error}</Alert>}

      <div className="flex flex-col gap-10">
         {/* Tóm tắt theo nhà cung cấp */}
         <section className="flex flex-col gap-4">
            <div className="flex items-center gap-3 px-2">
               <Cpu size={16} className="text-primary/60" />
               <h2 className="text-xs font-semibold tracking-wider text-base-content/40">Hạ tầng nhà cung cấp</h2>
            </div>
            <AdminTable>
               <thead>
                  <tr className="bg-white/[0.02]">
                     <th className="py-4 px-6 text-left font-semibold tracking-wider text-xs opacity-40">Nhà cung cấp</th>
                     <th className="py-4 px-6 text-right font-semibold tracking-wider text-xs opacity-40">Tổng</th>
                     <th className="py-4 px-6 text-right font-semibold tracking-wider text-xs opacity-40">Sẵn sàng</th>
                     <th className="py-4 px-6 text-right font-semibold tracking-wider text-xs opacity-40">Đã cấp</th>
                     <th className="py-4 px-6 text-right font-semibold tracking-wider text-xs opacity-40">Hết hạn</th>
                     <th className="py-4 px-6 text-right font-semibold tracking-wider text-xs opacity-40">Bị khóa</th>
                     <th className="py-4 px-6 text-right font-semibold tracking-wider text-xs opacity-40">Thao tác</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {summary.map((r) => (
                    <tr key={r.provider_id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-4 px-6">
                         <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-base-content tracking-tight">{r.slug}</span>
                            {PROVIDER_SIGNUP_LINKS[r.slug] && (
                              <a href={PROVIDER_SIGNUP_LINKS[r.slug]} target="_blank" rel="noreferrer" className="text-xs font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all">
                                 LẤY KHÓA <ExternalLink size={8} />
                              </a>
                            )}
                         </div>
                      </td>
                      <td className="py-4 px-6 text-right font-mono text-sm font-bold">{r.total}</td>
                      <td className={`py-4 px-6 text-right font-mono text-xs ${r.available > 0 ?"text-base-content font-bold" : "opacity-20"}`}>{r.available}</td>
                      <td className={`py-4 px-6 text-right font-mono text-xs ${r.allocated > 0 ?"text-primary font-bold" : "opacity-20"}`}>{r.allocated}</td>
                      <td className={`py-4 px-6 text-right font-mono text-xs ${r.exhausted > 0 ?"text-warning font-bold" : "opacity-20"}`}>{r.exhausted}</td>
                      <td className={`py-4 px-6 text-right font-mono text-xs ${r.banned > 0 ?"text-danger font-bold" : "opacity-20"}`}>{r.banned}</td>
                      <td className="py-4 px-6 text-right">
                       <Button as={Link} to={`/admin/keys/new?provider_id=${r.provider_id}`} size="sm" variant="ghost" className="h-8 rounded-lg border border-white/5 text-xs font-semibold tracking-wider bg-white/[0.02]">
                          <Plus size={12} className="mr-1" /> Thêm khóa
                       </Button>

                      </td>
                    </tr>
                  ))}
               </tbody>
            </AdminTable>
         </section>

         {/* Danh sách khóa chi tiết */}
         <section className="flex flex-col gap-6">
            <div className="flex items-center justify-between px-2">
               <div className="flex items-center gap-3">
                  <BarChart3 size={16} className="text-primary/60" />
                  <h2 className="text-xs font-semibold tracking-wider text-base-content/40">Danh sách khóa hệ thống ({keys.length})</h2>
               </div>
               {loading && <Activity size={14} className="text-primary" />}
            </div>

            <AdminFilterBar
              search={searchInput}
              onSearchChange={setSearchInput}
              onClear={() => { setSearchInput(""); reset(); }}
            >
              <Input 
                type="number" 
                placeholder="ID GIẤY PHÉP"
                value={filters.license_id || ""} 
                onChange={(e) => setFilters({ license_id: e.target.value, offset: 0 })}
                className="w-32 bg-white/5 border-white/5 rounded-xl font-bold text-xs" 
              />
              {filters.license_id && (
                <Button size="sm" variant="ghost" onClick={() => setConfirmAction({ type: 'release_license' })} className="h-10 px-4 rounded-xl border border-warning/20 text-warning font-semibold tracking-wider text-xs">
                  Giải phóng tất cả
                </Button>
              )}
              <Select 
                value={filters.provider_id}
                onChange={(e) => setFilters({ provider_id: e.target.value, offset: 0 })}
                className="h-10 min-w-[160px] bg-white/5 border-white/5 rounded-xl font-semibold tracking-wider text-xs"
                options={[
                  { label: "TẤT CẢ NHÀ CUNG CẤP", value: "" },
                  ...providers.map((p) => ({ value: String(p.id), label: p.slug })),
                ]} 
              />
              <Select 
                value={filters.status}
                onChange={(e) => setFilters({ status: e.target.value, offset: 0 })}
                className="h-10 min-w-[140px] bg-white/5 border-white/5 rounded-xl font-semibold tracking-wider text-xs"
                options={[
                  { label: "TẤT CẢ TRẠNG THÁI", value: "" },
                  { label: "SẴN SÀNG", value: "available" },
                  { label: "ĐÃ CẤP", value: "allocated" },
                  { label: "HẾT HẠN MỨC", value: "exhausted" },
                  { label: "BỊ KHÓA", value: "banned" },
                ]} 
              />
            </AdminFilterBar>

            <AdminTable>
               <thead>
                  <tr className="bg-white/[0.02]">
                     <th className="py-4 px-6 text-left font-semibold tracking-wider text-xs opacity-40">Nhà cung cấp</th>
                     <th className="py-4 px-6 text-left font-semibold tracking-wider text-xs opacity-40">Định danh bảo mật</th>
                     <th className="py-4 px-6 text-center font-semibold tracking-wider text-xs opacity-40">Trạng thái</th>
                     <th className="py-4 px-6 text-center font-semibold tracking-wider text-xs opacity-40">Cấp cho</th>
                     <th className="py-4 px-6 text-center font-semibold tracking-wider text-xs opacity-40">Sức khỏe</th>
                     <th className="py-4 px-6 text-center font-semibold tracking-wider text-xs opacity-40">Tiêu thụ</th>
                     <th className="py-4 px-6 text-right font-semibold tracking-wider text-xs opacity-40">Thao tác</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {keys.length === 0 && !loading ? (
                    <tr><td colSpan="7" className="py-32"><AdminEmptyState title="Không tìm thấy khóa" description="Thử thay đổi bộ lọc tìm kiếm của bạn." /></td></tr>
                  ) : (
                    keys.map((k) => (
                      <tr key={k.id} className="group hover:bg-white/[0.01] transition-colors">
                        <td className="py-5 px-6 font-mono text-xs opacity-40">#{k.id} <br/> <span className="font-bold text-primary text-xs tracking-widest">{k.provider_slug}</span></td>
                        <td className="py-5 px-6"><KeyCell k={k} /></td>
                        <td className="py-5 px-6 text-center">
                          <AdminBadge tone={STATUS_TONES[k.status] || "neutral"}>
                            {k.status === 'available' ? 'SẴN SÀNG' : k.status === 'allocated' ? 'ĐÃ CẤP' : k.status === 'exhausted' ? 'HẾT HẠN MỨC' : 'BỊ KHÓA'}
                          </AdminBadge>
                        </td>
                        <td className="py-5 px-6 text-center">
                          {k.allocated_to_license_id ? (
                             <div className="flex flex-col items-center gap-1">
                                <span className="text-xs font-bold text-primary tracking-tighter">LIC-#{k.allocated_to_license_id}</span>
                                <span className="text-xs font-bold text-base-content/30 truncate max-w-[100px]">{k.allocated_to_email}</span>
                             </div>
                          ) : <span className="text-xs font-bold text-base-content/10">—</span>}
                        </td>
                        <td className="py-5 px-6 text-center">
                          <div className="flex flex-col items-center gap-1">
                             <AdminBadge tone={k.health_status === "healthy" ? "success" : k.health_status === "down" ? "danger" : "warning"}>
                               {k.health_status === 'healthy' ? 'ỔN ĐỊNH' : k.health_status === 'down' ? 'NGOẠI TUYẾN' : 'CẢNH BÁO'}
                             </AdminBadge>
                             {k.consecutive_failures > 0 && <span className="text-xs font-bold text-danger/60">{k.consecutive_failures} LỖI</span>}
                          </div>
                        </td>
                        <td className="py-5 px-6 text-center font-mono">
                           <div className="flex flex-col items-center">
                              <span className="text-xs font-bold text-base-content/80">{formatNum(k.monthly_used_tokens)}</span>
                              {k.monthly_quota_tokens > 0 && (
                                <span className="text-xs font-bold text-base-content/20 tracking-tighter">HẠN MỨC: {formatNum(k.monthly_quota_tokens)}</span>
                              )}
                           </div>
                        </td>
                        <td className="py-5 px-6 text-right">
                           <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-all">
                              {k.status === "allocated" && (
                                <IconButton icon={Slash} label="Thu hồi" size="sm" onClick={() => setConfirmAction({ type: 'revoke', key: k })} className="hover:text-danger" />
                              )}
                               {k.status === "available" && (
                                 <IconButton as={Link} to={`/admin/keys/${k.id}/allocate`} icon={Zap} label="Cấp phát" size="sm" className="hover:text-primary" />
                               )}

                              <IconButton icon={Trash2} label="Xóa" size="sm" onClick={() => setConfirmAction({ type: 'delete', key: k })} className="hover:text-danger" />
                           </div>
                        </td>
                      </tr>
                    ))
                  )}
               </tbody>
            </AdminTable>

            <div className="flex items-center justify-between px-2 text-xs font-semibold tracking-wider text-base-content/20">
               <span>Hiển thị {keys.length} bản ghi</span>
               <div className="flex items-center gap-4">
                  <span className="text-primary italic">Dữ liệu trực tuyến đang hoạt động</span>
               </div>
            </div>
         </section>
      </div>

       {confirmAction && (
         <AdminConfirmDialog 
           title={
             confirmAction.type === 'delete' ? "Xóa khóa bảo mật?" : 
             confirmAction.type === 'revoke' ? "Thu hồi cấp phát?" : 
             confirmAction.type === 'reset_all' ? "Làm mới hạn mức toàn cầu?" : "Giải phóng tất cả khóa?"
           }
           message="Hành động này sẽ can thiệp trực tiếp vào tài nguyên hệ thống và không thể hoàn tác."
           onConfirm={() => handleAction(confirmAction.type, confirmAction.key)}
           onCancel={() => setConfirmAction(null)}
           tone={confirmAction.type === 'delete' ? "danger" : "warning"}
         />
       )}

    </div>
  );
}

export default KeysPage;




