import React, { createContext, useContext, useState, useEffect } from "react";

const translations = {
  en: {
    // --- MAIN MENU ---
    planetary_defense_system: "PLANETARY DEFENSE SYSTEM",
    platform_description:
      "AI-based environmental intelligence platform turning citizens into real-time flood sensors.",
    read_system_docs: "READ SYSTEM DOCS",
    mode_user: "Citizen Mode",
    sensor_description:
      "Activate 'The Sensor'. Scan environment, send precise GPS data, and get instant risk analysis.",
    mode_admin: "Government Mode",
    command_center_description:
      "Access 'Command Center'. Monitor flood heatmaps, real-time telemetry, and dispatch crews.",
    powered_by: "POWERED BY GEMINI 1.5 FLASH & OPEN-METEO",

    // --- USER APP (CAMERA) ---
    gps_locked: "GPS LOCKED",
    searching: "SEARCHING...",
    waiting_gps: "WAITING FOR GPS...",
    analyzing: "ANALYZING",
    scan_next: "SCAN NEXT",
    server_error: "Server Error / Offline",

    // --- DASHBOARD & COMMON ---
    live_monitoring: "LIVE MONITORING",
    alerts: "ALERTS",
    exit: "EXIT",
    live_data_stream: "LIVE DATA STREAM",
    incoming_reports: "INCOMING REPORTS",
    no_data: "NO DATA SIGNAL...",
    delete_report: "Delete Report",
    view_detail: "View Details",
    dispatch: "DISPATCH UNIT",
    selesai: "RESOLVED",
    critical: "CRITICAL",
    evidence: "EVIDENCE",
    risk_level: "RISK LEVEL",
    timestamp: "TIMESTAMP",
    material: "MATERIAL",
    weather: "WEATHER",
    ai_logic: "AI REASONING",
    action_plan: "ACTION PLAN",
    did_you_know: "DID YOU KNOW?",
    db_id: "DB_ID",

    // --- DOCS ---
    system_docs: "SYSTEM DOCS",
    architecture_version: "ECOLENS ARCHITECTURE v2.1 (STABLE)",
    main_menu: "MAIN MENU",
    brain_behind: "THE BRAIN BEHIND ECOLENS",
    platform_intro:
      "EcoLens is a Full-Stack Intelligence platform combining crowdsourced data, computer vision (AI), and real-time weather data to detect flood risks early.",
    data_fusion: "Data Fusion",
    data_fusion_desc:
      "Integration of 3 Data Sources: User Photo + GPS Latitude/Longitude + Rainfall API.",
    gemini_flash: "Gemini 1.5 Flash",
    gemini_desc:
      "Semantic image analysis to determine trash material types & blockage levels.",
    persistent_db: "Persistent DB",
    db_desc: "SQLite Database stores report history permanently.",
    system_workflow: "System Workflow",
    capture_ingest: "1. Capture & Ingest",
    capture_ingest_desc: "Frontend captures photo and locks GPS.",
    processing_analysis: "2. Processing & Analysis",
    processing_analysis_desc: "Backend performs parallel requests.",
    open_meteo_api: "Open-Meteo API",
    google_gemini: "Google Gemini AI",
    storage_sqlite: "3. Storage (SQLite)",
    storage_desc: "Results stored in ecolens.db.",
    monitoring_action: "4. Monitoring & Action",
    monitoring_desc: "Admin Dashboard monitors real-time data.",
    backend_api: "Backend API Routes",
    analyze_endpoint: "Analyze image endpoint.",
    analyze_input: "Input: FormData",
    analyze_output: "Output: JSON",
    reports_endpoint: "Fetch reports.",
    resolve_endpoint: "Resolve report.",
    delete_endpoint: "Delete report.",
    tech_stack: "Technology Stack",
    copyright: "ECOLENS PROJECT © 2026.",
  },
  id: {
    // --- MAIN MENU ---
    planetary_defense_system: "SISTEM PERTAHANAN PLANET",
    platform_description:
      "Platform intelijen lingkungan berbasis AI yang mengubah warga menjadi sensor banjir real-time.",
    read_system_docs: "DOKUMENTASI SISTEM",
    mode_user: "Mode Warga",
    sensor_description:
      "Aktifkan 'Sensor'. Pindai lingkungan, kirim GPS presisi, dan dapatkan analisis risiko instan.",
    mode_admin: "Mode Pemerintah",
    command_center_description:
      "Akses 'Command Center'. Pantau peta panas banjir, telemetri real-time, dan kirim tim.",
    powered_by: "DITENAGAI OLEH GEMINI 1.5 FLASH & OPEN-METEO",

    // --- USER APP ---
    gps_locked: "GPS TERKUNCI",
    searching: "MENCARI SINYAL...",
    waiting_gps: "MENUNGGU GPS...",
    analyzing: "MENGANALISIS",
    scan_next: "SCAN BERIKUTNYA",
    server_error: "Server Error / Offline",

    // --- DASHBOARD ---
    live_monitoring: "PEMANTAUAN LANGSUNG",
    alerts: "PERINGATAN",
    exit: "KELUAR",
    live_data_stream: "ALIRAN DATA",
    incoming_reports: "LAPORAN MASUK",
    no_data: "MENUNGGU SINYAL...",
    delete_report: "Hapus Laporan",
    view_detail: "Lihat Detail",
    dispatch: "KIRIM TIM",
    selesai: "SELESAI",
    critical: "BAHAYA",
    evidence: "BUKTI FOTO",
    risk_level: "TINGKAT RISIKO",
    timestamp: "WAKTU",
    material: "MATERIAL",
    weather: "CUACA",
    ai_logic: "ANALISIS AI",
    action_plan: "RENCANA AKSI",
    did_you_know: "TAHUKAH KAMU?",
    db_id: "ID DATABASE",

    // --- DOCS ---
    system_docs: "DOKUMENTASI SISTEM",
    architecture_version: "ARSITEKTUR ECOLENS v2.1 (STABIL)",
    main_menu: "MENU UTAMA",
    brain_behind: "OTAK DI BALIK ECOLENS",
    platform_intro:
      "EcoLens adalah platform Intelijen Full-Stack yang menggabungkan data warga, visi komputer (AI), dan data cuaca real-time untuk mendeteksi risiko banjir sejak dini.",
    data_fusion: "Fusi Data",
    data_fusion_desc:
      "Integrasi 3 Sumber: Foto Pengguna + GPS Latitude/Longitude + API Curah Hujan.",
    gemini_flash: "Gemini 1.5 Flash",
    gemini_desc:
      "Analisis gambar semantik untuk menentukan jenis material sampah.",
    persistent_db: "Database Persisten",
    db_desc: "Database SQLite menyimpan riwayat laporan secara permanen.",
    system_workflow: "Alur Kerja Sistem",
    capture_ingest: "1. Tangkap & Ingest",
    capture_ingest_desc: "Frontend mengambil foto dan mengunci GPS.",
    processing_analysis: "2. Pemrosesan & Analisis",
    processing_analysis_desc: "Backend melakukan request paralel.",
    open_meteo_api: "API Open-Meteo",
    google_gemini: "Google Gemini AI",
    storage_sqlite: "3. Penyimpanan (SQLite)",
    storage_desc: "Hasil disimpan ke ecolens.db.",
    monitoring_action: "4. Pemantauan & Aksi",
    monitoring_desc: "Dashboard Admin memantau data via Polling.",
    backend_api: "Rute API Backend",
    analyze_endpoint: "Endpoint Analisis.",
    analyze_input: "Input: FormData",
    analyze_output: "Output: JSON",
    reports_endpoint: "Ambil laporan.",
    resolve_endpoint: "Selesaikan laporan.",
    delete_endpoint: "Hapus laporan.",
    tech_stack: "Teknologi Stack",
    copyright: "PROYEK ECOLENS © 2026.",
  },
  hi: {
    // --- MAIN MENU ---
    planetary_defense_system: "ग्रहीय रक्षा प्रणाली",
    platform_description:
      "एआई-आधारित पर्यावरण खुफिया मंच जो नागरिकों को रीयल-टाइम बाढ़ सेंसर में बदल देता है।",
    read_system_docs: "सिस्टम दस्तावेज़ पढ़ें",
    mode_user: "नागरिक मोड",
    sensor_description:
      "'सेंसर' सक्रिय करें। वातावरण स्कैन करें, सटीक जीपीएस भेजें, और त्वरित जोखिम विश्लेषण प्राप्त करें।",
    mode_admin: "प्रशासन मोड",
    command_center_description:
      "'कमांड सेंटर' तक पहुंचें। बाढ़ के हीटमैप, रीयल-टाइम टेलीमेट्री की निगरानी करें, और बचाव दल भेजें।",
    powered_by: "जेमिनी 1.5 फ्लैश और ओपन-मेटियो द्वारा संचालित",

    // --- USER APP ---
    gps_locked: "जीपीएस लॉक",
    searching: "खोज रहा है...",
    waiting_gps: "जीपीएस की प्रतीक्षा...",
    analyzing: "विश्लेषण हो रहा है",
    scan_next: "अगला स्कैन करें",
    server_error: "सर्वर त्रुटि / ऑफ़लाइन",

    // --- DASHBOARD ---
    live_monitoring: "लाइव निगरानी",
    alerts: "चेतावनी",
    exit: "बाहर जाएं",
    live_data_stream: "लाइव डेटा स्ट्रीम",
    incoming_reports: "आने वाली रिपोर्ट",
    no_data: "डेटा सिग्नल नहीं...",
    delete_report: "रिपोर्ट हटाएं",
    view_detail: "विवरण देखें",
    dispatch: "टीम भेजें",
    selesai: "समाधान किया गया",
    critical: "गंभीर",
    evidence: "सबूत",
    risk_level: "जोखिम स्तर",
    timestamp: "समय",
    material: "सामग्री",
    weather: "मौसम",
    ai_logic: "एआई तर्क",
    action_plan: "कार्य योजना",
    did_you_know: "क्या आप जानते हैं?",
    db_id: "डेटाबेस आईडी",

    // --- DOCS ---
    system_docs: "सिस्टम दस्तावेज़",
    architecture_version: "इकोलेंस आर्किटेक्चर v2.1 (स्थिर)",
    main_menu: "मुख्य मेनू",
    brain_behind: "इकोलेंस के पीछे का दिमाग",
    platform_intro:
      "इकोलेंस एक फुल-स्टैक इंटेलिजेंस प्लेटफॉर्म है जो बाढ़ के जोखिमों का जल्द पता लगाने के लिए क्राउडसोर्स किए गए डेटा, कंप्यूटर विजन (एआई) और रीयल-टाइम मौसम डेटा को जोड़ता है।",
    data_fusion: "डेटा एकीकरण",
    data_fusion_desc:
      "3 डेटा स्रोतों का एकीकरण: उपयोगकर्ता फोटो + जीपीएस अक्षांश/देशांतर + वर्षा एपीआई।",
    gemini_flash: "जेमिनी 1.5 फ्लैश",
    gemini_desc:
      "कचरे की सामग्री के प्रकार और रुकावट के स्तर को निर्धारित करने के लिए शब्दार्थ छवि विश्लेषण।",
    persistent_db: "स्थायी डेटाबेस",
    db_desc: "SQLite डेटाबेस रिपोर्ट इतिहास को स्थायी रूप से संग्रहीत करता है।",
    system_workflow: "सिस्टम कार्यप्रवाह",
    capture_ingest: "1. कैप्चर और इंजस्ट",
    capture_ingest_desc:
      "फ्रंटएंड फोटो लेता है और जीपीएस निर्देशांक लॉक करता है।",
    processing_analysis: "2. प्रसंस्करण और विश्लेषण",
    processing_analysis_desc: "बैकएंड समानांतर अनुरोध करता है।",
    open_meteo_api: "ओपन-मेटियो एपीआई",
    google_gemini: "गूगल जेमिनी एआई",
    storage_sqlite: "3. भंडारण (SQLite)",
    storage_desc: "परिणाम और स्थिति ecolens.db फ़ाइल में संग्रहीत।",
    monitoring_action: "4. निगरानी और कार्रवाई",
    monitoring_desc: "एडमिन डैशबोर्ड रीयल-टाइम डेटा की निगरानी करता है।",
    backend_api: "बैकएंड एपीआई रूट",
    analyze_endpoint: "छवि विश्लेषण एंडपॉइंट।",
    analyze_input: "इनपुट: फॉर्मडेटा",
    analyze_output: "आउटपुट: JSON",
    reports_endpoint: "रिपोर्ट प्राप्त करें।",
    resolve_endpoint: "रिपोर्ट हल करें।",
    delete_endpoint: "रिपोर्ट हटाएं।",
    tech_stack: "तकनीकी स्टैक",
    copyright: "इकोलेंस प्रोजेक्ट © 2026.",
  },
};

const I18nContext = createContext();

export const I18nProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem("appLang") || "id");

  useEffect(() => {
    localStorage.setItem("appLang", lang);
  }, [lang]);

  const t = (key) => {
    return translations[lang]?.[key] || key;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => useContext(I18nContext);
