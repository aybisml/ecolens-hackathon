import os
import io
import json
import uuid
import logging
import base64
import sqlite3
import requests
import re
from datetime import datetime
from typing import Tuple, Dict, Any, Optional

from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image

# ==================================================================
# ⚙️ 1. KONFIGURASI SISTEM
# ==================================================================
class Config:
    # ⚠️ PASTE API KEY GEMINI ANDA DI SINI
    GOOGLE_API_KEY = "API_KEY_ANDA" 
    
    # Model AI
    MODEL_NAME = "gemini-flash-latest"
    GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL_NAME}:generateContent"
    
    # Lokasi Default (Semarang) - Fallback jika GPS error
    DEFAULT_LAT = -6.9667
    DEFAULT_LON = 110.4167
    
    DB_NAME = "ecolens.db"

# Setup Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s | %(levelname)s | %(message)s', datefmt='%H:%M:%S')
logger = logging.getLogger("EcoLens-Brain")

app = Flask(__name__)
CORS(app)

# ==================================================================
# 🗄️ 2. DATABASE MANAGER (SQLite)
# ==================================================================
def init_db():
    try:
        conn = sqlite3.connect(Config.DB_NAME)
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
        logger.info(f"🗄️  Database Connected: {Config.DB_NAME}")
    except Exception as e:
        logger.error(f"❌ Init DB Error: {e}")

def save_report_to_db(data):
    try:
        conn = sqlite3.connect(Config.DB_NAME)
        c = conn.cursor()
        c.execute('INSERT INTO reports VALUES (?,?,?,?,?,?,?)', (
            data['id'], data['timestamp'], data['lat'], data['lon'], 
            data['image'], json.dumps(data['data']), data['status']
        ))
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        logger.error(f"❌ DB Save Error: {e}")
        return False

def get_reports_from_db():
    try:
        conn = sqlite3.connect(Config.DB_NAME)
        conn.row_factory = sqlite3.Row
        c = conn.cursor()
        c.execute("SELECT * FROM reports")
        rows = c.fetchall()
        conn.close()
        return [{
            "id": r['id'], "timestamp": r['timestamp'], "lat": r['lat'], "lon": r['lon'],
            "image": r['image'], "data": json.loads(r['ai_data']), "status": r['status']
        } for r in rows]
    except: return []

def update_report_status(id, status):
    try:
        conn = sqlite3.connect(Config.DB_NAME)
        c = conn.cursor()
        c.execute("UPDATE reports SET status = ? WHERE id = ?", (status, id))
        conn.commit()
        conn.close()
        return True
    except: return False

def delete_report_from_db(id):
    try:
        conn = sqlite3.connect(Config.DB_NAME)
        c = conn.cursor()
        c.execute("DELETE FROM reports WHERE id = ?", (id,))
        conn.commit()
        conn.close()
        return True
    except: return False

init_db()

# ==================================================================
# ⛈️ 3. SERVICE: WEATHER INTELLIGENCE (AKURAT & DETAIL)
# ==================================================================
def get_weather_context(lat, lon):
    try:
        # Fallback jika koordinat 0 atau null
        if not lat or not lon or (float(lat) == 0 and float(lon) == 0): 
            lat, lon = Config.DEFAULT_LAT, Config.DEFAULT_LON

        url = "https://api.open-meteo.com/v1/forecast"
        params = {
            "latitude": lat,
            "longitude": lon,
            "current": "precipitation,weather_code,cloud_cover", # Tambah cloud_cover untuk akurasi
            "timezone": "auto"
        }
        # ⚠️ PENTING: User-Agent agar tidak diblokir
        headers = {"User-Agent": "EcoLensApp/1.0"}
        
        response = requests.get(url, params=params, headers=headers, timeout=10)
        data = response.json()
        
        current = data.get('current', {})
        code = current.get('weather_code', 0)
        rain_mm = current.get('precipitation', 0.0)
        cloud_cover = current.get('cloud_cover', 0)

        # LOGIKA WMO CODE YANG LEBIH LENGKAP
        condition = "Tidak Diketahui"
        
        # 0-3: Kondisi Langit
        if code == 0: condition = "Cerah"
        elif code == 1: condition = "Cerah Berawan"
        elif code == 2: condition = "Berawan"
        elif code == 3: condition = "Mendung (Overcast)"
        
        # 45-48: Kabut
        elif 45 <= code <= 48: condition = "Berkabut"
        
        # 51-57: Gerimis
        elif 51 <= code <= 55: condition = "Gerimis Ringan"
        elif 56 <= code <= 57: condition = "Gerimis Membeku"
        
        # 61-67: Hujan
        elif 61 <= code <= 65: condition = "Hujan Ringan/Sedang"
        elif 66 <= code <= 67: condition = "Hujan Es"
        
        # 80-99: Hujan Deras & Badai
        elif 80 <= code <= 82: condition = "Hujan Deras (Shower)"
        elif 95 <= code <= 99: condition = "BADAI PETIR"
        
        # Fallback Logic (Jika kode WMO aneh)
        if condition == "Tidak Diketahui":
            if rain_mm > 0.5: condition = "Hujan Ringan"
            elif cloud_cover > 50: condition = "Berawan/Mendung"
            else: condition = "Cerah"

        logger.info(f"🌤️ Weather Update: {condition} (Code: {code}, Clouds: {cloud_cover}%, Rain: {rain_mm}mm)")
        return condition, rain_mm

    except Exception as e:
        logger.warning(f"⚠️ Weather Error: {e}")
        return "Cerah (Offline Mode)", 0.0

