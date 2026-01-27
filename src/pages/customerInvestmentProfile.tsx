import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RiskBadge, ExplainabilityCard } from '@/components/asset-management';
import { assetManagementApi, queryKeys } from '@/services/assetManagementApi';
import { ArrowLeft, Mail, Phone, Calendar, CreditCard } from 'lucide-react';

const CustomerInvestmentProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { data: profile, isLoading } = useQuery({ queryKey: queryKeys.profile(id || ''), queryFn: () => assetManagementApi.getInvestmentProfile(id || ''), enabled: !!id });

  if (isLoading) return <DashboardLayout><div className="animate-pulse">Loading...</div></DashboardLayout>;
  if (!profile) return <DashboardLayout><div>Customer not found</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Link to="/asset-management" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back</Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{profile.customerName}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <span className="flex items-center gap-1"><Mail className="h-4 w-4" />{profile.email}</span>
              <span className="flex items-center gap-1"><Phone className="h-4 w-4" />{profile.phone}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <RiskBadge level={profile.riskTolerance} size="lg" />
            <span className="px-3 py-1.5 bg-primary/10 text-primary rounded-full font-medium">{profile.investorPersona}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-lg border border-border shadow-card p-6 text-center">
            <p className="text-sm text-muted-foreground">Financial Health Score</p>
            <p className="text-4xl font-bold text-primary mt-2">{profile.financialHealthScore}</p>
            <p className="text-xs text-muted-foreground mt-1">out of 100</p>
          </div>
          <div className="bg-card rounded-lg border border-border shadow-card p-6">
            <p className="text-sm text-muted-foreground mb-2">Loan Repayment Summary</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-muted-foreground">Total Loans:</span> <span className="font-medium">{profile.loanRepaymentSummary.totalLoans}</span></div>
              <div><span className="text-muted-foreground">On-time:</span> <span className="font-medium text-risk-low">{profile.loanRepaymentSummary.onTimePayments}</span></div>
              <div><span className="text-muted-foreground">Late:</span> <span className="font-medium text-risk-medium">{profile.loanRepaymentSummary.latePayments}</span></div>
              <div><span className="text-muted-foreground">Defaulted:</span> <span className="font-medium text-risk-high">{profile.loanRepaymentSummary.defaulted}</span></div>
            </div>
          </div>
          <div className="bg-card rounded-lg border border-border shadow-card p-6 flex flex-col justify-center">
            <Link to={`/asset-management/recommendations/${profile.customerId}`} className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg text-center font-medium hover:bg-primary/90 transition-colors">View Recommendations</Link>
            <Link to={`/asset-management/portfolio/${profile.customerId}`} className="w-full py-2 px-4 border border-border rounded-lg text-center font-medium mt-2 hover:bg-muted transition-colors">View Portfolio</Link>
          </div>
        </div>

        <ExplainabilityCard summary={profile.explainability.summary} factors={profile.explainability.factors} />
      </div>
    </DashboardLayout>
  );
};

export default CustomerInvestmentProfile;
