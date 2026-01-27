from fastapi import APIRouter
from app.schemas.asset import AssetManagementRequest
from app.services.scoring import scoring_service

router = APIRouter()

@router.post("/recommendation")
def get_asset_recommendation(request: AssetManagementRequest):
    data = request.dict()
    # The logic relies on inputs provided in the request
    result = scoring_service.get_asset_recommendation(data)
    return result
