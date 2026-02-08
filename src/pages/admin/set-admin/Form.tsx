import { useState } from "react";
import Modal from "../../../components/FormModal";
import { adminService } from "../../../services/user-admin";
import toast from "react-hot-toast";
import { getErrorMessage } from "../../../utils/error";

interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddAdminModal = ({ isOpen, onClose, onSuccess }: AddAdminModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Panggil service
      await adminService.createAdmin(formData);

      toast.success("Admin baru berhasil didaftarkan!");
      onSuccess();
      onClose();
    } catch (error) {
      toast(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tambah Admin Baru">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 opacity-60">
            Nama Lengkap
          </label>
          <input
            type="text"
            required
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            placeholder="Masukkan nama admin"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 opacity-60">
            Alamat Email
          </label>
          <input
            type="email"
            required
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            placeholder="email@perusahaan.com"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 opacity-60">
            Password Sementara
          </label>
          <input
            type="password"
            required
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            placeholder="••••••••"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <p className="text-[10px] text-slate-400 mt-1 italic">
            *Berikan password ini kepada admin baru agar mereka bisa login
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all"
          >
            Batal
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
          >
            {loading ? "Menyimpan..." : "Simpan Admin"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddAdminModal;
