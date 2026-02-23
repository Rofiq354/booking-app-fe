import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fieldService } from "../../../../services/field";
import { timeSlotService, type TimeSlot } from "../../../../services/time-slot";
import { bookingService, type Booking } from "../../../../services/booking";
import {
  ArrowLeft,
  Clock,
  CalendarCheck,
  Star,
  CalendarDays,
} from "lucide-react";
import SlotPicker from "./SlotPicker";
import ReviewSection, { BookingSuccessModal } from "./ReviewSection";
import toast from "react-hot-toast";
import type { FieldDetail } from "../../../../types/detail-field";
import {
  fullFormatPrice as formatPrice,
  formatTime,
} from "../../../../utils/format";
import { reviewService } from "../../../../services/review";

// ── Helpers ───────────────────────────────────────────────────────────────────
const todayISO = () => new Date().toISOString().split("T")[0];

const toLocalDate = (iso: string): string =>
  new Date(iso)
    .toLocaleDateString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "Asia/Jakarta",
    })
    .split("/")
    .reverse()
    .join("-");

// ── Sticky Booking Card ───────────────────────────────────────────────────────
interface BookingCardProps {
  field: FieldDetail;
  slots: TimeSlot[];
  selectedSlot: TimeSlot | undefined;
  selectedDate: string | null;
  loadingSlots: boolean;
  bookingLoading: boolean;
  selectedSlotId: number | null;
  onBooking: () => void;
}

