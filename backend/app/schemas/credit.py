from pydantic import BaseModel, Field

class CreditScoreRequest(BaseModel):
    LIMIT_BAL: float
    AGE: int
    SEX: int = Field(..., description="1=Male, 2=Female")
    EDUCATION: int = Field(..., description="1=Graduate, 2=University, 3=High School, 4=Others")
    MARRIAGE: int = Field(..., description="1=Married, 2=Single, 3=Others")
    
    # Check dataset for PAY_0 or PAY_1
    PAY_0: int
    PAY_2: int
    PAY_3: int
    PAY_4: int
    PAY_5: int
    PAY_6: int
    
    BILL_AMT1: float
    BILL_AMT2: float
    BILL_AMT3: float
    BILL_AMT4: float
    BILL_AMT5: float
    BILL_AMT6: float
    
    PAY_AMT1: float
    PAY_AMT2: float
    PAY_AMT3: float
    PAY_AMT4: float
    PAY_AMT5: float
    PAY_AMT6: float

class FinancialHealthRequest(CreditScoreRequest):
    # Could inherit or separate. 
    # Usually financial health needs derived metrics, but we can compute them from raw request.
    pass
