import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Card, Input, Button, Alert } from "../../components/ui";

export function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup(form);
      navigate("/app", { replace: true });
    } catch (err) {
      setError(err.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--s-4)", background: "var(--bg)" }}>
      <Card className="stack" style={{ width: "100%", maxWidth: "400px", padding: "var(--s-8)", gap: "var(--s-6)" }}>
        <div className="stack" style={{ gap: "var(--s-2)", textAlign: "center" }}>
          <h1 style={{ margin: 0, fontSize: "var(--fs-24)" }}>Đăng ký Pi</h1>
          <p style={{ margin: 0, color: "var(--text-2)" }}>
            Được tặng 1,000 Pi tokens miễn phí sau khi đăng ký.
          </p>
        </div>

        <form onSubmit={onSubmit} className="stack" style={{ gap: "var(--s-4)" }}>
          <Input
            label="Tên"
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            label="Password (8+ ký tự)"
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          {error && <Alert tone="danger">{error}</Alert>}

          <Button type="submit" variant="primary" isLoading={loading} style={{ width: "100%", marginTop: "var(--s-2)" }}>
            Tạo tài khoản
          </Button>
        </form>

        <div className="stack" style={{ gap: "var(--s-2)", textAlign: "center", marginTop: "var(--s-4)", fontSize: "var(--fs-14)" }}>
          <div>
            <span style={{ color: "var(--text-2)" }}>Đã có tài khoản?</span> <Link to="/login" style={{ fontWeight: "500", color: "var(--brand)" }}>Đăng nhập</Link>
          </div>
          <Link to="/" style={{ color: "var(--text-3)", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
            <span>&larr;</span> Về storefront
          </Link>
        </div>
      </Card>
    </div>
  );
}
