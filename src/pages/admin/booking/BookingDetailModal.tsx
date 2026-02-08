import Modal from "../../../components/FormModal";
import type { Booking } from "../../../services/booking";

interface BookingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null; // Nanti ganti dengan interface Booking kamu
  onConfirm: (id: string) => void;
}

const BookingDetailModal = ({
  isOpen,
  onClose,
  booking,
  onConfirm,
}: BookingDetailModalProps) => {
  if (!booking) return null;

  const handleConfirmAction = () => {
    onConfirm(booking.id as string);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Detail Booking #${booking.id}`}
    >
      <div className="space-y-6">
        {/* Info Pelanggan & Lapangan */}
        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div>
            <p className="text-[10px] uppercase text-slate-400 font-bold">
              Pelanggan
            </p>
            <p className="text-sm font-bold text-slate-700">
              {booking.user.name}
            </p>
            <p className="text-xs text-slate-500">{booking.user.email}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase text-slate-400 font-bold">
              Lapangan
            </p>
            <p className="text-sm font-bold text-indigo-600">
              {booking.field.name}
            </p>
            <p className="text-xs text-slate-500">{booking.createdAt}</p>
          </div>
        </div>

        {/* Waktu & Harga */}
        <div className="flex justify-between items-center px-1">
          <div>
            <p className="text-[10px] uppercase text-slate-400 font-bold">
              Jam Main
            </p>
            <p className="text-sm font-black text-slate-700">
              {String(booking.slot)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase text-slate-400 font-bold">
              Total Bayar
            </p>
            <p className="text-lg font-black text-emerald-600">
              Rp {booking.totalPrice.toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        {/* Bukti Pembayaran */}
        <div className="space-y-2">
          <p className="text-[10px] uppercase text-slate-400 font-bold">
            Bukti Transfer
          </p>
          <div className="relative aspect-video w-full bg-slate-200 rounded-xl overflow-hidden border-2 border-dashed border-slate-300 group">
            {/* Simulasi Gambar. Nanti ganti src dengan URL dari backend */}
            <img
              src="https://placehold.co/600x400/e2e8f0/64748b?text=Bukti+Transfer+User"
              alt="Bukti Transfer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-xs font-bold bg-black/50 px-3 py-1 rounded-full">
                Klik untuk Perbesar
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all"
          >
            Tutup
          </button>
          {booking.status === "PENDING" && (
            <button
              onClick={handleConfirmAction}
              className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-100"
            >
              Konfirmasi Pembayaran
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default BookingDetailModal;
