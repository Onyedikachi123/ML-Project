import pandas as pd
import os

DATA_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'default-of-credit-card-clients.xls')

def load_and_preprocess_data():
    """
    Loads the dataset, drops ID, and returns a raw DataFrame.
    """
    if not os.path.exists(DATA_PATH):
        raise FileNotFoundError(f"Dataset not found at {DATA_PATH}")

    # The UCI dataset often has the header on the second row (index 1), with index 0 describing the data types or X1, X2 etc.
    # Let's verify this by trying to read it. But to be safe, standard loading often works with header=1.
    # However, if it's the raw file, row 0 is "ID", "LIMIT_BAL"... but sometimes row 0 is "X1", "X2" and row 1 is "ID"...
    # Let's try to read with header=1 first as that's common for this specific file structure from UCI.
    # Actually, looking at common versions:
    # Row 0: "ID", "LIMIT_BAL", ...
    # Row 1: 1, 20000, ...
    
    # We will try to read it. If "ID" is in columns, we drop it.
    try:
        df = pd.read_excel(DATA_PATH, header=1) # Often header is on row 1 (index 1) which contains names like LIMIT_BAL
        if 'ID' not in df.columns:
             # Maybe header was row 0
             df = pd.read_excel(DATA_PATH, header=0)
    except Exception as e:
        raise ValueError(f"Error reading Excel file: {e}")

    # Drop ID if exists
    if 'ID' in df.columns:
        df = df.drop(columns=['ID'])
        
    # Also standardize column names to upper case just in case
    df.columns = [c.upper() for c in df.columns]
    
    # Rename 'PAY_0' to 'PAY_1' if necessary? No, prompt uses PAY_0...PAY_6.
    # But usually dataset has PAY_0, PAY_2,...
    # Let's keep strict to dataset.
    
    # Target variable: "default payment next month" -> rename to "DEFAULT_PAYMENT_NEXT_MONTH" or something simple if needed.
    # Or keep as is but easier to reference.
    # Prompt says Target variable: `default payment next month`.
    # Code below will usually use 'target'.
    
    rename_dict = {}
    for col in df.columns:
        if 'default' in col.lower() and 'payment' in col.lower():
            rename_dict[col] = 'default_payment_next_month'
            
    if rename_dict:
        df = df.rename(columns=rename_dict)

    return df
