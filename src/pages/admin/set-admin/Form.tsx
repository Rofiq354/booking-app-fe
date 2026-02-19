import { useState } from "react";
import Modal from "../../../components/FormModal";
import { adminService } from "../../../services/user-admin";
import toast from "react-hot-toast";
import { getErrorMessage } from "../../../utils/error";
import { UserPlus, Mail, Lock, UserCircle } from "lucide-react";

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
      await adminService.createAdmin(formData);
      toast.success("Admin baru berhasil didaftarkan!");
      onSuccess();
      onClose();
    } catch (error) {
      const errorData = getErrorMessage(error);
      toast.error(errorData.message as string);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Admin Baru"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5 py-2">
        {/* Nama Lengkap */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <UserCircle size={14} className="text-primary" />
            Nama Lengkap
          </label>
          <input
            type="text"
            required
            className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/50"
            placeholder="Masukkan nama admin"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <Mail size={14} className="text-primary" />
            Alamat Email
          </label>
          <input
            type="email"
            required
            className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/50"
            placeholder="email@futsalhub.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <Lock size={14} className="text-primary" />
            Password Sementara
          </label>
          <input
            type="password"
            required
            className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm font-bold tracking-widest focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/50"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <div className="flex gap-2 p-3 bg-primary/5 rounded-lg border border-primary/10 mt-2">
            <p className="text-[10px] text-primary font-bold italic leading-relaxed">
              * Info: Berikan password ini kepada admin baru agar mereka bisa
              melakukan login pertama kali.
            </p>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-muted text-muted-foreground rounded-xl text-xs font-black uppercase tracking-widest hover:bg-muted/80 transition-all active:scale-95"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-[2] px-4 py-3 bg-primary text-primary-foreground rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus size={16} strokeWidth={3} />
                Daftarkan Admin
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddAdminModal;
