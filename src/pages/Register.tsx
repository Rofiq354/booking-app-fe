import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff, ArrowRight, UserRound } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { registerUser } from "../store/authSlice";
import type { MyErrorResponse } from "../types/error";
import toast from "react-hot-toast";

const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { registerLoading } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(registerUser(form)).unwrap();
      toast.success("Registrasi berhasil! Silakan login.");
      navigate("/login");
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
        {/* Field grid lines */}
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

        {/* Center circle ornament */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-105 h-105 rounded-full border-2 border-white/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-white/20 bg-white/5" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-40 h-80 rounded-r-full border-2 border-l-0 border-white/10" />

        {/* Glow */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, hsl(142 100% 40%) 0%, transparent 70%)",
          }}
        />

        {/* Top brand */}
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xl">
            <img
              src="/brand.svg"
              alt="Logo"
              className="w-8 h-8 object-contain brightness-0 invert"
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-white font-black text-2xl uppercase tracking-tighter italic">
              Futsal<span className="opacity-80">Hub</span>
            </span>
            <span className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em] mt-0.5">
              Arena Center
            </span>
          </div>
        </div>

        {/* Center copy */}
        <div className="relative z-10 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-1.5">
              <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
              <span className="text-green-200 text-xs font-medium tracking-wide uppercase">
                Daftarkan Akun Anda
              </span>
            </div>
            <h1 className="text-5xl font-black text-white leading-[1.1] tracking-tight">
              Satu Akun,
              <br />
              <span style={{ color: "hsl(142 100% 65%)" }}>Kendali Penuh.</span>
            </h1>
            <p className="text-green-200/70 text-lg max-w-sm leading-relaxed">
              Buat akun untuk mulai bermain futsal dengan nyaman dan mudah
              dengan FutsalHub.
            </p>
          </div>

          {/* Feature list */}
          <ul className="space-y-3 pt-2">
            {[
              "Pantau booking lapangan anda",
              "Lihat lapangan terdekat",
              "Notifikasi booking masuk gmail secara instan",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M1.5 5L4 7.5L8.5 2.5"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-green-200/75 text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom */}
        <div className="relative z-10">
          <p className="text-green-200/40 text-sm">
            &copy; 2026 FutsalHub System. All rights reserved.
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL — Form ── */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 py-12 relative">
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(circle, hsl(142 100% 32%) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <img
              src="/brand.svg"
              alt="Logo"
              className="w-7 h-7 object-contain"
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xl font-black text-primary uppercase tracking-tighter italic">
              Futsal<span className="text-foreground">Hub</span>
            </span>
          </div>
        </div>

        <div className="w-full max-w-sm relative z-10">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-black text-foreground tracking-tight">
              Buat Akun Baru
            </h2>
            <p className="text-muted-foreground mt-1.5">
              Daftarkan diri sebagai pemain berbakat.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Nama */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">
                Nama Lengkap
              </label>
              <div className="relative group">
                <UserRound
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary"
                />
                <input
                  type="text"
                  name="name"
                  required
                  minLength={4}
                  maxLength={25}
                  autoComplete="name"
                  placeholder="Nama kamu"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm transition-all outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary focus:bg-background"
                />
              </div>
            </div>

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
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="user@futsalhub.id"
                  value={form.email}
                  onChange={handleChange}
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
                  name="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Min. 8 karakter"
                  value={form.password}
                  onChange={handleChange}
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

              {/* Password strength bar */}
              {form.password.length > 0 && (
                <div className="flex gap-1 pt-1">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-1 flex-1 rounded-full transition-all duration-300"
                      style={{
                        backgroundColor:
                          form.password.length >= (i + 1) * 2
                            ? i < 1
                              ? "hsl(0 84% 55%)"
                              : i < 2
                                ? "hsl(38 92% 50%)"
                                : i < 3
                                  ? "hsl(60 80% 45%)"
                                  : "hsl(142 100% 32%)"
                            : "var(--border)",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={registerLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-white transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              style={{
                backgroundColor: "hsl(142 100% 32%)",
                boxShadow: "0 4px 14px hsl(142 100% 32% / 0.35)",
              }}
              onMouseEnter={(e) => {
                if (!registerLoading)
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "hsl(142 100% 28%)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "hsl(142 100% 32%)";
              }}
            >
              {registerLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Mendaftarkan...</span>
                </>
              ) : (
                <>
                  <span>Daftar Sekarang</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">
              Sudah punya akun?
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Back to login */}
          <Link
            to="/login"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm border border-border text-foreground hover:bg-muted hover:border-primary/30 transition-all"
          >
            Masuk ke Akun
          </Link>

          <p className="lg:hidden text-center text-muted-foreground text-xs mt-8">
            &copy; 2026 FutsalHub System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
