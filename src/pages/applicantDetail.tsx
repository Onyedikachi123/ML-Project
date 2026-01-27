import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ApplicantCard } from '@/components/applicant/ApplicantCard';
import { getApplicantById } from '@/data/mockApplicants';
import { Button } from '@/components/ui/button';

const ApplicantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const applicant = getApplicantById(Number(id));

  if (!applicant) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Applicant Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The applicant you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back Navigation */}
        <div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        {/* Applicant Details */}
        <ApplicantCard applicant={applicant} />
      </div>
    </DashboardLayout>
  );
};

export default ApplicantDetail;
