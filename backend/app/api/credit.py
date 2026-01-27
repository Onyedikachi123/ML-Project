from fastapi import APIRouter
from app.schemas.credit import CreditScoreRequest
from app.services.scoring import scoring_service

router = APIRouter()

@router.post("/score")
def get_credit_score(request: CreditScoreRequest):
    data = request.dict()
    result = scoring_service.predict_credit_score(data)
    # Filter out internal keys
    if "_derived_features" in result:
        del result["_derived_features"]
    
    # Add currency metadata
    result["currency"] = "NGN"
    return result
