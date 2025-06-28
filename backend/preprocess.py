import pandas as pd
import json
import pickle
import os
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# --------------------- Load Datasets ---------------------

print("📥 Loading datasets...")

data_path = "data"

symptom_df = pd.read_csv(os.path.join(data_path, "disease_symptoms.csv"), encoding="ISO-8859-1")
precaution_df = pd.read_csv(os.path.join(data_path, "disease_precaution.csv"), encoding="ISO-8859-1")
risk_df = pd.read_csv(os.path.join(data_path, "disease_riskFactors.csv"), encoding="ISO-8859-1")
medicine_df = pd.read_csv(os.path.join(data_path, "disease_medicine.csv"), encoding="ISO-8859-1")

print("✅ Datasets loaded successfully!")

# --------------------- Analyze Disease Distribution ---------------------

print("\n🔍 Disease distribution in dataset:")
print(symptom_df["Disease"].value_counts())

# --------------------- Prepare Symptom Dataset ---------------------

print("\n🧹 Cleaning and encoding symptoms...")

symptom_df.fillna('', inplace=True)

all_symptoms = set()
for i in range(len(symptom_df)):
    for j in range(1, len(symptom_df.columns)):
        symptom = str(symptom_df.iloc[i, j]).strip().lower()
        if symptom:
            all_symptoms.add(symptom)

all_symptoms = sorted(list(all_symptoms))
print(f"🧠 Total unique symptoms: {len(all_symptoms)}")

X = []
for i in range(len(symptom_df)):
    row_symptoms = [str(symptom_df.iloc[i, j]).strip().lower() for j in range(1, len(symptom_df.columns))]
    symptom_vector = [1 if symptom in row_symptoms else 0 for symptom in all_symptoms]
    X.append(symptom_vector)

X = pd.DataFrame(X, columns=all_symptoms)
y = symptom_df["Disease"]

# --------------------- Encode Target ---------------------

print("🔐 Encoding target labels...")
le = LabelEncoder()
y_encoded = le.fit_transform(y)
print(f"🧬 Total disease classes: {len(le.classes_)}")

# --------------------- Train-Test Split ---------------------

print("\n📊 Splitting dataset (80% train / 20% test)...")
X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

print(f"🧪 Training samples: {len(X_train)}, Testing samples: {len(X_test)}")

# --------------------- Train Model ---------------------

print("\n🚀 Training RandomForestClassifier model...")
clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train, y_train)

print("✅ Model training complete!")

# --------------------- Evaluate ---------------------

print("📈 Evaluating model on test set...")
y_pred = clf.predict(X_test)
acc = accuracy_score(y_test, y_pred)
print(f"🎯 Model Accuracy: {acc:.4f}")

# --------------------- Save Model ---------------------

print("\n💾 Saving model and metadata...")
os.makedirs("models", exist_ok=True)

with open("models/disease_model.pkl", "wb") as f:
    pickle.dump(clf, f)

metadata = {
    "symptoms": all_symptoms,
    "label_classes": le.classes_.tolist(),
    "accuracy": acc
}

with open("models/metadata.json", "w") as f:
    json.dump(metadata, f, indent=2)

print("✅ Model and metadata saved to 'models/'")

# --------------------- Build disease_info.json ---------------------

print("\n📦 Building combined disease info (precautions, risk factors, medicines)...")

# Precautions
precautions_map = {}
for _, row in precaution_df.iterrows():
    disease = row["Disease"]
    precautions = [str(row.get(f"Precaution_{i+1}", "")).strip() for i in range(4) if pd.notna(row.get(f"Precaution_{i+1}", ""))]
    precautions_map[disease] = precautions

# Risk factors
risk_map = {}
for _, row in risk_df.iterrows():
    disease = row["DNAME"]
    risk_factors = row["RISKFAC"].split(",")
    risk_map[disease] = [r.strip() for r in risk_factors]

# Medicines
medicine_map = {}
for _, row in medicine_df.iterrows():
    disease_id = row["Disease_ID"]
    match = risk_df[risk_df["DID"] == disease_id]
    if match.empty:
        continue
    disease_name = match["DNAME"].values[0]
    if disease_name not in medicine_map:
        medicine_map[disease_name] = []
    medicine_map[disease_name].append({
        "name": str(row["Medicine_Name"]),
        "composition": str(row["Medicine_Composition"]),
        "description": str(row["Medicine_Description"])
    })

# Combine all
disease_info = {}
for disease in le.classes_:
    disease_info[disease] = {
        "precautions": precautions_map.get(disease, []),
        "risk_factors": risk_map.get(disease, []),
        "medicines": medicine_map.get(disease, [])
    }

with open("models/disease_info.json", "w") as f:
    json.dump(disease_info, f, indent=2)

print("✅ All disease info saved to 'models/disease_info.json'")
