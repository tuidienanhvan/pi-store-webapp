import { api } from "@/_shared/api/api-client";

/**
 * Usage API: Lấy dữ liệu sử dụng API và hiệu suất hệ thống.
 */
export const fetchUsageData = async (filters) => {
  const res = await api.admin.usage(filters);
  if (!res) throw new Error("Không nhận được dữ liệu sử dụng");
  
  const daily = res.daily || [];
  const maxDaily = Math.max(1, ...daily.map((d) => (d.success || 0) + (d.fail || 0)));
  
  return { 
    ...res, 
    dailyStats: daily, 
    maxDaily, 
    errors: res.errors || [] 
  };
};
