import { api } from "@/_shared/api/api-client";

/**
 * Revenue API: Lấy dữ liệu tài chính và doanh thu.
 */
export const fetchRevenueData = async ({ days }) => {
  const res = await api.admin.revenue({ days });
  if (!res) throw new Error("Không nhận được dữ liệu doanh thu");
  return res;
};
