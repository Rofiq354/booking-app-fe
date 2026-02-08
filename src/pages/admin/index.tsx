// src/components/AdminLayout.tsx
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../../layouts/Sidebar";
import { useSelector } from "react-redux";
import { getMe } from "../../store/authSlice";
import { useAppDispatch, type RootState } from "../../store";
import { useEffect } from "react";

const AdminLayout = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar menempel di kiri */}
      <Sidebar />

      {/* Konten Utama: ml-64 (margin-left: 16rem) untuk memberi ruang bagi sidebar */}
      <main className="flex-1 ml-64 p-10">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export const ProtectedRoute = () => {
  const { user, isInitialized } = useSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  if (!isInitialized) {
    return <div className="loading">Checking Session...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AdminLayout;
