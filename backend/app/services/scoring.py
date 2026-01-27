import os
import pandas as pd
import numpy as np
from app.services.feature_engineering import compute_features
from app.utils.preprocessing import load_and_preprocess_data
from app.models.credit_model import CreditScoringModel
from app.models.investment_model import InvestmentModel

# Paths
MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'models', 'saved_models')
CREDIT_MODEL_PATH = os.path.join(MODEL_DIR, 'credit_xgboost.pkl')
EXPLAINER_PATH = os.path.join(MODEL_DIR, 'shap_explainer.pkl')

if not os.path.exists(MODEL_DIR):
    os.makedirs(MODEL_DIR)

class ScoringService:
    def __init__(self):
        self.credit_model = CreditScoringModel(CREDIT_MODEL_PATH, EXPLAINER_PATH)
        self.investment_model = InvestmentModel()
        
        # Initialize
        if not self.credit_model.load():
            print("Credit Model not found. Training from scratch...")
            self.train_credit_model()

    def train_credit_model(self):
        # 1. Load Data
        df = load_and_preprocess_data()
        
        # 2. Feature Engineering
        df = compute_features(df)
        
        # 3. Prepare Features
        target = 'default_payment_next_month'
        
        # Identify Payment Columns
        # Filter columns that start with PAY_ and are single digit or standard
        pay_cols = [c for c in df.columns if c.startswith('PAY_') and 'AMT' not in c]
        
        feature_cols = [
            'LIMIT_BAL', 'AGE', 'SEX', 'EDUCATION', 'MARRIAGE'
        ] + pay_cols + [
            'avg_bill_amt', 'avg_pay_amt', 'credit_utilization', 
            'payment_consistency', 'late_payment_count', 
            'severe_delinquency', 'cashflow_volatility'
        ]
        
        final_cols = [c for c in feature_cols if c in df.columns]
        
        X = df[final_cols]
        y = df[target]
        
        # Train
        self.credit_model.train(X, y, final_cols)
        print("Model trained and saved.")

    def predict_credit_score(self, input_features: dict):
        # Convert dict to DataFrame
        df = pd.DataFrame([input_features])
        
        # Compute derived features
        df_processed = compute_features(df)
        
        # Predict Prob
        pd_prob = self.credit_model.predict(df_processed)[0]
        
        # Logic
        credit_score = int(round((1 - pd_prob) * 100))
        
        if pd_prob <= 0.25:
            risk_tier = "LOW"
        elif pd_prob <= 0.55:
            risk_tier = "MEDIUM"
        else:
            risk_tier = "HIGH"
            
        limit = input_features.get('LIMIT_BAL', 0)
        if risk_tier == "LOW":
            rec_loan = limit * 1.5
            tenure = 36
        elif risk_tier == "MEDIUM":
            rec_loan = limit * 0.8
            tenure = 24
        else:
            rec_loan = limit * 0.2
            tenure = 12
            
        # Explainability
        shap_values = self.credit_model.explain(df_processed)
        feature_names = self.credit_model.features
        
        feature_impact = dict(zip(feature_names, shap_values))
        sorted_impact = sorted(feature_impact.items(), key=lambda x: x[1], reverse=True)
        
        top_positive = [{"feature": k, "impact": float(v)} for k, v in sorted_impact[:3] if v > 0]
        top_negative = [{"feature": k, "impact": float(v)} for k, v in sorted_impact[-3:] if v < 0]

        return {
            "credit_score": credit_score,
            "probability_of_default": float(pd_prob),
            "risk_tier": risk_tier,
            "recommended_loan_amount": float(rec_loan),
            "recommended_tenor_months": tenure,
            "explainability": {
                "top_positive_factors": top_positive,
                "top_negative_factors": top_negative
            },
            "_derived_features": df_processed.iloc[0].to_dict()
        }

    def calculate_financial_health(self, features: dict):
        lpc = features.get('late_payment_count', 0)
        cu = features.get('credit_utilization', 0)
        # Note: API might pass 'cashflow_volatility' directly or we computed it.
        # If we use compute features, we have it.
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
        fhs = profile.get('financial_health_score', 0)
        age = profile.get('AGE', 30)
        
        risk = self.investment_model.predict_risk_tolerance(fhs)
        horizon = self.investment_model.predict_investment_horizon(age)
        alloc = self.investment_model.recommend_allocation(risk)
            
        return {
            "risk_tolerance": risk,
            "investment_horizon": horizon,
            "portfolio_allocation": alloc
        }

scoring_service = ScoringService()
