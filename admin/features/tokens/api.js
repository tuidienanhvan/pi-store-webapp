import { api } from "@/_shared/api/api-client";

/**
 * Token Ledger API — admin financial transaction log.
 *
 * Wraps GET /v1/admin/tokens/ledger from pi-backend.
 * Response shape: { items: TokenLedgerRow[], summary, total, limit, offset }
 *
 * Unlike most admin endpoints, this one returns the envelope as-is (not
 * wrapped in BaseResponse), so api-client's auto-unwrap doesn't apply.
 * Caller gets the full response object back.
 */
export const tokenLedgerApi = {
  /**
   * Fetch a page of ledger entries.
   *
   * Params:
   *   tenant_id   int (0 = all)
   *   reason      "admin_recharge" | "bonus" | "refund" | "purchase" | "adjust"
   *   date_from   ISO datetime
   *   date_to     ISO datetime
   *   delta_sign  "credit" | "debit" | ""
   *   q           free-text search in note
   *   limit       1..500 (default 50)
   *   offset      pagination
   */
  list: (params = {}) => api.admin.tokenLedger(params),
};
