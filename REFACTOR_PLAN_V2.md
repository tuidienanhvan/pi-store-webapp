# Pi Store — Detailed Admin/Customer Spec (v2)

**Target executor:** Gemini 3 Pro (or any capable model)
**Scope:** Full technical spec for every Admin + Customer page, every API endpoint, every filter/search/pagination, token accounting, request/response shapes, error contracts.

**Do NOT touch:** Database migrations, business logic in `services/`, model definitions, `catalog.generated.json`, auth flows. Frontend markup + admin UX polish only (unless a section says "backend add").

---

## 0. Global conventions (apply to ALL pages)

### 0.1 URL state
Every filterable page persists filter state to URL query params:
- Back/forward buttons work
- Deep-linkable ("send me the exhausted keys page")
- Use `useSearchParams()` from `react-router-dom`
- Debounce free-text search input 300ms before pushing to URL

### 0.2 Data fetching
- All fetches through `api` in `src/lib/api-client.js` — never raw `fetch()`
- Loading state: skeleton rows, never blank screens
- Error state: `<Alert tone="danger" onDismiss>` at top of page, keep stale data visible underneath
- Refetch on: filter change (auto), manual "Reload" button in toolbar, after any mutation

### 0.3 Pagination contract
Backend returns `{ items, total, limit, offset }`. Frontend shows:
```
[← Prev] Page 3 of 12 — showing 51-75 of 287 [Next →]  [25▾ per page]
```
- `limit` options: 25 / 50 / 100 / 200
- Keep current filter when paginating
- Reset to page 1 when filter changes

### 0.4 Table row actions
Every table row has an overflow menu (⋯) with ALL actions, plus 1-2 primary actions inline. Inline actions go right-aligned, icon+label under 80px wide.

### 0.5 Modals
- Close on Esc, backdrop click, ✕ button
- Focus trap — tab cycles within modal
- First focusable element auto-focused on open
- Disable submit button while request pending
- Show error as `<Alert>` inside modal, not toast

### 0.6 Toast / notifications
Use in-page `<Alert>` (success/danger/warning), auto-dismiss after 3s unless error.

### 0.7 Timestamps
- Relative for recent: "3 phút trước", "2h trước"
- Absolute ISO for old: "2026-04-15 14:32"
- Use `new Intl.DateTimeFormat("vi-VN")` for consistency
- Hover shows full ISO tooltip

### 0.8 Numbers
- Tokens: `formatTokens()` — K/M suffix (e.g. `1.2M`, `340K`)
- Prices USD cents → `$29.00`
- Prices VND → `349.000 ₫` (`Intl.NumberFormat("vi-VN")`)
- Counts with commas: `1,234`

### 0.9 Copy buttons
License key, API key (masked), webhook secrets — every long string has a copy-to-clipboard icon button next to it showing ✓ for 2s on success.

---

## 1. ADMIN PAGES — Full Spec

### 1.1 `/admin` — Overview (Tổng quan)

**Purpose:** Bird's-eye view of the business. Everything at a glance.

**Layout:**
```
┌──────────────────────────────────────────────────────────┐
│ H1: Tổng quan                                            │
│ [Period: 7d / 30d / 90d]  [Refresh ↻]                    │
├──────────────────────────────────────────────────────────┤
│ [Revenue 30d $X,XXX]  [Upstream cost $XXX]  [Margin %]   │
│ [Active licenses N] [Tokens spent X.XM] [Healthy N/N]    │
├──────────────────────────────────────────────────────────┤
│ 📈 Revenue chart (last 30 days, bars)                    │
├──────────────────────────────────────────────────────────┤
│ 🏆 Top plugins by calls  │  🔥 Top customers by tokens   │
│ (table 5 rows)           │  (table 5 rows)               │
├──────────────────────────────────────────────────────────┤
│ ⚠️ Alerts:                                               │
│ - 3 providers down (groq, cerebras, openrouter)         │
│ - 2 customers at 90% quota (link to license)            │
│ - 14 exhausted keys (auto-recovers next month)          │
└──────────────────────────────────────────────────────────┘
```

**Endpoint:** `GET /v1/admin/overview?period=30d`
**Response:**
```json
{
  "revenue_30d": 12345.67,
  "upstream_cost_30d": 1234.56,
  "margin_pct": 0.9,
  "active_licenses": 42,
  "tokens_spent_30d": 1234567,
  "total_providers": 25,
  "healthy_providers": 22,
  "down_providers": 3,
  "top_plugins": [{"plugin":"pi-seo","calls":1234}],
  "top_customers": [{"license_id":42,"email":"a@b.c","tokens":123456}],
  "alerts": [
    {"severity":"warning","type":"provider_down","message":"..."},
    {"severity":"info","type":"quota_warning","license_id":42,"pct":0.91}
  ],
  "daily_revenue": [{"date":"2026-04-17","revenue_cents":12345}, ...]
}
```

