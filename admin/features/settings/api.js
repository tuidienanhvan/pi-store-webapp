import { api } from "@/_shared/api/api-client";

/**
 * Settings API: Quản lý cấu hình toàn cục, thương hiệu và tính năng hệ thống.
 */
export const settingsApi = {
  get: () => api.admin.getSettings(),
  update: (data) => api.admin.updateSettings(data),
  cronStatus: () => api.admin.cronStatus(),
  runCron: (slug) => api.admin.runCron(slug),
};
