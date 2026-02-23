// services/review.ts (Disarankan dipisah agar rapi)
import api from "./api";

export interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  user: { name: string };
}

export interface EligibilityResponse {
  eligible: boolean;
  bookingId: number | null;
}

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export const reviewService = {
  // 1. Fungsi untuk cek apakah user punya booking yang bisa direview
  checkEligibility: async (
    fieldId: number | string,
  ): Promise<ApiResponse<EligibilityResponse>> => {
    const response = await api.get(`/review/check-eligibility/${fieldId}`);
    return response.data;
  },

  // 2. Fungsi untuk submit review (POST /review)
  createReview: async (payload: {
    bookingId: number;
    rating: number;
    comment: string;
  }): Promise<ApiResponse<Review>> => {
    const response = await api.post(`/review`, payload);
    return response.data;
  },
};
