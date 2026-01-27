from pydantic import BaseModel, Field

class CreditScoreRequest(BaseModel):
    # Demographics
    LIMIT_BAL: float = Field(..., description="Amount of given credit in NT dollars")
    SEX: int = Field(..., description="1=Male, 2=Female")
    EDUCATION: int = Field(..., description="1=Graduate, 2=University, 3=High School, 4=Others")
    MARRIAGE: int = Field(..., description="1=Married, 2=Single, 3=Others")
    AGE: int = Field(..., description="Age in years")
    
    # Repayment Status (Sept - April)
    # The dataset uses PAY_0 for Sept, then PAY_2...PAY_6
    PAY_0: int = Field(..., description="Repayment status in September (-1=pay duly, 1=payment delay for one month...)")
    PAY_2: int = Field(..., description="Repayment status in August")
    PAY_3: int = Field(..., description="Repayment status in July")
    PAY_4: int = Field(..., description="Repayment status in June")
    PAY_5: int = Field(..., description="Repayment status in May")
    PAY_6: int = Field(..., description="Repayment status in April")
    
    # Bill Amounts
    BILL_AMT1: float = Field(..., description="Bill statement in September")
    BILL_AMT2: float = Field(..., description="Bill statement in August")
    BILL_AMT3: float = Field(..., description="Bill statement in July")
    BILL_AMT4: float = Field(..., description="Bill statement in June")
    BILL_AMT5: float = Field(..., description="Bill statement in May")
    BILL_AMT6: float = Field(..., description="Bill statement in April")
    
    # Payment Amounts
    PAY_AMT1: float = Field(..., description="Amount paid in September")
    PAY_AMT2: float = Field(..., description="Amount paid in August")
    PAY_AMT3: float = Field(..., description="Amount paid in July")
    PAY_AMT4: float = Field(..., description="Amount paid in June")
    PAY_AMT5: float = Field(..., description="Amount paid in May")
    PAY_AMT6: float = Field(..., description="Amount paid in April")

class FinancialHealthRequest(CreditScoreRequest):
    pass
