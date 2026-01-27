// Mock data generated based on credit card default dataset structure
export interface Applicant {
  id: number;
  name: string;
  age: number;
  income: number;
  risk_score: number;
  recommended_loan: number;
  repayment_schedule: string;
  top_factors: string[];
  education: string;
  marital_status: string;
  credit_limit: number;
  bill_amount: number;
  payment_amount: number;
}

export type RiskLevel = 'low' | 'medium' | 'high';

export const getRiskLevel = (score: number): RiskLevel => {
  if (score < 0.33) return 'low';
  if (score < 0.66) return 'medium';
  return 'high';
};

export const getRiskLabel = (score: number): string => {
  const level = getRiskLevel(score);
  return level.charAt(0).toUpperCase() + level.slice(1);
};

const firstNames = [
  'Chinedu', 'Yemi', 'Adebayo', 'Chioma', 'Funke', 'Emeka', 'Ngozi', 'Tunde',
  'Ibrahim', 'Fatima', 'Musa', 'Zainab', 'Bolanle', 'Kelechi', 'Uche', 'Amaka',
  'Oluwaseun', 'Folake', 'Idris', 'Maryam', 'Abubakar', 'Nneka', 'Femi', 'Titilayo',
  'Obinna', 'Aisha', 'Yakubu', 'Halima', 'Tope', 'Oluchi'
];

const lastNames = [
  'Okafor', 'Adeyemi', 'Ibrahim', 'Eze', 'Okonkwo', 'Balogun', 'Abdullahi', 'Olawale',
  'Mustapha', 'Umar', 'Nwosu', 'Danjuma', 'Adeleke', 'Bello', 'Okeke', 'Suleiman',
  'Oni', 'Bakare', 'Mohammed', 'Lawal', 'Ajayi', 'Odunayo', 'Ogbonna', 'Sani'
];

const factors = [
  'Payment History', 'Credit Utilization', 'Income Level', 'Employment Status',
  'Debt-to-Income Ratio', 'Account Age', 'Mobile Transactions', 'E-commerce Activity',
  'Savings Pattern', 'Bill Payment Consistency', 'Credit Mix', 'Recent Inquiries'
];

const schedules = ['3 months', '6 months', '12 months', '18 months', '24 months'];
const educations = ['Graduate School', 'University', 'High School', 'Others'];
const maritalStatuses = ['Married', 'Single', 'Divorced', 'Widowed'];

const generateRandomApplicant = (id: number): Applicant => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const age = Math.floor(Math.random() * 40) + 22;
  // Income range in Naira: 50k to 1.5M monthly approx * 12 or just raw annual
  // Let's assume annual income: 500k - 10M range
  const income = Math.floor(Math.random() * 9500000) + 500000;
  const risk_score = Math.round(Math.random() * 100) / 100;
  // Limit balances: 100k to 5M
  const credit_limit = Math.floor(Math.random() * 4900000) + 100000;

  // Higher income and lower risk = higher loan recommendation
  const baseLoan = income * 0.3; // More conservative in Naira markets maybe?
  const riskMultiplier = 1 - (risk_score * 0.5);
  const recommended_loan = Math.floor(baseLoan * riskMultiplier);

  // Shuffle and pick top 3 factors
  const shuffledFactors = [...factors].sort(() => Math.random() - 0.5);
  const top_factors = shuffledFactors.slice(0, 3);

  return {
    id,
    name: `${firstName} ${lastName}`,
    age,
    income,
    risk_score,
    recommended_loan,
    repayment_schedule: schedules[Math.floor(Math.random() * schedules.length)],
    top_factors,
    education: educations[Math.floor(Math.random() * educations.length)],
    marital_status: maritalStatuses[Math.floor(Math.random() * maritalStatuses.length)],
    credit_limit,
    bill_amount: Math.floor(Math.random() * credit_limit * 0.5),
    payment_amount: Math.floor(Math.random() * 200000) + 20000,
  };
};

// Generate 50 mock applicants
export const mockApplicants: Applicant[] = Array.from({ length: 50 }, (_, i) =>
  generateRandomApplicant(i + 1)
);

export const getApplicantById = (id: number): Applicant | undefined => {
  return mockApplicants.find(a => a.id === id);
};

export const getFilteredApplicants = (riskFilter: RiskLevel | 'all'): Applicant[] => {
  if (riskFilter === 'all') return mockApplicants;
  return mockApplicants.filter(a => getRiskLevel(a.risk_score) === riskFilter);
};

export const getAverageRiskScore = (): number => {
  const sum = mockApplicants.reduce((acc, a) => acc + a.risk_score, 0);
  return sum / mockApplicants.length;
};

export const getTotalRecommendedLoan = (): number => {
  return mockApplicants.reduce((acc, a) => acc + a.recommended_loan, 0);
};
