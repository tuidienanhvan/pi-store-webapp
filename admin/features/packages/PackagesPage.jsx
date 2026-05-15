import React, { useCallback, useEffect, useState } from "react";
import { withDelay } from "@/_shared/api/api-client";
import { useLocale } from "@/_shared/context/LocaleContext";
import { useAdminT, formatCurrency } from "@/_shared/lib/translations";
import { 
  Alert, 
  Button, 
  IconButton,
} from "@/_shared/components/ui";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  ChevronRight,
} from "lucide-react";

import { 
  AdminPageHeader, 
  AdminCard, 
  AdminValue, 
  AdminBadge, 
  AdminTable, 
  AdminEmptyState,
  AdminConfirmDialog
} from "../../_shared/components";

import { AdminTableSkeleton } from "@/_shared/components/skeletons/AdminTableSkeleton";
import { packagesApi } from "./api";
import { PackageModal } from "./components/PackageModal";

/**
 * PackagesPage: Quản lý danh mục các gói dịch vụ và sản phẩm.
 */
export function PackagesPage() {
  const { locale } = useLocale();
  const t = useAdminT();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [editing, setEditing] = useState(null); // pkg obj or "new"
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setErr("");
    try {
      const res = await withDelay(packagesApi.list(), 600);
      setItems(res.items || []);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await packagesApi.delete(confirmDelete.slug);
      load();
      setConfirmDelete(null);
    } catch (e) {
      setErr(e.message);
      setConfirmDelete(null);
    }
  };

  const formatNum = (n) => {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
    if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
    return String(n);
  };

  if (loading && items.length === 0) return <AdminTableSkeleton />;

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader 
        title="Danh mục Gói dịch vụ"
        tagline="Quản lý cấu hình, định giá và hạn mức cho các sản phẩm hệ thống"
        actions={
          <Button variant="primary" onClick={() => setEditing("new")} className="h-10 px-6 rounded-xl font-bold uppercase tracking-widest text-[10px]">
            <Plus size={14} className="mr-2" /> {t.add_package}
          </Button>
        }
      />

      {err && <Alert tone="danger" onDismiss={() => setErr("")}>{err}</Alert>}

      <AdminTable>
        <thead>
          <tr className="bg-white/[0.02]">
            <th className="py-5 px-6 text-left font-bold uppercase tracking-widest text-[10px] opacity-40">Mã / Tên hiển thị</th>
            <th className="py-5 px-6 text-right font-bold uppercase tracking-widest text-[10px] opacity-40">Giá tháng</th>
            <th className="py-5 px-6 text-right font-bold uppercase tracking-widest text-[10px] opacity-40">Giá năm</th>
            <th className="py-5 px-6 text-right font-bold uppercase tracking-widest text-[10px] opacity-40">Hạn mức Token</th>
            <th className="py-5 px-6 text-left font-bold uppercase tracking-widest text-[10px] opacity-40">Cấu hình định tuyến</th>
            <th className="py-5 px-6 text-center font-bold uppercase tracking-widest text-[10px] opacity-40">Người dùng</th>
            <th className="py-5 px-6 text-center font-bold uppercase tracking-widest text-[10px] opacity-40">Trạng thái</th>
            <th className="py-5 px-6 text-right font-bold uppercase tracking-widest text-[10px] opacity-40">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {items.map((p) => (
            <tr key={p.slug} className="group hover:bg-white/[0.01] transition-all duration-300">
              <td className="py-6 px-6">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-mono font-bold text-primary uppercase tracking-tighter">MÃ: {p.slug}</span>
                  <span className="text-sm font-bold text-base-content group-hover:text-primary transition-colors">{p.display_name}</span>
                </div>
              </td>
              <td className="py-6 px-6 text-right font-mono text-xs font-bold text-base-content/80">
                 {formatCurrency(p.price_cents_monthly, locale)}
              </td>
              <td className="py-6 px-6 text-right font-mono text-xs font-bold text-base-content/80">
                 {formatCurrency(p.price_cents_yearly, locale)}
              </td>
              <td className="py-6 px-6 text-right">
                 <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-primary">{p.token_quota_monthly > 0 ? formatNum(p.token_quota_monthly) : "∞"}</span>
                    <span className="text-[8px] font-bold text-base-content/20 uppercase tracking-widest">/ tháng</span>
                 </div>
              </td>
              <td className="py-6 px-6">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap gap-1">
                    {p.allowed_qualities.map((q) => (
                      <span key={q} className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-base-content/40 tracking-widest">{q}</span>
                    ))}
                  </div>
                  {p.routing_mode && (
                    <div className="flex items-center gap-2">
                      <AdminBadge tone={p.routing_mode === "dedicated" ? "primary" : p.routing_mode === "hybrid" ? "warning" : "neutral"}>
                        {p.routing_mode === 'shared' ? 'Bể chung' : p.routing_mode === 'dedicated' ? 'Khóa riêng' : 'Dự phòng'}
                      </AdminBadge>
                      {p.dedicated_key_count > 0 && <span className="text-[9px] font-mono text-base-content/30 italic">+{p.dedicated_key_count} keys</span>}
                    </div>
                  )}
                </div>
              </td>
              <td className="py-6 px-6 text-center">
                 <div className="flex flex-col items-center">
                    <AdminValue className="text-sm">{p.subscriber_count || 0}</AdminValue>
                    <a href={`/admin/licenses?package=${p.slug}`} className="text-[8px] font-bold text-primary uppercase tracking-widest opacity-40 hover:opacity-100 transition-all flex items-center gap-1">
                       XEM <ChevronRight size={10} />
                    </a>
                 </div>
              </td>
              <td className="py-6 px-6 text-center">
                {p.is_active ? (
                  <div className="flex items-center justify-center">
                     <div className="w-2 h-2 rounded-full bg-success" />
                  </div>
                ) : (
                  <div className="w-2 h-2 rounded-full bg-white/10 mx-auto" />
                )}
              </td>
              <td className="py-6 px-6 text-right">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <IconButton icon={Edit2} label="Sửa" size="sm" onClick={() => setEditing(p)} className="hover:text-primary" />
                  <IconButton icon={Trash2} label="Xóa" size="sm" onClick={() => setConfirmDelete(p)} className="hover:text-danger" />
                </div>
              </td>
            </tr>
          ))}
          {items.length === 0 && !loading && (
            <tr><td colSpan="8" className="py-32"><AdminEmptyState title="Không tìm thấy gói sản phẩm" description="Bắt đầu bằng cách tạo gói cước đầu tiên của bạn." /></td></tr>
          )}
        </tbody>
      </AdminTable>

      {editing !== null && (
        <PackageModal pkg={editing === "new" ? null : editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />
      )}

      {confirmDelete && (
        <AdminConfirmDialog 
          title="Xóa gói sản phẩm?"
          message={`Hành động này sẽ xóa gói cước ${confirmDelete.slug.toUpperCase()} khỏi danh mục bán hàng. Các giấy phép đang sử dụng gói này sẽ không bị ảnh hưởng trực tiếp.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
          tone="danger"
        />
      )}
    </div>
  );
}

export default PackagesPage;
