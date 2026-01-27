from pydantic import BaseModel
from typing import Optional

class AssetManagementRequest(BaseModel):
    # Required inputs for Logic
    financial_health_score: float
    credit_score: float
    risk_tier: str  # Encoded? Prompt says encoded, might mean High/Med/Low or 0/1/2. Logic uses High/Med/Low.
    
    # Raw profile needed for logic
    LIMIT_BAL: float
    AGE: int
    
    # Optional logic if we want to re-verify
    # But for this endpoint, these are sufficient per prompt instructions.
