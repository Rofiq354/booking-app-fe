import api from "./api";

export interface FieldRequest {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
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
    console.log(response);
    return response.data;
  },

  // Buat lapangan baru
  createField: async (data: FormData) => {
    const response = await api.post<ApiResponse>("/field", data, {
      headers: {
        "Content-Type": "multipart/form-data", // Penting untuk upload file
      },
    });
    return response.data;
  },

  // Buat lapangan baru
  updateField: async (id: number, data: FormData) => {
    const response = await api.put<ApiResponse>(`/field/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Hapus lapangan
  deleteField: async (id: number) => {
    const response = await api.delete<ApiResponse>(`/field/${id}`);
    return response.data;
  },
};
