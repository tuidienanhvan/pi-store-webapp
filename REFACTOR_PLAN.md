# Pi Store Webapp — Full Frontend Refactor Plan

**Target executor:** Gemini 3 Pro
**Scope:** All CSS + all JSX in `pi-store-webapp/src/`
**Do NOT touch:** Backend (`pi-backend/`), plugins-v2 PHP, data (`catalog.generated.json`), routing logic in `App.jsx`, business logic in hooks/context/lib, API shapes in `api-client.js`.

---

## 0. Context — why we're refactoring

Today the app has 34 pages + 13 components + 8 CSS files (~5,961 LOC). It works but looks inconsistent and unpolished because:

1. **Two brand colors competing.** `tokens.css` declares `--brand: #e11d48` (rose/red) but `pages-v2.css` declares `--v2-accent: #007d3d` (green). Homepage looks green, rest of app looks red.
2. **Two button systems** (`.btn / .btn--primary` vs `.hp-btn / .hp-btn--primary`) with different shapes, shadows, typography.
3. **Three radius scales** (10px / 20px / 0.875rem) used randomly.
4. **Zero `aria-*` attributes** across 50+ components. Emoji icons everywhere (🛒, 📊, 🔑) — not screen-reader accessible, can't style/size/color.
5. **Admin dark theme half-done** (`.dashboard--admin` hardcodes `#0f172a` / `#fff`); public pages have no dark mode at all.
6. **Hardcoded hex values** scattered across `components.css` (e.g. `#a05a00`, `#ff9900`).
7. **Mobile tables overflow** on admin pages; breakpoints incomplete.

**Reference from `CLAUDE.md` + user memory:** brand color = **#007d3d (green)**, NOT red. So the refactor *also* fixes a correctness bug: `--brand` should be green everywhere.

---

## 1. Goals

1. **One design system.** Single source of truth for color, spacing, radius, shadow, typography, motion.
2. **Modern SaaS aesthetic.** Think Linear / Vercel / Stripe — generous whitespace, small-tall interactive surfaces, 1px hairlines, subtle motion, crisp typography.
3. **Brand color = green `#007d3d`.** Kill the red entirely (including `--brand-strong: #be123c`).
4. **Dark mode first-class.** Toggle in header; persists via `localStorage`; public + dashboard + admin all work in both modes.
5. **Accessibility baseline.** Every interactive element has a visible focus ring, `aria-label` where needed, semantic HTML (nav / main / article / form).
6. **SVG icon system.** Replace every emoji in UI chrome with inline SVG from a single `Icon` component. Keep emojis only inside user-authored copy (headings, marketing).
7. **Responsive.** Works at 360 / 480 / 768 / 1024 / 1280 / 1440+. No horizontal scroll anywhere. Admin tables stack or scroll-lock on mobile.
8. **No regressions.** Every existing route/page renders; every form submits with the same data; no API contract changes.

## 1b. Non-goals

- Do **not** introduce a UI library (no MUI, Shadcn, Chakra, Radix). Vanilla CSS + small custom components only.
- Do **not** introduce TypeScript (project is `.jsx`).
- Do **not** introduce CSS-in-JS, CSS Modules, Tailwind, or preprocessors.
- Do **not** change routing, state management (Zustand), or auth flows.
- Do **not** refactor the backend or `data/catalog.generated.json`.
- Do **not** change Vietnamese copy tone — preserve existing wording; only restyle.

---

## 2. Visual direction (opinionated)

**Mood:** *"Minimal SaaS operator console — confident, quiet, fast."*

**Typography**
- Headings: **Lexend**, weight 600, tight tracking (-0.02em on h1/h2).
- Body: **Be Vietnam Pro**, weight 400/500, line-height 1.55.
- Code/mono: `ui-monospace, "SF Mono", Menlo, monospace`.
- Type scale (mobile → desktop, use `clamp`): 12 / 14 / 16 / 18 / 20 / 24 / 30 / 36 / 48 / 60.

