import logging
import random
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
        # Iterate over the request model to get dict
        logger.info(f"Received credit score request. LIMIT_BAL: {request.LIMIT_BAL}, AGE: {request.AGE}")
        data = request.dict()
        
        try:
            # Attempt to use the real scoring service
            # The data is already validated and features computed by Pydantic schema
            result = scoring_service.predict_credit_score(data)
            
            # Filter out internal keys
            if "_derived_features" in result:
                del result["_derived_features"]
            
            # Add currency metadata if missing
            if "currency" not in result:
                result["currency"] = "NGN"
                
            return result
            
        except ValueError as ve:
             # Validation or Feature Alignment errors (Logic errors)
             logger.error(f"Validation Error in scoring service: {ve}")
             raise HTTPException(status_code=422, detail=f"Input Validation Error: {str(ve)}")
             
        except Exception as model_error:
            logger.error(f"Scoring service failed: {model_error}", exc_info=True)
            raise HTTPException(status_code=500, detail=f"Model Inference Failed: {str(model_error)}")

    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Critical error in credit scoring endpoint: {e}", exc_info=True)
        raise HTTPException(
            status_code=500, 
            detail=f"Internal Server Error: {str(e)}"
        )
