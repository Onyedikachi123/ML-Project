import logging
from fastapi import APIRouter, HTTPException
from app.schemas.credit import CreditScoreRequest
from app.services.scoring import scoring_service

# Configure logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/score")
def get_credit_score(request: CreditScoreRequest):
    """
    Calculate credit score based on user input.
    """
    try:
        # Pydantic has already validated and computed features (in schema)
        logger.info("Received credit score request.")
        data = request.dict()
        
        try:
            result = scoring_service.predict_credit_score(data)
            return result
        except ValueError as ve:
             logger.error(f"Validation Error: {ve}")
             raise HTTPException(status_code=422, detail=str(ve))
        except RuntimeError as re:
             logger.error(f"Runtime Error: {re}")
             raise HTTPException(status_code=500, detail=str(re))
             
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Unexpected error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal Server Error")
