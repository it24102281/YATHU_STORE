import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import FeaturedDeals from '../components/FeaturedDeals';

const Services = () => {
  return (
    <div className="min-h-screen bg-black">
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #140b24 45%, #0a0a0a 100%)' }} />
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(139,92,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.05) 1px, transparent 1px)', backgroundSize: '56px 56px' }} />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6 text-sm font-semibold"
              style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', color: '#c084fc' }}
            >
              <Sparkles className="w-4 h-4" />
              Live Inventory
            </div>
            <h1
              className="text-5xl md:text-7xl font-black mb-6"
              style={{
                fontFamily: 'Poppins, sans-serif',
                background: 'linear-gradient(135deg,#ffffff,#c084fc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Featured Deals
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              PUBG services, premium subscriptions, and social media boosters managed directly from the admin inventory.
            </p>
          </motion.div>
        </div>
      </section>

      <FeaturedDeals
        compact
        heading="Browse All Featured Deals"
        subtitle="Every card on this page is loaded from your backend database, so admin updates appear automatically."
      />
    </div>
  );
};

export default Services;