**Actions:** None on this page — links to drill down.

---

### 1.2 `/admin/licenses` — License manager

**Purpose:** CRUD + package assign + key allocation for every customer license.

**Filters (all in URL):**
- `q` — free-text, searches `email + key + plugin`
- `tier` — free / pro
- `status` — active / revoked / expired
- `plugin` — dropdown from enum
- `package` — free / starter / pro / agency / enterprise
- `expires_in` — 7d / 30d / 90d / expired
- Sort: `created_at DESC` (default) / `expires_at ASC` / `tokens_used DESC`

**Table columns:**
| Col | Content | Sortable | Width |
|---|---|---|---|
| ID | `#42` muted | yes | 60 |
| Key | `pi_aa0e…7f2` mono + copy | no | 160 |
| Email + name | Email bold, name muted below | yes | 220 |
| Plugin | badge | yes | 120 |
| Tier | badge `free`/`pro` | yes | 80 |
| Package | badge + quota ring (mini %used) | yes | 140 |
| Sites | `N/M` with progress bar when allocated > 60% | no | 80 |
| Status | badge green/red/yellow | yes | 80 |
| Keys | `N keys` link to modal | no | 70 |
| Expires | relative + tooltip absolute | yes | 100 |
| ⋯ | overflow menu | — | 40 |

**Row overflow menu items:**
- Chi tiết (open detail modal)
- Revoke / Kích hoạt (toggle)
- Reset quota period
- Đổi package
- Cấp thêm keys
- Gửi email nhắc gia hạn
- Xoá (confirm)

**Toolbar:**
```
[Search box — 320px wide, debounced 300ms]
[Tier ▾] [Status ▾] [Package ▾] [Plugin ▾] [Expires ▾]
[Clear filters]                     [+ Tạo license]
```

**Request:** `GET /v1/admin/licenses?q=foo&tier=pro&status=active&package=pro&plugin=pi-seo&expires_in=30d&sort=-created_at&limit=50&offset=0`

**Response:**
```json
{
  "items": [
    {
      "id": 42,
      "key": "pi_aa0e241b9bd42cdad6702200f40853f2",
      "email": "test@pi.local",
      "name": "Test Customer",
      "plugin": "pi-seo",
      "tier": "pro",
      "status": "active",
      "max_sites": 5,
      "activated_sites": 2,
      "expires_at": "2027-04-17T14:36:07Z",
      "created_at": "2026-04-17T14:36:07Z",
      "package_slug": "pro",
      "package_name": "Pro",
      "quota_used": 123456,
      "quota_limit": 2000000,
      "quota_pct": 6.2,
      "allocated_keys_count": 5,
      "last_active_at": "2026-04-18T03:22:11Z"
    }
  ],
  "total": 287,
  "limit": 50,
  "offset": 0,
  "facets": {
    "by_status": { "active": 250, "revoked": 30, "expired": 7 },
    "by_package": { "starter": 120, "pro": 100, "agency": 30 }
  }
}
```
**Facets** (bonus): drive count badges in filter dropdowns ("Active (250)").

**Backend adds needed:**
- Add query params: `status`, `package`, `plugin`, `expires_in`, `sort`
- Include `package_slug`, `quota_used`, `allocated_keys_count`, `last_active_at` in response
- Compute `facets` in single aggregation query

---

#### 1.2.1 License Detail Modal (drill-down)

**Sections:**
1. **Header** — key + copy button, email, status badge, created/expires dates
2. **Cloud Package card** — current package, quota progress bar, days left in cycle, `Đổi package` quick buttons (4 tiers)
3. **Allocated keys table** — provider / masked key / health / used tokens / revoke action
4. **Add keys form** — select provider + count, auto-pick from pool
5. **Sites table** — active sites, deactivate button per site
6. **Usage chart** — 30-day chart specific to this license
7. **Recent requests log** — last 20 `ai_usage` rows: timestamp / plugin / tokens / status
8. **Audit log** — every admin action on this license
9. **Danger zone** — Revoke / Delete buttons

**Endpoints (read):**
- `GET /v1/admin/licenses/{id}` — full detail
- `GET /v1/admin/licenses/{id}/package` — package assignment
- `GET /v1/admin/keys?license_id={id}` — allocated keys
- `GET /v1/admin/licenses/{id}/sites` — sites
- `GET /v1/admin/licenses/{id}/usage?days=30` — usage chart
- `GET /v1/admin/licenses/{id}/requests?limit=20` — recent calls
- `GET /v1/admin/licenses/{id}/audit?limit=50` — audit log

