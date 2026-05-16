import React, { useCallback, useEffect, useState } from "react";
import { withDelay } from "@/_shared/api/api-client";
import { useListFilters, useDebouncedValue } from "@/_shared/hooks/useListFilters";
import { useAdminT } from "@/_shared/lib/translations";
import { 
  Alert, 
  Button, 
  Select 
} from "@/_shared/components/ui";
import { 
  Plus, 
  Key, 
  Activity,
  History
} from "lucide-react";
import { Link } from "react-router-dom";

import { 
  AdminPageHeader, 
  AdminCard, 
  AdminValue, 
  AdminTable, 
  AdminFilterBar, 
  AdminPagination, 
  AdminEmptyState,
  AdminConfirmDialog
} from "../../_shared/components";

import { AdminTableSkeleton } from "@/_shared/skeletons/AdminTableSkeleton";
import { licensesApi } from "./api";
import { LicenseRow } from "./components/LicenseRow";
import './LicensesPage.css';

const DEFAULTS = {
  q: "", status: "", tier: "", package: "",
  sort: "-created_at", limit: 50, offset: 0,
};

/**
 * LicensesPage: Quản lý danh sách giấy phép của khách hàng.
 */
export function LicensesPage() {
  const t = useAdminT();
  const { filters, setFilter, setFilters, reset, hasActive } = useListFilters(DEFAULTS);
  const [searchInput, setSearchInput] = useState(filters.q || "");
  const debouncedQ = useDebouncedValue(searchInput, 300);

  const [data, setData] = useState({ items: [], total: 0, facets: {} });
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  
  // Trạng thái xác nhận
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    if (debouncedQ !== filters.q) setFilters({ q: debouncedQ, offset: 0 });
  }, [debouncedQ, filters.q, setFilters]);

  // Load danh sách gói dịch vụ để lọc
  useEffect(() => { 
    licensesApi.listPackages().then((r) => setPackages(r.items || [])); 
  }, []);

  const load = useCallback(async () => {
    setLoading(true); setErr("");
    try {
      const res = await withDelay(licensesApi.list(filters), 600);
      setData(res);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  const handleAction = async (type, l) => {
    try {
      if (type === 'revoke') await licensesApi.revoke(l.id);
      if (type === 'reactivate') await licensesApi.reactivate(l.id);
      if (type === 'delete') await licensesApi.delete(l.id);
      load();
      setConfirmAction(null);
    } catch (e) { 
      setErr(e.message); 
      setConfirmAction(null);
    }
  };

  const page = Math.floor(filters.offset / filters.limit) + 1;
  const facets = data.facets || {};

  if (loading && data.items.length === 0) return <AdminTableSkeleton />;

  return (
    <div className="pi-licenses-page flex flex-col gap-8">
      <AdminPageHeader 
        title="Quản lý Giấy phép"
        tagline="Danh sách mã kích hoạt và quyền truy cập của khách hàng"
        actions={
          <Button as={Link} to="/admin/licenses/new" variant="primary" className="rounded-xl font-semibold tracking-wider text-xs">
            <Plus size={14} className="mr-2" /> Tạo giấy phép mới
          </Button>
        }
      />

      {err && <Alert tone="danger" onDismiss={() => setErr("")}>{err}</Alert>}

      {/* Thanh lọc dữ liệu */}
      <AdminFilterBar 
        className="pi-licenses-page__filters"
        search={searchInput} 
        onSearchChange={setSearchInput}
        onClear={() => { setSearchInput(""); reset(); }}
      >
        <Select 
          value={filters.status}
          onChange={(e) => setFilters({ status: e.target.value, offset: 0 })}
          className="h-10 min-w-[160px] bg-base-content/5 border-base-content/10 rounded-xl font-semibold tracking-wider text-xs"
          options={[
            { label: `Trạng thái: Tất cả`, value: "" },
            { label: `Đang hoạt động (${facets.by_status?.active || 0})`, value: "active" },
            { label: `Đã thu hồi (${facets.by_status?.revoked || 0})`, value: "revoked" },
            { label: `Đã hết hạn (${facets.by_status?.expired || 0})`, value: "expired" },
          ]} 
        />
        <Select 
          value={filters.tier}
          onChange={(e) => setFilters({ tier: e.target.value, offset: 0 })}
          className="h-10 min-w-[140px] bg-base-content/5 border-base-content/10 rounded-xl font-semibold tracking-wider text-xs"
          options={[
            { label: `Hạng: Tất cả`, value: "" },
            { label: `FREE`, value: "free" },
            { label: `PRO`, value: "pro" },
            { label: `MAX`, value: "max" },
          ]} 
        />
        <Select 
          value={filters.package}
          onChange={(e) => setFilters({ package: e.target.value, offset: 0 })}
          className="h-10 min-w-[180px] bg-base-content/5 border-base-content/10 rounded-xl font-semibold tracking-wider text-xs"
          options={[
            { label: `Gói: Tất cả`, value: "" },
            ...packages.map((p) => ({ value: p.slug, label: p.display_name })),
          ]} 
        />
      </AdminFilterBar>

      {/* Thống kê nhanh */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2">
              <span className="text-xs font-semibold tracking-wider text-base-content/40">Tổng số giấy phép</span>
              <AdminValue className="text-sm">{data.total}</AdminValue>
           </div>
           {loading && <Activity size={14} className="text-primary animate-pulse" />}
        </div>
        <div className="flex items-center gap-2">
           <History size={14} className="text-base-content/10" />
           <span className="text-xs font-semibold tracking-wider text-base-content/40">Dữ liệu thời gian thực</span>
        </div>
      </div>

      {/* Bảng dữ liệu */}
      <AdminTable className="pi-licenses-page__table">
        {data.items.length === 0 && !loading ? (
          <AdminEmptyState 
            icon={Key}
            title={hasActive ? "Không tìm thấy kết quả" : "Chưa có giấy phép nào"}
            description={hasActive ? "Hãy thử điều chỉnh lại bộ lọc tìm kiếm." : "Bắt đầu cấp giấy phép đầu tiên để khách hàng sử dụng dịch vụ."}
            action={hasActive && (
              <Button variant="ghost" onClick={() => { setSearchInput(""); reset(); }} className="rounded-xl border border-base-content/10">
                Xóa bộ lọc
              </Button>
            )}
          />
        ) : (
          <>
            <thead>
              <tr className="bg-base-content/[0.02]">
                <th className="py-5 px-6 text-left font-semibold tracking-wider text-xs opacity-50">ID</th>
                <th className="py-5 px-6 text-left font-semibold tracking-wider text-xs opacity-50">Mã kích hoạt</th>
                <th className="py-5 px-6 text-left font-semibold tracking-wider text-xs opacity-50">Người dùng</th>
                <th className="py-5 px-6 text-left font-semibold tracking-wider text-xs opacity-50">Gói & Sử dụng</th>
                <th className="py-5 px-6 text-center font-semibold tracking-wider text-xs opacity-50">Kích hoạt</th>
                <th className="py-5 px-6 text-center font-semibold tracking-wider text-xs opacity-50">Trạng thái</th>
                <th className="py-5 px-6 text-right font-semibold tracking-wider text-xs opacity-50">Thao tác</th>
              </tr>
            </thead>
            <tbody className="pi-licenses-page__tbody divide-y divide-white/5">
               {data.items.map((l) => (
                 <LicenseRow 
                   key={l.id} 
                   l={l}
                   onRevoke={() => setConfirmAction({ type: 'revoke', license: l })}
                   onReactivate={() => handleAction('reactivate', l)}
                   onDelete={() => setConfirmAction({ type: 'delete', license: l })}
                 />
               ))}

            </tbody>
          </>
        )}
      </AdminTable>

      {/* Phân trang */}
      <AdminPagination 
        page={page}
        total={data.total}
        pageSize={filters.limit}
        onPageChange={(p) => setFilter("offset", (p - 1) * filters.limit)}
        onPageSizeChange={(s) => setFilters({ limit: s, offset: 0 })}
      />

       {confirmAction && (
         <AdminConfirmDialog 
           title={confirmAction.type === 'delete' ? "Xác nhận xóa vĩnh viễn?" : "Xác nhận thu hồi?"}
           message={`Bạn đang thực hiện thao tác quan trọng trên giấy phép của ${confirmAction.license.email}. Hành động này không thể hoàn tác.`}
           onConfirm={() => handleAction(confirmAction.type, confirmAction.license)}
           onCancel={() => setConfirmAction(null)}
           tone="danger"
         />
       )}

    </div>
  );
}

export default LicensesPage;



