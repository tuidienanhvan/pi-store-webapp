import { api } from "@/_shared/api/api-client";

/**
 * Providers API: Quản lý các nhà cung cấp AI và kết nối Gateway.
 */
export const providersApi = {
  list: () => api.admin.providers(),
  toggle: (id, enabled) => api.admin.toggleProvider(id, enabled),
  delete: (id) => api.admin.deleteProvider(id),
  test: (id) => api.admin.testProvider(id),
  create: (data) => api.admin.createProvider(data),
  update: (id, data) => api.admin.updateProvider(id, data),
};
