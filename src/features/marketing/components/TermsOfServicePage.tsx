import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';

interface TermsOfServicePageProps {
    onBack: () => void;
}

const TermsOfServicePage: React.FC<TermsOfServicePageProps> = ({ onBack }) => {
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
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                            <FileText size={24} />
                        </div>
                        <h1 className="text-xl font-bold text-slate-900">Terms of Service</h1>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200">
                    <p className="text-sm text-slate-500 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

                    <div className="prose prose-slate max-w-none">
                        <h2>1. Agreement to Terms</h2>
                        <p>
                            By accessing or using the Profits Patrol application and services, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
                        </p>

                        <h2>2. User Accounts</h2>
                        <p>
                            When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
                            You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.
                        </p>

                        <h2>3. Service Usage</h2>
                        <p>
                            Our services are intended for educational and entertainment purposes. You agree not to:
                        </p>
                        <ul>
                            <li>Use the service for any illegal purpose or in violation of any local, state, national, or international law.</li>
                            <li>Harass, threaten, or defraud other users.</li>
                            <li>Interfere with or disrupt the operation of the service.</li>
                            <li>Attempt to gain unauthorized access to any portion of the service or any other systems or networks connected to the service.</li>
                        </ul>

                        <h2>4. Intellectual Property</h2>
                        <p>
                            The service and its original content, features, and functionality are and will remain the exclusive property of Profits Patrol and its licensors. The service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
                        </p>

                        <h2>5. Subscriptions and Payments</h2>
                        <p>
                            Some parts of the service are billed on a subscription basis. You will be billed in advance on a recurring and periodic basis. Depending on the plan you select, your subscription may automatically renew under the exact same conditions unless you cancel it or we cancel it.
                        </p>

                        <h2>6. Termination</h2>
                        <p>
                            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                            Upon termination, your right to use the service will immediately cease.
                        </p>

                        <h2>7. Limitation of Liability</h2>
                        <p>
                            In no event shall Profits Patrol, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
                        </p>

                        <h2>8. Changes</h2>
                        <p>
                            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect.
                        </p>

                        <h2>9. Contact Information</h2>
                        <p>
                            If you have any questions about these Terms, please contact us at terms@profitspatrol.com.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TermsOfServicePage;
