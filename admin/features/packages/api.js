import { api } from "@/_shared/api/api-client";

/**
 * Packages API: Quản lý các gói sản phẩm và cấu hình.
 */
export const packagesApi = {
  list: () => api.admin.packages(),
  create: (data) => api.admin.createPackage(data),
  update: (slug, data) => api.admin.updatePackage(slug, data),
  delete: (slug) => api.admin.deletePackage(slug),
};
