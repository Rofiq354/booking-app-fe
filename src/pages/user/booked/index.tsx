import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { bookingService, type Booking } from "../../../services/booking";
import {
  CalendarCheck,
  Clock,
  PackageOpen,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Timer,
} from "lucide-react";

// ── Helpers ─────────────────────────────────────────────────────────────────
const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  }) + " WIB";

// ── Status Config ────────────────────────────────────────────────────────────
const statusConfig = {
  PENDING: {
    label: "Menunggu Pembayaran",
    icon: Timer,
    className: "badge-pending",
    dot: "bg-warning",
  },
  CONFIRMED: {
    label: "Dikonfirmasi",
    icon: CheckCircle2,
    className: "badge-available",
    dot: "bg-success",
  },
  CANCELLED: {
    label: "Dibatalkan",
    icon: XCircle,
    className: "badge-booked",
    dot: "bg-destructive",
  },
} as const;

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

// ── Booking Card ─────────────────────────────────────────────────────────────
const BookingCard = ({ booking }: { booking: Booking }) => {
  const status = statusConfig[booking.status];
  const StatusIcon = status.icon;

  return (
    <div className="group bg-card border border-border hover:border-primary/30 rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-md">
      <div className="flex gap-0 sm:gap-4">
        {/* Field Image */}
        <div className="hidden sm:block w-28 flex-shrink-0">
          {booking.field.image ? (
            <img
              src={booking.field.image}
              alt={booking.field.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center min-h-[100px]">
              <span className="text-3xl opacity-20">🏟️</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-5 space-y-3 min-w-0">
          {/* Top row: nama + status */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-black text-base text-foreground truncate leading-tight">
                {booking.field.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                #{String(booking.id).padStart(5, "0")}
              </p>
            </div>

            {/* Status badge */}
            <span
              className={`${status.className} flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide flex-shrink-0 border`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${status.dot} flex-shrink-0`}
              />
              <span className="hidden sm:inline">{status.label}</span>
              <StatusIcon size={11} className="sm:hidden" />
            </span>
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap gap-3">
            {booking.slot && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock size={12} className="text-primary flex-shrink-0" />
                <span>
                  {formatTime(booking.slot.startTime)} –{" "}
                  {formatTime(booking.slot.endTime)}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarCheck size={12} className="text-primary flex-shrink-0" />
              <span>{formatDate(booking.createdAt)}</span>
            </div>
          </div>

          {/* Bottom row: harga */}
          <div className="flex items-center justify-between pt-1 border-t border-border">
            <div>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                Total Harga
              </span>
              <div className="text-base font-black text-primary leading-tight">
                {formatPrice(booking.field.price)}
              </div>
            </div>

            {/* Label status mobile */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground sm:hidden">
              <StatusIcon size={13} />
              <span className="font-medium">{status.label}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
              <BookingCard key={booking.id} booking={booking} />
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

export default UserBookingPage;
