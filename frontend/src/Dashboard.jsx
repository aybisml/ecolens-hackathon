import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Tooltip,
  useMap,
  ZoomControl,
  LayersControl,
} from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import {
  Activity,
  ShieldAlert,
  Truck,
  CheckCircle,
  MapPin,
  Trash2,
  Eye,
  X,
  Info,
  Box,
  CloudRain,
  Sun,
  Moon,
  ArrowLeft, // Import ArrowLeft
} from "lucide-react";
import { useTranslation } from "./i18n";
import { useTheme } from "./theme";

// --- MAP CONTROLLER ---
function MapController({ centerPos }) {
  const map = useMap();
  useEffect(() => {
    if (centerPos) {
      map.flyTo(centerPos, 18, { animate: true, duration: 1.5 });
    }
  }, [centerPos]);
  return null;
}

// --- MODAL DETAIL (POP-UP) ---
function ReportDetailModal({ report, onClose, theme }) {
  if (!report) return null;
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-[2000] backdrop-blur-sm flex items-center justify-center p-4 bg-black/80 animate-fade-in">
      <div
        className={`border rounded-3xl flex flex-col md:flex-row w-[95%] md:w-full max-w-4xl max-h-[85vh] md:max-h-[90vh] overflow-y-auto relative shadow-2xl ${
          theme === "dark"
            ? "bg-[#0a0a0a] border-white/10"
            : "bg-white border-gray-200"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-50 p-2 rounded-full bg-black/50 hover:bg-red-500 text-white transition"
        >
          <X size={18} />
        </button>

        {/* GAMBAR */}
        <div className="w-full md:w-1/2 relative bg-gray-900 shrink-0 h-64 md:h-auto">
          <img
            src={report.image}
            className="w-full h-full object-cover"
            alt="Evidence"
          />
          <div className="absolute bottom-0 left-0 p-4 md:p-6 bg-gradient-to-t from-black to-transparent w-full">
            <span className="bg-neon-green text-black px-2 py-0.5 text-[10px] md:text-xs font-bold rounded">
              {t("evidence")}
            </span>
            <h2 className="text-xl md:text-3xl font-black italic text-white mt-2 uppercase leading-none">
              {report.data.object_name}
            </h2>
          </div>
        </div>

        {/* DATA LENGKAP */}
        <div
          className={`w-full md:w-1/2 p-5 md:p-8 space-y-4 md:space-y-6 ${
            theme === "dark" ? "text-white" : "text-black"
          }`}
        >
          <div className="flex justify-between border-b pb-3 border-white/10">
            <div>
              <p className="text-[10px] text-gray-500 font-mono">
                {t("risk_level")}
              </p>
              <h3 className="text-lg md:text-xl font-black text-neon-red uppercase flex items-center gap-2">
                <ShieldAlert size={18} /> {report.data.risk_level}
              </h3>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-500 font-mono">
                {t("timestamp")}
              </p>
              <p className="text-xs md:text-sm font-bold">{report.timestamp}</p>
            </div>
          </div>

          <div
            className={`p-3 rounded-xl border italic text-xs md:text-sm leading-relaxed ${
              theme === "dark"
                ? "bg-white/5 border-white/5"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            "{report.data.prediction_logic}"
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div
              className={`p-3 rounded-xl border ${
                theme === "dark"
                  ? "bg-white/5 border-white/5"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <p className="text-[10px] text-gray-500 flex items-center gap-1 font-bold">
                <Box size={10} /> {t("material")}
              </p>
              <p className="font-bold text-xs md:text-sm uppercase mt-1">
                {report.data.material_type}
              </p>
            </div>
            <div
              className={`p-3 rounded-xl border ${
                theme === "dark"
                  ? "bg-white/5 border-white/5"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <p className="text-[10px] text-gray-500 flex items-center gap-1 font-bold">
                <CloudRain size={10} /> {t("weather")}
              </p>
              <p className="font-bold text-xs md:text-sm mt-1">
                {report.data.weather_context}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex gap-3">
              <Truck size={16} className="text-orange-400 shrink-0 mt-1" />
              <div>
                <p className="text-[10px] font-bold text-orange-400 uppercase">
                  {t("action_plan")}
                </p>
                <p className="text-xs md:text-sm opacity-90">
                  {report.data.disposal_instruction}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Info size={16} className="text-purple-400 shrink-0 mt-1" />
              <div>
                <p className="text-[10px] font-bold text-purple-400 uppercase">
                  {t("did_you_know")}
                </p>
                <p className="text-xs md:text-sm opacity-90">
                  {report.data.fun_fact}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- DASHBOARD UTAMA ---
export default function Dashboard({ onBack }) {
  const { t, lang, setLang } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [reports, setReports] = useState([]);
  const [selected, setSelected] = useState(null);
  const [center, setCenter] = useState(null);
  const [detail, setDetail] = useState(null);

  // FETCH DATA
  useEffect(() => {
    const fetch = () =>
      axios
        .get("http://127.0.0.1:5000/api/reports")
        .then((r) => setReports(r.data))
        .catch(console.error);
    fetch();
    const i = setInterval(fetch, 2000); // Auto refresh 2 detik
    return () => clearInterval(i);
  }, []);

  // ACTIONS
  const resolve = (e, id) => {
    e.stopPropagation();
    axios.post(`http://127.0.0.1:5000/api/reports/${id}/resolve`).catch(alert);
  };
  const del = (e, id) => {
    e.stopPropagation();
    if (confirm(t("delete_report") + "?"))
      axios.delete(`http://127.0.0.1:5000/api/reports/${id}`);
  };
  const clickCard = (r) => {
    setSelected(r.id);
    setCenter([r.lat, r.lon]);
  };

  const alerts = reports.filter(
    (r) => r.status === "OPEN" && r.data.risk_level.includes("CRITICAL"),
  ).length;

  return (
    <div
      className={`h-screen w-full flex flex-col md:flex-row font-sans overflow-hidden ${
        theme === "dark" ? "bg-[#050505] text-white" : "bg-gray-100 text-black"
      }`}
    >
      {detail && (
        <ReportDetailModal
          report={detail}
          onClose={() => setDetail(null)}
          theme={theme}
        />
      )}

      {/* --- AREA PETA (ATAS di HP, KANAN di Desktop) --- */}
      <div className="flex-1 relative order-1 md:order-2 h-[55vh] md:h-full z-0 transition-all">
        {/* Floating Header */}
        <div className="absolute top-3 left-3 right-3 md:top-4 md:left-4 md:right-4 z-[1000] flex flex-col md:flex-row justify-between items-start pointer-events-none gap-2">
          {/* GROUP KIRI: Exit & Logo */}
          <div className="flex items-center gap-2 pointer-events-auto w-full md:w-auto">
            {/* 1. Tombol EXIT (Pindah ke Kiri) */}
            <button
              onClick={onBack}
              className={`backdrop-blur px-3 py-2 md:px-4 rounded-xl border flex items-center gap-2 shadow-lg transition hover:scale-105 ${
                theme === "dark"
                  ? "bg-black/60 border-white/10 text-white hover:bg-white/10"
                  : "bg-white/80 border-gray-300 text-black hover:bg-gray-100"
              }`}
            >
              <ArrowLeft size={18} />
              <span className="text-[10px] md:text-xs font-bold hidden md:inline">
                {t("exit")}
              </span>
            </button>

            {/* 2. Logo Badge */}
            <div
              className={`backdrop-blur px-3 py-2 md:px-4 rounded-xl border flex items-center gap-3 shadow-lg ${
                theme === "dark"
                  ? "bg-black/60 border-white/10 text-white"
                  : "bg-white/80 border-gray-300 text-black"
              }`}
            >
              <Activity className="text-neon-green animate-pulse w-4 h-4 md:w-5 md:h-5" />
              <div>
                <h1 className="font-bold text-xs md:text-sm tracking-wider">
                  ECOLENS
                </h1>
                <p className="text-[9px] opacity-70 hidden md:block">
                  {t("live_monitoring")}
                </p>
              </div>
            </div>
          </div>

          {/* GROUP KANAN: Alerts & Settings */}
          <div className="flex gap-2 pointer-events-auto w-full md:w-auto justify-end">
            <div
              className={`backdrop-blur px-3 py-2 rounded-xl border shadow-lg flex items-center gap-2 ${
                theme === "dark"
                  ? "bg-black/60 border-white/10 text-white"
                  : "bg-white/80 border-gray-300 text-black"
              }`}
            >
              <ShieldAlert
                size={14}
                className={
                  alerts > 0 ? "text-neon-red animate-bounce" : "opacity-50"
                }
              />
              <div>
                <p className="text-[8px] font-bold opacity-70 leading-none">
                  {t("alerts")}
                </p>
                <p
                  className={`font-black text-sm leading-none ${
                    alerts > 0 ? "text-neon-red" : ""
                  }`}
                >
                  {alerts}
                </p>
              </div>
            </div>

            <div
              className={`backdrop-blur px-2 py-1 rounded-xl border flex items-center gap-1 shadow-lg ${
                theme === "dark"
                  ? "bg-black/60 border-white/10 text-white"
                  : "bg-white/80 border-gray-300 text-black"
              }`}
            >
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-transparent text-[10px] md:text-xs outline-none cursor-pointer font-bold w-10"
              >
                <option value="id">ID</option>
                <option value="en">EN</option>
                <option value="hi">HI</option>
              </select>
              <button
                onClick={toggleTheme}
                className="p-1.5 hover:bg-white/10 rounded-lg transition"
              >
                {theme === "dark" ? (
                  <Sun size={14} className="text-yellow-400" />
                ) : (
                  <Moon size={14} className="text-blue-500" />
                )}
              </button>
            </div>
          </div>
        </div>

        <MapContainer
          center={[-6.99, 110.42]}
          zoom={13}
          style={{ height: "100%" }}
          zoomControl={false}
        >
          <LayersControl position="bottomright">
            {/* DEFAULT: SATELIT (CHECKED) */}
            <LayersControl.BaseLayer checked name="Satellite (Esri)">
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution="&copy; Esri"
                maxNativeZoom={19}
                maxZoom={20}
              />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name="Map (Standard)">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OSM"
                maxNativeZoom={19}
                maxZoom={20}
              />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name="Dark Mode">
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution="&copy; CARTO"
              />
            </LayersControl.BaseLayer>
          </LayersControl>

          <ZoomControl position="bottomright" />
          <MapController centerPos={center} />

          {reports.map((r) => (
            <CircleMarker
              key={r.id}
              center={[r.lat, r.lon]}
              radius={selected === r.id ? 18 : 10}
              pathOptions={{
                color: r.status === "RESOLVED" ? "#00ff9d" : "#ff0055",
              }}
              eventHandlers={{
                click: () => {
                  setSelected(r.id);
                  setDetail(r);
                },
              }}
            >
              <Tooltip>{t("critical")}</Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* --- SIDEBAR LIST (BAWAH di HP, KIRI di Desktop) --- */}
      <div
        className={`w-full md:w-96 flex flex-col z-20 order-2 md:order-1 h-[45vh] md:h-full border-t md:border-t-0 md:border-r shadow-2xl ${
          theme === "dark"
            ? "bg-black/95 border-white/10"
            : "bg-white/95 border-gray-200"
        }`}
      >
        <div
          className={`p-4 border-b flex items-center gap-2 sticky top-0 z-10 backdrop-blur-md ${
            theme === "dark"
              ? "border-white/10 bg-black/80"
              : "border-gray-200 bg-white/80"
          }`}
        >
          <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
          <h2 className="font-bold text-neon-green tracking-widest text-xs">
            {t("live_data_stream")}
          </h2>
        </div>

        {/* LIST CONTAINER: FIX SCROLL DI HP */}
        <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 pb-20 md:pb-4">
          {reports.length === 0 && (
            <div className="text-center mt-10 opacity-50 text-xs">
              <Activity className="mx-auto mb-2" />
              {t("no_data")}
            </div>
          )}

          {reports
            .slice()
            .reverse()
            .map((r) => (
              <div
                key={r.id}
                onClick={() => clickCard(r)}
                className={`p-3 rounded-xl border cursor-pointer transition flex flex-col gap-2 ${
                  selected === r.id
                    ? "border-neon-blue bg-blue-500/5"
                    : theme === "dark"
                      ? "border-white/10 hover:bg-white/5"
                      : "border-gray-200 hover:bg-gray-50"
                } ${r.status === "RESOLVED" ? "opacity-60 grayscale" : ""}`}
              >
                {/* Header Card */}
                <div className="flex justify-between items-start text-[10px] text-gray-500">
                  <span className="flex gap-1 items-center font-mono">
                    <MapPin size={10} /> {r.timestamp}
                  </span>
                  <button
                    onClick={(e) => del(e, r.id)}
                    className="p-1 hover:bg-red-500/10 hover:text-red-500 rounded transition"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

                {/* Content Card */}
                <div className="flex gap-3 items-center">
                  <img
                    src={r.image}
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-lg object-cover border ${
                      theme === "dark" ? "border-white/10" : "border-gray-200"
                    }`}
                  />
                  <div className="min-w-0">
                    <h3
                      className={`font-bold text-xs md:text-sm uppercase truncate ${
                        theme === "dark" ? "text-white" : "text-black"
                      }`}
                    >
                      {r.data.object_name}
                    </h3>
                    <p className="text-[10px] md:text-xs text-gray-500 line-clamp-2 leading-tight mt-0.5">
                      {r.data.prediction_logic}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-5 gap-2 mt-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDetail(r);
                    }}
                    className={`col-span-1 border rounded-lg flex items-center justify-center hover:bg-white/10 transition ${
                      theme === "dark" ? "border-white/10" : "border-gray-200"
                    }`}
                    title={t("view_detail")}
                  >
                    <Eye size={14} className="text-neon-blue" />
                  </button>
                  {r.status === "OPEN" ? (
                    <button
                      onClick={(e) => resolve(e, r.id)}
                      className="col-span-4 bg-neon-blue/10 text-neon-blue text-[10px] font-bold py-1.5 rounded-lg border border-neon-blue/30 flex items-center justify-center gap-1 active:scale-95 transition"
                    >
                      <Truck size={12} /> {t("dispatch")}
                    </button>
                  ) : (
                    <div className="col-span-4 text-center text-[10px] text-neon-green font-bold py-1.5 bg-neon-green/10 rounded-lg flex items-center justify-center gap-1">
                      <CheckCircle size={12} /> {t("selesai")}
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
