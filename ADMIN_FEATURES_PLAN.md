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

| # | Feature | Priority |
|---|---|---|
| 1 | Table: plugin + version / tier / size / SHA256 / stable / downloads / uploaded / actions | 🔴 |
| 2 | Filter: plugin_slug / tier / is_stable / is_yanked | 🔴 |
| 3 | Upload release modal: plugin select / version / tier Free-or-Pro / changelog markdown / ZIP drop zone + progress | 🔴 |
| 4 | Semver validation on version input (1.2.3 / 1.2.3-beta.1) | 🔴 |
| 5 | Auto-compute SHA256 on upload | 🔴 |
| 6 | Toggle stable flag (mark current stable version) | 🔴 |
| 7 | Yank release (hide from updates API but keep ZIP for rollback) | 🔴 |
| 8 | Download ZIP (admin-side verification) | 🟡 |
| 9 | Delete release (hard delete + free S3/disk) | 🔴 |
| 10 | Copy SHA256 / copy download URL | 🟡 |
| 11 | Changelog preview (rendered markdown) in detail modal | 🟡 |
| 12 | Downloads counter per release (+ daily chart) | 🟡 |
| 13 | Auto-update feed generator (RSS per plugin) | 🟢 |
| 14 | GitHub Actions webhook: push tag → auto-upload ZIP | 🟢 |
| 15 | Version diff viewer (file changes between v1.2 → v1.3) | 🟢 |
| 16 | Deprecation notice: mark version as EOL with required upgrade-to message | 🟡 |
| 17 | Release notes templating (auto-generate from commits) | 🟢 |
| 18 | License tier-gating: block Pro ZIP download for free-tier licenses | 🔴 |
| 19 | CDN fanout: upload to CloudFront / Bunny for global delivery | 🟢 |
| 20 | A/B canary: release v1.3 to 10% of customers first | 🟢 |

---

## 10. `/admin/audit-log` — Audit Log

Accountability trail for every admin action.

