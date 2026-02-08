import { Navigate, Route, Routes } from "react-router-dom";
import { type RootState } from "./store";
import AdminLayout, { ProtectedRoute } from "./pages/admin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FieldPage from "./pages/admin/field";
import Dashboard from "./pages/admin/dashboard";
import { useSelector } from "react-redux";
import BookingPage from "./pages/admin/booking";
import SetAdminPage from "./pages/admin/set-admin";
import "./App.css";

function App() {
  const { user } = useSelector((state: RootState) => state.auth);
  return (
    <Routes>
      {/* Jika user sudah login, jangan kasih mereka buka halaman login lagi */}
      <Route
        path="/login"
        element={user ? <Navigate to="/admin" replace /> : <Login />}
      />

      <Route path="/register" element={<Register />} />

      {/* Rute yang diproteksi */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="field" element={<FieldPage />} />
          <Route path="data-booking" element={<BookingPage />} />
          <Route path="data-admin" element={<SetAdminPage />} />
        </Route>
      </Route>

      {/* Redirect root ke /admin */}
      <Route path="/" element={<Navigate to="/admin" replace />} />
      <Route path="*" element={<div>Halaman Tidak Ditemukan</div>} />
    </Routes>
  );
}

export default App;
