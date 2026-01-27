# Frontend Integration

The existing React frontend has been integrated with the Python FastAPI backend.

## New Features

1. **Live Assessment Page**: A new page `/credit-scoring` has been added.
   - Allows manual entry of applicant data (Credit Limit, Payment History,
     etc.).
   - Provides "Demo" buttons to pre-fill Low/High risk profiles.
   - Displays real-time Credit Score, Risk Tier, and Explainability factors.
   - Displays Asset Management recommendations based on the score.
   - All financial amounts are displayed in Nigerian Naira (₦).

## Components Added/Modified

- `src/services/api.ts`: API client for backend communication.
- `src/pages/CreditScoring.tsx`: Main integration logic and UI.
- `src/components/layout/Sidebar.tsx`: Added navigation link.
- `src/App.tsx`: Added routing.

## How to Test

1. Ensure Backend is running:
   ```bash
   cd backend
   source venv/bin/activate
   uvicorn app.main:app --reload
   ```
2. Ensure Frontend is running:
   ```bash
   cd loan-scout-dashboard
   npm run dev
   ```
3. Go to `http://localhost:5173/credit-scoring`.
4. Click **"Use High Risk Profile"** or **"Use Low Risk Profile"**.
5. Click **"Analyze Credit Risk"**.
6. View the live calculated results from the XGBoost model.
