import { useEffect, useState } from "react";
import { X, Clock, Tag, FileText, CalendarDays, Layers } from "lucide-react";
import type { FieldWithSlots } from ".";
import { timeSlotService, type TimeSlot } from "../../../services/time-slot";
import { formatTime, formatDate } from "../../../utils/format";

const DetailDrawer = ({
  field,
  onClose,
}: {
  field: FieldWithSlots | null;
  onClose: () => void;
}) => {
  const [freshSlots, setFreshSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Fetch slot data lengkap (dengan bookingId) setiap kali drawer dibuka
  useEffect(() => {
    if (!field) {
      setFreshSlots([]);
      return;
    }
    const fetch = async () => {
      setLoadingSlots(true);
      try {
        const res = await timeSlotService.getSlots(field.id);
        setFreshSlots(res.data.slots);
      } catch {
        // fallback ke data dari props jika gagal
        setFreshSlots(field.slots ?? []);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetch();
  }, [field]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = field ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [field]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && field) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [field, onClose]);

  const isOpen = !!field;

  // Filter: hanya slot hari ini dari data yang sudah di-fetch (lengkap dengan bookingId)
  const todaySlots = freshSlots.filter((slot) => {
    const slotDate = new Date(slot.startTime);
    const now = new Date();
    return (
      slotDate.getFullYear() === now.getFullYear() &&
      slotDate.getMonth() === now.getMonth() &&
      slotDate.getDate() === now.getDate()
    );
  });

  const totalSlots = todaySlots.length;
  const availableSlots = todaySlots.filter(
    (s) => !s.booked && !s.bookingId,
  ).length;
  const bookedSlots = totalSlots - availableSlots;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`
          fixed inset-0 z-[60] bg-black/40 backdrop-blur-[3px]
          transition-opacity duration-300
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      />

      {/* Drawer */}
      <aside
        className={`
          fixed top-0 right-0 h-full w-full max-w-[440px] z-[70]
          bg-background flex flex-col
          border-l border-border
          shadow-[var(--shadow-lg-value)]
          transition-transform duration-[380ms] ease-[cubic-bezier(0.32,0.72,0,1)]
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Hero Image Area */}
        <div className="relative h-52 flex-shrink-0 overflow-hidden bg-muted">
          {field?.image ? (
            <img
              src={field.image as string}
              alt={field.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full gradient-primary flex items-center justify-center">
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)`,
                  backgroundSize: "20px 20px",
                }}
              />
              <Layers className="w-16 h-16 text-white/40" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all border border-white/20"
          >
            <X size={16} className="text-white" />
          </button>

          <div className="absolute top-4 left-4">
            <span className="text-[9px] font-black tracking-[0.2em] uppercase text-white/70 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
              Detail Lapangan
            </span>
          </div>

          {field && (
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <div className="flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-white/60 text-[10px] font-mono uppercase tracking-widest mb-0.5">
                    #{String(field.id).padStart(3, "0")}
                  </p>
                  <h2 className="text-white text-2xl font-black leading-tight truncate">
                    {field.name}
                  </h2>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-white/60 text-[9px] uppercase tracking-wider mb-0.5">
                    Harga
                  </p>
                  <p className="text-white font-black text-lg font-mono leading-none">
                    Rp {field.price.toLocaleString("id-ID")}
                  </p>
                  <p className="text-white/50 text-[9px]">/ Jam</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {field ? (
            <div className="p-5 space-y-5">
              {/* Slot Stats Hari Ini */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-muted rounded-xl p-3 text-center">
                  <p className="text-2xl font-black text-foreground">
                    {totalSlots}
                  </p>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-widest mt-0.5">
                    Sesi Hari Ini
                  </p>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center">
                  <p className="text-2xl font-black text-emerald-600">
                    {availableSlots}
                  </p>
                  <p className="text-[9px] text-emerald-500 uppercase tracking-widest mt-0.5">
                    Tersedia
                  </p>
                </div>
                <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-center">
                  <p className="text-2xl font-black text-red-500">
                    {bookedSlots}
                  </p>
                  <p className="text-[9px] text-red-400 uppercase tracking-widest mt-0.5">
                    Terbooked
                  </p>
                </div>
              </div>

              {/* Tarif */}
              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-primary-soft flex items-center justify-center">
                    <Tag className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    Tarif Sewa
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-black text-primary font-mono">
                    Rp {field.price.toLocaleString("id-ID")}
                  </p>
                  <span className="text-sm text-muted-foreground font-medium">
                    / Jam
                  </span>
                </div>
              </div>

              {/* Deskripsi */}
              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-primary-soft flex items-center justify-center">
                    <FileText className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    Deskripsi
                  </span>
                </div>
                <div className="bg-muted/60 rounded-xl px-4 py-3 border-l-2 border-primary/40">
                  <p className="text-sm text-foreground leading-relaxed italic">
                    "
                    {field.description ||
                      "Tidak ada deskripsi untuk lapangan ini."}
                    "
                  </p>
                </div>
              </div>

              {/* Jadwal Hari Ini */}
              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-primary-soft flex items-center justify-center">
                      <CalendarDays className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                      Jadwal Hari Ini
                    </span>
                  </div>
                  {totalSlots > 0 && (
                    <span className="badge-available text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide">
                      {totalSlots} Sesi
                    </span>
                  )}
                </div>

                {loadingSlots ? (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-14 rounded-xl bg-muted animate-pulse"
                      />
                    ))}
                  </div>
                ) : totalSlots === 0 ? (
                  <div className="flex flex-col items-center py-6 gap-2 text-muted-foreground">
                    <Clock className="w-8 h-8 opacity-30" />
                    <p className="text-xs">Tidak ada jadwal hari ini</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {[...todaySlots]
                      .sort(
                        (a, b) =>
                          new Date(a.startTime).getTime() -
                          new Date(b.startTime).getTime(),
                      )
                      .map((slot, i) => {
                        const isPending = !slot.booked && !!slot.bookingId;
                        return (
                          <div
                            key={slot.id ?? i}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-xl border transition-colors ${
                              slot.booked
                                ? "bg-red-50/50 border-red-100"
                                : isPending
                                  ? "bg-amber-50/50 border-amber-100"
                                  : "bg-emerald-50/50 border-emerald-100"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span
                                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                  slot.booked
                                    ? "bg-red-400"
                                    : isPending
                                      ? "bg-amber-400 animate-pulse"
                                      : "bg-emerald-400"
                                }`}
                              />
                              <div>
                                <p className="text-xs font-black text-foreground font-mono">
                                  {formatTime(slot.startTime)} –{" "}
                                  {formatTime(slot.endTime)}
                                </p>
                                <p className="text-[10px] text-muted-foreground">
                                  {formatDate(slot.startTime)}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                slot.booked
                                  ? "text-red-500 bg-red-100"
                                  : isPending
                                    ? "text-amber-600 bg-amber-100"
                                    : "text-emerald-600 bg-emerald-100"
                              }`}
                            >
                              {slot.booked
                                ? "Booked"
                                : isPending
                                  ? "Pending"
                                  : "Tersedia"}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        {field && (
          <div className="px-5 py-4 border-t border-border bg-card">
            <button
              onClick={onClose}
              className="
                w-full py-3 px-4 rounded-xl
                border border-border bg-muted
                text-muted-foreground text-sm font-bold
                hover:bg-accent hover:text-accent-foreground
                transition-all duration-200
                active:scale-[0.98]
              "
            >
              Tutup
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default DetailDrawer;
