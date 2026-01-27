import { useState, useMemo } from 'react';
import { formatNaira } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { ChevronUp, ChevronDown, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Applicant, getRiskLevel, getRiskLabel } from '@/data/mockApplicants';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ApplicantTableProps {
  applicants: Applicant[];
}

type SortField = 'name' | 'age' | 'income' | 'risk_score' | 'recommended_loan';
type SortDirection = 'asc' | 'desc';

const riskBadgeStyles = {
  low: 'bg-risk-low-bg text-risk-low border-risk-low/30',
  medium: 'bg-risk-medium-bg text-risk-medium border-risk-medium/30',
  high: 'bg-risk-high-bg text-risk-high border-risk-high/30',
};

export const ApplicantTable = ({ applicants }: ApplicantTableProps) => {
  const [sortField, setSortField] = useState<SortField>('risk_score');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const sortedApplicants = useMemo(() => {
    return [...applicants].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'age':
          comparison = a.age - b.age;
          break;
        case 'income':
          comparison = a.income - b.income;
          break;
        case 'risk_score':
          comparison = a.risk_score - b.risk_score;
          break;
        case 'recommended_loan':
          comparison = a.recommended_loan - b.recommended_loan;
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [applicants, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ChevronDown className="h-4 w-4 text-muted-foreground/50" />;
    }
    return sortDirection === 'asc'
      ? <ChevronUp className="h-4 w-4 text-foreground" />
      : <ChevronDown className="h-4 w-4 text-foreground" />;
  };

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-foreground transition-colors group"
    >
      <span>{children}</span>
      <SortIcon field={field} />
    </button>
  );

  return (
    <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold">
                <SortableHeader field="name">Name</SortableHeader>
              </TableHead>
              <TableHead className="font-semibold">
                <SortableHeader field="age">Age</SortableHeader>
              </TableHead>
              <TableHead className="font-semibold">
                <SortableHeader field="income">Income</SortableHeader>
              </TableHead>
              <TableHead className="font-semibold">
                <SortableHeader field="risk_score">Risk Score</SortableHeader>
              </TableHead>
              <TableHead className="font-semibold">
                <SortableHeader field="recommended_loan">Recommended Loan</SortableHeader>
              </TableHead>
              <TableHead className="font-semibold">Schedule</TableHead>
              <TableHead className="font-semibold text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedApplicants.map((applicant, index) => {
              const riskLevel = getRiskLevel(applicant.risk_score);
              return (
                <TableRow
                  key={applicant.id}
                  className="hover:bg-muted/30 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 20}ms` }}
                >
                  <TableCell>
                    <div className="font-medium text-foreground">{applicant.name}</div>
                    <div className="text-xs text-muted-foreground">{applicant.education}</div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{applicant.age}</TableCell>
                  <TableCell className="font-medium">
                    {formatNaira(applicant.income)}
                  </TableCell>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className={cn(
                          "inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-sm font-medium border cursor-help",
                          riskBadgeStyles[riskLevel]
                        )}>
                          <span>{(applicant.risk_score * 100).toFixed(0)}%</span>
                          <span className="text-xs opacity-70">
                            {getRiskLabel(applicant.risk_score)}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Probability of default: {(applicant.risk_score * 100).toFixed(1)}%</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">
                    {formatNaira(applicant.recommended_loan)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {applicant.repayment_schedule}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="sm" variant="ghost">
                      <Link to={`/applicant/${applicant.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
