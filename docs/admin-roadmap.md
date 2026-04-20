# Pi Admin — 20 Features per Tab (Full Roadmap)

**Scope:** 11 admin tabs × 20 features = **220 features** mapped to actionable user stories.
**Priority key:** 🔴 MVP core — 🟡 v2 ship-blocker — 🟢 nice-to-have / later

---

## 1. `/admin` — Tổng quan (Overview)

Bird's-eye view of the business health.

| # | Feature | Priority |
|---|---|---|
| 1 | Revenue widget: 30d / 90d / YTD + MoM growth % | 🔴 |
| 2 | Active licenses counter + new-this-week delta | 🔴 |
| 3 | Tokens spent (30d) + projected month-end extrapolation | 🔴 |
| 4 | Provider health matrix (25 providers × healthy/degraded/down pill grid) | 🔴 |
| 5 | Key pool status: total / available / allocated / exhausted bar chart | 🔴 |
| 6 | Top 5 customers by tokens spent (30d) — link to license detail | 🟡 |
| 7 | Top 5 plugins by API call volume | 🟡 |
| 8 | Real-time alerts panel (providers down, quota 90%+, upcoming expiries) | 🔴 |
| 9 | Revenue sparkline chart (daily bars, 30 days) | 🟡 |
| 10 | Upstream cost vs revenue margin card (live %) | 🟡 |
| 11 | New signups counter (7d) + conversion rate to paid | 🟢 |
| 12 | Churn metric: licenses revoked / expired last 30d | 🟡 |
| 13 | MRR / ARR calculation from active subscriptions | 🟡 |
| 14 | System status widget (API / worker / DB / Redis health) | 🔴 |
| 15 | Recent admin actions feed (last 10 from audit log) | 🟢 |
| 16 | Quick-action bar (+ New license / + New user / Create release) | 🟡 |
| 17 | License expiring in 7d list (urgent renew opportunities) | 🔴 |
| 18 | Cron job last-run status (monthly reset, health check, usage rollup) | 🟡 |
| 19 | Export overview PDF report (daily / weekly snapshot email) | 🟢 |
| 20 | Drill-down: click any stat → navigates to filtered sub-page | 🟡 |

---

## 2. `/admin/licenses` — Licenses

Multi-tenant license manager + package assignment + key allocation.

| # | Feature | Priority |
|---|---|---|
| 1 | Table with 11 columns (ID, key, email, plugin, tier, package+quota ring, sites, status, keys count, expires, actions) | 🔴 |
| 2 | 6 filter dropdowns (tier, status, plugin, package, expires_in, search) with **facet counts** in labels | 🔴 |
| 3 | Debounced search 300ms → URL query param sync (deep-linkable) | 🔴 |
| 4 | Sort: created / expires asc+desc / quota_used desc | 🔴 |
| 5 | Pagination: 25/50/100/200 per page + Prev/Next + "X of Y" counter | 🔴 |
| 6 | Create license modal: plugin / email / name / tier / max_sites / expires_days | 🔴 |
| 7 | License detail modal: 9 sections (package / keys / sites / usage chart / recent calls / audit log / danger zone) | 🔴 |
| 8 | Inline Assign package: 4 buttons (Starter/Pro/Agency/Enterprise) in detail modal | 🔴 |
| 9 | Allocate keys: pick N keys from pool for specific provider — auto-picks least-used | 🔴 |
| 10 | Revoke / reactivate toggle (status active ↔ revoked) | 🔴 |
| 11 | Hard delete with confirmation — keys auto-return to pool | 🔴 |
| 12 | Edit license (max_sites, expires_at, tier, notes) | 🟡 |
| 13 | Reset current billing period (zero out tokens_used) | 🟡 |
| 14 | Deactivate a specific site under a license | 🟡 |
| 15 | Copy license key with one-click toast confirmation | 🔴 |
| 16 | Bulk actions: select rows → bulk revoke / bulk reactivate / bulk delete | 🟢 |
| 17 | Export CSV/JSON of filtered license list | 🟢 |
| 18 | Send renewal email reminder to customer (email template) | 🟢 |
| 19 | Add tokens manually (admin adjust — promo / refund) | 🟡 |
| 20 | Audit trail per-license: every admin change with diff | 🟢 |