Parallel fetch all 7 on modal open using `Promise.all`.

**Endpoints (mutations):**
- `PATCH /v1/admin/licenses/{id}` — edit max_sites, expires, tier, notes
- `POST /v1/admin/licenses/{id}/revoke`
- `POST /v1/admin/licenses/{id}/reactivate`
- `POST /v1/admin/licenses/{id}/package` — assign package
- `POST /v1/admin/licenses/{id}/package/reset-period`
- `POST /v1/admin/keys/allocate` — `{license_id, provider_id, count}`
- `POST /v1/admin/keys/{key_id}/revoke`
- `POST /v1/admin/licenses/{id}/sites/{site_id}/deactivate`
- `DELETE /v1/admin/licenses/{id}`

---

### 1.3 `/admin/keys` — Key Pool

**Purpose:** Manage upstream API keys pool. Add / allocate / health / quota.

**Filters:**
- `provider_id` — dropdown (25 options + "All")
- `status` — available / allocated / exhausted / banned
- `health_status` — healthy / degraded / down
- `has_errors` — bool (consecutive_failures > 0)
- `license_id` — filter by owner
- `q` — search in label + notes
- Sort: `id DESC` (default) / `monthly_used_tokens DESC` / `consecutive_failures DESC` / `last_success_at DESC`

**Stat cards top row (5):**
Total / Available / Allocated / Exhausted / Banned

**Pool-by-provider section** — table 25 rows:
| Provider | Total | Available | Allocated | Exhausted | Banned | + Key |
|---|---|---|---|---|---|---|
| groq-llama-70b-free | 12 | 3 | 8 | 1 | 0 | [+ Add] |

Clicking `+ Add` opens modal pre-filled with that provider.

**All keys table** columns:
| Col | Content |
|---|---|
| Provider | slug mono |
| Label / masked key | 2-line: label + `gsk_…a8f3` |
| Status | badge |
| Owner | `#id` + email (if allocated) |
| Health | badge + failure count if > 0 |
| Quota | `X.XK / Y.YM` or just used if unlimited |
| Last success | relative time |
| Last error | truncated, tooltip full |
| ⋯ | overflow menu |

**Row overflow menu:**
- Test (send a `hello` call, show result inline)
- Allocate to license (if available)
- Revoke (if allocated)
- Mark banned (stop routing forever)
- Reset period (clear monthly_used_tokens)
- Rotate key (paste new value, same provider)
- Edit (label/quota/notes)
- Xoá

**Empty pool state (CURRENT):** 3-step onboarding card with links to top provider signup pages.

**Endpoints:**
- `GET /v1/admin/keys?{filters}&limit=&offset=`
- `GET /v1/admin/keys/summary`
- `GET /v1/admin/keys/{id}` — single key detail (for Test/Rotate modal)
- `POST /v1/admin/keys` — `{provider_id, key_value, label, monthly_quota_tokens, notes}`
- `POST /v1/admin/keys/bulk` — `{rows: [...]}`
- `PATCH /v1/admin/keys/{id}` — `{key_value?, label?, status?, monthly_quota_tokens?, notes?}`
- `POST /v1/admin/keys/{id}/test` — returns `{ok, latency_ms, sample, error}`
- `POST /v1/admin/keys/{id}/revoke`
- `POST /v1/admin/keys/allocate` — `{license_id, provider_id?, count?, key_ids?}`
- `POST /v1/admin/keys/reset-period` — all keys
- `DELETE /v1/admin/keys/{id}`

**Request `POST /v1/admin/keys`:**
```json
{
  "provider_id": 1,
  "key_value": "gsk_xxxxxxxxxxxx",
  "label": "groq-acct-17-sim-0909xxx",
  "monthly_quota_tokens": 10000000,
  "notes": "acct registered via SIM 0909xxx, backup phone linked"
}
```

**Response** (single key, always masked):
```json
{
  "id": 42,
  "provider_id": 1,
  "provider_slug": "groq-llama-70b-free",
  "provider_display_name": "Groq — Llama 3.3 70B (Free)",
  "label": "groq-acct-17-sim-0909xxx",
  "key_masked": "gsk_…a8f3",
  "status": "available",
  "allocated_to_license_id": null,
  "allocated_to_email": null,
  "allocated_at": null,
  "health_status": "healthy",
  "consecutive_failures": 0,
  "last_error": "",
  "last_success_at": null,
  "monthly_used_tokens": 0,
  "monthly_quota_tokens": 10000000,
  "notes": "..."
}
```