**Color (both modes)**
- **One accent:** brand green. Do not introduce secondary accent colors. Use *semantic* variants for state (success/warning/danger/info).
- Neutrals are a 12-step gray ramp. Separate tokens for **background / surface / elevated / hairline / text-1 / text-2 / text-3 / overlay**.
- Light mode = warm cool-gray (off-white, not pure white).
- Dark mode = true dark (#0B0D0F background), not navy. Brand stays the same green.

**Shape & depth**
- Border radius scale: `4 / 6 / 8 / 12 / 16 / 999` (pill).
- Cards: 1px hairline + one soft shadow. No heavy drop shadows.
- Buttons: 6px radius (unless pill), 36/40/44px tall (sm/md/lg).

**Motion**
- 150ms ease-out on hover/focus transitions.
- Page transitions: none (React Router is enough).
- No scroll-jacking, no parallax.

**Imagery**
- Product cover stays PNG/SVG as shipped in `public/media/products/`.
- No new stock photography. Illustrations are geometric only (circles, arcs, gradients).

---

## 3. Design tokens — new `tokens.css`

Replace the **entire** existing `src/styles/tokens.css`. This becomes the single source for all color/spacing/type/shadow/radius/motion.

```css
/* ─── src/styles/tokens.css ──────────────────────────────── */
:root {
  /* Color — brand */
  --pi-green-50:  #e8f7ef;
  --pi-green-100: #c3ecd3;
  --pi-green-200: #8ed8ab;
  --pi-green-300: #4fbf82;
  --pi-green-400: #16a561;
  --pi-green-500: #007d3d;   /* ← brand */
  --pi-green-600: #006332;
  --pi-green-700: #004d27;
  --pi-green-800: #003a1e;
  --pi-green-900: #002512;

  /* Color — neutral ramp (light mode defaults) */
  --pi-gray-0:    #ffffff;
  --pi-gray-50:   #fafbfb;
  --pi-gray-100:  #f3f5f5;
  --pi-gray-200:  #e8ebec;
  --pi-gray-300:  #d4d8da;
  --pi-gray-400:  #a7adb1;
  --pi-gray-500:  #6c7379;
  --pi-gray-600:  #484d52;
  --pi-gray-700:  #2b3035;
  --pi-gray-800:  #181b1e;
  --pi-gray-900:  #0b0d0f;

  /* Semantic — light mode */
  --bg:           var(--pi-gray-50);
  --surface:      var(--pi-gray-0);
  --surface-2:    var(--pi-gray-100);
  --surface-3:    var(--pi-gray-200);
  --hairline:     rgba(11, 13, 15, 0.08);
  --hairline-strong: rgba(11, 13, 15, 0.14);
  --text-1:       var(--pi-gray-900);
  --text-2:       var(--pi-gray-600);
  --text-3:       var(--pi-gray-500);
  --text-onbrand: #ffffff;
  --overlay:      rgba(11, 13, 15, 0.55);

  --brand:        var(--pi-green-500);
  --brand-hover:  var(--pi-green-600);
  --brand-soft:   var(--pi-green-50);
  --on-brand:     #ffffff;

  --success: #16a34a;
  --warning: #d97706;
  --danger:  #dc2626;
  --info:    #0ea5e9;

  /* Spacing — 4px base grid */
  --s-0: 0;      --s-1: 4px;    --s-2: 8px;    --s-3: 12px;
  --s-4: 16px;   --s-5: 20px;   --s-6: 24px;   --s-8: 32px;
  --s-10: 40px;  --s-12: 48px;  --s-16: 64px;  --s-20: 80px;
  --s-24: 96px;  --s-32: 128px;

  /* Radius */
  --r-1: 4px;  --r-2: 6px;  --r-3: 8px;  --r-4: 12px;  --r-5: 16px;  --r-pill: 999px;

  /* Shadows — layered, neutral */
  --shadow-1: 0 1px 2px rgba(11, 13, 15, 0.04);
  --shadow-2: 0 2px 4px rgba(11, 13, 15, 0.06), 0 1px 2px rgba(11, 13, 15, 0.04);
  --shadow-3: 0 8px 24px rgba(11, 13, 15, 0.08), 0 2px 6px rgba(11, 13, 15, 0.04);
  --shadow-4: 0 24px 48px rgba(11, 13, 15, 0.12), 0 6px 12px rgba(11, 13, 15, 0.06);
  --ring:     0 0 0 3px rgba(0, 125, 61, 0.25);

  /* Typography */
  --font-ui:   "Lexend", ui-sans-serif, system-ui, sans-serif;
  --font-body: "Be Vietnam Pro", ui-sans-serif, system-ui, sans-serif;
  --font-mono: ui-monospace, "SF Mono", Menlo, monospace;

  --fs-12: 12px;  --fs-14: 14px;  --fs-16: 16px;  --fs-18: 18px;
  --fs-20: 20px;  --fs-24: 24px;  --fs-30: 30px;  --fs-36: 36px;
  --fs-48: clamp(36px, 5vw, 48px);
  --fs-60: clamp(44px, 7vw, 60px);

  --lh-tight: 1.15;  --lh-snug: 1.3;  --lh-normal: 1.55;  --lh-loose: 1.7;
  --tracking-tight: -0.02em;  --tracking-normal: 0;  --tracking-wide: 0.02em;

  /* Motion */
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --t-fast: 120ms var(--ease-out);
  --t-med:  200ms var(--ease-out);
  --t-slow: 320ms var(--ease-out);

  /* Layout */
  --container-sm: 640px;
  --container-md: 820px;
  --container-lg: 1080px;
  --container-xl: 1240px;
  --container-2xl: 1440px;
  --header-h: 64px;
}

/* Dark mode — applied on <html data-theme="dark"> */
html[data-theme="dark"] {
  --bg:        #0b0d0f;
  --surface:   #121418;
  --surface-2: #181b1e;
  --surface-3: #22262a;
  --hairline:  rgba(255, 255, 255, 0.08);
  --hairline-strong: rgba(255, 255, 255, 0.16);
  --text-1:    #f4f6f7;
  --text-2:    #b9bfc4;
  --text-3:    #8a9096;
  --overlay:   rgba(0, 0, 0, 0.7);
  --brand-soft: rgba(0, 125, 61, 0.14);

  --shadow-1: 0 1px 2px rgba(0, 0, 0, 0.4);
  --shadow-2: 0 2px 4px rgba(0, 0, 0, 0.5), 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-3: 0 8px 24px rgba(0, 0, 0, 0.55), 0 2px 6px rgba(0, 0, 0, 0.3);
  --shadow-4: 0 24px 48px rgba(0, 0, 0, 0.7), 0 6px 12px rgba(0, 0, 0, 0.4);
  --ring:     0 0 0 3px rgba(22, 165, 97, 0.35);
}

/* Respect OS pref if user hasn't chosen */
@media (prefers-color-scheme: dark) {
  html:not([data-theme]) { color-scheme: dark; }
  html:not([data-theme]) { /* copy of dark-mode overrides above */ }
}
```

**Rule:** every color/shadow/radius in downstream CSS MUST reference a token. Hardcoded hex / rgb / px values for these properties are a bug.

---

## 4. New CSS architecture

Delete the current 8-file jumble, replace with **7 files** under `src/styles/`:

| File | Role | Target LOC |
|---|---|---|
| `tokens.css` | Variables only — light + dark. | ~140 |
| `reset.css` | Modern reset (Josh Comeau-style) + box-sizing + focus-visible + html scroll. | ~60 |
| `base.css` | Element defaults (body, a, h1–h6, p, img, form). Utility classes (`.sr-only`, `.container`, `.stack`, `.row`). | ~180 |
| `primitives.css` | Reusable primitives: `.btn`, `.card`, `.input`, `.select`, `.textarea`, `.checkbox`, `.switch`, `.badge`, `.tag`, `.alert`, `.modal`, `.tooltip`, `.table`, `.avatar`, `.spinner`. All with variants (`--sm`, `--md`, `--lg`, `--primary`, `--ghost`, `--danger`). | ~550 |
| `layout.css` | App shell, header, footer, dashboard sidebar, page grid, responsive breakpoints. | ~220 |
| `pages.css` | Page-specific overrides ONLY when primitives aren't enough. | ~250 |
| `print.css` | Minimal print styles for invoices. | ~30 |

**Totals:** ~1,430 LOC CSS (down from 2,582, **~45% reduction**).

**Import order** (in `src/styles/index.css`):
```css
@import "./tokens.css";
@import "./reset.css";
@import "./base.css";
@import "./primitives.css";
@import "./layout.css";
@import "./pages.css";
@import "./print.css";
```

**Delete these files:** `components.css`, `dashboard.css`, `pages-v2.css`. Their rules migrate to `primitives.css` + `layout.css` + `pages.css`.

---

## 5. Component/primitive system

### 5.1. Build one shared UI folder: `src/components/ui/`

Create these as tiny functional React components. Each one is **one file, under 80 LOC**, no external deps.

| File | Props | Notes |
|---|---|---|
| `Button.jsx` | `variant` (`primary \| ghost \| danger \| link`), `size` (`sm \| md \| lg`), `as` (`button \| a \| Link`), standard button/anchor props | Forwards ref. Handles `disabled` + `loading` states (shows spinner). |
| `IconButton.jsx` | `icon` (string name), `label` (required for a11y), `variant`, `size` | Wraps Button with square geometry + hidden text. |
| `Card.jsx` | `as` (default `article`), children, `padded` | Elevated surface with hairline + shadow-2. |
| `Input.jsx` / `Textarea.jsx` / `Select.jsx` | Standard + `label`, `hint`, `error`, `leadingIcon` | All support invalid state + focus ring. |
| `Checkbox.jsx` / `Switch.jsx` | Standard checkbox props + `label` | Visually styled; keyboard accessible. |
| `Badge.jsx` | `tone` (`neutral \| brand \| success \| warning \| danger \| info`), `size` | Used for status, tier. |
| `Alert.jsx` | `tone`, `title`, `children`, `onDismiss?` | For success/error banners. |
| `Modal.jsx` | `open`, `onClose`, `title`, children, `size` (`sm \| md \| lg`) | Portal via `createPortal` into `#modal-root` div added in `index.html`. Focus trap, Esc to close, click-outside. |
| `Table.jsx` | Thin wrapper on `<table>` with sticky header + zebra option. | Scroll-locked container with `overflow-x: auto` on mobile. |
| `Tabs.jsx` | `items: {id, label, content}[]`, controlled | Accessible tab pattern. |
| `Drawer.jsx` | `open`, `onClose`, `side` (`left \| right`) | Used for CartDrawer + mobile nav. |
| `Skeleton.jsx` | `width`, `height`, `variant` (`text \| rect \| circle`) | Loading states. |
| `EmptyState.jsx` | `icon`, `title`, `description`, `action?` | Reuse in tables/lists with no data. |
| `ThemeToggle.jsx` | none | Reads/writes `html[data-theme]` + `localStorage.pi_theme`; 3 states: system/light/dark. |
| `Icon.jsx` | `name`, `size` (default 16), `title?` | Renders one of N inline SVG icons. |

### 5.2. Icon set

Create `src/components/ui/icons.jsx`. Export a single `Icon` component backed by an object map of path data. Include these glyphs (all stroke-based, 24×24 viewBox, 1.75 stroke):

`check, x, chevron-down, chevron-right, arrow-right, menu, search, cart, user, settings, dashboard, key, download, bell, plus, minus, edit, trash, eye, eye-off, external-link, copy, info, warning, success, danger, sun, moon, monitor, home, grid, layers, zap, shield, bolt, spark, wallet, credit-card, file-text, book, headset, logout, loader`

Implementation pattern (don't use icon libraries):
```jsx
const PATHS = { check: "M20 6 9 17l-5-5", x: "M18 6 6 18M6 6l12 12", /* ... */ };
export function Icon({ name, size = 16, title, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"
         strokeLinejoin="round" role={title ? "img" : "presentation"}
         aria-label={title} {...rest}>
      <path d={PATHS[name]} />
    </svg>
  );
}
```

**Rule:** every emoji in UI chrome (headers, nav, buttons, badges, stat cards, table headers, empty states) becomes `<Icon name="..." />`. Emojis remain only in user-facing prose / marketing copy (H1 eyebrows are OK).

### 5.3. Retire old patterns

- Every `className="btn btn--primary"` → `<Button variant="primary">`.
- Every `className="stat-card"` → `<Card>` with new markup.
- Every inline `<label><input /></label>` → `<Input label="…" />`.
- Modal-backdrop/modal/modal__header → `<Modal>`.

Keep wrappers backwards-compatible if the class names are used in many places (e.g. `.btn` can still be a valid fallback class emitted by `<Button>`).

---

## 6. Layout shells

### 6.1. Public shell (`SiteHeader`, `SiteFooter`, `CartDrawer`)

Replace `SiteHeader.jsx` entirely. New structure:

```
<header class="site-header">
  <div class="container site-header__row">
    <Link to="/" class="site-header__brand">
      <LogoMark /> <span>Pi Ecosystem</span>
    </Link>
    <nav aria-label="Primary" class="site-header__nav">
      <NavLink>Catalog</NavLink> <NavLink>Pricing</NavLink>
      <NavLink>Docs</NavLink>    <NavLink>About</NavLink>
    </nav>
    <div class="site-header__tools">
      <SearchButton />      // opens command palette later (v2: placeholder)
      <ThemeToggle />
      <LanguageToggle />
      <IconButton icon="cart" onClick={openCart} aria-label="Cart (3)" />
      {user
        ? <UserMenu user={user} />
        : <Button as={Link} to="/login" variant="ghost" size="sm">Sign in</Button>}
    </div>
    <IconButton icon="menu" className="site-header__burger" aria-label="Menu" onClick={openMobileNav} />
  </div>
</header>
```

- Sticky at top; shadow-1 when page is scrolled (`data-scrolled="true"` on `<html>` via JS).
- Mobile: hamburger opens `<Drawer side="left">` with nav + tools.
- Remove the "promo bar" entirely (current top promo strip is visual noise).

`SiteFooter`: three columns (Product, Company, Legal) + bottom row (copyright + social icons). All items come from a `FOOTER_LINKS` const in the component file.

`CartDrawer`: reuse `<Drawer side="right">`. Keep business logic (Zustand store) unchanged; only restyle.

### 6.2. Dashboard shell (`DashboardLayout`)

Rewrite around a two-column CSS Grid: `grid-template-columns: 264px 1fr`. At ≤1024px collapse to one column with a top bar + mobile drawer.

```
<div class="dash" data-variant="user|admin">
  <aside class="dash__sidebar">
    <div class="dash__brand"> Pi · <span>My Account</span> </div>
    <nav class="dash__nav">
      <NavLink><Icon name="dashboard"/>Tổng quan</NavLink>
      ...
    </nav>
    <div class="dash__user">
      <Avatar /> <div class="dash__user-info">...</div>
      <IconButton icon="logout" label="Đăng xuất" onClick={logout} />
    </div>
  </aside>
  <main class="dash__main">
    <header class="dash__topbar">
      <IconButton icon="menu" className="dash__burger" label="Menu" />
      <div class="dash__crumbs">...</div>
      <div class="dash__topbar-tools">
        <ThemeToggle /><NotificationBell /><UserMenu />
      </div>
    </header>
    <div class="dash__content"><Outlet /></div>
  </main>
</div>
```

**Mock-mode banner** stays but restyled as `<Alert tone="warning">` pinned to top of `.dash__content`.

Admin variant: sidebar gets a subtle tinted background (`--surface-2`), brand dot, and navigation icons are slightly denser. **Do not** make admin dark-forced anymore — admin inherits `data-theme` like everything else.

---

## 7. Page-by-page spec

For each page, apply these universal rules first:

1. Wrap page content in `<div class="page">` with sensible `max-width`.
2. Page header pattern: `<header class="page__header"><h1>…</h1><p class="page__lede">…</p></header>`.
3. Sections: `<section class="section">` with a `<header class="section__header">` that contains `<h2>` + optional action button on the right.
4. Replace ad-hoc grid CSS with `.grid --cols-2` / `--cols-3` / `--cols-auto` utility classes in `base.css`.
5. Replace every custom form with `<Input>` / `<Textarea>` / `<Select>` / `<Checkbox>` primitives.
6. Buttons: `<Button variant="primary|ghost|danger" size="sm|md|lg">`.
7. Tables: wrap in `<Table>` primitive; add `<EmptyState>` when no rows.
8. Add `<SeoMeta>` `title` + `description` to every page (currently missing on some).

### Public pages

- **HomePage** — rebuild hero with **one** H1, one sub, two CTAs (primary + ghost). Remove the right-side "Pi AI Cloud card" — merge into a proper `Featured product` card below the hero. Three sections after: "Why Pi" (3 benefits + icons), "Featured products" (3-card grid), "Pricing preview" (links to /pricing), final CTA.
- **CatalogPage** — clean up `HeroSection` to a single banner row (icon + headline + 1 sub). `FilterBar` becomes a sticky toolbar: search input (lg), tab group (All/Tokens/Bundles/Plugin lẻ), `BillingCycleToggle` on the right. Grid = 1 col (mobile) / 2 col (tablet) / 3 col (desktop). Empty state when no results.
- **ProductDetailPage** — two-column layout: left (media + description + features + FAQ accordion), right (sticky `PurchaseCard` with price, cycle toggle, quantity, primary CTA, trust hints). Use `<Tabs>` for Features/How it works/FAQ.
- **PricingPage** — redesign token packs as a horizontal scroll / grid of 4 cards with one "Most popular" (badge). Comparison table underneath with `<Table>` primitive.
- **AboutPage** / **FaqPage** / **DocsPage** / **ContactPage** — use the generic `.page` + `.section` layout. ContactPage uses `<Input>` + `<Textarea>` primitives; submit button full-width on mobile.
- **NotFoundPage** — big 404, one-line explanation, `<Button>` back to home.

### Auth pages

- **LoginPage** / **SignupPage** — center a single `<Card size="sm">` (400px wide) on a minimal shell (logo top-left, nothing else). Inputs + primary button full-width in card. Mock-mode banner as `<Alert tone="warning">` above the card. Add a right-side "marketing panel" at ≥1024px (50/50 split) showing a quote or value prop — removes the "empty-feeling" auth pages.

### User dashboard (`/app/*`)

- **UserOverviewPage** — 4 stat cards in a row (wallet balance, active licenses, tokens spent 30d, next invoice) + "Quick actions" row (Top up tokens, Download plugins, View invoices) + "Recent activity" table (last 5 ledger entries).
- **WalletPage** — big balance card at top with primary "Top up" button; pack selector grid below; recent top-ups list.
- **LedgerPage** / **LicensesPage** / **DownloadsPage** / **BillingPage** / **ApiKeysPage** / **SupportPage** — standardize on `<Table>` for listing + `<Modal>` for create/edit + `<EmptyState>` for empty.
- **ProfilePage** — two-column form: "Thông tin cá nhân" left, "Đổi mật khẩu" right.

### Admin (`/admin/*`)

- **AdminOverviewPage** — 6 stat cards (revenue 30d, active licenses, tokens spent, healthy providers, down providers, new users) + bar chart placeholder + "Top plugins" list.
- **AdminLicensesPage** / **AdminUsersPage** — standard table page: search + filters (tier/status) + `<Table>` + pagination. Create/edit via `<Modal>`.
- **AdminProvidersPage** — keep current functionality (we just rebuilt it). Migrate markup to primitives: summary `<Card>` grid on top, `<Table>` for list, `<Modal>` for edit/create, inline test badges become `<Badge>`. Preserve API key masking UX.
- **AdminUsagePage** / **AdminRevenuePage** — stat cards + `<Table>` by plugin/product. Simple CSS bar charts built with inline divs (no chart lib).
- **AdminReleasesPage** — list of releases in `<Table>`; upload via `<Modal>` with `<Input type="file">`. Show SHA256 truncated with copy icon.
- **AdminSettingsPage** — three `<Card>` sections (Branding, Token Packs, Feature Flags) with inline edit + Save per card; Security read-only as definition list.
- **AdminAuditLogPage** — `<Table>` with action / actor / target / timestamp columns. `<EmptyState>` shown because backend endpoint doesn't exist yet.

---

## 8. File-by-file execution plan (ordered)

### Phase 1 — Foundation (≈4h)

| Action | File |
|---|---|
| Replace | `src/styles/tokens.css` (new content in §3) |
| Create | `src/styles/reset.css` |
| Replace | `src/styles/base.css` |
| Create | `src/styles/primitives.css` |
| Replace | `src/styles/layout.css` |
| Create | `src/styles/pages.css` |
| Create | `src/styles/print.css` |
| Replace | `src/styles/index.css` (new import order in §4) |
| Delete | `src/styles/components.css` |
| Delete | `src/styles/dashboard.css` |
| Delete | `src/styles/pages-v2.css` |
| Verify | `npm run dev` — app should render even though pages look broken (expected). |

### Phase 2 — UI primitives (≈5h)

Create every file under `src/components/ui/`:

```
src/components/ui/
  Button.jsx        IconButton.jsx     Icon.jsx         icons.jsx
  Card.jsx          Input.jsx          Textarea.jsx     Select.jsx
  Checkbox.jsx      Switch.jsx         Badge.jsx        Alert.jsx
  Modal.jsx         Table.jsx          Tabs.jsx         Drawer.jsx
  Skeleton.jsx      EmptyState.jsx     ThemeToggle.jsx  Avatar.jsx
  Spinner.jsx       index.js           (barrel export)
```

Add to `index.html` before `</body>`:
```html
<div id="modal-root"></div>
<div id="drawer-root"></div>
```

### Phase 3 — Shells (≈3h)

- Rewrite `src/components/SiteHeader.jsx` per §6.1.
- Rewrite `src/components/SiteFooter.jsx`.
- Rewrite `src/components/CartDrawer.jsx` to use `<Drawer>`.
- Rewrite `src/components/layout/DashboardLayout.jsx` per §6.2.
- Confirm `src/pages/user/UserLayout.jsx` + `src/pages/admin/AdminLayout.jsx` still compose correctly (they just pass `variant` + `nav`).

### Phase 4 — Public pages (≈4h)

Order: HomePage → CatalogPage → ProductDetailPage → PricingPage → AboutPage → FaqPage → DocsPage → ContactPage → NotFoundPage.

For each: replace markup with primitives, ensure page uses `.page` + `.section` pattern, remove inline styles, add `<SeoMeta>` if missing.

### Phase 5 — Auth pages (≈1.5h)

LoginPage, SignupPage — new split-card layout.

### Phase 6 — User dashboard (≈3h)

UserOverviewPage, WalletPage, LedgerPage, LicensesPage, DownloadsPage, BillingPage, ProfilePage, ApiKeysPage, SupportPage.

### Phase 7 — Admin dashboard (≈4h)

AdminOverviewPage, AdminLicensesPage, AdminUsersPage, AdminProvidersPage, AdminReleasesPage, AdminRevenuePage, AdminUsagePage, AdminSettingsPage, AdminAuditLogPage.

### Phase 8 — Polish & QA (≈2h)

- Add `data-scrolled` on `<html>` via small `useScrollClass` hook.
- Add `ThemeToggle` persistence in `main.jsx` (read `localStorage.pi_theme` before hydrate to avoid flash).
- Run through every route once in Chrome DevTools mobile (360 / 768 / 1024 / 1440).
- Keyboard-only pass: tab through header, catalog, modals, forms — every focusable item shows ring.
- Run Lighthouse on HomePage + a dashboard page; target ≥95 accessibility.

**Total estimated LOC delta:** +3,400 (primitives + icons) / −2,900 (old CSS + markup cleanup) → net ~+500 LOC but much better structured.

---

## 9. Verification checklist (run at end of each phase)

- [ ] `npm run dev` starts with zero console errors/warnings.
- [ ] Every route in `App.jsx` renders without blank screens.
- [ ] Login + Signup still hit the backend (`VITE_MOCK_AUTH=0`).
- [ ] Cart add/remove still works (Zustand store untouched).
- [ ] Catalog filters + bucket view match previous behavior.
- [ ] Admin providers: edit/create/delete/test all still work.
- [ ] Admin settings: save branding/packs/flags round-trip works.
- [ ] Light ↔ dark toggle works on every page; no unreadable text.
- [ ] Mobile (360px) on HomePage, CatalogPage, /admin/providers has no horizontal scroll.
- [ ] All interactive elements show a `--ring` focus state on keyboard tab.
- [ ] Grep the codebase for `emoji` glyphs — none should remain in JSX chrome (header, buttons, badges, table headers). Emojis allowed only inside `<h1>`/`<h2>`/user text.
- [ ] Grep for hardcoded `#` hex literals inside `src/**/*.css` (except `tokens.css`) — none should remain.
- [ ] `aria-label` present on every `IconButton` and every form input has `label` prop.

---

## 10. Risks & mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Phased rollout shows "broken" app between phases | User panic | Each phase commits a working build; Phase 1 keeps old markup styled ugly but functional; use feature-branch not main |
| Dark-mode flash on load | Ugly | In `main.jsx`, read `localStorage.pi_theme` **before** `createRoot`; set `html[data-theme]` synchronously |
| Cart/Auth/Zustand regression | Data loss | Do NOT touch `src/store/*`, `src/context/*`, `src/lib/*`, `src/hooks/*`. Only restyle consumers. |
| Route path drift | Broken deep links | Do NOT modify `App.jsx` routes; only wrap/rewrite the components they render |
| Vietnamese copy changed accidentally | Brand voice drift | Preserve all VN strings verbatim; refactor is visual only. If a string is cut for space, move it to a tooltip or detail section, don't delete. |
| Lead form backend shape drift | Broken form submissions | `src/lib/lead-api.js` untouched; keep field `name` attributes identical |
| Catalog JSON shape drift | Broken product pages | Do NOT change `data/catalog.generated.json` nor `lib/catalog.js` — only read |
| Icon choices "off-brand" | User dislikes | Icon set is stroke 1.75 Lucide-style; if user wants filled or Heroicons, it's one-line swap in `icons.jsx` |

---

## 11. Out of scope (do NOT do in this refactor)

- Adding a chart library (Recharts, etc.) — keep inline CSS bar charts.
- Adding i18n beyond the existing vi/en toggle (no new strings).
- Stripe/payment UI — just keep existing "top up" buttons pointing to existing endpoints.
- Implementing the backend for AdminAuditLog — page remains EmptyState.
- Rewriting Zustand store, AuthContext, LocaleContext, api-client.
- TypeScript migration.
- Replacing React Router v7 or Vite 8.
- Changing `public/media/products/*` images.
- Building a Storybook.
- SEO schema expansion beyond what `SeoMeta` already provides.

---

## 12. Deliverable format

Gemini should produce changes as a single branch with multiple commits, one per phase. At the end:

1. PR description lists every file added / replaced / deleted.
2. Screenshots: Home, Catalog, ProductDetail, Login, UserOverview, AdminProviders, AdminSettings — both light and dark.
3. `REFACTOR_NOTES.md` committed at repo root summarizing what was done, any deviations from this plan, and known follow-ups.

---

**End of plan. Target execution time: ~22 hours of focused work. Execute Phase 1 first; STOP and confirm build passes before Phase 2.**
