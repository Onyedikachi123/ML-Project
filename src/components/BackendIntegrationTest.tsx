import React, { useState } from 'react';
import { api, CreditScoreRequest } from '@/services/api';
// Assuming UI components exist, otherwise using standard HTML
// Using standard HTML elements to ensure compatibility if UI lib changes

export const BackendIntegrationTest = () => {
    const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const testBackend = async () => {
        setStatus('LOADING');
        setError(null);
        try {
            // Dummy Request Data
            const dummyRequest: CreditScoreRequest = {
                LIMIT_BAL: 50000,
                AGE: 35,
                SEX: 1,
                EDUCATION: 2,
                MARRIAGE: 1,
                PAY_0: 0, PAY_2: 0, PAY_3: 0, PAY_4: 0, PAY_5: 0, PAY_6: 0,
                BILL_AMT1: 1000, BILL_AMT2: 1200, BILL_AMT3: 1300,
                BILL_AMT4: 1400, BILL_AMT5: 1500, BILL_AMT6: 1600,
                PAY_AMT1: 100, PAY_AMT2: 100, PAY_AMT3: 100,
                PAY_AMT4: 100, PAY_AMT5: 100, PAY_AMT6: 100
            };

            const response = await api.getCreditScore(dummyRequest);
            setResult(response);
            setStatus('SUCCESS');
        } catch (err: any) {
            console.error("Backend Test Error:", err);
            setStatus('ERROR');
            setError(err.message || 'Failed to connect to backend');
        }
    };

    return (
        <div className="p-4 border rounded-lg shadow-sm bg-white max-w-md mx-auto my-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Backend API Test</h3>
                <span className={`px-2 py-1 rounded text-xs font-medium ${status === 'SUCCESS' ? 'bg-green-100 text-green-800' :
                        status === 'ERROR' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                    }`}>
                    {status}
                </span>
            </div>

            <div className="space-y-4">
                <p className="text-sm text-gray-500">
                    Endpoint: <code className="bg-gray-100 p-1 rounded font-mono text-xs">{process.env.VITE_API_URL || 'Local'}/api/credit/score</code>
                </p>

                <button
                    onClick={testBackend}
                    disabled={status === 'LOADING'}
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50"
                >
                    {status === 'LOADING' ? 'Connecting...' : 'Test Connection'}
                </button>

                {error && (
                    <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-200">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {result && (
                    <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm border border-green-200 space-y-1">
                        <p><span className="font-bold">Credit Score:</span> {result.credit_score}</p>
                        <p><span className="font-bold">Risk Tier:</span> {result.risk_tier}</p>
                        <p><span className="font-bold">Prob. Default:</span> {(result.probability_of_default * 100).toFixed(1)}%</p>
                        <p><span className="font-bold">Max Loan:</span> ₦{result.recommended_loan_amount?.toLocaleString()}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