**Raw key_value never returned in any response.** Only mutations accept it.

---

### 1.4 `/admin/providers` — Provider registry

**Purpose:** Manage provider metadata (25 rows). Keys live in `/admin/keys`, not here.

**Filters:**
- `tier` — free / paid
- `is_enabled` — bool
- `health_status` — healthy / degraded / down
- `q` — search slug + display_name

**Stat cards:** Total / Enabled / Keys available (sum across providers) / Healthy

**Table columns:**
- Slug (mono) + Display name
- Adapter (`openai_compat` / `anthropic` / `gemini`)
- Model ID (mono, truncate)
- Tier badge
- Priority (numeric, inline edit)
- Health badge + last_error tooltip
- Cost `$X.XX / $X.XX per Mtok`
- Pi token multipliers `1.0x / 1.5x`
- Keys count `X avail / Y total`
- Enabled toggle
- ⋯ menu

**Row actions:**
- Edit (full modal)
- Test (send hello to a random available key for this provider)
- Duplicate (copy metadata, new slug)
- View keys (filter `/admin/keys?provider_id=`)
- Delete (confirm, only if no keys)

**Edit modal fields:**
- Slug (disabled on edit)
- Display name
- Adapter (select)
- Base URL
- Model ID
- Tier
- Priority
- Input/Output cost per Mtok (cents)
- Pi tokens per input / output (multiplier)
- Max RPM / max TPD (0 = unlimited)
- Enabled toggle

**Endpoints (current, keep):**
- `GET /v1/admin/providers`
- `POST /v1/admin/providers`
- `PATCH /v1/admin/providers/{id}`
- `DELETE /v1/admin/providers/{id}`
- `POST /v1/admin/providers/{id}/test`

**Backend add:** filter params, sort, pagination.

---

### 1.5 `/admin/packages` — Subscription tiers

**Purpose:** CRUD 4 customer-facing packages (Starter/Pro/Agency/Enterprise).

**No pagination** — usually < 10 rows.

**Table columns:**
- Slug / name
- Price monthly / yearly (USD)
- Token quota (M format)
- Allowed qualities (badges)
- Active subscriber count (link to filtered licenses)
- Sort order (drag handle)
- Active toggle
- ⋯ (Edit / Duplicate / Delete)

**Edit modal:**
- Slug (disabled on edit)
- Display name
- Description (textarea)
- Price cents monthly + yearly
- Token quota monthly (0 = unlimited)
- Allowed qualities (3 checkboxes)
- Features (repeater: add/remove string lines)
- Sort order
- Active

**Delete guard:** If package has active licenses, show error "X licenses đang dùng gói này. Assign lại trước khi xoá."

**Endpoints (current):**
- `GET /v1/admin/packages`
- `POST /v1/admin/packages`
- `PATCH /v1/admin/packages/{slug}`
- `DELETE /v1/admin/packages/{slug}`

**Backend add:** `subscriber_count` field in list response (left join LicensePackage + count).

---

### 1.6 `/admin/users` — User accounts

**Purpose:** Manage Pi account holders (distinct from licenses — a user can own multiple licenses).

**Filters:**
- `q` — email + name
- `is_admin` — bool
- `is_verified` — bool
- `has_licenses` — bool
- Sort: `created_at DESC` / `last_login_at DESC` / `license_count DESC`

**Table columns:**
- Avatar + name + email
- Role (Admin badge / User)
- Licenses owned (count, link)
- Total spent USD
- Joined (relative)
- Last login (relative)
- ⋯ (Edit / Reset password / Promote to admin / Deactivate / Delete)

**Edit modal:**
- Name
- Email (requires re-verify)
- Admin toggle
- Active toggle
- Force password reset (email link)

**Endpoints:**
- `GET /v1/admin/users?q=&is_admin=&sort=&limit=&offset=`
- `PATCH /v1/admin/users/{id}` — admin/active/name/email
- `POST /v1/admin/users/{id}/reset-password` — sends email
- `DELETE /v1/admin/users/{id}` (only if no licenses)

---

### 1.7 `/admin/usage` — Usage analytics

**Purpose:** Pi AI Cloud call analytics for margin analysis.

**Filters:**
- `days` — 7 / 30 / 90 / custom range picker
- `plugin` — dropdown
- `license_id` — autocomplete
- `provider_id` — dropdown
- `quality` — fast / balanced / best
- `status` — success / failed

