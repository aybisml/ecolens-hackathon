import React, { useState } from "react";
import UserApp from "./UserApp";
import Dashboard from "./Dashboard";
import Docs from "./Docs";
import LoginAdmin from "./LoginAdmin";
import { ThemeProvider, useTheme } from "./theme";
import { I18nProvider, useTranslation } from "./i18n";
import {
  Smartphone,
  LayoutDashboard,
  Globe,
  BookOpen,
  Sun,
  Moon,
} from "lucide-react";

// --- KOMPONEN MENU UTAMA ---
function MainMenu({ setMode }) {
  const { t, lang, setLang } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-6 font-sans relative overflow-y-auto overflow-x-hidden transition-colors duration-300 ${
        theme === "dark" ? "bg-[#050505] text-white" : "bg-gray-100 text-black"
      }`}
    >
      {/* 1. TOP RIGHT CONTROLS (Updated Style) */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        {/* Tombol Ganti Tema */}
        <button
          onClick={toggleTheme}
          className={`glass-panel px-3 py-2 rounded-full border transition ${
            theme === "dark"
              ? "border-white/10 bg-black/30 hover:bg-white/10"
              : "border-black/10 bg-gray-100 hover:bg-gray-200"
          }`}
        >
          {theme === "dark" ? (
            <Sun size={18} className="text-yellow-400" />
          ) : (
            <Moon size={18} className="text-blue-400" />
          )}
        </button>

        {/* Selector Bahasa (Disamakan dengan Docs.jsx) */}
        <div
          className={`glass-panel px-3 py-2 rounded-full border flex items-center ${
            theme === "dark"
              ? "border-white/10 bg-black/30"
              : "border-black/10 bg-gray-100"
          }`}
        >
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className={`bg-transparent text-sm outline-none cursor-pointer ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            <option value="id" className="bg-black text-white">
              🇮🇩 Indonesia
            </option>
            <option value="en" className="bg-black text-white">
              🇬🇧 English
            </option>
            <option value="hi" className="bg-black text-white">
              🇮🇳 हिन्दी
            </option>
          </select>
        </div>
      </div>

      {/* 2. BACKGROUND EFFECT (Hanya di Dark Mode) */}
      {theme === "dark" && (
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-neon-green/5 to-transparent pointer-events-none"></div>
      )}

      {/* 3. HEADER SECTION */}
      <div className="z-10 text-center mb-10 w-full max-w-2xl mt-10 md:mt-0">
        {/* Badge */}
        <div
          className={`inline-flex items-center gap-2 border px-4 py-1.5 rounded-full mb-6 backdrop-blur-md shadow-lg ${
            theme === "dark"
              ? "border-white/10 bg-white/5"
              : "border-gray-300 bg-white"
          }`}
        >
          <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
          <span
            className={`text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {t("planetary_defense_system")}
          </span>
        </div>

        {/* Title */}
        <h1
          className={`text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-4 drop-shadow-2xl ${
            theme === "dark" ? "text-white" : "text-black"
          }`}
        >
          ECO
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-blue">
            LENS
          </span>
        </h1>

        {/* Description */}
        <p
          className={`mb-8 font-medium text-sm md:text-base leading-relaxed max-w-lg mx-auto ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {t("platform_description")}
        </p>

        {/* Docs Button */}
        <button
          onClick={() => setMode("docs")}
          className={`group inline-flex items-center gap-2 px-6 py-3 rounded-full border transition text-xs font-bold active:scale-95 shadow-lg ${
            theme === "dark"
              ? "bg-white/5 border-white/10 hover:bg-white/10 text-gray-300 hover:text-white"
              : "bg-white border-gray-300 hover:bg-gray-50 text-gray-700 hover:text-black"
          }`}
        >
          <BookOpen
            size={16}
            className={`group-hover:text-neon-green transition ${
              theme === "dark" ? "" : "text-gray-500"
            }`}
          />
          {t("read_system_docs")}
        </button>
      </div>

      {/* 4. CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-4xl z-10 px-2 md:px-0 mb-10">
        {/* User Card */}
        <button
          onClick={() => setMode("user")}
          className={`group relative p-1 rounded-3xl bg-gradient-to-b transition-all duration-500 text-left active:scale-[0.98] shadow-2xl ${
            theme === "dark"
              ? "from-white/10 to-white/5 hover:from-neon-green hover:to-neon-blue"
              : "from-gray-200 to-gray-100 hover:from-green-400 hover:to-blue-400"
          }`}
        >
          <div
            className={`rounded-[1.3rem] p-6 md:p-8 h-full flex flex-col items-start relative overflow-hidden min-h-[200px] ${
              theme === "dark" ? "bg-[#0a0a0a]" : "bg-white"
            }`}
          >
            <div
              className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-4 md:mb-6 transition duration-300 z-10 shadow-lg ${
                theme === "dark"
                  ? "bg-gray-800 group-hover:bg-neon-green group-hover:text-black text-white"
                  : "bg-gray-100 group-hover:bg-green-500 group-hover:text-white text-gray-700"
              }`}
            >
              <Smartphone size={24} className="md:w-7 md:h-7" />
            </div>
            <h2
              className={`text-xl md:text-2xl font-bold mb-2 transition tracking-tight ${
                theme === "dark"
                  ? "text-white group-hover:text-neon-green"
                  : "text-black group-hover:text-green-600"
              }`}
            >
              {t("mode_user")}
            </h2>
            <p
              className={`text-xs md:text-sm leading-relaxed z-10 font-medium ${
                theme === "dark" ? "text-gray-500" : "text-gray-600"
              }`}
            >
              {t("sensor_description")}
            </p>
          </div>
        </button>

        {/* Admin Card */}
        <button
          onClick={() => setMode("login")}
          className={`group relative p-1 rounded-3xl bg-gradient-to-b transition-all duration-500 text-left active:scale-[0.98] shadow-2xl ${
            theme === "dark"
              ? "from-white/10 to-white/5 hover:from-neon-blue hover:to-purple-500"
              : "from-gray-200 to-gray-100 hover:from-blue-400 hover:to-purple-400"
          }`}
        >
          <div
            className={`rounded-[1.3rem] p-6 md:p-8 h-full flex flex-col items-start relative overflow-hidden min-h-[200px] ${
              theme === "dark" ? "bg-[#0a0a0a]" : "bg-white"
            }`}
          >
            <div
              className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-4 md:mb-6 transition duration-300 z-10 shadow-lg ${
                theme === "dark"
                  ? "bg-gray-800 group-hover:bg-neon-blue group-hover:text-black text-white"
                  : "bg-gray-100 group-hover:bg-blue-500 group-hover:text-white text-gray-700"
              }`}
            >
              <LayoutDashboard size={24} className="md:w-7 md:h-7" />
            </div>

            <h2
              className={`text-xl md:text-2xl font-bold mb-2 transition tracking-tight ${
                theme === "dark"
                  ? "text-white group-hover:text-neon-blue"
                  : "text-black group-hover:text-blue-600"
              }`}
            >
              {t("mode_admin")}
            </h2>

            <p
              className={`text-xs md:text-sm leading-relaxed z-10 font-medium ${
                theme === "dark" ? "text-gray-500" : "text-gray-600"
              }`}
            >
              {t("command_center_description")}
            </p>
          </div>
        </button>
      </div>

      {/* 5. FOOTER */}
      <div
        className={`absolute bottom-4 md:bottom-6 text-center animate-pulse w-full px-4 text-[9px] md:text-[10px] font-mono tracking-widest uppercase pointer-events-none ${
          theme === "dark" ? "text-gray-600" : "text-gray-400"
        }`}
      >
        {t("powered_by")}
      </div>
    </div>
  );
}

// --- APP WRAPPER (PROVIDERS) ---
export default function App() {
  const [mode, setMode] = useState("menu");

  return (
    <ThemeProvider>
      <I18nProvider>
        {mode === "menu" && <MainMenu setMode={setMode} />}
        {mode === "user" && <UserApp onBack={() => setMode("menu")} />}

        {/* HALAMAN LOGIN (BARU) */}
        {mode === "login" && (
          <LoginAdmin
            onLoginSuccess={() => setMode("admin")}
            onBack={() => setMode("menu")}
          />
        )}

        {mode === "admin" && <Dashboard onBack={() => setMode("menu")} />}
        {mode === "docs" && <Docs onBack={() => setMode("menu")} />}
      </I18nProvider>
    </ThemeProvider>
  );
}
