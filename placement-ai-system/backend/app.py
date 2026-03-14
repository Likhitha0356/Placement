from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI(
    title="Placement AI System",
    description="ML-based placement readiness prediction API",
    version="1.0.0",
)

# Allow placement-portal (and any origin in dev) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

clf = joblib.load("placement_classifier.pkl")
reg = joblib.load("placement_regressor.pkl")

READINESS_MAP = {0: "Low", 1: "Medium", 2: "High"}


def get_recommendations(readiness: str, probability: float) -> list:
    if readiness == "Low" or probability < 0.5:
        return [
            "Focus on improving aptitude and technical scores",
            "Participate in mock interviews regularly",
            "Solve more coding problems and build at least one project",
        ]
    if readiness == "Medium" or probability < 0.75:
        return [
            "Continue practicing DSA and system design basics",
            "Strengthen resume with quantifiable achievements",
            "Practice STAR method for behavioral rounds",
        ]
    return [
        "Maintain current performance level",
        "Target top-tier companies and advanced roles",
        "Prepare for system design and leadership discussions",
    ]


class Student(BaseModel):
    aptitude: int
    mock: int
    problems: int
    hackathons: int
    technical: int
    resume: int
    projects: int


@app.get("/")
def root():
    return {
        "service": "Placement AI System",
        "docs": "/docs",
        "predict": "POST /predict",
    }


@app.post("/predict")
def predict(student: Student):
    data = np.array([[
        student.aptitude,
        student.mock,
        student.problems,
        student.hackathons,
        student.technical,
        student.resume,
        student.projects,
    ]])
    readiness_class = int(clf.predict(data)[0])
    probability = float(reg.predict(data)[0])
    readiness_label = READINESS_MAP.get(readiness_class, "Medium")
    # Clamp probability to 0-1 for display
    probability = max(0.0, min(1.0, probability))
    recommendations = get_recommendations(readiness_label, probability)
    return {
        "readiness": readiness_label,
        "probability": round(probability, 2),
        "recommendations": recommendations,
    }