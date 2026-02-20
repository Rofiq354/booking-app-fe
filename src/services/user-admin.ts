import api from "./api";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdminPayload {
  name: string;
  email: string;
  password: string;
}

// Interface Response standar backend kamu
interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export const adminService = {
  getAllAdmins: async (): Promise<ApiResponse<AdminUser[]>> => {
    const response = await api.get(`/admin/admin`);
    return response.data;
  },

  createAdmin: async (
    payload: CreateAdminPayload,
  ): Promise<ApiResponse<AdminUser>> => {
    const response = await api.post(`/admin/create`, payload);
    return response.data;
  },

  // deleteAdmin: async (id: number): Promise<ApiResponse<null>> => {
  //   const response = await api.delete(`/admin/${id}`);
  //   return response.data;
  // },
};
