import { X } from "lucide-react";
import type { FieldWithSlots } from ".";

const DetailDrawer = ({
  field,
  onClose,
}: {
  field: FieldWithSlots | null;
  onClose: () => void;
}) => {
  if (!field) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[60] lg:left-64" onClick={onClose} />

      {/* Drawer Panel */}
      <aside className="fixed top-0 right-0 h-screen w-full max-w-md bg-card border-l border-border shadow-2xl z-[70] flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header Drawer */}
        <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
          <div>
            <h2 className="text-xl font-black text-foreground uppercase tracking-tight">
              Detail Lapangan
            </h2>
            <p className="text-xs text-primary font-bold">Informasi Lengkap</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Drawer */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Image Section */}
          <div className="aspect-video w-full rounded-2xl overflow-hidden border border-border shadow-sm bg-muted">
            {field.image ? (
              <img
                src={field.image}
                alt={field.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                Tidak ada gambar
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="grid gap-6">
            <div>
              <label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">
                Nama Lapangan
              </label>
              <p className="text-lg font-bold text-foreground">{field.name}</p>
            </div>

            <div>
              <label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">
                Harga Sewa
              </label>
              <p className="text-2xl font-black text-primary">
                Rp {field.price.toLocaleString("id-ID")}
                <span className="text-sm font-medium text-muted-foreground">
                  {" "}
                  / Jam
                </span>
              </p>
            </div>

            <div>
              <label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">
                Deskripsi
              </label>
              <div className="mt-1 p-4 bg-muted/50 rounded-xl border border-border text-sm text-foreground leading-relaxed italic">
                "
                {field.description || "Tidak ada deskripsi untuk lapangan ini."}
                "
              </div>
            </div>

            {/* Jadwal Summary di Detail */}
            <div className="pb-5">
              <label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">
                Status Jadwal
              </label>
              <div className="mt-2 flex items-center gap-2">
                {field.slots && field.slots.length > 0 ? (
                  <span className="badge-available px-3 py-1 rounded-full text-xs font-bold uppercase">
                    Aktif ({field.slots.length} Sesi)
                  </span>
                ) : (
                  <span className="badge-booked px-3 py-1 rounded-full text-xs font-bold uppercase">
                    Belum Ada Jadwal
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DetailDrawer;
