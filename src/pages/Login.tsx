import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff, ArrowRight, Zap } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { loginUser } from "../store/authSlice";
import toast from "react-hot-toast";
import type { MyErrorResponse } from "../types/error";

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      // Redirect berdasarkan role
      if (result.role === "ADMIN") {
        navigate("/admin", { replace: true, state: { loginSuccess: true } });
      } else {
        navigate("/", { replace: true, state: { loginSuccess: true } });
      }
    } catch (err: unknown) {
      const error = err as MyErrorResponse;
      const displayMessage =
        typeof error.message === "string"
          ? error.message
          : Object.values(error.message)[0];
      toast.error(displayMessage as string);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* ── LEFT PANEL — Branding ── */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{
          background:
            "linear-gradient(145deg, hsl(142 100% 20%) 0%, hsl(150 100% 14%) 50%, hsl(155 90% 10%) 100%)",
        }}
      >
        {/* Field grid lines background */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `
              linear-gradient(white 1px, transparent 1px),
              linear-gradient(90deg, white 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Center circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full border-2 border-white/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-white/20 bg-white/5" />

        {/* Half circles kiri & kanan */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-40 h-80 rounded-r-full border-2 border-l-0 border-white/10" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-40 h-80 rounded-l-full border-2 border-r-0 border-white/10" />

        {/* Glows */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, hsl(142 100% 40%) 0%, transparent 70%)",
          }}
        />

        {/* Top brand */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
            <Zap size={20} className="text-white" fill="white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">
            FutsalHub
          </span>
        </div>

        {/* Center copy */}
        <div className="relative z-10 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-1.5">
              <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
              <span className="text-green-200 text-xs font-medium tracking-wide uppercase">
                Booking Lapangan Futsal Online
              </span>
            </div>
            <h1 className="text-5xl font-black text-white leading-[1.1] tracking-tight">
              Main Kapan Saja,
              <br />
              <span style={{ color: "hsl(142 100% 65%)" }}>
                Booking Sekarang.
              </span>
            </h1>
            <p className="text-green-200/70 text-lg max-w-sm leading-relaxed">
              Sistem manajemen booking futsal terpusat — pantau jadwal, kelola
              pembayaran, semua dalam satu dashboard.
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-8 pt-4">
            {[
              { value: "12+", label: "Lapangan Tersedia" },
              { value: "340+", label: "Booking / Bulan" },
              { value: "24/7", label: "Bisa Booking" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-black text-white">{s.value}</div>
                <div className="text-green-300/60 text-xs mt-0.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tag */}
        <div className="relative z-10">
          <p className="text-green-200/40 text-sm">
            &copy; 2026 FutsalHub. All rights reserved.
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL — Form ── */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 py-12 relative">
        {/* Subtle bg pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(circle, hsl(142 100% 32%) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "hsl(142 100% 32%)" }}
          >
            <Zap size={18} className="text-white" fill="white" />
          </div>
          <span className="text-foreground font-bold text-lg">FutsalHub</span>
        </div>

        <div className="w-full max-w-sm relative z-10">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-black text-foreground tracking-tight">
              Selamat Datang 👋
            </h2>
            <p className="text-muted-foreground mt-1.5">
              Masuk untuk mulai booking lapangan favoritmu.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">
                Email
              </label>
              <div className="relative group">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary"
                />
                <input
                  type="text"
                  required
                  autoComplete="email"
                  placeholder="kamu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm transition-all outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary focus:bg-background"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">
                Password
              </label>
              <div className="relative group">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm transition-all outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary focus:bg-background"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Lupa password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-white transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              style={{
                backgroundColor: "hsl(142 100% 32%)",
                boxShadow: "0 4px 14px hsl(142 100% 32% / 0.35)",
              }}
              onMouseEnter={(e) => {
                if (!loading)
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "hsl(142 100% 28%)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "hsl(142 100% 32%)";
              }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Memuat...</span>
                </>
              ) : (
                <>
                  <span>Masuk</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">
              Belum punya akun?
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Register link */}
          <Link
            to="/register"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm border border-border text-foreground hover:bg-muted hover:border-primary/30 transition-all"
          >
            Daftar Gratis
          </Link>

          {/* Mobile copyright */}
          <p className="lg:hidden text-center text-muted-foreground text-xs mt-8">
            &copy; 2026 FutsalHub. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
