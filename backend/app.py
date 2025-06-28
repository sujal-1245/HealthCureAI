from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import pandas as pd

app = FastAPI(title="Symptom-Based Disease Predictor")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------ Load Dataset ------------------

print("📥 Loading dataset...")
df = pd.read_csv("data/disease_symptoms_with_severity.csv")

disease_symptom_map = {}
print("🔄 Mapping symptoms with severity...")
for _, row in df.iterrows():
    disease = row["Disease"].strip()
    symptoms = []
    for col in row.index[1:]:
        val = row[col]
        if pd.notna(val) and ":" in val:
            symptom, severity = val.strip().split(":")
            symptoms.append((symptom.strip().lower(), int(severity)))
    disease_symptom_map[disease] = symptoms

all_symptoms = sorted(
    {symptom for symptoms in disease_symptom_map.values() for symptom, _ in symptoms}
)
print(f"✅ Loaded {len(disease_symptom_map)} diseases with {len(all_symptoms)} unique symptoms.")

# ------------------ Models ------------------

class SymptomSeverity(BaseModel):
    symptom: str
    severity: int  # 1 = mild, 2 = severe

class SymptomRequest(BaseModel):
    symptoms: List[SymptomSeverity]

# ------------------ Routes ------------------

@app.get("/")
def root():
    return {"message": "Symptom-based disease prediction API is running."}

@app.get("/symptoms")
def get_all_symptoms():
    print("🧾 /symptoms called")
    return {"symptoms": all_symptoms}

@app.post("/predict")
def predict_disease(data: SymptomRequest):
    print(f"🔍 /predict called with: {[s.dict() for s in data.symptoms]}")

    input_symptoms = {s.symptom.strip().lower(): s.severity for s in data.symptoms}
    best_match = None
    max_score = 0
    matched_symptoms = []

    for disease, symptoms in disease_symptom_map.items():
        score = 0
        current_matched = []
        for symptom, severity in symptoms:
            if symptom in input_symptoms and input_symptoms[symptom] >= severity:
                score += 1
                current_matched.append(symptom)
        if score > max_score:
            max_score = score
            best_match = disease
            matched_symptoms = current_matched

    if not best_match or max_score == 0:
        print("❌ No matching disease found.")
        return {"match": None, "message": "No matching disease found."}

    print(f"✅ Predicted disease: {best_match} (matched score: {max_score})")

    # Extend with more CSVs if available for medicines, precautions, etc.
    return {
        "predicted_disease": best_match,
        "matched_score": max_score,
        "total_symptoms_considered": len(input_symptoms),
        "matched_symptoms": matched_symptoms,
        "precautions": [],
        "risk_factors": [],
        "medicines": []
    }

@app.on_event("startup")
def startup_event():
    print("\n🚀 FastAPI is ready!")
    print("🔗 http://127.0.0.1:8000/")
    print("🧪 POST http://127.0.0.1:8000/predict")

