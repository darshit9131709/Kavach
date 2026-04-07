import os
import re
import math
import sqlite3
import joblib
import requests
import feedparser
import pandas as pd
from datetime import datetime, timedelta
from fastapi import FastAPI
from apscheduler.schedulers.background import BackgroundScheduler
from dotenv import load_dotenv

load_dotenv()

# ---------------- CONFIG ----------------
NEWS_API_KEY     = os.getenv("NEWS_API_KEY")
OPENCAGE_API_KEY = os.getenv("OPENCAGE_API_KEY")
MODEL_PATH       = os.getenv("MODEL_PATH", "xgb_model.pkl")
CSV_PATH         = os.getenv("CSV_PATH", "RS_Session_266_AU_2030_1.csv")

app = FastAPI(title="Women Safety AI", version="2.0")
model = joblib.load(MODEL_PATH)

CATEGORY_WEIGHTS = {
    "harassment": 3,
    "assault":    5,
    "stalking":   4,
    "unsafe_area": 2
}

# IST = UTC + 5:30
IST_OFFSET = timedelta(hours=5, minutes=30)

# Night hours in IST (10 PM to 5 AM) → risk multiplier
NIGHT_MULTIPLIER = 1.5
EVENING_MULTIPLIER = 1.2   # 7 PM – 10 PM

# Known Indian cities and states for reliable location extraction from text
INDIAN_LOCATIONS = {
    "delhi", "mumbai", "bangalore", "bengaluru", "hyderabad", "ahmedabad",
    "chennai", "kolkata", "surat", "pune", "jaipur", "lucknow", "kanpur",
    "nagpur", "indore", "thane", "bhopal", "visakhapatnam", "patna",
    "vadodara", "ghaziabad", "ludhiana", "agra", "nashik", "faridabad",
    "meerut", "rajkot", "varanasi", "srinagar", "aurangabad", "dhanbad",
    "amritsar", "prayagraj", "allahabad", "ranchi", "howrah", "coimbatore",
    "jabalpur", "gwalior", "vijayawada", "jodhpur", "madurai", "raipur",
    "kota", "guwahati", "chandigarh", "solapur", "bareilly", "moradabad",
    "mysore", "mysuru", "gurugram", "gurgaon", "noida", "dehradun",
    "aligarh", "jalandhar", "tiruchirappalli", "bhubaneswar", "salem",
    "warangal", "guntur", "gorakhpur", "bikaner", "jamshedpur", "bhilai",
    "cuttack", "kochi", "ernakulam", "jammu", "mangalore", "mangaluru",
    "udaipur", "ujjain", "siliguri", "jhansi", "kolhapur", "ajmer",
    "nellore", "kakinada", "hubli", "dharwad", "belgaum", "belagavi",
    "shimla", "imphal", "shillong", "aizawl", "itanagar", "kohima",
    "panaji", "goa", "thiruvananthapuram", "trivandrum", "kozhikode",
    # states
    "maharashtra", "karnataka", "tamilnadu", "westbengal", "rajasthan",
    "gujarat", "uttarpradesh", "bihar", "madhyapradesh", "haryana",
    "punjab", "telangana", "andhra", "kerala", "odisha", "jharkhand",
    "assam", "chhattisgarh", "uttarakhand", "himachal"
}

# ---------------- LOAD CSV DATA ----------------
df = pd.read_csv(CSV_PATH).fillna(0)

pendency_map = {}
for _, row in df.iterrows():
    state = str(row.iloc[0]).strip()
    values = pd.to_numeric(row.iloc[1:], errors="coerce")
    pendency_map[state] = values.sum()

STATE_MAPPING = {state: i for i, state in enumerate(pendency_map.keys())}

