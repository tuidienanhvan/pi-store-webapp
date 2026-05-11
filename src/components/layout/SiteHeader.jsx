import React, { useState } from "react";

import { Link, NavLink } from "react-router-dom";

import { useLocale } from "@/context/LocaleContext";

import { LanguageToggle } from "../core/LanguageToggle";

import { useAuth } from "@/context/AuthContext";

import { IconButton, Button, ThemeToggle, Drawer, Icon } from "../ui";

import "./SiteHeader.css";



function UserMenu({ user, isAdmin, logout }) {

  const [open, setOpen] = useState(false);



  return (

    <div className="relative">

      <button 

        type="button" 

        onClick={() => setOpen(!open)}

        className="user-menu__trigger glass group"

      >

        <div className="user-menu__avatar group-hover:scale-110 transition-transform duration-500">

          {user?.email?.[0].toUpperCase() || "U"}

        </div>

        <div className="user-menu__info">

          <span className="user-menu__name">{user?.email?.split('@')[0]}</span>

          <span className="text-[9px] uppercase tracking-widest opacity-40 font-black">

            {isAdmin ? "Admin" : "Member"}

          </span>

        </div>

        <Icon 

          name="chevron-down" 

          size={12} 

          className={`opacity-40 transition-transform duration-500 ${open ? "rotate-180" : ""}`} 

        />

      </button>



      {open && (

        <>

          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          <div className="user-menu__panel glass-strong z-50">

            <div className="px-6 py-5 border-b border-base-border-subtle mb-1 bg-base-content/[0.02]">

              <div className="text-[9px] font-black uppercase tracking-[0.2em] text-primary mb-1.5">Authenticated Account</div>

              <div className="text-[13px] font-black text-base-content truncate tracking-tight">{user?.email}</div>

            </div>

            

            <div className="p-2 flex flex-col gap-1">

              {isAdmin && (

                <Link to="/admin" className="user-menu__item group/admin" onClick={() => setOpen(false)}>

                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center transition-all group-hover/admin:bg-primary group-hover/admin:text-primary-content group-hover/admin:scale-110 group-hover/admin:shadow-lg group-hover/admin:shadow-brand/20">

                    <Icon name="shield-check" size={18} />

                  </div>

                  <div className="flex flex-col">

                    <span className="text-[13px] font-black">Admin Panel</span>

                    <span className="text-[9px] uppercase tracking-wider opacity-40 font-bold">Manage Ecosystem</span>

                  </div>

                </Link>

              )}

              

              <Link to="/app" className="user-menu__item group/user" onClick={() => setOpen(false)}>

                <div className="w-9 h-9 rounded-xl bg-base-content/5 text-base-content/60 flex items-center justify-center transition-all group-hover/user:bg-primary/10 group-hover/user:text-primary group-hover/user:scale-110">

                  <Icon name="user-circle" size={18} />

                </div>

                <div className="flex flex-col">

                  <span className="text-[13px] font-black">My Dashboard</span>

                  <span className="text-[9px] uppercase tracking-wider opacity-40 font-bold">Profile & Usage</span>

                </div>

              </Link>



              <Link to="/app/billing" className="user-menu__item group/billing" onClick={() => setOpen(false)}>

                <div className="w-9 h-9 rounded-xl bg-base-content/5 text-base-content/60 flex items-center justify-center transition-all group-hover/billing:bg-primary/10 group-hover/billing:text-primary group-hover/billing:scale-110">

                  <Icon name="credit-card" size={18} />

                </div>

                <div className="flex flex-col">

                  <span className="text-[13px] font-black">Subscription</span>

                  <span className="text-[9px] uppercase tracking-wider opacity-40 font-bold">Billing & Invoices</span>

                </div>

              </Link>



              <div className="h-px bg-base-border-subtle my-2 mx-3 opacity-50" />



              <button 

                onClick={() => { logout(); setOpen(false); }} 

                className="user-menu__item text-danger hover:bg-danger/10 w-full text-left group/logout"

              >

                <div className="w-9 h-9 rounded-xl bg-danger/10 text-danger flex items-center justify-center transition-all group-hover/logout:scale-110">

                  <Icon name="log-out" size={18} />

                </div>

                <div className="flex flex-col">

                  <span className="text-[13px] font-black">Sign Out</span>

                  <span className="text-[9px] uppercase tracking-wider opacity-40 font-bold">Securely Logout</span>

                </div>

              </button>

            </div>

          </div>

        </>

      )}

    </div>

  );

}



import PiLogo from "@pi-ui/base/PiLogo";



export function SiteHeader() {

  const { dict } = useLocale();

  const { isAuthed, isAdmin, user, logout } = useAuth();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);



  return (

    <header className="site-header">

      <div className="mx-auto w-full max-w-[1400px] flex h-full items-center justify-between !px-10 lg:!px-16">

        {/* LEFT: BRAND */}

        <Link to="/" className="site-header__brand group" aria-label="Pi Ecosystem">

          <PiLogo size={32} />

          <span className="site-header__brand-text">PI STORE</span>

        </Link>

        

        {/* CENTER: NAV */}

        <nav className="site-header__nav">

          <NavLink to="/catalog" className="site-header__nav-link">{dict.nav.catalog}</NavLink>

          <NavLink to="/pricing" className="site-header__nav-link">{dict.nav.pricing}</NavLink>

          <NavLink to="/docs" className="site-header__nav-link">{dict.nav.docs}</NavLink>    

          <NavLink to="/about" className="site-header__nav-link">{dict.nav.about}</NavLink>

        </nav>

        

        {/* RIGHT: TOOLS */}

        <div className="site-header__tools">

          <Link to="/catalog" className="site-header__tool-btn" title="Search">

            <Icon name="search" size={18} />

          </Link>

          

          <ThemeToggle />

          <LanguageToggle />

          

          <div className="h-6 w-px bg-base-content/10 mx-2 hidden md:block" />

          

          {isAuthed ? (

            <UserMenu user={user} isAdmin={isAdmin} logout={logout} />

          ) : (

            <Link to="/login" className="text-sm font-black uppercase tracking-widest text-primary hover:brightness-110 px-4">

              {dict.nav.signin}

            </Link>

          )}



          <IconButton 

            icon="menu" 

            className="site-header__mobile-toggle md:hidden" 

            label="Open Menu" 

            onClick={() => setMobileNavOpen(true)} 

          />

        </div>

      </div>



      <Drawer open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} side="left" title="Pi Ecosystem">

        <div className="flex flex-col gap-2 p-4 mt-4">

          <Button as={Link} to="/catalog" variant="ghost" style={{ justifyContent: "flex-start" }} onClick={() => setMobileNavOpen(false)}>Catalog</Button>

          <Button as={Link} to="/pricing" variant="ghost" style={{ justifyContent: "flex-start" }} onClick={() => setMobileNavOpen(false)}>Pricing</Button>

          <Button as={Link} to="/docs" variant="ghost" style={{ justifyContent: "flex-start" }} onClick={() => setMobileNavOpen(false)}>Docs</Button>

          <hr className="opacity-10 my-2" />

          {!isAuthed && (

            <Button as={Link} to="/login" variant="primary" onClick={() => setMobileNavOpen(false)}>Sign in</Button>

          )}

        </div>

      </Drawer>

    </header>

  );

}

