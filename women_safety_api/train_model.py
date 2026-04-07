import os
import shutil
import pandas as pd
import kagglehub
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
import joblib

# ---------------- STEP 1: DOWNLOAD DATASET ----------------

print("Downloading dataset...")

path = kagglehub.dataset_download(
    "harigoshika/crimes-against-women-in-india-a-20-year-analysis"
)

print("Downloaded to:", path)

# ---------------- STEP 2: MOVE TO D DRIVE ----------------

d_drive_path = "D:/women_safety_dataset"

if not os.path.exists(d_drive_path):
    os.makedirs(d_drive_path)

# copy files
for file in os.listdir(path):
    src = os.path.join(path, file)
    dst = os.path.join(d_drive_path, file)
    shutil.copy(src, dst)

print("Dataset moved to:", d_drive_path)

# ---------------- STEP 3: LOAD CSV ----------------

csv_file = None

for file in os.listdir(d_drive_path):
    if file.endswith(".csv"):
        csv_file = os.path.join(d_drive_path, file)
        break

if csv_file is None:
    raise Exception("CSV file not found!")

print("Loading CSV:", csv_file)

df = pd.read_csv(csv_file)

print("Columns:", df.columns)

# ---------------- STEP 4: CLEAN + FEATURE ENGINEERING ----------------

# Fill missing values
df = df.fillna(0)

# Create total crime column
crime_columns = df.columns[2:]  # assuming first two are State & Year
df["total_crime"] = df[crime_columns].sum(axis=1)

# Normalize to risk score
df["risk_score"] = df["total_crime"] / df["total_crime"].max()

# Encode State (convert to numbers)
df["State_encoded"] = df["State"].astype("category").cat.codes

# ---------------- STEP 5: PREPARE DATA ----------------

X = df[["State_encoded", "Year", "total_crime"]]
y = df["risk_score"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ---------------- STEP 6: TRAIN XGBOOST ----------------

print("Training XGBoost model...")

model = XGBRegressor(
    n_estimators=200,
    learning_rate=0.1,
    max_depth=5,
    random_state=42
)

model.fit(X_train, y_train)

# ---------------- STEP 7: EVALUATE ----------------

preds = model.predict(X_test)

mse = mean_squared_error(y_test, preds)
print("MSE:", mse)

# ---------------- STEP 8: SAVE MODEL ----------------

model_path = "D:/women_safety_dataset/xgb_model.pkl"
joblib.dump(model, model_path)

print("Model saved at:", model_path)

# ---------------- DONE ----------------
print("Training complete.")