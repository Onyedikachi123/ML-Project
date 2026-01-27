from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import xgboost as xgb
import numpy as np
import pandas as pd
import os
from pydantic import BaseModel
from typing import List, Optional

# Import existing routers if they exist/work, otherwise we can comment them out if they are broken
# relying on the user's existing imports from the read:
from app.api import credit, financial_health, asset_management

app = FastAPI(
    title="Sycamore Credit & Asset Intelligence Platform",
    description="Production-grade Fintech ML Platform with XGBoost Integration",
    version="1.0.1"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(credit.router, prefix="/api/credit", tags=["Credit"])
app.include_router(financial_health.router, prefix="/api/financial-health", tags=["Financial Health"])
app.include_router(asset_management.router, prefix="/api/asset-management", tags=["Asset Management"])

@app.get("/")
def health_check():
    return {"status": "healthy", "service": "Sycamore Backend", "version": "1.0.1"}

# --- XGBoost Demo Integration ---

class PredictionInput(BaseModel):
    features: List[float]

class PredictionOutput(BaseModel):
    prediction: float

# Placeholder for a loaded model
model = None

@app.on_event("startup")
def load_model():
    """
    On startup, we can verify XGBoost is working by training a dummy model 
    or loading one from disk.
    """
    global model
    try:
        # 1. verify we can import and use xgboost
        print("Verifying XGBoost installation...")
        
        # Create dummy data
        X = np.array([[1, 2], [3, 4], [5, 6], [7, 8]])
        y = np.array([0, 0, 1, 1])
        dtrain = xgb.DMatrix(X, label=y)
        
        # Train a dummy model
        params = {'objective': 'binary:logistic', 'eval_metric': 'logloss'}
        bst = xgb.train(params, dtrain, num_boost_round=5)
        
        # Set this as our global "model" for the demo
        model = bst
        print("XGBoost verification successful! Dummy model loaded.")
        
        # Save model to disk to prove we can (optional)
        model.save_model("model.json")
        
    except Exception as e:
        print(f"Error initializing XGBoost: {e}")
        # In a real app, you might want to raise error or just log it
        pass

@app.post("/api/predict-demo", response_model=PredictionOutput, tags=["Demo"])
def predict_demo(input_data: PredictionInput):
    """
    Sample prediction endpoint using the verified XGBoost model.
    Expects a list of features (must be length 2 for this dummy model).
    """
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    if len(input_data.features) != 2:
        raise HTTPException(status_code=400, detail="Dummy model expects exactly 2 features")
        
    try:
        data = np.array([input_data.features])
        dtest = xgb.DMatrix(data)
        prediction = model.predict(dtest)[0]
        return {"prediction": float(prediction)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/xgboost-info", tags=["Demo"])
def xgboost_info():
    """Returns version info to confirm libraries are present."""
    return {
        "xgboost_version": xgb.__version__,
        "numpy_version": np.__version__,
        "pandas_version": pd.__version__
    }
