import { useState } from "react";
import "./AuthLayout.css";
import "./AuthForm.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/_shared/context/AuthContext";
import { Alert } from "@/_shared/components/ui";
import { Mail, Key, Eye, EyeOff, Zap, Grid, Sparkles } from "lucide-react";
import PiLogo from "@pi-ui/base/PiLogo";

function PiOrbitMap() {
  return (
    <svg className="auth-orbit" viewBox="0 0 520 520" role="img" aria-label="Bản đồ vận hành Pi Ecosystem">
      <defs>
        <linearGradient id="orbitStroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--p)" />
          <stop offset="50%" stopColor="var(--in)" />
          <stop offset="100%" stopColor="var(--p)" />
        </linearGradient>
        
        <filter id="orbitGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="12" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--p)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--p)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background Grid */}
      <g className="auth-orbit__grid">
        {[...Array(9)].map((_, i) => (
          <path key={`h-${i}`} d={`M60 ${100 + i * 40}h400`} />
        ))}
        {[...Array(9)].map((_, i) => (
          <path key={`v-${i}`} d={`M${100 + i * 40} 60v400`} />
        ))}
      </g>

      {/* Center Glow */}
      <circle cx="260" cy="260" r="100" fill="url(#centerGlow)" className="animate-pulse" />

      {/* Outer Ring */}
      <circle className="auth-orbit__ring" cx="260" cy="260" r="210" />
      <circle className="auth-orbit__node auth-orbit__node--sat" cx="260" cy="50" r="12" />
      <circle className="auth-orbit__node auth-orbit__node--sat" cx="470" cy="260" r="10" />

      {/* Middle Ring (Tilted) */}
      <ellipse className="auth-orbit__ring auth-orbit__ring--tilt" cx="260" cy="260" rx="200" ry="120" />
      <circle className="auth-orbit__node auth-orbit__node--sat" cx="460" cy="260" r="14" />
      <circle className="auth-orbit__node auth-orbit__node--sat" cx="60" cy="260" r="8" />

      {/* Inner Ring */}
      <circle className="auth-orbit__ring auth-orbit__ring--inner" cx="260" cy="260" r="140" />
      <circle className="auth-orbit__node auth-orbit__node--sat" cx="260" cy="120" r="10" />
      <circle className="auth-orbit__node auth-orbit__node--sat" cx="120" cy="260" r="12" />

      {/* Central Brand Node */}
      <g filter="url(#orbitGlow)">
        <circle className="auth-orbit__node auth-orbit__node--brand" cx="260" cy="260" r="64" />
        <foreignObject x="210" y="210" width="100" height="100">
          <div className="flex items-center justify-center w-full h-full">
            <PiLogo size={82} />
          </div>
        </foreignObject>
      </g>
    </svg>
  );
}

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
      const res = await login(email, password);
      // Redirect based on user role
      if (res?.user?.is_admin) {
        navigate("/admin", { replace: true });
      } else {
        navigate("/app", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-split auth-split--login">
      <div className="auth-noise" aria-hidden="true" />

      <section className="auth-split__form" aria-label="Đăng nhập Pi Ecosystem">
        <div className="auth-form-card">
          <header className="relative z-10">
            <div className="flex items-center gap-4 mb-6 lg:mb-0">
              <PiLogo size={56} />
              <div className="flex flex-col">
                <span className="text-xs font-bold tracking-[0.3em] text-primary opacity-90 leading-none">Pi Ecosystem</span>
                <h1 className="text-2xl font-bold tracking-tight text-base-content leading-none mt-1">Store</h1>
              </div>
            </div>
          </header>

          <div className="auth-header">
            <p className="auth-kicker">Điểm truy cập an toàn</p>
            <h1>Chào mừng trở lại</h1>
          </div>

          <div className="auth-social">
            <button type="button" className="auth-social-btn" onClick={() => handleSocialLogin("Google")}>
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" width="18" alt="" />
              Google
            </button>
            <button type="button" className="auth-social-btn" onClick={() => handleSocialLogin("GitHub")}>
              <img src="https://www.svgrepo.com/show/512317/github-142.svg" width="18" alt="" />
              GitHub
            </button>
          </div>

          <div className="auth-divider">
            <span>Hoặc dùng email</span>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label className="auth-label">Địa chỉ email</label>
              <div className="auth-input-container">
                <span className="auth-input-icon">
                  <Mail size={18} />
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
              <div className="auth-field__row">
                <label className="auth-label mb-0">Mật khẩu</label>
                <Link to="/forgot-password" className="auth-link">Quên mật khẩu?</Link>
              </div>
              <div className="auth-input-container">
                <span className="auth-input-icon">
                  <Key size={18} />
                </span>
                <input
                  type={showPw ? "text" : "password"}
                  className="auth-input"
                  placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" className="auth-pw-toggle" onClick={() => setShowPw(!showPw)} aria-label="Hiện hoặc ẩn mật khẩu">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <Alert tone="danger">{error}</Alert>}

            <button type="submit" disabled={loading} className="auth-submit auth-submit--modern">
              {loading ? "Đang xử lý..." : "Đăng nhập ngay"}
            </button>
          </form>

          <p className="auth-footer">
            Bạn mới biết đến Pi? <Link to="/signup">Tạo tài khoản</Link>
          </p>

          <footer className="flex items-center justify-between text-xs font-bold tracking-[0.3em] text-base-content/20 mt-6 mb-2">
            <span>Pi Ecosystem 2026</span>
            <span>Trạm điều khiển</span>
          </footer>
        </div>
      </section>

      <section className="auth-split__marketing" aria-label="Pi Ecosystem">
        <div className="marketing-content">
          <div className="marketing-badge">Hệ sinh thái AI cho WordPress</div>
          <h2 className="marketing-title">
            Vận hành site như một <span>hệ thống quản trị.</span>
          </h2>
          <p className="marketing-desc">
            Dashboard, SEO bot, chatbot, analytics và lead pipeline chạy trong một hệ thống gọn, nhanh, có kiểm soát.
          </p>

          <PiOrbitMap />

          <div className="feature-list">
            <div className="feature-item">
              <div className="feature-icon"><Zap size={20} /></div>
              <div className="feature-text">Dữ liệu realtime, không cookie</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon"><Grid size={20} /></div>
              <div className="feature-text">Một dashboard cho nhiều plugin</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon"><Sparkles size={20} /></div>
              <div className="feature-text">Gọi AI theo ngữ cảnh site</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
