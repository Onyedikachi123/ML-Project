import {
  InvestmentProfile,
  InvestmentRecommendation,
  Portfolio,
  AUMMetrics,
  RiskMetrics,
  InvestorSegment,
  InvestmentProduct,
  AssetAllocation,
  ConcentrationAlert,
  LiquidityIndicator,
  RiskLevel,
  InvestorPersona,
  ProductType,
  PortfolioStatus,
} from '@/types/assetManagement';

// Product catalog
export const investmentProducts: InvestmentProduct[] = [
  {
    id: 'prod-1',
    name: 'Sycamore Fixed Income Fund',
    type: 'Fixed Income',
    expectedReturnMin: 12,
    expectedReturnMax: 15,
    riskLevel: 'conservative',
    minimumInvestment: 50000,
    liquidityLevel: 'Medium',
    investmentHorizon: '6-12 months',
    description: 'A stable fund investing in Nigerian government bonds and high-grade corporate debt.',
  },
  {
    id: 'prod-2',
    name: 'Sycamore Money Market Fund',
    type: 'Money Market',
    expectedReturnMin: 8,
    expectedReturnMax: 11,
    riskLevel: 'conservative',
    minimumInvestment: 10000,
    liquidityLevel: 'High',
    investmentHorizon: '0-6 months',
    description: 'Highly liquid fund for short-term savings with daily accrual.',
  },
  {
    id: 'prod-3',
    name: 'Sycamore Equity Growth Fund',
    type: 'Equities',
    expectedReturnMin: 15,
    expectedReturnMax: 25,
    riskLevel: 'aggressive',
    minimumInvestment: 100000,
    liquidityLevel: 'Medium',
    investmentHorizon: '2-5 years',
    description: 'Diversified Nigerian equities for long-term capital appreciation.',
  },
  {
    id: 'prod-4',
    name: 'Sycamore Real Estate Fund',
    type: 'Real Estate',
    expectedReturnMin: 10,
    expectedReturnMax: 18,
    riskLevel: 'moderate',
    minimumInvestment: 250000,
    liquidityLevel: 'Low',
    investmentHorizon: '3-7 years',
    description: 'Invest in premium Nigerian commercial and residential real estate.',
  },
  {
    id: 'prod-5',
    name: 'Sycamore Balanced Fund',
    type: 'Fixed Income',
    expectedReturnMin: 11,
    expectedReturnMax: 16,
    riskLevel: 'moderate',
    minimumInvestment: 75000,
    liquidityLevel: 'Medium',
    investmentHorizon: '1-3 years',
    description: 'A balanced mix of fixed income and equities for steady growth.',
  },
];

const productColors: Record<ProductType, string> = {
  'Fixed Income': 'hsl(222, 47%, 35%)',
  'Money Market': 'hsl(152, 69%, 40%)',
  'Equities': 'hsl(38, 92%, 50%)',
  'Real Estate': 'hsl(262, 83%, 58%)',
  'Commodities': 'hsl(0, 84%, 60%)',
};

const personas: InvestorPersona[] = ['Income Seeker', 'Capital Preservation', 'Growth Focused', 'Balanced Investor'];
const riskLevels: RiskLevel[] = ['conservative', 'moderate', 'aggressive'];

