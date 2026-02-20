import React, { useState } from "react";
import {
  Search,
  Calendar,
  TicketPercent,
  Menu,
  X,
  LogOut,
  UserCircle,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { logoutUser } from "../store/authSlice";
import { useAppDispatch, useAppSelector } from "../store";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Ambil data user dari Redux
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success("Berhasil keluar");
      navigate("/");
    } catch (error) {
      toast.error("Gagal logout");
    }
  };

  return (
    <nav className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-[50]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* LOGO */}
          <Link
            to="/"
            className="shrink-0 flex items-center group cursor-pointer"
          >
            <div className="bg-primary p-1.5 rounded-lg mr-2 transform group-hover:rotate-12 transition-transform">
              <div className="w-6 h-6 border-2 border-primary-foreground rounded-full flex items-center justify-center">
                <div className="w-1 h-1 bg-primary-foreground rounded-full"></div>
              </div>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-black text-primary uppercase tracking-tighter italic">
                Futsal<span className="text-foreground">Hub</span>
              </span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                Arena Center
              </span>
            </div>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex space-x-1 items-center">
            <NavLink
              href="/fields"
              icon={<Search size={18} />}
              label="Cari Lapangan"
            />
            <NavLink
              href="/jadwal"
              icon={<Calendar size={18} />}
              label="Jadwal Saya"
            />
            {/* <NavLink
              href="/promo"
              icon={<TicketPercent size={18} />}
              label="Promo"
            /> */}

            <div className="h-8 w-px bg-border mx-4"></div>

            {user ? (
              /* Tampilan Jika Sudah Login */
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end mr-2">
                  <span className="text-xs font-black text-foreground uppercase tracking-tight italic leading-none">
                    {user.name}
                  </span>
                  <span className="text-[9px] font-bold text-primary uppercase tracking-widest">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={() => navigate("/profile")}
                  className="p-2 bg-secondary rounded-xl text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                >
                  <UserCircle size={22} />
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              /* Tampilan Jika Belum Login */
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-primary/20 active:scale-95 flex items-center gap-2"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-foreground hover:bg-muted rounded-xl transition-colors"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`
        md:hidden absolute w-full bg-background border-b border-border transition-all duration-300 ease-in-out overflow-hidden
        ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}
      `}
      >
        <div className="px-4 pt-2 pb-6 space-y-2 bg-card">
          <MobileNavLink
            href="/cari"
            icon={<Search size={20} />}
            label="Cari Lapangan"
          />
          <MobileNavLink
            href="/jadwal"
            icon={<Calendar size={20} />}
            label="Jadwal Saya"
          />
          <MobileNavLink
            href="/promo"
            icon={<TicketPercent size={20} />}
            label="Promo"
          />

          <div className="pt-4 border-t border-border mt-4 space-y-3">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2">
                  <UserCircle size={32} className="text-primary" />
                  <div>
                    <p className="text-sm font-black uppercase italic leading-none">
                      {user.name}
                    </p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">
                      {user.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-3 bg-muted text-destructive p-4 rounded-xl font-black uppercase tracking-widest text-xs"
                >
                  <LogOut size={20} /> Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center p-4 rounded-xl font-black uppercase tracking-widest text-xs text-muted-foreground border border-border"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-3 bg-primary text-primary-foreground p-4 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20"
                >
                  Daftar Sekarang
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Sub-components tetap sama atau ganti 'a' menjadi 'Link' jika pakai react-router
const NavLink = ({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) => (
  <Link
    to={href}
    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors rounded-xl hover:bg-primary/5 group"
  >
    <span className="group-hover:text-primary transition-colors italic">
      {icon}
    </span>
    <span className="uppercase tracking-tight">{label}</span>
  </Link>
);

const MobileNavLink = ({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) => (
  <Link
    to={href}
    className="flex items-center gap-4 px-4 py-3 text-base font-bold text-foreground hover:bg-muted rounded-xl transition-all"
  >
    <span className="text-primary">{icon}</span>
    <span className="uppercase tracking-tight">{label}</span>
  </Link>
);

export default Navbar;
