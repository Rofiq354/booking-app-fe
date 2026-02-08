import api from "./api";

export interface FieldRequest {
  id: number;
  name: string;
  description: string | null;
  price: number;
}

export interface ApiResponse {
  status: string;
  message: string;
  data: FieldRequest[] | FieldRequest;
}

export const fieldService = {
  // Ambil semua data lapangan
  getAllFields: async () => {
    const response = await api.get<ApiResponse>("/field");
    return response.data;
  },

  // Buat lapangan baru
  createField: async (data: FieldRequest) => {
    const response = await api.post<ApiResponse>("/field", data);
    return response.data;
  },

  // Buat lapangan baru
  updateField: async (id: number, data: FieldRequest) => {
    const response = await api.put<ApiResponse>(`/field/${id}`, data);
    return response.data;
  },

  // Hapus lapangan
  deleteField: async (id: number) => {
    const response = await api.delete<ApiResponse>(`/field/${id}`);
    return response.data;
  },
};
