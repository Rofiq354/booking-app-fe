import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fieldService } from "../../../../services/field";
import { ArrowLeft, MapPin, Clock, CalendarCheck, Star } from "lucide-react";
import SlotPicker from "./SlotPicker";
import ReviewSection from "./ReviewSection";
import {
  formatPrice,
  type FieldDetail,
} from "../../../../types/detail-field";
import { timeSlotService, type TimeSlot } from "../../../../services/time-slot";

const FieldDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [field, setField] = useState<FieldDetail | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingField, setLoadingField] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);

  // Fetch field detail
  useEffect(() => {
    const fetchField = async () => {
      try {
        if (!id) return;
        const res = await fieldService.getDetailField(id);
        setField(res.data as FieldDetail);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat detail lapangan.");
      } finally {
        setLoadingField(false);
      }
    };
    fetchField();
  }, [id]);

  // Fetch slots terpisah dari timeSlotService
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        if (!id) return;
        const res = await timeSlotService.getSlots(Number(id));
        setSlots(res.data.slots ?? []);
      } catch (err) {
        console.error(err);
        setSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [id]);

  const handleSelectSlot = (slotId: number) => {
    // Toggle: klik slot yang sudah dipilih → deselect
    setSelectedSlotId((prev) => (prev === slotId ? null : slotId));
  };

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

  const availableSlots = slots.filter((s) => !s.booked).length;
  const selectedSlot = slots.find((s) => s.id === selectedSlotId);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* ── Hero Image ───────────────────────────────────────── */}
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

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="glass absolute top-5 left-5 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold hover:scale-105 transition-transform"
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Kembali</span>
        </button>

        {/* Status badge */}
        <div className="absolute top-5 right-5">
          <span
            className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border
            ${availableSlots > 0 ? "badge-available" : "badge-booked"}`}
          >
            {availableSlots > 0
              ? `● ${availableSlots} Slot Tersedia`
              : "● Penuh"}
          </span>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-24 relative z-10">
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          {/* ── LEFT: Info + Slots + Reviews ── */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground leading-[1.05]">
                {field.name}
              </h1>

              {/* Meta pills */}
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

                <div className="flex items-center gap-1.5 bg-card border border-border rounded-full px-3 py-1.5">
                  <MapPin size={13} className="text-muted-foreground" />
                  <span className="text-xs font-semibold text-foreground">
                    Jakarta
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

            {/* Slot Picker */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CalendarCheck size={18} className="text-primary" />
                <h2 className="text-lg font-black tracking-tight text-foreground">
                  Pilih Waktu Booking
                </h2>
              </div>
              <SlotPicker
                slots={slots}
                selectedSlotId={selectedSlotId}
                onSelect={handleSelectSlot}
                loading={loadingSlots}
              />
            </div>

            <div className="h-px bg-border" />

            {/* Reviews */}
            <ReviewSection
              reviews={field.reviews}
              ratingStats={field.ratingStats}
            />
          </div>

          {/* ── RIGHT: Sticky Booking Card ── */}
          <div className="lg:col-span-1 order-first lg:order-last">
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

              {/* Info */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">
                    Rating
                  </span>
                  <div className="flex items-center gap-1">
                    <Star size={13} className="text-warning fill-warning" />
                    <span className="font-bold text-foreground">
                      {field.ratingStats.average.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">
                    Total Slot
                  </span>
                  <span className="font-bold text-foreground">
                    {loadingSlots ? "—" : `${slots.length} slot`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">
                    Tersedia
                  </span>
                  <span
                    className={`font-bold ${availableSlots > 0 ? "text-primary" : "text-destructive"}`}
                  >
                    {loadingSlots ? "—" : `${availableSlots} slot`}
                  </span>
                </div>
              </div>

              {/* Slot terpilih preview */}
              {selectedSlot && (
                <>
                  <div className="h-px bg-border" />
                  <div className="flex flex-col gap-1 p-3 rounded-xl bg-primary/10 border border-primary/20">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary/70">
                      Slot Dipilih
                    </span>
                    <span className="text-sm font-black text-primary">
                      {new Date(selectedSlot.startTime).toLocaleTimeString(
                        "id-ID",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          timeZone: "Asia/Jakarta",
                        },
                      )}
                      {" – "}
                      {new Date(selectedSlot.endTime).toLocaleTimeString(
                        "id-ID",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          timeZone: "Asia/Jakarta",
                        },
                      )}{" "}
                      WIB
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
                disabled={!selectedSlotId}
                className={`w-full py-4 rounded-2xl font-black text-base uppercase tracking-wide transition-all duration-200 flex items-center justify-center gap-3
                  ${
                    selectedSlotId
                      ? "bg-primary text-primary-foreground hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
              >
                <CalendarCheck size={18} />
                {selectedSlotId ? "Booking Sekarang" : "Pilih Slot Dulu"}
              </button>

              <p className="text-[10px] text-center text-muted-foreground leading-tight">
                Konfirmasi instan setelah pembayaran via Midtrans
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldDetailPage;
