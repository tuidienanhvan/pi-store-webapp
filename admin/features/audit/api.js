import { api } from "@/_shared/api/api-client";

/**
 * Audit API: Truy xuất nhật ký hệ thống và vết thao tác.
 */
export const auditApi = {
  list: (filters) => api.admin.auditLog(filters),
};
