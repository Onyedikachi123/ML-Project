import pandas as pd
import numpy as np

def compute_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Computes required features for credit scoring and financial health.
    """
    df = df.copy()

    # Define raw column groups
    bill_cols = [f'BILL_AMT{i}' for i in range(1, 7)]
    pay_amt_cols = [f'PAY_AMT{i}' for i in range(1, 7)]
    pay_status_cols = ['PAY_0', 'PAY_2', 'PAY_3', 'PAY_4', 'PAY_5', 'PAY_6']

    # 1. Average Bill Amount
    # Handle missing columns gracefully if for some reason input is partial, though schema enforces all.
    existing_bill_cols = [c for c in bill_cols if c in df.columns]
    if existing_bill_cols:
        df['avg_bill_amt'] = df[existing_bill_cols].mean(axis=1)
    else:
        df['avg_bill_amt'] = 0

    # 2. Average Payment Amount
    existing_pay_amt_cols = [c for c in pay_amt_cols if c in df.columns]
    if existing_pay_amt_cols:
        df['avg_pay_amt'] = df[existing_pay_amt_cols].mean(axis=1)
    else:
        df['avg_pay_amt'] = 0

    # 3. Credit Utilization Ratio
    # Check for LIMIT_BAL
    if 'LIMIT_BAL' in df.columns:
        df['credit_utilization'] = df['avg_bill_amt'] / df['LIMIT_BAL'].replace(0, 1)
        df['credit_utilization'] = df['credit_utilization'].clip(0, 1.5)
    else:
        df['credit_utilization'] = 0

    # 4. Payment Consistency Ratio
    sum_pay = df[existing_pay_amt_cols].sum(axis=1) if existing_pay_amt_cols else 0
    sum_bill = df[existing_bill_cols].sum(axis=1) if existing_bill_cols else 0
    
    # Avoid division by zero
    if isinstance(sum_bill, (int, float)) and sum_bill == 0:
        df['payment_consistency'] = 0
    else:
        # For series
        df['payment_consistency'] = sum_pay / sum_bill.replace(0, 1)
        df['payment_consistency'] = df['payment_consistency'].clip(0, 2)

    # 5. Late Payment Count
    existing_pay_status = [c for c in pay_status_cols if c in df.columns]
    if existing_pay_status:
        df['late_payment_count'] = (df[existing_pay_status] > 0).sum(axis=1)
        # 6. Severe Delinquency Flag
        df['severe_delinquency'] = (df[existing_pay_status] >= 3).any(axis=1).astype(int)
    else:
        df['late_payment_count'] = 0
        df['severe_delinquency'] = 0

    # 7. Cashflow Volatility
    if existing_bill_cols:
        df['cashflow_volatility'] = df[existing_bill_cols].std(axis=1).fillna(0)
    else:
        df['cashflow_volatility'] = 0

    return df
