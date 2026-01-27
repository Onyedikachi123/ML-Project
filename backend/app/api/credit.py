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
        logger.info(f"Received credit score request. LIMIT_BAL: {request.LIMIT_BAL}, AGE: {request.AGE}")
        data = request.dict()
        
        try:
            # Attempt to use the real scoring service
            result = scoring_service.predict_credit_score(data)
            
            # Filter out internal keys
            if "_derived_features" in result:
                del result["_derived_features"]
            
            # Add currency metadata if missing
            if "currency" not in result:
                result["currency"] = "NGN"
                
            return result
            
        except ValueError as ve:
             # Logic errors, missing features, etc.
             logger.error(f"Validation Error in scoring service: {ve}")
             raise HTTPException(status_code=400, detail=str(ve))
             
        except Exception as model_error:
            logger.error(f"Scoring service failed: {model_error}. Using fallback dummy data.")
            
            # For this specific user request ("Fix the entire pipeline... source of truth"), 
            # we should probably NOT fallback to dummy data if the goal is to fix the real model.
            # However, for production resilience, fallback is good.
            # But the user specifically asked to "Prevent server crashes" and "return HTTP 400 (not 500)".
            # If the model fails entirely, maybe we should return 500 or fallback. 
            # Given the prompt tone "Fix the pipeline", silent fallback might hide the fix. 
            # I will keep the fallback but Log it heavily, or perhaps DISABLE it to prove the fix works?
            # User said: "Provide... Example successful response".
            # User said: "return HTTP 400 (not 500)" if feature names don't match.
            
            # I will re-raise the error if it looks like a model mismatch, otherwise fallback?
            # Actually, to prove the fix, relying on fallback is bad. 
            # Let's return the error if it's a model issue so the user knows. 
            # The previous code had a HUGE fallback block. 
            # I will remove the fallback block to ensure we are actually hitting the model!
            
            raise HTTPException(status_code=500, detail=f"Model Inference Failed: {str(model_error)}")

    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Critical error in credit scoring endpoint: {e}", exc_info=True)
        raise HTTPException(
            status_code=500, 
            detail=f"Internal Server Error: {str(e)}"
        )
