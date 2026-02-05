import React from "react";
import { useTranslation } from "./i18n.jsx";
import { useTheme } from "./theme.jsx";
import {
  ArrowLeft,
  Server,
  Cpu,
  Layers,
  Database,
  Code,
  Globe,
  Sun,
  Moon,
  Activity,
  Presentation, // Ikon baru untuk Slide
  PlayCircle,
} from "lucide-react";

export default function Docs({ onBack }) {
  const { t, lang, setLang } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={`min-h-screen font-sans overflow-y-auto custom-scrollbar ${theme === "dark" ? "bg-[#050505] text-white" : "bg-white text-black"}`}
    >
      {/* ======================= HEADER FIXED ======================= */}
      <div
        className={`sticky top-0 z-[100] w-full px-4 py-3 md:px-6 md:py-4 flex items-center justify-between border-b backdrop-blur-xl transition-all duration-300 ${
          theme === "dark"
            ? "bg-black/80 border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
            : "bg-white/80 border-gray-200 shadow-sm"
        }`}
      >
        {/* 1. KIRI: Tombol Kembali */}
        <button
          onClick={onBack}
          className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-all hover:scale-105 active:scale-95 ${
            theme === "dark"
              ? "border-white/10 hover:bg-white/10 text-gray-300 hover:text-white"
              : "border-black/10 hover:bg-gray-100 text-gray-600 hover:text-black"
          }`}
        >
          <ArrowLeft size={16} />{" "}
          <span className="hidden md:inline font-bold text-xs">
            {t("main_menu")}
          </span>
        </button>

        {/* 2. TENGAH: Logo 1:1 & Judul */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3">
          <div
            className={`w-9 h-9 md:w-10 md:h-10 aspect-square rounded-xl border flex items-center justify-center shadow-lg overflow-hidden shrink-0 ${
              theme === "dark"
                ? "bg-gradient-to-br from-gray-800 to-black border-white/10"
                : "bg-white border-gray-200"
            }`}
          >
            <Code
              size={20}
              className={
                theme === "dark" ? "text-neon-green" : "text-green-600"
              }
            />
          </div>
          <div className="hidden sm:block text-left">
            <h1 className="text-sm font-black tracking-widest leading-none uppercase">
              {t("system_docs")}
            </h1>
            <p
              className={`text-[9px] font-mono leading-none mt-1 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}
            >
              {t("architecture_version")}
            </p>
          </div>
        </div>

        {/* 3. KANAN: Theme & Language */}
        <div className="flex gap-2">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full border transition hover:scale-105 ${
              theme === "dark"
                ? "border-white/10 bg-black/30 hover:bg-white/10 text-yellow-400"
                : "border-gray-200 bg-gray-100 hover:bg-gray-200 text-blue-500"
            }`}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <div
            className={`px-2 py-1 rounded-full border flex items-center ${
              theme === "dark"
                ? "border-white/10 bg-black/30"
                : "border-gray-200 bg-gray-100"
            }`}
          >
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className={`bg-transparent text-xs font-bold outline-none cursor-pointer w-10 text-center ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              <option value="id">ID</option>
              <option value="en">EN</option>
              <option value="hi">HI</option>
            </select>
          </div>
        </div>
      </div>

      {/* ======================= CONTENT CONTAINER ======================= */}
      <div className="max-w-4xl mx-auto p-5 md:p-12 space-y-16 pb-32">
        {/* 1. INTRO & MODULES */}
        <section className="space-y-6">
          <div className="text-center md:text-left space-y-4">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
              {t("brain_behind")}
            </h2>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold border ${theme === "dark" ? "bg-green-900/30 border-green-500/30 text-green-400" : "bg-green-100 border-green-300 text-green-700"}`}
              >
                v2.1 STABLE
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold border ${theme === "dark" ? "bg-blue-900/30 border-blue-500/30 text-blue-400" : "bg-blue-100 border-blue-300 text-blue-700"}`}
              >
                AI-POWERED
              </span>
            </div>
            <p
              className={`text-sm md:text-lg leading-relaxed max-w-2xl ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
            >
              {t("platform_intro")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mt-8">
            <div
              className={`p-5 rounded-2xl border relative overflow-hidden group transition hover:-translate-y-1 ${theme === "dark" ? "border-neon-green/20 bg-neon-green/5 hover:bg-neon-green/10" : "border-green-200 bg-green-50 hover:bg-green-100"}`}
            >
              <Globe
                className={`mb-3 transition-transform group-hover:scale-110 ${theme === "dark" ? "text-neon-green" : "text-green-600"}`}
                size={24}
              />
              <h3 className="font-bold text-sm mb-1 uppercase tracking-wide">
                {t("data_fusion")}
              </h3>
              <p
                className={`text-xs leading-relaxed ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
              >
                {t("data_fusion_desc")}
              </p>
            </div>
            <div
              className={`p-5 rounded-2xl border relative overflow-hidden group transition hover:-translate-y-1 ${theme === "dark" ? "border-neon-blue/20 bg-neon-blue/5 hover:bg-neon-blue/10" : "border-blue-200 bg-blue-50 hover:bg-blue-100"}`}
            >
              <Cpu
                className={`mb-3 transition-transform group-hover:scale-110 ${theme === "dark" ? "text-neon-blue" : "text-blue-600"}`}
                size={24}
              />
              <h3 className="font-bold text-sm mb-1 uppercase tracking-wide">
                {t("gemini_flash")}
              </h3>
              <p
                className={`text-xs leading-relaxed ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
              >
                {t("gemini_desc")}
              </p>
            </div>
            <div
              className={`p-5 rounded-2xl border relative overflow-hidden group transition hover:-translate-y-1 ${theme === "dark" ? "border-neon-red/20 bg-neon-red/5 hover:bg-neon-red/10" : "border-red-200 bg-red-50 hover:bg-red-100"}`}
            >
              <Database
                className={`mb-3 transition-transform group-hover:scale-110 ${theme === "dark" ? "text-neon-red" : "text-red-600"}`}
                size={24}
              />
              <h3 className="font-bold text-sm mb-1 uppercase tracking-wide">
                {t("persistent_db")}
              </h3>
              <p
                className={`text-xs leading-relaxed ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
              >
                {t("db_desc")}
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* ⭐ NEW: GOOGLE SLIDE EMBED SECTION ⭐ */}
        {/* ========================================================= */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 mb-4 border-b pb-4 border-dashed border-gray-700">
            <Presentation className="text-orange-500" />
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest">
              {t("presentation_title")}
            </h2>
          </div>

          <p
            className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
          >
            {t("presentation_desc")}
          </p>

          {/* IFRAME CONTAINER (16:9 Aspect Ratio) */}
          <div
            className={`relative w-full aspect-video rounded-2xl overflow-hidden border shadow-2xl group ${theme === "dark" ? "border-white/10 bg-white/5" : "border-gray-200 bg-black"}`}
          >
            {/* Loading Placeholder (Muncul sebelum iframe load) */}
            <div className="absolute inset-0 flex items-center justify-center animate-pulse z-0">
              <PlayCircle size={48} className="text-gray-500 opacity-20" />
            </div>

            {/* ⚠️ GANTI LINK DI BAWAH INI DENGAN LINK GOOGLE SLIDE ANDA */}
            {/* Cara: File > Share > Publish to web > Embed > Copy src link */}
            <iframe
              src="https://docs.google.com/presentation/d/e/2PACX-1vR8q6j7q8q6j7q8q6j7q8q6j7q8q6j7q8q6j7q8q6j7/embed?start=false&loop=false&delayms=3000"
              frameBorder="0"
              width="100%"
              height="100%"
              allowFullScreen="true"
              mozallowfullscreen="true"
              webkitallowfullscreen="true"
              className="absolute top-0 left-0 w-full h-full z-10"
              title="EcoLens Presentation"
            ></iframe>
          </div>
        </section>

        {/* 2. ARCHITECTURE FLOW */}
        <section className="space-y-8">
          <div className="flex items-center gap-3 mb-4 border-b pb-4 border-dashed border-gray-700">
            <Layers className="text-gray-500" />
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest">
              {t("system_workflow")}
            </h2>
          </div>

          <div
            className={`relative border-l-2 pl-6 md:pl-8 space-y-10 md:space-y-12 ${theme === "dark" ? "border-white/10" : "border-gray-300"}`}
          >
            {/* Step 1 */}
            <div className="relative group">
              <div
                className={`absolute -left-[31px] md:-left-[39px] top-0 w-4 h-4 md:w-5 md:h-5 rounded-full border-2 bg-black z-10 transition-colors ${theme === "dark" ? "border-neon-green group-hover:bg-neon-green" : "border-green-500 group-hover:bg-green-500"}`}
              ></div>
              <h3
                className={`text-base md:text-lg font-bold flex items-center gap-2 ${theme === "dark" ? "text-neon-green" : "text-green-600"}`}
              >
                {t("capture_ingest")}
              </h3>
              <p
                className={`text-xs md:text-sm mt-1 md:mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
              >
                {t("capture_ingest_desc")}
              </p>
            </div>
            {/* Step 2 */}
            <div className="relative group">
              <div
                className={`absolute -left-[31px] md:-left-[39px] top-0 w-4 h-4 md:w-5 md:h-5 rounded-full border-2 bg-black z-10 transition-colors ${theme === "dark" ? "border-neon-blue group-hover:bg-neon-blue" : "border-blue-500 group-hover:bg-blue-500"}`}
              ></div>
              <h3
                className={`text-base md:text-lg font-bold flex items-center gap-2 ${theme === "dark" ? "text-neon-blue" : "text-blue-600"}`}
              >
                {t("processing_analysis")}
              </h3>
              <p
                className={`text-xs md:text-sm mt-1 md:mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
              >
                {t("processing_analysis_desc")}
              </p>
              <div className="mt-3 flex gap-2">
                <span
                  className={`text-[10px] px-2 py-1 rounded border font-mono ${theme === "dark" ? "border-white/10 bg-white/5 text-gray-300" : "border-gray-300 bg-gray-100 text-gray-700"}`}
                >
                  {t("open_meteo_api")}
                </span>
                <span
                  className={`text-[10px] px-2 py-1 rounded border font-mono ${theme === "dark" ? "border-white/10 bg-white/5 text-gray-300" : "border-gray-300 bg-gray-100 text-gray-700"}`}
                >
                  {t("google_gemini")}
                </span>
              </div>
            </div>
            {/* Step 3 & 4 (Shortened for brevity, keep logic same as before) */}
            <div className="relative group">
              <div
                className={`absolute -left-[31px] md:-left-[39px] top-0 w-4 h-4 md:w-5 md:h-5 rounded-full border-2 bg-black z-10 transition-colors ${theme === "dark" ? "border-purple-500 group-hover:bg-purple-500" : "border-purple-600 group-hover:bg-purple-600"}`}
              ></div>
              <h3
                className={`text-base md:text-lg font-bold ${theme === "dark" ? "text-purple-400" : "text-purple-600"}`}
              >
                {t("storage_sqlite")}
              </h3>
              <p
                className={`text-xs md:text-sm mt-1 md:mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
              >
                {t("storage_desc")}
              </p>
            </div>
            <div className="relative group">
              <div
                className={`absolute -left-[31px] md:-left-[39px] top-0 w-4 h-4 md:w-5 md:h-5 rounded-full border-2 bg-black z-10 transition-colors ${theme === "dark" ? "border-orange-500 group-hover:bg-orange-500" : "border-orange-600 group-hover:bg-orange-600"}`}
              ></div>
              <h3
                className={`text-base md:text-lg font-bold ${theme === "dark" ? "text-orange-400" : "text-orange-600"}`}
              >
                {t("monitoring_action")}
              </h3>
              <p
                className={`text-xs md:text-sm mt-1 md:mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
              >
                {t("monitoring_desc")}
              </p>
            </div>
          </div>
        </section>

        {/* 3. API REFERENCE */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 mb-4 border-b pb-4 border-dashed border-gray-700">
            <Server className="text-gray-500" />
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest">
              {t("backend_api")}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {/* Example Endpoint */}
            <div
              className={`p-4 rounded-xl border transition group ${theme === "dark" ? "bg-white/5 border-white/10 hover:border-white/30" : "bg-gray-50 border-gray-200 hover:border-gray-400"}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-green-600 text-white text-[10px] font-bold rounded shadow-lg shadow-green-900/20">
                    POST
                  </span>
                  <code
                    className={`text-xs md:text-sm font-mono font-bold ${theme === "dark" ? "text-white" : "text-black"}`}
                  >
                    /api/analyze
                  </code>
                </div>
                <Activity
                  size={14}
                  className="text-gray-500 group-hover:text-green-500 transition"
                />
              </div>
              <p
                className={`text-xs mb-3 ml-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
              >
                {t("analyze_endpoint")}
              </p>
              <div
                className={`p-3 rounded-lg border text-[10px] font-mono ${theme === "dark" ? "bg-black/50 border-white/5 text-gray-400" : "bg-white border-gray-200 text-gray-600"}`}
              >
                {t("analyze_input")}
                <br />
                {t("analyze_output")}
              </div>
            </div>
            {/* ... other endpoints ... */}
          </div>
        </section>

        {/* 4. TECH STACK */}
        <section>
          <div className="flex items-center gap-3 mb-4 md:mb-6 border-b pb-4 border-dashed border-gray-700">
            <Database className="text-gray-500" />
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest">
              {t("tech_stack")}
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[
              "React Vite",
              "Tailwind CSS v3",
              "Python Flask",
              "SQLite",
              "Google Gemini 1.5",
              "Open-Meteo API",
              "Leaflet JS",
              "Axios",
            ].map((tech) => (
              <div
                key={tech}
                className={`p-3 text-center rounded-lg border text-[10px] md:text-xs font-bold transition cursor-default hover:scale-105 ${theme === "dark" ? "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-neon-green" : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-green-600"}`}
              >
                {tech}
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <div
          className={`pt-10 border-t text-center text-[10px] md:text-xs font-mono opacity-50 ${theme === "dark" ? "border-white/10 text-gray-600" : "border-black/10 text-gray-400"}`}
        >
          {t("copyright")}
        </div>
      </div>
    </div>
  );
}
