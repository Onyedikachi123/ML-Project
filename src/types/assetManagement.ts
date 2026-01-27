// Asset Management Types

export type RiskLevel = 'conservative' | 'moderate' | 'aggressive';
export type InvestorPersona = 'Income Seeker' | 'Capital Preservation' | 'Growth Focused' | 'Balanced Investor';
export type PortfolioStatus = 'stable' | 'over-exposed' | 'needs-rebalancing';
export type ProductType = 'Fixed Income' | 'Money Market' | 'Equities' | 'Real Estate' | 'Commodities';

export interface InvestmentProfile {
  id: string;
  customerId: string;
  customerName: string;
  email: string;
  phone: string;
  financialHealthScore: number; // 0-100
  riskTolerance: RiskLevel;
  investorPersona: InvestorPersona;
  loanRepaymentSummary: {
    totalLoans: number;
    onTimePayments: number;
    latePayments: number;
    defaulted: number;
    averageRepaymentDays: number;
  };
  explainability: {
    summary: string;
    factors: FeatureContribution[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface FeatureContribution {
  feature: string;
  contribution: number; // -100 to 100 (negative = decreases score)
  description: string;
}

export interface AssetAllocation {
  productType: ProductType;
  percentage: number;
  currentValue: number;
  targetPercentage: number;
  color: string;
}

export interface InvestmentProduct {
  id: string;
  name: string;
  type: ProductType;
  expectedReturnMin: number;
  expectedReturnMax: number;
  riskLevel: RiskLevel;
  minimumInvestment: number;
  liquidityLevel: 'High' | 'Medium' | 'Low';
  investmentHorizon: string;
  description: string;
}

export interface InvestmentRecommendation {
  id: string;
  customerId: string;
  customerName: string;
  products: RecommendedProduct[];
  suggestedAllocation: AssetAllocation[];
  expectedReturnRange: { min: number; max: number };
  overallRiskLevel: RiskLevel;
  investmentHorizon: string;
  liquidityNeeds: 'High' | 'Medium' | 'Low';
  rationale: string;
  generatedAt: string;
  status: 'pending' | 'accepted' | 'declined' | 'modified';
}

export interface RecommendedProduct {
  product: InvestmentProduct;
  allocationPercentage: number;
  investmentAmount: number;
  reasoning: string;
}

export interface Portfolio {
  id: string;
  customerId: string;
  customerName: string;
  totalValue: number;
  totalInvested: number;
  totalReturns: number;
  returnPercentage: number;
  status: PortfolioStatus;
  allocations: AssetAllocation[];
  riskScore: number; // 0-100
  lastRebalanced: string;
  rebalancingSuggestions: RebalancingSuggestion[];
}

export interface RebalancingSuggestion {
  productType: ProductType;
  currentPercentage: number;
  targetPercentage: number;
  action: 'increase' | 'decrease' | 'hold';
  amount: number;
  reason: string;
}

export interface RiskMetrics {
  averageRiskScore: number;
  riskDistribution: {
    conservative: number;
    moderate: number;
    aggressive: number;
  };
  concentrationAlerts: ConcentrationAlert[];
  liquidityStressIndicators: LiquidityIndicator[];
}

export interface ConcentrationAlert {
  id: string;
  customerId: string;
  customerName: string;
  productType: ProductType;
  concentration: number;
  threshold: number;
  severity: 'low' | 'medium' | 'high';
}

export interface LiquidityIndicator {
  id: string;
  customerId: string;
  customerName: string;
  liquidAssets: number;
  totalAssets: number;
  liquidityRatio: number;
  status: 'healthy' | 'warning' | 'critical';
}

export interface AUMMetrics {
  totalAUM: number;
  aumGrowth: number; // percentage
  activeInvestors: number;
  averagePortfolioSize: number;
  productDistribution: {
    productType: ProductType;
    value: number;
    percentage: number;
  }[];
  aumHistory: {
    date: string;
    value: number;
  }[];
}

export interface InvestorSegment {
  segment: InvestorPersona;
  count: number;
  totalAUM: number;
  averageRiskScore: number;
  averageReturns: number;
}
