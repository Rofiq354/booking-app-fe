import { useState, useMemo, useEffect } from "react";
import Modal from "../../../components/FormModal";
import { timeSlotService, type TimeSlot } from "../../../services/time-slot";
import toast from "react-hot-toast";
import { getErrorMessage } from "../../../utils/error";

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
          // Karena res.data isinya object { id, name, slots: [] }
          setSlots(res.data.slots);
        } catch (error) {
          toast.error(getErrorMessage(error));
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

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Detail Jadwal: ${fieldName}`}
    >
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-700">Manajemen Slot</h3>
            <p className="text-[10px] text-slate-500 italic">
              Atur ketersediaan jam operasional
            </p>
          </div>
          <button
            onClick={onAddClick}
            disabled={loading}
            className="text-xs bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white px-4 py-2 rounded-lg font-bold transition-all shadow-sm flex items-center gap-2 active:scale-95"
          >
            <span className="text-sm">+</span> Tambah Slot
          </button>
        </div>

        {/* Navigation Tabs - Modern Pill Style */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {dates.length > 0
            ? dates.map((date) => {
                const d = new Date(date);
                const isActive = activeTab === date;
                return (
                  <button
                    key={date}
                    onClick={() => setActiveTab(date)}
                    className={`flex flex-col items-center min-w-17.5 px-3 py-2 rounded-xl border transition-all ${
                      isActive
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100"
                        : "bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:bg-indigo-50"
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold tracking-tighter">
                      {d.toLocaleDateString("id-ID", { weekday: "short" })}
                    </span>
                    <span className="text-sm font-black">
                      {d.toLocaleDateString("id-ID", { day: "numeric" })}
                    </span>
                    <span className="text-[9px]">
                      {d.toLocaleDateString("id-ID", { month: "short" })}
                    </span>
                  </button>
                );
              })
            : !loading && (
                <div className="w-full py-4 text-center bg-slate-50 rounded-lg border border-dashed border-slate-300">
                  <p className="text-xs text-slate-400">
                    Belum ada jadwal yang diatur
                  </p>
                </div>
              )}
        </div>

        {/* Slot Grid Section */}
        <div className="relative">
          <div className="grid grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
            {loading ? (
              <>
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 rounded-xl border border-slate-100 bg-slate-50 animate-pulse"
                  />
                ))}
              </>
            ) : activeTab ? (
              groupedSlots[activeTab]?.map((slot: TimeSlot) => {
                const isBooked = slot.booked;
                return (
                  <div
                    key={slot.id}
                    className={`relative group p-3 rounded-xl border transition-all duration-200 shadow-sm ${
                      isBooked
                        ? "bg-red-50 border-red-100 text-red-700 opacity-80"
                        : "bg-white border-slate-200 text-slate-700 hover:border-green-400 hover:shadow-green-50"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <p className="text-xs font-black tracking-tight">
                        {new Date(slot.startTime).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <div
                        className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest ${
                          isBooked
                            ? "bg-red-200 text-red-800"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {isBooked ? "Terisi" : "Tersedia"}
                      </div>
                    </div>

                    {/* Dot decorator */}
                    <div
                      className={`absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full ${
                        isBooked ? "bg-red-400" : "bg-green-400"
                      }`}
                    />
                  </div>
                );
              })
            ) : null}
          </div>
        </div>

        {/* Footer Action */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-8 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all active:scale-95"
          >
            Tutup
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DetailSlotModal;
