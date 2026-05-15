import React, { useState, useEffect } from "react";
import { withDelay } from "@/_shared/api/api-client";
import { useAdminT } from "@/_shared/lib/translations";
import { useLocale } from "@/_shared/context/LocaleContext";
import { useListFilters, useDebouncedValue } from "@/_shared/hooks/useListFilters";
import { 
  Alert, 
  Input, 
  Select
} from "@/_shared/components/ui";
import { 
  FileText, 
  Terminal,
  Activity
} from "lucide-react";

import { 
  AdminPageHeader, 
  AdminTable, 
  AdminPagination, 
  AdminEmptyState,
  AdminFilterBar
} from "../../_shared/components";

import { AdminTableSkeleton } from "@/_shared/skeletons/AdminTableSkeleton";
import { auditApi } from "./api";
import { AuditRow } from "./components/AuditRow";

const DEFAULTS = { q: "", action: "", resource_type: "", severity: "", from_date: "", to_date: "", limit: 50, offset: 0 };

const ACTION_OPTIONS = [
  { label: "TẤT CẢ THAO TÁC", value: "" },
  { label: "TẠO MỚI", value: "create" },
  { label: "CẬP NHẬT", value: "update" },
  { label: "XÓA", value: "delete" },
  { label: "THU HỒI", value: "revoke" },
  { label: "KÍCH HOẠT LẠI", value: "reactivate" },
  { label: "CẤP PHÁT", value: "allocate" },
  { label: "GÁN GÓI", value: "assign" },
  { label: "ĐĂNG NHẬP", value: "login" },
];

const RESOURCE_OPTIONS = [
  { label: "TẤT CẢ TÀI NGUYÊN", value: "" },
  { label: "GIẤY PHÉP", value: "license" },
  { label: "API KEY", value: "key" },
  { label: "GÓI DỊCH VỤ", value: "package" },
  { label: "NHÀ CUNG CẤP", value: "provider" },
  { label: "NGƯỜI DÙNG", value: "user" },
  { label: "PHIÊN BẢN", value: "release" },
  { label: "CÀI ĐẶT", value: "settings" },
];

/**
 * AuditLogPage: Nhật ký chi tiết các thao tác vận hành hệ thống.
 */
