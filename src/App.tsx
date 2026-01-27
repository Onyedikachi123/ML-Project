import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "@/pages/dashboard";
import Applicants from "@/pages/applicants";
import ApplicantDetail from "@/pages/applicantDetail";
import AssetManagementDashboard from "@/pages/assetManagementDashboard";
import CustomerInvestmentProfile from "@/pages/customerInvestmentProfile";
import InvestmentRecommendation from "@/pages/investmentRecommendation";
import PortfolioViewer from "@/pages/portfolioViewer";
import AdminAssetManagement from "@/pages/adminAssetManagement";
import CreditScoring from "@/pages/creditScoring";
import NotFound from "@/pages/notFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/applicants" element={<Applicants />} />
          <Route path="/credit-scoring" element={<CreditScoring />} />
          <Route path="/applicant/:id" element={<ApplicantDetail />} />
          <Route path="/asset-management" element={<AssetManagementDashboard />} />
          <Route path="/asset-management/customers/:id" element={<CustomerInvestmentProfile />} />
          <Route path="/asset-management/recommendations/:id" element={<InvestmentRecommendation />} />
          <Route path="/asset-management/portfolio/:id" element={<PortfolioViewer />} />
          <Route path="/admin/asset-management" element={<AdminAssetManagement />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
