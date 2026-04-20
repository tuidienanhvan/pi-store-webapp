import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useLocale } from "../context/LocaleContext";
import { LanguageToggle } from "./LanguageToggle";
import { useCartStore } from "../store/useCartStore";
import { useAuth } from "../context/AuthContext";
import { IconButton, Button, ThemeToggle, Drawer, Icon } from "./ui";

function UserMenu({ user, isAdmin, logout }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <button 
        type="button" 
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "var(--surface-2)",
          border: "1px solid var(--hairline)",
          padding: "4px 8px 4px 4px",
          borderRadius: "var(--r-pill)",
          cursor: "pointer"
        }}
        aria-label="User menu"
      >
        <div style={{
          width: 24, height: 24, borderRadius: "50%", background: "var(--brand)", color: "white", 
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "bold"
        }}>
          {user?.email?.[0].toUpperCase() || "U"}
        </div>
        <Icon name="chevron-down" size={14} style={{ color: "var(--text-3)" }} />
      </button>

      {open && (
        <div style={{
          position: "absolute",
          top: "100%",
          right: 0,
          marginTop: "4px",
          background: "var(--surface)",
          border: "1px solid var(--hairline)",
          borderRadius: "var(--r-3)",
          boxShadow: "var(--shadow-3)",
          padding: "var(--s-2)",
          minWidth: "160px",
          zIndex: "var(--z-elevated)"
        }}>
          <div style={{ padding: "var(--s-2) var(--s-3)", borderBottom: "1px solid var(--hairline)", marginBottom: "var(--s-2)" }}>
            <div style={{ fontSize: "var(--fs-12)", color: "var(--text-2)" }}>Signed in as</div>
            <div style={{ fontSize: "var(--fs-14)", fontWeight: "500", color: "var(--text-1)", textOverflow: "ellipsis", overflow: "hidden" }}>{user?.email}</div>
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
  const { items, openCart } = useCartStore();
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const { isAuthed, isAdmin, user, logout } = useAuth();
  
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <header className="site-header glass" style={{ 
      position: "sticky", 
      top: 0, 
      zIndex: "var(--z-header)", 
      borderBottom: "1px solid var(--glass-border)",
      backdropFilter: "blur(12px)",
      background: "var(--glass-bg)"
    }}>
      <div className="container">
        <div className="site-header__row animate-in" style={{ 
          height: "var(--header-h)", 
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <Link to="/" className="site-header__brand row gap-2 no-underline text-inherit hover:opacity-80" aria-label="Pi Ecosystem">
            <img src="/logo-optimized.svg?v=20260417-1" alt="Pi Logo" width="28" height="28" />
            <span style={{ fontWeight: 700, fontSize: "var(--fs-20)", letterSpacing: "-0.5px" }}>Pi Ecosystem</span>
          </Link>
          
          <nav aria-label="Primary" className="site-header__nav row gap-6">
            <NavLink to="/catalog" className="text-14 font-medium hover:text-brand transition-colors no-underline">{dict.nav.catalog}</NavLink> 
            <NavLink to="/pricing" className="text-14 font-medium hover:text-brand transition-colors no-underline">{dict.nav.pricing}</NavLink>
            <NavLink to="/docs" className="text-14 font-medium hover:text-brand transition-colors no-underline">{dict.nav.docs}</NavLink>    
            <NavLink to="/about" className="text-14 font-medium hover:text-brand transition-colors no-underline">{dict.nav.about}</NavLink>
          </nav>
          
          <div className="site-header__tools row gap-4">
            <div className="row gap-1">
              <IconButton icon="search" variant="ghost" label="Search" as={Link} to="/catalog" />
              <ThemeToggle />
              <LanguageToggle />
            </div>
            
            <div style={{ position: "relative" }}>
              <IconButton icon="cart" onClick={openCart} label={`${dict.nav.cart} (${cartItemCount})`} />
              {cartItemCount > 0 && (
                <span style={{
                  position: "absolute", top: -4, right: -4, background: "var(--brand)", color: "white",
                  fontSize: "10px", fontWeight: "bold", width: 18, height: 18, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid white"
                }}>
                  {cartItemCount}
                </span>
              )}
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
          <Button as={Link} to="/catalog" variant="ghost" style={{ justifyContent: "flex-start" }} onClick={() => setMobileNavOpen(false)}>Catalog</Button>
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
