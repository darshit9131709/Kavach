import requests
import sqlite3
import joblib
import pandas as pd
import re
import math
from fastapi import FastAPI
from datetime import datetime, timedelta

# ---------------- CONFIG ----------------
NEWS_API_KEY = "11cc62b81d684e1e8e2068639ed1f511"
OPENCAGE_API_KEY = "c537640d1b7f4107b75b915f8773b080"
MODEL_PATH = "D:/women_safety_dataset/xgb_model.pkl"
CSV_PATH = r"D:\Downloads\RS_Session_266_AU_2030_1.csv"

app = FastAPI()
model = joblib.load(MODEL_PATH)

CATEGORY_WEIGHTS = {
    "harassment": 3,
    "assault": 5,
    "stalking": 4,
    "unsafe_area": 2
}

# ---------------- LOAD CSV DATA ----------------
df = pd.read_csv(CSV_PATH).fillna(0)

pendency_map = {}
for _, row in df.iterrows():
    state = str(row.iloc[0]).strip()
    values = pd.to_numeric(row.iloc[1:], errors='coerce')
    pendency_map[state] = values.sum()

STATE_MAPPING = {state: i for i, state in enumerate(pendency_map.keys())}

# ---------------- DB ----------------
conn = sqlite3.connect("events.db", check_same_thread=False)
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lat REAL,
    lon REAL,
    timestamp TEXT,
    source TEXT
)
""")

# also ensure user_reports exists so get_layers can read from it
cursor.execute("""
CREATE TABLE IF NOT EXISTS user_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lat REAL,
    lon REAL,
    category TEXT,
    timestamp TEXT
)
""")

conn.commit()

# ---------------- GEO ----------------
def get_state(lat, lon):
    try:
        url = f"https://api.opencagedata.com/geocode/v1/json?q={lat}+{lon}&key={OPENCAGE_API_KEY}"
        res = requests.get(url).json()

        if res.get("results"):
            comp = res["results"][0]["components"]
            iso = comp.get("ISO_3166-2")

            if iso:
                code = iso[0].split("-")[-1]
                state_map = {
                    "DL": "Delhi", "MH": "Maharashtra", "WB": "West Bengal",
                    "KA": "Karnataka", "TN": "Tamil Nadu", "UP": "Uttar Pradesh",
                    "BR": "Bihar", "GJ": "Gujarat", "RJ": "Rajasthan",
                    "MP": "Madhya Pradesh", "HR": "Haryana", "PB": "Punjab",
                    "TS": "Telangana", "AP": "Andhra Pradesh", "KL": "Kerala",
                    "OR": "Odisha", "JH": "Jharkhand", "AS": "Assam", "CT": "Chhattisgarh"
                }
                return state_map.get(code, "Unknown")

    except Exception as e:
        print("Geo error:", e)

    return "Unknown"


def get_coordinates(place):
    try:
        url = f"https://api.opencagedata.com/geocode/v1/json?q={place}, India&key={OPENCAGE_API_KEY}"
        res = requests.get(url).json()

        if res["results"]:
            g = res["results"][0]["geometry"]
            return g["lat"], g["lng"]

    except:
        pass

    return None, None


def get_coordinates_from_text(text):
    try:
        print("INPUT:", text)

        words = re.findall(r'\b[a-zA-Z]+\b', text.lower())
        stopwords = {
            "going", "to", "visit", "travel", "traveling", "in", "at",
            "the", "a", "is", "am", "are", "tomorrow", "today", "tonight", "now"
        }
        filtered = [w for w in words if w not in stopwords]

        if not filtered:
            return None, None, None

        location_word = filtered[-1]
        print("EXTRACTED:", location_word)

        url = f"https://api.opencagedata.com/geocode/v1/json?q={location_word}, India&key={OPENCAGE_API_KEY}"
        res = requests.get(url).json()

        print("API RESPONSE:", res)

        if not res.get("results"):
            return None, None, None

        for result in res["results"]:
            comp = result.get("components", {})
            if comp.get("country") != "India":
                continue
            lat = result["geometry"]["lat"]
            lon = result["geometry"]["lng"]
            name = result.get("formatted", "Unknown")
            return lat, lon, name

        best = res["results"][0]
        return best["geometry"]["lat"], best["geometry"]["lng"], best.get("formatted", "Unknown")

    except Exception as e:
        print("ERROR:", e)

    return None, None, None


def encode_state(state):
    return STATE_MAPPING.get(state, 0)

# ---------------- NEWS ----------------
last_fetch_time = None

def fetch_news():
    global last_fetch_time

    if last_fetch_time and datetime.utcnow() - last_fetch_time < timedelta(minutes=10):
        return

    url = (
        f"https://newsapi.org/v2/everything"
        f"?q=(harassment OR assault OR rape) AND India"
        f"&sortBy=publishedAt&pageSize=10&apiKey={NEWS_API_KEY}"
    )
    data = requests.get(url).json()

    for article in data.get("articles", []):
        title = article.get("title", "")
        desc = article.get("description", "")
        text = title + " " + desc

        words = re.findall(r'\b[a-zA-Z]+\b', text.lower())
        stopwords = {"man", "woman", "incident", "case", "police", "arrested", "assault"}
        candidates = [w for w in words if w not in stopwords]

        if not candidates:
            continue

        location_word = candidates[-1]
        lat, lon = get_coordinates(location_word)

        if lat is None:
            continue

        try:
            cursor.execute(
                "INSERT INTO events (lat, lon, timestamp, source) VALUES (?, ?, ?, ?)",
                (lat, lon, datetime.utcnow().isoformat(), "news")
            )
        except Exception as e:
            print("DB ERROR:", e)

    conn.commit()
    last_fetch_time = datetime.utcnow()

# ---------------- DISTANCE ----------------
def distance(lat1, lon1, lat2, lon2):
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) *
         math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

# ---------------- LAYERS ----------------
def get_layers(user_lat, user_lon):
    now = datetime.utcnow()
    r_cut = now - timedelta(hours=6)
    m_cut = now - timedelta(hours=24)

    r = m = o = 0

    cursor.execute("SELECT lat, lon, timestamp FROM events")
    for lat, lon, ts in cursor.fetchall():
        ts = datetime.fromisoformat(ts)
        if distance(user_lat, user_lon, lat, lon) < 20:
            if ts > r_cut:
                r += 1
            elif ts > m_cut:
                m += 1
            else:
                o += 1

    cursor.execute("SELECT lat, lon, category, timestamp FROM user_reports")
    for lat, lon, category, ts in cursor.fetchall():
        ts = datetime.fromisoformat(ts)
        if distance(user_lat, user_lon, lat, lon) < 20:
            if ts > r_cut:
                weight = CATEGORY_WEIGHTS.get(category, 1)
                r += weight
            elif ts > m_cut:
                m += 2
            else:
                o += 1

    return r, m, o

# ---------------- MODEL ----------------
def get_baseline(state):
    if state == "Unknown":
        return 0.3
    enc = encode_state(state)
    pend = pendency_map.get(state, 1000)
    return float(model.predict([[enc, 2024, pend]])[0])

# ---------------- COMPUTE ----------------
def compute(lat, lon):
    state = get_state(lat, lon)
    baseline = get_baseline(state)
    r, m, o = get_layers(lat, lon)
    realtime = min(math.log1p(r) / 3, 1)
    final = 0.4 * baseline + 0.5 * realtime + 0.1 * (m / 5)
    return float(final), state, r, m, o

# ---------------- ENDPOINTS ----------------
@app.post("/smart_risk")
def smart_risk(user_input: str):
    lat, lon, location_name = get_coordinates_from_text(user_input)

    if not lat:
        return {"error": "Could not detect location"}

    fetch_news()

    score, state, r, m, o = compute(lat, lon)

    return {
        "input": user_input,
        "detected_location": location_name,
        "coordinates": {"lat": lat, "lon": lon},
        "state_used": state,
        "risk_score": round(score, 2),
        "recent": r,
        "mid": m,
        "old": o,
        "message": "High risk" if score > 0.7 else "Moderate" if score > 0.3 else "Low"
    }

@app.get("/")
def home():
    return {"status": "PREDICTION SERVICE READY"}
