import React, { useEffect, useState, useRef } from "react";
import { fieldService, type FieldRequest } from "../../../services/field";
import toast from "react-hot-toast";
import { getErrorMessage } from "../../../utils/error";
import Modal from "../../../components/FormModal";
import { ImageIcon, Tag, AlignLeft, Banknote, UploadCloud } from "lucide-react";

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
    image: null,
  });

  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const data = initialData || {
        id: 0,
        name: "",
        description: "",
        price: 0,
        image: null,
      };
      setForm(data);
      setPreview(typeof data.image === "string" ? data.image : "");
    }
  }, [initialData, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, image: file });
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // FormField.tsx
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description || "");
      formData.append("price", form.price.toString());

      // Hanya append image jika user memilih file baru
      if (form.image instanceof File) {
        formData.append("image", form.image);
      }

      // Gunakan ID dari initialData atau form
      const targetId = initialData?.id || form.id;

      if (isEdit && targetId) {
        const result = await fieldService.updateField(targetId, formData);
        if (result.status === "success") {
          toast.success(result.message);
          onSuccess();
          onClose();
        }
      } else {
        const result = await fieldService.createField(formData);
        if (result.status === "success") {
          toast.success(result.message);
          onSuccess();
          onClose();
        }
      }
    } catch (error) {
      const errorData = getErrorMessage(error);
      toast.error(errorData.message as string);
    } finally {
      setLoading(false);
    }
  };

  const isEdit = !!initialData?.id;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Update Data Lapangan" : "Tambah Lapangan Baru"}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="p-1">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* KIRI: Upload Section */}
          <div className="w-full lg:w-2/5 space-y-3">
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
              <ImageIcon size={14} className="text-primary" />
              Thumbnail Lapangan
            </label>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative aspect-[4/3] lg:h-[300px] w-full rounded-2xl border-2 border-dashed border-border bg-muted/30 hover:bg-muted/50 hover:border-primary/50 transition-all cursor-pointer group overflow-hidden"
            >
              {preview ? (
                <>
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full text-xs font-bold text-black shadow-lg">
                      <UploadCloud size={16} /> Ganti Foto
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform">
                    <UploadCloud size={32} />
                  </div>
                  <p className="text-sm font-bold text-foreground">
                    Klik untuk upload
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tighter">
                    PNG, JPG up to 2MB
                  </p>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          {/* KANAN: Form Inputs */}
          <div className="w-full lg:w-3/5 space-y-5">
            <div className="grid grid-cols-1 gap-5">
              {/* Nama Lapangan */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                  <Tag size={14} className="text-primary" />
                  Nama Lapangan
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nama lapangan (misal: Lapang A)"
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              {/* Harga */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                  <Banknote size={14} className="text-primary" />
                  Harga per Jam
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">
                    Rp
                  </span>
                  <input
                    type="number"
                    required
                    placeholder="0"
                    className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-primary text-lg"
                    value={form.price || ""}
                    onChange={(e) =>
                      setForm({ ...form, price: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>

              {/* Deskripsi */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                  <AlignLeft size={14} className="text-primary" />
                  Deskripsi Lapangan
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm min-h-[100px] resize-none"
                  placeholder="Jelaskan fasilitas lapangan..."
                  value={form.description || ""}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Tombol Aksi - Rapi di kanan */}
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-muted text-muted-foreground font-bold rounded-xl hover:bg-muted/80 transition-all"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-primary text-primary-foreground font-black rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : isEdit ? (
                  "SIMPAN PERUBAHAN"
                ) : (
                  "BUAT LAPANGAN"
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default FormField;
