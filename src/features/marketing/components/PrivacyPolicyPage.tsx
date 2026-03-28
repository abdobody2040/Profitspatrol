import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';

interface PrivacyPolicyPageProps {
    onBack: () => void;
}

const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onBack }) => {
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
                        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                            <Shield size={24} />
                        </div>
                        <h1 className="text-xl font-bold text-slate-900">Privacy Policy</h1>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200">
                    <p className="text-sm text-slate-500 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

                    <div className="prose prose-slate max-w-none">
                        <h2>1. Introduction</h2>
                        <p>
                            Welcome to Profits Patrol. We are committed to protecting your privacy and ensuring you have a positive experience on our website and in using our services.
                            This Privacy Policy applies to our website and related services.
                        </p>

                        <h2>2. Information We Collect</h2>
                        <p>We may collect personal information such as:</p>
                        <ul>
                            <li><strong>Account Information:</strong> Name, email address, password, and profile details.</li>
                            <li><strong>Usage Information:</strong> Information about how you use our application, including game progress and interactions.</li>
                            <li><strong>Device Information:</strong> Information about the device and network you use to access our services.</li>
                        </ul>

                        <h2>3. How We Use Your Information</h2>
                        <p>We use the collected information to:</p>
                        <ul>
                            <li>Provide, maintain, and improve our services.</li>
                            <li>Personalize your experience and deliver relevant content.</li>
                            <li>Communicate with you regarding updates, support, and administrative messages.</li>
                            <li>Ensure the security and safety of our users.</li>
                        </ul>

                        <h2>4. Sharing of Information</h2>
                        <p>
                            We do not sell your personal information. We may share your information with third-party service providers who assist us in operating our services, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.
                        </p>

                        <h2>5. Data Security</h2>
                        <p>
                            We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet or method of electronic storage is 100% secure.
                        </p>

                        <h2>6. Children's Privacy</h2>
                        <p>
                            Our services are designed for users of various ages, including children. We take special precautions to protect the privacy of children and comply with applicable laws regarding children's online privacy. Parents and guardians have the right to review, edit, and delete their child's personal information.
                        </p>

                        <h2>7. Changes to This Policy</h2>
                        <p>
                            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                        </p>

                        <h2>8. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at support@profitspatrol.com.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PrivacyPolicyPage;
