import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import PiLogo from "@pi-ui/base/PiLogo";
import { useLocale } from "../../context/LocaleContext";
import { LanguageToggle } from "../core/LanguageToggle";
import { useAuth } from "../../context/AuthContext";
import { ThemeToggle } from "../ui";
import { ChevronDown, ShieldCheck, LayoutDashboard, LogOut, Search, ArrowRight } from "lucide-react";
import "./SiteHeader.css";

const HUDDecorator = () => (
  <div className="hud-decorators">
    <svg className="header-hud-corner tl" viewBox="0 0 10 10"><path d="M2,0 L0,0 L0,2" fill="none" stroke="currentColor" strokeWidth="0.5" /></svg>
    <svg className="header-hud-corner tr" viewBox="0 0 10 10"><path d="M8,0 L10,0 L10,2" fill="none" stroke="currentColor" strokeWidth="0.5" /></svg>
    <svg className="header-hud-corner bl" viewBox="0 0 10 10"><path d="M2,10 L0,10 L0,8" fill="none" stroke="currentColor" strokeWidth="0.5" /></svg>
    <svg className="header-hud-corner br" viewBox="0 0 10 10"><path d="M8,10 L10,10 L10,8" fill="none" stroke="currentColor" strokeWidth="0.5" /></svg>
  </div>
);

function UserMenu({ user, isAdmin, logout }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        type="button" 
        onClick={() => setOpen(!open)}
        className="user-menu__trigger user-menu-shell"
      >
        <HUDDecorator />
        <div className="user-menu__avatar">
          {user?.email?.[0].toUpperCase() || "U"}
        </div>
        <div className="user-menu__info hidden md:flex">
          <span className="user-menu__name">{user?.email?.split('@')[0]}</span>
          <span className="user-menu__role">{isAdmin ? "SYSTEM_ADMIN" : "OPERATOR"}</span>
        </div>
        <ChevronDown size={10} className={`menu-chevron ${open ?"active" : ""}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="user-menu__dropdown-panel">
            <div className="dropdown-header">
              <span className="header-eyebrow">AUTH_SESSION_ACTIVE</span>
              <span className="header-email">{user?.email}</span>
            </div>
            <div className="dropdown-body">
              {isAdmin && (
                <Link to="/admin" className="dropdown-link group" onClick={() => setOpen(false)}>
                  <div className="link-icon"><ShieldCheck size={14} /></div>
                  <div className="link-text">Admin Control</div>
                </Link>
              )}
              <Link to="/app" className="dropdown-link group" onClick={() => setOpen(false)}>
                 <div className="link-icon"><LayoutDashboard size={14} /></div>
                <div className="link-text">Dashboard</div>
              </Link>
              <div className="dropdown-divider" />
              <button onClick={() => { logout(); setOpen(false); }} className="dropdown-link logout group">
                 <div className="link-icon"><LogOut size={14} /></div>
                <div className="link-text">Terminate Session</div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


export function SiteHeader() {
  const { locale } = useLocale();
  const { isAuthed, isAdmin, user, logout } = useAuth();

  return (
    <header className="site-header">
      <div className="header-scan-line" />
      <div className="site-header__container">
        {/* BRAND */}
        <Link to="/" className="site-header__brand group">
          <div className="brand-logo-hud">
            <PiLogo size={24} />
            <div className="hud-ring" />
          </div>
          <div className="brand-text-wrapper">
            <span className="brand-name">PI STORE</span>
            <span className="brand-tag">ECOSYSTEM_V2</span>
          </div>
        </Link>
        
        {/* NAVIGATION */}
        <nav className="site-header__nav">
          <NavLink to="/catalog" className="nav-link">
            <span className="nav-hex">01</span> {locale === "vi" ? "CỬA HÀNG" : "STORE"}
          </NavLink>
          <NavLink to="/pricing" className="nav-link">
            <span className="nav-hex">02</span> {locale === "vi" ? "BẢNG GIÁ" : "PRICING"}
          </NavLink>
          <NavLink to="/docs" className="nav-link">
            <span className="nav-hex">03</span> {locale === "vi" ? "TÀI LIỆU" : "DOCS"}
          </NavLink>    
        </nav>

        {/* ACTIONS */}
        <div className="site-header__actions">
          <div className="tools-bento-box">
            <HUDDecorator />
            <button className="tool-unit" aria-label="Search">
               <Search size={14} />
            </button>
            <div className="tool-divider" />
            <ThemeToggle className="tool-unit" />
            <div className="tool-divider" />
            <div className="tool-unit lang-wrapper">
              <LanguageToggle />
            </div>
          </div>

          <div className="site-header__auth">
            {isAuthed ? (
              <UserMenu user={user} isAdmin={isAdmin} logout={logout} />
            ) : (
              <NavLink to="/auth/login" className="hud-signin-btn">
                <div className="btn-glitch-layer" />
                <span className="btn-text">{locale === "vi" ? "ĐĂNG NHẬP" : "SIGN_IN"}</span>
                <ArrowRight size={12} className="btn-icon" />
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
