import { api } from "@/_shared/api/api-client";

/**
 * Tenants API — SaaS customer management.
 *
 * Wraps the backend /v1/admin/saas/tenants/* endpoints. Each method
 * unwraps the BaseResponse envelope (returns .data directly) so callers
 * don't need to know about the response shape.
 *
 * Backend contract: see pi-backend/app/saas/admin_router.py +
 * pi-backend/app/saas/schemas.py (TenantItem, TenantCreate, etc.).
 */
const unwrap = (res) => (res && Object.prototype.hasOwnProperty.call(res, "data") ? res.data : res);

export const tenantsApi = {
  /**
   * List tenants. Params:
   *   q       free-text search across domain + license_key
   *   status  filter by tenant status (active/suspended/...)
   *   tier    filter by tier slug (free/pro/max/enterprise)
   *   limit   page size (default 50, max 200)
   *   offset  pagination offset
   * Returns: array of TenantItem
   */
  list: async (params = {}) => {
    const res = await api.admin.saasTenants(params);
    return unwrap(res) || [];
  },

  get: async (id) => unwrap(await api.admin.getSaasTenant(id)),

  /**
   * Create a tenant. Payload:
   *   license_key  string (8-96 chars, auto-uppercased server-side)
   *   domain       string (auto-lowercased, scheme stripped)
   *   site_url     string (optional)
   *   tier         "free" | "pro" | "max" | "enterprise"
   *   status       "active" | "suspended" | "pending"
   */
  create: async (payload) => unwrap(await api.admin.createSaasTenant(payload)),

  /**
   * Update a tenant. Payload (all optional):
   *   tier, status, features[]
   */
  update: async (id, payload) => unwrap(await api.admin.updateSaasTenant(id, payload)),

  /**
   * Recharge tokens. Payload:
   *   delta   int (1..1_000_000)
   *   reason  string (default "admin_recharge")
   *   note    string (optional)
   * Returns: { balance, transaction_id }
   */
  recharge: async (id, payload) => unwrap(await api.admin.rechargeSaasTenant(id, payload)),
};