**Layout:**
```
┌ Stat cards: Total calls / Tokens spent / Revenue / Upstream cost / Margin% / Avg latency
├ Chart: daily stacked bars (success vs failed)
├ Top plugins table (calls, tokens, revenue, upstream, margin)
├ Top providers table (same metrics)
├ Slowest endpoints table (p95 latency)
└ Error breakdown table (error_code, count)
```

**Endpoint:** `GET /v1/admin/usage?days=30&plugin=pi-seo&license_id=42&provider_id=1&quality=fast&status=success`

**Response:**
```json
{
  "period": {"from":"2026-03-18","to":"2026-04-17","days":30},
  "totals": {
    "calls": 12345, "tokens": 5432100, "revenue_cents": 489.0,
    "upstream_cost_cents": 12.3, "margin_pct": 0.97,
    "avg_latency_ms": 450, "p95_latency_ms": 1200
  },
  "daily": [
    {"date":"2026-04-17","calls":320,"success":315,"failed":5,"tokens":12345,"cost_cents":3}
  ],
  "by_plugin": [
    {"plugin":"pi-seo","calls":5000,"tokens":2M,"revenue_usd":180,"upstream_usd":4.5,"margin_pct":0.975}
  ],
  "by_provider": [...],
  "slowest_endpoints": [{"endpoint":"seo_bot.generate","p95_ms":2300,"calls":500}],
  "errors": [{"code":"upstream_timeout","count":23}, ...]
}
```

---

### 1.8 `/admin/revenue` — Revenue analytics

Similar to Usage but focuses on $$$:
- MRR / ARR / churn rate
- Revenue by package
- Revenue by plugin (from licenses)
- Top-up revenue (prepaid tokens)
- Daily revenue bar chart
- New subscriptions / cancellations per day

**Endpoint:** `GET /v1/admin/revenue?days=30`

---

### 1.9 `/admin/releases` — Plugin releases

**Purpose:** Upload versioned plugin ZIP files for download.

**Filters:**
- `plugin_slug`
- `tier_required` — free / pro
- `is_stable`
- Sort: `created_at DESC`

**Columns:**
- Plugin slug + version (big)
- Tier badge
- Size (MB)
- SHA256 (truncated + copy)
- Is stable / yanked
- Downloads count
- Uploaded (relative)
- ⋯ (Download / Toggle stable / Yank / Delete)

**Upload modal:**
- Plugin (select from catalog slugs)
- Version (semver validate)
- Tier (free / pro — **NO agency anymore**)
- Changelog (markdown textarea)
- ZIP file (drop zone + progress bar)

**Endpoints:**
- `GET /v1/admin/releases?plugin_slug=&tier=&is_stable=&limit=&offset=`
- `POST /v1/admin/releases` — multipart form data
- `PATCH /v1/admin/releases/{id}` — is_stable / is_yanked
- `DELETE /v1/admin/releases/{id}`

---

### 1.10 `/admin/settings` — Global config

Already built. Keep as-is. Add sections:
- **Branding** (site name, logo, primary color)
- **Token Packs** (top-up packs — separate from subscription packages)
- **Feature flags** (signup / billing / marketplace)
- **Email templates** (welcome / quota warning / renewal) — textarea
- **Webhook endpoints** (Stripe / n8n / custom) — URL + secret
- **Cron jobs status** (monthly reset / health check / usage rollup) — last run + next run + manual trigger
- **Security (read-only)** — JWT expire, bcrypt rounds, CORS

---

### 1.11 `/admin/audit-log` — Audit trail

**Purpose:** Every admin action logged. Accountability.

**Filters:**
- `actor_id` — admin user autocomplete
- `action_type` — create / update / delete / revoke / allocate / assign / login
- `resource_type` — license / key / package / provider / user / release
- `resource_id` — exact match
- `from` / `to` — date range
- `q` — free search in diff/notes

**Columns:**
- Timestamp (absolute)
- Actor (admin email)
- Action (verb + resource — "created license #42" / "revoked key #17")
- Resource link
- Diff (expand to see before/after JSON)
- IP + user agent (tooltip)

**Endpoint:** `GET /v1/admin/audit-log?{filters}`

**Backend add:** Create `audit_log` table + write hooks from every admin service mutation. Currently NOT implemented — show `<EmptyState>` + "Backend pending" until built.

---

## 2. CUSTOMER PAGES — Full Spec

### 2.1 `/app` — Overview (already built, verify)

**Must show:**
- Greeting with user name
- Cloud Package card with progress bar + days left
- Mini stats: calls this month / lifetime tokens / sites
- 30-day usage chart (CSS bars, no chart lib)
- Plugin breakdown (progress bars)
- Quick action cards: Licenses / Upgrade / Catalog

**Must NOT show:**
- Provider slugs
- Key info
- Upstream cost
- Any internal Pi routing details

