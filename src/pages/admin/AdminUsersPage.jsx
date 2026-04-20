import { useEffect, useState } from "react";
import { api } from "../../lib/api-client";
import { useLocale } from "../../context/LocaleContext";
import { useAdminT, formatCurrency, formatDate, formatNumber } from "../../lib/adminI18n";
import { Card, Table, Alert, Badge, Button, Input, Icon, Avatar } from "../../components/ui";

export function AdminUsersPage() {
  const { locale } = useLocale();
  const t = useAdminT();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const MOCK_USERS = [
    { id: 1, email: "admin@saigon.vn", name: "Nam Nguyễn", role: "admin", license_count: 5, token_balance: 1450000, total_spent_cents: 29900, created_at: "2025-01-10T12:00:00Z", last_login_at: "2026-04-18T00:00:00Z", status: "active" },
    { id: 2, email: "agency_hn@gmail.com", name: "Hanoi Media", role: "user", license_count: 12, token_balance: 500000, total_spent_cents: 105000, created_at: "2025-06-15T09:30:00Z", last_login_at: "2026-04-15T14:20:00Z", status: "active" },
    { id: 3, email: "dev.test@outlook.com", name: "Thành Phạm", role: "user", license_count: 1, token_balance: 10000, total_spent_cents: 0, created_at: "2026-02-14T08:10:00Z", last_login_at: "2026-03-01T10:00:00Z", status: "active" },
    { id: 4, email: "baduser@spam.com", name: "Spammer", role: "user", license_count: 0, token_balance: 0, total_spent_cents: 0, created_at: "2026-04-01T00:00:00Z", last_login_at: "2026-04-01T00:05:00Z", status: "deactivated" },
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setUsers(MOCK_USERS);
      setLoading(false);
    }, 400);
  }, []);

  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.name && u.name.toLowerCase().includes(search.toLowerCase()))
  );

  const handlePromote = (id) => {
    if (!confirm(t.confirm_promote)) return;
    setUsers(users.map(u => u.id === id ? { ...u, role: "admin" } : u));
  };
  const handleDemote = (id) => {
    if (!confirm(t.confirm_demote)) return;
    setUsers(users.map(u => u.id === id ? { ...u, role: "user" } : u));
  };
  const handleDeactivate = (id, currentStatus) => {
    const isDeactivating = currentStatus === "active";
    if (!confirm(isDeactivating ? t.confirm_ban : t.confirm_unban)) return;
    setUsers(users.map(u => u.id === id ? { ...u, status: isDeactivating ? "deactivated" : "active" } : u));
  };

  return (
    <div className="stack" style={{ gap: "var(--s-6)" }}>
      <header style={{ display: "flex", alignItems: "center", gap: "var(--s-4)", flexWrap: "wrap" }}>
        <div className="stack" style={{ gap: "var(--s-1)", flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: "var(--fs-28)", fontWeight: 700 }}>{t.users_title}</h1>
          <p style={{ margin: 0, color: "var(--text-3)", fontSize: "var(--fs-14)" }}>
            {t.users_subtitle} — {filteredUsers.length} {t.accounts}
          </p>
        </div>

        <Input
          type="search"
          placeholder={locale === "en" ? "Search email or name…" : "Tìm email hoặc tên…"}
          leadingIcon="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "240px" }}
        />

        <Button variant="primary" style={{ flexShrink: 0 }}>
          <Icon name="plus" size={16} style={{ marginRight: "6px" }} />
          {t.create_user_btn}
        </Button>
      </header>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <Table>
          <thead>
            <tr>
              <th>{t.profile}</th>
              <th>{t.role}</th>
              <th style={{ textAlign: "center" }}>{t.keys}</th>
              <th style={{ textAlign: "right" }}>{t.balance}</th>
              <th style={{ textAlign: "right" }}>{t.total_spent}</th>
              <th>{t.signup_last_login}</th>
              <th style={{ textAlign: "right" }}>{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
               <tr><td colSpan={7} className="text-center p-8 muted">{t.loading}</td></tr>
            ) : filteredUsers.length === 0 ? (
               <tr><td colSpan={7} className="text-center p-8 muted">{t.no_users}</td></tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u.id} style={{ opacity: u.status === "deactivated" ? 0.6 : 1 }}>
                  <td>
                    <div className="row gap-3 items-center">
                      <Avatar name={u.name || u.email} src={`https://api.dicebear.com/7.x/initials/svg?seed=${u.email}`} size={40} />
                      <div className="stack">
                        <span className="font-semibold text-1">{u.name || "—"}</span>
                        <span className="text-13 muted">{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge tone={u.role === "admin" ? "brand" : "neutral"}>
                      {u.role === "admin" ? t.role_admin : t.role_user}
                    </Badge>
                    {u.status === "deactivated" && <Badge tone="danger" style={{marginLeft: "4px"}}>{t.role_banned}</Badge>}
                  </td>
                  <td style={{ textAlign: "center", fontWeight: "600" }}>{u.license_count}</td>
                  <td style={{ color: "var(--brand)", fontWeight: "500", textAlign: "right" }}>
                    {formatNumber(u.token_balance, locale)}
                  </td>
                  <td style={{ color: "var(--success)", fontWeight: "500", textAlign: "right" }}>
                    {formatCurrency(u.total_spent_cents, locale)}
                  </td>
                  <td className="text-13 muted">
                    <div>{t.joined}: {formatDate(u.created_at, locale)}</div>
                    <div>{t.login}: {formatDate(u.last_login_at, locale)}</div>
                  </td>
                  <td style={{ textAlign: "right" }}>
                     <div className="row justify-end gap-2">
                       {u.role === "admin" ? (
                          <Button size="sm" variant="ghost" onClick={() => handleDemote(u.id)}>{t.action_demote}</Button>
                       ) : (
                          <Button size="sm" variant="ghost" onClick={() => handlePromote(u.id)}>{t.action_promote}</Button>
                       )}
                       <Button size="sm" variant="ghost" onClick={() => handleDeactivate(u.id, u.status)}>
                         {u.status === "active"
                            ? <span style={{ color: "var(--danger)" }}>{t.action_ban}</span>
                            : <span style={{ color: "var(--success)" }}>{t.action_unban}</span>}
                       </Button>
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
