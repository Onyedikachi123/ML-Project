import pandas as pd
import numpy as np

def compute_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Computes required features for credit scoring and financial health.
    Works on a Pandas DataFrame (even if single row).
    """
    df = df.copy()

    # 1. Average Bill Amount
    bill_cols = [f'BILL_AMT{i}' for i in range(1, 7)]
    df['avg_bill_amt'] = df[bill_cols].mean(axis=1)

    # 2. Average Payment Amount
    pay_amt_cols = [f'PAY_AMT{i}' for i in range(1, 7)]
    df['avg_pay_amt'] = df[pay_amt_cols].mean(axis=1)

    # 3. Credit Utilization Ratio
    # Clamp to [0, 1.5]
    # Handle division by zero if LIMIT_BAL is 0 (unlikely but safe to handle)
    df['credit_utilization'] = df['avg_bill_amt'] / df['LIMIT_BAL'].replace(0, 1)
    df['credit_utilization'] = df['credit_utilization'].clip(0, 1.5)

    # 4. Payment Consistency Ratio
    # sum(PAY_AMT) / sum(BILL_AMT)
    # Clamp to [0, 2]
    sum_pay = df[pay_amt_cols].sum(axis=1)
    sum_bill = df[bill_cols].sum(axis=1)
    # Avoid division by zero
    df['payment_consistency'] = sum_pay / sum_bill.replace(0, 1)
    df['payment_consistency'] = df['payment_consistency'].clip(0, 2)

    # 5. Late Payment Count
    # count(PAY_0...PAY_6 where value > 0)
    # Note: Dataset usually has PAY_0, PAY_2, PAY_3, PAY_4, PAY_5, PAY_6.
    # The prompt says PAY_0...PAY_6. I will use the columns available in the dataframe that start with PAY_ and are single digit integers mostly.
    # Standard UCI dataset columns for history: PAY_0, PAY_2, PAY_3, PAY_4, PAY_5, PAY_6
    pay_status_cols = ['PAY_0', 'PAY_2', 'PAY_3', 'PAY_4', 'PAY_5', 'PAY_6']
    
    # Check if cols exist, otherwise adjust (e.g. if preprocessing renamed them)
    # For now assume standard names.
    # In case the input is missing some cols (inference), we assume they are provided.
    
    # We filter only those that exist in df
    existing_pay_cols = [c for c in pay_status_cols if c in df.columns]
    
    df['late_payment_count'] = (df[existing_pay_cols] > 0).sum(axis=1)

    # 6. Severe Delinquency Flag
    # 1 if any(PAY_X >= 3) else 0
    df['severe_delinquency'] = (df[existing_pay_cols] >= 3).any(axis=1).astype(int)

    # 7. Cashflow Volatility
    # std(BILL_AMT1...BILL_AMT6)
    df['cashflow_volatility'] = df[bill_cols].std(axis=1)

    # 8. Payment-to-Bill Ratio Volatility
    # monthly_ratios = PAY_AMTX / max(BILL_AMTX, 1)
    # ratio_volatility = std(monthly_ratios)
    
    # varying X from 1 to 6
    ratio_vals = []
    for i in range(1, 7):
        b_col = f'BILL_AMT{i}'
        p_col = f'PAY_AMT{i}'
        # usage of max(BILL, 1) to avoid zero div
        # In pandas: .apply or vector operation
        ratio_vals.append(df[p_col] / df[b_col].apply(lambda x: max(x, 1)))
    
    ratio_df = pd.concat(ratio_vals, axis=1)
    df['ratio_volatility'] = ratio_df.std(axis=1)

    return df