const BookingCard = ({
  field,
  slots,
  selectedSlot,
  selectedDate,
  loadingSlots,
  bookingLoading,
  selectedSlotId,
  onBooking,
}: BookingCardProps) => {
  const availableSlots = slots.filter((s) => !s.booked).length;

  return (
    <div className="sticky top-6 glass rounded-3xl border border-border p-6 space-y-6">
      {/* Harga */}
      <div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
          Biaya Sewa
        </span>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-4xl font-black text-primary leading-none">
            {formatPrice(field.price)}
          </span>
          <span className="text-muted-foreground text-sm">/jam</span>
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* Info ringkas */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground font-medium">Rating</span>
          <div className="flex items-center gap-1">
            <Star size={13} className="text-warning fill-warning" />
            <span className="font-bold text-foreground">
              {field.ratingStats.average.toFixed(1)}
            </span>
          </div>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground font-medium">Total Slot</span>
          <span className="font-bold text-foreground">
            {loadingSlots ? "—" : `${slots.length} slot`}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground font-medium">Tersedia</span>
          <span
            className={`font-bold ${availableSlots > 0 ? "text-primary" : "text-destructive"}`}
          >
            {loadingSlots ? "—" : `${availableSlots} slot`}
          </span>
        </div>
        {selectedDate && (
          <div className="flex justify-between">
            <span className="text-muted-foreground font-medium">Tanggal</span>
            <span className="font-bold text-foreground text-right">
              {new Date(selectedDate + "T00:00:00+07:00").toLocaleDateString(
                "id-ID",
                {
                  day: "numeric",
                  month: "long",
                },
              )}
            </span>
          </div>
        )}
      </div>

      {/* Slot terpilih */}
      {selectedSlot && (
        <>
          <div className="h-px bg-border" />
          <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-primary/10 border border-primary/20">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary/70">
              Slot Dipilih
            </span>
            <span className="text-sm font-black text-primary">
              {formatTime(selectedSlot.startTime)} –{" "}
              {formatTime(selectedSlot.endTime)}
            </span>
            <span className="text-xs font-semibold text-primary/80">
              Total: {formatPrice(field.price)}
            </span>
          </div>
        </>
      )}

      <div className="h-px bg-border" />

      {/* CTA */}
      <button
        onClick={onBooking}
        disabled={!selectedSlotId || bookingLoading}
        className={`w-full py-4 rounded-2xl font-black text-base uppercase tracking-wide transition-all duration-200 flex items-center justify-center gap-3
          ${
            selectedSlotId && !bookingLoading
              ? "bg-primary text-primary-foreground hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
      >
        {bookingLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
            <span>Memproses...</span>
          </>
        ) : (
          <>
            <CalendarCheck size={18} />
            {selectedSlotId ? "Booking Sekarang" : "Pilih Slot Dulu"}
          </>
        )}
      </button>

      <p className="text-[10px] text-center text-muted-foreground leading-tight">
        Konfirmasi instan setelah pembayaran via Midtrans
      </p>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const FieldDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [field, setField] = useState<FieldDetail | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingField, setLoadingField] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [successBooking, setSuccessBooking] = useState<Booking | null>(null);

  const [eligibleBookingId, setEligibleBookingId] = useState<number | null>(
    null,
  );

  // Tambahkan fetch eligibility
  useEffect(() => {
    const fetchEligibility = async () => {
      if (!id) return;
      try {
        // Panggil service check eligibility yang tadi dibuat
        const res = await reviewService.checkEligibility(id);
        if (res.data.eligible) {
          setEligibleBookingId(res.data.bookingId);
        }
      } catch (err: unknown) {
        // Jika error (misal belum login), biarkan null
        setEligibleBookingId(null);
        console.error(err);
      }
    };

    fetchEligibility();
  }, [id]);

  // Fungsi untuk refresh data setelah user submit review
  const handleReviewSuccess = async () => {
    if (!id) return;
    try {
      // 1. Ambil ulang detail field (supaya review terbaru muncul di list)
      const res = await fieldService.getDetailField(id);
      setField(res.data as FieldDetail);

      // 2. Hilangkan form review karena sudah diisi
      setEligibleBookingId(null);
    } catch (err: unknown) {
      console.error("Gagal refresh data setelah review, ", err);
    }
  };

  // Fetch field
  useEffect(() => {
    if (!id) return;
    fieldService
      .getDetailField(id)
      .then((res) => setField(res.data as FieldDetail))
      .catch(() => setError("Gagal memuat detail lapangan."))
      .finally(() => setLoadingField(false));
  }, [id]);

  // Fetch slots
  useEffect(() => {
    if (!id) return;
    timeSlotService
      .getSlots(Number(id))
      .then((res) => setSlots(res.data.slots ?? []))
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [id]);

  const availableSlots = useMemo(
    () => slots.filter((s) => !s.booked).length,
    [slots],
  );
  const selectedSlot = useMemo(
    () => slots.find((s) => s.id === selectedSlotId),
    [slots, selectedSlotId],
  );
  const maxDate = useMemo(() => {
    const dates = slots.map((s) => toLocalDate(s.startTime)).sort();
    return dates[dates.length - 1] ?? undefined;
  }, [slots]);

  const handleSelectSlot = (slotId: number) =>
    setSelectedSlotId((p) => (p === slotId ? null : slotId));
  const handleDateChange = (date: string) => {
    setSelectedSlotId(null);
    setSelectedDate(date);
  };

  const handleBooking = async () => {
    if (!selectedSlotId || !field) return;
    setBookingLoading(true);
    try {
      const res = await bookingService.createBooking(field.id, selectedSlotId);
      setSuccessBooking(res.data);
      const refreshed = await timeSlotService.getSlots(field.id);
      setSlots(refreshed.data.slots ?? []);
      setSelectedSlotId(null);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      toast.error(
        axiosErr?.response?.data?.message ?? "Gagal membuat booking.",
      );
    } finally {
      setBookingLoading(false);
    }
  };

  // ── States ─────────────────────────────────────────────────────────────────
  if (loadingField) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <p className="text-sm font-semibold text-muted-foreground animate-pulse">
          Memuat lapangan...
        </p>
      </div>
    );
  }

  if (error || !field) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center text-2xl">
          ⚠️
        </div>
        <p className="text-destructive font-bold">
          {error || "Lapangan tidak ditemukan"}
        </p>
        <Link
          to="/fields"
          className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          Kembali ke Daftar
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Modal sukses */}
      {successBooking && (
        <BookingSuccessModal
          booking={successBooking}
          onClose={() => setSuccessBooking(null)}
        />
      )}

      {/* ── Hero ── */}
      <div className="relative h-[45vh] md:h-[60vh] w-full overflow-hidden">
        {field.image ? (
          <img
            src={field.image}
            alt={field.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-8xl opacity-20">🏟️</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <button
          onClick={() => navigate(-1)}
          className="glass absolute top-5 left-5 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold hover:scale-105 transition-transform"
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Kembali</span>
        </button>
        <div className="absolute top-5 right-5">
          <span
            className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${availableSlots > 0 ? "badge-available" : "badge-booked"}`}
          >
            {availableSlots > 0
              ? `● ${availableSlots} Slot Tersedia`
              : "● Penuh"}
          </span>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-24 relative z-10">
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          {/* ── LEFT ── */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header field */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground leading-[1.05]">
                {field.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 bg-card border border-border rounded-full px-3 py-1.5">
                  <Star size={13} className="text-warning fill-warning" />
                  <span className="text-sm font-black text-foreground">
                    {field.ratingStats.average.toFixed(1)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({field.ratingStats.total} ulasan)
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-card border border-border rounded-full px-3 py-1.5">
                  <Clock size={13} className="text-primary" />
                  <span className="text-xs font-semibold text-foreground">
                    {loadingSlots
                      ? "Memuat slot..."
                      : `${availableSlots} slot tersedia`}
                  </span>
                </div>
              </div>
              {field.description && (
                <p className="text-muted-foreground text-base leading-relaxed">
                  {field.description}
                </p>
              )}
            </div>

            <div className="h-px bg-border" />

            {/* Slot Section */}
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <CalendarCheck size={18} className="text-primary" />
                  <h2 className="text-lg font-black tracking-tight text-foreground">
                    Pilih Waktu Booking
                  </h2>
                </div>

                {/* Date input */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card hover:border-primary/40 transition-colors group">
                  <CalendarDays
                    size={15}
                    className="text-muted-foreground group-focus-within:text-primary transition-colors flex-shrink-0"
                  />
                  <input
                    type="date"
                    min={todayISO()}
                    max={maxDate}
                    value={selectedDate ?? ""}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="text-sm font-semibold text-foreground bg-transparent outline-none cursor-pointer w-36"
                  />
                </div>
              </div>

              <SlotPicker
                slots={slots}
                selectedSlotId={selectedSlotId}
                onSelect={handleSelectSlot}
                loading={loadingSlots}
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
              />
            </div>

            <div className="h-px bg-border" />

            <ReviewSection
              reviews={field.reviews}
              ratingStats={field.ratingStats}
              eligibleBookingId={eligibleBookingId as number} // Kirim ID ini
              onReviewSuccess={handleReviewSuccess} // Kirim callback ini
            />
          </div>

          {/* ── RIGHT ── */}
          <div className="lg:col-span-1 order-first lg:order-last">
            <BookingCard
              field={field}
              slots={slots}
              selectedSlot={selectedSlot}
              selectedDate={selectedDate}
              loadingSlots={loadingSlots}
              bookingLoading={bookingLoading}
              selectedSlotId={selectedSlotId}
              onBooking={handleBooking}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldDetailPage;
