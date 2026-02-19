import React, { useState } from "react";
import toast from "react-hot-toast";
import { Calendar, Clock, Info } from "lucide-react"; // Tambahkan icon untuk UI lebih manis
import { getErrorMessage } from "../../../utils/error";
import { timeSlotService } from "../../../services/time-slot";
import Modal from "../../../components/FormModal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  fieldId: number;
  fieldName: string;
  onSuccess: () => void;
}

const FormTimeSlot = ({
  isOpen,
  onClose,
  onSuccess,
  fieldId,
  fieldName,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    startHour: 8,
    endHour: 22,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi sederhana sebelum kirim
    if (form.startHour >= form.endHour) {
      return toast.error("Jam mulai harus lebih awal dari jam selesai");
    }

    setLoading(true);
    try {
      const result = await timeSlotService.createSlots(fieldId, form);
      if (result.status === "success") {
        toast.success("Jadwal lapangan berhasil dikonfigurasi!");
        onSuccess();
        onClose();
      }
    } catch (err: unknown) {
      const errorData = getErrorMessage(err);
      toast.error(errorData.message as string);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Konfigurasi Jadwal`}>
      <div className="mb-6">
        <h3 className="text-lg font-medium text-foreground uppercase tracking-tight">
          {fieldName}
        </h3>
        <p className="text-xs text-muted-foreground">
          Tentukan rentang waktu operasional lapangan.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Input Tanggal */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            <Calendar size={14} className="text-primary" />
            Pilih Tanggal
          </label>
          <input
            type="date"
            required
            className="w-full px-4 py-2.5 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-foreground"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>

        {/* Input Jam */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              <Clock size={14} className="text-primary" />
              Jam Mulai
            </label>
            <input
              type="number"
              min="0"
              max="23"
              required
              className="w-full px-4 py-2.5 bg-background border border-border rounded-xl outline-none font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
              value={form.startHour}
              onChange={(e) =>
                setForm({ ...form, startHour: parseInt(e.target.value) })
              }
            />
          </div>
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              <Clock size={14} className="text-primary" />
              Jam Selesai
            </label>
            <input
              type="number"
              min="1"
              max="24"
              required
              className="w-full px-4 py-2.5 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-foreground"
              value={form.endHour}
              onChange={(e) =>
                setForm({ ...form, endHour: parseInt(e.target.value) })
              }
            />
          </div>
        </div>

        {/* Info Note */}
        <div className="flex gap-3 p-3 bg-secondary/50 border border-secondary rounded-xl">
          <Info
            size={18}
            className="text-secondary-foreground shrink-0 mt-0.5"
          />
          <p className="text-[11px] text-secondary-foreground leading-relaxed font-medium">
            Sistem akan otomatis membagi waktu menjadi slot{" "}
            <strong>60 menit</strong>. Contoh: 08:00 - 09:00, 09:00 - 10:00,
            dst.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-muted text-muted-foreground font-medium rounded-xl hover:bg-muted/80 transition-all border border-transparent active:scale-95"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:scale-100 active:scale-95"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                <span>Memproses...</span>
              </div>
            ) : (
              "Generate Slot"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default FormTimeSlot;
