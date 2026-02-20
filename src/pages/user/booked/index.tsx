import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { bookingService, type Booking } from "../../../services/booking";
import { CalendarCheck, PackageOpen, RefreshCw, XCircle } from "lucide-react";
import BookingCard from "./BookingCard";

// ── Filter Tab ───────────────────────────────────────────────────────────────
type FilterType = "ALL" | "PENDING" | "CONFIRMED" | "CANCELLED";

const filters: { key: FilterType; label: string }[] = [
  { key: "ALL", label: "Semua" },
  { key: "PENDING", label: "Menunggu" },
  { key: "CONFIRMED", label: "Dikonfirmasi" },
  { key: "CANCELLED", label: "Dibatalkan" },
];

// ── Main Page ─────────────────────────────────────────────────────────────────
const UserBookingPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await bookingService.getUserBookings();
      setBookings(res.data);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data booking. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filtered =
    activeFilter === "ALL"
      ? bookings
      : bookings.filter((b) => b.status === activeFilter);

  const countByStatus = (key: FilterType) =>
    key === "ALL"
      ? bookings.length
      : bookings.filter((b) => b.status === key).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* ── Header ── */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-foreground tracking-tight">
                Booking Saya
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Riwayat dan status booking lapangan kamu.
              </p>
            </div>

            {/* Refresh button */}
            <button
              onClick={fetchBookings}
              disabled={loading}
              className="w-10 h-10 rounded-xl border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          {/* Stats summary */}
          {!loading && bookings.length > 0 && (
            <div className="flex gap-4 pt-3">
              {[
                {
                  label: "Total",
                  value: bookings.length,
                  color: "text-foreground",
                },
                {
                  label: "Pending",
                  value: countByStatus("PENDING"),
                  color: "text-warning",
                },
                {
                  label: "Confirmed",
                  value: countByStatus("CONFIRMED"),
                  color: "text-success",
                },
                {
                  label: "Cancelled",
                  value: countByStatus("CANCELLED"),
                  color: "text-destructive",
                },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className={`text-xl font-black leading-none ${s.color}`}>
                    {s.value}
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Filter Tabs ── */}
        {!loading && bookings.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {filters.map((f) => {
              const count = countByStatus(f.key);
              const isActive = activeFilter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 border flex-shrink-0
                    ${
                      isActive
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-foreground hover:bg-primary/5"
                    }`}
                >
                  {f.label}
                  <span
                    className={`text-xs font-black px-1.5 py-0.5 rounded-full leading-none
                    ${isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* ── Content ── */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-4 py-16">
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
              <XCircle size={28} className="text-destructive" />
            </div>
            <p className="text-sm font-semibold text-muted-foreground">
              {error}
            </p>
            <button
              onClick={fetchBookings}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-bold hover:scale-105 transition-transform"
            >
              <RefreshCw size={14} />
              Coba Lagi
            </button>
          </div>
        ) : filtered.length === 0 && activeFilter !== "ALL" ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
              <CalendarCheck size={28} className="text-muted-foreground/40" />
            </div>
            <p className="text-sm font-semibold text-muted-foreground">
              Tidak ada booking dengan status ini.
            </p>
            <button
              onClick={() => setActiveFilter("ALL")}
              className="text-xs font-bold text-primary hover:underline"
            >
              Lihat semua booking
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            {filtered.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onSuccess={fetchBookings}
              />
            ))}

            {/* Footer count */}
            <p className="text-center text-xs text-muted-foreground pt-2">
              Menampilkan {filtered.length} dari {bookings.length} booking
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Skeleton Card ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
    <div className="flex gap-4 p-5">
      <div className="w-20 h-20 rounded-xl bg-muted flex-shrink-0" />
      <div className="flex-1 space-y-2.5 py-1">
        <div className="h-4 bg-muted rounded-lg w-2/3" />
        <div className="h-3 bg-muted rounded-lg w-1/2" />
        <div className="h-3 bg-muted rounded-lg w-1/3" />
      </div>
      <div className="w-20 h-6 bg-muted rounded-full self-start" />
    </div>
  </div>
);

// ── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 gap-5 text-center">
    <div className="w-24 h-24 rounded-3xl bg-muted flex items-center justify-center">
      <PackageOpen size={40} className="text-muted-foreground/40" />
    </div>
    <div className="space-y-1.5">
      <h3 className="text-lg font-black text-foreground">Belum Ada Booking</h3>
      <p className="text-muted-foreground text-sm max-w-xs">
        Kamu belum pernah melakukan booking lapangan. Yuk mulai booking
        sekarang!
      </p>
    </div>
    <Link
      to="/fields"
      className="px-6 py-3 bg-primary text-primary-foreground rounded-full text-sm font-black uppercase tracking-wide hover:scale-105 active:scale-95 transition-all shadow-lg"
    >
      Lihat Lapangan
    </Link>
  </div>
);

export default UserBookingPage;