**Endpoints:**
- `GET /v1/cloud/package`
- `GET /v1/cloud/usage?days=30`

---

### 2.2 `/app/licenses` — My licenses

**Filters:**
- `status` — active / revoked / expired
- `plugin` — dropdown

**Table columns:**
- Plugin + tier
- Key (masked + copy)
- Status
- Sites `N/M`
- Expires (relative)
- ⋯ (View install guide / Deactivate site / Renew)

**Actions per license:**
- **Copy key** — copy full key
- **Deactivate a site** — list sites with deactivate button
- **Renew** — Stripe checkout or manual invoice

**Endpoints:**
- `GET /v1/license/stats` (existing)
- `GET /v1/cloud/licenses` (new customer-scoped)

---

### 2.3 `/app/usage` — Detailed usage

Like admin usage but customer-scoped (license_id enforced to their own).

**Filters:**
- `days` — 7 / 30 / 90
- `plugin` — from their own usage data only

**Layout:**
- Big chart (same as /app but bigger)
- Table: each row = 1 day breakdown, columns: date / calls / tokens / quality mix
- Table: top plugins / top endpoints

**Endpoint:** `GET /v1/cloud/usage?days=90`

---

### 2.4 `/app/billing` — Invoices + subscription

- Current package + monthly cost
- Upgrade / downgrade buttons (Stripe)
- Next invoice date + amount
- Past invoices (table: date / amount / PDF link / status)
- Payment method (Stripe managed)

**Endpoints:**
- `GET /v1/cloud/billing/subscription`
- `GET /v1/cloud/billing/invoices`
- `POST /v1/cloud/billing/portal` → Stripe customer portal URL

---

### 2.5 `/app/api-keys` — Service API keys (optional)

For power users who want to call `/v1/ai/complete` directly via their own code, not through Pi plugins. Generate scoped tokens:

**Columns:**
- Name / label
- Scope (complete / read-only)
- Last used
- Created
- ⋯ (Copy / Revoke)

**Create modal:**
- Name
- Scope checkboxes
- Expires (never / 30d / 90d / 1y)

On create, show raw token ONCE in a card with big copy button + warning "This key won't be shown again. Copy now."

**Endpoints:**
- `GET /v1/cloud/api-keys`
- `POST /v1/cloud/api-keys` → returns raw key in response ONCE
- `DELETE /v1/cloud/api-keys/{id}`

**Backend add:** New `customer_api_keys` table (scoped JWT-like tokens distinct from license bearer).

---

### 2.6 `/app/support` — Support tickets

Standard support flow. Low priority.

---

## 3. PUBLIC PAGES

### 3.1 `/pricing` — already built with public packages endpoint

Keep current. Verify:
- 4 package cards bind from `GET /v1/public/packages`
- Monthly/Yearly toggle
- Bundle section bind from catalog.generated.json
- FAQ section
- Bottom CTA

### 3.2 `/signup?plan=pro` — Signup with plan preselected

Read `?plan=` query, show "Bạn đang đăng ký **Pro**" banner above form. After successful signup → redirect to `/app/billing?start=pro` to complete Stripe checkout.

---

## 4. API CONTRACT REFERENCE

### 4.1 Request conventions

All endpoints (except `/v1/public/*`):
- JSON body (except multipart for file upload)
- Auth via `Authorization: Bearer <token>`
  - Admin endpoints: JWT with `is_admin: true`
  - Customer endpoints: JWT (any user) OR license Bearer key
  - Plugin endpoints: license Bearer key only
- Errors return:
```json
{ "code": "quota_exceeded", "message": "...", "detail": {...} }
```
- Success = HTTP 2xx + typed response body
- Idempotent writes use `Idempotency-Key` header (optional)

### 4.2 Standard error codes

| HTTP | code | Meaning |
|---|---|---|
| 400 | `validation_error` | Body doesn't match schema |
| 401 | `invalid_token` | JWT bad or expired |
| 402 | `quota_exceeded` | Period quota hit |
| 402 | `insufficient_tokens` | Legacy wallet |
| 402 | `subscription_inactive` | License pkg.status ≠ active |
| 403 | `forbidden` | Auth OK but no permission |
| 403 | `no_package` | License has no active package |
| 403 | `quality_not_allowed` | Package doesn't include quality tier |
| 404 | `not_found` | Resource missing |
| 409 | `conflict` | Uniqueness / state conflict |
| 429 | `rate_limited` | Too many requests |
| 503 | `no_keys_allocated` | Customer has 0 keys assigned |
| 503 | `all_providers_failed` | All keys tried, none worked |

