import { Star, MessageSquare } from "lucide-react";
import type { RatingStats, Review } from "../../../../types/detail-field";

interface ReviewSectionProps {
  reviews: Review[];
  ratingStats: RatingStats;
}

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

const ReviewSection = ({ reviews, ratingStats }: ReviewSectionProps) => {
  // Hitung distribusi bintang
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

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
        {/* Score besar */}
        <div className="flex flex-col items-center justify-center sm:w-32 flex-shrink-0">
          <div className="text-6xl font-black text-foreground leading-none">
            {ratingStats.average.toFixed(1)}
          </div>
          <StarRating rating={Math.round(ratingStats.average)} size={16} />
          <span className="text-xs text-muted-foreground mt-1.5">
            dari {ratingStats.total} ulasan
          </span>
        </div>

        {/* Separator */}
        <div className="hidden sm:block w-px bg-border" />
        <div className="sm:hidden h-px w-full bg-border" />

        {/* Bar distribusi */}
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

      {/* Review Cards */}
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

            const timeAgo = new Date(review.createdAt).toLocaleDateString(
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
                {/* User row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-primary/10 text-primary text-sm font-black">
                      {initials}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-foreground leading-none">
                        {review.user.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {timeAgo}
                      </div>
                    </div>
                  </div>
                  <StarRating rating={review.rating} />
                </div>

                {/* Comment */}
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
