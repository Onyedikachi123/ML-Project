import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard, RiskBadge, StatusBadge } from '@/components/asset-management';
import { assetManagementApi, queryKeys } from '@/services/assetManagementApi';
import { formatNaira } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, Users, TrendingDown, Droplets } from 'lucide-react';

const AdminAssetManagement = () => {
  const { data: segments } = useQuery({ queryKey: queryKeys.investorSegments, queryFn: assetManagementApi.getInvestorSegments });
  const { data: riskMetrics } = useQuery({ queryKey: queryKeys.riskMetrics, queryFn: assetManagementApi.getRiskMetrics });
  const { data: portfolios } = useQuery({ queryKey: queryKeys.portfolios, queryFn: assetManagementApi.getPortfolios });

  const atRiskPortfolios = portfolios?.filter(p => p.status !== 'stable') || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Portfolio risk monitoring & investor management</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Concentration Alerts" value={riskMetrics?.concentrationAlerts.length || 0} icon={AlertTriangle} variant="danger" />
          <StatCard title="Liquidity Warnings" value={riskMetrics?.liquidityStressIndicators.filter(l => l.status !== 'healthy').length || 0} icon={Droplets} variant="warning" />
          <StatCard title="At-Risk Portfolios" value={atRiskPortfolios.length} icon={TrendingDown} variant="warning" />
          <StatCard title="Total Investors" value={segments?.reduce((sum, s) => sum + s.count, 0) || 0} icon={Users} variant="primary" />
        </div>

        <div className="bg-card rounded-lg border border-border shadow-card p-6">
          <h3 className="font-semibold text-foreground mb-4">Investor Segmentation</h3>
          <Table>
            <TableHeader><TableRow><TableHead>Segment</TableHead><TableHead>Count</TableHead><TableHead>Total AUM</TableHead><TableHead>Avg Risk</TableHead><TableHead>Avg Returns</TableHead></TableRow></TableHeader>
            <TableBody>
              {segments?.map((seg, i) => (
                <TableRow key={i}><TableCell className="font-medium">{seg.segment}</TableCell><TableCell>{seg.count}</TableCell><TableCell>{formatNaira(seg.totalAUM)}</TableCell><TableCell>{seg.averageRiskScore}</TableCell><TableCell className={seg.averageReturns >= 0 ? 'text-risk-low' : 'text-risk-high'}>{seg.averageReturns.toFixed(1)}%</TableCell></TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg border border-border shadow-card p-6">
            <h3 className="font-semibold text-foreground mb-4">Concentration Alerts</h3>
            <div className="space-y-3">
              {riskMetrics?.concentrationAlerts.slice(0, 5).map((alert) => (
                <Link to={`/asset-management/portfolio/${alert.customerId}`} key={alert.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted transition-colors">
                  <div><p className="font-medium">{alert.customerName}</p><p className="text-sm text-muted-foreground">{alert.productType} at {alert.concentration.toFixed(0)}%</p></div>
                  <RiskBadge level={alert.severity === 'high' ? 'aggressive' : alert.severity === 'medium' ? 'moderate' : 'conservative'} size="sm" />
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border shadow-card p-6">
            <h3 className="font-semibold text-foreground mb-4">Liquidity Stress Indicators</h3>
            <div className="space-y-3">
              {riskMetrics?.liquidityStressIndicators.slice(0, 5).map((ind) => (
                <Link to={`/asset-management/portfolio/${ind.customerId}`} key={ind.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted transition-colors">
                  <div><p className="font-medium">{ind.customerName}</p><p className="text-sm text-muted-foreground">Liquidity: {(ind.liquidityRatio * 100).toFixed(0)}%</p></div>
                  <StatusBadge status={ind.status} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminAssetManagement;
