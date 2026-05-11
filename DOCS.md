# PI Store Technical Documentation

WordPress plugin storefront for selling PI ecosystem products.

## Overview

- **Framework**: React + Vite
- **Styling**: Tailwind CSS v4
- **State**: Zustand
- **Routing**: React Router v7

---

## Project Structure

```
src/
├── components/           # UI components
│   ├── layout/           # Header, Footer, Grid
│   ├── product/          # Product cards, pricing
│   └── shared/           # Buttons, badges
├── pages/                # Route components
│   ├── Home.jsx          # Store homepage
│   ├── Product.jsx       # Single product page
│   ├── Cart.jsx          # Shopping cart
│   └── Checkout.jsx      # Payment flow
├── stores/               # Zustand stores
│   └── cart.js           # Cart state management
├── data/                 # Product catalog
└── utils/                # Helpers
```

---

## Products Catalog

Managed via `scripts/sync-catalog.mjs`

### Product Types
1. **Plugins** - pi-seo, pi-dashboard, pi-chatbot, pi-leads
2. **Themes** - pi-themes (future)
3. **Bundles** - pi-pro-starter (all plugins)

### Pricing Tiers
- **Free** - Basic features
- **Pro** - $49/year
- **Max** - $99/year  
- **Enterprise** - Custom pricing

---

## Features

### License Tiers & Features

| Free | Pro | Max | Enterprise |
|------|-----|-----|------------|
| Basic SEO | AI SEO Bot | Bulk AI Operations | Custom Limits |
| Sitemap | Schema Pro | API Access | White Label |
| 1 Site | Unlimited Sites | Multisite | Premium Support |

### Checkout Flow
1. Select product/tier
2. Enter license key (upgrade) or create new
3. Stripe payment
4. Instant activation
5. Download/install plugin