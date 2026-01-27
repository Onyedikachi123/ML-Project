import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api, CreditScoreRequest, CreditScoreResponse, FinancialHealthResponse, AssetRecommendationResponse } from '@/services/api';
import { ApplicantCard } from '@/components/applicant/ApplicantCard';
import { Loader2 } from 'lucide-react';

// Adapter to match ApplicantCard's expected type
const adaptResponseToApplicant = (
    res: CreditScoreResponse,
    fh: FinancialHealthResponse,
    req: CreditScoreRequest
): any => { // eslint-disable-line @typescript-eslint/no-explicit-any
    return {
        id: 999,
        name: "Live Assessment User",
        age: req.AGE,
        income: 50000, // Placeholder as we don't have income in the model input
        credit_limit: req.LIMIT_BAL,
        risk_score: res.probability_of_default,
        education: req.EDUCATION === 1 ? "Graduate School" : req.EDUCATION === 2 ? "University" : "High School",
        marital_status: req.MARRIAGE === 1 ? "Married" : "Single",
        recommended_loan: res.recommended_loan_amount,
        repayment_schedule: `${res.recommended_tenor_months} months`,
        bill_amount: req.BILL_AMT1,
        top_factors: [
            ...res.explainability.top_positive_factors.map(f => f.feature),
            ...res.explainability.top_negative_factors.map(f => f.feature)
        ].slice(0, 3),
        financial_health_score: fh.financial_health_score
    };
};

