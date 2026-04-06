import requests
import sqlite3
import re
from fastapi import FastAPI
from datetime import datetime

# ---------------- CONFIG ----------------
OPENCAGE_API_KEY = "c537640d1b7f4107b75b915f8773b080"

app = FastAPI()

# ---------------- DB ----------------
conn = sqlite3.connect("events.db", check_same_thread=False)
cursor = conn.cursor()

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
def get_coordinates(place):
    try:
        url = f"https://api.opencagedata.com/geocode/v1/json?q={place}, India&key={OPENCAGE_API_KEY}"
        res = requests.get(url).json()

        if res["results"]:
            g = res["results"][0]["geometry"]
            name = res["results"][0].get("formatted", place)
            return g["lat"], g["lng"], name

    except Exception as e:
        print("Geo error:", e)

    return None, None, None


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

# ---------------- ENDPOINTS ----------------
@app.post("/report_from_text")
def report_from_text(user_input: str, category: str):
    """
    Victim submits a free-text description of an incident.
    The location is extracted automatically from the text.
    If the location is unclear, a follow-up is requested.

    category: one of harassment | assault | stalking | unsafe_area
    """
    lat, lon, location_name = get_coordinates_from_text(user_input)

    if not lat or location_name == "India":
        return {
            "status": "need_location",
            "message": "Please specify where this happened (e.g., 'Patna', 'Delhi')"
        }

    cursor.execute(
        "INSERT INTO user_reports VALUES (NULL, ?, ?, ?, ?)",
        (lat, lon, category, datetime.utcnow().isoformat())
    )
    conn.commit()

    return {
        "status": "report_added",
        "location": location_name,
        "category": category
    }


@app.post("/report_followup")
def report_followup(location: str, category: str):
    """
    Follow-up endpoint when the location could not be auto-detected
    from the initial free-text report. The victim explicitly provides
    the location name here.

    category: one of harassment | assault | stalking | unsafe_area
    """
    lat, lon, location_name = get_coordinates(location)

    if not lat:
        return {"error": "Invalid location, please try again"}

    cursor.execute(
        "INSERT INTO user_reports VALUES (NULL, ?, ?, ?, ?)",
        (lat, lon, category, datetime.utcnow().isoformat())
    )
    conn.commit()

    return {
        "status": "report_added",
        "location": location_name,
        "category": category
    }


@app.get("/")
def home():
    return {"status": "REPORT SERVICE READY"}
