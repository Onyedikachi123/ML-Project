import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RiskCard } from '@/components/dashboard/RiskCard';
import { RiskFilter } from '@/components/dashboard/RiskFilter';
import { Input } from '@/components/ui/input';
import { 
  mockApplicants, 
  getRiskLevel, 
  type RiskLevel 
} from '@/data/mockApplicants';

const Applicants = () => {
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredApplicants = useMemo(() => {
    let result = mockApplicants;
    
    if (riskFilter !== 'all') {
      result = result.filter(a => getRiskLevel(a.risk_score) === riskFilter);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(a => 
        a.name.toLowerCase().includes(query) ||
        a.education.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [riskFilter, searchQuery]);

  const riskCounts = useMemo(() => ({
    all: mockApplicants.length,
    low: mockApplicants.filter(a => getRiskLevel(a.risk_score) === 'low').length,
    medium: mockApplicants.filter(a => getRiskLevel(a.risk_score) === 'medium').length,
    high: mockApplicants.filter(a => getRiskLevel(a.risk_score) === 'high').length,
  }), []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            All Applicants
          </h1>
          <p className="text-muted-foreground mt-1">
            Browse and manage loan applicant profiles
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <RiskFilter 
            currentFilter={riskFilter} 
            onFilterChange={setRiskFilter}
            counts={riskCounts}
          />
          <div className="lg:ml-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search applicants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full lg:w-64"
            />
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground">
          Showing {filteredApplicants.length} of {mockApplicants.length} applicants
        </p>

        {/* Applicant Cards Grid */}
        {filteredApplicants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredApplicants.map((applicant, index) => (
              <div 
                key={applicant.id} 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <RiskCard applicant={applicant} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card rounded-xl border border-border">
            <p className="text-muted-foreground">No applicants found matching your criteria.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Applicants;