export function AuditLogPage() {
  const { locale } = useLocale();
  const t = useAdminT();
  const { filters, setFilter, setFilters, reset } = useListFilters(DEFAULTS);
  const [searchInput, setSearchInput] = useState(filters.q || "");
  const debouncedQ = useDebouncedValue(searchInput, 300);

  const [data, setData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (debouncedQ !== filters.q) setFilters({ q: debouncedQ, offset: 0 });
  }, [debouncedQ, filters.q, setFilters]);

  useEffect(() => {
    const load = async () => {
      setLoading(true); setErr("");
      try {
        const res = await withDelay(auditApi.list(filters), 600);
        setData(res || { items: [], total: 0 });
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filters]);

  const page = Math.floor(filters.offset / filters.limit) + 1;
  const totalPages = Math.max(1, Math.ceil(data.total / filters.limit));

  if (loading && data.items.length === 0) return <AdminTableSkeleton />;

  return (
    <div className="p-6 lg:p-10 flex flex-col gap-8">
      <AdminPageHeader 
        title="Nhật ký hệ thống"
        tagline="Lịch sử chi tiết các thao tác quản trị và vận hành hạ tầng Pi Store"
      />

      {err && <Alert tone="danger" onDismiss={() => setErr("")}>{err}</Alert>}

      <AdminFilterBar
        search={searchInput}
        onSearchChange={setSearchInput}
        onClear={() => { setSearchInput(""); reset(); }}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Select value={filters.action} onChange={(e) => setFilters({ action: e.target.value, offset: 0 })} 
            options={ACTION_OPTIONS} className="h-10 min-w-[150px] bg-white/5 border-white/5 rounded-xl font-bold uppercase text-[10px] tracking-widest" />
          
          <Select value={filters.resource_type} onChange={(e) => setFilters({ resource_type: e.target.value, offset: 0 })} 
            options={RESOURCE_OPTIONS} className="h-10 min-w-[150px] bg-white/5 border-white/5 rounded-xl font-bold uppercase text-[10px] tracking-widest" />
          
          <Select value={filters.severity} onChange={(e) => setFilters({ severity: e.target.value, offset: 0 })}
            options={[{ label: "MỨC ĐỘ: TẤT CẢ", value: "" }, { label: "THÔNG TIN", value: "info" }, { label: "CẢNH BÁO", value: "warning" }, { label: "NGHIÊM TRỌNG", value: "critical" }]}
            className="h-10 min-w-[150px] bg-white/5 border-white/5 rounded-xl font-bold uppercase text-[10px] tracking-widest" />
          
          <div className="flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-xl border border-white/5">
             <span className="text-[9px] font-bold text-base-content/20 uppercase tracking-widest">Từ</span>
             <input type="date" value={filters.from_date || ""} onChange={(e) => setFilters({ from_date: e.target.value, offset: 0 })} 
               className="bg-transparent border-none text-[10px] font-bold uppercase tracking-widest focus:ring-0 text-base-content/60 p-0" />
             <span className="text-white/10 mx-1">—</span>
             <span className="text-[9px] font-bold text-base-content/20 uppercase tracking-widest">Đến</span>
             <input type="date" value={filters.to_date || ""} onChange={(e) => setFilters({ to_date: e.target.value, offset: 0 })} 
               className="bg-transparent border-none text-[10px] font-bold uppercase tracking-widest focus:ring-0 text-base-content/60 p-0" />
          </div>
        </div>
      </AdminFilterBar>

      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
           <Terminal size={14} className="text-primary/60" />
           <span className="text-[10px] font-bold uppercase tracking-widest text-base-content/30">Nhật ký: {data.total.toLocaleString()} sự kiện</span>
        </div>
        {loading && <Activity size={14} className="text-primary animate-pulse" />}
      </div>

      <AdminTable>
        <thead>
          <tr className="bg-white/[0.02]">
            <th className="w-12" />
            <th className="py-4 px-6 text-left font-bold uppercase tracking-widest text-[9px] opacity-40">Thời gian / Sự kiện</th>
            <th className="py-4 px-6 text-left font-bold uppercase tracking-widest text-[9px] opacity-40">Người thực hiện</th>
            <th className="py-4 px-6 text-left font-bold uppercase tracking-widest text-[9px] opacity-40">Thao tác</th>
            <th className="py-4 px-6 text-left font-bold uppercase tracking-widest text-[9px] opacity-40">Tài nguyên</th>
            <th className="py-4 px-6 text-left font-bold uppercase tracking-widest text-[9px] opacity-40">Nội dung</th>
            <th className="py-4 px-6 text-center font-bold uppercase tracking-widest text-[9px] opacity-40">Mức độ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.items.length === 0 && !loading ? (
            <tr><td colSpan="7" className="py-32"><AdminEmptyState icon={FileText} title="Không có thao tác nào" description="Nhật ký hệ thống trống với các tham số hiện tại." /></td></tr>
          ) : (
            data.items.map((entry) => (
              <AuditRow 
                key={entry.id} 
                entry={entry} 
                locale={locale} 
                expanded={expandedId === entry.id} 
                onToggle={() => setExpandedId(expandedId === entry.id ? null : entry.id)} 
              />
            ))
          )}
        </tbody>
      </AdminTable>

      {data.total > filters.limit && (
        <AdminPagination 
           current={page}
           total={totalPages}
           onPageChange={(p) => setFilter("offset", (p - 1) * filters.limit)}
        />
      )}
    </div>
  );
}

export default AuditLogPage;
