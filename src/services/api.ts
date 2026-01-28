import axios from 'axios';

// Use import.meta.env for Vite
const API_URL = import.meta.env.VITE_API_BASE_URL;
export const API_BASE_URL = `${API_URL}/api`;

// Create axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

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
        try {
            console.log("Sending credit score request to:", `${API_BASE_URL}/credit/score`);
            const response = await apiClient.post<any>('/credit/score', data);

            // Adapter for backend response mismatch
            // Backend currently returns { "score": 123, "probability": 0.12 }
            if (response.data.score !== undefined && response.data.credit_score === undefined) {
                const prob = response.data.probability || 0;
                let calculatedRisk: 'LOW' | 'MEDIUM' | 'HIGH' = 'HIGH';
                if (prob <= 0.25) calculatedRisk = 'LOW';
                else if (prob <= 0.55) calculatedRisk = 'MEDIUM';

                return {
                    credit_score: response.data.score,
                    probability_of_default: prob,
                    risk_tier: calculatedRisk,
                    recommended_loan_amount: 1000000, // Default/Mock
                    recommended_tenor_months: 12,    // Default/Mock
                    explainability: {
                        top_positive_factors: [],
                        top_negative_factors: []
                    }
                };
            }

            return response.data;
        } catch (error: any) {
            console.error('API error:', error.response?.data);
            if (axios.isAxiosError(error)) {
                throw new Error(
                    error.response?.data?.detail?.map((d: any) => d.msg).join(", ")
                    || error.response?.data?.detail
                    || "Unknown API error"
                );
            }
            throw new Error('Failed to fetch credit score');
        }
    },

    async getFinancialHealth(data: CreditScoreRequest): Promise<FinancialHealthResponse> {
        try {
            const response = await apiClient.post<FinancialHealthResponse>('/financial-health/score', data);
            return response.data;
        } catch (error: any) {
            console.error('Error fetching financial health:', error);
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.detail || error.message;
                throw new Error(`Financial Health API Error: ${message}`);
            }
            throw new Error('Failed to fetch financial health');
        }
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
        try {
            const response = await apiClient.post<AssetRecommendationResponse>('/asset-management/recommendation', data);
            return response.data;
        } catch (error: any) {
            console.error("API error:", error.response?.data);
            if (axios.isAxiosError(error)) {
                throw new Error(
                    error.response?.data?.detail?.map((d: any) => d.msg).join(", ")
                    || error.response?.data?.detail
                    || "Unknown API error"
                );
            }
            throw new Error('Failed to fetch asset recommendation');
        }
    },
};
