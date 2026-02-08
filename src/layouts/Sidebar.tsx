// src/components/Sidebar.tsx
import { ClipboardList, LayoutDashboard, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../store/authSlice";
import { useAppDispatch } from "../store";
import toast from "react-hot-toast";
// import { logout } from "../store/authSlice";

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // 1. Jalankan proses logout ke backend & redux
      await dispatch(logoutUser()).unwrap();

      // 2. Tampilkan pesan sukses
      toast.success("Berhasil keluar");

      // 3. Tendang ke halaman login
      navigate("/login", { replace: true });
    } catch (err) {
      console.error(err);
      toast.error("Gagal logout, silakan coba lagi");
    }
  };

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/admin" },
    {
      icon: <ClipboardList size={20} />,
      label: "Lapangan",
      path: "/admin/field",
    },
    {
      icon: <ClipboardList size={20} />,
      label: "Data Booking",
      path: "/admin/data-booking",
    },
    {
      icon: <ClipboardList size={20} />,
      label: "Admin",
      path: "/admin/data-admin",
    },
  ];

  return (
    <aside className="h-screen w-64 bg-slate-900 text-white flex flex-col p-4 fixed left-0 top-0 shadow-xl z-50">
      <div className="mb-10 px-2 text-2xl font-bold text-green-400 italic tracking-wider">
        FutsalHub
      </div>

      <nav className="flex-1">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 mb-2 ${
              location.pathname === item.path
                ? "bg-green-600 text-white shadow-lg shadow-green-900/20"
                : "hover:bg-slate-800 text-slate-400"
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="border-t border-slate-800 pt-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 text-slate-400 hover:text-red-400 w-full transition-colors group"
        >
          <LogOut
            size={20}
            className="group-hover:translate-x-1 transition-transform"
          />
          <span className="font-medium">Keluar</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
