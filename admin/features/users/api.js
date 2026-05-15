import { api } from "@/_shared/api/api-client";

/**
 * Users API: Quản lý người dùng, định danh và hồ sơ cá nhân.
 */
export const usersApi = {
  list: (params) => api.admin.users(params),
  get: (id) => api.admin.getUser(id),
  updateProfile: (id, data) => api.admin.updateUserProfile(id, data),
};