| # | Feature | Priority |
|---|---|---|
| 1 | Table: timestamp / actor / action verb / resource / diff link | 🔴 |
| 2 | Filter: actor / action_type / resource_type / date range / search | 🔴 |
| 3 | Auto-log on every admin mutation (license / key / package / provider / user / release CRUD) | 🔴 |
| 4 | Diff viewer: before/after JSON side-by-side | 🔴 |
| 5 | IP + user-agent per action (security forensics) | 🟡 |
| 6 | Expandable row: full request payload + response | 🟡 |
| 7 | Filter by resource_id (all actions on license #42) | 🔴 |
| 8 | Date range picker with presets (today / yesterday / last 7d / custom) | 🟡 |
| 9 | Pagination 50/100/200 per page | 🔴 |
| 10 | Export filtered log to CSV (compliance requests) | 🟡 |
| 11 | Retention policy: auto-purge logs older than N days (config) | 🟡 |
| 12 | Redact sensitive fields (hide API keys from diff view) | 🔴 |
| 13 | Search full-text across all diff JSON | 🟡 |
| 14 | Critical-action alerts: email on delete / role change | 🟡 |
| 15 | Replay action (undo button where possible) | 🟢 |
| 16 | Chain/hash verification (tamper-proof log, sequential SHA) | 🟢 |
| 17 | Link to related log entries (login → action → logout session) | 🟢 |
| 18 | Statistics: actions per admin per day (who's busy) | 🟢 |
| 19 | SIEM export (syslog / JSON to Datadog / Splunk) | 🟢 |
| 20 | Anonymize user PII on request (GDPR erasure w/o losing audit trail) | 🟡 |

---

## 11. `/admin/settings` — Settings

Global platform configuration.

| # | Feature | Priority |
|---|---|---|
| 1 | Branding card: site_name / logo_url / primary_color picker / support_email | 🔴 |
| 2 | Token packs CRUD table (top-up packs, separate from subscription) | 🔴 |
| 3 | Feature flags card: signup_enabled / billing_enabled / marketplace_enabled | 🔴 |
| 4 | Email templates editor (welcome / quota_warning / renewal_reminder / invoice) | 🔴 |
| 5 | Webhook endpoints: Stripe / n8n / custom with secret | 🔴 |
| 6 | Cron jobs panel: last_run / next_run / manual trigger per job | 🔴 |
| 7 | Security read-only: JWT expire / bcrypt rounds / CORS origins | 🟡 |
| 8 | API rate limits config per license tier (RPM caps) | 🟡 |
| 9 | Email server config (SMTP host / port / creds) with test-send button | 🟡 |
| 10 | Stripe config: publishable key / webhook secret / Stripe test-mode toggle | 🔴 |
| 11 | Backup & restore: download DB dump / restore from file | 🟡 |
| 12 | Maintenance mode toggle (returns 503 to all customer API calls) | 🟡 |
| 13 | Notification preferences: which admin events email whom | 🟡 |
| 14 | Localization: default locale / supported locales toggle | 🟢 |
| 15 | Custom CSS injection (override storefront styling) | 🟢 |
| 16 | Analytics tracking: GA / Plausible / PostHog tokens | 🟢 |
| 17 | Terms of Service / Privacy Policy editor (markdown → /tos, /privacy pages) | 🟡 |
| 18 | SSO config: Google / GitHub / Azure AD (OAuth2 providers) | 🟢 |
| 19 | API docs generator toggle (expose /docs Swagger or not in prod) | 🟢 |
| 20 | DB / Redis connection monitor (live latency + pool stats) | 🟢 |

---

## 12. (Bonus) Cross-cutting admin UX features

Apply these to EVERY tab:

| # | Feature | Where |
|---|---|---|
| 1 | URL filter persistence (shareable deep links) | All list pages |
| 2 | Dark mode toggle in top bar | Global |
| 3 | Keyboard shortcuts (`/` focus search, `n` new, `e` edit) | All pages |
| 4 | Command palette (Cmd+K) — global search across resources | Global |
| 5 | Breadcrumbs in topbar (Admin > Licenses > #42) | Global |
| 6 | Bulk select + bulk actions (checkbox column, floating action bar) | List pages |
| 7 | Column visibility toggle (show/hide cols per user preference) | Tables |
| 8 | Saved filter presets ("my team", "at-risk", ...) per user | List pages |
| 9 | Inline editing (double-click cell to edit, Enter to save) | Tables |
| 10 | Right-click context menu on rows | Tables |
| 11 | Responsive mobile view (admin on phone, priority read-only) | Global |
| 12 | Accessibility: full keyboard nav + ARIA labels + focus rings | Global |
| 13 | Toast notifications for async actions (queued / done / failed) | Global |
| 14 | Undo snackbar (5s window to undo delete actions) | Mutations |
| 15 | Optimistic UI updates (show change immediately, rollback on error) | Mutations |
| 16 | Skeleton loaders (never blank screens) | Loading states |
| 17 | Auto-refresh toggle (live data every N seconds) | Dashboards |
| 18 | Print / PDF export of any page | Global |
| 19 | "What's new" changelog feed for admins (dismissible banner) | Topbar |
| 20 | Help hints (contextual tooltips with link to docs per section) | Global |

---

## Priority rollup

- **🔴 MVP core (must ship):** ~95 features — the minimum viable admin. Roughly 8-9 features × 11 tabs.
- **🟡 v2 ship-blocker:** ~70 features — needed before charging real money.
- **🟢 nice-to-have:** ~55 features — compete at scale.

**Total: 220 features.** Feasible rollout: MVP in 6-8 weeks (~2 weeks per tab cluster), v2 in 3-4 months, full in 6-12 months.

## Backend gaps to implement alongside

| Tab | Missing endpoint / schema |
|---|---|
| Overview | `/v1/admin/overview` with alerts array + daily_revenue chart data |
| Licenses | `last_active_at`, `notes` field, `/v1/admin/licenses/{id}/audit` |
| Users | `/v1/admin/users/{id}/impersonate`, `/v1/admin/users/{id}/sessions` |
| Providers | `/v1/admin/providers/{id}/health-history?hours=24` |
| Keys | `/v1/admin/keys/{id}/usage` — attributed calls |
| Packages | `subscriber_count` field, migration endpoint |
| Usage | custom date range support, hourly heatmap aggregation |
| Revenue | `/v1/admin/revenue/cohorts`, `/v1/admin/revenue/forecast` |
| Releases | signed URL generator, downloads counter increment |
| Audit | NEW TABLE `audit_log` + triggers on all admin mutations |
| Settings | Email template storage + render preview, cron_status table |

---

## Execution strategy

**Sprint 1 (week 1-2):** All 🔴 MVP features for `/admin` + `/admin/licenses` + `/admin/keys`
**Sprint 2 (week 3-4):** 🔴 for `/admin/providers` + `/admin/packages` + `/admin/usage`
**Sprint 3 (week 5-6):** 🔴 for `/admin/users` + `/admin/releases` + `/admin/revenue`
**Sprint 4 (week 7-8):** 🔴 for `/admin/settings` + `/admin/audit-log` + cross-cutting essentials
**v2 (month 3-4):** All 🟡 features
**v3 (month 6+):** 🟢 polish features

**End of plan.**
