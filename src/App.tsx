import { Navigate, Route, Routes } from "react-router-dom";
import { useAppDispatch, type RootState } from "./store";
import AdminLayout from "./pages/admin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FieldPage from "./pages/admin/field";
import Dashboard from "./pages/admin/dashboard";
import { useSelector } from "react-redux";
import BookingPage from "./pages/admin/booking";
import SetAdminPage from "./pages/admin/set-admin";
import "./App.css";
import { useEffect, useRef, useState } from "react";
import { getMe } from "./store/authSlice";
import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/user/landing-page";
import UserLayout from "./pages/user";
import OfflineScreen from "./lib/OffileScreen";

function App() {
  const dispatch = useAppDispatch();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { user, isInitialized } = useSelector((state: RootState) => state.auth);
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

  if (!isOnline) {
    return <OfflineScreen />;
  }

  if (!isInitialized) {
    return <div className="loading-screen">Memuat Aplikasi...</div>;
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/admin" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/admin" replace /> : <Register />}
        />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="field" element={<FieldPage />} />
          <Route path="data-booking" element={<BookingPage />} />
          <Route path="data-admin" element={<SetAdminPage />} />
        </Route>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<LandingPage />} />
        </Route>

        {/* Redirect root ke /admin */}
        <Route path="*" element={<div>Halaman Tidak Ditemukan</div>} />
      </Routes>
    </>
  );
}

export default App;
