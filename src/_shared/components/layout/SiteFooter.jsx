import { Link } from "react-router-dom";
import { useLocale } from "../../context/LocaleContext";
import { Heart, Mail, Globe, Cpu, Zap, Send } from "lucide-react";
import PiLogo from "@pi-ui/base/PiLogo";
import "./SiteFooter.css";

const FOOTER_LINKS = {
  products: [
    { label: "Pi Ecosystem", to: "/catalog/pi-ecosystem" },
    { label: "Bảng giá", to: "/pricing" },
    { label: "Add-ons", to: "/catalog" },
  ],
  platform: [
    { label: "Documentation", to: "/docs" },
    { label: "API Reference", to: "/docs/api" },
    { label: "System Status", to: "https://status.piwebagency.com", external: true },
    { label: "Changelog", to: "/docs/changelog" },
  ],
  company: [
    { label: "Về chúng tôi", to: "/about" },
    { label: "Liên hệ", to: "/contact" },
    { label: "FAQ", to: "/faq" },
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Terms of Service", to: "/terms" },
  ],
};

const HUDCorner = ({ className }) => (
  <svg className={`hud-corner-svg ${className}`} viewBox="0 0 20 20">
    <path d="M0,0 L20,0 M0,0 L0,20" fill="none" stroke="currentColor" strokeWidth="1" />
  </svg>
);

export function SiteFooter() {
  const { locale } = useLocale();

  return (
    <footer className="site-footer">
      <div className="footer-scan-line" />
      <div className="footer-grid-mesh" />
      
      <div className="mx-auto w-full max-w-[1400px] px-8 lg:px-20 relative z-10">
        <div className="footer-main-layout">
          {/* BRANDING SECTION */}
          <div className="footer-section branding">
            <Link to="/" className="footer-logo-wrapper group">
              <div className="logo-glow-ring" />
              <PiLogo size={32} className="relative z-10" />
              <div className="logo-text">
                <span className="name">PI STORE</span>
                <span className="version">CORE_OS_V2.5</span>
              </div>
            </Link>
            
            <p className="footer-tagline">
              {locale === "vi" 
                ? "Kiến tạo tương lai WordPress bằng sức mạnh AI và Tokenomics phi tập trung." 
                : "Architecting the future of WordPress with AI and decentralized Tokenomics."}
            </p>

            <div className="social-links-hud">
              <a href="#" className="social-btn" aria-label="X/Twitter"><Send size={16} /></a>
              <a href="#" className="social-btn" aria-label="Globe"><Globe size={16} /></a>
              <a href="mailto:hello@pi.com" className="social-btn" aria-label="Email"><Mail size={16} /></a>
            </div>
          </div>

          {/* NAV LINKS SECTION */}
          <div className="footer-nav-grid">
            <div className="nav-column">
              <h4 className="column-title">
                <Zap size={12} className="text-primary" />
                <span>SOLUTIONS</span>
              </h4>
              <ul className="column-links">
                {FOOTER_LINKS.products.map((link) => (
                  <li key={link.to}><Link to={link.to}>{link.label}</Link></li>
                ))}
              </ul>
            </div>

            <div className="nav-column">
              <h4 className="column-title">
                <Globe size={12} className="text-primary" />
                <span>INFRASTRUCTURE</span>
              </h4>
              <ul className="column-links">
                {FOOTER_LINKS.platform.map((link) => (
                  <li key={link.to}>
                    {link.external ? (
                      <a href={link.to} target="_blank" rel="noreferrer">{link.label}</a>
                    ) : (
                      <Link to={link.to}>{link.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="nav-column">
              <h4 className="column-title">
                <Cpu size={12} className="text-primary" />
                <span>GOVERNANCE</span>
              </h4>
              <ul className="column-links">
                {FOOTER_LINKS.company.map((link) => (
                  <li key={link.to}><Link to={link.to}>{link.label}</Link></li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* HUD BOTTOM BAR */}
        <div className="footer-hud-bar">
          <HUDCorner className="tl" />
          <HUDCorner className="tr" />
          
          <div className="hud-bar-content">
            <div className="bar-info-left">
              <span className="mono">SYS_AUTH: [PI_NETWORK_2026]</span>
              <span className="divider" />
              <span className="saigon">
                MADE WITH <Heart size={10} className="text-danger fill-danger" /> BY AI_ENGINEERS
              </span>
            </div>

            <div className="bar-info-right">
              <div className="status-indicator">
                <div className="dot" />
                <span className="mono">KERNEL_STABLE</span>
              </div>
              <span className="divider" />
              <span className="mono">LOC: ASIA_SGN_01</span>
              <span className="divider" />
              <span className="mono">PING: 14MS</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom-glow" />
    </footer>
  );
}
