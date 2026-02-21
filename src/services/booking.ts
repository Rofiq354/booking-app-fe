import api from "./api";

export interface Booking {
  id: number | string;
  totalPrice: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  createdAt: string;
  paymentProof?: string;
  user: {
    name: string;
    email?: string;
  };
  field: {
    name: string;
    price: number;
    image?: string | null;
  };
  slot: {
    startTime: string;
    endTime: string;
  };
}

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export const bookingService = {
  // Ambil semua data booking (untuk Admin)
  getAllBookings: async (): Promise<ApiResponse<Booking[]>> => {
    const response = await api.get(`/admin/booking`);
    return response.data;
  },

  // Ambil booking milik user yang sedang login — GET /detail-booking
  getUserBookings: async (): Promise<ApiResponse<Booking[]>> => {
    const response = await api.get(`/detail-booking`);
    return response.data;
  },

  // Buat booking baru (untuk User)
  createBooking: async (
    fieldId: number,
    slotId: number,
  ): Promise<ApiResponse<Booking>> => {
    const response = await api.post(`/booking`, { fieldId, slotId });
    return response.data;
  },

  // Update status booking (misal Konfirmasi Pembayaran)
  approveBooking: async (
    id: number,
    status: string,
  ): Promise<ApiResponse<Booking>> => {
    const response = await api.patch(`/admin/booking/${id}/approve`, {
      status,
    });
    return response.data;
  },

  cancleBookingUser: async (
    id: number,
    status: string,
  ): Promise<ApiResponse<Booking>> => {
    const response = await api.patch(`/booking/${id}/cancel`, { status });
    return response.data;
  },

  rejectBooking: async (
    id: number,
    status: string,
  ): Promise<ApiResponse<Booking>> => {
    const response = await api.patch(`/admin/booking/${id}/cancel`, { status });
    return response.data;
  },
};
