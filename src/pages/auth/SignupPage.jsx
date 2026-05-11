import { useState } from "react";
import "./AuthLayout.css";
import "./AuthForm.css";
import "./SignupPage.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Alert } from "@/components/ui";
import { Icon } from "@/components/ui/icons";
import PiLogo from "@pi-ui/base/PiLogo";

function PiMiniChart() {
  return (
    <div className="preview-chart" style={{ height: "60px", display: "flex", alignItems: "flex-end", gap: "4px", margin: "8px 0" }}>
      <span style={{ height: "42%", width: "100%", background: "color-mix(in srgb, var(--danger) 20%, transparent)", borderRadius: "4px 4px 0 0" }} />
      <span style={{ height: "64%", width: "100%", background: "color-mix(in srgb, var(--danger) 40%, transparent)", borderRadius: "4px 4px 0 0" }} />
      <span style={{ height: "38%", width: "100%", background: "color-mix(in srgb, var(--danger) 20%, transparent)", borderRadius: "4px 4px 0 0" }} />
      <span style={{ height: "78%", width: "100%", background: "color-mix(in srgb, var(--info) 50%, transparent)", borderRadius: "4px 4px 0 0" }} />
      <span style={{ height: "58%", width: "100%", background: "color-mix(in srgb, var(--danger) 30%, transparent)", borderRadius: "4px 4px 0 0" }} />
      <span style={{ height: "88%", width: "100%", background: "linear-gradient(180deg, var(--info), var(--brand))", borderRadius: "4px 4px 0 0" }} />
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
      setError(err.message || "ang k tht bi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-split auth-split--signup">
      <div className="auth-noise" aria-hidden="true" />
      <div className="auth-decorative-blob auth-decorative-blob--1" />
      <div className="auth-decorative-blob auth-decorative-blob--2" />

      <section className="auth-split__form" aria-label="ang k Pi Ecosystem">
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
            <p className="auth-kicker">Join the ecosystem</p>
            <h1 className="whitespace-nowrap">To ti kho?n mi</h1>
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
            <div className="auth-grid-2">
              <div className="auth-field">
                <label className="auth-label">H? v tn</label>
                <div className="auth-input-container">
                  <span className="auth-input-icon">
                    <Icon name="user" size={18} />
                  </span>
                  <input
                    type="text"
                    className="auth-input"
                    placeholder="Nguy?n Van A"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

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
            </div>

            <div className="auth-field">
              <label className="auth-label">M?t kh?u</label>
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
                  minLength={8}
                />
                <button type="button" className="auth-pw-toggle" onClick={() => setShowPw(!showPw)} aria-label="Hi?n ho?c ?n m?t kh?u">
                  <Icon name={showPw ? "eye-off" : "eye"} size={18} />
                </button>
              </div>
            </div>

            {error && <Alert tone="danger">{error}</Alert>}

            <button type="submit" disabled={loading} className="auth-submit auth-submit--modern">
              {loading ? "ang x? l..." : "ang k ngay"}
            </button>
          </form>

          <p className="auth-footer">
             c ti kho?n? <Link to="/login">ang nh?p</Link>
          </p>

          <footer className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.4em] text-base-content/20 mt-6 mb-2">
            <span>PI ECOSYSTEM  2026</span>
            <span>KERNEL V2.0 PRO</span>
          </footer>
        </div>
      </section>

      <section className="auth-split__marketing" aria-label="Pi Ecosystem Packages">
        <div className="marketing-content">
          <div className="marketing-badge">Unlock Limitless AI</div>
          <h2 className="marketing-title">
            Gi?i php thng minh <br/>
            <span>cho mi quy m.</span>
          </h2>
          <p className="marketing-desc mb-6">
            L?a ch?n gi d?ch v? ph h?p d? b?t d?u t? d?ng ha quy trnh qu?n tr?, tang tru?ng traffic v ti uu SEO cho website WordPress c?a b?n.
          </p>

          <PiMiniChart />

          <div className="auth-tiers--premium mt-4">
            <div className="tier-card--glass">
              <span className="tier-label">Kh?i d?u</span>
              <span className="tier-name">Free Tier</span>
              <strong className="tier-tokens">5,000 <span className="tier-unit">Tokens</span></strong>
              <span className="tier-price">Mi?n ph tr?n d?i</span>
            </div>
            <div className="tier-card--glass active">
              <span className="tier-label" style={{ color: "var(--primary)" }}>Ph? bi?n</span>
              <span className="tier-name">Pro Tier</span>
              <strong className="tier-tokens">100K <span className="tier-unit">Tokens</span></strong>
              <span className="tier-price">$29 / thng</span>
            </div>
            <div className="tier-card--glass">
              <span className="tier-label" style={{ color: "var(--auth-cyan)" }}>Doanh nghi?p</span>
              <span className="tier-name">Max Tier</span>
              <strong className="tier-tokens">500K <span className="tier-unit">Tokens</span></strong>
              <span className="tier-price">$99 / thng</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default SignupPage;
