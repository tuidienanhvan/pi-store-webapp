import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { api, withDelay } from "@/lib/api-client";
import { useLocale } from "@/context/LocaleContext";
import { useAdminT, formatDate, formatCurrencyUSD } from "@/lib/translations";
import { Card, Table, Alert, Badge, Button, Input, Avatar, IconButton } from "@/components/ui";
import { Search, Plus, User, ChevronDown, Bolt, Slash, Check } from "lucide-react";
import { AdminTableSkeleton } from "@/components/skeletons/AdminTableSkeleton";

import "./AdminUsersPage.css";

export function AdminUsersPage() {
  const { locale } = useLocale();
  const t = useAdminT();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const fetchUsers = useCallback(() => {
    setLoading(true);
    withDelay(api.admin.users({ q: search }), 1000)
      .then((res) => {
        setUsers((res.items || []).map((u) => ({
          ...u,
          role: u.is_admin ? "admin" : "user",
          status: u.is_active === false ? "deactivated" : "active",
        })));
        setErr("");
      })
      .catch((e) => {
        console.error(e);
        setErr("Khng th ti danh sch ngi dng");
        setUsers([]);
      })
      .finally(() => setLoading(false));
  }, [search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.name && u.name.toLowerCase().includes(search.toLowerCase()))
  );

  const handlePromote = (id) => {
    if (!confirm(t.confirm_promote)) return;
    setUsers(users.map(u => u.id === id ? { ...u, role: "admin", is_admin: true } : u));
  };

  const handleDemote = (id) => {
    if (!confirm(t.confirm_demote)) return;
    setUsers(users.map(u => u.id === id ? { ...u, role: "user", is_admin: false } : u));
  };

  const handleDeactivate = (id, currentStatus) => {
    const isDeactivating = currentStatus === "active";
    if (!confirm(isDeactivating ? t.confirm_ban : t.confirm_unban)) return;
    setUsers(users.map(u => u.id === id ? { ...u, status: isDeactivating ? "deactivated" : "active", is_active: !isDeactivating } : u));
  };

  if (loading && users.length === 0) return <AdminTableSkeleton />;

  return (
    <div className="users-page fade-in">
      <header className="users-header stagger-1">
        <div className="flex flex-col gap-3">
          <h1 className="premium-title">{t.users_title}</h1>
          <p className="text-base-content/60 opacity-60 font-medium tracking-wide">
            {t.users_subtitle}  <span className="font-bold text-primary">{filteredUsers.length}</span> {t.accounts}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Input
            type="search"
            placeholder={locale === "en" ? "Search email or name..." : "Tm email hoc tn..."}
            leadingIcon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-80 h-[48px]"
          />
          <Button variant="primary" className="h-[48px] px-8 rounded-2xl shadow-brand/20 shadow-lg font-black uppercase tracking-widest text-xs">
            <Plus size={18} className="mr-2" />
            {t.create_user_btn}
          </Button>
        </div>
      </header>

      {err && <Alert tone="danger" onDismiss={() => setErr("")} className="mx-4 lg:mx-0 stagger-1">{err}</Alert>}

      <Card className="users-table-card stagger-2">
        <Table className="w-full users-table">
          <thead>
            <tr>
              <th className="text-left">{t.profile}</th>
              <th className="text-center">{t.role}</th>
              <th className="text-center">{t.keys}</th>
              <th className="text-right">{t.balance}</th>
              <th className="text-right">{t.total_spent}</th>
              <th className="text-left">{t.signup_last_login}</th>
              <th className="text-right">{t.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-border-subtle">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-32 text-center">
                  <div className="flex flex-col items-center gap-4 opacity-20">
                    <User size={64} />
                    <p className="text-xs font-black tracking-[0.2em] uppercase">{t.no_users}</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr 
                  key={u.id} 
                  className={`group transition-all hover:bg-base-content/[0.02] ${u.status === "deactivated" ? "opacity-40 grayscale" : ""}`}
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative group/avatar">
                        <div className="absolute -inset-1.5 bg-gradient-to-tr from-brand to-info rounded-2xl blur opacity-0 group-hover/avatar:opacity-20 transition-opacity" />
                        <img 
                          src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${u.email}&backgroundColor=b6e3f4,c0aede,d1d4f9`} 
                          alt={u.name}
                          className="relative w-12 h-12 rounded-2xl bg-base-300 object-cover border border-base-border shadow-sm"
                        />
                        {u.status === "active" && (
                          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-success rounded-full border-[3px] border-surface-raised shadow-sm" />
                        )}
                      </div>
                      <Link to={`/admin/users/${u.id}`} className="flex flex-col gap-0.5 group/name">
                        <span className="text-sm font-bold text-base-content group-hover/name:text-primary transition-colors">
                          {u.name || u.email.split("@")[0]}
                        </span>
                        <span className="text-[11px] font-medium text-base-content/60 lowercase tracking-wide opacity-50">
                          {u.email}
                        </span>
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center">
                      <Badge tone={u.role === "admin" ? "brand" : "neutral"} className="uppercase text-[9px] font-black tracking-widest px-2.5 py-1">
                        {u.role}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="text-sm font-mono text-base-content/80 font-black opacity-80">
                      {u.keys_count || 0}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="text-sm font-mono font-bold text-base-content">
                        {formatCurrencyUSD(u.balance || 0)}
                      </span>
                      <span className="text-[9px] font-black text-base-content/60 opacity-30">VND</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span className="text-sm font-mono text-base-content/60 font-bold opacity-60">
                      {formatCurrencyUSD(u.total_spent || 0)}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="text-base-content/60 font-black uppercase opacity-20 tracking-tighter w-8">K</span>
                        <span className="font-bold text-base-content/60">{formatDate(u.created_at, locale)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="text-base-content/60 font-black uppercase opacity-20 tracking-tighter w-8">LOG</span>
                        <span className="font-medium text-base-content/60 opacity-60 italic">{u.last_login_at ? formatDate(u.last_login_at, locale) : ""}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <Link to={`/admin/users/${u.id}`}>
                        <IconButton icon={User} label="H s" size="sm" className="hover:text-primary" />
                      </Link>
                      {u.role === "admin" ? (
                        <IconButton icon={ChevronDown} label="H quyn" size="sm" onClick={() => handleDemote(u.id)} className="hover:text-warning" />
                      ) : (
                        <IconButton icon={Bolt} label="Nng quyn" size="sm" onClick={() => handlePromote(u.id)} className="hover:text-primary" />
                      )}
                      <IconButton 
                        icon={u.status === "active" ? Slash : Check} 
                        label={u.status === "active" ? "Kha" : "M kha"} 
                        size="sm" 
                        onClick={() => handleDeactivate(u.id, u.status)}
                        className={u.status === "active" ? "hover:text-danger" : "hover:text-success"}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
