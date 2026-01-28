from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import xgboost as xgb
import numpy as np
import pandas as pd
import logging

# Configure logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create App
app = FastAPI(
    title="Sycamore Credit & Asset Intelligence Platform",
    description="Production-grade Fintech ML Platform with XGBoost Integration",
    version="1.0.3"
)

# CORS Configuration
origins = [
    "http://localhost:5173",  # Vite default
    "http://localhost:8080",
    "http://localhost:3000",
    "https://ml-project-ksuh.onrender.com",
    # Add other domains as needed
    "*" # Allow all for now as requested by user or checking previous config
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True, 
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import Routers
# We import explicitly. If other modules are broken, we want to know, 
# but for production stability of the CREDIT endpoint, we could wrap others.
# However, standard practice is to fix the code, not suppress import errors.
try:
    from app.api import credit
    app.include_router(credit.router, prefix="/api/credit", tags=["Credit"])
except ImportError as e:
    logger.critical(f"Failed to import Credit router: {e}")
    # We don't exit, but the main feature will be missing.

try:
    from app.api import financial_health
    app.include_router(financial_health.router, prefix="/api/financial-health", tags=["Financial Health"])
except ImportError as e:
    logger.warning(f"Failed to import Financial Health router: {e}")

try:
    from app.api import asset_management
    app.include_router(asset_management.router, prefix="/api/asset-management", tags=["Asset Management"])
except ImportError as e:
    logger.warning(f"Failed to import Asset Management router: {e}")

@app.get("/")
def health_check():
    return {"status": "healthy", "service": "Sycamore Backend", "version": "1.0.3"}

@app.get("/health")
def health_check_std():
    return {"status": "ok"}

@app.get("/api/system-info", tags=["System Info"])
def system_info():
    """Returns version info to confirm libraries are present."""
    return {
        "xgboost_version": xgb.__version__,
        "numpy_version": np.__version__,
        "pandas_version": pd.__version__
    }
