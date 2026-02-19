// src/components/AdminLayout.tsx
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../../layouts/Sidebar";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

const AdminLayout = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 ml-64 p-10">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
