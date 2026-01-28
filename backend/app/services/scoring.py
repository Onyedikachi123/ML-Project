import os
import pandas as pd
import numpy as np
from app.services.feature_engineering import compute_features
from app.utils.preprocessing import load_and_preprocess_data
from app.models.credit_model import CreditScoringModel
from app.models.investment_model import InvestmentModel
from datetime import datetime

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
        
        # Expected Features in exact order based on user report being the source of truth
        self.EXPECTED_FEATURES = [
            'LIMIT_BAL', 'AGE', 'SEX', 'EDUCATION', 'MARRIAGE',
            'PAY_0', 'PAY_2', 'PAY_3', 'PAY_4', 'PAY_5', 'PAY_6',
            'avg_bill_amt', 'avg_pay_amt', 'credit_utilization',
            'payment_consistency', 'late_payment_count',
            'severe_delinquency', 'cashflow_volatility'
        ]
        
        # Initialize
        if not self.credit_model.load():
            print("Credit Model not found. Training from scratch...")
            self.train_credit_model()
        else:
            # Verify loaded features match expectation if possible, or enforce it
            # If the model was trained with different features, we might need to re-train
            pass

    def train_credit_model(self):
        # 1. Load Data
        df = load_and_preprocess_data()
        
        # 2. Feature Engineering
        df = compute_features(df)
        
        # 3. Prepare Features
        target = 'default_payment_next_month'
        
        # Use strictly our expected features
        final_cols = [c for c in self.EXPECTED_FEATURES if c in df.columns]
        
        # Check if we have all
        missing = set(self.EXPECTED_FEATURES) - set(final_cols)
        if missing:
            print(f"Warning: training data missing expected features: {missing}")
        
        X = df[final_cols]
        y = df[target]
        
        # Train
        self.credit_model.train(X, y, final_cols)
        print("Model trained and saved.")

    def predict_credit_score(self, input_features: dict):
        """
        Predict credit score using the XGBoost model.
        input_features must already contain the derived features (enforced by Schema).
        """
        # 1. Convert validated dict to DataFrame
        df = pd.DataFrame([input_features])
        
        # 2. explicit feature alignment
        # Ensure we only have the expected columns in the exact order
        try:
            X_final = df[self.EXPECTED_FEATURES].copy()
        except KeyError as e:
            missing = list(set(self.EXPECTED_FEATURES) - set(df.columns))
            raise ValueError(f"Input data missing expected features: {missing}")

        # 3. Enforce numeric types
        # XGBoost expects numeric pointers; prevent object types
        for col in self.EXPECTED_FEATURES:
            X_final[col] = pd.to_numeric(X_final[col], errors='coerce').fillna(0)

        # 4. Predict
        # Use .values if you want strictly array, but DF with correct names is often safer for XGBoost features check
        # However, to be extra safe against "feature names mismatch" if the model was trained on arrays or different versions:
        # Pass the DataFrame. The error "data did not contain feature names" usually implies 
        # the model expects names (saved with names) but got array, OR vice versa. 
        # The user report says: "data did not contain feature names".
        # This usually happens when passing a numpy array to a model trained on DataFrame, or passing a DF with wrong names.
        # We are passing a DF with `self.EXPECTED_FEATURES` names.
        
        pd_prob = self.credit_model.predict(X_final)[0]
        
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
        try:
            shap_values = self.credit_model.explain(X_final)
            feature_names = self.EXPECTED_FEATURES
            
            # Map features to nice names
            nice_names = {
                'PAY_0': 'Recent Payment Status',
                'limit_bal': 'Credit Limit',
                'credit_utilization': 'Credit Utilization',
                'payment_consistency': 'Payment Consistency'
            }
            
            feature_impact = dict(zip(feature_names, shap_values))
            sorted_impact = sorted(feature_impact.items(), key=lambda x: x[1], reverse=True)
            
            top_positive = []
            top_negative = []
            
            for k, v in sorted_impact:
                nice_name = nice_names.get(k, k.replace('_', ' ').title())
                item = {"feature": nice_name, "impact": float(v)}
                if v > 0:
                    top_positive.append(item)
                else:
                    top_negative.append(item)
                    
            top_positive = top_positive[:3]
            top_negative = top_negative[-3:] # Get last 3 (most negative)
             
        except Exception as e:
            print(f"Explainability failed: {e}")
            top_positive = []
            top_negative = []

        return {
            "credit_score": credit_score,
            "probability_of_default": float(pd_prob),
            "risk_tier": risk_tier,
            "recommended_loan_amount": float(rec_loan),
            "recommended_tenor_months": tenure,
            "currency": "NGN",
            "explainability": {
                "top_positive_factors": top_positive,
                "top_negative_factors": top_negative
            },
            "_derived_features": df.iloc[0].to_dict()
        }

    def calculate_financial_health(self, features: dict):
        # ... (impl unchanged just adapting if needed)
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
