import os
import io
import json
import uuid
import logging
import base64
import sqlite3
import requests
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image

# ==================================================================
# ⚙️ 1. KONFIGURASI SISTEM
# ==================================================================
class Config:
    # Ambil API Key dari environment variables Vercel
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
    
    # Model AI Google Gemini
    MODEL_NAME = "gemini-1.5-flash" 
    GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL_NAME}:generateContent"
    
    # Koordinat Default (Semarang) jika GPS tidak aktif
    DEFAULT_LAT = -6.9667
    DEFAULT_LON = 110.4167
    
    # Pengaturan Database: Vercel hanya mengizinkan tulis file di /tmp
    IS_VERCEL = os.environ.get("VERCEL")
    DB_NAME = "/tmp/ecolens.db" if IS_VERCEL else "ecolens.db"

# Setup Logging untuk debugging di Dashboard Vercel
logging.basicConfig(level=logging.INFO, format='%(asctime)s | %(levelname)s | %(message)s')
logger = logging.getLogger("EcoLens-Brain")

app = Flask(__name__)
# Izinkan CORS agar frontend bisa berkomunikasi dengan backend ini
CORS(app)

# ==================================================================
# 🗄️ 2. PENGELOLA DATABASE (SQLite)
# ==================================================================
def get_db_connection():
    """Membuka koneksi ke database SQLite."""
    conn = sqlite3.connect(Config.DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Inisialisasi tabel laporan jika belum ada."""
    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('''
            CREATE TABLE IF NOT EXISTS reports (
                id TEXT PRIMARY KEY,
                timestamp TEXT,
                lat REAL,
                lon REAL,
                image TEXT,
                ai_data TEXT,
                status TEXT
            )
        ''')
        conn.commit()
        conn.close()
        logger.info(f"🗄️ Database siap di: {Config.DB_NAME}")
    except Exception as e:
        logger.error(f"❌ Gagal inisialisasi DB: {e}")

# Jalankan inisialisasi DB saat startup
init_db()

# ==================================================================
# ⛈️ 3. LAYANAN CUACA (Open-Meteo)
# ==================================================================
def get_weather_context(lat, lon):
    """Mendapatkan kondisi cuaca real-time berdasarkan koordinat."""
    try:
        url = "https://api.open-meteo.com/v1/forecast"
        params = {
            "latitude": lat,
            "longitude": lon,
            "current": "precipitation,weather_code",
            "timezone": "auto"
        }
        res = requests.get(url, params=params, timeout=5)
        data = res.json().get('current', {})
        
        code = data.get('weather_code', 0)
        rain = data.get('precipitation', 0.0)
        
        # Sederhanakan deskripsi cuaca
        condition = "Cerah"
        if code in [1, 2, 3]: condition = "Berawan"
        elif code >= 51: condition = "Hujan/Badai"
        
        return condition, rain
    except Exception as e:
        logger.warning(f"⚠️ Gagal mengambil data cuaca: {e}")
        return "Tidak diketahui", 0.0

# ==================================================================
# 🧠 4. LAYANAN AI (Google Gemini)
# ==================================================================
def analyze_with_gemini(img_b64, weather, rain):
    """Mengirim gambar dan konteks cuaca ke Gemini AI."""
    if not Config.GOOGLE_API_KEY:
        return {"error": "API Key Google tidak ditemukan di server."}

    prompt = f"""
    Analisis gambar lingkungan ini. 
    Konteks cuaca saat ini: {weather} dengan intensitas hujan {rain}mm.
    Identifikasi objek sampah dan risiko banjir.
    Berikan output dalam format JSON murni:
    {{
        "object_name": "nama objek",
        "material_type": "tipe material",
        "risk_level": "LOW/MEDIUM/HIGH/CRITICAL",
        "prediction_logic": "alasan risiko berdasarkan cuaca",
        "disposal_instruction": "instruksi pembuangan",
        "eco_tip": "fakta singkat lingkungan"
    }}
    """
    
    payload = {
        "contents": [{
            "parts": [
                {"text": prompt},
                {"inline_data": {"mime_type": "image/jpeg", "data": img_b64}}
            ]
        }],
        "generationConfig": {"response_mime_type": "application/json"}
    }
    
    try:
        res = requests.post(f"{Config.GEMINI_URL}?key={Config.GOOGLE_API_KEY}", json=payload, timeout=25)
        res_json = res.json()
        raw_text = res_json['candidates'][0]['content']['parts'][0]['text']
        return json.loads(raw_text)
    except Exception as e:
        logger.error(f"❌ Gemini AI Error: {e}")
        return None

# ==================================================================
# 🚀 5. API ROUTES
# ==================================================================

@app.route('/api/analyze', methods=['POST'])
def handle_analyze():
    """Menerima upload gambar dan memproses analisis lengkap."""
    if 'image' not in request.files:
        return jsonify({"error": "Tidak ada gambar yang diunggah"}), 400
    
    try:
        # 1. Ambil koordinat dari frontend
        lat = float(request.form.get('lat', Config.DEFAULT_LAT))
        lon = float(request.form.get('lon', Config.DEFAULT_LON))
        
        # 2. Ambil data cuaca
        weather, rain = get_weather_context(lat, lon)
        
        # 3. Proses & Kompres Gambar
        image_file = request.files['image']
        img = Image.open(image_file).convert('RGB')
        if img.width > 800:
            img.thumbnail((800, 800))
            
        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=70)
        img_b64 = base64.b64encode(buf.getvalue()).decode('utf-8')
        
        # 4. Analisis AI
        ai_data = analyze_with_gemini(img_b64, weather, rain)
        if not ai_data:
            return jsonify({"error": "AI gagal memproses gambar"}), 500

        # 5. Simpan ke Database
        report_id = str(uuid.uuid4())
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('INSERT INTO reports VALUES (?,?,?,?,?,?,?)', (
            report_id, timestamp, lat, lon, 
            f"data:image/jpeg;base64,{img_b64}", 
            json.dumps(ai_data), 
            "OPEN"
        ))
        conn.commit()
        conn.close()

        return jsonify({
            "id": report_id,
            "timestamp": timestamp,
            "weather": f"{weather} ({rain}mm)",
            **ai_data
        })

    except Exception as e:
        logger.error(f"🔥 Server Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/reports', methods=['GET'])
def get_reports():
    """Mengambil riwayat laporan."""
    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute("SELECT * FROM reports ORDER BY timestamp DESC")
        rows = c.fetchall()
        conn.close()
        
        output = []
        for r in rows:
            output.append({
                "id": r['id'],
                "timestamp": r['timestamp'],
                "lat": r['lat'],
                "lon": r['lon'],
                "image": r['image'],
                "data": json.loads(r['ai_data']),
                "status": r['status']
            })
        return jsonify(output)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/reports/<id>', methods=['DELETE'])
def delete_report(id):
    """Menghapus laporan berdasarkan ID."""
    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute("DELETE FROM reports WHERE id = ?", (id,))
        conn.commit()
        conn.close()
        return jsonify({"message": "Laporan berhasil dihapus"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Endpoint status untuk pengecekan Vercel
@app.route('/')
def index():
    return jsonify({"status": "EcoLens Backend Active", "database": Config.DB_NAME})

if __name__ == '__main__':
    # Mode lokal
    app.run(debug=True, port=5000)