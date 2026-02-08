import api from "./api";

export interface Booking {
  id: number | string;
  totalPrice: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  createdAt: string;
  paymentProof?: string; // Jika ada field bukti bayar
  user: {
    name: string;
    email: string;
  };
  field: {
    name: string;
    price: number;
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
    const response = await api.get(`/booking`);
    return response.data;
  },

  // Update status booking (misal Konfirmasi Pembayaran)
  updateBookingStatus: async (
    id: number,
    status: string,
  ): Promise<ApiResponse<Booking>> => {
    const response = await api.patch(`/booking/${id}/status`, { status });
    return response.data;
  },
};
