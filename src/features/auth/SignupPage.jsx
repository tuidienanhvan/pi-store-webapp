import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/_shared/context/AuthContext";
import { Alert } from "@/_shared/components/ui";
import { User, Mail, Key, Eye, EyeOff } from "lucide-react";
import PiLogo from "@pi-ui/base/PiLogo";
import './SignupPage.css';

function QuantumDataMatrix() {
  return (
    <div className="quantum-visualizer">
      <svg className="quantum-hud-svg" viewBox="0 0 400 120" preserveAspectRatio="none">
        <defs>
          <linearGradient id="hudGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--p)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--p)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--p)" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Connection Lines */}
        <path d="M10 60 Q 100 10, 200 60 T 390 60" fill="none" stroke="var(--p)" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.3" />
        <path d="M10 60 Q 100 110, 200 60 T 390 60" fill="none" stroke="var(--in)" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.3" />
        
        {/* Data Nodes */}
        {[20, 60, 100, 140, 180, 220, 260, 300, 340, 380].map((x, i) => (
          <g key={x} className={`hud-node node-${i}`}>
            <circle cx={x} cy={60 + Math.sin(x/20) * 30} r="2" fill={i % 2 === 0 ? "var(--p)" : "var(--in)"} />
            <circle cx={x} cy={60 + Math.sin(x/20) * 30} r="6" fill="none" stroke={i % 2 === 0 ? "var(--p)" : "var(--in)"} strokeWidth="0.5" opacity="0.2">
              <animate attributeName="r" values="6;10;6" dur="3s" repeatCount="indefinite" />
            </circle>
          </g>
        ))}
        
        {/* Scanning Bar */}
        <rect x="0" y="0" width="2" height="120" fill="url(#hudGradient)">
          <animate attributeName="x" values="0;398;0" dur="4s" repeatCount="indefinite" />
        </rect>
      </svg>
      
      <div className="hud-overlay">
        <div className="hud-metric">
          <span className="hud-label">SYNC RATE</span>
          <span className="hud-value">99.8%</span>
        </div>
        <div className="hud-metric">
          <span className="hud-label">AI LATENCY</span>
          <span className="hud-value">12ms</span>
        </div>
      </div>
    </div>
  );
}

export function SignupPage() {
  const navigate = useNavigate();
  const { login: _login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSocialLogin = (provider) => {
    console.log(`Signup with ${provider}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      console.log("Mock register", { name, email, password });
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pi-signup-page auth-split auth-split--signup">
      <div className="auth-noise" aria-hidden="true" />
      <div className="auth-decorative-blob auth-decorative-blob--1" />
      <div className="auth-decorative-blob auth-decorative-blob--2" />

      <section className="auth-split__form" aria-label="Đăng ký Pi Ecosystem">
        <div className="auth-form-card">
          <header className="relative z-10">
            <div className="flex items-center gap-4 mb-6 lg:mb-0">
              <PiLogo size={56} />
              <div className="flex flex-col">
                <span className="text-xs font-semibold tracking-wide text-primary opacity-90 leading-none">Pi Ecosystem</span>
                <h1 className="text-2xl font-semibold tracking-tight text-base-content leading-none mt-1">Store <span className="text-primary/50 font-medium">V2</span></h1>
              </div>
            </div>
          </header>

          <div className="auth-header">
            <p className="auth-kicker">Join the ecosystem</p>
            <h1 className="whitespace-nowrap">Tạo tài khoản mới</h1>
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
            <div className="auth-grid-2">
              <div className="auth-field">
                <label className="auth-label">Họ và tên</label>
                <div className="auth-input-container">
                  <span className="auth-input-icon">
                    <User size={18} />
                  </span>
                  <input
                    type="text"
                    className="auth-input"
                    placeholder="Nguyễn Văn A"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

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
            </div>

            <div className="auth-field">
              <label className="auth-label">Mật khẩu</label>
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
                  minLength={8}
                />
                <button type="button" className="auth-pw-toggle" onClick={() => setShowPw(!showPw)} aria-label="Hiện hoặc ẩn mật khẩu">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <Alert tone="danger">{error}</Alert>}

            <button type="submit" disabled={loading} className="auth-submit auth-submit--modern">
              {loading ? "Đang xử lý..." : "Đăng ký ngay"}
            </button>
          </form>

          <p className="auth-footer">
             Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </p>

          <footer className="flex items-center justify-between text-xs font-semibold tracking-wide text-base-content/20 mt-6 mb-2">
            <span>PI ECOSYSTEM  2026</span>
            <span>KERNEL V2.0 PRO</span>
          </footer>
        </div>
      </section>

      <section className="auth-split__marketing" aria-label="Pi Ecosystem Packages">
        <div className="marketing-content">
          <div className="marketing-badge">Unlock Limitless AI</div>
          <h2 className="marketing-title">
            Giải pháp thông minh <br/>
            <span>cho mọi quy mô.</span>
          </h2>
          <p className="marketing-desc mb-6">
            Lựa chọn gói dịch vụ phù hợp để bắt đầu tự động hóa quy trình quản trị, tăng trưởng traffic và tối ưu SEO cho website WordPress của bạn.
          </p>

          <QuantumDataMatrix />

          {/* HUD Decorators */}
          <div className="hud-corner hud-corner--tl" />
          <div className="hud-corner hud-corner--tr" />
          <div className="hud-corner hud-corner--bl" />
          <div className="hud-corner hud-corner--br" />

          <div className="auth-tiers--premium mt-4">
            <div className="tier-card--glass">
              <span className="tier-label">Khởi đầu</span>
              <span className="tier-name">Free Tier</span>
              <strong className="tier-tokens">5,000 <span className="tier-unit">Tokens</span></strong>
              <span className="tier-price">Miễn phí trọn đời</span>
            </div>
            <div className="tier-card--glass active">
              <span className="tier-label" style={{ color: "var(--primary)" }}>Phổ biến</span>
              <span className="tier-name">Pro Tier</span>
              <strong className="tier-tokens">100K <span className="tier-unit">Tokens</span></strong>
              <span className="tier-price">$29 / tháng</span>
            </div>
            <div className="tier-card--glass">
              <span className="tier-label" style={{ color: "var(--auth-cyan)" }}>Doanh nghiệp</span>
              <span className="tier-name">Max Tier</span>
              <strong className="tier-tokens">500K <span className="tier-unit">Tokens</span></strong>
              <span className="tier-price">$99 / tháng</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default SignupPage;
