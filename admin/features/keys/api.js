import { api } from "@/_shared/api/api-client";

/**
 * Keys API: Quản lý kho khóa API và cấp phát.
 */
export const keysApi = {
  list: (filters) => api.admin.keys(filters),
  summary: () => api.admin.keysSummary(),
  create: (data) => api.admin.createKey(data),
  delete: (id) => api.admin.deleteKey(id),
  revoke: (id) => api.admin.revokeKey(id),
  reveal: (id) => api.admin.revealKey(id),
  allocate: (data) => api.admin.allocateKeys(data),
  bulkImport: (data) => api.admin.bulkImportKeys(data),
  resetPeriod: () => api.admin.resetKeyPeriod(),
  releaseLicense: (licenseId) => api.admin.releaseLicenseKeys(licenseId),
};
