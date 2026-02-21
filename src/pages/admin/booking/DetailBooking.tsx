import { useEffect, useRef, useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import type { Booking } from "../../../services/booking";
import { formatDate, formatTime, fullFormatPrice } from "../../../utils/format";

interface BookingDetailSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onConfirm: (id: number | string) => Promise<void>;
  onReject?: (id: number | string) => Promise<void>;
}

const statusConfig = {
  PENDING: {
    label: "Menunggu Konfirmasi",
    dot: "bg-amber-400",
    badge: "bg-amber-50 text-amber-600 border border-amber-200",
    pulse: true,
  },
  CONFIRMED: {
    label: "Dikonfirmasi",
    dot: "bg-emerald-400",
    badge: "bg-emerald-50 text-emerald-600 border border-emerald-200",
    pulse: false,
  },
  CANCELLED: {
    label: "Dibatalkan",
    dot: "bg-red-400",
    badge: "bg-red-50 text-red-600 border border-red-200",
    pulse: false,
  },
};

const BookingDetailSidebar = ({
  isOpen,
  onClose,
  booking,
  onConfirm,
  onReject,
}: BookingDetailSidebarProps) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const status = booking ? statusConfig[booking.status] : null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`
          fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]
          transition-opacity duration-300
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      />

      {/* Sidebar Panel */}
      <div
        ref={sidebarRef}
        className={`
          fixed top-0 right-0 z-50 h-full w-full max-w-[420px]
          bg-background border-l border-border
          shadow-[var(--shadow-lg-value)]
          flex flex-col
          transition-transform duration-400 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* ── Header ── */}
        <div className="relative overflow-hidden">
          {/* Green gradient header bg */}
          <div className="gradient-primary px-6 pt-6 pb-14">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black tracking-[0.2em] text-white/70 uppercase">
                Detail Booking
              </span>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {booking ? (
              <>
                <p className="text-white/60 text-[11px] font-mono mb-1">
                  #BK-{booking.id.toString().padStart(4, "0")}
                </p>
                <h2 className="text-white text-xl font-black leading-tight">
                  {booking.user?.name}
                </h2>
                <p className="text-white/70 text-xs mt-0.5">
                  {booking.user?.email}
                </p>
              </>
            ) : (
              <div className="space-y-2 animate-pulse">
                <div className="h-3 w-24 bg-white/20 rounded" />
                <div className="h-5 w-40 bg-white/20 rounded" />
                <div className="h-3 w-32 bg-white/20 rounded" />
              </div>
            )}
          </div>

          {/* Decorative arc */}
          <div className="absolute -bottom-[1px] left-0 right-0">
            <svg
              viewBox="0 0 420 40"
              className="w-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0,40 Q210,0 420,40 L420,40 L0,40 Z"
                fill="var(--background)"
              />
            </svg>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 -mt-4">
          {!booking ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 opacity-30"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="text-sm">Pilih booking untuk melihat detail</p>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              {/* Status Badge */}
              {status && (
                <div className="flex items-center justify-center">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-black ${status.badge}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${status.dot} ${status.pulse ? "animate-pulse" : ""}`}
                    />
                    {status.label}
                  </span>
                </div>
              )}

              {/* ── Lapangan Card ── */}
              <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-lg bg-primary-soft flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    Lapangan
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-black text-foreground text-base">
                      {booking.field?.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Harga per sesi
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-primary text-sm font-mono">
                      {fullFormatPrice(booking.field?.price || 0)}
                    </p>
                  </div>
                </div>
              </div>

              {/* ── Jadwal Card ── */}
              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-primary-soft flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    Jadwal Main
                  </span>
                </div>

                <p className="text-xs text-muted-foreground mb-2">
                  {formatDate(booking.slot?.startTime)}
                </p>

                {/* Time range visual */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-muted rounded-xl p-3 text-center">
                    <p className="text-[9px] text-muted-foreground uppercase tracking-widest mb-1">
                      Mulai
                    </p>
                    <p className="text-xl font-black text-foreground font-mono">
                      {formatTime(booking.slot?.startTime)}
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-1 text-muted-foreground">
                    <div className="w-8 h-px bg-border" />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    <div className="w-8 h-px bg-border" />
                  </div>

                  <div className="flex-1 bg-muted rounded-xl p-3 text-center">
                    <p className="text-[9px] text-muted-foreground uppercase tracking-widest mb-1">
                      Selesai
                    </p>
                    <p className="text-xl font-black text-foreground font-mono">
                      {formatTime(booking.slot?.endTime)}
                    </p>
                  </div>
                </div>
              </div>

              {/* ── Ringkasan Pembayaran ── */}
              <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-lg bg-primary-soft flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    Pembayaran
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">
                    Harga Lapangan
                  </span>
                  <span className="text-sm font-semibold text-foreground font-mono">
                    {fullFormatPrice(booking.field?.price || 0)}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm font-black text-foreground">
                    Total
                  </span>
                  <span className="text-base font-black text-primary font-mono">
                    {fullFormatPrice(
                      booking.totalPrice || booking.field?.price || 0,
                    )}
                  </span>
                </div>
              </div>

              {/* ── Created At ── */}
              <div className="flex items-center gap-2 px-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3.5 h-3.5 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-[10px] text-muted-foreground">
                  Dibuat pada{" "}
                  {booking.createdAt ? formatDate(booking.createdAt) : "-"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer Actions ── */}
        {booking && booking.status === "PENDING" && (
          <div className="px-6 py-4 border-t border-border bg-card flex gap-3">
            {/* Reject Button */}
            {onReject && (
              <button
                onClick={() => onReject(booking.id)}
                className="
                  flex-1 py-3 px-4 rounded-xl
                  border border-destructive-border bg-destructive-soft
                  text-destructive text-sm font-black
                  hover:bg-destructive hover:text-white
                  transition-all duration-200
                  active:scale-95
                "
              >
                Tolak
              </button>
            )}

            {/* Confirm Button */}
            <button
              onClick={async () => {
                setIsConfirming(true);
                try {
                  await onConfirm(booking.id);
                } finally {
                  setIsConfirming(false);
                }
              }}
              disabled={isConfirming}
              className="
                flex-[2] py-3 px-4 rounded-xl
                gradient-primary text-white text-sm font-black
                hover:opacity-90
                transition-all duration-200
                active:scale-95
                shadow-md
                disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100
                flex items-center justify-center gap-2
              "
            >
              {isConfirming ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Konfirmasi Booking
                </>
              )}
            </button>
          </div>
        )}

        {/* Footer for non-pending */}
        {booking && booking.status !== "PENDING" && (
          <div className="px-6 py-4 border-t border-border">
            <button
              onClick={onClose}
              className="
                w-full py-3 px-4 rounded-xl
                border border-border bg-muted
                text-muted-foreground text-sm font-bold
                hover:bg-accent hover:text-accent-foreground
                transition-all duration-200
              "
            >
              Tutup
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default BookingDetailSidebar;
