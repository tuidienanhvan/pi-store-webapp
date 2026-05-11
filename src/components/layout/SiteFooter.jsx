import { Link } from "react-router-dom";

import { useLocale } from "@/context/LocaleContext";

import { Icon } from "../ui";

import { Heart } from "lucide-react";

import "./SiteFooter.css";



const FOOTER_LINKS = {

  products: [

    { label: "Pi Ecosystem", to: "/product/pi-ecosystem" },

    { label: "Bảng giá", to: "/pricing" },

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

  ],

};



export function SiteFooter() {

  const { dict } = useLocale();

  const t = dict.footer;



  return (

    <footer className="site-footer site-footer--shell border-t border-base-border">

      <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-12 relative z-10">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 items-start mb-16 lg:mb-24">

          <div className="flex flex-col gap-6">

            <Link to="/" className="flex items-center gap-4 no-underline text-inherit group w-fit">

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-surface-raised to-surface-sunken border border-base-border flex items-center justify-center group-hover:border-primary/50 transition-all duration-500 shadow-xl relative overflow-hidden">

                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                <img src="/logo-optimized.svg?v=20260417-1" alt="Pi" width="28" height="28" className="relative z-10 group-hover:scale-110 transition-transform duration-500" />

              </div>

              <div className="flex flex-col">

                <span className="text-2xl font-bold text-base-content tracking-tight font-display leading-tight">Pi Ecosystem</span>

                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary opacity-80">WordPress Intelligence</span>

              </div>

            </Link>

            <p className="m-0 text-sm text-base-content/80 leading-relaxed max-w-[300px] font-medium opacity-70 italic">

              "{t.tagline}"

            </p>

            <div className="flex items-center gap-6 mt-4">

              <a href="https://github.com/piwebagency" target="_blank" rel="noreferrer" className="text-base-content/80 hover:text-primary transition-all duration-300 opacity-60 hover:opacity-100 hover:-translate-y-1">

                <Icon name="github" size={22} strokeWidth={2} />

              </a>

              <a href="https://zalo.me/pi-ecosystem" target="_blank" rel="noreferrer" className="text-base-content/80 hover:text-primary transition-all duration-300 opacity-60 hover:opacity-100 hover:-translate-y-1">

                <Icon name="zalo" size={22} strokeWidth={2} />

              </a>

              <a href="mailto:hello@piwebagency.com" className="text-base-content/80 hover:text-primary transition-all duration-300 opacity-60 hover:opacity-100 hover:-translate-y-1">

                <Icon name="mail" size={22} strokeWidth={2} />

              </a>

            </div>

          </div>



          <div className="flex flex-col gap-8">

            <h4 className="text-[11px] uppercase tracking-[0.25em] font-bold text-primary m-0">Products</h4>

            <nav className="flex flex-col gap-4">

              {FOOTER_LINKS.products.map((link) => (

                <Link key={link.to} to={link.to} className="footer-link w-fit text-[15px]">

                  {link.label}

                </Link>

              ))}

            </nav>

          </div>



          <div className="flex flex-col gap-8">

            <h4 className="text-[11px] uppercase tracking-[0.25em] font-bold text-primary m-0">Platform</h4>

            <nav className="flex flex-col gap-4">

              {FOOTER_LINKS.platform.map((link) =>

                link.external ? (

                  <a key={link.to} href={link.to} target="_blank" rel="noreferrer" className="footer-link w-fit text-[15px]">

                    {link.label} <Icon name="external-link" size={12} className="opacity-40" />

                  </a>

                ) : (

                  <Link key={link.to} to={link.to} className="footer-link w-fit text-[15px]">

                    {link.label}

                  </Link>

                ),

              )}

            </nav>

          </div>



          <div className="flex flex-col gap-8">

            <h4 className="text-[11px] uppercase tracking-[0.25em] font-bold text-primary m-0">Company</h4>

            <nav className="flex flex-col gap-4">

              {FOOTER_LINKS.company.map((link) => (

                <Link key={link.to} to={link.to} className="footer-link w-fit text-[15px]">

                  {link.label}

                </Link>

              ))}

            </nav>

          </div>

        </div>



        <div className="pt-12 border-t border-base-border">

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-sm font-medium">

            <div className="flex items-center gap-4 text-base-content/60">

              <span className="text-base-content font-semibold opacity-90 tracking-tight">{new Date().getFullYear()} Pi Ecosystem.</span>

              <span className="w-1 h-1 rounded-full bg-base-content/10 hidden md:block" />

              <span className="flex items-center gap-2 opacity-60">

                Made with <Heart size={14} className="text-primary animate-pulse" fill="currentColor" /> in Saigon

              </span>

            </div>

            <div className="flex items-center gap-8 opacity-40 hover:opacity-100 transition-opacity duration-500">

              <span className="text-[11px] tracking-[0.1em] font-bold uppercase">v1.2 Stable Release</span>

              <span className="text-[11px] tracking-[0.1em] font-bold uppercase">Cloud Platform: Railway & Vercel</span>

            </div>

          </div>

        </div>

      </div>

    </footer>

  );

}