// Generate mock investment profiles
export const generateInvestmentProfiles = (count: number = 50): InvestmentProfile[] => {
  const profiles: InvestmentProfile[] = [];
  const names = [
    'Adebayo Okonkwo', 'Chioma Nnamdi', 'Emeka Adeyemi', 'Fatima Ibrahim', 'Gbenga Afolabi',
    'Halima Bello', 'Ikenna Eze', 'Jumoke Adeleke', 'Kunle Obaseki', 'Lola Oduya',
    'Musa Aliyu', 'Ngozi Chukwu', 'Olumide Bakare', 'Patience Effiong', 'Quadri Salami',
    'Rashida Yusuf', 'Segun Adeniyi', 'Titi Okonkwo', 'Uche Nwachukwu', 'Victor Ajayi',
  ];

  for (let i = 0; i < count; i++) {
    const name = names[i % names.length];
    const financialHealthScore = Math.floor(Math.random() * 40) + 60;
    const riskTolerance = riskLevels[Math.floor(Math.random() * riskLevels.length)];
    const persona = personas[Math.floor(Math.random() * personas.length)];
    const totalLoans = Math.floor(Math.random() * 5) + 1;
    const onTimePayments = Math.floor(Math.random() * (totalLoans * 12)) + (totalLoans * 6);

    profiles.push({
      id: `inv-${i + 1}`,
      customerId: `cust-${i + 1}`,
      customerName: `${name} ${i > 19 ? i - 19 : ''}`.trim(),
      email: `${name.toLowerCase().replace(' ', '.')}${i > 19 ? i : ''}@email.com`,
      phone: `+234 ${Math.floor(Math.random() * 900000000) + 100000000}`,
      financialHealthScore,
      riskTolerance,
      investorPersona: persona,
      loanRepaymentSummary: {
        totalLoans,
        onTimePayments,
        latePayments: Math.floor(Math.random() * 3),
        defaulted: Math.random() > 0.9 ? 1 : 0,
        averageRepaymentDays: Math.floor(Math.random() * 5) + 25,
      },
      explainability: {
        summary: `Based on ${name}'s financial behavior and risk assessment, they are classified as a ${persona} with ${riskTolerance} risk tolerance.`,
        factors: [
          {
            feature: 'Income Stability',
            contribution: Math.floor(Math.random() * 30) + 20,
            description: 'Consistent monthly income from verified employment',
          },
          {
            feature: 'Loan Repayment History',
            contribution: financialHealthScore > 75 ? Math.floor(Math.random() * 20) + 15 : -Math.floor(Math.random() * 10),
            description: 'Historical loan repayment patterns and on-time payments',
          },
          {
            feature: 'Savings Behavior',
            contribution: Math.floor(Math.random() * 25) + 10,
            description: 'Regular savings deposits and emergency fund maintenance',
          },
          {
            feature: 'Digital Transactions',
            contribution: Math.floor(Math.random() * 15) + 5,
            description: 'E-commerce and mobile money transaction frequency',
          },
          {
            feature: 'Age & Financial Maturity',
            contribution: Math.floor(Math.random() * 10) + 5,
            description: 'Years of financial history and account age',
          },
        ],
      },
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  return profiles;
};

// Generate portfolios
export const generatePortfolios = (profiles: InvestmentProfile[]): Portfolio[] => {
  return profiles.slice(0, 30).map((profile, i) => {
    const totalInvested = Math.floor(Math.random() * 5000000) + 500000;
    const returnPercentage = Math.random() * 20 - 5;
    const totalReturns = totalInvested * (returnPercentage / 100);
    const statuses: PortfolioStatus[] = ['stable', 'over-exposed', 'needs-rebalancing'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    const allocations: AssetAllocation[] = [];
    let remaining = 100;
    const productTypes: ProductType[] = ['Fixed Income', 'Money Market', 'Equities', 'Real Estate'];

    productTypes.forEach((type, idx) => {
      if (idx === productTypes.length - 1) {
        allocations.push({
          productType: type,
          percentage: remaining,
          currentValue: totalInvested * (remaining / 100),
          targetPercentage: remaining + (Math.random() * 10 - 5),
          color: productColors[type],
        });
      } else {
        const pct = Math.floor(Math.random() * (remaining / 2)) + 10;
        remaining -= pct;
        allocations.push({
          productType: type,
          percentage: pct,
          currentValue: totalInvested * (pct / 100),
          targetPercentage: pct + (Math.random() * 10 - 5),
          color: productColors[type],
        });
      }
    });

    return {
      id: `port-${i + 1}`,
      customerId: profile.customerId,
      customerName: profile.customerName,
      totalValue: totalInvested + totalReturns,
      totalInvested,
      totalReturns,
      returnPercentage,
      status,
      allocations,
      riskScore: Math.floor(Math.random() * 60) + 20,
      lastRebalanced: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      rebalancingSuggestions: status !== 'stable' ? [
        {
          productType: 'Equities',
          currentPercentage: allocations.find(a => a.productType === 'Equities')?.percentage || 0,
          targetPercentage: 25,
          action: 'decrease',
          amount: 150000,
          reason: 'Reduce equity exposure due to market volatility',
        },
        {
          productType: 'Fixed Income',
          currentPercentage: allocations.find(a => a.productType === 'Fixed Income')?.percentage || 0,
          targetPercentage: 40,
          action: 'increase',
          amount: 150000,
          reason: 'Increase fixed income for stability',
        },
      ] : [],
    };
  });
};

// Generate recommendations
export const generateRecommendations = (profiles: InvestmentProfile[]): InvestmentRecommendation[] => {
  return profiles.map((profile, i) => {
    const selectedProducts = investmentProducts.filter(p => {
      if (profile.riskTolerance === 'conservative') return p.riskLevel !== 'aggressive';
      if (profile.riskTolerance === 'aggressive') return true;
      return p.riskLevel !== 'aggressive' || Math.random() > 0.5;
    }).slice(0, 3);

    const baseAmount = Math.floor(Math.random() * 2000000) + 500000;
    let remainingPct = 100;

    const recommendedProducts = selectedProducts.map((product, idx) => {
      const pct = idx === selectedProducts.length - 1 ? remainingPct : Math.floor(remainingPct / (selectedProducts.length - idx));
      remainingPct -= pct;
      return {
        product,
        allocationPercentage: pct,
        investmentAmount: baseAmount * (pct / 100),
        reasoning: `Aligned with ${profile.investorPersona} profile and ${profile.riskTolerance} risk tolerance.`,
      };
    });

    return {
      id: `rec-${i + 1}`,
      customerId: profile.customerId,
      customerName: profile.customerName,
      products: recommendedProducts,
      suggestedAllocation: recommendedProducts.map(rp => ({
        productType: rp.product.type,
        percentage: rp.allocationPercentage,
        currentValue: 0,
        targetPercentage: rp.allocationPercentage,
        color: productColors[rp.product.type],
      })),
      expectedReturnRange: {
        min: Math.min(...selectedProducts.map(p => p.expectedReturnMin)),
        max: Math.max(...selectedProducts.map(p => p.expectedReturnMax)),
      },
      overallRiskLevel: profile.riskTolerance,
      investmentHorizon: profile.riskTolerance === 'aggressive' ? '3-5 years' : profile.riskTolerance === 'moderate' ? '1-3 years' : '6-12 months',
      liquidityNeeds: profile.investorPersona === 'Income Seeker' ? 'High' : 'Medium',
      rationale: `Based on ${profile.customerName}'s financial health score of ${profile.financialHealthScore} and ${profile.investorPersona} persona, we recommend a ${profile.riskTolerance} investment approach.`,
      generatedAt: new Date().toISOString(),
      status: ['pending', 'accepted', 'declined'][Math.floor(Math.random() * 3)] as 'pending' | 'accepted' | 'declined',
    };
  });
};

// Generate AUM metrics
export const generateAUMMetrics = (): AUMMetrics => {
  const totalAUM = 2500000000; // 2.5 billion Naira
  const months = 12;
  const aumHistory = [];
  let runningAUM = totalAUM * 0.7;

  for (let i = months; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    runningAUM *= (1 + (Math.random() * 0.05));
    aumHistory.push({
      date: date.toISOString().split('T')[0],
      value: Math.floor(runningAUM),
    });
  }

  return {
    totalAUM,
    aumGrowth: 23.5,
    activeInvestors: 1247,
    averagePortfolioSize: totalAUM / 1247,
    productDistribution: [
      { productType: 'Fixed Income', value: totalAUM * 0.35, percentage: 35 },
      { productType: 'Money Market', value: totalAUM * 0.25, percentage: 25 },
      { productType: 'Equities', value: totalAUM * 0.20, percentage: 20 },
      { productType: 'Real Estate', value: totalAUM * 0.15, percentage: 15 },
      { productType: 'Commodities', value: totalAUM * 0.05, percentage: 5 },
    ],
    aumHistory,
  };
};

// Generate risk metrics
export const generateRiskMetrics = (profiles: InvestmentProfile[]): RiskMetrics => {
  const conservativeCount = profiles.filter(p => p.riskTolerance === 'conservative').length;
  const moderateCount = profiles.filter(p => p.riskTolerance === 'moderate').length;
  const aggressiveCount = profiles.filter(p => p.riskTolerance === 'aggressive').length;

  const concentrationAlerts: ConcentrationAlert[] = profiles.slice(0, 5).map((p, i) => ({
    id: `alert-${i + 1}`,
    customerId: p.customerId,
    customerName: p.customerName,
    productType: 'Equities',
    concentration: 45 + Math.random() * 20,
    threshold: 40,
    severity: (['low', 'medium', 'high'] as const)[Math.floor(Math.random() * 3)],
  }));

  const liquidityIndicators: LiquidityIndicator[] = profiles.slice(0, 8).map((p, i) => {
    const liquidityRatio = Math.random() * 0.6;
    return {
      id: `liq-${i + 1}`,
      customerId: p.customerId,
      customerName: p.customerName,
      liquidAssets: Math.floor(Math.random() * 1000000) + 100000,
      totalAssets: Math.floor(Math.random() * 5000000) + 500000,
      liquidityRatio,
      status: liquidityRatio > 0.3 ? 'healthy' : liquidityRatio > 0.15 ? 'warning' : 'critical',
    };
  });

  return {
    averageRiskScore: 52,
    riskDistribution: {
      conservative: conservativeCount,
      moderate: moderateCount,
      aggressive: aggressiveCount,
    },
    concentrationAlerts,
    liquidityStressIndicators: liquidityIndicators,
  };
};

// Generate investor segments
export const generateInvestorSegments = (profiles: InvestmentProfile[]): InvestorSegment[] => {
  return personas.map(persona => {
    const segmentProfiles = profiles.filter(p => p.investorPersona === persona);
    return {
      segment: persona,
      count: segmentProfiles.length,
      totalAUM: Math.floor(Math.random() * 500000000) + 100000000,
      averageRiskScore: Math.floor(Math.random() * 30) + 40,
      averageReturns: Math.random() * 15 + 5,
    };
  });
};

// Export all mock data
export const mockProfiles = generateInvestmentProfiles(50);
export const mockPortfolios = generatePortfolios(mockProfiles);
export const mockRecommendations = generateRecommendations(mockProfiles);
export const mockAUMMetrics = generateAUMMetrics();
export const mockRiskMetrics = generateRiskMetrics(mockProfiles);
export const mockInvestorSegments = generateInvestorSegments(mockProfiles);

// Utility functions
export { formatNaira as formatCurrency } from '@/lib/utils';

export const formatPercentage = (value: number): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
};

export const getRiskLevelColor = (level: RiskLevel): string => {
  switch (level) {
    case 'conservative': return 'risk-low';
    case 'moderate': return 'risk-medium';
    case 'aggressive': return 'risk-high';
  }
};

export const getStatusColor = (status: PortfolioStatus): string => {
  switch (status) {
    case 'stable': return 'risk-low';
    case 'needs-rebalancing': return 'risk-medium';
    case 'over-exposed': return 'risk-high';
  }
};
