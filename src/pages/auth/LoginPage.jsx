import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Card, Input, Button, Alert } from "../../components/ui";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/app";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res?.user?.is_admin) navigate("/admin", { replace: true });
      else navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--s-4)", background: "var(--bg)" }}>
      <Card className="stack" style={{ width: "100%", maxWidth: "400px", padding: "var(--s-8)", gap: "var(--s-6)" }}>
        <div className="stack" style={{ gap: "var(--s-2)", textAlign: "center" }}>
          <h1 style={{ margin: 0, fontSize: "var(--fs-24)" }}>Đăng nhập Pi</h1>
          <p style={{ margin: 0, color: "var(--text-2)" }}>
            Quản lý license, token wallet, và download plugin Pro.
          </p>
        </div>

        <form onSubmit={onSubmit} className="stack" style={{ gap: "var(--s-4)" }}>
          <Input
            label="Email"
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <Alert tone="danger">{error}</Alert>}

          <Button type="submit" variant="primary" isLoading={loading} style={{ width: "100%", marginTop: "var(--s-2)" }}>
            Đăng nhập
          </Button>
        </form>

        <div className="stack" style={{ gap: "var(--s-2)", textAlign: "center", marginTop: "var(--s-4)", fontSize: "var(--fs-14)" }}>
          <div>
            <span style={{ color: "var(--text-2)" }}>Chưa có tài khoản?</span> <Link to="/signup" style={{ fontWeight: "500", color: "var(--brand)" }}>Đăng ký</Link>
          </div>
          <Link to="/" style={{ color: "var(--text-3)", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
            <span>&larr;</span> Về storefront
          </Link>
        </div>
      </Card>
    </div>
  );
}