### 4.3 The one primary endpoint customers hit

**`POST /v1/ai/complete`** — this is where Pi earns money.

Request:
```json
{
  "messages": [
    {"role":"system","content":"..."},
    {"role":"user","content":"..."}
  ],
  "max_tokens": 1024,
  "temperature": 0.7,
  "quality": "balanced",
  "source_plugin": "pi-seo",
  "source_endpoint": "seo_bot.generate"
}
```

Response (success):
```json
{
  "success": true,
  "text": "The generated content...",
  "pi_tokens_charged": 350,
  "tokens_used_period": 123806,
  "tokens_limit_period": 2000000,
  "input_tokens": 150,
  "output_tokens": 200
}
```

Response (quota exceeded 402):
```json
{
  "code": "quota_exceeded",
  "message": "Token quota exceeded: 2000000/2000000 Pi tokens used this period.",
  "detail": {
    "used": 2000000,
    "limit": 2000000,
    "period_starts_at": "2026-04-01T00:00:00Z",
    "period_ends_at": "2026-05-01T00:00:00Z"
  }
}
```

**Never exposes:** `provider_slug`, `provider_key_id`, `upstream_cost_cents`, `api_key`.

### 4.4 Token accounting (critical)

**Flow inside `CompletionService`:**
```
1. QuotaService.check(license_id, estimated_tokens, quality)
   → raises QuotaExceeded if used + estimated > limit
   → raises QualityNotAllowed if quality ∉ package.allowed_qualities
   → raises NoPackage if no license_package row

2. KeyAllocator.keys_for_license(license_id)
   → SELECT keys WHERE allocated_to_license_id = :id
                 AND status = 'allocated'
                 AND health_status != 'down'
   ORDER BY monthly_used_tokens ASC   -- least-used first

3. Filter by quality:
   - fast     → provider.tier = 'free' only
   - balanced → tier in (free, paid) but free priority
   - best     → tier in (free, paid), paid open for quality

4. Loop keys, try upstream:
   try:
     result = adapter.complete(messages, api_key=key.key_value, ...)
     pi_tokens = result.input_tokens * provider.pi_tokens_per_input
              + result.output_tokens * provider.pi_tokens_per_output
     pi_tokens = max(1, int(round(pi_tokens)))
   except:
     KeyAllocator.mark_health(key.id, success=False, error=...)
     continue   # try next key

5. On success:
   - KeyAllocator.mark_health(key.id, success=True)
   - KeyAllocator.add_tokens_used(key.id, pi_tokens)
     → if monthly_used >= monthly_quota: status = 'exhausted'
   - QuotaService.add_used(license_id, pi_tokens)
     → license_packages.current_period_tokens_used += pi_tokens
     → license_packages.current_period_requests += 1
     → license_packages.lifetime_tokens_used += pi_tokens
   - AiUsage.insert(license_id, provider_key_id, input/output, pi_charged, upstream_cost_cents, latency_ms, status='success')

6. Return Completion(text, pi_tokens_charged, used_period, limit_period, ...)
```

**Monthly reset** (cron 00:05 UTC on day 1 of month):
```
POST /v1/admin/keys/reset-period  → 
  UPDATE ai_provider_keys
    SET monthly_used_tokens = 0,
        period_started_at = NOW()
  UPDATE ai_provider_keys
    SET status = CASE
      WHEN allocated_to_license_id IS NULL THEN 'available'
      ELSE 'allocated'
    END
  WHERE status = 'exhausted';

  UPDATE license_packages
    SET current_period_started_at = NOW(),
        current_period_tokens_used = 0,
        current_period_requests = 0
  WHERE status = 'active';
```

---

## 5. FILTERING IMPLEMENTATION PATTERN (Frontend)

Use this shape in every filterable page:

```jsx
import { useSearchParams } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce"; // or write inline

function useListFilters(defaults) {
  const [sp, setSp] = useSearchParams();
  const filters = Object.fromEntries(sp);
  const setFilter = (patch) => {
    const next = new URLSearchParams(sp);
    Object.entries(patch).forEach(([k, v]) => {
      if (v === "" || v == null) next.delete(k);
      else next.set(k, String(v));
    });
    setSp(next, { replace: true });
  };
  return [{ ...defaults, ...filters }, setFilter];
}

function FilterBar({ filters, setFilter }) {
  const [search, setSearch] = useState(filters.q || "");
  const pushSearch = useDebouncedCallback((v) => setFilter({ q: v, offset: 0 }), 300);
  return (
    <form className="row" style={{ gap: "var(--s-3)", flexWrap: "wrap" }}>
      <Input
        type="search" placeholder="Tìm…" value={search}
        onChange={(e) => { setSearch(e.target.value); pushSearch(e.target.value); }}
        leadingIcon="search" style={{ width: "280px" }}
      />
      <Select value={filters.status || ""} options={[{label:"Mọi status",value:""},...]}
        onChange={(e) => setFilter({ status: e.target.value, offset: 0 })} />
      {/* more filters */}
      {Object.keys(filters).length > 0 && (
        <Button variant="ghost" onClick={() => setFilter({ q: "", status: "", tier: "", offset: 0 })}>
          Clear filters
        </Button>
      )}
    </form>
  );
}
```

