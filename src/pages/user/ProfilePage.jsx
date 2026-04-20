import { useAuth } from "../../context/AuthContext";
import { Card } from "../../components/ui";

export function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="stack" style={{ gap: "var(--s-8)" }}>
      <header className="stack" style={{ gap: "var(--s-2)" }}>
        <h1 style={{ margin: 0, fontSize: "var(--fs-32)" }}>Hồ sơ</h1>
        <p style={{ margin: 0, color: "var(--text-2)", fontSize: "var(--fs-18)" }}>Thông tin tài khoản Pi của bạn.</p>
      </header>

      <div className="stack" style={{ gap: "var(--s-8)" }}>
        <Card className="stack" style={{ padding: 0, overflow: "hidden" }}>
          <div className="grid --cols-3" style={{ background: "var(--surface-2)", gap: "1px" }}>
            <div style={{ background: "var(--surface)", padding: "var(--s-5)" }}>
              <div style={{ color: "var(--text-2)", fontSize: "var(--fs-14)", marginBottom: "var(--s-2)" }}>Email</div>
              <div style={{ fontWeight: "500", color: "var(--text-1)" }}>{user?.email}</div>
            </div>
            <div style={{ background: "var(--surface)", padding: "var(--s-5)" }}>
              <div style={{ color: "var(--text-2)", fontSize: "var(--fs-14)", marginBottom: "var(--s-2)" }}>Tên</div>
              <div style={{ fontWeight: "500", color: "var(--text-1)" }}>{user?.name || "—"}</div>
            </div>
            <div style={{ background: "var(--surface)", padding: "var(--s-5)" }}>
              <div style={{ color: "var(--text-2)", fontSize: "var(--fs-14)", marginBottom: "var(--s-2)" }}>Tài khoản tạo</div>
              <div style={{ fontWeight: "500", color: "var(--text-1)" }}>
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString("vi-VN")
                  : "—"}
              </div>
            </div>
          </div>
        </Card>

        <section className="stack" style={{ gap: "var(--s-4)" }}>
          <h2 style={{ margin: 0, fontSize: "var(--fs-24)" }}>Đổi mật khẩu</h2>
          <p style={{ margin: 0, color: "var(--text-2)", fontSize: "var(--fs-14)" }}>
            Feature này sẽ được thêm ở Phase 2 (<code style={{ color: "var(--brand)" }}>POST /v1/auth/password</code>).
          </p>
        </section>
      </div>
    </div>
  );
}
