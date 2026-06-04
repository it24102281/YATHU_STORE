import React from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle2 } from 'lucide-react';
import { termsSections } from '../data/termsContent';

const Terms = () => {
  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-10"
        >
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-purple-500/20 bg-purple-500/10">
              <Shield className="h-10 w-10 text-purple-400" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white">Terms & Conditions</h1>
            <p className="mt-4 text-lg text-gray-400">
              Please read these terms carefully before placing any order on Yathu Pubg Store.
            </p>
          </div>

          <div className="space-y-6">
            {termsSections.map((section) => (
              <section
                key={section.title}
                className="rounded-[32px] border border-white/8 bg-gray-900/50 p-6 sm:p-8"
              >
                <h2 className="mb-5 flex items-center gap-3 text-2xl font-black text-white">
                  <CheckCircle2 className="h-6 w-6 text-purple-400" />
                  {section.title}
                </h2>
                <div className="space-y-4">
                  {section.items.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/6 bg-white/[0.03] px-4 py-4 text-gray-300 leading-7"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Terms;
