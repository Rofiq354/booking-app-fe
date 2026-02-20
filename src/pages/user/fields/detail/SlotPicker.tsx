import { useMemo } from "react";
import {
  Clock,
  Ban,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from "lucide-react";
import type { TimeSlot } from "../../../../services/time-slot";
import { formatTime } from "../../../../utils/format";

interface SlotPickerProps {
  slots: TimeSlot[];
  selectedSlotId: number | null;
  onSelect: (id: number) => void;
  loading?: boolean;
  // lifted state dari parent
  selectedDate: string | null;
  onDateChange: (date: string) => void;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const toLocalDate = (iso: string): string => {
  const d = new Date(iso);
  return d
    .toLocaleDateString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "Asia/Jakarta",
    })
    .split("/")
    .reverse()
    .join("-");
};

const isPastDate = (dateStr: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr + "T00:00:00+07:00");
  return d < today;
};

const getDayAlias = (dateStr: string): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr + "T00:00:00+07:00");
  const diff = Math.round((d.getTime() - today.getTime()) / 86400000);
  if (diff === 0) return "Hari Ini";
  if (diff === 1) return "Besok";
  return d.toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "Asia/Jakarta",
  });
};

// ── Skeleton ─────────────────────────────────────────────────────────────────
const SlotSkeleton = () => (
  <div className="space-y-4">
    <div className="flex gap-2 overflow-hidden">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="h-16 w-24 rounded-2xl bg-muted animate-pulse flex-shrink-0"
        />
      ))}
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-20 rounded-2xl bg-muted animate-pulse"
          style={{ animationDelay: `${i * 60}ms` }}
        />
      ))}
    </div>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const SlotPicker = ({
  slots,
  selectedSlotId,
  onSelect,
  loading,
  selectedDate,
  onDateChange,
}: SlotPickerProps) => {
  // Group slots by date
  const groupedByDate = useMemo(() => {
    const map = new Map<string, TimeSlot[]>();
    slots.forEach((slot) => {
      const date = toLocalDate(slot.startTime);
      if (!map.has(date)) map.set(date, []);
      map.get(date)!.push(slot);
    });
    return new Map([...map.entries()].sort());
  }, [slots]);

  // Hanya tanggal yang tidak lewat
  const availableDates = useMemo(
    () => [...groupedByDate.keys()].filter((d) => !isPastDate(d)),
    [groupedByDate],
  );

  // activeDate: pakai selectedDate dari parent, fallback ke tanggal pertama
  const activeDate = useMemo(() => {
    if (selectedDate && availableDates.includes(selectedDate))
      return selectedDate;
    return availableDates[0] ?? null;
  }, [selectedDate, availableDates]);

  const activeDateIndex = availableDates.indexOf(activeDate ?? "");

  const goPrev = () => {
    if (activeDateIndex > 0) onDateChange(availableDates[activeDateIndex - 1]);
  };
  const goNext = () => {
    if (activeDateIndex < availableDates.length - 1)
      onDateChange(availableDates[activeDateIndex + 1]);
  };

  if (loading) return <SlotSkeleton />;

  if (slots.length === 0 || availableDates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-3 rounded-2xl border border-dashed border-border bg-muted/40">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <CalendarDays size={20} className="text-muted-foreground" />
        </div>
        <p className="text-sm font-semibold text-muted-foreground">
          {slots.length === 0
            ? "Belum ada slot waktu tersedia"
            : "Semua slot sudah melewati tanggal hari ini"}
        </p>
      </div>
    );
  }

  const currentSlots = activeDate ? (groupedByDate.get(activeDate) ?? []) : [];
  const available = currentSlots.filter((s) => !s.booked).length;

  return (
    <div className="space-y-4">
      {/* ── Date Tabs (sm+) ── */}
      <div
        className="hidden sm:flex items-center gap-2 overflow-x-auto pb-1"
        style={{ scrollbarWidth: "none" }}
      >
        {availableDates.map((date) => {
          const isActive = date === activeDate;
          const dateSlots = groupedByDate.get(date) ?? [];
          const avail = dateSlots.filter((s) => !s.booked).length;
          return (
            <button
              key={date}
              onClick={() => onDateChange(date)}
              className={`flex flex-col items-center px-4 py-2.5 rounded-2xl border-2 flex-shrink-0 transition-all duration-200 min-w-[88px]
                ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground shadow-md scale-[1.02]"
                    : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-primary/5"
                }`}
            >
              <span
                className={`text-[10px] font-black uppercase tracking-widest leading-none ${isActive ? "text-primary-foreground/70" : "text-muted-foreground"}`}
              >
                {getDayAlias(date).split(",")[0]}
              </span>
              <span className="text-sm font-black leading-tight mt-0.5">
                {new Date(date + "T00:00:00+07:00").toLocaleDateString(
                  "id-ID",
                  {
                    day: "numeric",
                    month: "short",
                  },
                )}
              </span>
              <div
                className={`mt-1.5 text-[9px] font-bold flex items-center gap-1
                ${isActive ? "text-primary-foreground/80" : avail > 0 ? "text-primary" : "text-muted-foreground"}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${avail > 0 ? (isActive ? "bg-primary-foreground" : "bg-primary") : "bg-border"}`}
                />
                {avail > 0 ? `${avail} slot` : "Penuh"}
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Mobile: Arrow nav ── */}
      <div className="flex items-center justify-between sm:hidden">
        <button
          onClick={goPrev}
          disabled={activeDateIndex === 0}
          className="w-9 h-9 rounded-xl border border-border bg-card flex items-center justify-center text-muted-foreground disabled:opacity-30 hover:border-primary/40 hover:text-primary transition-all"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="text-center">
          <div className="text-sm font-black text-foreground">
            {activeDate ? getDayAlias(activeDate) : "—"}
          </div>
          <div className="text-[10px] text-muted-foreground">
            {activeDateIndex + 1} / {availableDates.length} tanggal
          </div>
        </div>
        <button
          onClick={goNext}
          disabled={activeDateIndex === availableDates.length - 1}
          className="w-9 h-9 rounded-xl border border-border bg-card flex items-center justify-center text-muted-foreground disabled:opacity-30 hover:border-primary/40 hover:text-primary transition-all"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* ── Slot Summary ── */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary" />
          {available} tersedia
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-border" />
          {currentSlots.length - available} terisi
        </span>
      </div>

      {/* ── Slot Grid ── */}
      {currentSlots.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 gap-2 rounded-2xl border border-dashed border-border bg-muted/40">
          <Clock size={18} className="text-muted-foreground/50" />
          <p className="text-sm font-semibold text-muted-foreground">
            Tidak ada slot di tanggal ini
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {currentSlots.map((slot) => {
            const isSelected = selectedSlotId === slot.id;
            const isBooked = slot.booked === true;

            if (isBooked) {
              return (
                <div
                  key={slot.id}
                  className="relative flex flex-col items-center justify-center gap-1 p-4 rounded-2xl border-2 border-border bg-muted/50 opacity-50 cursor-not-allowed select-none"
                >
                  <Ban size={14} className="text-muted-foreground" />
                  <span className="text-xs font-black tracking-tight leading-none text-muted-foreground">
                    {formatTime(slot.startTime)}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Terisi
                  </span>
                </div>
              );
            }

            return (
              <button
                key={slot.id}
                onClick={() => onSelect(isSelected ? -1 : slot.id)}
                className={`group relative flex flex-col items-center justify-center gap-1 p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer
                  ${
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground shadow-lg scale-[1.02]"
                      : "border-border bg-card hover:border-primary/50 hover:bg-primary/5 text-foreground"
                  }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary-foreground/70" />
                )}
                <Clock
                  size={14}
                  className={
                    isSelected
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground group-hover:text-primary"
                  }
                />
                <span className="text-xs font-black tracking-tight leading-none">
                  {formatTime(slot.startTime)}
                </span>
                <span
                  className={`text-[10px] font-medium ${isSelected ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                >
                  s/d {formatTime(slot.endTime)}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* ── Info Slot Terpilih ── */}
      {selectedSlotId &&
        selectedSlotId !== -1 &&
        (() => {
          const s = currentSlots.find((sl) => sl.id === selectedSlotId);
          if (!s) return null;
          return (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/20">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-semibold text-primary">
                Dipilih: {formatTime(s.startTime)} – {formatTime(s.endTime)}
              </span>
            </div>
          );
        })()}
    </div>
  );
};

export default SlotPicker;
