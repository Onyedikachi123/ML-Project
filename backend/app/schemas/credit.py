from pydantic import BaseModel, Field, model_validator
import pandas as pd
from typing import Any, Dict
from app.services.feature_engineering import compute_features

class CreditScoreRequest(BaseModel):
    # --- Raw Features that are also Model Features ---
    LIMIT_BAL: float = Field(..., description="Amount of given credit in NT dollars")
    AGE: int = Field(..., description="Age in years")
    SEX: int = Field(..., description="1=Male, 2=Female")
    EDUCATION: int = Field(..., description="1=Graduate, 2=University, 3=High School, 4=Others")
    MARRIAGE: int = Field(..., description="1=Married, 2=Single, 3=Others")
    
    # Repayment Status (Sept - April)
    PAY_0: int = Field(..., description="Repayment status in September")
    PAY_2: int = Field(..., description="Repayment status in August")
    PAY_3: int = Field(..., description="Repayment status in July")
    PAY_4: int = Field(..., description="Repayment status in June")
    PAY_5: int = Field(..., description="Repayment status in May")
    PAY_6: int = Field(..., description="Repayment status in April")
    
    # --- Derived Features (Required by Model) ---
    # We require these to be present in the final object, but we compute them from input if missing.
    avg_bill_amt: float = Field(..., description="Average bill amount")
    avg_pay_amt: float = Field(..., description="Average payment amount")
    credit_utilization: float = Field(..., description="Credit utilization ratio")
    payment_consistency: float = Field(..., description="Payment consistency ratio")
    late_payment_count: int = Field(..., description="Count of late payments")
    severe_delinquency: int = Field(..., description="Flag for severe delinquency")
    cashflow_volatility: float = Field(..., description="Standard deviation of bill amounts")

    @model_validator(mode='before')
    @classmethod
    def compute_derived_features(cls, data: Any) -> Any:
        """
        Accepts raw input (including BILL_AMT, PAY_AMT) and computes derived features
        before Pydantic validation checks for their existence.
        """
        if isinstance(data, dict):
            # Check if we need to compute features. 
            # If the raw columns (BILL_AMT...) are present, we should run feature engineering.
            # Convert dict to DataFrame for feature engineering
            try:
                # We wrap in list to create a 1-row DataFrame
                df_input = pd.DataFrame([data])
                
                # Run the centralized feature engineering logic
                # This adds 'avg_bill_amt', etc. to the DataFrame if BILL_AMT exist
                df_processed = compute_features(df_input)
                
                # Extract the computed features back to a dictionary
                computed_row = df_processed.iloc[0].to_dict()
                
                # Update data with computed features ONLY IF they are not already provided
                # This allows the User to provide pre-calculated features (like in the example request)
                # without them being overwritten by 0s because BILL_AMT columns are missing.
                for key, value in computed_row.items():
                    if key not in data:
                        data[key] = value
                    # If key is already in data, we respect the user's input
            
            except Exception as e:
                # In case of computation error, we let validation fail naturally 
                # or we could raise a specific ValueError
                raise ValueError(f"Feature engineering failed during validation: {str(e)}")
                
        return data

class FinancialHealthRequest(CreditScoreRequest):
    pass
