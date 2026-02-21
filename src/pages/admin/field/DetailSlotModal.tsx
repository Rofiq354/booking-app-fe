import { useState, useMemo, useEffect } from "react";
import Modal from "../../../components/FormModal";
import { timeSlotService, type TimeSlot } from "../../../services/time-slot";
import toast from "react-hot-toast";
import { getErrorMessage } from "../../../utils/error";
import { CalendarDays, Clock, Plus, Info, LayoutGrid } from "lucide-react";

interface DetailSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  fieldId: number;
  fieldName: string;
  onAddClick: () => void;
}

const DetailSlotModal = ({
  isOpen,
  onClose,
  onAddClick,
  fieldName,
  fieldId,
}: DetailSlotModalProps) => {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && fieldId) {
      const fetchDetail = async () => {
        setLoading(true);
        try {
          const res = await timeSlotService.getSlots(fieldId);
          setSlots(res.data.slots);
        } catch (error: unknown) {
          const errorData = getErrorMessage(error);
          toast.error(errorData.message as string);
        } finally {
          setLoading(false);
        }
      };
      fetchDetail();
    }
  }, [isOpen, fieldId]);

  const groupedSlots = useMemo(() => {
    const groups: Record<string, TimeSlot[]> = {};
    slots.forEach((slot) => {
      const dateKey = new Date(slot.startTime).toDateString();
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(slot);
    });
    return groups;
  }, [slots]);

  const dates = Object.keys(groupedSlots);
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    if (dates.length > 0 && !activeTab) {
      setActiveTab(dates[0]);
    }
  }, [dates, activeTab]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manajemen Jadwal" size="xl">
      <div className="space-y-6">
        {/* Header Lapangan */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-secondary/30 p-4 rounded-2xl border border-secondary">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
              <LayoutGrid size={20} />
            </div>
            <div>
              <h3 className="text-base font-black text-foreground uppercase tracking-tight italic">
                {fieldName}
              </h3>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                Kontrol Ketersediaan Sesi
              </p>
            </div>
          </div>
          <button
            onClick={onAddClick}
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider hover:opacity-90 shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
          >
            <Plus size={16} strokeWidth={3} />
            Tambah Sesi
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <CalendarDays size={14} className="text-primary" />
            Pilih Tanggal Operasional
          </label>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {dates.length > 0
              ? dates.map((date) => {
                  const d = new Date(date);
                  const isActive = activeTab === date;
                  return (
                    <button
                      key={date}
                      onClick={() => setActiveTab(date)}
                      className={`flex flex-col items-center min-w-[80px] p-3 rounded-2xl border transition-all duration-300 ${
                        isActive
                          ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105"
                          : "bg-card border-border text-muted-foreground hover:border-primary/50 hover:bg-muted"
                      }`}
                    >
                      <span className="text-[9px] uppercase font-black tracking-tighter opacity-80">
                        {d.toLocaleDateString("id-ID", { weekday: "short" })}
                      </span>
                      <span className="text-lg font-black leading-none my-1">
                        {d.toLocaleDateString("id-ID", { day: "numeric" })}
                      </span>
                      <span className="text-[9px] font-bold uppercase">
                        {d.toLocaleDateString("id-ID", { month: "short" })}
                      </span>
                    </button>
                  );
                })
              : !loading && (
                  <div className="w-full py-8 text-center bg-muted/30 rounded-2xl border-2 border-dashed border-border">
                    <Info
                      size={24}
                      className="mx-auto text-muted-foreground/30 mb-2"
                    />
                    <p className="text-xs font-bold text-muted-foreground uppercase">
                      Belum ada jadwal operasional
                    </p>
                  </div>
                )}
          </div>
        </div>

        {/* Slot Grid */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <Clock size={14} className="text-primary" />
            Sesi Waktu Terdaftar
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[350px] overflow-y-auto pr-2">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-20 rounded-2xl bg-muted animate-pulse border border-border"
                  />
                ))
              : activeTab
                ? groupedSlots[activeTab]?.map((slot: TimeSlot) => {
                    const isPending = !slot.booked && !!slot.bookingId;
                    const isBooked = slot.booked;

                    return (
                      <div
                        key={slot.id}
                        className={`relative p-4 rounded-2xl border transition-all duration-200 ${
                          isBooked
                            ? "bg-destructive/5 border-destructive/20"
                            : isPending
                              ? "bg-amber-50 border-amber-200"
                              : "bg-card border-border hover:border-primary hover:shadow-md"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2 text-center">
                          <p
                            className={`text-sm font-black tracking-tight ${
                              isBooked
                                ? "text-destructive"
                                : isPending
                                  ? "text-amber-600"
                                  : "text-foreground"
                            }`}
                          >
                            {new Date(slot.startTime).toLocaleTimeString(
                              "id-ID",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </p>
                          <div
                            className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-sm ${
                              isBooked
                                ? "badge-booked"
                                : isPending
                                  ? "badge-pending"
                                  : "badge-available"
                            }`}
                          >
                            {isBooked
                              ? "Terisi"
                              : isPending
                                ? "Pending"
                                : "Tersedia"}
                          </div>
                        </div>
                        {/* Status dot */}
                        <div
                          className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${
                            isBooked
                              ? "bg-destructive animate-pulse"
                              : isPending
                                ? "bg-amber-400 animate-pulse"
                                : "bg-primary"
                          }`}
                        />
                      </div>
                    );
                  })
                : null}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t border-border">
          <button
            onClick={onClose}
            className="px-10 py-3 bg-muted text-foreground hover:bg-muted/80 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95"
          >
            Tutup Panel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DetailSlotModal;
