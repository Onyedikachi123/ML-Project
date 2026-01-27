import { Applicant, getRiskLevel, getRiskLabel } from '@/data/mockApplicants';
import { cn, formatNaira } from '@/lib/utils';
import {
  User,
  Briefcase,
  CreditCard,
  Calendar,
  Wallet,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface ApplicantCardProps {
  applicant: Applicant;
}

const riskStyles = {
  low: {
    bg: 'bg-risk-low-bg',
    text: 'text-risk-low',
    border: 'border-risk-low/30',
    icon: CheckCircle,
  },
  medium: {
    bg: 'bg-risk-medium-bg',
    text: 'text-risk-medium',
    border: 'border-risk-medium/30',
    icon: AlertTriangle,
  },
  high: {
    bg: 'bg-risk-high-bg',
    text: 'text-risk-high',
    border: 'border-risk-high/30',
    icon: XCircle,
  },
};

export const ApplicantCard = ({ applicant }: ApplicantCardProps) => {
  const riskLevel = getRiskLevel(applicant.risk_score);
  const styles = riskStyles[riskLevel];
  const RiskIcon = styles.icon;
  const loanReadiness = Math.round((1 - applicant.risk_score) * 100);

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
            <User className="h-10 w-10 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground mb-1">{applicant.name}</h1>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Age {applicant.age}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                {applicant.education}
              </span>
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {applicant.marital_status}
              </span>
            </div>
          </div>
          <div className={cn(
            "px-4 py-3 rounded-xl border flex items-center gap-3",
            styles.bg,
            styles.border
          )}>
            <RiskIcon className={cn("h-8 w-8", styles.text)} />
            <div>
              <p className="text-sm text-muted-foreground">Risk Level</p>
              <p className={cn("text-xl font-bold", styles.text)}>
                {getRiskLabel(applicant.risk_score)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Loan Readiness Score */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-card">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Loan Readiness Score
        </h2>
        <div className="flex items-center gap-6">
          <div className="relative h-32 w-32">
            <svg className="h-32 w-32 -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={riskLevel === 'low' ? 'hsl(var(--risk-low))' : riskLevel === 'medium' ? 'hsl(var(--risk-medium))' : 'hsl(var(--risk-high))'}
                strokeWidth="3"
                strokeDasharray={`${loanReadiness}, 100`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={cn("text-3xl font-bold", styles.text)}>{loanReadiness}%</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-muted-foreground mb-3">
              Based on credit history, income, and payment behavior, this applicant has a
              <span className={cn("font-semibold", styles.text)}> {loanReadiness}% loan readiness score</span>.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Default Probability</p>
                <p className="text-lg font-semibold text-foreground">
                  {(applicant.risk_score * 100).toFixed(1)}%
                </p>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Credit Limit</p>
                <p className="text-lg font-semibold text-foreground">
                  {formatNaira(applicant.credit_limit)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loan Recommendation */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-6 shadow-card">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Wallet className="h-5 w-5 text-risk-low" />
            Recommended Loan
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-3xl font-bold text-foreground">
                {formatNaira(applicant.recommended_loan)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Maximum suggested loan amount
              </p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Annual Income</span>
                <span className="font-semibold">{formatNaira(applicant.income)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Loan-to-Income</span>
                <span className="font-semibold">
                  {((applicant.recommended_loan / applicant.income) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 shadow-card">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Repayment Plan
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-3xl font-bold text-foreground">
                {applicant.repayment_schedule}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Suggested repayment period
              </p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Monthly Payment</span>
                <span className="font-semibold">
                  {formatNaira(Math.round(applicant.recommended_loan / parseInt(applicant.repayment_schedule)))}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Bill Amount</span>
                <span className="font-semibold">{formatNaira(applicant.bill_amount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Influencing Factors */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-card">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Top Factors Influencing Score (Explainable AI)
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {applicant.top_factors.map((factor, index) => (
            <div
              key={factor}
              className={cn(
                "relative overflow-hidden rounded-xl p-5 border transition-all duration-300 hover:shadow-md",
                index === 0 ? "bg-risk-low-bg border-risk-low/20" :
                  index === 1 ? "bg-risk-medium-bg border-risk-medium/20" :
                    "bg-muted border-border"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
                  index === 0 ? "bg-risk-low text-white" :
                    index === 1 ? "bg-risk-medium text-white" :
                      "bg-muted-foreground text-white"
                )}>
                  {index + 1}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{factor}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {index === 0 ? 'Primary factor' : index === 1 ? 'Secondary factor' : 'Contributing factor'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
