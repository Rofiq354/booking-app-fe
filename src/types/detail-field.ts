// Types dari field detail API
export interface Review {
  id: number;
  rating: number;
  comment: string;
  userId: number;
  fieldId: number;
  bookingId: number;
  createdAt: string;
  user: { name: string };
}

export interface RatingStats {
  average: number;
  total: number;
}

export interface FieldDetail {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
  price: number;
  createdAt: string;
  updatedAt: string;
  slots: unknown[];
  reviews: Review[];
  ratingStats: RatingStats;
}

// Helpers
export const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  }) + " WIB";

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
