import {
  LayoutDashboard,
  LogOut,
  Dumbbell,
  CalendarCheck,
  ShieldCheck,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../store/authSlice";
import { useAppDispatch } from "../store";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import toast from "react-hot-toast";
import { useState } from "react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin", exact: true },
  { icon: Dumbbell, label: "Lapangan", path: "/admin/field" },
  { icon: CalendarCheck, label: "Data Booking", path: "/admin/data-booking" },
  { icon: ShieldCheck, label: "Admin", path: "/admin/data-admin" },
];

/* eslint-disable @typescript-eslint/no-explicit-any */
interface SidebarContentProps {
  collapsed: boolean;
  user: any;
  handleLogout: () => void;
  isActive: (item: (typeof menuItems)[0]) => boolean;
  setMobileOpen: (open: boolean) => void;
}

const SidebarContent = ({
  collapsed,
  user,
  handleLogout,
  isActive,
  setMobileOpen,
}: SidebarContentProps) => (
  <>
    {/* Brand */}
    <div
      className={`border-b border-sidebar-border ${collapsed ? "px-2 py-5" : "px-5 py-6"}`}
    >
      <Link
        to="/"
        className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}
      >
        {/* Kotak Logo */}
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-sidebar-primary shadow-lg shadow-sidebar-primary/20 transition-transform hover:scale-105">
          <img
            src="/brand.svg"
            alt="Logo"
            className="w-6 h-6 object-contain brightness-0 invert"
          />
        </div>

        {/* Teks Brand - Disembunyikan saat collapsed */}
        {!collapsed && (
          <div className="flex flex-col leading-none">
            <div className="font-black text-base tracking-tighter uppercase italic text-sidebar-foreground">
              Futsal<span className="text-sidebar-primary">Hub</span>
            </div>
            <div className="text-[10px] font-bold mt-1 text-muted-foreground uppercase tracking-widest">
              Admin Panel
            </div>
          </div>
        )}
      </Link>
    </div>

    {/* Nav */}
    <nav
      className={`flex-1 py-4 overflow-y-auto ${collapsed ? "px-2" : "px-3"}`}
    >
      {!collapsed && (
        <p className="text-xs font-semibold uppercase tracking-widest px-3 mb-3 text-muted-foreground/60">
          Menu Utama
        </p>
      )}

      <div className="space-y-0.5">
        {menuItems.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;

          return (
            <div key={item.path} className="relative group/item">
              <Link
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center transition-all duration-200 rounded-xl relative
                  ${collapsed ? "justify-center p-3" : "gap-3 px-3 py-2.5"}
                  ${active ? "bg-sidebar-accent text-sidebar-primary" : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"}`}
              >
                {active && !collapsed && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-sidebar-primary" />
                )}
                {active && collapsed && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-sidebar-primary" />
                )}

                <Icon size={18} />
                {!collapsed && (
                  <>
                    <span className="font-medium text-sm flex-1">
                      {item.label}
                    </span>
                    {active && (
                      <ChevronRight size={14} className="opacity-60" />
                    )}
                  </>
                )}
              </Link>
              {collapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover/item:opacity-100 transition-opacity bg-foreground text-background shadow-lg">
                  {item.label}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-foreground" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>

    {/* Bottom: User + Logout */}
    <div
      className={`border-t border-sidebar-border p-3 space-y-1 ${collapsed ? "px-2" : ""}`}
    >
      {user && !collapsed && (
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 bg-sidebar-accent/40">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm font-black bg-sidebar-primary text-sidebar-primary-foreground">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate leading-none text-sidebar-foreground">
              {user.name}
            </div>
            <div className="text-xs mt-0.5 truncate text-sidebar-foreground/50">
              {user.email}
            </div>
          </div>
        </div>
      )}

      {user && collapsed && (
        <div className="flex justify-center mb-1">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-black bg-sidebar-primary text-sidebar-primary-foreground">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>
      )}

      <div className="relative group/logout">
        <button
          onClick={handleLogout}
          className={`group flex items-center transition-all duration-200 rounded-xl w-full text-sidebar-foreground/50 hover:bg-destructive/15 hover:text-destructive
            ${collapsed ? "justify-center p-3" : "gap-3 px-3 py-2.5"}`}
        >
          <LogOut
            size={18}
            className="transition-transform group-hover:-translate-x-0.5"
          />
          {!collapsed && <span className="font-medium text-sm">Keluar</span>}
        </button>
        {collapsed && (
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover/logout:opacity-100 transition-opacity bg-foreground text-background shadow-lg">
            Keluar
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-foreground" />
          </div>
        )}
      </div>
    </div>
  </>
);

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success("Berhasil keluar");
      navigate("/login", { replace: true });
    } catch (err) {
      console.error(err);
      toast.error("Gagal logout, silakan coba lagi");
    }
  };

  const isActive = (item: (typeof menuItems)[0]) =>
    item.exact
      ? location.pathname === item.path
      : location.pathname.startsWith(item.path);

  return (
    <>
      {/* MOBILE: Hamburger trigger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-xl bg-sidebar border border-sidebar-border text-sidebar-foreground shadow-md"
      >
        <Menu size={20} />
      </button>

      {/* MOBILE: Backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* MOBILE: Drawer */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-screen w-64 z-50 flex flex-col bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          <X size={16} />
        </button>
        <SidebarContent
          collapsed={false}
          user={user}
          handleLogout={handleLogout}
          isActive={isActive}
          setMobileOpen={setMobileOpen}
        />
      </aside>

      {/* TABLET: Icon-only sidebar */}
      <aside className="hidden md:flex lg:hidden fixed top-0 left-0 h-screen w-16 z-40 flex-col bg-sidebar border-r border-sidebar-border">
        <SidebarContent
          collapsed={true}
          user={user}
          handleLogout={handleLogout}
          isActive={isActive}
          setMobileOpen={setMobileOpen}
        />
      </aside>

      {/* DESKTOP: Full sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-screen w-64 z-40 flex-col bg-sidebar border-r border-sidebar-border">
        <SidebarContent
          collapsed={false}
          user={user}
          handleLogout={handleLogout}
          isActive={isActive}
          setMobileOpen={setMobileOpen}
        />
      </aside>
    </>
  );
};

export default Sidebar;
