import { Link } from "react-router-dom";
import { formatPrice } from "../../../utils/format";
import type { TimeSlotResponse } from "../../../services/time-slot";

/* ── Fallback Court Icon ─────────────────────────────────────── */
const CourtIcon = () => (
  <svg
    width="60"
    height="60"
    viewBox="0 0 64 64"
    fill="none"
    className="opacity-20 transition-opacity group-hover:opacity-40"
  >
    <rect
      x="4"
      y="4"
      width="56"
      height="56"
      rx="4"
      stroke="currentColor"
      strokeWidth="2"
      strokeDasharray="5 3"
    />
    <line
      x1="32"
      y1="4"
      x2="32"
      y2="60"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <circle cx="32" cy="32" r="10" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="32" cy="32" r="2.5" fill="currentColor" />
    <rect
      x="4"
      y="24"
      width="9"
      height="16"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <rect
      x="51"
      y="24"
      width="9"
      height="16"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

/* ── Main Card ───────────────────────────────────────────────── */
const FieldCard = ({
  field,
  delay = "0s",
}: {
  field: TimeSlotResponse;
  delay: string;
}) => {
  const slots = field.slots ?? [];
  const slotCount = slots.length;

  const badge =
    slotCount === 0
      ? { label: "Penuh", class: "badge-booked" }
      : { label: `${slotCount} Slot`, class: "badge-available" };

  return (
    <Link
      to={`/fields/${field.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-lg"
      style={{
        animationDelay: delay,
      }}
    >
      {/* ── Image Section ── */}
      <div className="relative h-52 shrink-0 overflow-hidden flex items-center justify-center bg-muted text-primary">
        {field.image ? (
          <img
            src={field.image}
            alt={field.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="bg-primary-bg w-full h-full flex items-center justify-center">
            <CourtIcon />
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <div
            className={`glass flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-[0.15em] shadow-sm ${badge.class}`}
          >
            <span className="relative flex h-2 w-2">
              {slotCount > 0 && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${slotCount > 0 ? "bg-primary" : "bg-destructive"}`}
              ></span>
            </span>
            {badge.label}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-card via-card/40 to-transparent" />
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4">
          {/* Judul: Balikin ke 2xl biar gagah */}
          <h3 className="font-['Barlow_Condensed'] text-2xl font-black italic uppercase leading-none text-foreground transition-colors group-hover:text-primary mb-2">
            {field.name}
          </h3>

          {/* Rating Section: Dibuat Bold & Besar */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    // Ukuran icon w-4 (16px) biar jelas
                    i < Math.floor(Number(field.averageRating))
                      ? "text-warning fill-warning"
                      : "text-muted fill-muted"
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>

            {/* Angka Rating: Pake Barlow biar Bold nya mantap */}
            <span className="font-['Barlow_Condensed'] text-lg font-black italic text-foreground leading-none">
              {field.averageRating}
            </span>

            <span className="text-muted-foreground text-xs font-bold uppercase tracking-tighter">
              ({field.totalReviews} Ulasan)
            </span>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Harga Mulai
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-['Barlow_Condensed'] text-2xl font-black italic leading-none text-primary">
                {formatPrice(field.price)}
              </span>
              <span className="text-xs text-muted-foreground italic">/jam</span>
            </div>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:-rotate-45">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

export const FieldCardSkeleton = () => (
  <div className="rounded-2xl border border-border bg-card overflow-hidden animate-pulse">
    <div className="h-44 bg-muted" />
    <div className="p-5 space-y-3">
      <div className="h-5 w-3/4 rounded-lg bg-muted" />
      <div className="h-3 w-full rounded-lg bg-muted" />
      <div className="flex justify-between pt-2 gap-3">
        <div className="h-7 w-24 rounded-lg bg-muted" />
        <div className="h-9 w-20 rounded-xl bg-muted" />
      </div>
    </div>
  </div>
);

export default FieldCard;
