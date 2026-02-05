import React, { useState } from "react";
import {
  Lock,
  User,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useTranslation } from "./i18n";
import { useTheme } from "./theme";

export default function LoginAdmin({ onLoginSuccess, onBack }) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulasi Network Request (Delay 1.5 detik)
    setTimeout(() => {
      // 🔐 KREDENSIAL SEDERHANA (Untuk Demo)
      if (username === "admin" && password === "admin123") {
        setLoading(false);
        onLoginSuccess(); // Panggil fungsi sukses ke App.jsx
      } else {
        setLoading(false);
        setError("Invalid Credentials / Akses Ditolak");
      }
    }, 1500);
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-6 font-sans relative overflow-hidden ${theme === "dark" ? "bg-[#050505]" : "bg-gray-100"}`}
    >
      {/* Background Effect */}
      {theme === "dark" && (
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-neon-blue/10 via-transparent to-neon-green/5 pointer-events-none"></div>
      )}

      {/* Tombol Kembali */}
      <button
        onClick={onBack}
        className={`absolute top-6 left-6 z-20 p-2 rounded-full border transition hover:scale-105 ${theme === "dark" ? "bg-black/40 border-white/20 text-white hover:bg-white/10" : "bg-white border-gray-300 text-black hover:bg-gray-50"}`}
      >
        <ArrowLeft size={20} />
      </button>

      {/* Kartu Login */}
      <div
        className={`relative z-10 w-full max-w-md p-8 rounded-3xl border shadow-2xl backdrop-blur-xl ${theme === "dark" ? "bg-black/60 border-white/10" : "bg-white/80 border-gray-200"}`}
      >
        <div className="text-center mb-8">
          <div
            className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg ${theme === "dark" ? "bg-gray-900 text-neon-blue" : "bg-blue-50 text-blue-600"}`}
          >
            <ShieldCheck size={32} />
          </div>
          <h1
            className={`text-2xl font-black tracking-tight ${theme === "dark" ? "text-white" : "text-gray-900"}`}
          >
            COMMAND CENTER
          </h1>
          <p
            className={`text-xs font-mono mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
          >
            SECURE ACCESS GATEWAY
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Input Username */}
          <div className="space-y-1">
            <label
              className={`text-xs font-bold ml-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
            >
              AGENT ID
            </label>
            <div
              className={`flex items-center px-4 py-3 rounded-xl border transition-all focus-within:ring-2 ${theme === "dark" ? "bg-white/5 border-white/10 focus-within:border-neon-blue focus-within:ring-neon-blue/20 text-white" : "bg-gray-50 border-gray-200 focus-within:border-blue-500 focus-within:ring-blue-500/20 text-black"}`}
            >
              <User size={18} className="text-gray-500 mr-3" />
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-full font-medium"
                required
              />
            </div>
          </div>

          {/* Input Password */}
          <div className="space-y-1">
            <label
              className={`text-xs font-bold ml-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
            >
              PASSCODE
            </label>
            <div
              className={`flex items-center px-4 py-3 rounded-xl border transition-all focus-within:ring-2 ${theme === "dark" ? "bg-white/5 border-white/10 focus-within:border-neon-blue focus-within:ring-neon-blue/20 text-white" : "bg-gray-50 border-gray-200 focus-within:border-blue-500 focus-within:ring-blue-500/20 text-black"}`}
            >
              <Lock size={18} className="text-gray-500 mr-3" />
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-full font-medium"
                required
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 text-xs text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20 animate-pulse">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${theme === "dark" ? "bg-neon-blue text-black hover:bg-[#33f6ff]" : "bg-blue-600 text-white hover:bg-blue-700"}`}
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              "AUTHENTICATE"
            )}
          </button>
        </form>

        <div
          className={`mt-6 text-center text-[10px] font-mono ${theme === "dark" ? "text-gray-600" : "text-gray-400"}`}
        >
          ECOLENS SECURITY PROTOCOL v2.1
        </div>
      </div>
    </div>
  );
}
