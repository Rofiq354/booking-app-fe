import api from "./api";

// Slot waktu yang tersedia di lapangan
export interface Slot {
  id: number;
  fieldId: number;
  startTime: string; // ISO 8601
  endTime: string; // ISO 8601
  createdAt: string;
}

// Data lapangan sesuai response API
export interface FieldRequest {
  id: number;
  name: string;
  description: string | null;
  image: string | null; // Full URL dari Cloudinary
  price: number; // Dalam rupiah, misal: 100000
  slots?: Slot[]; // Opsional, ada di GET /field
}

export interface ApiResponse {
  status: string;
  message: string;
  data: FieldRequest[] | FieldRequest;
}

export const fieldService = {
  // Ambil semua data lapangan (beserta slots)
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

  // Update lapangan
  updateField: async (id: number, data: FormData) => {
    const response = await api.put<ApiResponse>(`/admin/field/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Hapus lapangan
  deleteField: async (id: number) => {
    const response = await api.delete<ApiResponse>(`/admin/field/${id}`);
    return response.data;
  },

  getDetailField: async (id: string | number) => {
    const response = await api.get<ApiResponse>(`/field/${id}`);
    return response.data;
  },
};
