import React, { useState } from "react";
import toast from "react-hot-toast";
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
    date: new Date().toISOString().split("T")[0], // Default hari ini
    startHour: 8,
    endHour: 22,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await timeSlotService.createSlots(fieldId, form);
      if (result.status === "success") {
        toast.success("Slot berhasil dikonfigurasi");
        onSuccess(); // Ini akan memicu fetchFields() di FieldPage
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
    <Modal isOpen={isOpen} onClose={onClose} title={`Set Jadwal: ${fieldName}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Pilih Tanggal
          </label>
          <input
            type="date"
            required
            className="w-full p-2 border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-green-500"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Jam Mulai
            </label>
            <input
              type="number"
              min="0"
              max="23"
              required
              className="w-full p-2 border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-green-500"
              value={form.startHour}
              onChange={(e) =>
                setForm({ ...form, startHour: parseInt(e.target.value) })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Jam Selesai
            </label>
            <input
              type="number"
              min="1"
              max="24"
              required
              className="w-full p-2 border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-green-500"
              value={form.endHour}
              onChange={(e) =>
                setForm({ ...form, endHour: parseInt(e.target.value) })
              }
            />
          </div>
        </div>

        <p className="text-xs text-slate-500 italic">
          *Sistem akan otomatis meng-generate slot per 1 jam.
        </p>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-slate-100 py-2 rounded-md"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 rounded-md font-bold"
          >
            {loading ? "Memproses..." : "Generate Slot"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default FormTimeSlot;