---

## 6. DELIVERABLES

Gemini produces:

### 6.1 File list (expected ~40 files touched)
- Update every admin page listed in §1 with full filters + URL persistence
- Update customer pages §2 to hit new endpoints
- Add `useListFilters` hook to `src/hooks/`
- Add `formatTokens`, `formatUSD`, `formatVND`, `formatRelative` to `src/lib/format.js`
- Add `useDebounce` hook if not already
- Update `src/lib/api-client.js` with new methods listed in §1
- Ensure every page has `<SeoMeta>` meta tags

### 6.2 Backend additions (if missing — annotate clearly)
- Facet aggregations in license list
- New customer-scoped endpoints (`/v1/cloud/licenses`, `/v1/cloud/usage/detail`, `/v1/cloud/billing/*`)
- Audit log table + service
- `subscriber_count` in `/admin/packages` response
- Sort / filter params on existing endpoints (license, keys, providers, users)

Each backend gap: file path + schema + 1-paragraph diff sketch. NO code — let human review before implementing.

### 6.3 Commits
8 commits, 1 per admin page + 1 per customer page + 1 for shared hooks + 1 for api-client update. Each commit independently testable.

### 6.4 Tests
Add 1 `.test.mjs` per page in `tests/pages/` covering:
- Filter roundtrips (set filter → URL updates → refresh → filter persists)
- Pagination (next → offset changes → prev → back)
- Empty state render
- Error state render
- At least one mutation (create / delete)

Use node `--test` (already in `package.json`), no external test framework.

---

## 7. CONSTRAINTS

- Do NOT install Tailwind, shadcn, MUI, or any UI kit
- Use existing primitives in `src/components/ui/*` only
- Use CSS custom properties from `src/styles/tokens.css` — never hardcode colors
- Use the existing utility classes from `src/styles/base.css`:
  `.stack`, `.row`, `.grid` + `--cols-2/3/4/auto`, `.container`, `.mt-2/4`, `.py-4/16`, `.text-12..48`, `.font-semibold`, `.muted`, `.mono`
- If you need a utility class that doesn't exist, ADD it to `base.css`, don't invent Tailwind-style arbitrary syntax like `h-[520px]` or `px-6`
- Vietnamese UI text; preserve existing phrases verbatim
- No emoji in new code (use `<Icon name="..."/>` from `icons.jsx`)
- Every interactive element has `aria-label` or visible text

---

## 8. ACCEPTANCE CRITERIA

At the end, admin should be able to:

1. ☑ Filter licenses by package + expires_in="30d" → see 20 rows → paginate → deep-link the URL → reload → filter state persists
2. ☑ Search "gmail" in license email → debounced 300ms → sees 8 results → clear filters with 1 button
3. ☑ Open a license detail → see package card + allocated keys + 30-day chart + audit log in 1 modal — all parallel-loaded
4. ☑ Allocate 5 Groq keys to license #42 in 3 clicks from detail modal
5. ☑ Bulk import 50 keys from CSV — see "added 48, skipped 2 (duplicate slug)"
6. ☑ Test a specific key → see "✓ 420ms — pong" inline
7. ☑ Filter keys by `status=exhausted` → reset-period button → all go back to allocated
8. ☑ Navigate usage page with `days=90, plugin=pi-seo, provider=groq` → see filtered stats + chart
9. ☑ Audit log shows "admin@... revoked license #42 at 2026-04-17 14:30" with expandable diff

Customer should be able to:

1. ☑ Open /app → see package name, quota 3.2%/used, 30-day chart, plugin breakdown
2. ☑ Open /app/usage → filter `days=7, plugin=pi-seo` → chart refilters
3. ☑ Never see provider slug, key string, or upstream cost ANYWHERE
4. ☑ Try to call /v1/ai/complete when quota exceeded → see 402 with structured error
5. ☑ Copy license key from /app/licenses → pasted value = full key (not masked)

---

**End of spec. Target execution: ~15-20 hours. Ship admin first (§1.1-1.11), then customer (§2).**
