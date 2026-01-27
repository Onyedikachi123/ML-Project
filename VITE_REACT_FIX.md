# Vite + React Build Fix: "Could not resolve ./pages/index"

## 🚨 Error Explained

### The Build Error

```
Could not resolve "./pages/index" from "src/App.tsx"
```

### Why This Happened

#### **Root Cause: Module Resolution Ambiguity**

The file `src/pages/index.tsx` creates a **module resolution conflict** in
Vite's build process:

1. **Import statement:** `import Index from "./pages/index"`
2. **Vite's resolver** tries to find:
   - `./pages/index.tsx` (the file) ✓
   - `./pages/index/index.tsx` (directory index) ✗
   - `./pages/index.js` (JS variant) ✗

3. **Why it worked locally but failed on Vercel:**
   - **Local (macOS):** Development server is more forgiving with module
     resolution
   - **Vercel (Linux):** Production build has stricter resolution rules
   - **File system differences:** Case sensitivity + path resolution algorithms
     differ

#### **The Architectural Problem**

The `index.tsx` file was doing this:

```tsx
const Index = () => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate("/dashboard", { replace: true });
    }, [navigate]);
    return null;
};
```

**Problems:**

- ❌ Creates an unnecessary component just to redirect
- ❌ Adds extra module to bundle
- ❌ Causes module resolution ambiguity
- ❌ Requires additional useEffect lifecycle
- ❌ Not the React Router standard pattern

---

## ✅ The Fix

### **Solution: Use React Router's `Navigate` Component**

React Router provides a **built-in declarative way** to handle redirects without
needing a separate component.

### **Before (❌ Wrong - Next.js pattern):**

```tsx
// App.tsx
import Index from "./pages/index"; // ❌ Problematic import

<Routes>
    <Route path="/" element={<Index />} /> {/* ❌ Unnecessary component */}
</Routes>;

// pages/index.tsx
const Index = () => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate("/dashboard", { replace: true });
    }, [navigate]);
    return null;
};
```

### **After (✅ Correct - Vite + React Router pattern):**

```tsx
// App.tsx
import { Navigate } from "react-router-dom"; // ✅ Built-in solution

<Routes>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />{" "}
    {/* ✅ Clean redirect */}
</Routes>;
```

**Benefits:**

- ✅ No module resolution issues
- ✅ No unnecessary files
- ✅ Standard React Router pattern
- ✅ Cleaner, more declarative code
- ✅ Works identically on all platforms

---

## 📁 Final Project Structure

### **Correct Vite + React Structure**

```
loan-scout-dashboard/
├── src/
│   ├── main.tsx                 ← Entry point (mounts React)
│   ├── App.tsx                  ← Routes definition
│   ├── index.css                ← Global styles
│   ├── pages/
│   │   ├── dashboard.tsx        ✅ Real page components
│   │   ├── applicants.tsx
│   │   ├── creditScoring.tsx
│   │   ├── applicantDetail.tsx
│   │   ├── assetManagementDashboard.tsx
│   │   ├── customerInvestmentProfile.tsx
│   │   ├── investmentRecommendation.tsx
│   │   ├── portfolioViewer.tsx
│   │   ├── adminAssetManagement.tsx
│   │   └── notFound.tsx
│   ├── components/              ← Reusable components
│   ├── lib/                     ← Utilities
│   └── types/                   ← TypeScript types
├── public/
├── dist/                        ← Build output
├── vercel.json                  ← Vercel config
├── vite.config.ts               ← Vite config
└── package.json
```

**Key Points:**