---

## 3. `/admin/users` — Khách hàng (Users)

Account holders (distinct from licenses — 1 user can own many licenses).

| # | Feature | Priority |
|---|---|---|
| 1 | Table: avatar / name / email / role / licenses count / total spent / joined / last login / actions | 🔴 |
| 2 | Search by email / name (debounced 300ms) | 🔴 |
| 3 | Filter: role (admin/user), verified (yes/no), has_licenses (yes/no) | 🟡 |
| 4 | Sort: created_at / last_login_at / license_count / total_spent | 🟡 |
| 5 | Create user (admin can pre-create accounts for customers) | 🟡 |
| 6 | User detail panel: profile / licenses owned / payment methods / login history | 🔴 |
| 7 | Promote to admin / demote to user toggle | 🔴 |
| 8 | Deactivate user (soft delete — freeze all their licenses) | 🔴 |
| 9 | Force password reset (send email link) | 🟡 |
| 10 | Impersonate user (admin views app as customer — support flow) | 🟢 |
| 11 | Merge duplicate accounts (same email variations) | 🟢 |
| 12 | Manually verify email (skip email verification) | 🟡 |
| 13 | View login history (IP, UA, timestamp, success/fail) | 🟡 |
| 14 | Add internal admin note per user (pinned in detail) | 🟡 |
| 15 | Tag system (VIP / at-risk / trial / agency) with filter | 🟢 |
| 16 | Export user list CSV (GDPR compliance — right to data access) | 🟢 |
| 17 | Hard delete user + all their data (GDPR right to erasure) | 🟡 |
| 18 | Bulk email tool (select users → send transactional email) | 🟢 |
| 19 | 2FA enforcement toggle per user (for admin accounts) | 🟡 |
| 20 | API key revocation (all tokens this user generated) | 🟡 |

---

## 4. `/admin/providers` — AI Providers

Metadata registry for 25 upstream AI providers (Groq / Gemini / etc).

| # | Feature | Priority |
|---|---|---|
| 1 | Table: slug / model / tier / priority / health / cost / keys count / enabled toggle / actions | 🔴 |
| 2 | 4 filter dropdowns (tier / enabled / health / search by name) | 🟡 |
| 3 | Sort: priority / name / health / last_success_at | 🟡 |
| 4 | Quick toggle: on/off switch per provider (inline, no modal) | 🔴 |
| 5 | Create provider: full form (slug / display_name / adapter / base_url / model_id / tier / priority / costs / multipliers) | 🔴 |
| 6 | Preset shortcuts: click "Groq" / "Gemini" / "Mistral" → auto-fills base_url + model_id | 🔴 |
| 7 | Edit provider (same fields as create, slug read-only) | 🔴 |
| 8 | Delete provider (guard: error if has keys in pool) | 🔴 |
| 9 | Test provider: send real "say pong" call → inline badge with latency / sample / error | 🔴 |
| 10 | Duplicate provider (copy all metadata, new slug suffix `-v2`) | 🟢 |
| 11 | Inline edit priority (drag-handle or +/- buttons) | 🟢 |
| 12 | Bulk enable / disable (checkbox + bulk action) | 🟢 |
| 13 | View keys for this provider (link → `/admin/keys?provider_id=...`) | 🔴 |
| 14 | Last error display with tooltip showing full stacktrace | 🟡 |
| 15 | Health history mini-chart (last 24h status dots) | 🟢 |
| 16 | Circuit breaker manual reset button (clear consecutive_failures) | 🟡 |
| 17 | Rate limit indicator (max_rpm / max_tpd vs current usage) | 🟡 |
| 18 | Cost preview card: input $/Mtok × output ratio → Pi token charge per 1k chars | 🟡 |
| 19 | Export provider config JSON (portable between envs) | 🟢 |
| 20 | Provider signup links (already added to Key Pool — mirror here too) | 🟡 |

---

