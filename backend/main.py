from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
import json
import io

# ─── App Setup ───────────────────────────────────────────
app = FastAPI(
    title="ShopSense AI",
    description="Customer Purchase Behavior Prediction API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Load Model ──────────────────────────────────────────
try:
    model = joblib.load("model/model.pkl")
    scaler = joblib.load("model/preprocessor.pkl")
    with open("model/features.json", "r") as f:
        feature_names = json.load(f)
    print("✅ Model loaded successfully")
except Exception as e:
    print(f"❌ Error loading model: {e}")

# ─── Input Schema ────────────────────────────────────────
class CustomerData(BaseModel):
    Administrative: int = 0
    Administrative_Duration: float = 0.0
    Informational: int = 0
    Informational_Duration: float = 0.0
    ProductRelated: int = 0
    ProductRelated_Duration: float = 0.0
    BounceRates: float = 0.0
    ExitRates: float = 0.0
    PageValues: float = 0.0
    SpecialDay: float = 0.0
    Month: str = "Nov"
    OperatingSystems: int = 2
    Browser: int = 2
    Region: int = 1
    TrafficType: int = 2
    VisitorType: str = "Returning_Visitor"
    Weekend: bool = False

# ─── Helper: Encode Input ────────────────────────────────
MONTH_MAP = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3,
    'May': 4, 'June': 5, 'Jul': 6, 'Aug': 7,
    'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
}

VISITOR_MAP = {
    'New_Visitor': 0,
    'Other': 1,
    'Returning_Visitor': 2
}

def encode_input(data: dict) -> pd.DataFrame:
    data['Month'] = MONTH_MAP.get(data['Month'], 10)
    data['VisitorType'] = VISITOR_MAP.get(data['VisitorType'], 2)
    data['Weekend'] = int(data['Weekend'])
    df = pd.DataFrame([data])
    df = df[feature_names]
    return df

def get_risk_level(probability: float) -> dict:
    if probability >= 0.75:
        return {"level": "High", "color": "green", "message": "Very likely to purchase"}
    elif probability >= 0.50:
        return {"level": "Medium", "color": "yellow", "message": "Might purchase with nudge"}
    elif probability >= 0.25:
        return {"level": "Low", "color": "orange", "message": "Unlikely to purchase"}
    else:
        return {"level": "Very Low", "color": "red", "message": "Very likely to abandon"}

def get_recommendations(data: dict, probability: float) -> list:
    tips = []
    if data.get('BounceRates', 0) > 0.05:
        tips.append("🔴 High bounce rate — improve landing page content")
    if data.get('ExitRates', 0) > 0.05:
        tips.append("🔴 High exit rate — add exit-intent popups or offers")
    if data.get('PageValues', 0) < 10:
        tips.append("🟡 Low page value — highlight product benefits better")
    if data.get('ProductRelated_Duration', 0) > 1000:
        tips.append("🟢 Long product browsing — show a discount to convert")
    if data.get('SpecialDay', 0) > 0:
        tips.append("🟢 Near a special day — push a limited time offer")
    if not tips:
        tips.append("✅ Customer profile looks healthy")
    return tips

# ─── Routes ──────────────────────────────────────────────
@app.get("/")
def root():
    return {
        "message": "ShopSense AI API is running 🚀",
        "version": "1.0.0",
        "endpoints": ["/predict", "/predict-bulk", "/health", "/docs"]
    }

@app.get("/health")
def health():
    return {"status": "ok", "model": "Random Forest", "accuracy": "90.06%"}

@app.post("/predict")
def predict(customer: CustomerData):
    try:
        data = customer.dict()
        raw_data = data.copy()

        # Encode and scale
        df = encode_input(data)
        scaled = scaler.transform(df)

        # Predict
        prediction = int(model.predict(scaled)[0])
        probability = float(model.predict_proba(scaled)[0][1])

        risk = get_risk_level(probability)
        recommendations = get_recommendations(raw_data, probability)

        return {
            "prediction": prediction,
            "will_purchase": bool(prediction),
            "probability": round(probability * 100, 2),
            "risk": risk,
            "recommendations": recommendations,
            "summary": "Will Purchase ✅" if prediction else "Will Abandon ❌"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict-bulk")
async def predict_bulk(file: UploadFile = File(...)):
    try:
        # Read uploaded CSV
        contents = await file.read()
        df_upload = pd.read_csv(io.StringIO(contents.decode('utf-8')))

        results = []
        for _, row in df_upload.iterrows():
            try:
                data = row.to_dict()

                # Handle types
                for key in ['Administrative', 'Informational', 'ProductRelated',
                            'OperatingSystems', 'Browser', 'Region', 'TrafficType']:
                    if key in data:
                        data[key] = int(data[key])

                for key in ['Administrative_Duration', 'Informational_Duration',
                            'ProductRelated_Duration', 'BounceRates',
                            'ExitRates', 'PageValues', 'SpecialDay']:
                    if key in data:
                        data[key] = float(data[key])

                if 'Weekend' in data:
                    data['Weekend'] = bool(data['Weekend'])
                if 'Revenue' in data:
                    del data['Revenue']

                df_row = encode_input(data)
                scaled = scaler.transform(df_row)
                prediction = int(model.predict(scaled)[0])
                probability = float(model.predict_proba(scaled)[0][1])
                risk = get_risk_level(probability)

                results.append({
                    "row": len(results) + 1,
                    "will_purchase": bool(prediction),
                    "probability": round(probability * 100, 2),
                    "risk_level": risk["level"],
                    "message": risk["message"]
                })
            except Exception:
                results.append({
                    "row": len(results) + 1,
                    "error": "Could not process this row"
                })

        # Summary stats
        total = len(results)
        will_buy = sum(1 for r in results if r.get("will_purchase"))
        will_abandon = total - will_buy

        return {
            "total_customers": total,
            "will_purchase": will_buy,
            "will_abandon": will_abandon,
            "conversion_rate": round((will_buy / total) * 100, 2),
            "results": results
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))