import axios from 'axios';

// Use import.meta.env for Vite
const API_URL = import.meta.env.VITE_API_URL || "https://ml-project-ksuh.onrender.com";
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
            const response = await apiClient.post<CreditScoreResponse>('/credit/score', data);
            return response.data;
        } catch (error: any) {
            console.error('Error fetching credit score:', error);
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.detail || error.message;
                throw new Error(`Credit Score API Error: ${message}`);
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
            console.error('Error fetching asset recommendation:', error);
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.detail || error.message;
                throw new Error(`Asset Recommendation API Error: ${message}`);
            }
            throw new Error('Failed to fetch asset recommendation');
        }
    },
};
