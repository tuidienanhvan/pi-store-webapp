import { useState } from "react";
import { Link } from "react-router-dom";
import { Alert } from "@/_shared/components/ui";
import { Mail } from "lucide-react";
import PiLogo from "@pi-ui/base/PiLogo";
import './ForgotPasswordPage.css';

function PiOrbitMap() {
  return (
    <svg className="auth-orbit" viewBox="0 0 520 420" role="img" aria-label="Bản đồ vận hành Pi Ecosystem">
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

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSent(true);
    } catch {
      setError("Không thể gửi yêu cầu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pi-forgot-password-page auth-split auth-split--login">
      <div className="auth-noise" aria-hidden="true" />
      <div className="auth-decorative-blob auth-decorative-blob--1" />
      <div className="auth-decorative-blob auth-decorative-blob--2" />

      <section className="auth-split__form" aria-label="Quên mật khẩu Pi Ecosystem">
        <div className="auth-form-card">
          <header className="relative z-10">
            <div className="flex items-center gap-4">
              <PiLogo size={56} />
              <div className="flex flex-col">
                <span className="text-xs font-semibold tracking-wide text-primary opacity-90 leading-none">Pi Ecosystem</span>
                <h1 className="text-2xl font-semibold tracking-tight text-base-content leading-none mt-1">Store <span className="text-primary/50 font-medium">V2</span></h1>
              </div>
            </div>
          </header>

          <div className="auth-header">
            <p className="auth-kicker">Account recovery</p>
            <h1>Quên mật khẩu?</h1>
            <p className="text-base-content/60 mt-4 text-sm leading-relaxed opacity-60">
              Nhập email đã đăng ký. Chúng tôi sẽ gửi hướng dẫn khôi phục mật khẩu vào hộp thư của bạn.
            </p>
          </div>

          {!sent ? (
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

              {error && <Alert tone="danger">{error}</Alert>}

              <button type="submit" disabled={loading} className="auth-submit auth-submit--modern">
                {loading ? "Đang gửi..." : "Gửi yêu cầu khôi phục"}
              </button>
            </form>
          ) : (
            <div className="flex flex-col gap-6 py-8">
              <Alert tone="success" className="py-6">
                <div className="flex flex-col gap-2">
                  <span className="font-semibold tracking-wide text-xs">Đã gửi thành công!</span>
                  <span>Kiểm tra email <b>{email}</b> để tiếp tục quy trình khôi phục.</span>
                </div>
              </Alert>
              <Link to="/login" className="auth-submit auth-submit--modern no-underline text-center flex items-center justify-center">
                Quay lại đăng nhập
              </Link>
            </div>
          )}

          <p className="auth-footer">
            Bạn đã nhớ ra mật khẩu? <Link to="/login">Đăng nhập</Link>
          </p>

          <footer className="flex items-center justify-between text-xs font-semibold tracking-wide text-base-content/20 mt-6 mb-2">
            <span>PI ECOSYSTEM  2026</span>
            <span>KERNEL V2.0 PRO</span>
          </footer>
        </div>
      </section>

      <section className="auth-split__marketing" aria-label="Pi Ecosystem">
        <div className="marketing-content">
          <div className="marketing-badge">Hệ sinh thái AI cho WordPress</div>
          <h2 className="marketing-title">
            Mọi thứ luôn trong <span>tầm kiểm soát.</span>
          </h2>
          <p className="marketing-desc">
            Nếu gặp khó khăn trong việc truy cập, đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng 24/7 để giúp bạn quay lại vận hành hệ thống.
          </p>

          <PiOrbitMap />

          {/* HUD Decorators */}
          <div className="hud-corner hud-corner--tl" />
          <div className="hud-corner hud-corner--tr" />
          <div className="hud-corner hud-corner--bl" />
          <div className="hud-corner hud-corner--br" />
        </div>
      </section>
    </main>
  );
}

export default ForgotPasswordPage;
