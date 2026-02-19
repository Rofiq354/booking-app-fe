import toast, { Toaster } from "react-hot-toast";
import DataTable from "../../../components/DataTable";
import { useCallback, useEffect, useMemo, useState } from "react";
import BookingDetailModal from "./BookingDetailModal";
import { bookingService, type Booking } from "../../../services/booking";
import { getErrorMessage } from "../../../utils/error";

const BookingPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const fetchBookings = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsInitialLoad(true);
    try {
      const res = await bookingService.getAllBookings();
      console.log(res);
      setBookings(res.data);
    } catch (error) {
      const errorData = getErrorMessage(error);
      toast.error(errorData.message as string);
    } finally {
      if (!isSilent) {
        setTimeout(() => setIsInitialLoad(false), 1000);
      }
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const stats = useMemo(() => {
    const totalReservations = bookings.length;

    const pendingConfirmation = bookings.filter(
      (b) => b.status === "PENDING",
    ).length;

    const totalIncome = bookings
      .filter((b) => b.status === "CONFIRMED") // Sesuaikan status yang dianggap masuk uang
      .reduce((sum, b) => {
        // Tambahkan pengecekan agar tidak error jika field belum keload
        const price = b.field?.price || 0;
        return sum + price;
      }, 0);

    return { totalReservations, pendingConfirmation, totalIncome };
  }, [bookings]);

  // const handleViewDetail = (booking: Booking) => {
  //   setSelectedBooking(booking);
  //   setIsDetailModalOpen(true);
  // };

  // const handleConfirm = (id: string) => {
  //   setBookings((prev) =>
  //     prev.map((b) => (b.id === id ? { ...b, status: "CONFIRMED" } : b)),
  //   );
  //   toast.success(`Booking ${id} berhasil dikonfirmasi!`);
  // };

  const columns = [
    {
      header: "ID & Pelanggan",
      render: (item: Booking) => (
        <div className="flex flex-col">
          {/* ID Booking */}
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
            #BK-{item.id.toString().padStart(4, "0")}
          </span>
          {/* Data dari item.user */}
          <span className="font-bold text-slate-800">
            {item.user?.name || "N/A"}
          </span>
          <span className="text-[11px] text-slate-400 lowercase">
            {item.user?.email}
          </span>
        </div>
      ),
    },
    {
      header: "Detail Lapangan",
      render: (item: Booking) => (
        <div className="flex flex-col">
          {/* Data dari item.field */}
          <span className="text-sm font-semibold text-indigo-600">
            {item.field?.name}
          </span>
          <span className="text-[10px] text-slate-400">
            Harga Dasar: Rp {item.field?.price.toLocaleString("id-ID")}
          </span>
        </div>
      ),
    },
    {
      header: "Jadwal Main",
      render: (item: Booking) => (
        <div className="flex flex-col">
          {/* Data dari item.slot */}
          <span className="text-sm font-bold text-slate-700">
            {new Date(item.slot?.startTime).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            -
            {new Date(item.slot?.endTime).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <span className="text-[10px] text-slate-500 uppercase tracking-tight">
            {new Date(item.slot?.startTime).toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "short",
            })}
          </span>
        </div>
      ),
    },
    {
      header: "Status",
      render: (item: Booking) => {
        const statusStyles: Record<string, string> = {
          PENDING: "bg-amber-50 text-amber-600 border-amber-100",
          CONFIRMED: "bg-emerald-50 text-emerald-600 border-emerald-100",
          CANCELLED: "bg-red-50 text-red-600 border-red-100",
        };
        return (
          <span
            className={`px-2.5 py-1 rounded-lg text-[10px] font-black border ${statusStyles[item.status]}`}
          >
            {item.status}
          </span>
        );
      },
    },
  ];

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Riwayat Booking</h1>
        <p className="text-slate-500 text-sm">
          Pantau dan verifikasi penyewaan lapangan masuk
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Reservasi */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
            Total Reservasi
          </p>
          <p className="text-3xl font-black text-slate-800">
            {stats.totalReservations}
          </p>
        </div>

        {/* Menunggu Konfirmasi */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
          <p className="text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-1">
            Menunggu Konfirmasi
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-slate-800">
              {stats.pendingConfirmation}
            </p>
            <span className="text-xs text-slate-400 font-medium tracking-tight italic">
              Bookingan
            </span>
          </div>
        </div>

        {/* Pendapatan */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
          <p className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest mb-1">
            Total Pendapatan
          </p>
          <p className="text-3xl font-black text-slate-800 font-mono">
            Rp {stats.totalIncome.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      <DataTable columns={columns} data={bookings} isLoading={isInitialLoad} />

      <BookingDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedBooking(null);
        }}
        booking={selectedBooking}
        onConfirm={() => console.log("fitur belum ada")}
      />
    </div>
  );
};

export default BookingPage;
