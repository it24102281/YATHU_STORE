import React from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle } from 'lucide-react';

const Terms = () => {
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
              <Shield className="w-10 h-10 text-purple-500" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black gradient-text mb-6">Terms of Service</h1>
            <p className="text-gray-400 text-lg italic">Last Updated: March 2024</p>
          </div>

          <div className="space-y-8 text-gray-300 leading-relaxed">
            <section className="bg-gray-900/50 p-8 rounded-3xl border border-white/5">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-purple-500" />
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing and using YATHU PUBG STORE, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our services.
              </p>
            </section>

            <section className="bg-gray-900/50 p-8 rounded-3xl border border-white/5">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-purple-500" />
                2. Account Purchases
              </h2>
              <p>
                When purchasing a PUBG account from us, you acknowledge that you are buying the access credentials to an existing account. We guarantee the account is as described at the time of purchase. After the transfer is complete and credentials are changed, the buyer assumes full responsibility for the account.
              </p>
            </section>

            <section className="bg-gray-900/50 p-8 rounded-3xl border border-white/5">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-purple-500" />
                3. User Obligations
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You must provide accurate information during the purchase process.</li>
                <li>You are responsible for maintaining the security of the purchased account.</li>
                <li>You agree not to use our services for any illegal or unauthorized purposes.</li>
                <li>You comply with the original game's End User License Agreement (EULA).</li>
              </ul>
            </section>

            <section className="bg-gray-900/50 p-8 rounded-3xl border border-white/5">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-purple-500" />
                4. Liability
              </h2>
              <p>
                YATHU PUBG STORE is not responsible for any actions taken by the game developers (Krafton/Tencent) after the account purchase, including bans for third-party software use or violations of game rules by the buyer.
              </p>
            </section>

            <section className="bg-gray-900/50 p-8 rounded-3xl border border-white/5">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-purple-500" />
                5. Changes to Terms
              </h2>
              <p>
                We reserve the right to modify these terms at any time. Continued use of our store after changes constitutes acceptance of the new terms.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Terms;
