import api from "./api";
import type { FieldRequest } from "./field";

export interface TimeSlot {
  id: number;
  startTime: string;
  endTime: string;
  booked?: boolean;
  bookingId?: number;
}

// Data yang dikembalikan oleh /timeslot/:fieldId
export interface TimeSlotResponse extends FieldRequest {
  id: number;
  name: string;
  description: string | null;
  price: number;
  slots: TimeSlot[];
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export const timeSlotService = {
  // Buat Slot Waktu Baru
  createSlots: async (
    fieldId: number,
    data: { date: string; startHour: number; endHour: number },
  ) => {
    // Menggunakan generic <ApiResponse<TimeSlotResponse>>
    const response = await api.post<ApiResponse<TimeSlotResponse>>(
      `/admin/timeslot/${fieldId}`,
      data,
    );
    return response.data;
  },

  // Ambil semua data slot waktu
  getSlots: async (fieldId: number) => {
    const response = await api.get<ApiResponse<TimeSlotResponse>>(
      `/timeslot/${fieldId}`,
    );
    return response.data;
  },

  // Update Slot Waktu
  // updateTimeSlot: async (fieldId: number, data: TimeSlotRequest) => {
  //   const response = await api.put<ApiResponse>(`/timeslot/${fieldId}`, data);
  //   return response.data;
  // },
};
