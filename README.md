# Women Safety AI

A real-time danger prediction and incident reporting system for women's safety in India.

## What it does

- Predicts the **risk level of a location** using an XGBoost model trained on 20 years of crime data, live news, and crowd-sourced reports
- Lets **victims report incidents** via free-text or direct location input
- Risk score combines: historical crime pendency (CSV) + real-time news + user reports (weighted by category)

---

## Project Structure

```
women_safety_ai_new/
├── prediction_app.py   # Risk prediction service (port 8000)
├── report_app.py       # Victim reporting service (port 8001)
├── train_model.py      # XGBoost model training script
├── events.db           # Auto-created SQLite database
```

---

## Setup

### 1. Install dependencies

```bash
pip install fastapi uvicorn requests pandas joblib xgboost scikit-learn kagglehub feedparser
```

### 2. Train the model

```bash
python train_model.py
```

This downloads the Kaggle dataset, trains the XGBoost model, and saves it to `D:/women_safety_dataset/xgb_model.pkl`.

### 3. Update paths in `prediction_app.py`

```python
MODEL_PATH = "D:/women_safety_dataset/xgb_model.pkl"
CSV_PATH = r"D:\Downloads\RS_Session_266_AU_2030_1.csv"
```

Change these to match where the files are on your machine.

### 4. Run the services

```bash
uvicorn prediction_app:app --port 8000
uvicorn report_app:app --port 8001
```

---

## API Endpoints

### Prediction Service — `http://localhost:8000`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/smart_risk?user_input=going to Delhi` | Returns risk score for a location |

**Example response:**
```json
{
  "detected_location": "Delhi, India",
  "risk_score": 0.62,
  "message": "Moderate",
  "recent": 3,
  "mid": 1,
  "old": 0
}
```

### Report Service — `http://localhost:8001`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/report_from_text?user_input=felt unsafe near Patna&category=harassment` | Report via free text |
| POST | `/report_followup?location=Patna&category=stalking` | Report with explicit location |

**Categories:** `harassment`, `assault`, `stalking`, `unsafe_area`

---

## How the Risk Score Works

```
Risk Score = 0.4 × baseline + 0.5 × realtime + 0.1 × mid_term

baseline   → XGBoost prediction from historical crime data
realtime   → news events + weighted user reports (last 6 hours)
mid_term   → events from last 6–24 hours
```

User reports are weighted by severity:
- `assault` → 5
- `stalking` → 4
- `harassment` → 3
- `unsafe_area` → 2

---

## External APIs Used

| API | Purpose | Key required |
|-----|---------|--------------|
| [NewsAPI](https://newsapi.org) | Fetch real-time crime news | Yes (free tier) |
| [OpenCage Geocoding](https://opencagedata.com) | Convert place names to coordinates | Yes (free tier) |

---

## Dataset

- **Crime pendency data:** `RS_Session_266_AU_2030_1.csv` (Parliament dataset)
- **Training data:** [Crimes Against Women in India — 20 Year Analysis](https://www.kaggle.com/datasets/harigoshika/crimes-against-women-in-india-a-20-year-analysis) (auto-downloaded by `train_model.py`)

---

## Planned Improvements

- [ ] Time-of-day factor (higher risk at night)
- [ ] Background news refresh using APScheduler
- [ ] Google News RSS as additional data source
- [ ] Exponential decay on old reports
- [ ] Merge into single deployable service