# ---------------- DB ----------------
conn   = sqlite3.connect("events.db", check_same_thread=False)
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS events (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    lat       REAL,
    lon       REAL,
    timestamp TEXT,
    source    TEXT
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS user_reports (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    lat       REAL,
    lon       REAL,
    category  TEXT,
    timestamp TEXT
)
""")

conn.commit()

# ---------------- GEO ----------------
def get_state(lat, lon):
    try:
        url = (
            f"https://api.opencagedata.com/geocode/v1/json"
            f"?q={lat}+{lon}&key={OPENCAGE_API_KEY}"
        )
        res = requests.get(url, timeout=5).json()

        if res.get("results"):
            comp = res["results"][0]["components"]
            iso  = comp.get("ISO_3166-2")
            if iso:
                code = iso[0].split("-")[-1]
                state_map = {
                    "DL": "Delhi",           "MH": "Maharashtra",
                    "WB": "West Bengal",     "KA": "Karnataka",
                    "TN": "Tamil Nadu",      "UP": "Uttar Pradesh",
                    "BR": "Bihar",           "GJ": "Gujarat",
                    "RJ": "Rajasthan",       "MP": "Madhya Pradesh",
                    "HR": "Haryana",         "PB": "Punjab",
                    "TS": "Telangana",       "AP": "Andhra Pradesh",
                    "KL": "Kerala",          "OR": "Odisha",
                    "JH": "Jharkhand",       "AS": "Assam",
                    "CT": "Chhattisgarh",    "UK": "Uttarakhand",
                    "HP": "Himachal Pradesh","GA": "Goa",
                    "MN": "Manipur",         "ML": "Meghalaya",
                }
                return state_map.get(code, "Unknown")

    except Exception as e:
        print(f"[GEO ERROR] {e}")

    return "Unknown"


def get_coordinates(place):
    try:
        url = (
            f"https://api.opencagedata.com/geocode/v1/json"
            f"?q={place}, India&key={OPENCAGE_API_KEY}"
        )
        res = requests.get(url, timeout=5).json()

        if res.get("results"):
            g    = res["results"][0]["geometry"]
            name = res["results"][0].get("formatted", place)
            return g["lat"], g["lng"], name

    except Exception as e:
        print(f"[GEO ERROR] {e}")

    return None, None, None


def extract_indian_location(text):
    """
    Scans text for known Indian city/state names.
    Much more reliable than taking the last word.
    Returns the first known location found.
    """
    text_lower = text.lower()
    # remove punctuation
    text_clean = re.sub(r"[^a-z\s]", " ", text_lower)
    words = text_clean.split()

    # check single words
    for word in words:
        if word in INDIAN_LOCATIONS:
            return word

    # check two-word combos (e.g. "west bengal", "andhra pradesh")
    for i in range(len(words) - 1):
        pair = words[i] + " " + words[i + 1]
        if pair.replace(" ", "") in INDIAN_LOCATIONS or pair in INDIAN_LOCATIONS:
            return pair

    return None


def get_coordinates_from_text(text):
    """Extract location from free-text input and return coordinates."""
    location_word = extract_indian_location(text)

    if not location_word:
        # fallback: strip stopwords, take last meaningful word
        stopwords = {
            "going", "to", "visit", "travel", "traveling", "in", "at",
            "the", "a", "is", "am", "are", "tomorrow", "today", "tonight",
            "now", "i", "me", "we", "was", "were", "had", "has", "have"
        }
        words    = re.findall(r'\b[a-zA-Z]+\b', text.lower())
        filtered = [w for w in words if w not in stopwords]
        if not filtered:
            return None, None, None
        location_word = filtered[-1]

    print(f"[LOCATION] Extracted: {location_word}")

    lat, lon, name = get_coordinates(location_word)
    return lat, lon, name


def encode_state(state):
    return STATE_MAPPING.get(state, 0)

# ---------------- TIME OF DAY ----------------
def get_time_multiplier():
    """Returns a risk multiplier based on current IST time."""
    now_ist = datetime.utcnow() + IST_OFFSET
    hour    = now_ist.hour

    if 22 <= hour or hour < 5:   # 10 PM – 5 AM
        return NIGHT_MULTIPLIER, "Night hours (10 PM – 5 AM) — elevated risk"
    elif 19 <= hour < 22:        # 7 PM – 10 PM
        return EVENING_MULTIPLIER, "Evening hours (7 PM – 10 PM) — slightly elevated risk"
    else:
        return 1.0, "Daytime — normal risk"

# ---------------- NEWS ----------------
NEWSAPI_URL = (
    f"https://newsapi.org/v2/everything"
    f"?q=(harassment OR assault OR rape OR stalking) AND India"
    f"&sortBy=publishedAt&pageSize=20&apiKey={NEWS_API_KEY}"
)

GOOGLE_NEWS_RSS = (
    "https://news.google.com/rss/search"
    "?q=crime+women+India+harassment+assault&hl=en-IN&gl=IN&ceid=IN:en"
)


def _store_event(lat, lon, source):
    try:
        cursor.execute(
            "INSERT INTO events (lat, lon, timestamp, source) VALUES (?, ?, ?, ?)",
            (lat, lon, datetime.utcnow().isoformat(), source)
        )
    except Exception as e:
        print(f"[DB ERROR] {e}")


def fetch_news():
    """Fetches from NewsAPI + Google News RSS and stores geolocated events."""
    articles = []

    # --- NewsAPI ---
    try:
        data = requests.get(NEWSAPI_URL, timeout=10).json()
        for a in data.get("articles", []):
            title = a.get("title", "") or ""
            desc  = a.get("description", "") or ""
            articles.append(title + " " + desc)
    except Exception as e:
        print(f"[NEWSAPI ERROR] {e}")

    # --- Google News RSS ---
    try:
        feed = feedparser.parse(GOOGLE_NEWS_RSS)
        for entry in feed.entries:
            articles.append(entry.get("title", "") + " " + entry.get("summary", ""))
    except Exception as e:
        print(f"[RSS ERROR] {e}")

    stored = 0
    for text in articles:
        location = extract_indian_location(text)
        if not location:
            continue

        lat, lon, _ = get_coordinates(location)
        if lat is None:
            continue

        _store_event(lat, lon, "news")
        stored += 1

    conn.commit()
    print(f"[NEWS] Fetched {len(articles)} articles → stored {stored} events")


# Run news fetch every 5 minutes in the background
scheduler = BackgroundScheduler()
scheduler.add_job(fetch_news, "interval", minutes=5, id="news_fetch")
scheduler.start()

# Fetch news immediately on startup
@app.on_event("startup")
async def startup_event():
    import threading
    threading.Thread(target=fetch_news, daemon=True).start()

# ---------------- DISTANCE ----------------
def haversine(lat1, lon1, lat2, lon2):
    R    = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a    = (math.sin(dlat / 2) ** 2 +
            math.cos(math.radians(lat1)) *
            math.cos(math.radians(lat2)) *
            math.sin(dlon / 2) ** 2)
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

# ---------------- DECAY ----------------
def time_decay(ts: datetime, half_life_hours=12):
    """
    Exponential decay: a report loses half its weight every `half_life_hours`.
    After 24h → 25% weight. After 48h → 6% weight.
    """
    age_hours = (datetime.utcnow() - ts).total_seconds() / 3600
    return math.exp(-0.693 * age_hours / half_life_hours)

# ---------------- LAYERS ----------------
def get_layers(user_lat, user_lon, radius_km=20):
    """
    Returns weighted incident counts within radius_km of user.
    Applies exponential decay so recent events matter much more.
    """
    now   = datetime.utcnow()
    r_cut = now - timedelta(hours=6)
    m_cut = now - timedelta(hours=24)

    r = m = o = 0.0
    news_count = report_count = 0

    # --- news/auto events ---
    cursor.execute("SELECT lat, lon, timestamp FROM events")
    for lat, lon, ts_str in cursor.fetchall():
        ts = datetime.fromisoformat(ts_str)
        if haversine(user_lat, user_lon, lat, lon) > radius_km:
            continue
        decay = time_decay(ts)
        if ts > r_cut:
            r += 1.0 * decay
            news_count += 1
        elif ts > m_cut:
            m += 1.0 * decay
        else:
            o += 0.5 * decay

    # --- user reports (weighted by category + decay) ---
    cursor.execute("SELECT lat, lon, category, timestamp FROM user_reports")
    for lat, lon, category, ts_str in cursor.fetchall():
        ts = datetime.fromisoformat(ts_str)
        if haversine(user_lat, user_lon, lat, lon) > radius_km:
            continue
        weight = CATEGORY_WEIGHTS.get(category, 1)
        decay  = time_decay(ts, half_life_hours=6)   # reports decay faster
        if ts > r_cut:
            r += weight * decay
            report_count += 1
        elif ts > m_cut:
            m += weight * decay
        else:
            o += (weight * 0.3) * decay

    return r, m, o, news_count, report_count

# ---------------- BASELINE ----------------
# NCRB 2022 state-level risk scores normalized to [0, 1]
# Source: National Crime Records Bureau — crimes against women per lakh population
NCRB_STATE_RISK = {
    "Rajasthan":        0.95,
    "Uttar Pradesh":    0.90,
    "Haryana":          0.85,
    "Delhi":            0.83,
    "Madhya Pradesh":   0.80,
    "Odisha":           0.72,
    "Bihar":            0.68,
    "Jharkhand":        0.65,
    "Chhattisgarh":     0.63,
    "Assam":            0.60,
    "West Bengal":      0.55,
    "Telangana":        0.50,
    "Andhra Pradesh":   0.47,
    "Maharashtra":      0.45,
    "Karnataka":        0.40,
    "Gujarat":          0.38,
    "Punjab":           0.35,
    "Uttarakhand":      0.33,
    "Himachal Pradesh": 0.25,
    "Tamil Nadu":       0.30,
    "Kerala":           0.28,
    "Goa":              0.20,
}

def get_baseline(state):
    if state == "Unknown":
        return 0.4
    # Use NCRB lookup first (reliable), fall back to model
    if state in NCRB_STATE_RISK:
        return NCRB_STATE_RISK[state]
    enc  = encode_state(state)
    pend = pendency_map.get(state, 1000)
    raw  = float(model.predict([[enc, 2024, pend]])[0])
    return min(max(raw, 0.1), 1.0)

# ---------------- COMPUTE ----------------
def compute(lat, lon):
    state    = get_state(lat, lon)
    baseline = get_baseline(state)

    r, m, o, news_count, report_count = get_layers(lat, lon)

    realtime = min(math.log1p(r) / 3, 1.0)
    mid      = min(m / 10, 1.0)
    score    = 0.4 * baseline + 0.5 * realtime + 0.1 * mid

    time_mult, time_label = get_time_multiplier()
    score = min(score * time_mult, 1.0)

    return score, state, baseline, realtime, mid, r, m, o, news_count, report_count, time_label

# ---------------- SAFETY ADVICE ----------------
def get_advice(score):
    if score > 0.7:
        return [
            "Avoid this area if possible",
            "Share your live location with someone you trust",
            "Stay in well-lit, crowded places",
            "Keep emergency contacts ready (112, 1091)"
        ]
    elif score > 0.4:
        return [
            "Stay alert and aware of your surroundings",
            "Prefer travelling with company",
            "Keep your phone charged",
            "Note nearby police stations or safe spaces"
        ]
    else:
        return [
            "Area appears relatively safe",
            "Stay aware as always",
            "Trust your instincts"
        ]

# ---------------- ENDPOINTS ----------------
@app.post("/smart_risk")
def smart_risk(user_input: str):
    """
    Main endpoint. Takes free-text like 'going to CP Delhi tonight'
    and returns a detailed risk assessment.
    """
    lat, lon, location_name = get_coordinates_from_text(user_input)

    if not lat:
        return {
            "error": "Could not detect a known Indian location in your input",
            "tip": "Try being specific, e.g. 'Lajpat Nagar Delhi' or 'MG Road Bangalore'"
        }

    (score, state, baseline, realtime, mid,
     r, m, o, news_count, report_count, time_label) = compute(lat, lon)

    risk_level = "High" if score > 0.7 else "Moderate" if score > 0.4 else "Low"

    return {
        "input":              user_input,
        "detected_location":  location_name,
        "coordinates":        {"lat": lat, "lon": lon},
        "state":              state,
        "risk_score":         round(score, 2),
        "risk_level":         risk_level,
        "time_context":       time_label,
        "breakdown": {
            "historical_baseline": round(baseline, 2),
            "realtime_signal":     round(realtime, 2),
            "mid_term_signal":     round(mid, 2)
        },
        "nearby_incidents": {
            "last_6_hours":  round(r, 1),
            "last_24_hours": round(m, 1),
            "older":         round(o, 1),
            "news_events":   news_count,
            "user_reports":  report_count
        },
        "safety_advice": get_advice(score),
        "emergency":     {"police": "100", "women_helpline": "1091", "emergency": "112"}
    }


@app.post("/report")
def report(user_input: str, category: str):
    """
    Victim reports an incident via free-text.
    category: harassment | assault | stalking | unsafe_area
    """
    if category not in CATEGORY_WEIGHTS:
        return {"error": f"Invalid category. Choose from: {list(CATEGORY_WEIGHTS.keys())}"}

    lat, lon, location_name = get_coordinates_from_text(user_input)

    if not lat or location_name == "India":
        return {
            "status":  "need_location",
            "message": "Could not detect location. Please mention a specific place like 'Lajpat Nagar' or 'Sector 18 Noida'"
        }

    cursor.execute(
        "INSERT INTO user_reports VALUES (NULL, ?, ?, ?, ?)",
        (lat, lon, category, datetime.utcnow().isoformat())
    )
    conn.commit()

    return {
        "status":   "reported",
        "location": location_name,
        "category": category,
        "message":  "Thank you for reporting. Your report helps keep others safe.",
        "support":  {"women_helpline": "1091", "emergency": "112"}
    }


@app.post("/report_location")
def report_location(location: str, category: str):
    """
    Follow-up when location was not auto-detected.
    Victim provides the location explicitly.
    """
    if category not in CATEGORY_WEIGHTS:
        return {"error": f"Invalid category. Choose from: {list(CATEGORY_WEIGHTS.keys())}"}

    lat, lon, location_name = get_coordinates(location)

    if not lat:
        return {"error": "Could not find this location. Please try a nearby landmark or area name."}

    cursor.execute(
        "INSERT INTO user_reports VALUES (NULL, ?, ?, ?, ?)",
        (lat, lon, category, datetime.utcnow().isoformat())
    )
    conn.commit()

    return {
        "status":   "reported",
        "location": location_name,
        "category": category,
        "message":  "Thank you for reporting. Your report helps keep others safe.",
        "support":  {"women_helpline": "1091", "emergency": "112"}
    }


@app.post("/sos")
def sos_trigger():
    """
    Called automatically when the SOS hand gesture is held for 3 seconds.
    Logs the SOS event with timestamp. No location required — triggered by gesture.
    """
    cursor.execute(
        "INSERT INTO user_reports VALUES (NULL, NULL, NULL, ?, ?)",
        ("sos", datetime.utcnow().isoformat())
    )
    conn.commit()

    return {
        "status":    "sos_received",
        "timestamp": datetime.utcnow().isoformat(),
        "message":   "SOS alert received. Stay safe.",
        "emergency": {"police": "100", "women_helpline": "1091", "emergency": "112"}
    }


@app.get("/")
def home():
    return {
        "service": "Women Safety AI",
        "version": "2.0",
        "status":  "running",
        "endpoints": {
            "POST /smart_risk":      "Get risk assessment for a location",
            "POST /report":          "Report an incident via free text",
            "POST /report_location": "Report with explicit location name",
            "POST /sos":             "Triggered by SOS hand gesture"
        }
    }
