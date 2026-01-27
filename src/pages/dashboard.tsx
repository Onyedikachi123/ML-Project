import { useState, useMemo } from 'react';
import { formatNaira } from '@/lib/utils';
import { Users, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { LoanChart } from '@/components/dashboard/LoanChart';
import { ApplicantTable } from '@/components/dashboard/ApplicantTable';
import { RiskFilter } from '@/components/dashboard/RiskFilter';
import {
  mockApplicants,
  getRiskLevel,
  getAverageRiskScore,
  getTotalRecommendedLoan,
  type RiskLevel
} from '@/data/mockApplicants';

const Dashboard = () => {
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'all'>('all');

  const filteredApplicants = useMemo(() => {
    if (riskFilter === 'all') return mockApplicants;
    return mockApplicants.filter(a => getRiskLevel(a.risk_score) === riskFilter);
  }, [riskFilter]);

  const riskCounts = useMemo(() => ({
    all: mockApplicants.length,
    low: mockApplicants.filter(a => getRiskLevel(a.risk_score) === 'low').length,
    medium: mockApplicants.filter(a => getRiskLevel(a.risk_score) === 'medium').length,
    high: mockApplicants.filter(a => getRiskLevel(a.risk_score) === 'high').length,
  }), []);

  const averageRiskScore = getAverageRiskScore();
  const totalRecommendedLoan = getTotalRecommendedLoan();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Risk Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitor loan applicants and risk metrics
            </p>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Applicants"
            value={mockApplicants.length}
            subtitle="Active loan applications"
            icon={Users}
            variant="primary"
          />
          <MetricCard
            title="Average Risk Score"
            value={`${(averageRiskScore * 100).toFixed(1)}%`}
            subtitle="Across all applicants"
            icon={TrendingUp}
            trend={{ value: 2.3, isPositive: false }}
          />
          <MetricCard
            title="Total Recommended"
            value={formatNaira(totalRecommendedLoan)}
            subtitle="Total loan amount"
            icon={DollarSign}
            variant="success"
          />
          <MetricCard
            title="High Risk"
            value={riskCounts.high}
            subtitle={`${((riskCounts.high / riskCounts.all) * 100).toFixed(0)}% of applicants`}
            icon={AlertTriangle}
            variant="danger"
          />
        </div>

        {/* Risk Distribution Chart */}
        <LoanChart applicants={mockApplicants} />

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl font-semibold text-foreground">Loan Applicants</h2>
          <RiskFilter
            currentFilter={riskFilter}
            onFilterChange={setRiskFilter}
            counts={riskCounts}
          />
        </div>

        {/* Applicants Table */}
        <ApplicantTable applicants={filteredApplicants} />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
