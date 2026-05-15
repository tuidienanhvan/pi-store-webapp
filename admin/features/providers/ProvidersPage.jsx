import React, { useCallback, useEffect, useMemo, useState } from "react";
import { withDelay } from "@/_shared/api/api-client";
import { useAdminT } from "@/_shared/lib/translations";
import { 
  Button, 
  IconButton,
  Switch,
  Alert
} from "@/_shared/components/ui";
import { 
  Plus, 
  Activity, 
  Shield, 
  Trash2, 
  Edit2, 
  Play, 
  RefreshCw,
  ExternalLink,
  Layers,
  Zap
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
  AdminStatCard
} from "../../_shared/components";

import { AdminTableSkeleton } from "@/_shared/skeletons/AdminTableSkeleton";
import { providersApi } from "./api";

/**
 * ProvidersPage: Quản lý các nhà cung cấp AI và trung tâm kết nối.
 */
export function ProvidersPage() {
  const t = useAdminT();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [testResult, setTestResult] = useState(null); // {id, ok, text}
  const [confirmDelete, setConfirmDelete] = useState(null);

  const summary = useMemo(() => {
    const total = providers.length;
    const enabled = providers.filter((p) => p.is_enabled).length;
    const keyed = providers.filter((p) => p.has_api_key).length;
    const healthy = providers.filter((p) => p.health_status === "healthy").length;
    return { total, enabled, keyed, healthy };
  }, [providers]);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await withDelay(providersApi.list(), 600);
      setProviders(res?.items || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggle = async (id, enabled) => {
    try {
      await providersApi.toggle(id, enabled);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await providersApi.delete(confirmDelete.id);
      load();
      setConfirmDelete(null);
    } catch (e) {
      setError(e.message);
      setConfirmDelete(null);
    }
  };

  const handleTest = async (p) => {
    setTestResult({ id: p.id, loading: true });
    try {
      const res = await providersApi.test(p.id);
      setTestResult({ id: p.id, ...res });
    } catch (e) {
      setTestResult({ id: p.id, ok: false, error: e.message });
    }
  };

  if (loading && providers.length === 0) return <AdminTableSkeleton />;

  return (
    <div className="p-6 lg:p-10 flex flex-col gap-8">
      <AdminPageHeader 
        title="Nhà cung cấp AI"
        tagline="Quản lý kết nối, model và trung tâm điều phối lưu lượng AI"
        actions={
          <Button as={Link} to="/admin/providers/new" variant="primary" className="h-10 px-6 rounded-xl font-semibold tracking-wider text-xs">
            <Plus size={14} className="mr-2" />
            {t.add_provider}
          </Button>
        }
      />

      {/* Tóm tắt vận hành */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard label="Tổng số" value={summary.total} icon={Layers} trend="Đang chạy" />
        <AdminStatCard label="Kích hoạt" value={summary.enabled} icon={Zap} tone="primary" />
        <AdminStatCard label="Có API Key" value={summary.keyed} icon={Shield} tone="brand" />
        <AdminStatCard label="Hoạt động tốt" value={summary.healthy} icon={Activity} tone="success" />
      </div>

      {error && <Alert tone="warning" onDismiss={() => setError("")}>{error}</Alert>}

      {/* Bảng danh sách nhà cung cấp */}
      <AdminTable>
        <thead>
          <tr className="bg-white/[0.02]">
            <th className="py-5 px-6 text-left font-semibold tracking-wider text-xs opacity-40">Mã / Tên</th>
            <th className="py-5 px-6 text-left font-semibold tracking-wider text-xs opacity-40">Model ID</th>
            <th className="py-5 px-6 text-center font-semibold tracking-wider text-xs opacity-40">Dịch vụ</th>
            <th className="py-5 px-6 text-center font-semibold tracking-wider text-xs opacity-40">Sức khỏe</th>
            <th className="py-5 px-6 text-center font-semibold tracking-wider text-xs opacity-40">Định giá (¢)</th>
            <th className="py-5 px-6 text-center font-semibold tracking-wider text-xs opacity-40">Kho khóa</th>
            <th className="py-5 px-6 text-center font-semibold tracking-wider text-xs opacity-40">Bật/Tắt</th>
            <th className="py-5 px-6 text-right font-semibold tracking-wider text-xs opacity-40">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {providers.map((p) => (
            <tr key={p.id} className="group hover:bg-white/[0.01] transition-all duration-300">
              <td className="py-6 px-6">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-base-content group-hover:text-primary transition-colors">{p.slug}</span>
                  <span className="text-xs font-bold text-base-content/30 tracking-wider">{p.display_name}</span>
                </div>
              </td>
              <td className="py-6 px-6">
                <code className="text-xs font-mono font-bold text-base-content/60 bg-white/5 px-2 py-1 rounded border border-white/5">{p.model_id}</code>
              </td>
              <td className="py-6 px-6 text-center">
                <AdminBadge tone={p.tier === "paid" ? "brand" : "neutral"}>
                  {p.tier === 'paid' ? 'TRẢ PHÍ' : 'MIỄN PHÍ'}
                </AdminBadge>
              </td>
              <td className="py-6 px-6 text-center">
                <div className="flex flex-col items-center gap-1">
                   <AdminBadge tone={p.health_status === "healthy" ? "success" : p.health_status === "down" ? "danger" : "warning"}>
                     {p.health_status === 'healthy' ? 'ỔN ĐỊNH' : p.health_status === 'down' ? 'NGOẠI TUYẾN' : p.health_status === 'degraded' ? 'SUY GIẢM' : 'KHÔNG XÁC ĐỊNH'}
                   </AdminBadge>
                   {p.last_error && (
                     <span className="text-xs font-bold text-danger/40 truncate max-w-[120px]" title={p.last_error}>{p.last_error}</span>
                   )}
                </div>
              </td>
              <td className="py-6 px-6 text-center">
                 <div className="flex flex-col items-center">
                    <span className="text-xs font-mono font-bold text-base-content/80">VÀO: ${((p.input_cost_per_mtok_cents || 0) / 100).toFixed(2)}</span>
                    <span className="text-xs font-mono font-bold text-base-content/40">RA: ${((p.output_cost_per_mtok_cents || 0) / 100).toFixed(2)}</span>
                 </div>
              </td>
              <td className="py-6 px-6 text-center">
                 <div className="flex flex-col items-center">
                    <AdminValue className="text-sm">{p.keys_count || 0}</AdminValue>
                    <a href={`/admin/keys?provider_id=${p.id}`} className="text-xs font-bold text-primary tracking-wider opacity-40 hover:opacity-100 transition-all flex items-center gap-1">
                       QUẢN LÝ <ExternalLink size={8} />
                    </a>
                 </div>
              </td>
              <td className="py-6 px-6 text-center">
                 <Switch checked={p.is_enabled}
                    onChange={(e) => toggle(p.id, e.target.checked)} />
              </td>
              <td className="py-6 px-6 text-right">
                <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-all">
                  <IconButton icon={Play} label="Test" size="sm" onClick={() => handleTest(p)} className="hover:text-success" />
                   <IconButton as={Link} to={`/admin/providers/${p.id}/edit`} icon={Edit2} label="Sửa" size="sm" className="hover:text-primary" />

                  <IconButton icon={Trash2} label="Xóa" size="sm" onClick={() => setConfirmDelete(p)} className="hover:text-danger" />
                </div>
                {testResult && testResult.id === p.id && (
                  <div className="mt-2 flex justify-end">
                    {testResult.loading ? (
                      <RefreshCw size={12} className="text-primary" />
                    ) : testResult.ok ? (
                      <span className="text-xs font-bold text-success tracking-wider">{testResult.latency_ms}ms OK</span>
                    ) : (
                      <span className="text-xs font-bold text-danger tracking-wider">LỖI</span>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
          {providers.length === 0 && !loading && (
            <tr><td colSpan="8" className="py-32"><AdminEmptyState title="Không tìm thấy nhà cung cấp" description="Bắt đầu bằng cách thêm nhà cung cấp AI đầu tiên của bạn." /></td></tr>
          )}
        </tbody>
      </AdminTable>

       {confirmDelete && (

        <AdminConfirmDialog 
          title="Xóa nhà cung cấp?"
          message={`Hành động này sẽ xóa vĩnh viễn nhà cung cấp ${confirmDelete.slug}. Tất cả các khóa liên quan sẽ bị mồ côi.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
          tone="danger"
        />
      )}
    </div>
  );
}

export default ProvidersPage;




