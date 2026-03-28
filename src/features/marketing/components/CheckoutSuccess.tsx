import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle } from 'lucide-react';
import { useAppStore } from '../../../store';

const CheckoutSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const sessionId = searchParams.get('session_id');
    const plan = searchParams.get('plan') || 'tycoon';
    const { refreshUser } = useAppStore();
    const [verifying, setVerifying] = useState(true);

    useEffect(() => {
        if (sessionId) {
            // Give webhook a tiny bit of time to complete
            setTimeout(() => {
                refreshUser().then(() => {
                    setVerifying(false);
                    setTimeout(() => {
                        navigate(`/dashboard?payment_success=true&plan=${plan}`, { replace: true });
                    }, 1500);
                });
            }, 2000);
        } else {
            navigate('/dashboard', { replace: true });
        }
    }, [sessionId, navigate, refreshUser]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full text-center">
                {verifying ? (
                    <>
                        <Loader2 className="animate-spin text-blue-600 mx-auto mb-6" size={48} />
                        <h2 className="text-2xl font-black text-gray-800 mb-2">Verifying Payment...</h2>
                        <p className="text-gray-500 font-medium">Please wait while we unlock your premium features.</p>
                    </>
                ) : (
                    <>
                        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={40} strokeWidth={3} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-800 mb-2">Payment Successful!</h2>
                        <p className="text-gray-500 font-medium">Redirecting you to your dashboard...</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default CheckoutSuccess;
