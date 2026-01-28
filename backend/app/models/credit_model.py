import xgboost as xgb
import shap
import pickle
import os
import pandas as pd
import numpy as np
import logging

logger = logging.getLogger(__name__)

class CreditScoringModel:
    def __init__(self, model_path: str, explainer_path: str):
        self.model_path = model_path
        self.explainer_path = explainer_path
        self.model = None
        self.explainer = None
        self.features = None
        
    def load(self):
        if not os.path.exists(self.model_path):
            logger.error(f"Model file not found at {self.model_path}")
            return False
            
        try:
            with open(self.model_path, 'rb') as f:
                data = pickle.load(f)
                
            if isinstance(data, dict) and 'model' in data:
                self.model = data['model']
                self.features = data.get('features')
                logger.info("Loaded model from dictionary container.")
            else:
                self.model = data
                self.features = None
                logger.info("Loaded raw model object.")
                
            # Try to populate features from model if possible and not set
            if self.features is None and hasattr(self.model, 'feature_names'):
                self.features = self.model.feature_names
            
            # Load Explainer if exists
            if os.path.exists(self.explainer_path):
                try:
                    with open(self.explainer_path, 'rb') as f:
                        self.explainer = pickle.load(f)
                        logger.info("Loaded SHAP explainer.")
                except Exception as e:
                    logger.warning(f"Failed to load explainer: {e}")
            
            return True
        except Exception as e:
            logger.error(f"Failed to load model: {e}")
            return False
    
    def predict(self, X: pd.DataFrame):
        """
        Predicts probabilities for the given DataFrame.
        Enforces feature names if they are known by the model.
        """
        if self.model is None:
            raise ValueError("Model is not loaded.")

        # If we know the features the model expects, strictly enforce them
        if self.features:
            missing_cols = set(self.features) - set(X.columns)
            if missing_cols:
                 raise ValueError(f"Input missing features expected by model: {missing_cols}")
            
            # Reorder to match model's expectation
            X_input = X[self.features]
        else:
            # If we don't know model features, we rely on the caller (ScoringService) 
            # to have provided the correct order.
            X_input = X

        try:
            # Check if it's an XGBoost Booster or valid Sklearn wrapper
            if hasattr(self.model, 'predict_proba'):
                # Sklearn-API
                probs = self.model.predict_proba(X_input)
                # Binary classification: return probability of class 1
                return probs[:, 1]
            elif hasattr(self.model, 'predict'):
                # Might be Booster or Sklearn predict
                # If Booster, it needs DMatrix
                if isinstance(self.model, xgb.Booster):
                    dmat = xgb.DMatrix(X_input, feature_names=self.features if self.features else None)
                    return self.model.predict(dmat)
                else:
                    return self.model.predict(X_input)
            else:
                raise ValueError("Unknown model type")
                
        except Exception as e:
            logger.error(f"Prediction error: {e}")
             # Last resort attempt: DMatrix
            try:
                dmat = xgb.DMatrix(X_input, feature_names=self.features if self.features else None)
                if hasattr(self.model, 'get_booster'):
                     return self.model.get_booster().predict(dmat)
                return self.model.predict(dmat)
            except Exception as e2:
                raise ValueError(f"Model prediction failed: {e2}")

    def explain(self, X: pd.DataFrame):
        if not self.explainer:
            return None
            
        if self.features:
            X_input = X[self.features]
        else:
            X_input = X
            
        shap_values = self.explainer.shap_values(X_input)
        
        if isinstance(shap_values, list):
            sv = shap_values[1]
        else:
            sv = shap_values
            
        if len(sv.shape) > 1:
            return sv[0]
        return sv
