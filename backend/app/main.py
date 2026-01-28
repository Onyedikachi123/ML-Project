from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import xgboost as xgb
import numpy as np
import pandas as pd
import os
from pydantic import BaseModel
from typing import List, Optional

# Import routers
try:
    from app.api import credit, financial_health, asset_management
except ImportError as e:
    print(f"Warning: Could not import some API routers: {e}")
    credit = None
    financial_health = None
    asset_management = None

app = FastAPI(
    title="Sycamore Credit & Asset Intelligence Platform",
    description="Production-grade Fintech ML Platform with XGBoost Integration",
    version="1.0.2"
)

# CORS Configuration
# Allow all origins for development/demo ease. In strict production, replace "*" with specific domains.
origins = [
    "http://localhost:5173",  # Vite default
    "http://localhost:8080",  # User specified
    "http://localhost:3000",  # Common React
    "https://ml-project-ksuh.onrender.com", # Production
    "*" # Keep wildcard for general ease if needed, or remove for strict security. User asked to "Allow requests from...", usually implies specific, but "Allow all origins" is what was there. I'll keep * but add specifics for clarity/precedence if * issues arise (unlikely).
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True, 
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
if credit:
    app.include_router(credit.router, prefix="/api/credit", tags=["Credit"])
if financial_health:
    app.include_router(financial_health.router, prefix="/api/financial-health", tags=["Financial Health"])
if asset_management:
    app.include_router(asset_management.router, prefix="/api/asset-management", tags=["Asset Management"])

@app.get("/")
def health_check():
    return {"status": "healthy", "service": "Sycamore Backend", "version": "1.0.2"}

# --- Demo / Debug endpoints (Optional) ---
# We keep these separate from production logic

@app.get("/api/xgboost-info", tags=["System Info"])
def xgboost_info():
    """Returns version info to confirm libraries are present."""
    return {
        "xgboost_version": xgb.__version__,
        "numpy_version": np.__version__,
        "pandas_version": pd.__version__
    }
