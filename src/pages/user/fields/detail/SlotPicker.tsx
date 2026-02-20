import { Clock, Ban } from "lucide-react";
import { formatTime } from "../../../../types/detail-field";
import type { TimeSlot } from "../../../../services/time-slot";

interface SlotPickerProps {
  slots: TimeSlot[];
  selectedSlotId: number | null;
  onSelect: (id: number) => void;
  loading?: boolean;
}

const SlotPicker = ({
  slots,
  selectedSlotId,
  onSelect,
  loading,
}: SlotPickerProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-20 rounded-2xl bg-muted animate-pulse"
            style={{ animationDelay: `${i * 80}ms` }}
          />
        ))}
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-3 rounded-2xl border border-dashed border-border bg-muted/40">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <Clock size={20} className="text-muted-foreground" />
        </div>
        <p className="text-sm font-semibold text-muted-foreground">
          Tidak ada slot tersedia untuk hari ini
        </p>
      </div>
    );
  }

  const available = slots.filter((s) => !s.booked).length;

  return (
    <div className="space-y-3">
      {/* Ringkasan */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary inline-block" />
          {available} tersedia
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-border inline-block" />
          {slots.length - available} terisi
        </span>
      </div>

      {/* Grid slot */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {slots.map((slot) => {
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

      {/* Info slot terpilih */}
      {selectedSlotId && selectedSlotId !== -1 && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/20">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-semibold text-primary">
            {(() => {
              const s = slots.find((sl) => sl.id === selectedSlotId);
              if (!s) return "";
              return `Dipilih: ${formatTime(s.startTime)} – ${formatTime(s.endTime)}`;
            })()}
          </span>
        </div>
      )}
    </div>
  );
};

export default SlotPicker;
