import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, AlertCircle } from 'lucide-react';

const Refund = () => {
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
              <RotateCcw className="w-10 h-10 text-purple-500" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black gradient-text mb-6">Refund Policy</h1>
            <p className="text-gray-400 text-lg italic">Last Updated: March 2024</p>
          </div>

          <div className="space-y-8 text-gray-300 leading-relaxed">
            <section className="bg-gray-900/50 p-8 rounded-3xl border border-white/5">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-500" />
                General Policy
              </h2>
              <p>
                Due to the digital nature of gaming accounts, all sales are generally final. Once account credentials have been shared and the transfer process has begun, we cannot offer a refund unless the account is proven to be significantly different from the description.
              </p>
            </section>

            <section className="bg-gray-900/50 p-8 rounded-3xl border border-red-500/20">
              <h2 className="text-2xl font-bold text-white mb-4">No Refunds Situations</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>"Change of mind" after credentials have been delivered.</li>
                <li>Inability to play the game due to device incompatibility.</li>
                <li>Accounts banned after purchase due to the buyer's actions (cheating, toxicity, etc.).</li>
                <li>Issues arising from game updates or server changes.</li>
              </ul>
            </section>

            <section className="bg-gray-900/50 p-8 rounded-3xl border border-green-500/20">
              <h2 className="text-2xl font-bold text-white mb-4">Eligible for Refund/Replacement</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>If the account is already banned at the moment of delivery.</li>
                <li>If the account level or inventory significantly differs from what was advertised.</li>
                <li>If the provided credentials do not work and cannot be recovered by us.</li>
              </ul>
              <p className="mt-4 font-semibold text-white">
                Any claims must be made within 24 hours of purchase verification.
              </p>
            </section>

            <section className="bg-gray-900/50 p-8 rounded-3xl border border-white/5">
              <h2 className="text-2xl font-bold text-white mb-4">Refund Process</h2>
              <p>
                To request a refund or replacement, please contact us on WhatsApp with your transaction ID and proof of the issue (screenshots/videos). We will investigate and respond within 48 hours.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Refund;
