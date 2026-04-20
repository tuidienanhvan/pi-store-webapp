# Pi Store Webapp v2

Three-in-one React app serving three distinct zones:

```
/                  Public storefront (catalog, product detail, lead form)
/app/*             User dashboard (wallet, ledger, license, billing)
/admin/*           Admin dashboard (overview, licenses, users, providers, usage, revenue, releases)
```

Stack: Vite + React 18 + React Router 6. State: Zustand cart + Context auth.

---

## Directory structure

```
src/
├── App.jsx                      Router with 3 route groups (public/user/admin)
├── main.jsx                     Vite entrypoint - includes dashboard.css
│
├── components/
│   ├── layout/
│   │   ├── DashboardLayout.jsx  Shared sidebar layout for /app + /admin
│   │   └── RequireAuth.jsx      Auth guard (admin=true option)
│   ├── SiteHeader.jsx           Public storefront header (existing)
│   ├── CartDrawer.jsx           Shopping cart (existing)
│   └── ... (existing components)
│
├── pages/
│   ├── CatalogPage.jsx          Public - existing
│   ├── ProductDetailPage.jsx    Public - existing
│   ├── NotFoundPage.jsx         Public 404
│   ├── auth/
│   │   ├── LoginPage.jsx
│   │   └── SignupPage.jsx
│   ├── user/                    /app/* - customer dashboard
│   │   ├── UserLayout.jsx
│   │   ├── UserOverviewPage.jsx
│   │   ├── WalletPage.jsx
│   │   ├── LedgerPage.jsx
│   │   ├── LicensesPage.jsx
│   │   ├── BillingPage.jsx
│   │   └── ProfilePage.jsx
│   └── admin/                   /admin/* - Pi team dashboard
│       ├── AdminLayout.jsx
│       ├── AdminOverviewPage.jsx
│       ├── AdminLicensesPage.jsx
│       ├── AdminUsersPage.jsx
│       ├── AdminProvidersPage.jsx
│       ├── AdminUsagePage.jsx
│       ├── AdminRevenuePage.jsx
│       └── AdminReleasesPage.jsx
│
├── context/
│   ├── AuthContext.jsx          JWT storage + user state + login/logout
│   └── LocaleContext.jsx        VI/EN i18n (existing)
│
├── lib/
│   ├── api-client.js            PiBackend SDK
│   ├── catalog.js               Product catalog helpers (existing)
│   └── lead-api.js              n8n lead proxy (existing)
│
└── styles/
    ├── index.css                Public storefront styles (existing)
    └── dashboard.css            NEW - dashboard UI styles
```

---

## Route map

### Public (no auth)
- `/` - Catalog
- `/product/:slug` - Product detail + lead form
- `/login`, `/signup` - Auth

### User (requires auth)
- `/app` - Overview (wallet + tier + sites + usage)
- `/app/wallet` - Balance + top-up packs (Stripe Checkout)
- `/app/ledger` - Immutable transaction history
- `/app/licenses` - License stats + key
- `/app/billing` - Invoices (Phase 2)
- `/app/profile` - Name/email/password

### Admin (requires admin JWT)
- `/admin` - System overview (revenue 30d, margin, usage, health)
- `/admin/licenses` - CRUD + search + filter + revoke
- `/admin/users` - Customer list
- `/admin/providers` - AI providers routing table + health + toggle
- `/admin/usage` - Usage analytics by plugin + tokens spent + upstream cost
- `/admin/revenue` - Revenue + margin breakdown
- `/admin/releases` - Plugin release manager (upload ZIP + changelog)

---

## Environment variables

Copy `.env.example` to `.env`:

```
VITE_PI_API_URL=http://localhost:8000     # pi-backend URL (local or Railway)
VITE_LEAD_API_URL=/api/lead               # existing n8n proxy
```

---

## Running locally

```bash
cd pi-store-webapp
npm install
npm run dev
```

Then: http://127.0.0.1:5173.

Admin/user routes also need pi-backend running on :8000. See `wp-content/pi-backend/docs/QUICKSTART.md`.

---

## Admin auth flow (Phase 3 backend)

Dashboard pages are built, but `/v1/admin/*` endpoints in pi-backend are scaffolded (not fully implemented). When done:

```
1. Admin visits /login
2. Backend verifies email/password -> JWT with is_admin=true
3. Frontend stores JWT in localStorage.pi_jwt + localStorage.pi_admin=1
4. RequireAuth admin=true gates /admin/*
5. Every API call sends Authorization: Bearer <jwt>
6. Backend decodes JWT + checks is_admin on /v1/admin/* routes
```

TODO backend (Phase 3):
- POST /v1/auth/{login, signup, me}
- GET  /v1/admin/overview
- GET  /v1/admin/licenses + POST /licenses + PATCH /licenses/:id + POST /:id/revoke
- GET  /v1/admin/users
- GET  /v1/admin/providers + PATCH /providers/:id
- GET  /v1/admin/usage
- GET  /v1/admin/revenue
- GET  /v1/admin/releases + POST /releases (multipart)

---

## Theming

Uses CSS custom properties. Dark mode via `.dark` class on `<html>`.

Main palette in `src/styles/dashboard.css`:
```
--dash-accent:  #007d3d   (Pi brand green)
--dash-border, --dash-bg, --dash-text-1/2/3
```

Admin sidebar has darker gradient so admin feels distinct from user UI.

---

## Existing public storefront

Catalog + product detail pages untouched. `PublicShell` in App.jsx wraps them with `SiteHeader` + `CartDrawer`. `scripts/sync-catalog.mjs` still generates `src/data/catalog.generated.json` from WP plugins.

Auth/user/admin routes don't include those components - cleaner SaaS feel.
