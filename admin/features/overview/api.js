import { api } from "@/_shared/api/api-client";

/**
 * Overview API: Lấy dữ liệu tổng quan hệ thống.
 */
export const fetchOverviewData = async () => {
  const res = await api.admin.overview();
  if (!res) throw new Error("Không nhận được dữ liệu từ hệ thống");
  
  const down = Number(res.down_providers || 0);
  
  return {
    revenue: {
      "30d": Number(res.revenue_30d || 0),
      "90d": Number(res.revenue_90d || 0),
      "ytd": Number(res.revenue_ytd || 0),
      "mom_growth": Number(res.margin_pct || 0),
    },
    licenses: { 
      active: Number(res.active_licenses || 0), 
      new_this_week: Number(res.new_licenses_7d || 0) 
    },
    tokens: {
      spent_30d: Number(res.tokens_spent_30d || 0),
      projected_month_end: Number(res.projected_tokens_month_end || 0),
    },
    system: {
      api: res.system_api || "healthy",
      worker: res.system_worker || "healthy",
      db: res.system_db || "healthy",
      redis: res.system_redis || "healthy",
    },
    providers: res.providers || [
      { name: "Upstream", status: Number(res.healthy_providers || 0) > 0 ? "healthy" : "degraded" },
      { name: "Downstream", status: down > 0 ? "down" : "healthy" },
    ],
    keyPool: { 
      total: Number(res.keys_total || 0), 
      available: Number(res.keys_available || 0), 
      allocated: Number(res.keys_allocated || 0), 
      exhausted: down 
    },
    alerts: down > 0 ? [{ id: 1, type: "danger", text: `${down} nhà cung cấp đang gặp sự cố.` }] : [],
    expiringLicenses: res.expiring_licenses || [],
  };
};
