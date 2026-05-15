import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { withDelay } from "@/_shared/api/api-client";
import { useLocale } from "@/_shared/context/LocaleContext";
import { useAdminT, formatDate, formatCurrencyUSD } from "@/_shared/lib/translations";
import { 
  Alert, 
  Input, 
  IconButton,
  Button
} from "@/_shared/components/ui";
import { 
  Search, 
  User, 
  Users as UsersIcon, 
  UserX, 
  ChevronRight,
  TrendingUp,
  Shield,
  Activity,
  Mail,
  UserPlus
} from "lucide-react";

import { 
  AdminPageHeader, 
  AdminBadge, 
  AdminTable, 
  AdminEmptyState,
  AdminStatCard,
  AdminValue,
  AdminFilterBar
} from "../../_shared/components";

import { AdminTableSkeleton } from "@/_shared/skeletons/AdminTableSkeleton";
import { usersApi } from "./api";

/**
 * UsersPage: Quản lý danh bạ người dùng và các chỉ số định danh.
 */
export function UsersPage() {
  const { locale } = useLocale();
  const t = useAdminT();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await withDelay(usersApi.list({ q: search }), 600);
      setUsers((res.items || []).map((u) => ({
        ...u,
        role: u.is_admin ? "admin" : "user",
        status: u.is_active === false ? "deactivated" : "active",
      })));
      setErr("");
    } catch (e) {
      console.error(e);
      setErr("Không thể kết nối với danh sách người dùng.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.name && u.name.toLowerCase().includes(search.toLowerCase()))
  ), [users, search]);

  const stats = useMemo(() => {
    const total = users.length;
    const admins = users.filter(u => u.role === 'admin').length;
    const deactivated = users.filter(u => u.status === 'deactivated').length;
    const highSpenders = users.filter(u => (u.total_spent || 0) > 100000).length;
    return { total, admins, deactivated, highSpenders };
  }, [users]);

  if (loading && users.length === 0) return <AdminTableSkeleton />;

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader 
        title="Quản lý người dùng"
        tagline={`Theo dõi và quản trị ${filteredUsers.length} định danh người dùng trong hệ thống`}
      />

      {/* Chỉ số định danh */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard label="Tổng người dùng" value={stats.total} icon={UsersIcon} trend="Live" />
        <AdminStatCard label="Quản trị viên" value={stats.admins} icon={Shield} tone="primary" />
        <AdminStatCard label="Đã khóa" value={stats.deactivated} icon={UserX} tone="danger" />
        <AdminStatCard label="Khách hàng VIP" value={stats.highSpenders} icon={TrendingUp} tone="success" />
      </div>

      {err && <Alert tone="danger" onDismiss={() => setErr("")}>{err}</Alert>}

      <AdminFilterBar
        search={search}
        onSearchChange={setSearch}
        onClear={() => setSearch("")}
        placeholder="Tìm kiếm Email / Họ tên..."
      />

      <AdminTable>
        <thead>
          <tr className="bg-white/[0.02]">
            <th className="py-5 px-6 text-left font-semibold tracking-wider text-[11px] opacity-50">Hồ sơ người dùng</th>
            <th className="py-5 px-6 text-center font-semibold tracking-wider text-[11px] opacity-50">Cấp độ truy cập</th>
            <th className="py-5 px-6 text-center font-semibold tracking-wider text-[11px] opacity-50">Tài nguyên</th>
            <th className="py-5 px-6 text-right font-semibold tracking-wider text-[11px] opacity-50">Số dư</th>
            <th className="py-5 px-6 text-right font-semibold tracking-wider text-[11px] opacity-50">Tổng chi tiêu (LTV)</th>
            <th className="py-5 px-6 text-left font-semibold tracking-wider text-[11px] opacity-50">Hoạt động cuối</th>
            <th className="py-5 px-6 text-right font-semibold tracking-wider text-[11px] opacity-50">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {filteredUsers.length === 0 && !loading ? (
            <tr><td colSpan="7" className="py-32"><AdminEmptyState icon={User} title="Không tìm thấy người dùng" description="Hệ thống danh bạ trống với tham số tìm kiếm hiện tại." /></td></tr>
          ) : (
            filteredUsers.map((u) => (
              <tr 
                key={u.id} 
                className={`group transition-all hover:bg-white/[0.01] ${u.status ==="deactivated" ? "opacity-30 grayscale blur-[1px]" : ""}`}
              >
                <td className="py-5 px-6">
                  <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                      <img 
                        src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${u.email}&backgroundColor=b6e3f4,c0aede,d1d4f9`} 
                        alt={u.name}
                        className="relative w-11 h-11 rounded-xl bg-[#0a0a0a] object-cover border border-white/10"
                      />
                      {u.status === "active" && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-[#0a0a0a]" />
                      )}
                    </div>
                    <Link to={`/admin/users/${u.id}`} className="flex flex-col">
                      <span className="text-sm font-semibold text-base-content group-hover:text-primary transition-colors tracking-tight">
                        {u.name || u.email.split("@")[0]}
                      </span>
                      <span className="text-[10px] font-medium text-base-content/30 flex items-center gap-1">
                        <Mail size={8} /> {u.email}
                      </span>
                    </Link>
                  </div>
                </td>
                <td className="py-5 px-6 text-center">
                  <AdminBadge tone={u.role === "admin" ? "brand" : "neutral"}>
                    {u.role === 'admin' ? 'Quản trị' : 'Người dùng'}
                  </AdminBadge>
                </td>
                <td className="py-5 px-6 text-center">
                  <div className="flex flex-col items-center">
                    <AdminValue className="text-sm">{u.keys_count || 0}</AdminValue>
                    <span className="text-[8px] font-semibold text-white/10 tracking-wider">Khóa</span>
                  </div>
                </td>
                <td className="py-5 px-6 text-right font-mono">
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-semibold text-base-content">
                      {formatCurrencyUSD(u.balance || 0, locale)}
                    </span>
                    <span className="text-[8px] font-semibold text-white/10 tracking-wider">Khả dụng</span>
                  </div>
                </td>
                <td className="py-5 px-6 text-right font-mono">
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-semibold text-primary">
                      {formatCurrencyUSD(u.total_spent || 0, locale)}
                    </span>
                    <span className="text-[8px] font-semibold text-white/10 tracking-wider">Giá trị trọn đời</span>
                  </div>
                </td>
                <td className="py-5 px-6">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-3">
                       <UserPlus size={10} className="text-white/20" />
                       <span className="text-[10px] font-medium text-base-content/40">{formatDate(u.created_at, locale)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <Activity size={10} className="text-white/20" />
                       <span className="text-[10px] font-medium text-base-content/30 italic">{u.last_login_at ? formatDate(u.last_login_at, locale) : "Không hoạt động"}</span>
                    </div>
                  </div>
                </td>
                <td className="py-5 px-6 text-right">
                   <Link to={`/admin/users/${u.id}`} className="opacity-60 group-hover:opacity-100 transition-all">
                      <IconButton icon={ChevronRight} label="Hồ sơ" size="sm" />
                   </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </AdminTable>
    </div>
  );
}

export default UsersPage;




