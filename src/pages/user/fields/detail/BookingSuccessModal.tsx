import { CheckCircle, Mail, X } from "lucide-react";
import type { Booking } from "../../../../services/booking";
import { formatTime, fullFormatPrice } from "../../../../utils/format";

const BookingSuccessModal = ({
  booking,
  onClose,
}: {
  booking: Booking;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div className="w-full max-w-md bg-card rounded-3xl border border-border shadow-2xl overflow-hidden">
      {/* Header hijau */}
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

      {/* Detail booking */}
      <div className="p-6 space-y-4">
        <div className="space-y-3">
          {[
            { label: "Lapangan", value: booking.field.name },
            {
              label: "Waktu",
              value: `${formatTime(booking.slot.startTime)} – ${formatTime(booking.slot.endTime)}`,
            },
            {
              label: "Harga",
              value: fullFormatPrice(booking.field.price),
              highlight: true,
            },
            {
              label: "Status",
              value: booking.status,
              badge: true,
            },
          ].map(({ label, value, highlight, badge }) => (
            <div
              key={label}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <span className="text-sm text-muted-foreground font-medium">
                {label}
              </span>
              {badge ? (
                <span className="badge-pending px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wide">
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

        {/* Email notice */}
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

export default BookingSuccessModal;
