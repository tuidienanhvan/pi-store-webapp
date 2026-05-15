import { api } from "@/_shared/api/api-client";

/**
 * Cron API: Giám sát và điều khiển các tác vụ tự động chạy ngầm.
 */
export const cronApi = {
  status: () => api.admin.cronStatus(),
  run: (slug) => api.admin.runCron(slug),
};
