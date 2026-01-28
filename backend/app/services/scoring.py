import os
import pandas as pd
import numpy as np
import logging
from app.models.credit_model import CreditScoringModel

logger = logging.getLogger(__name__)

# Paths
MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'models', 'saved_models')
CREDIT_MODEL_PATH = os.path.join(MODEL_DIR, 'credit_xgboost.pkl')
EXPLAINER_PATH = os.path.join(MODEL_DIR, 'shap_explainer.pkl')

class ScoringService:
    def __init__(self):
        self.credit_model = CreditScoringModel(CREDIT_MODEL_PATH, EXPLAINER_PATH)
        
        # Expected Features in exact order matching training
        self.EXPECTED_FEATURES = [
            'LIMIT_BAL', 'AGE', 'SEX', 'EDUCATION', 'MARRIAGE',
            'PAY_0', 'PAY_2', 'PAY_3', 'PAY_4', 'PAY_5', 'PAY_6',
            'avg_bill_amt', 'avg_pay_amt', 'credit_utilization',
            'payment_consistency', 'late_payment_count',
            'severe_delinquency', 'cashflow_volatility'
        ]
        
        # Initialize
        if not self.credit_model.load():
            logger.warning("Credit Model not found during initialization.")

    def predict_credit_score(self, input_features: dict):
        """
        Predict credit score using the XGBoost model.
        input_features must already contain the derived features.
        """
        # 1. Convert dict to DataFrame
        try:
            df = pd.DataFrame([input_features])
        except Exception as e:
            raise ValueError(f"Failed to create DataFrame from input: {e}")
        
        # 2. explicit feature alignment and ordering
        try:
            # Reindex ensures we have exactly the columns we want, in order. 
            # fill_value=0 handles any accidentally missing derived keys if schema slipped up.
            X_final = df.reindex(columns=self.EXPECTED_FEATURES, fill_value=0)
        except Exception as e:
             raise ValueError(f"Feature alignment failed: {e}")

        # 3. Enforce numeric types
        for col in self.EXPECTED_FEATURES:
            X_final[col] = pd.to_numeric(X_final[col], errors='coerce').fillna(0)

        # 4. Predict
        try:
            pd_prob = self.credit_model.predict(X_final)[0]
        except Exception as e:
            logger.error(f"Model prediction failed: {e}")
            raise RuntimeError(f"Model inference failed: {str(e)}")
        
        # Logic
        credit_score = int(round((1 - pd_prob) * 100))
        
        if pd_prob <= 0.25:
            risk_tier = "LOW"
        elif pd_prob <= 0.55:
            risk_tier = "MEDIUM"
        else:
            risk_tier = "HIGH"
            
        return {
            "credit_score": float(credit_score),
            "probability_of_default": float(pd_prob),
            "risk_tier": risk_tier,
            "recommended_loan_amount": float(input_features.get('LIMIT_BAL', 0)) * (0.5 if risk_tier == 'HIGH' else 1.5),
            "recommended_tenor_months": 12 if risk_tier == 'HIGH' else 24,
            "currency": "NGN",
            "explainability": {
                "top_positive_factors": [],
                "top_negative_factors": []
            }
        }

    def calculate_financial_health(self, features: dict):
        lpc = features.get('late_payment_count', 0)
        cu = features.get('credit_utilization', 0)
        cv = features.get('cashflow_volatility', 0)
        aba = features.get('avg_bill_amt', 1)
        if aba is None or aba == 0: aba = 1
        pc = features.get('payment_consistency', 0)
        
        score = 100 - (lpc * 10) - (cu * 25) - ((cv / aba) * 20) + (pc * 20)
        score = max(0, min(100, score))
        
        if score >= 80:
            band = "Strong"
        elif score >= 50:
            band = "Moderate"
        else:
            band = "Fragile"
            
        return {
            "financial_health_score": round(score, 2),
            "health_band": band
        }
    
    def get_asset_recommendation(self, profile: dict):
        # Placeholder or simplified logic if InvestmentModel is missing
        # To avoid dependency hell, I'll implement simple logic here or try to import InvestmentModel
        # But for now, let's just return a mock or simple calculation to prevent crash
        fhs = profile.get('financial_health_score', 0)
        age = profile.get('AGE', 30)
        
        # Simple logic instead of loading another model
        if fhs > 80:
            risk = "Aggressive"
            alloc = {"Stocks": 70, "Bonds": 20, "Cash": 10}
        elif fhs > 50:
            risk = "Moderate"
            alloc = {"Stocks": 50, "Bonds": 40, "Cash": 10}
        else:
            risk = "Conservative"
            alloc = {"Stocks": 20, "Bonds": 60, "Cash": 20}
            
        horizon = 60 - age if age < 60 else 5
        
        return {
            "risk_tolerance": risk,
            "investment_horizon": horizon,
            "portfolio_allocation": alloc
        }

scoring_service = ScoringService()
