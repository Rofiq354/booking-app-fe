import { Navigate, Route, Routes } from "react-router-dom";
import { useAppDispatch, type RootState } from "./store";
import AdminLayout from "./pages/admin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FieldPage from "./pages/admin/field";
import DashboardPage from "./pages/admin/dashboard";
import { useSelector } from "react-redux";
import BookingPage from "./pages/admin/booking";
import SetAdminPage from "./pages/admin/set-admin";
import { useEffect, useRef, useState } from "react";
import { getMe } from "./store/authSlice";
import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/user/landing-page";
import UserLayout from "./pages/user";
import OfflineScreen from "./lib/OffileScreen";
import FieldsPage from "./pages/user/fields";
import FieldDetailPage from "./pages/user/fields/detail";
import UserBookingPage from "./pages/user/booked";

// ── Guard: hanya bisa diakses jika belum login ─────────────────────────────
// Jika sudah login → redirect sesuai role
const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  if (!user) return <>{children}</>;
  return <Navigate to={user.role === "ADMIN" ? "/admin" : "/"} replace />;
};

// ── Guard: hanya bisa diakses jika sudah login sebagai admin ───────────────
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "ADMIN") return <Navigate to="/" replace />;
  return <>{children}</>;
};

function App() {
  const dispatch = useAppDispatch();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { isInitialized } = useSelector((state: RootState) => state.auth);
  const [showLoading, setShowLoading] = useState(true);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      dispatch(getMe());
      initialized.current = true;
    }
  }, [dispatch]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isInitialized) {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 1500); // 1.5 detik delay tambahan
      return () => clearTimeout(timer);
    }
  }, [isInitialized]);

  if (!isOnline) return <OfflineScreen />;

  if (showLoading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-9999">
        <div className="relative flex items-center justify-center mb-8">
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
          <div className="relative w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 transform rotate-12 transition-transform duration-700">
            <span className="text-primary-foreground font-black text-3xl -rotate-12 italic">
              F
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <h2 className="text-foreground font-black text-xl italic tracking-tight uppercase">
            Futsal<span className="text-primary">Hub</span>
          </h2>

          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em] mt-3 animate-pulse">
            Menyiapkan Lapangan...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        {/* ── Auth routes (hanya untuk yang belum login) ── */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />

        {/* ── Admin routes (hanya untuk role admin) ── */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="field" element={<FieldPage />} />
          <Route path="data-booking" element={<BookingPage />} />
          <Route path="data-admin" element={<SetAdminPage />} />
        </Route>

        {/* ── User routes ── */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="fields">
            <Route index element={<FieldsPage />} />
            <Route path=":id" element={<FieldDetailPage />} />
          </Route>
          <Route path="/booked" element={<UserBookingPage />} />
        </Route>

        <Route path="*" element={<div>Halaman Tidak Ditemukan</div>} />
      </Routes>
    </>
  );
}

export default App;
