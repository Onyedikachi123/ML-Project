import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AllocationChart, StatusBadge, RiskReturnChart } from '@/components/asset-management';
import { assetManagementApi, queryKeys } from '@/services/assetManagementApi';
import { formatPercentage } from '@/data/mockAssetManagement';
import { formatNaira } from '@/lib/utils';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const PortfolioViewer = () => {
  const { id } = useParams<{ id: string }>();
  const { data: portfolio, isLoading } = useQuery({ queryKey: queryKeys.portfolio(id || ''), queryFn: () => assetManagementApi.getPortfolio(id || ''), enabled: !!id });

  const handleRebalance = async () => {
    if (portfolio) {
      await assetManagementApi.rebalancePortfolio(portfolio.id);
      toast.success('Rebalancing initiated!');
    }
  };

  if (isLoading) return <DashboardLayout><div className="animate-pulse">Loading...</div></DashboardLayout>;
  if (!portfolio) return <DashboardLayout><div>Portfolio not found</div></DashboardLayout>;

  const riskReturnData = portfolio.allocations.map(a => ({ name: a.productType, risk: Math.random() * 60 + 20, returns: portfolio.returnPercentage + (Math.random() * 10 - 5), value: a.currentValue }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Link to={`/asset-management/customers/${portfolio.customerId}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back to Profile</Link>

        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Portfolio Overview</h1>
            <p className="text-muted-foreground">{portfolio.customerName}</p>
          </div>
          <StatusBadge status={portfolio.status} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border border-border shadow-card p-4"><p className="text-sm text-muted-foreground">Total Value</p><p className="text-2xl font-bold text-foreground">{formatNaira(portfolio.totalValue)}</p></div>
          <div className="bg-card rounded-lg border border-border shadow-card p-4"><p className="text-sm text-muted-foreground">Invested</p><p className="text-2xl font-bold text-foreground">{formatNaira(portfolio.totalInvested)}</p></div>
          <div className="bg-card rounded-lg border border-border shadow-card p-4"><p className="text-sm text-muted-foreground">Returns</p><p className={`text-2xl font-bold ${portfolio.totalReturns >= 0 ? 'text-risk-low' : 'text-risk-high'}`}>{formatNaira(portfolio.totalReturns)}</p></div>
          <div className="bg-card rounded-lg border border-border shadow-card p-4"><p className="text-sm text-muted-foreground">Return %</p><p className={`text-2xl font-bold ${portfolio.returnPercentage >= 0 ? 'text-risk-low' : 'text-risk-high'}`}>{formatPercentage(portfolio.returnPercentage)}</p></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg border border-border shadow-card p-6">
            <h3 className="font-semibold text-foreground mb-4">Current Allocation</h3>
            <AllocationChart allocations={portfolio.allocations} showValues />
          </div>
          <div className="bg-card rounded-lg border border-border shadow-card p-6">
            <h3 className="font-semibold text-foreground mb-4">Risk vs Return</h3>
            <RiskReturnChart data={riskReturnData} />
          </div>
        </div>

        {portfolio.rebalancingSuggestions.length > 0 && (
          <div className="bg-card rounded-lg border border-border shadow-card p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-foreground">Rebalancing Suggestions</h3>
              <Button onClick={handleRebalance} size="sm"><RefreshCw className="h-4 w-4 mr-2" /> Rebalance</Button>
            </div>
            <div className="space-y-3">
              {portfolio.rebalancingSuggestions.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div><p className="font-medium">{s.productType}</p><p className="text-sm text-muted-foreground">{s.reason}</p></div>
                  <div className="text-right">
                    <span className={`text-sm font-medium ${s.action === 'increase' ? 'text-risk-low' : 'text-risk-high'}`}>{s.action === 'increase' ? '↑' : '↓'} {formatNaira(s.amount)}</span>
                    <p className="text-xs text-muted-foreground">{s.currentPercentage.toFixed(0)}% → {s.targetPercentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PortfolioViewer;
