import api from "./api";
import type { TimeSlotResponse } from "./time-slot";

export interface FieldRequest {
  id: number;
  name: string;
  description: string | null;
  image: string | null | File;
  price: number;
}

export interface ApiResponse {
  status: string;
  message: string;
  data: FieldRequest[] | FieldRequest | TimeSlotResponse[] | TimeSlotResponse;
}

export const fieldService = {
  getAllFields: async () => {
    const response = await api.get<ApiResponse>("/field");
    return response.data;
  },

  // Buat lapangan baru
  createField: async (data: FormData) => {
    const response = await api.post<ApiResponse>("/admin/field", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  updateField: async (id: number, data: FormData) => {
    const response = await api.put(`/admin/field/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deleteField: async (id: number) => {
    const response = await api.delete<ApiResponse>(`/admin/field/${id}`);
    return response.data;
  },

  getDetailField: async (id: string | number) => {
    const response = await api.get<ApiResponse>(`/field/${id}`);
    return response.data;
  },
};
