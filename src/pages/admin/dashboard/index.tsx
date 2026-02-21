import { useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  Users,
  ShieldCheck,
  TrendingUp,
  CalendarCheck,
  Clock,
  Plus,
  Mail,
  Crown,
  Activity,
  LayoutDashboard,
  Loader2,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import { adminService, type AdminUser } from "../../../services/user-admin";
import { bookingService, type Booking } from "../../../services/booking";
import { fieldService } from "../../../services/field";
import { getErrorMessage } from "../../../utils/error";
import { fullFormatPrice } from "../../../utils/format";

// ── Create Admin Modal ──────────────────────────────────────────────
const CreateAdminModal = ({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (!isOpen) setForm({ name: "", email: "", password: "" });
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      toast.error("Semua field wajib diisi!");
      return;
    }
    setLoading(true);
    try {
      await adminService.createAdmin(form);
      toast.success("Admin baru berhasil dibuat!");
      onSuccess();
      onClose();
    } catch (error) {
      const e = getErrorMessage(error);
      toast.error(e.message as string);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[3px]"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-background rounded-2xl border border-border shadow-[var(--shadow-lg-value)] overflow-hidden">
          {/* Modal Header */}
          <div className="gradient-primary px-6 py-5 flex items-center justify-between">
            <div>
              <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">
                Manajemen Admin
              </p>
              <h3 className="text-white text-lg font-black">
                Tambah Admin Baru
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X size={15} className="text-white" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-4">
            <div>
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-1.5">
                Nama Lengkap
              </label>
              <input
                type="text"
                placeholder="Masukkan nama admin"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/50 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-1.5">
                Email
              </label>
              <input
                type="email"
                placeholder="admin@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/50 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Min. 8 karakter"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full px-4 py-2.5 pr-10 rounded-xl border border-border bg-muted/50 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 pb-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-border bg-muted text-muted-foreground text-sm font-bold hover:bg-accent transition-all"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-[2] py-2.5 rounded-xl gradient-primary text-white text-sm font-black hover:opacity-90 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Membuat...
                </>
              ) : (
                <>
                  <Plus size={14} />
                  Buat Admin
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// ── Main Dashboard Page ─────────────────────────────────────────────
const DashboardPage = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [fieldCount, setFieldCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAll = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [adminRes, bookingRes, fieldRes] = await Promise.all([
        adminService.getAllAdmins(),
        bookingService.getAllBookings(),
        fieldService.getAllFields(),
      ]);
      setAdmins(adminRes.data);
      setBookings(bookingRes.data);
      setFieldCount((fieldRes.data as unknown[]).length);
    } catch (error) {
      const e = getErrorMessage(error);
      toast.error(e.message as string);
    } finally {
      if (!silent) setTimeout(() => setLoading(false), 600);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Stats
  const totalIncome = bookings
    .filter((b) => b.status === "CONFIRMED")
    .reduce((sum, b) => sum + (b.field?.price || 0), 0);

  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;
  const confirmedCount = bookings.filter(
    (b) => b.status === "CONFIRMED",
  ).length;

  const recentBookings = [...bookings]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  const stats = [
    {
      label: "Total Pendapatan",
      value: fullFormatPrice(totalIncome),
      icon: TrendingUp,
      color: "text-success",
      bg: "bg-success/10 border-success/20",
      dot: "bg-success",
    },
    {
      label: "Total Booking",
      value: bookings.length,
      icon: CalendarCheck,
      color: "text-info",
      bg: "bg-info/10 border-info/20",
      dot: "bg-info",
    },
    {
      label: "Menunggu Konfirmasi",
      value: pendingCount,
      icon: Clock,
      color: "text-warning",
      bg: "bg-warning-soft border-warning/20",
      dot: "bg-warning",
    },
    {
      label: "Lapangan Aktif",
      value: fieldCount,
      icon: Activity,
      color: "text-primary",
      bg: "bg-primary-soft border-primary/10",
      dot: "bg-primary",
    },
  ];

  const statusStyle: Record<string, string> = {
    PENDING: "badge-pending",
    CONFIRMED: "bg-success/10 text-success border border-success/20",
    CANCELLED:
      "bg-destructive-soft text-destructive border border-destructive/20",
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-8 bg-background min-h-screen space-y-6">
        {/* Skeleton header */}
        <div className="h-20 rounded-2xl bg-card border border-border animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-2xl bg-card border border-border animate-pulse"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 rounded-2xl bg-card border border-border animate-pulse" />
          <div className="h-80 rounded-2xl bg-card border border-border animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 bg-background min-h-screen">
      <Toaster position="top-center" />

      {/* ── Page Header ── */}
      <div className="relative overflow-hidden bg-card rounded-2xl border border-border shadow-[var(--shadow-card-value)] px-5 sm:px-8 py-6 mb-6">
        {/* Decorative bg pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)`,
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0">
              <LayoutDashboard size={20} className="text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                Panel Kontrol
              </p>
              <h1 className="text-xl sm:text-2xl font-black text-foreground leading-tight">
                Dashboard Admin
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full self-start sm:self-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Live •{" "}
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </div>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {stats.map(({ label, value, icon: Icon, color, bg, dot }) => (
          <div
            key={label}
            className="bg-card rounded-2xl border border-border shadow-[var(--shadow-card-value)] p-4 sm:p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={`w-9 h-9 rounded-xl ${bg} border flex items-center justify-center`}
              >
                <Icon size={16} className={color} />
              </div>
              <span className={`w-1.5 h-1.5 rounded-full mt-1 ${dot}`} />
            </div>
            <p className="text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 leading-tight">
              {label}
            </p>
            <p
              className={`text-xl sm:text-2xl font-black ${color} leading-none font-mono`}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Bottom Grid: Recent Bookings + Admin List ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Bookings */}
        <div className="bg-card rounded-2xl border border-border shadow-[var(--shadow-card-value)] overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarCheck size={15} className="text-primary" />
              <h2 className="text-sm font-black text-foreground uppercase tracking-tight">
                Booking Terbaru
              </h2>
            </div>
            <span className="text-[9px] font-black bg-primary-soft text-primary px-2 py-0.5 rounded-full uppercase tracking-wide">
              {confirmedCount} Confirmed
            </span>
          </div>

          <div className="divide-y divide-border">
            {recentBookings.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <CalendarCheck size={32} className="mx-auto opacity-20 mb-2" />
                <p className="text-xs">Belum ada booking</p>
              </div>
            ) : (
              recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="px-5 sm:px-6 py-3.5 flex items-center gap-3 hover:bg-muted/40 transition-colors"
                >
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-xl gradient-primary-soft border border-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-black text-primary">
                      {booking.user?.name?.charAt(0).toUpperCase() ?? "?"}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate leading-tight">
                      {booking.user?.name ?? "N/A"}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {booking.field?.name} •{" "}
                      {new Date(booking.slot?.startTime).toLocaleTimeString(
                        "id-ID",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </p>
                  </div>

                  <span
                    className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg flex-shrink-0 ${statusStyle[booking.status]}`}
                  >
                    {booking.status}
                  </span>
                </div>
              ))
            )}
          </div>

          {bookings.length > 5 && (
            <div className="px-5 sm:px-6 py-3 border-t border-border">
              <p className="text-[10px] text-muted-foreground text-center">
                +{bookings.length - 5} booking lainnya
              </p>
            </div>
          )}
        </div>

        {/* Admin Management */}
        <div className="bg-card rounded-2xl border border-border shadow-[var(--shadow-card-value)] overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck size={15} className="text-primary" />
              <h2 className="text-sm font-black text-foreground uppercase tracking-tight">
                Tim Admin
              </h2>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 gradient-primary text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl hover:opacity-90 transition-all active:scale-95 shadow-sm"
            >
              <Plus size={12} strokeWidth={3} />
              Tambah
            </button>
          </div>

          <div className="divide-y divide-border">
            {admins.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <Users size={32} className="mx-auto opacity-20 mb-2" />
                <p className="text-xs">Belum ada admin terdaftar</p>
              </div>
            ) : (
              admins.map((admin, i) => (
                <div
                  key={admin.id}
                  className="px-5 sm:px-6 py-3.5 flex items-center gap-3 hover:bg-muted/40 transition-colors"
                >
                  {/* Avatar with rank */}
                  <div className="relative flex-shrink-0">
                    <div className="w-9 h-9 rounded-xl bg-primary-soft border border-primary/20 flex items-center justify-center">
                      <span className="text-xs font-black text-primary">
                        {admin.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {i === 0 && (
                      <Crown
                        size={10}
                        className="absolute -top-1 -right-1 text-amber-500"
                        fill="currentColor"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-foreground truncate leading-tight">
                        {admin.name}
                      </p>
                      <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-primary-soft text-primary flex-shrink-0">
                        {admin.role}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Mail size={9} />
                      <p className="text-[10px] truncate">{admin.email}</p>
                    </div>
                  </div>

                  <p className="text-[9px] text-muted-foreground flex-shrink-0 hidden sm:block">
                    {new Date(admin.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="px-5 sm:px-6 py-3 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Users size={11} className="text-muted-foreground" />
              <p className="text-[10px] text-muted-foreground">
                {admins.length} admin terdaftar
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Booking Status Breakdown ── */}
      <div className="mt-4 sm:mt-6 bg-card rounded-2xl border border-border shadow-[var(--shadow-card-value)] px-5 sm:px-6 py-5">
        <div className="flex items-center gap-2 mb-4">
          <Activity size={15} className="text-primary" />
          <h2 className="text-sm font-black text-foreground uppercase tracking-tight">
            Rekap Status Booking
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {[
            {
              label: "Confirmed",
              count: confirmedCount,
              total: bookings.length,
              color: "bg-success",
              textColor: "text-success",
              bg: "bg-success/10",
            },
            {
              label: "Pending",
              count: pendingCount,
              total: bookings.length,
              color: "bg-warning",
              textColor: "text-warning-text",
              bg: "bg-warning-soft",
            },
            {
              label: "Cancelled",
              count: bookings.filter((b) => b.status === "CANCELLED").length,
              total: bookings.length,
              color: "bg-destructive",
              textColor: "text-destructive",
              bg: "bg-destructive-soft",
            },
          ].map(({ label, count, total, color, textColor, bg }) => {
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div key={label} className={`${bg} rounded-xl p-3 sm:p-4`}>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${textColor}`}
                  >
                    {label}
                  </span>
                  <span className={`text-[9px] font-black ${textColor}`}>
                    {pct}%
                  </span>
                </div>
                <p
                  className={`text-2xl sm:text-3xl font-black ${textColor} font-mono leading-none mb-2`}
                >
                  {count}
                </p>
                {/* Progress bar */}
                <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${color} rounded-full transition-all duration-700`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Admin Modal */}
      <CreateAdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchAll(true)}
      />
    </div>
  );
};

export default DashboardPage;
