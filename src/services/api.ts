export const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

export interface CreditScoreRequest {
    LIMIT_BAL: number;
    AGE: number;
    SEX: number;
    EDUCATION: number;
    MARRIAGE: number;
    PAY_0: number;
    PAY_2: number;
    PAY_3: number;
    PAY_4: number;
    PAY_5: number;
    PAY_6: number;
    BILL_AMT1: number;
    BILL_AMT2: number;
    BILL_AMT3: number;
    BILL_AMT4: number;
    BILL_AMT5: number;
    BILL_AMT6: number;
    PAY_AMT1: number;
    PAY_AMT2: number;
    PAY_AMT3: number;
    PAY_AMT4: number;
    PAY_AMT5: number;
    PAY_AMT6: number;
}

export interface CreditScoreResponse {
    credit_score: number;
    probability_of_default: number;
    risk_tier: 'LOW' | 'MEDIUM' | 'HIGH';
    recommended_loan_amount: number;
    recommended_tenor_months: number;
    currency?: 'NGN';
    explainability: {
        top_positive_factors: Array<{ feature: string; impact: number }>;
        top_negative_factors: Array<{ feature: string; impact: number }>;
    };
}

export interface FinancialHealthResponse {
    financial_health_score: number;
    health_band: string;
}

export interface AssetRecommendationResponse {
    risk_tolerance: string;
    investment_horizon: string;
    portfolio_allocation: {
        money_market: number;
        fixed_income: number;
        equities: number;
    };
}

export const api = {
    async getCreditScore(data: CreditScoreRequest): Promise<CreditScoreResponse> {
        const response = await fetch(`${API_BASE_URL}/credit/score`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to fetch credit score');
        return response.json();
    },

    async getFinancialHealth(data: CreditScoreRequest): Promise<FinancialHealthResponse> {
        const response = await fetch(`${API_BASE_URL}/financial-health/score`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to fetch financial health');
        return response.json();
    },

    async getAssetRecommendation(
        data: {
            financial_health_score: number;
            credit_score: number;
            risk_tier: string;
            LIMIT_BAL: number;
            AGE: number;
        }
    ): Promise<AssetRecommendationResponse> {
        const response = await fetch(`${API_BASE_URL}/asset-management/recommendation`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to fetch asset recommendation');
        return response.json();
    },
};
