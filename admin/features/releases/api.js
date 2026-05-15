import { api } from "@/_shared/api/api-client";

/**
 * Releases API: Quản lý các phiên bản ứng dụng và file thực thi.
 */
export const releasesApi = {
  list: () => api.admin.releases(),
  upload: (formData) => api.admin.uploadRelease(formData),
};
