import { Link } from "react-router-dom";
import { useLocale } from "../context/LocaleContext";
import { Icon } from "./ui";

const FOOTER_LINKS = {
  products: [
    { label: "Plugins", to: "/catalog" },
    { label: "Pi AI Cloud tokens", to: "/product/pi-ai-cloud" },
    { label: "Pi SEO Suite", to: "/product/bundle-seo-suite" },
    { label: "Pi Business Suite", to: "/product/bundle-business" },
    { label: "Pi Agency", to: "/product/bundle-agency" },
    { label: "Pi Founder Lifetime", to: "/product/bundle-founder" },
  ],
  platform: [
    { label: "Bảng giá", to: "/pricing" },
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
  ]
};

export function SiteFooter() {
  const { dict } = useLocale();
  const t = dict.footer;

  return (
    <footer className="site-footer bg-surface-1 border-t border-hairline" style={{ paddingTop: "64px", paddingBottom: "48px", marginTop: "64px" }}>
      <div className="container stack gap-12">
        <div className="grid --cols-4 gap-12 items-start">
          {/* Brand & Mission */}
          <div className="stack gap-5">
            <Link to="/" className="row gap-3 no-underline text-inherit group w-fit">
              <div className="w-10 h-10 rounded-xl bg-surface-3 border border-hairline flex items-center justify-center group-hover:bg-brand group-hover:border-brand transition-colors">
                <img src="/logo-optimized.svg?v=20260417-1" alt="Pi" width="20" height="20" className="group-hover:brightness-0 group-hover:invert transition-all" />
              </div>
              <span className="text-20 font-bold text-1 tracking-tight">Pi Ecosystem</span>
            </Link>
            <p className="m-0 text-14 muted opacity-70 leading-relaxed max-w-[280px] font-medium">
              {t.tagline}
            </p>
            <div className="row gap-5">
              <a href="https://github.com/piwebagency" target="_blank" rel="noreferrer" className="text-14 muted hover:text-brand transition-all no-underline font-bold row gap-1">
                GitHub <Icon name="external-link" size={12} />
              </a>
              <a href="https://zalo.me/pi-ecosystem" target="_blank" rel="noreferrer" className="text-14 muted hover:text-brand transition-all no-underline font-bold">Zalo</a>
              <a href="mailto:hello@piwebagency.com" className="text-14 muted hover:text-brand transition-all no-underline font-bold">Email</a>
            </div>
          </div>

          {/* Column: Products */}
          <div className="stack gap-5">
            <h4 className="text-12 uppercase tracking-[0.2em] font-bold text-3 m-0 opacity-50">Products</h4>
            <div className="stack gap-3">
              {FOOTER_LINKS.products.map(link => (
                <Link key={link.to} to={link.to} className="text-14 text-2 hover:text-brand transition-colors no-underline font-medium">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Column: Platform */}
          <div className="stack gap-5">
            <h4 className="text-12 uppercase tracking-[0.2em] font-bold text-3 m-0 opacity-50">Platform</h4>
            <div className="stack gap-3">
              {FOOTER_LINKS.platform.map(link => (
                link.external ? (
                  <a key={link.to} href={link.to} target="_blank" rel="noreferrer" className="text-14 text-2 hover:text-brand transition-colors no-underline font-medium row gap-1">
                    {link.label} <Icon name="external-link" size={14} />
                  </a>
                ) : (
                  <Link key={link.to} to={link.to} className="text-14 text-2 hover:text-brand transition-colors no-underline font-medium">
                    {link.label}
                  </Link>
                )
              ))}
            </div>
          </div>

          {/* Column: Company */}
          <div className="stack gap-5">
            <h4 className="text-12 uppercase tracking-[0.2em] font-bold text-3 m-0 opacity-50">Company</h4>
            <div className="stack gap-3">
              {FOOTER_LINKS.company.map(link => (
                <Link key={link.to} to={link.to} className="text-14 text-2 hover:text-brand transition-colors no-underline font-medium">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Legal & Credits */}
        <div className="border-t border-hairline pt-8 mt-4">
          <div className="flex justify-between items-center flex-wrap gap-y-4 text-13 muted font-medium">
            <div className="row gap-4 items-center">
              <span className="text-1">© {new Date().getFullYear()} Pi Ecosystem.</span>
              <span className="opacity-20">|</span>
              <span className="row gap-1">
                Made with <Icon name="heart" size={12} className="text-brand" /> in Vietnam
              </span>
            </div>
            <div className="row gap-4 items-center opacity-80">
              <span className="text-2">Plugin v2 + Pi AI Cloud</span>
              <span className="opacity-20">|</span>
              <span className="text-2">Built on Railway & Vercel</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