const CreditScoring = () => {
    const [loading, setLoading] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [result, setResult] = useState<any>(null);
    const [assetRec, setAssetRec] = useState<AssetRecommendationResponse | null>(null);

    const [formData, setFormData] = useState<CreditScoreRequest>({
        LIMIT_BAL: 200000,
        AGE: 30,
        SEX: 2,
        EDUCATION: 2,
        MARRIAGE: 2,
        PAY_0: 0, PAY_2: 0, PAY_3: 0, PAY_4: 0, PAY_5: 0, PAY_6: 0,
        BILL_AMT1: 50000, BILL_AMT2: 50000, BILL_AMT3: 50000, BILL_AMT4: 50000, BILL_AMT5: 50000, BILL_AMT6: 50000,
        PAY_AMT1: 10000, PAY_AMT2: 10000, PAY_AMT3: 10000, PAY_AMT4: 10000, PAY_AMT5: 10000, PAY_AMT6: 10000
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    };

    const prefillHighRisk = () => {
        setFormData({
            LIMIT_BAL: 50000,
            AGE: 22,
            SEX: 1,
            EDUCATION: 3,
            MARRIAGE: 2,
            PAY_0: 2, PAY_2: 2, PAY_3: 2, PAY_4: 2, PAY_5: 2, PAY_6: 2,
            BILL_AMT1: 48000, BILL_AMT2: 49000, BILL_AMT3: 50000, BILL_AMT4: 51000, BILL_AMT5: 52000, BILL_AMT6: 53000,
            PAY_AMT1: 0, PAY_AMT2: 0, PAY_AMT3: 0, PAY_AMT4: 0, PAY_AMT5: 0, PAY_AMT6: 0
        });
    };

    const prefillLowRisk = () => {
        setFormData({
            LIMIT_BAL: 5000000,
            AGE: 40,
            SEX: 2,
            EDUCATION: 1,
            MARRIAGE: 1,
            PAY_0: -1, PAY_2: -1, PAY_3: -1, PAY_4: -1, PAY_5: -1, PAY_6: -1,
            BILL_AMT1: 100000, BILL_AMT2: 120000, BILL_AMT3: 100000, BILL_AMT4: 100000, BILL_AMT5: 100000, BILL_AMT6: 100000,
            PAY_AMT1: 100000, PAY_AMT2: 120000, PAY_AMT3: 100000, PAY_AMT4: 100000, PAY_AMT5: 100000, PAY_AMT6: 100000
        });
    };

    const calculateScore = async () => {
        setLoading(true);
        try {
            // 1. Credit Score
            const creditRes = await api.getCreditScore(formData);

            // 2. Financial Health
            const healthRes = await api.getFinancialHealth(formData);

            // 3. Asset Recommendation
            const assetRes = await api.getAssetRecommendation({
                financial_health_score: healthRes.financial_health_score,
                credit_score: creditRes.credit_score,
                risk_tier: creditRes.risk_tier,
                LIMIT_BAL: formData.LIMIT_BAL,
                AGE: formData.AGE
            });

            const applicantData = adaptResponseToApplicant(creditRes, healthRes, formData);
            setResult(applicantData);
            setAssetRec(assetRes);
        } catch (err) {
            console.error(err);
            alert("Failed to calculate score. Ensure backend is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight">Live Credit Assessment</h1>
                    <div className="space-x-2">
                        <Button variant="outline" onClick={prefillLowRisk}>Use Low Risk Profile</Button>
                        <Button variant="destructive" onClick={prefillHighRisk}>Use High Risk Profile</Button>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Input Form */}
                    <Card className="md:col-span-1 h-fit">
                        <CardHeader>
                            <CardTitle>Applicant Data</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-2">
                                <div><Label>Limit Bal</Label><Input name="LIMIT_BAL" value={formData.LIMIT_BAL} onChange={handleInputChange} /></div>
                                <div><Label>Age</Label><Input name="AGE" value={formData.AGE} onChange={handleInputChange} /></div>
                                <div><Label>Sex (1=M, 2=F)</Label><Input name="SEX" value={formData.SEX} onChange={handleInputChange} /></div>
                                <div><Label>Edu (1-4)</Label><Input name="EDUCATION" value={formData.EDUCATION} onChange={handleInputChange} /></div>
                                <div><Label>Married (1-3)</Label><Input name="MARRIAGE" value={formData.MARRIAGE} onChange={handleInputChange} /></div>
                            </div>

                            <div className="border-t pt-2">
                                <Label className="mb-2 block font-semibold">Payment History (-1=Pay Duly, 1+=Delay)</Label>
                                <div className="grid grid-cols-3 gap-2">
                                    <Input placeholder="M1" name="PAY_0" value={formData.PAY_0} onChange={handleInputChange} />
                                    <Input placeholder="M2" name="PAY_2" value={formData.PAY_2} onChange={handleInputChange} />
                                    <Input placeholder="M3" name="PAY_3" value={formData.PAY_3} onChange={handleInputChange} />
                                    <Input placeholder="M4" name="PAY_4" value={formData.PAY_4} onChange={handleInputChange} />
                                    <Input placeholder="M5" name="PAY_5" value={formData.PAY_5} onChange={handleInputChange} />
                                    <Input placeholder="M6" name="PAY_6" value={formData.PAY_6} onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className="border-t pt-2">
                                <Label className="mb-2 block font-semibold">Bill Amounts (Past 6 Months)</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Input name="BILL_AMT1" value={formData.BILL_AMT1} onChange={handleInputChange} />
                                    <Input name="BILL_AMT2" value={formData.BILL_AMT2} onChange={handleInputChange} />
                                    <Input name="BILL_AMT3" value={formData.BILL_AMT3} onChange={handleInputChange} />
                                    <Input name="BILL_AMT4" value={formData.BILL_AMT4} onChange={handleInputChange} />
                                    <Input name="BILL_AMT5" value={formData.BILL_AMT5} onChange={handleInputChange} />
                                    <Input name="BILL_AMT6" value={formData.BILL_AMT6} onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className="border-t pt-2">
                                <Label className="mb-2 block font-semibold">Pay Amounts (Past 6 Months)</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Input name="PAY_AMT1" value={formData.PAY_AMT1} onChange={handleInputChange} />
                                    <Input name="PAY_AMT2" value={formData.PAY_AMT2} onChange={handleInputChange} />
                                    <Input name="PAY_AMT3" value={formData.PAY_AMT3} onChange={handleInputChange} />
                                    <Input name="PAY_AMT4" value={formData.PAY_AMT4} onChange={handleInputChange} />
                                    <Input name="PAY_AMT5" value={formData.PAY_AMT5} onChange={handleInputChange} />
                                    <Input name="PAY_AMT6" value={formData.PAY_AMT6} onChange={handleInputChange} />
                                </div>
                            </div>

                            <Button className="w-full mt-4" onClick={calculateScore} disabled={loading}>
                                {loading ? <Loader2 className="animate-spin mr-2" /> : "Analyze Credit Risk"}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Results Area */}
                    <div className="md:col-span-2 space-y-6">
                        {!result && (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-xl min-h-[400px]">
                                <p>Enter applicant data and click Analyze</p>
                            </div>
                        )}

                        {result && (
                            <>
                                <ApplicantCard applicant={result} />

                                {assetRec && (
                                    <Card className="bg-gradient-to-br from-indigo-950 to-purple-900 border-none text-white">
                                        <CardHeader>
                                            <CardTitle>Sycamore Asset Intelligence</CardTitle>
                                        </CardHeader>
                                        <CardContent className="grid md:grid-cols-3 gap-6">
                                            <div className="text-center p-4 bg-white/10 rounded-lg">
                                                <p className="text-sm opacity-70">Risk Tolerance</p>
                                                <p className="text-2xl font-bold">{assetRec.risk_tolerance}</p>
                                            </div>
                                            <div className="text-center p-4 bg-white/10 rounded-lg">
                                                <p className="text-sm opacity-70">Invest Horizon</p>
                                                <p className="text-2xl font-bold">{assetRec.investment_horizon}</p>
                                            </div>
                                            <div className="col-span-1 md:col-span-3">
                                                <p className="mb-2 font-semibold">Recommended Allocation</p>
                                                <div className="flex h-4 rounded-full overflow-hidden">
                                                    <div className="bg-blue-400" style={{ width: `${assetRec.portfolio_allocation.money_market}%` }} />
                                                    <div className="bg-green-400" style={{ width: `${assetRec.portfolio_allocation.fixed_income}%` }} />
                                                    <div className="bg-orange-400" style={{ width: `${assetRec.portfolio_allocation.equities}%` }} />
                                                </div>
                                                <div className="flex justify-between text-xs mt-2 opacity-80">
                                                    <span className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-400 rounded-full" /> Money Market: {assetRec.portfolio_allocation.money_market}%</span>
                                                    <span className="flex items-center gap-1"><div className="w-2 h-2 bg-green-400 rounded-full" /> Fixed Income: {assetRec.portfolio_allocation.fixed_income}%</span>
                                                    <span className="flex items-center gap-1"><div className="w-2 h-2 bg-orange-400 rounded-full" /> Equities: {assetRec.portfolio_allocation.equities}%</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CreditScoring;
