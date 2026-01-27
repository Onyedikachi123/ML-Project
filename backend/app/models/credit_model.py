import xgboost as xgb
import shap
import pickle
import os
import pandas as pd
import numpy as np

class CreditScoringModel:
    def __init__(self, model_path: str, explainer_path: str):
        self.model_path = model_path
        self.explainer_path = explainer_path
        self.model = None
        self.explainer = None
        self.features = None
        
    def train(self, X: pd.DataFrame, y: pd.Series, feature_names: list, params: dict = None):
        if params is None:
            params = {
                'n_estimators': 100, 
                'max_depth': 4, 
                'learning_rate': 0.1, 
                'objective': 'binary:logistic',
                'random_state': 42
            }
            
        self.model = xgb.XGBClassifier(**params)
        self.model.fit(X, y)
        self.features = feature_names
        
        # Initialize Explainer
        # TreeExplainer is best for XGBoost
        self.explainer = shap.TreeExplainer(self.model)
        
        self.save()
        
    def save(self):
        with open(self.model_path, 'wb') as f:
            pickle.dump({'model': self.model, 'features': self.features}, f)
        
        with open(self.explainer_path, 'wb') as f:
            pickle.dump(self.explainer, f)
            
    def load(self):
        if not os.path.exists(self.model_path):
            return False
            
        with open(self.model_path, 'rb') as f:
            data = pickle.load(f)
            self.model = data['model']
            self.features = data['features']
            
        if os.path.exists(self.explainer_path):
            with open(self.explainer_path, 'rb') as f:
                self.explainer = pickle.load(f)
        
        return True
    
    def predict(self, X: pd.DataFrame):
        # Ensure column order matches training
        X_ordered = X[self.features]
        # predict_proba returns [prob_0, prob_1]
        probs = self.model.predict_proba(X_ordered)
        return probs[:, 1] # Return Prob(Default)
    
    def explain(self, X: pd.DataFrame):
        X_ordered = X[self.features]
        shap_values = self.explainer.shap_values(X_ordered)
        
        # Handling shape differences in shap versions/models
        # For binary clf, it might be list of arrays or single array
        if isinstance(shap_values, list):
            # Class 1
            sv = shap_values[1]
        else:
            sv = shap_values
            
        if len(sv.shape) > 1:
            # multiple samples
            return sv[0]
        return sv
