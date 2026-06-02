import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Zap, Star, Trophy, Package } from 'lucide-react';
import axios from 'axios';

const WHATSAPP_NUMBER = '94763442220';

const badgeConfig = {
  'best-deal': { label: 'Best Deal', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.4)', icon: Trophy },
  'popular':   { label: 'Popular',   color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.4)', icon: Star },
  'none':      { label: null, color: null, bg: null, border: null, icon: null },
};

const SkeletonCard = () => (
  <div className="rounded-2xl overflow-hidden animate-pulse"
    style={{ background: 'rgba(25,25,35,0.8)', border: '1px solid rgba(139,92,246,0.1)' }}>
    <div className="p-6 space-y-4">
      <div className="h-5 bg-gray-700/60 rounded-lg w-1/2 mx-auto" />
      <div className="h-10 bg-gray-700/40 rounded-lg w-3/4 mx-auto" />
      <div className="h-4 bg-gray-700/30 rounded-lg w-2/3 mx-auto" />
      <div className="h-11 bg-gray-700/30 rounded-xl mt-4" />
    </div>
  </div>
);

const UCPackageCard = ({ pkg, index }) => {
  const badge = badgeConfig[pkg.badge] || badgeConfig.none;
  const BadgeIcon = badge.icon;

  // Support both old ucAmount and new ucAmounts array
  const amounts = pkg.ucAmounts?.length ? pkg.ucAmounts : (pkg.ucAmount ? [pkg.ucAmount] : []);
  const displayAmounts = amounts.map(a => typeof a === 'number' ? `${a.toLocaleString()} UC` : a).join(' + ');

  const waMessage = encodeURIComponent(
    `Hi Yathu Official, I want to buy UC Package:\n${displayAmounts}${pkg.bonus ? ` + ${pkg.bonus}` : ''}\nPrice: ${pkg.price}`
  );
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`;

  const isBonus = pkg.category === 'bonus';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      whileHover={{ y: -8 }}
      className="group relative flex flex-col rounded-2xl overflow-hidden text-center"
      style={{
        background: 'linear-gradient(145deg, rgba(25,25,35,0.97), rgba(15,15,22,0.98))',
        border: pkg.badge === 'best-deal'
          ? '1px solid rgba(245,158,11,0.3)'
          : '1px solid rgba(139,92,246,0.18)',
        transition: 'all 0.35s ease',
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      {pkg.image && (
        <div className="overflow-hidden border-b border-white/10">
          <img src={pkg.image} alt={displayAmounts || 'UC package'} className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        </div>
      )}

      {/* Top accent bar */}
      <div className="h-1 w-full" style={{
        background: pkg.badge === 'best-deal'
          ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
          : pkg.badge === 'popular'
          ? 'linear-gradient(90deg, #8b5cf6, #a855f7)'
          : 'linear-gradient(90deg, #374151, #4b5563)'
      }} />

      <div className="p-7 flex flex-col flex-1 gap-4">

        {/* Category tag */}
        <div className="flex justify-center gap-2">
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold"
            style={isBonus
              ? { background: 'rgba(139,92,246,0.15)', color: '#c084fc', border: '1px solid rgba(139,92,246,0.3)' }
              : { background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)' }
            }>
            {isBonus ? '🎁 Bonus UC' : '🎮 Regular UC'}
          </span>
          {badge.label && BadgeIcon && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold"
              style={{ background: badge.bg, border: `1px solid ${badge.border}`, color: badge.color }}>
              <BadgeIcon className="w-3 h-3" />{badge.label}
            </span>
          )}
        </div>

        {/* UC Amount */}
        <div>
          <div className="text-4xl font-black mb-1"
            style={{ background: 'linear-gradient(135deg,#a855f7,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            {displayAmounts || '—'}
          </div>
        </div>

        {/* Bonus */}
        {pkg.bonus && (
          <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl"
            style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-semibold text-purple-300">{pkg.bonus}</span>
          </div>
        )}

        {pkg.description && (
          <p className="text-sm leading-relaxed text-gray-300">{pkg.description}</p>
        )}

        {/* Top-up method */}
        {pkg.topupMethod === 'tag' && (
          <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold"
            style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.3)', color: '#fbbf24' }}>
            🏷 Character ID Required
          </div>
        )}
        {pkg.topupMethod === 'login' && (
          <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold"
            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc' }}>
            🔐 Login Required
          </div>
        )}

        {/* Price */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {pkg.price === 'Inbox' ? (
            <div className="text-2xl font-black" style={{ color: '#a855f7' }}>📩 Inbox for Price</div>
          ) : (
            <>
              <div className="text-3xl font-black text-white mb-1">LKR {pkg.price}</div>
              <div className="text-gray-500 text-xs">One-time payment</div>
            </>
          )}
        </div>

        {/* Status */}
        <div className="flex justify-center">
          <span className="px-3 py-1 rounded-full text-xs font-semibold"
            style={pkg.status === 'available'
              ? { background: 'rgba(34,197,94,0.15)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)' }
              : { background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }
            }>
            {pkg.status === 'available' ? '● Available' : '● Unavailable'}
          </span>
        </div>

        {/* CTA */}
        {pkg.status === 'available' ? (
          <a href={waLink} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff', boxShadow: '0 4px 20px rgba(34,197,94,0.3)' }}>
            <MessageCircle className="w-4 h-4" /> Buy Now on WhatsApp
          </a>
        ) : (
          <div className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm"
            style={{ background: 'rgba(100,100,100,0.15)', color: '#6b7280', border: '1px solid rgba(100,100,100,0.2)', cursor: 'not-allowed' }}>
            <MessageCircle className="w-4 h-4" /> Currently Unavailable
          </div>
        )}
      </div>
    </motion.div>
  );
};

const UCPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/uc-packages?status=available');
        setPackages(res.data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: '#0a0a0a', fontFamily: 'Poppins, sans-serif' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-semibold uppercase tracking-widest"
            style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', color: '#c084fc' }}>
            <Package className="w-3.5 h-3.5" /> UC Packages
          </div>
          <h1 className="font-black text-4xl md:text-5xl text-white mb-4">
            Buy <span style={{ background: 'linear-gradient(135deg,#8b5cf6,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>UC Packages</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Get Unknown Cash (UC) at the best prices. Fast delivery directly to your PUBG account via WhatsApp.
          </p>
        </motion.div>

        {/* How it works */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
          {[
            { step: '01', title: 'Choose Package', desc: 'Pick the UC amount that suits your needs.' },
            { step: '02', title: 'Contact on WhatsApp', desc: 'Click Buy Now and message us your order.' },
            { step: '03', title: 'Instant Delivery', desc: 'UC is topped up to your account right away.' },
          ].map((s) => (
            <div key={s.step} className="p-5 rounded-2xl text-center"
              style={{ background: 'rgba(25,25,35,0.6)', border: '1px solid rgba(139,92,246,0.12)' }}>
              <div className="text-xs font-black tracking-widest mb-2" style={{ color: '#8b5cf6' }}>STEP {s.step}</div>
              <div className="text-white font-bold mb-1 text-sm">{s.title}</div>
              <div className="text-gray-500 text-xs leading-relaxed">{s.desc}</div>
            </div>
          ))}
        </motion.div>

        {/* Packages Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-7xl mb-6">💎</div>
            <h3 className="text-2xl font-bold text-white mb-3">No UC Packages Available</h3>
            <p className="text-gray-500 mb-6">Check back soon or contact us directly.</p>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white"
              style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)' }}>
              <MessageCircle className="w-4 h-4" /> Contact Us
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {packages.map((pkg, i) => (
              <UCPackageCard key={pkg._id} pkg={pkg} index={i} />
            ))}
          </div>
        )}

        {/* Trust footer */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="mt-16 p-6 rounded-2xl text-center"
          style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}>
          <p className="text-gray-400 text-sm">
            🔒 <span className="text-white font-semibold">100% Secure</span> &nbsp;·&nbsp;
            ⚡ <span className="text-white font-semibold">Instant Delivery</span> &nbsp;·&nbsp;
            🎧 <span className="text-white font-semibold">24/7 Support</span> &nbsp;·&nbsp;
            ✅ <span className="text-white font-semibold">Trusted by 1000+ Customers</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default UCPackages;
