from fastapi import APIRouter
from app.schemas.credit import CreditScoreRequest
from app.services.scoring import scoring_service
from app.services.feature_engineering import compute_features
import pandas as pd

router = APIRouter()

@router.post("/score")
def get_financial_health_score(request: CreditScoreRequest):
    # Need derived features. 
    # Since we might not want to re-run the whole scoring pipeline, 
    # we can just use the feature engineering part.
    data = request.dict()
    df = pd.DataFrame([data])
    df_processed = compute_features(df)
    features = df_processed.iloc[0].to_dict()
    
    result = scoring_service.calculate_financial_health(features)
    return result
