import React, { useEffect, useState } from "react";
import { fieldService, type FieldRequest } from "../../../services/field";
import toast from "react-hot-toast";
import { getErrorMessage } from "../../../utils/error";
import Modal from "../../../components/FormModal";

interface FormFieldProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: FieldRequest | null;
}

const FormField = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: FormFieldProps) => {
  const [form, setForm] = useState<FieldRequest>({
    id: 0,
    name: "",
    description: "",
    price: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen)
      setForm(initialData || { id: 0, name: "", description: "", price: 0 });
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = initialData?.id
        ? await fieldService.updateField(initialData.id, form)
        : await fieldService.createField(form);

      if (result.status === "success") {
        toast.success(result.message);
        onSuccess();
        onClose();
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const isEdit = !!initialData?.id;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Update Lapangan" : "Tambah Lapangan"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input Nama */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Nama Lapangan
          </label>
          <input
            type="text"
            required
            className="w-full p-2 border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-green-500"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        {/* Input Harga */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Harga per Jam
          </label>
          <input
            type="number"
            required
            className="w-full p-2 border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-green-500"
            value={form.price || ""}
            onChange={(e) =>
              setForm({ ...form, price: parseInt(e.target.value) || 0 })
            }
          />
        </div>

        {/* Input Deskripsi */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Deskripsi
          </label>
          <textarea
            className="w-full p-2 border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-green-500"
            rows={2}
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-slate-100 py-2 rounded-md font-medium"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-green-600 text-white py-2 rounded-md font-bold"
          >
            {loading
              ? "Proses..."
              : isEdit
                ? "Simpan Perubahan"
                : "Tambah Lapangan"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default FormField;