# ==================================================================
# 🧠 4. SERVICE: AI ANALYSIS (CLEANER)
# ==================================================================
def clean_json_response(text):
    """Membersihkan format Markdown ```json ... ``` dari respon Gemini"""
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    if text.endswith("```"):
        text = text[:-3]
    return text.strip()

def analyze_risk_with_gemini(base64_img, weather, rain, coords):
    prompt = f"""
    Context: Loc {coords}, Weather {weather}, Rain {rain}mm.
    Task: Identify trash object & flood risk.
    Risk Logic: 
    - CRITICAL: Trash clogs drain AND (Rain > 0.5mm OR Storm).
    - HIGH: Trash clogs drain (Clear weather).
    - MEDIUM: Trash on road.
    - LOW: Organic/Clean.
    Output JSON ONLY: {{ "object_name": "...", "material_type": "...", "weather_context": "{weather}", "risk_level": "...", "prediction_logic": "...", "disposal_instruction": "...", "fun_fact": "..." }}
    """
    payload = {
        "contents": [{"parts": [{"text": prompt}, {"inline_data": {"mime_type": "image/jpeg", "data": base64_img}}]}],
        "generationConfig": {"response_mime_type": "application/json"}
    }
    try:
        res = requests.post(f"{Config.GEMINI_URL}?key={Config.GOOGLE_API_KEY}", json=payload, timeout=20)
        if res.status_code != 200: return None
        
        raw_text = res.json()['candidates'][0]['content']['parts'][0]['text']
        clean_text = clean_json_response(raw_text) # Bersihkan JSON
        return json.loads(clean_text)
    except Exception as e:
        logger.error(f"AI Error: {e}")
        return None

def process_image(file):
    img = Image.open(file).convert('RGB')
    if img.width > 800:
        ratio = 800 / float(img.width)
        img = img.resize((800, int(img.height * ratio)), Image.Resampling.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=60)
    return base64.b64encode(buf.getvalue()).decode('utf-8')

# ==================================================================
# 🚀 6. API ROUTES
# ==================================================================
@app.route('/api/analyze', methods=['POST'])
def handle_analyze():
    if 'image' not in request.files: return jsonify({"error": "No Image"}), 400
    
    # --- Validasi & Fallback Koordinat ---
    try:
        lat_raw = float(request.form.get('lat', 0))
        lon_raw = float(request.form.get('lon', 0))
        
        if lat_raw == 0 and lon_raw == 0:
            logger.info("📍 Null Island detected. Using Default Location.")
            lat, lon = Config.DEFAULT_LAT, Config.DEFAULT_LON
        else:
            lat, lon = lat_raw, lon_raw
    except:
        lat, lon = Config.DEFAULT_LAT, Config.DEFAULT_LON

    try:
        # Proses Parallel (Serial di Python sederhana)
        weather, rain = get_weather_context(lat, lon)
        img_b64 = process_image(request.files['image'])
        ai_res = analyze_risk_with_gemini(img_b64, weather, rain, (lat, lon))
        
        if not ai_res: return jsonify({"error": "AI Failed"}), 500

        data = {
            "id": str(uuid.uuid4()), "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "lat": lat, "lon": lon, "image": f"data:image/jpeg;base64,{img_b64}",
            "data": ai_res, "status": "OPEN"
        }
        
        save_report_to_db(data)
        logger.info(f"✅ Analysis Complete: {ai_res['risk_level']}")
        return jsonify(ai_res), 200

    except Exception as e:
        logger.error(f"🔥 Server Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/reports', methods=['GET'])
def list_reports():
    return jsonify(get_reports_from_db())

@app.route('/api/reports/<id>/resolve', methods=['POST'])
def resolve(id):
    if update_report_status(id, "RESOLVED"): return jsonify({"msg": "OK"})
    return jsonify({"error": "Fail"}), 500

@app.route('/api/reports/<id>', methods=['DELETE'])
def delete(id):
    if delete_report_from_db(id): return jsonify({"msg": "Deleted"})
    return jsonify({"error": "Fail"}), 500

if __name__ == '__main__':
    print("\n" + "="*50)
    print(f"🌿 ECOLENS BRAIN ONLINE")
    print(f"🌍 Weather Service: Open-Meteo (High Accuracy)")
    print("="*50 + "\n")
    app.run(debug=True, port=5000)