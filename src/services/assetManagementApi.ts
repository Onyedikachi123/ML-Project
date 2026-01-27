import {
  InvestmentProfile,
  InvestmentRecommendation,
  Portfolio,
  AUMMetrics,
  RiskMetrics,
  InvestorSegment,
  InvestmentProduct,
} from '@/types/assetManagement';
import {
  mockProfiles,
  mockPortfolios,
  mockRecommendations,
  mockAUMMetrics,
  mockRiskMetrics,
  mockInvestorSegments,
  investmentProducts,
} from '@/data/mockAssetManagement';

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Base URL for future API integration
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/asset-management`;

// API service layer - ready for backend integration
export const assetManagementApi = {
  // AUM & Dashboard
  async getAUMMetrics(): Promise<AUMMetrics> {
    await delay(300);
    // Future: return fetch(`${API_BASE_URL}/aum`).then(r => r.json());
    return mockAUMMetrics;
  },

  async getRiskMetrics(): Promise<RiskMetrics> {
    await delay(300);
    // Future: return fetch(`${API_BASE_URL}/risk-metrics`).then(r => r.json());
    return mockRiskMetrics;
  },

  async getInvestorSegments(): Promise<InvestorSegment[]> {
    await delay(300);
    // Future: return fetch(`${API_BASE_URL}/segments`).then(r => r.json());
    return mockInvestorSegments;
  },

  // Investment Profiles
  async getInvestmentProfiles(): Promise<InvestmentProfile[]> {
    await delay(300);
    // Future: return fetch(`${API_BASE_URL}/profiles`).then(r => r.json());
    return mockProfiles;
  },

  async getInvestmentProfile(customerId: string): Promise<InvestmentProfile | null> {
    await delay(200);
    // Future: return fetch(`${API_BASE_URL}/profiles/${customerId}`).then(r => r.json());
    return mockProfiles.find(p => p.customerId === customerId) || null;
  },

  // Recommendations
  async getRecommendations(): Promise<InvestmentRecommendation[]> {
    await delay(300);
    // Future: return fetch(`${API_BASE_URL}/recommendations`).then(r => r.json());
    return mockRecommendations;
  },

  async getRecommendation(customerId: string): Promise<InvestmentRecommendation | null> {
    await delay(200);
    // Future: return fetch(`${API_BASE_URL}/recommendations/${customerId}`).then(r => r.json());
    return mockRecommendations.find(r => r.customerId === customerId) || null;
  },

  async acceptRecommendation(recommendationId: string): Promise<{ success: boolean }> {
    await delay(500);
    // Future: return fetch(`${API_BASE_URL}/recommendations/${recommendationId}/accept`, { method: 'POST' }).then(r => r.json());
    return { success: true };
  },

  async adjustRiskPreference(customerId: string, newRiskLevel: string): Promise<{ success: boolean }> {
    await delay(500);
    // Future: return fetch(`${API_BASE_URL}/profiles/${customerId}/risk`, { method: 'PUT', body: JSON.stringify({ riskLevel: newRiskLevel }) }).then(r => r.json());
    return { success: true };
  },

  // Portfolios
  async getPortfolios(): Promise<Portfolio[]> {
    await delay(300);
    // Future: return fetch(`${API_BASE_URL}/portfolios`).then(r => r.json());
    return mockPortfolios;
  },

  async getPortfolio(customerId: string): Promise<Portfolio | null> {
    await delay(200);
    // Future: return fetch(`${API_BASE_URL}/portfolios/${customerId}`).then(r => r.json());
    return mockPortfolios.find(p => p.customerId === customerId) || null;
  },

  async rebalancePortfolio(portfolioId: string): Promise<{ success: boolean }> {
    await delay(500);
    // Future: return fetch(`${API_BASE_URL}/portfolios/${portfolioId}/rebalance`, { method: 'POST' }).then(r => r.json());
    return { success: true };
  },

  // Products
  async getProducts(): Promise<InvestmentProduct[]> {
    await delay(200);
    // Future: return fetch(`${API_BASE_URL}/products`).then(r => r.json());
    return investmentProducts;
  },
};

// React Query hooks
export const queryKeys = {
  aumMetrics: ['aum-metrics'] as const,
  riskMetrics: ['risk-metrics'] as const,
  investorSegments: ['investor-segments'] as const,
  profiles: ['investment-profiles'] as const,
  profile: (id: string) => ['investment-profile', id] as const,
  recommendations: ['recommendations'] as const,
  recommendation: (id: string) => ['recommendation', id] as const,
  portfolios: ['portfolios'] as const,
  portfolio: (id: string) => ['portfolio', id] as const,
  products: ['products'] as const,
};
