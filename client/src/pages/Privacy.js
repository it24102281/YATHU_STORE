import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="text-center">
            <div className="w-20 h-20 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-purple-500" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black gradient-text mb-6">Privacy Policy</h1>
            <p className="text-gray-400 text-lg italic">Last Updated: March 2024</p>
          </div>

          <div className="space-y-8 text-gray-300 leading-relaxed">
            <section className="bg-gray-900/50 p-8 rounded-3xl border border-white/5">
              <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
              <p>
                To provide you with our services, we collect minimal personal information, including:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Contact information (WhatsApp number, Telegram username)</li>
                <li>Transaction details for purchase verification</li>
                <li>Device information and IP addresses for security purposes</li>
              </ul>
            </section>

            <section className="bg-gray-900/50 p-8 rounded-3xl border border-white/5">
              <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
              <p>
                Your information is used solely for:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Processing your account purchases and transfers</li>
                <li>Providing customer support and responding to inquiries</li>
                <li>Improving our website and service security</li>
                <li>Verifying transactions to prevent fraud</li>
              </ul>
            </section>

            <section className="bg-gray-900/50 p-8 rounded-3xl border border-white/5">
              <h2 className="text-2xl font-bold text-white mb-4">3. Data Security</h2>
              <p>
                We implement industry-standard security measures to protect your personal information. We do not store sensitive payment details on our servers; payments are processed through secure third-party platforms or direct transfers.
              </p>
            </section>

            <section className="bg-gray-900/50 p-8 rounded-3xl border border-white/5">
              <h2 className="text-2xl font-bold text-white mb-4">4. Third-Party Sharing</h2>
              <p>
                We do not sell, trade, or otherwise transfer your personal information to outside parties. This does not include trusted third parties who assist us in operating our website or conducting our business, as long as those parties agree to keep this information confidential.
              </p>
            </section>

            <section className="bg-gray-900/50 p-8 rounded-3xl border border-white/5">
              <h2 className="text-2xl font-bold text-white mb-4">5. Your Rights</h2>
              <p>
                You have the right to request access to the personal information we hold about you and to ask for it to be corrected or deleted. Contact us via our support channels for any privacy-related requests.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Privacy;
