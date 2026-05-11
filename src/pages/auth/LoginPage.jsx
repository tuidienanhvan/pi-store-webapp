import { useState } from "react";
import "./AuthLayout.css";
import "./AuthForm.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Alert } from "@/components/ui";
import { Icon } from "@/components/ui/icons";
import PiLogo from "@pi-ui/base/PiLogo";

function PiOrbitMap() {
  return (
    <svg className="auth-orbit" viewBox="0 0 520 420" role="img" aria-label="B?n d? v?n hnh Pi Ecosystem">
      <defs>
        <linearGradient id="orbitStroke" x1="0" x2="1">
          <stop offset="0%" stopColor="rgba(211,85,115,0.9)" />
          <stop offset="100%" stopColor="rgba(52,211,153,0.65)" />
        </linearGradient>
        <filter id="orbitGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="7" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path className="auth-orbit__grid" d="M80 82h360M80 154h360M80 226h360M80 298h360M116 54v312M188 54v312M260 54v312M332 54v312M404 54v312" />
      <path className="auth-orbit__ring" d="M103 210c0-80 64-145 157-145s157 65 157 145-64 145-157 145-157-65-157-145Z" />
      <path className="auth-orbit__ring auth-orbit__ring--tilt" d="M95 210c46-62 102-93 165-93s119 31 165 93c-46 62-102 93-165 93S141 272 95 210Z" />
      <g filter="url(#orbitGlow)">
        <circle className="auth-orbit__node auth-orbit__node--brand" cx="260" cy="210" r="38" />
        <text className="auth-orbit__pi" x="260" y="224" textAnchor="middle">p</text>
        <circle className="auth-orbit__node" cx="151" cy="137" r="13" />
        <circle className="auth-orbit__node" cx="387" cy="166" r="12" />
        <circle className="auth-orbit__node" cx="181" cy="305" r="10" />
        <circle className="auth-orbit__node" cx="354" cy="302" r="14" />
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
      const res = await login({ email, password });
      // Redirect based on user role
      if (res?.user?.is_admin) {
        navigate("/admin", { replace: true });
      } else {
        navigate("/app", { replace: true });
      }
    } catch (err) {
      setError(err.message || "ang nh?p tht bi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-split auth-split--login">
      <div className="auth-noise" aria-hidden="true" />
      <div className="auth-decorative-blob auth-decorative-blob--1" />
      <div className="auth-decorative-blob auth-decorative-blob--2" />

      <section className="auth-split__form" aria-label="ang nh?p Pi Ecosystem">
        <div className="auth-form-card">
          <header className="relative z-10">
            <div className="flex items-center gap-4 mb-6 lg:mb-0">
              <PiLogo size={56} />
              <div className="flex flex-col">
                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-primary opacity-90 leading-none">Pi Ecosystem</span>
                <h1 className="text-2xl font-black tracking-tight text-base-content leading-none mt-1">Store <span className="text-primary/50 font-medium">V2</span></h1>
              </div>
            </div>
          </header>

          <div className="auth-header">
            <p className="auth-kicker">Secure access point</p>
            <h1>Cho m?ng tr? l?i</h1>
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
            <span>Ho?c dng email</span>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label className="auth-label">?a ch? email</label>
              <div className="auth-input-container">
                <span className="auth-input-icon">
                  <Icon name="mail" size={18} />
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
                <label className="auth-label mb-0">M?t kh?u</label>
                <Link to="/forgot-password" className="auth-link">Qun m?t kh?u?</Link>
              </div>
              <div className="auth-input-container">
                <span className="auth-input-icon">
                  <Icon name="key" size={18} />
                </span>
                <input
                  type={showPw ? "text" : "password"}
                  className="auth-input"
                  placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" className="auth-pw-toggle" onClick={() => setShowPw(!showPw)} aria-label="Hi?n ho?c ?n m?t kh?u">
                  <Icon name={showPw ? "eye-off" : "eye"} size={18} />
                </button>
              </div>
            </div>

            {error && <Alert tone="danger">{error}</Alert>}

            <button type="submit" disabled={loading} className="auth-submit auth-submit--modern">
              {loading ? "ang x? l..." : "ang nh?p ngay"}
            </button>
          </form>

          <p className="auth-footer">
            B?n mi bi?t d?n Pi? <Link to="/signup">To ti kho?n</Link>
          </p>

          <footer className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.4em] text-base-content/20 mt-6 mb-2">
            <span>PI ECOSYSTEM  2026</span>
            <span>KERNEL V2.0 PRO</span>
          </footer>
        </div>
      </section>

      <section className="auth-split__marketing" aria-label="Pi Ecosystem">
        <div className="marketing-content">
          <div className="marketing-badge">H? sinh thi AI cho WordPress</div>
          <h2 className="marketing-title">
            V?n hnh site nhu m?t <span>trung tm di?u khi?n.</span>
          </h2>
          <p className="marketing-desc">
            Dashboard, SEO bot, chatbot, analytics v lead pipeline ch?y trong m?t h thng g?n, nhanh, c ki?m sot.
          </p>

          <PiOrbitMap />

          <div className="feature-list">
            <div className="feature-item">
              <div className="feature-icon"><Icon name="zap" size={20} /></div>
              <div className="feature-text">D liu realtime, khng cookie</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon"><Icon name="grid" size={20} /></div>
              <div className="feature-text">M?t dashboard cho nhi?u plugin</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon"><Icon name="spark" size={20} /></div>
              <div className="feature-text">G?i  AI theo ng? c?nh site</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
