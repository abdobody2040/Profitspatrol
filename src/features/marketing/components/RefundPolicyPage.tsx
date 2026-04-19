import React from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';

interface RefundPolicyPageProps {
    onBack: () => void;
}

const RefundPolicyPage: React.FC<RefundPolicyPageProps> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                            aria-label="Go back"
                        >
                            <ArrowLeft size={20} className="text-slate-600" />
                        </button>
                        <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                            <RefreshCw size={24} />
                        </div>
                        <h1 className="text-xl font-bold text-slate-900">Refund Policy</h1>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200">
                    <p className="text-sm text-slate-500 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

                    <div className="prose prose-slate max-w-none">
                        <h2>1. General Refund Policy</h2>
                        <p>
                            At Profits Patrol, we want you to be completely satisfied with your purchase.
                            We offer a money-back guarantee on our subscriptions under the terms outlined below.
                        </p>

                        <h2>2. Subscription Refunds</h2>
                        <p>
                            <strong>Monthly Subscriptions:</strong> You can request a full refund within the first 7 days of your initial monthly subscription purchase. After 7 days, monthly subscriptions are non-refundable, but you can cancel at any time to prevent future charges.
                        </p>
                        <p>
                            <strong>Annual Subscriptions:</strong> You can request a full refund within the first 14 days of your initial annual subscription. After 14 days, annual subscriptions are non-refundable.
                        </p>
                        <p>
                            <strong>Lifetime Memberships:</strong> Lifetime (Tycoon) membership purchases are non-refundable after 14 days from the date of purchase.
                        </p>

                        <h2>3. How to Request a Refund</h2>
                        <p>
                            To request a refund within the eligible period, please contact our support team at
                            <strong> support@profitspatrol.com</strong> with your account details and receipt of purchase.
                            Please allow up to 5-10 business days for the refund to be processed and appear on your statement.
                        </p>

                        <h2>4. Canceled Subscriptions</h2>
                        <p>
                            Canceling your subscription limits future billing but does not automatically issue a refund for the current billing cycle.
                            Upon cancellation, you will continue to have access to the service until the end of your prepaid billing period.
                        </p>

                        <h2>5. Exceptions</h2>
                        <p>
                            Refunds will not be provided for accounts that have been terminated by us due to a violation of our Terms of Service.
                        </p>

                        <h2>6. Changes to this Policy</h2>
                        <p>
                            We reserve the right to modify this Refund Policy at any time. Any changes will be effective immediately upon posting to the website.
                        </p>

                        <h2>7. Contact Us</h2>
                        <p>
                            If you have any questions about this Refund Policy, please contact us at support@profitspatrol.com.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default RefundPolicyPage;
