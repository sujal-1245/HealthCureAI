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

# ------------------ Load Datasets ------------------

print("📥 Loading datasets...")
df = pd.read_csv("data/disease_symptoms_with_severity.csv", encoding="ISO-8859-1")
precaution_df = pd.read_csv("data/disease_precaution.csv", encoding="ISO-8859-1")
risk_df = pd.read_csv("data/disease_riskFactors.csv", encoding="ISO-8859-1")
medicine_df = pd.read_csv("data/disease_medicine.csv", encoding="ISO-8859-1")

# Ensure Disease_ID in medicine_df and risk_df is string and strip spaces
medicine_df["Disease_ID"] = medicine_df["Disease_ID"].astype(str).str.strip()
risk_df["Disease_ID"] = risk_df["Disease_ID"].astype(str).str.strip()

# Build symptom map
disease_symptom_map = {}
for _, row in df.iterrows():
    disease = row["Disease"].strip()
    symptoms = []
    for col in row.index[1:]:
        val = row[col]
        if pd.notna(val) and ":" in val:
            symptom, severity = val.strip().split(":")
            symptoms.append((symptom.strip().lower(), int(severity)))
    disease_symptom_map[disease] = symptoms

# Unique symptoms list
all_symptoms = sorted({symptom for symptoms in disease_symptom_map.values() for symptom, _ in symptoms})

# ------------------ Models ------------------

class SymptomSeverity(BaseModel):
    symptom: str
    severity: int

class SymptomRequest(BaseModel):
    symptoms: List[SymptomSeverity]

# ------------------ Routes ------------------

@app.get("/")
def root():
    return {"message": "Symptom-based disease prediction API is running."}

@app.get("/symptoms")
def get_all_symptoms():
    print("📡 '/symptoms' route hit")
    return {"symptoms": all_symptoms}

@app.post("/predict")
def predict_disease(data: SymptomRequest):
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
        return {"match": None, "message": "No matching disease found."}

    # Get precautions
    precautions_row = precaution_df[precaution_df["Disease"].str.lower() == best_match.lower()]
    precautions = []
    if not precautions_row.empty:
        for i in range(1, 5):
            prec = precautions_row.iloc[0].get(f"Precaution_{i}", "")
            if pd.notna(prec) and prec.strip():
                precautions.append(prec.strip())

    # Get risk factors and Disease_ID
    risk_row = risk_df[risk_df["Disease"].str.lower() == best_match.lower()]
    risk_factors = []
    disease_id = None
    if not risk_row.empty:
        disease_id = str(risk_row.iloc[0]["Disease_ID"]).strip()
        raw_risk = risk_row.iloc[0]["RISKFAC"]
        if pd.notna(raw_risk):
            risk_factors = [r.strip() for r in raw_risk.split(",") if r.strip()]

    # Get medicines using Disease_ID from risk_df
    medicines = []
    if disease_id:
        related_meds = medicine_df[medicine_df["Disease_ID"] == disease_id]
        for _, med in related_meds.iterrows():
            if pd.notna(med["Medicine_Name"]):
                medicines.append({
                    "name": str(med["Medicine_Name"]).strip(),
                    "composition": str(med["Medicine_Composition"]).strip(),
                    "description": str(med["Medicine_Description"]).strip()
                })

    return {
        "predicted_disease": best_match,
        "matched_score": max_score,
        "total_symptoms_considered": len(input_symptoms),
        "matched_symptoms": matched_symptoms,
        "precautions": precautions,
        "risk_factors": risk_factors,
        "medicines": medicines
    }

@app.on_event("startup")
def startup_event():
    print("🚀 FastAPI is ready at http://127.0.0.1:8000")
