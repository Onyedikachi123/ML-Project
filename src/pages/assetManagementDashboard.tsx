import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard, AllocationChart, AUMChart, RiskDistributionChart } from '@/components/asset-management';
import { assetManagementApi, queryKeys } from '@/services/assetManagementApi';
import { formatNaira } from '@/lib/utils';
import { Wallet, Users, TrendingUp, PieChart } from 'lucide-react';

const AssetManagementDashboard = () => {
  const { data: aumMetrics } = useQuery({ queryKey: queryKeys.aumMetrics, queryFn: assetManagementApi.getAUMMetrics });
  const { data: riskMetrics } = useQuery({ queryKey: queryKeys.riskMetrics, queryFn: assetManagementApi.getRiskMetrics });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Asset Management</h1>
          <p className="text-muted-foreground">Overview of assets under management</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total AUM" value={formatNaira(aumMetrics?.totalAUM || 0)} icon={Wallet} variant="primary" trend={{ value: aumMetrics?.aumGrowth || 0, label: 'vs last year' }} />
          <StatCard title="Active Investors" value={aumMetrics?.activeInvestors?.toLocaleString() || '0'} icon={Users} variant="success" />
          <StatCard title="Avg. Portfolio Size" value={formatNaira(aumMetrics?.averagePortfolioSize || 0)} icon={TrendingUp} />
          <StatCard title="Avg. Risk Score" value={riskMetrics?.averageRiskScore || 0} icon={PieChart} variant="warning" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg border border-border shadow-card p-6">
            <h3 className="font-semibold text-foreground mb-4">Product Distribution</h3>
            {aumMetrics && <AllocationChart allocations={aumMetrics.productDistribution.map(p => ({ productType: p.productType, percentage: p.percentage, currentValue: p.value, targetPercentage: p.percentage, color: '' }))} />}
          </div>
          <div className="bg-card rounded-lg border border-border shadow-card p-6">
            <h3 className="font-semibold text-foreground mb-4">Risk Distribution</h3>
            {riskMetrics && <RiskDistributionChart data={riskMetrics.riskDistribution} />}
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border shadow-card p-6">
          <h3 className="font-semibold text-foreground mb-4">AUM Growth</h3>
          {aumMetrics && <AUMChart data={aumMetrics.aumHistory} />}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AssetManagementDashboard;
