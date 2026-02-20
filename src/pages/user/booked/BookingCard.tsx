import {
  AlertTriangle,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Loader2,
  MoreVertical,
  Timer,
  Trash2,
  XCircle,
} from "lucide-react";
import { formatDate, formatTime, fullFormatPrice } from "../../../utils/format";
import { bookingService, type Booking } from "../../../services/booking";
import { useState } from "react";
import toast from "react-hot-toast";
import { getErrorMessage } from "../../../utils/error";

// ── Status Config ────────────────────────────────────────────────────────────
const statusConfig = {
  PENDING: {
    label: "Menunggu Pembayaran",
    icon: Timer,
    className: "badge-pending",
    dot: "bg-warning",
  },
  CONFIRMED: {
    label: "Dikonfirmasi",
    icon: CheckCircle2,
    className: "badge-available",
    dot: "bg-success",
  },
  CANCELLED: {
    label: "Dibatalkan",
    icon: XCircle,
    className: "badge-booked",
    dot: "bg-destructive",
  },
} as const;

// ── Booking Card ─────────────────────────────────────────────────────────────
const BookingCard = ({
  booking,
  onSuccess,
}: {
  booking: Booking;
  onSuccess?: () => void;
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const status = statusConfig[booking.status];
  const StatusIcon = status.icon;

  const handleCancel = async () => {
    try {
      setIsPending(true);
      await bookingService.cancleBookingUser(booking.id as number, "CANCELLED");

      toast.success("Booking berhasil dibatalkan");
      setIsConfirmOpen(false);
      onSuccess?.();
    } catch (error: unknown) {
      const errorData = getErrorMessage(error);
      const toastMessage =
        typeof errorData.message === "string"
          ? errorData.message
          : Object.values(errorData.message)[0];
      toast.error(toastMessage as string);

      console.error(`Error Code: ${errorData.code}`);
    } finally {
      setIsPending(false);
      setShowMenu(false);
    }
  };

  return (
    <div className="group bg-card border border-border hover:border-primary/30 rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-md">
      {isConfirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-[320px] rounded-2xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h4 className="font-bold text-foreground">Batalkan Pesanan?</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Tindakan ini tidak dapat dibatalkan. Jadwal lapangan akan
                  dilepas kembali.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                disabled={isPending}
                onClick={handleCancel}
                className="w-full py-2.5 bg-destructive text-destructive-foreground rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  "Ya, Batalkan"
                )}
              </button>
              <button
                disabled={isPending}
                onClick={() => setIsConfirmOpen(false)}
                className="w-full py-2.5 bg-secondary text-secondary-foreground rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-secondary/80 transition-all"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-0 sm:gap-4">
        {/* Field Image */}
        <div className="hidden sm:block w-28 flex-shrink-0">
          {booking.field.image ? (
            <img
              src={booking.field.image}
              alt={booking.field.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center min-h-[100px]">
              <span className="text-3xl opacity-20">🏟️</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-5 space-y-3 min-w-0">
          {/* Top row: nama + status */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-black text-base text-foreground truncate leading-tight">
                {booking.field.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                #{String(booking.id).padStart(5, "0")}
              </p>
            </div>

            <div className="flex">
              {/* Status badge */}
              <span
                className={`${status.className} flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide flex-shrink-0 border`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${status.dot} flex-shrink-0`}
                />
                <span className="hidden sm:inline">{status.label}</span>
                <StatusIcon size={11} className="sm:hidden" />
              </span>

              {booking.status === "PENDING" && (
                <div className="relative">
                  <button
                    disabled={isPending}
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-1 hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isPending ? (
                      <Loader2
                        size={18}
                        className="animate-spin text-muted-foreground"
                      />
                    ) : (
                      <MoreVertical
                        size={18}
                        className="text-muted-foreground"
                      />
                    )}
                  </button>

                  {showMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-36 bg-popover border border-border rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in duration-100">
                        <button
                          onClick={() => {
                            setShowMenu(false);
                            setIsConfirmOpen(true);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 size={14} />
                          Cancle
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap gap-3">
            {booking.slot && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock size={12} className="text-primary flex-shrink-0" />
                <span>
                  {formatTime(booking.slot.startTime)} –{" "}
                  {formatTime(booking.slot.endTime)}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarCheck size={12} className="text-primary flex-shrink-0" />
              <span>{formatDate(booking.createdAt)}</span>
            </div>
          </div>

          {/* Bottom row: harga */}
          <div className="flex items-center justify-between pt-1 border-t border-border">
            <div>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                Total Harga
              </span>
              <div className="text-base font-black text-primary leading-tight">
                {fullFormatPrice(booking.field.price)}
              </div>
            </div>

            {/* Label status mobile */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground sm:hidden">
              <StatusIcon size={13} />
              <span className="font-medium">{status.label}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
