import { useState } from "react";
import "../../styles/auth.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Alert } from "../../components/ui";
import { Icon } from "../../components/ui/icons";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ email, password });
      navigate("/app", { replace: true });
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* ─── DYNAMIC BACKGROUND ─── */}
      <div className="auth-nebula">
        <div className="nebula-blob blob-1"></div>
        <div className="nebula-blob blob-2"></div>
        <div className="nebula-blob blob-3"></div>
        <div className="auth-grid-overlay"></div>
      </div>

      <div className="auth-split__form">
        <div className="auth-form-card">
          <Link to="/" className="auth-logo">
            <img src="/logo-optimized.svg?v=20260417-1" alt="Pi" />
            <span className="auth-logo__text">Pi Ecosystem</span>
          </Link>

          <div className="auth-header">
            <h1>Chào mừng trở lại</h1>
            <p>Đăng nhập để tiếp tục hành trình AI của bạn</p>
          </div>

          <div className="auth-social">
            <button className="auth-social-btn" onClick={() => handleSocialLogin("Google")}>
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" width="18" alt="" />
              Google
            </button>
            <button className="auth-social-btn" onClick={() => handleSocialLogin("GitHub")}>
              <img src="https://www.svgrepo.com/show/512317/github-142.svg" width="18" alt="" />
              GitHub
            </button>
          </div>

          <div className="auth-divider">
            <span>Hoặc dùng Email</span>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label className="auth-label">Địa chỉ Email</label>
              <div className="auth-input-container">
                <span className="auth-input-icon">
                  <Icon name="user" size={18} />
                </span>
                <input
                  type="email"
                  className="auth-input"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="auth-label" style={{ marginBottom: 0 }}>Mật khẩu</label>
                <Link to="/forgot-password" style={{ fontSize: '0.75rem', color: 'var(--brand)', fontWeight: 600, textDecoration: 'none' }}>
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="auth-input-container">
                <span className="auth-input-icon">
                  <Icon name="key" size={18} />
                </span>
                <input
                  type={showPw ? "text" : "password"}
                  className="auth-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="auth-pw-toggle"
                  onClick={() => setShowPw(!showPw)}
                >
                  <Icon name={showPw ? "eye-off" : "eye"} size={18} />
                </button>
              </div>
            </div>

            {error && <Alert tone="danger" style={{ marginBottom: '1rem' }}>{error}</Alert>}

            <button type="submit" disabled={loading} className="auth-submit">
              {loading ? "Đang xử lý..." : "Đăng nhập ngay"}
            </button>
          </form>

          <p className="auth-footer">
            Bạn mới biết đến Pi? <Link to="/signup">Tạo tài khoản</Link>
          </p>
        </div>
      </div>

      <div className="auth-split__marketing">
        <div className="marketing-content">
          <div className="marketing-badge">Hệ sinh thái AI hàng đầu</div>
          <h2 className="marketing-title">
            Giải phóng <br />
            <span style={{ color: 'var(--brand)' }}>Sức mạnh Sáng tạo</span>
          </h2>
          <p className="marketing-desc">
            Quay lại và tiếp tục tối ưu hóa website của bạn với các công cụ AI tiên tiến nhất hiện nay.
          </p>

          <div className="feature-list">
            <div className="feature-item">
              <div className="feature-icon">
                <Icon name="zap" size={20} />
              </div>
              <div className="feature-text">Xử lý dữ liệu thời gian thực</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <Icon name="grid" size={20} />
              </div>
              <div className="feature-text">Quản lý đa nền tảng tập trung</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <Icon name="spark" size={20} />
              </div>
              <div className="feature-text">Gợi ý AI thông minh theo ngữ cảnh</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
