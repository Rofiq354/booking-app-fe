import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User, Activity } from "lucide-react";
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
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();

      navigate("/admin", { replace: true, state: { loginSuccess: true } });
      console.log("Login Berhasil:", result);
    } catch (err: unknown) {
      const error = err as MyErrorResponse;

      console.error("Gagal Login dengan Kode:", error.code);

      const displayMessage =
        typeof error.message === "string"
          ? error.message
          : Object.values(error.message)[0];
      toast.error(displayMessage as string);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      {/* Kartu Login */}
      <div className="max-w-md w-full bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-8">
        {/* Logo & Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-full mb-4">
            <Activity className="text-green-500" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            FutsalHub
          </h2>
          <p className="text-slate-400 mt-2">Portal Admin Management</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Input Username/Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">
              Username
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-green-500 transition-colors">
                <User size={18} />
              </div>
              <input
                type="text"
                required
                className="block w-full pl-10 pr-3 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
                placeholder="Masukkan username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Input Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-green-500 transition-colors">
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                className="block w-full pl-10 pr-3 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-900/20 transform transition-all active:scale-95"
          >
            {loading ? "Loading..." : "Masuk Sekarang"}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-8">
          &copy; 2026 FutsalHub System. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
