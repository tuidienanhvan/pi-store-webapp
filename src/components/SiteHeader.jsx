import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useLocale } from "../context/LocaleContext";
import { LanguageToggle } from "./LanguageToggle";
import { useAuth } from "../context/AuthContext";
import { IconButton, Button, ThemeToggle, Drawer, Icon } from "./ui";
import "./SiteHeader.css";

function UserMenu({ user, isAdmin, logout }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="user-menu">
      <button 
        type="button" 
        onClick={() => setOpen(!open)}
        className="user-menu__trigger"
        aria-label="User menu"
      >
        <div className="user-menu__avatar">
          {user?.email?.[0].toUpperCase() || "U"}
        </div>
        <Icon name="chevron-down" size={14} className="user-menu__chevron" />
      </button>

      {open && (
        <div className="user-menu__panel">
          <div className="user-menu__meta">
            <div className="user-menu__meta-label">Signed in as</div>
            <div className="user-menu__meta-email">{user?.email}</div>
          </div>
          <div className="stack" style={{ gap: "2px" }}>
            {isAdmin && <Button as={Link} to="/admin" variant="ghost" size="sm" style={{ justifyContent: "flex-start", width: "100%" }}>Admin panel</Button>}
            <Button as={Link} to="/app" variant="ghost" size="sm" style={{ justifyContent: "flex-start", width: "100%" }}>My Account</Button>
            <Button variant="danger" size="sm" onClick={() => { logout(); setOpen(false); }} style={{ justifyContent: "flex-start", width: "100%", marginTop: "4px" }}>Sign out</Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function SiteHeader() {
  const { dict, locale } = useLocale();
  const { isAuthed, isAdmin, user, logout } = useAuth();
  
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <header className="site-header site-header--shell glass">
      <div className="container">
        <div className="site-header__row site-header__row--shell animate-in">
          <Link to="/" className="site-header__brand row gap-2 no-underline text-inherit hover:opacity-80" aria-label="Pi Ecosystem">
            <img src="/logo-optimized.svg?v=20260417-1" alt="Pi Logo" width="28" height="28" />
            <span className="site-header__brand-text">Pi Ecosystem</span>
          </Link>
          
          <nav aria-label="Primary" className="site-header__nav row gap-6">
            <NavLink to="/pricing" className="text-14 font-medium hover:text-brand transition-colors no-underline">{dict.nav.pricing}</NavLink>
            <NavLink to="/docs" className="text-14 font-medium hover:text-brand transition-colors no-underline">{dict.nav.docs}</NavLink>    
            <NavLink to="/about" className="text-14 font-medium hover:text-brand transition-colors no-underline">{dict.nav.about}</NavLink>
          </nav>
          
          <div className="site-header__tools row gap-4">
            <div className="row gap-1">
              <IconButton icon="search" variant="ghost" label="Search" as={Link} to="/pricing" />
              <ThemeToggle />
              <LanguageToggle />
            </div>
            
            <div className="border-l border-hairline h-6 mx-1" />
            
            {isAuthed
              ? <UserMenu user={user} isAdmin={isAdmin} logout={logout} />
              : <Button as={Link} to="/login" variant="ghost" size="sm" className="font-bold text-brand">{dict.nav.signin}</Button>}
          </div>
          
          <IconButton 
            icon="menu" 
            className="site-header__burger" 
            label="Open Menu" 
            onClick={() => setMobileNavOpen(true)} 
          />
        </div>
      </div>

      <Drawer open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} side="left" title="Pi Ecosystem">
        <div className="stack" style={{ marginTop: "var(--s-4)" }}>
          <Button as={Link} to="/pricing" variant="ghost" style={{ justifyContent: "flex-start" }} onClick={() => setMobileNavOpen(false)}>Pricing</Button>
          <Button as={Link} to="/docs" variant="ghost" style={{ justifyContent: "flex-start" }} onClick={() => setMobileNavOpen(false)}>Docs</Button>
          <Button as={Link} to="/about" variant="ghost" style={{ justifyContent: "flex-start" }} onClick={() => setMobileNavOpen(false)}>About</Button>
          <hr />
          {!isAuthed && (
            <Button as={Link} to="/login" variant="primary" onClick={() => setMobileNavOpen(false)}>Sign in</Button>
          )}
        </div>
      </Drawer>
    </header>
  );
}