- ❌ No `app/` directory (that's Next.js)
- ❌ No `pages/index.tsx` (unnecessary in Vite + React Router)
- ✅ React Router handles all routing explicitly
- ✅ No filesystem-based routing

---

## 📄 Corrected Files

### **1. main.tsx** (Entry Point)

```tsx
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
```

**Explanation:**

- ✅ Standard Vite + React entry point
- ✅ No `BrowserRouter` here (it's in App.tsx)
- ✅ Mounts the `<App />` component

---

### **2. App.tsx** (Routes Configuration)

```tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Applicants from "./pages/applicants";
import ApplicantDetail from "./pages/applicantDetail";
import AssetManagementDashboard from "./pages/assetManagementDashboard";
import CustomerInvestmentProfile from "./pages/customerInvestmentProfile";
import InvestmentRecommendation from "./pages/investmentRecommendation";
import PortfolioViewer from "./pages/portfolioViewer";
import AdminAssetManagement from "./pages/adminAssetManagement";
import CreditScoring from "./pages/creditScoring";
import NotFound from "./pages/notFound";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
                <Routes>
                    {/* Root route redirects to dashboard */}
                    <Route
                        path="/"
                        element={<Navigate to="/dashboard" replace />}
                    />

                    {/* All explicit routes */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/applicants" element={<Applicants />} />
                    <Route path="/credit-scoring" element={<CreditScoring />} />
                    <Route
                        path="/applicant/:id"
                        element={<ApplicantDetail />}
                    />
                    <Route
                        path="/asset-management"
                        element={<AssetManagementDashboard />}
                    />
                    <Route
                        path="/asset-management/customers/:id"
                        element={<CustomerInvestmentProfile />}
                    />
                    <Route
                        path="/asset-management/recommendations/:id"
                        element={<InvestmentRecommendation />}
                    />
                    <Route
                        path="/asset-management/portfolio/:id"
                        element={<PortfolioViewer />}
                    />
                    <Route
                        path="/admin/asset-management"
                        element={<AdminAssetManagement />}
                    />

                    {/* 404 fallback */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;
```

**Key Changes:**

1. ✅ **Removed:** `import Index from "./pages/index"`
2. ✅ **Added:** `Navigate` to imports from `react-router-dom`
3. ✅ **Changed:** Root route from `<Index />` to
   `<Navigate to="/dashboard" replace />`
4. ✅ **Organized:** All imports at the top (no scattered imports)

**Why These Changes:**

- **No index.tsx dependency** → No module resolution issues
- **Declarative redirect** → Standard React Router pattern
- **Explicit routing** → No filesystem magic
- **Linux-safe paths** → All lowercase, case-sensitive safe

---

### **3. dashboard.tsx** (Example Page Component)

```tsx
import { useMemo, useState } from "react";
import { formatNaira } from "@/lib/utils";
import { AlertTriangle, DollarSign, TrendingUp, Users } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { LoanChart } from "@/components/dashboard/LoanChart";
import { ApplicantTable } from "@/components/dashboard/ApplicantTable";
import { RiskFilter } from "@/components/dashboard/RiskFilter";
import {
    getAverageRiskScore,
    getRiskLevel,
    getTotalRecommendedLoan,
    mockApplicants,
    type RiskLevel,
} from "@/data/mockApplicants";

const Dashboard = () => {
    const [riskFilter, setRiskFilter] = useState<RiskLevel | "all">("all");

    const filteredApplicants = useMemo(() => {
        if (riskFilter === "all") return mockApplicants;
        return mockApplicants.filter((a) =>
            getRiskLevel(a.risk_score) === riskFilter
        );
    }, [riskFilter]);

    const riskCounts = useMemo(() => ({
        all: mockApplicants.length,
        low: mockApplicants.filter((a) => getRiskLevel(a.risk_score) === "low")
            .length,
        medium: mockApplicants.filter((a) =>
            getRiskLevel(a.risk_score) === "medium"
        ).length,
        high: mockApplicants.filter((a) =>
            getRiskLevel(a.risk_score) === "high"
        ).length,
    }), []);

    const averageRiskScore = getAverageRiskScore();
    const totalRecommendedLoan = getTotalRecommendedLoan();

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Dashboard content */}
                <h1 className="text-3xl font-bold">Risk Dashboard</h1>
                {/* ... rest of component ... */}
            </div>
        </DashboardLayout>
    );
};

export default Dashboard; // ✅ Must have default export
```

**Requirements for Page Components:**

1. ✅ **Must export a React component as default**
2. ✅ **Must be a valid functional component**
3. ✅ **Filename must match import (case-sensitive)**
4. ✅ **Must return JSX**

---

## 🔍 Comparison: Next.js vs Vite + React

| Feature              | Next.js            | Vite + React            |
| -------------------- | ------------------ | ----------------------- |
| **Routing**          | Filesystem-based   | Explicit (React Router) |
| **pages/index.tsx**  | Required for `/`   | ❌ Not needed           |
| **BrowserRouter**    | Not used           | ✅ Required             |
| **Route definition** | Automatic          | Manual `<Route>`        |
| **Build tool**       | Next.js compiler   | Vite                    |
| **SSR**              | Yes (default)      | No (client-side only)   |
| **API routes**       | Yes (`pages/api/`) | No (separate backend)   |
| **Config file**      | `next.config.js`   | `vite.config.ts`        |

---

## 🎯 Why The Error Occurred

### **Local Environment (Works)**

- **OS:** macOS (case-insensitive filesystem)
- **Build:** Development server (`npm run dev`)
- **Resolver:** Lenient, caches modules
- **Result:** `./pages/index` → finds `index.tsx` ✓

### **Vercel Environment (Fails)**

- **OS:** Linux (case-sensitive filesystem)
- **Build:** Production build (`vite build`)
- **Resolver:** Strict, follows spec exactly
- **Result:** `./pages/index` → ambiguous resolution ✗

### **Module Resolution Process**

```
Vite tries to resolve "./pages/index":
1. Check for ./pages/index.ts     ← Not found
2. Check for ./pages/index.tsx    ← Found, but...
3. Check for ./pages/index/index  ← Ambiguous
4. ERROR: Cannot resolve
```

The `index` filename creates ambiguity because:

- Is it a file: `index.tsx`?
- Is it a directory: `index/`?

Vite's strict resolver on Linux can't decide, especially in production builds.

---

## ✅ Build Verification

### **Before Fix:**

```bash
❌ Could not resolve "./pages/index" from "src/App.tsx"
```

### **After Fix:**

```bash
✓ 2498 modules transformed.
✓ built in 2.80s

dist/index.html                   1.02 kB
dist/assets/index-DBSRiuWM.css   68.11 kB
dist/assets/index-CIE4AUMz.js   840.20 kB

✅ Build successful
```

---

## 🚀 Deployment Checklist

### **1. Verify Structure**

- ✅ No `pages/index.tsx` file
- ✅ `App.tsx` uses `<Navigate>` for root route
- ✅ All page imports use lowercase
- ✅ `vercel.json` configured for SPA

### **2. Test Build Locally**

```bash
npm run build
npm run preview
```

### **3. Test Routes**

- ✅ `/` → redirects to `/dashboard`
- ✅ `/dashboard` → loads correctly
- ✅ Refresh works on all routes

### **4. Deploy**

```bash
git add .
git commit -m "fix: eliminate index.tsx module resolution issue"
git push origin main
```

---

## 📚 Key Takeaways

### **For Vite + React Projects:**

1. **Never use `pages/index.tsx`** for redirect logic
   - Use `<Navigate>` component instead

2. **Explicit routing only**
   - Define all routes in `App.tsx` with `<Route>`

3. **No Next.js patterns**
   - No filesystem routing
   - No automatic page detection

4. **Import paths must be exact**
   - Match case exactly (Linux-safe)
   - Use `.tsx` if needed for clarity

5. **BrowserRouter goes in App.tsx**
   - Not in `main.tsx`
   - Wraps `<Routes>`

### **For Production Builds:**

1. **Always test `npm run build` locally**
2. **Avoid ambiguous module names** (`index`, `util`, etc.)
3. **Use explicit file extensions** when in doubt
4. **Follow framework conventions** (Vite ≠ Next.js)

---

## 🆘 Troubleshooting

### If Build Still Fails:

1. **Clear build cache:**
   ```bash
   rm -rf node_modules/.vite dist
   npm install
   npm run build
   ```

2. **Verify imports:**
   - Check all imports have exact case
   - Ensure all imported files exist
   - Use absolute paths (`@/`) when possible

3. **Check Vercel logs:**
   - Look for specific file not found
   - Check Node.js version compatibility
   - Verify build command is `npm run build`

---

**Status:** ✅ **Fixed and Verified**\
**Build:** ✅ **Successful**\
**Pattern:** ✅ **Vite + React Standard**\
**Production:** ✅ **Ready for Deployment**
