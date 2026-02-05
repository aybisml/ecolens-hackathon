import React, { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import {
  Camera,
  ScanLine,
  CloudRain,
  MapPin,
  AlertTriangle,
  X,
  ChevronLeft,
  Satellite,
  RefreshCw,
  Sun,
  Cloud,
  Thermometer,
  Wind,
} from "lucide-react";
import { useTranslation } from "./i18n";

export default function UserApp({ onBack }) {
  const { t, lang } = useTranslation();
  const webcamRef = useRef(null);

  // State Utama
  const [imgSrc, setImgSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // State Lokasi & Cuaca
  const [geo, setGeo] = useState({ lat: null, lon: null });
  const [weather, setWeather] = useState(null);
  const [locationName, setLocationName] = useState("Mencari lokasi..."); // State Nama Daerah
  const [gpsLoading, setGpsLoading] = useState(true);

  // --- 1. LOGIKA CUACA & LOKASI DETAIL ---
  const getWeatherIcon = (code) => {
    if (code === 0) return <Sun size={18} className="text-yellow-400" />;
    if (code >= 1 && code <= 3)
      return <Cloud size={18} className="text-gray-300" />;
    if (code >= 51 && code <= 67)
      return <CloudRain size={18} className="text-blue-400" />;
    if (code >= 80 && code <= 99)
      return <Wind size={18} className="text-purple-400" />;
    return <Sun size={18} className="text-white" />;
  };

  const fetchEnvironmentData = async (lat, lon) => {
    try {
      // A. Ambil Cuaca (Open-Meteo)
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`;
      const weatherRes = await axios.get(weatherUrl);
      const { temperature_2m, weather_code } = weatherRes.data.current;

      let condition = "Unknown";
      if (weather_code === 0) condition = "Cerah";
      else if (weather_code <= 3) condition = "Berawan";
      else if (weather_code <= 67) condition = "Hujan";
      else if (weather_code >= 80) condition = "Badai";

      setWeather({
        temp: temperature_2m,
        code: weather_code,
        text: condition,
      });

      // B. Ambil Nama Daerah Detail (Nominatim OpenStreetMap)
      // Mengambil Kelurahan/Desa/Kecamatan
      const geoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;
      const geoRes = await axios.get(geoUrl);
      const addr = geoRes.data.address;

      // Prioritas nama: Village (Desa) > Suburb (Kelurahan) > Town > City
      const detailedName =
        addr.village ||
        addr.suburb ||
        addr.town ||
        addr.city_district ||
        addr.city ||
        "Lokasi Tidak Dikenal";
      setLocationName(detailedName);
    } catch (err) {
      console.error("Gagal ambil data lingkungan:", err);
      setLocationName("Offline Location");
    }
  };

  // --- 2. LOGIKA GPS ---
  const startGpsTracking = () => {
    setGpsLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(
        (pos) => {
          const newLat = pos.coords.latitude;
          const newLon = pos.coords.longitude;
          setGeo({ lat: newLat, lon: newLon });
          setGpsLoading(false);
        },
        (err) => console.log("GPS Error:", err),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    }
  };

  // Efek: Saat koordinat berubah, ambil data lingkungan baru
  useEffect(() => {
    if (geo.lat && geo.lon) {
      // Debounce sedikit agar tidak spam API jika GPS goyang
      const timer = setTimeout(() => {
        fetchEnvironmentData(geo.lat, geo.lon);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [geo]);

  useEffect(() => {
    startGpsTracking();
  }, []);

  // --- 3. LOGIKA KAMERA & AI ---
  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++)
      ia[i] = byteString.charCodeAt(i);
    return new Blob([ab], { type: mimeString });
  };

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang =
        lang === "id" ? "id-ID" : lang === "hi" ? "hi-IN" : "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  const capture = useCallback(() => {
    if (!geo.lat) {
      alert(t("waiting_gps"));
      return;
    }
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    setLoading(true);

    const formData = new FormData();
    formData.append("image", dataURItoBlob(imageSrc), "scan.jpg");
    formData.append("lat", geo.lat);
    formData.append("lon", geo.lon);

    axios
      .post("http://127.0.0.1:5000/api/analyze", formData)
      .then((res) => {
        setResult(res.data);
        speak(`${res.data.object_name}. ${res.data.prediction_logic}`);
        const currentPoints = parseInt(
          localStorage.getItem("ecoPoints") || "0",
        );
        localStorage.setItem("ecoPoints", currentPoints + 10);
      })
      .catch(() => {
        alert(t("server_error"));
        setImgSrc(null);
      })
      .finally(() => setLoading(false));
  }, [webcamRef, geo, t, lang]);

  const reset = () => {
    setImgSrc(null);
    setResult(null);
  };

  const getStatusColor = (risk) => {
    if (risk?.includes("BANJIR") || risk?.includes("CRITICAL"))
      return "border-neon-red shadow-[0_0_30px_rgba(255,0,85,0.4)]";
    return "border-neon-green shadow-[0_0_30px_rgba(0,255,157,0.3)]";
  };

  return (
    <div className="h-screen w-full bg-black relative overflow-hidden flex flex-col items-center">
      {/* 1. LAYAR UTAMA (Viewfinder) */}
      <div className="relative w-full h-full">
        {!imgSrc ? (
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "environment" }}
            className="h-full w-full object-cover"
          />
        ) : (
          <img src={imgSrc} className="h-full w-full object-cover opacity-60" />
        )}

        {/* Tombol Kembali */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 z-[100] w-10 h-10 md:w-12 md:h-12 glass-panel rounded-full flex items-center justify-center hover:bg-white/20 border border-white/20"
        >
          <ChevronLeft size={24} className="text-white" />
        </button>

        {/* --- WIDGET CUACA & LOKASI DETAIL (Kanan Atas) --- */}
        {weather && (
          <div className="absolute top-6 right-6 z-[90] glass-panel px-4 py-2 rounded-2xl flex items-center gap-3 border border-white/20 animate-fade-in backdrop-blur-md bg-black/40 max-w-[200px]">
            <div className="flex flex-col items-end overflow-hidden">
              {/* Nama Daerah Detail (Marquee jika panjang) */}
              <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wide truncate w-full text-right">
                {locationName}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black text-white leading-none">
                  {weather.temp}°
                </span>
                <span className="text-[10px] font-medium text-neon-green leading-none">
                  {weather.text}
                </span>
              </div>
            </div>
            <div className="w-9 h-9 shrink-0 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
              {getWeatherIcon(weather.code)}
            </div>
          </div>
        )}

        {/* --- KOORDINAT GPS REAL-TIME (Bawah) --- */}
        <div
          className={`absolute bottom-36 left-1/2 -translate-x-1/2 glass-panel px-4 py-2 rounded-full flex items-center gap-3 border z-10 transition-all ${geo.lat ? "border-neon-green bg-black/60" : "border-red-500 bg-red-900/20"}`}
        >
          <div
            className={`w-2 h-2 rounded-full ${geo.lat ? "bg-neon-green animate-pulse" : "bg-red-500 animate-bounce"}`}
          ></div>

          {/* Tampilkan Koordinat Angka */}
          <span className="hud-text text-xs md:text-sm font-bold text-white tracking-widest whitespace-nowrap font-mono">
            {geo.lat
              ? `GPS: ${geo.lat.toFixed(4)}, ${geo.lon.toFixed(4)}`
              : t("searching")}
          </span>

          {/* Tombol Refresh */}
          {!geo.lat && (
            <button
              onClick={startGpsTracking}
              className="ml-1 p-1 bg-white/10 rounded-full hover:bg-white/30 transition animate-spin-slow"
            >
              <RefreshCw size={12} className="text-white" />
            </button>
          )}
        </div>
      </div>

      {/* 2. TOMBOL SHUTTER */}
      {!imgSrc && !loading && (
        <div className="absolute bottom-10 z-20">
          {geo.lat ? (
            <button
              onClick={capture}
              className="w-20 h-20 bg-black/80 rounded-full border-2 border-white/20 flex items-center justify-center hover:scale-105 transition shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-95"
            >
              <div className="w-14 h-14 rounded-full border border-white/50 flex items-center justify-center">
                <Camera size={32} className="text-white" />
              </div>
            </button>
          ) : (
            <div
              className="text-red-400 font-bold text-xs animate-pulse flex flex-col items-center cursor-pointer"
              onClick={startGpsTracking}
            >
              <Satellite className="mb-2" />
              {t("waiting_gps")}
            </div>
          )}
        </div>
      )}

      {/* 3. LOADING OVERLAY */}
      {loading && (
        <div className="absolute inset-0 z-30 bg-black/60 flex flex-col items-center justify-center backdrop-blur-sm">
          <div className="relative w-full h-1 bg-neon-green/50 animate-scan"></div>
          <ScanLine size={48} className="text-neon-green animate-pulse" />
          <h2 className="hud-text text-2xl font-bold text-white tracking-[0.2em] mt-4">
            {t("analyzing")}
          </h2>
        </div>
      )}

      {/* 4. HASIL ANALISIS */}
      {result && !loading && (
        <div
          className={`absolute bottom-0 w-full max-h-[85vh] overflow-y-auto glass-panel rounded-t-[2rem] p-6 z-40 animate-slide-up border-t-2 ${getStatusColor(result.risk_level)}`}
        >
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-black text-white uppercase italic leading-none">
              {result.object_name}
            </h1>
            <button
              onClick={reset}
              className="bg-white/10 p-2 rounded-full hover:bg-white/20"
            >
              <X size={24} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-black/40 p-3 rounded-xl border border-white/5">
              <p className="text-[10px] text-gray-400 font-bold">
                {t("material")}
              </p>
              <p className="text-sm font-bold text-white uppercase">
                {result.material_type}
              </p>
            </div>
            <div className="bg-black/40 p-3 rounded-xl border border-white/5">
              <p className="text-[10px] text-gray-400 font-bold">
                {t("weather")}
              </p>
              <p className="text-sm font-bold text-neon-blue">
                {result.weather_context}
              </p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-r from-gray-900 to-black border border-white/10 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={14} className="text-neon-green" />
              <p className="text-xs font-bold uppercase text-neon-green">
                {t("risk_level")}: {result.risk_level}
              </p>
            </div>
            <p className="text-sm text-gray-300">"{result.prediction_logic}"</p>
          </div>
          <button
            onClick={reset}
            className="w-full py-4 bg-white text-black font-black text-lg rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition"
          >
            <Camera size={20} /> {t("scan_next")}
          </button>
        </div>
      )}
    </div>
  );
}
