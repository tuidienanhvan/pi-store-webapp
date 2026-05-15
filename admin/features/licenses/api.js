import { api } from "@/_shared/api/api-client";

/**
 * Licenses API: Các thao tác liên quan đến giấy phép.
 */
export const licensesApi = {
  // Lấy danh sách giấy phép
  list: (filters) => api.admin.licenses(filters),
  
  // Thu hồi giấy phép
  revoke: (id) => api.admin.revokeLicense(id),
  
  // Kích hoạt lại giấy phép
  reactivate: (id) => api.admin.reactivateLicense(id),
  
  // Xóa giấy phép
  delete: (id) => api.admin.deleteLicense(id),
  
  // Lấy danh sách gói dịch vụ (dành cho bộ lọc)
  listPackages: () => api.admin.packages(),
};
