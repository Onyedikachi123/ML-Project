import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RiskBadge, AllocationChart, ProductCard } from '@/components/asset-management';
import { assetManagementApi, queryKeys } from '@/services/assetManagementApi';
import { ArrowLeft, Clock, Droplets, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const InvestmentRecommendation = () => {
  const { id } = useParams<{ id: string }>();
  const { data: recommendation, isLoading } = useQuery({ queryKey: queryKeys.recommendation(id || ''), queryFn: () => assetManagementApi.getRecommendation(id || ''), enabled: !!id });

  const handleAccept = async () => {
    if (recommendation) {
      await assetManagementApi.acceptRecommendation(recommendation.id);
      toast.success('Recommendation accepted!');
    }
  };

  if (isLoading) return <DashboardLayout><div className="animate-pulse">Loading...</div></DashboardLayout>;
  if (!recommendation) return <DashboardLayout><div>Recommendation not found</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Link to={`/asset-management/customers/${recommendation.customerId}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back to Profile</Link>
        
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Investment Recommendation</h1>
            <p className="text-muted-foreground">Personalized for {recommendation.customerName}</p>
          </div>
          <RiskBadge level={recommendation.overallRiskLevel} size="lg" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-lg border border-border shadow-card p-4 flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-risk-low" />
            <div><p className="text-sm text-muted-foreground">Expected Returns</p><p className="font-bold text-lg">{recommendation.expectedReturnRange.min}-{recommendation.expectedReturnRange.max}%</p></div>
          </div>
          <div className="bg-card rounded-lg border border-border shadow-card p-4 flex items-center gap-3">
            <Clock className="h-8 w-8 text-primary" />
            <div><p className="text-sm text-muted-foreground">Investment Horizon</p><p className="font-bold text-lg">{recommendation.investmentHorizon}</p></div>
          </div>
          <div className="bg-card rounded-lg border border-border shadow-card p-4 flex items-center gap-3">
            <Droplets className="h-8 w-8 text-chart-3" />
            <div><p className="text-sm text-muted-foreground">Liquidity Needs</p><p className="font-bold text-lg">{recommendation.liquidityNeeds}</p></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-semibold text-foreground">Recommended Products</h3>
            {recommendation.products.map((rp, i) => (
              <ProductCard key={i} product={rp.product} allocationPercentage={rp.allocationPercentage} investmentAmount={rp.investmentAmount} reasoning={rp.reasoning} />
            ))}
          </div>
          <div className="bg-card rounded-lg border border-border shadow-card p-6">
            <h3 className="font-semibold text-foreground mb-4">Suggested Allocation</h3>
            <AllocationChart allocations={recommendation.suggestedAllocation} size="sm" />
            <p className="text-sm text-muted-foreground mt-4 italic">"{recommendation.rationale}"</p>
            <div className="mt-6 space-y-2">
              <Button onClick={handleAccept} className="w-full">Accept Recommendation</Button>
              <Button variant="outline" className="w-full">Adjust Risk Preference</Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InvestmentRecommendation;