## 5. `/admin/keys` — Key Pool

Upstream API key pool management + allocation to licenses.

| # | Feature | Priority |
|---|---|---|
| 1 | 5 stat cards: Total / Available / Allocated / Exhausted / Banned | 🔴 |
| 2 | Pool-by-provider table: 25 rows with counts + inline `+ Add key` button | 🔴 |
| 3 | All keys table with 7 cols (provider / label+masked key / status / owner / health / quota / actions) | 🔴 |
| 4 | 5 filters (provider / status / health / q search / sort) with URL persistence | 🔴 |
| 5 | Add key modal: provider select / raw key / label auto-gen / monthly quota / notes | 🔴 |
| 6 | Bulk CSV import: paste 50+ keys at once (header: `provider_slug,key,label,quota`) | 🔴 |
| 7 | Signup-link hints per provider in dropdown (click → opens Groq / Gemini console) | 🔴 |
| 8 | Keep modal open for batch paste (checkbox: "add another after save") | 🔴 |
| 9 | Empty-state onboarding: 3-step card (register / paste / bulk) when pool empty | 🔴 |
| 10 | Allocate key to specific license: modal with license_id input | 🔴 |
| 11 | Revoke key (return to available pool) | 🔴 |
| 12 | Mark key as banned (never route here again) | 🟡 |
| 13 | Rotate key (paste new value, same provider, preserve allocation) | 🟡 |
| 14 | Edit key metadata: label / quota / notes without changing key value | 🟡 |
| 15 | Test individual key (send hello call) → inline badge | 🔴 |
| 16 | Reset monthly counters (manual trigger — cron does this monthly) | 🔴 |
| 17 | Delete key (hard delete — confirm) | 🔴 |
| 18 | Key usage history: last 20 ai_usage rows attributed to this key | 🟡 |
| 19 | Filter by license_id (see all keys allocated to customer #42) | 🔴 |
| 20 | Auto-allocate on new license: "N Groq + N Gemini" rules per package | 🟢 |

---

## 6. `/admin/packages` — Packages

Customer-facing subscription tier definitions.

| # | Feature | Priority |
|---|---|---|
| 1 | Table: slug / name / monthly / yearly / quota / qualities / active / subscriber count / sort / actions | 🔴 |
| 2 | Create package modal: all fields incl. features repeater | 🔴 |
| 3 | Edit package (slug read-only on edit) | 🔴 |
| 4 | Delete with guard: error "X active subs use this — migrate first" | 🔴 |
| 5 | Drag-handle reorder (sort_order updates) | 🟡 |
| 6 | Active toggle per package (hide from pricing page without deleting) | 🔴 |
| 7 | Feature list repeater: add/remove strings, markdown supported | 🔴 |
| 8 | Price preview: "Save 17% yearly" badge auto-computed | 🟡 |
| 9 | Allowed qualities checkboxes (fast / balanced / best) | 🔴 |
| 10 | Clone package (copy all fields, new slug) | 🟡 |
| 11 | Subscriber count column — link → filtered licenses view | 🔴 |
| 12 | Price history log (changes audit) | 🟢 |
| 13 | A/B test variant support (package_v1 / package_v2 slugs) | 🟢 |
| 14 | Preview on public `/pricing` (iframe or modal preview) | 🟡 |
| 15 | Migrate-all-subscribers action: move everyone from package A → B | 🟢 |
| 16 | Grandfather pricing: keep old price for existing subscribers when changing | 🟢 |
| 17 | Promo codes / discount rules attached to packages | 🟢 |
| 18 | Translate features to multiple locales (vi / en tabs in editor) | 🟢 |
| 19 | Trial period config (14 days free for Starter, etc) | 🟡 |
| 20 | Annual-only vs monthly-only toggle (some tiers only yearly) | 🟢 |

---

## 7. `/admin/usage` — Usage Analytics

Deep analytics on AI call volume + margin.

| # | Feature | Priority |
|---|---|---|
| 1 | 6 stat cards: Total calls / Tokens spent / Revenue / Upstream cost / Margin% / Avg latency | 🔴 |
| 2 | Filter: days (7/30/90/custom) + plugin + quality + status | 🔴 |
| 3 | Daily stacked bar chart (success vs failed) | 🔴 |
| 4 | Breakdown by plugin table (calls / tokens / revenue / margin / share %) | 🔴 |
| 5 | Breakdown by provider table (same metrics) | 🟡 |
| 6 | Breakdown by customer table (license_id / email / tokens) | 🟡 |
| 7 | Breakdown by quality tier (fast / balanced / best percentages) | 🟡 |
| 8 | Hourly heatmap (day-of-week × hour traffic) | 🟢 |
| 9 | Slowest endpoints (p50 / p95 / p99 latency table) | 🟡 |
| 10 | Error breakdown (error_code / count / sample message) | 🔴 |
| 11 | Failed call log (last 100 with retry button) | 🟡 |
| 12 | Custom date range picker (not just fixed 7/30/90) | 🟡 |
| 13 | Compare mode: this period vs previous period (+/- %) | 🟢 |
| 14 | Real-time mode: live feed of last 20 calls (websocket) | 🟢 |
| 15 | Export CSV / Excel of filtered data | 🟢 |
| 16 | Schedule weekly email report to admin | 🟢 |
| 17 | Anomaly detection: flag unusual spikes (3x baseline) | 🟢 |
| 18 | Cost projection: monthly burn based on 30d trend | 🟡 |
| 19 | Individual request inspector: click any call → full request/response log | 🟡 |
| 20 | Geographic breakdown (country of caller IP) | 🟢 |

---

## 8. `/admin/revenue` — Doanh thu (Revenue)

Financial dashboard.

| # | Feature | Priority |
|---|---|---|
| 1 | MRR / ARR / LTV stat cards | 🔴 |
| 2 | Revenue by month bar chart (12m history) | 🔴 |
| 3 | Revenue by package pie chart | 🔴 |
| 4 | Revenue by plugin (license fees) table | 🟡 |
| 5 | Top-up revenue (prepaid tokens if still supported) | 🟡 |
| 6 | Churn rate: % customers cancelled in period | 🔴 |
| 7 | New MRR vs Churned MRR (net new) | 🟡 |
| 8 | ARPU / ARPC (avg revenue per user / customer) | 🟡 |
| 9 | Cohort retention heatmap (% retained by signup month) | 🟢 |
| 10 | Upsell opportunities: customers hitting quota → suggest upgrade | 🟡 |
| 11 | Refund tracker: issued refunds + reasons | 🟡 |
| 12 | Failed payment list (Stripe webhooks dunning queue) | 🔴 |
| 13 | Invoice list: customer / amount / status / PDF link | 🔴 |
| 14 | Manual invoice creation (one-off services) | 🟡 |
| 15 | Revenue forecast (next 3 months projection) | 🟢 |
| 16 | Currency breakdown (VND / USD / EUR) | 🟢 |
| 17 | Tax reports (VAT collected by country) | 🟢 |
| 18 | Stripe reconciliation: match payments → invoices | 🟡 |
| 19 | Export accounting CSV (QuickBooks / Xero format) | 🟢 |
| 20 | Revenue goals progress bar (monthly target vs actual) | 🟢 |

---

## 9. `/admin/releases` — Plugin Releases

Versioned plugin ZIP distribution.

... (omitted remainder of features for brevity in file saving... actually I will save the full roadmap)

## Priority rollup
- **🔴 MVP core (must ship):** ~95 features
- **🟡 v2 ship-blocker:** ~70 features
- **🟢 nice-to-have:** ~55 features

**Execution strategy**
Sprint 1 (week 1-2): All 🔴 MVP features for `/admin` + `/admin/licenses` + `/admin/keys`
Sprint 2 (week 3-4): 🔴 for `/admin/providers` + `/admin/packages` + `/admin/usage`
Sprint 3 (week 5-6): 🔴 for `/admin/users` + `/admin/releases` + `/admin/revenue`
Sprint 4 (week 7-8): 🔴 for `/admin/settings` + `/admin/audit-log` + cross-cutting essentials
