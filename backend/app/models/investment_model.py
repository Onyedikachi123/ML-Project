class InvestmentModel:
    """
    Asset Management Intelligence Logic.
    Currently uses deterministic rules based on Credit and Financial Health.
    Future versions can replace rules with LightGBM models trained on outcomes.
    """
    
    def predict_risk_tolerance(self, financial_health_score: float) -> str:
        if financial_health_score >= 75:
            return "HIGH"
        elif financial_health_score >= 50:
            return "MEDIUM"
        else:
            return "LOW"
            
    def predict_investment_horizon(self, age: int) -> str:
        if age < 35:
            return "LONG"
        elif age < 50:
            return "MEDIUM"
        else:
            return "SHORT"
            
    def recommend_allocation(self, risk_tolerance: str) -> dict:
        if risk_tolerance == "LOW":
            return {"money_market": 70, "fixed_income": 30, "equities": 0}
        elif risk_tolerance == "MEDIUM":
            return {"money_market": 40, "fixed_income": 40, "equities": 20}
        else:
            return {"money_market": 20, "fixed_income": 40, "equities": 40}
