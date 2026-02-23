import { CheckCircle, Mail, MessageSquare, Star, X } from "lucide-react";
import type { Booking } from "../../../../services/booking";
import { type RatingStats, type Review } from "../../../../types/detail-field";
import {
  fullFormatPrice as formatPrice,
  formatTime,
} from "../../../../utils/format";
import { useState } from "react";
import toast from "react-hot-toast";
import { reviewService } from "../../../../services/review";

// ── BookingSuccessModal ───────────────────────────────────────────────────────
interface BookingSuccessModalProps {
  booking: Booking;
  onClose: () => void;
}

export const BookingSuccessModal = ({
  booking,
  onClose,
}: BookingSuccessModalProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div className="w-full max-w-md bg-card rounded-3xl border border-border shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-primary px-6 pt-8 pb-6 flex flex-col items-center gap-3 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
        >
          <X size={16} className="text-primary-foreground" />
        </button>
        <div className="w-16 h-16 rounded-full bg-primary-foreground/15 flex items-center justify-center">
          <CheckCircle size={32} className="text-primary-foreground" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-black text-primary-foreground">
            Booking Berhasil!
          </h3>
          <p className="text-primary-foreground/70 text-sm mt-1">
            Email konfirmasi telah dikirim ke inbox kamu
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-4">
        <div className="space-y-3">
          {[
            { label: "Lapangan", value: booking.field.name },
            {
              label: "Waktu",
              value: booking.slot
                ? `${formatTime(booking.slot.startTime)} – ${formatTime(booking.slot.endTime)}`
                : "—",
            },
            {
              label: "Harga",
              value: formatPrice(booking.field.price),
              highlight: true,
            },
            { label: "Status", value: booking.status, badge: true },
          ].map(({ label, value, highlight, badge }) => (
            <div
              key={label}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <span className="text-sm text-muted-foreground font-medium">
                {label}
              </span>
              {badge ? (
                <span className="badge-pending px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wide border">
                  {value}
                </span>
              ) : (
                <span
                  className={`text-sm font-bold ${highlight ? "text-primary" : "text-foreground"}`}
                >
                  {value}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-start gap-3 p-3 rounded-xl bg-info/10 border border-info/20">
          <Mail size={16} className="text-info flex-shrink-0 mt-0.5" />
          <p className="text-xs text-info font-medium leading-relaxed">
            Cek email kamu untuk detail booking dan instruksi pembayaran.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-black text-sm uppercase tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          Oke, Mengerti!
        </button>
      </div>
    </div>
  </div>
);

// ── StarRating ────────────────────────────────────────────────────────────────
const StarRating = ({
  rating,
  size = 14,
}: {
  rating: number;
  size?: number;
}) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        size={size}
        className={
          i <= rating ? "text-warning fill-warning" : "text-border fill-border"
        }
      />
    ))}
  </div>
);

// ── RatingBar ─────────────────────────────────────────────────────────────────
const RatingBar = ({
  star,
  count,
  total,
}: {
  star: number;
  count: number;
  total: number;
}) => {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-muted-foreground w-3 text-right">
        {star}
      </span>
      <Star size={10} className="text-warning fill-warning flex-shrink-0" />
      <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
        <div
          className="h-full rounded-full bg-warning transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[10px] text-muted-foreground w-4">{count}</span>
    </div>
  );
};

// ── ReviewSection ─────────────────────────────────────────────────────────────
interface ReviewSectionProps {
  reviews: Review[];
  ratingStats: RatingStats;
  eligibleBookingId: number;
  onReviewSuccess: () => void;
}

const ReviewSection = ({
  reviews,
  ratingStats,
  eligibleBookingId,
  onReviewSuccess,
}: ReviewSectionProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  const handleSubmit = async () => {
    if (rating === 0) return toast.error("Bintangnya diisi dulu yuk!");
    if (!comment.trim())
      return toast.error("Kasih ulasan dikit dong buat lapangannya.");

    setIsSubmitting(true);
    try {
      // Panggil service yang tadi kita bahas
      await reviewService.createReview({
        bookingId: eligibleBookingId,
        rating,
        comment,
      });

      toast.success("Review berhasil dikirim, makasih ya!");
      setRating(0);
      setComment("");
      onReviewSuccess(); // Ini bakal refresh data di FieldDetailPage
    } catch (error: unknown) {
      toast.error(error.response?.data?.message || "Gagal kirim review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageSquare size={18} className="text-primary" />
        <h2 className="text-lg font-black tracking-tight text-foreground">
          Ulasan Pelanggan
        </h2>
        <span className="ml-auto text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
          {ratingStats.total} ulasan
        </span>
      </div>

      {/* Rating Summary */}
      <div className="flex flex-col sm:flex-row gap-6 p-5 rounded-2xl bg-muted/40 border border-border">
        <div className="flex flex-col items-center justify-center sm:w-32 flex-shrink-0">
          <div className="text-6xl font-black text-foreground leading-none">
            {ratingStats.average.toFixed(1)}
          </div>
          <StarRating rating={Math.round(ratingStats.average)} size={16} />
          <span className="text-xs text-muted-foreground mt-1.5">
            dari {ratingStats.total} ulasan
          </span>
        </div>
        <div className="hidden sm:block w-px bg-border" />
        <div className="sm:hidden h-px w-full bg-border" />
        <div className="flex-1 space-y-2 justify-center flex flex-col">
          {distribution.map(({ star, count }) => (
            <RatingBar
              key={star}
              star={star}
              count={count}
              total={ratingStats.total}
            />
          ))}
        </div>
      </div>

      {eligibleBookingId && (
        <div className="p-6 rounded-3xl bg-primary/5 border-2 border-primary/20 space-y-4 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
              <Star size={20} className="fill-current" />
            </div>
            <div>
              <h3 className="text-sm font-black text-foreground uppercase tracking-tight">
                Gimana mainnya kemarin?
              </h3>
              <p className="text-[11px] text-muted-foreground font-medium">
                Berikan rating dan ulasan untuk lapangan ini
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Star Picker */}
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-transform active:scale-90 hover:scale-110"
                >
                  <Star
                    size={28}
                    className={
                      star <= rating
                        ? "text-warning fill-warning"
                        : "text-border fill-transparent"
                    }
                  />
                </button>
              ))}
            </div>

            {/* Comment Area */}
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ceritain kondisi lapangan, lampu, atau pelayanannya..."
              className="w-full bg-background border border-border rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              rows={3}
            />

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-black text-[11px] uppercase tracking-[0.15em] hover:opacity-90 disabled:opacity-50 transition-all shadow-md active:scale-[0.98]"
            >
              {isSubmitting ? "Mengirim..." : "Kirim Ulasan"}
            </button>
          </div>
        </div>
      )}

      {/* Cards */}
      {reviews.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-10 rounded-2xl border border-dashed border-border bg-muted/30">
          <MessageSquare size={28} className="text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground font-medium">
            Belum ada ulasan untuk lapangan ini.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => {
            const initials = review.user.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")
              .toUpperCase();
            const date = new Date(review.createdAt).toLocaleDateString(
              "id-ID",
              {
                day: "numeric",
                month: "long",
                year: "numeric",
              },
            );
            return (
              <div
                key={review.id}
                className="p-5 rounded-2xl bg-card border border-border hover:border-primary/20 hover:bg-primary/5 transition-all duration-200 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-primary/10 text-primary text-sm font-black">
                      {initials}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-foreground leading-none">
                        {review.user.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {date}
                      </div>
                    </div>
                  </div>
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed pl-12">
                  "{review.comment}"
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
