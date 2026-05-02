import { useState } from "react";
import "../../styles/auth.css";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Alert } from "../../components/ui";
import { billing } from "../../api/billing";
import { Icon } from "../../components/ui/icons";

const TIERS = [
  { id: "free", name: "Free", tokens: "5,000", price: "$0/mo" },
  { id: "pro", name: "Pro", tokens: "100,000", price: "$19/mo" },
  { id: "max", name: "Max", tokens: "500,000", price: "$49/mo" },
];

export function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const initialPlan = sp.get("plan") || "free";

  const [formData, setFormData] = useState({ 
    fullName: "", 
    email: "", 
    password: "",
    tier: initialPlan
  });
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
      await signup({ 
        name: formData.fullName, 
        email: formData.email, 
        password: formData.password 
      });
      
      if (formData.tier !== "free") {
        const res = await billing.subscribeCheckout({ tier: formData.tier });
        window.location.href = res.checkout_url;
        return;
      }
      
      navigate("/app", { replace: true });
    } catch (err) {
      setError(err.message || "Đăng ký thất bại");
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
            <h1>Tạo tài khoản mới</h1>
            <p>Bắt đầu hành trình AI của bạn chỉ trong vài giây</p>
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
              <label className="auth-label">Họ và tên</label>
              <div className="auth-input-container">
                <span className="auth-input-icon">
                  <Icon name="user" size={18} />
                </span>
                <input
                  type="text"
                  className="auth-input"
                  placeholder="Nguyễn Văn Anh"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>
            </div>

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
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label">Mật khẩu (8+ ký tự)</label>
              <div className="auth-input-container">
                <span className="auth-input-icon">
                  <Icon name="key" size={18} />
                </span>
                <input
                  type={showPw ? "text" : "password"}
                  className="auth-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

            <div className="auth-field">
              <label className="auth-label">Chọn gói khởi đầu</label>
              <div className="auth-tiers">
                {TIERS.map((tier) => (
                  <div
                    key={tier.id}
                    className={`tier-card ${formData.tier === tier.id ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, tier: tier.id })}
                  >
                    <div className="tier-name">{tier.name}</div>
                    <div className="tier-tokens">{tier.tokens}</div>
                    <div className="tier-price">{tier.price}</div>
                  </div>
                ))}
              </div>
            </div>

            {error && <Alert tone="danger" style={{ marginBottom: '1rem' }}>{error}</Alert>}

            <button type="submit" disabled={loading} className="auth-submit">
              {loading ? "Đang xử lý..." : "Bắt đầu miễn phí →"}
            </button>
          </form>

          <p className="auth-footer">
            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </p>

          <p className="auth-legal">
            Bằng cách đăng ký, bạn đồng ý với <a href="#">Điều khoản</a> và <a href="#">Bảo mật</a>.
          </p>
        </div>
      </div>

      <div className="auth-split__marketing">
        <div className="marketing-content">
          <div className="marketing-badge">Đặc quyền Early Access</div>
          <h2 className="marketing-title">
            Xây dựng Website <br />
            <span style={{ color: 'var(--brand)' }}>Thông minh hơn</span>
          </h2>
          <p className="marketing-desc">
            Tham gia cộng đồng hơn 5.000+ nhà phát triển đang thay đổi cách vận hành WordPress bằng AI.
          </p>

          <div className="feature-list">
            <div className="feature-item">
              <div className="feature-icon">
                <Icon name="bolt" size={20} />
              </div>
              <div className="feature-text">Tự động hóa nội dung 24/7</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <Icon name="shield" size={20} />
              </div>
              <div className="feature-text">Bảo mật đa lớp tiêu chuẩn Enterprise</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <Icon name="pi" size={20} />
              </div>
              <div className="feature-text">Tích hợp sâu hệ sinh thái Pi</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
