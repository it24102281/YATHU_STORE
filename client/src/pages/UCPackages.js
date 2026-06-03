import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Zap, Star, Trophy, Package, X } from 'lucide-react';
import axios from 'axios';

const WHATSAPP_NUMBER = '94763442220';
const API_BASE_URL = (process.env.REACT_APP_API_URL || '/api').replace(/\/+$/, '');
const DESCRIPTION_PREVIEW_LIMIT = 160;

const badgeConfig = {
  'best-deal': { label: 'Best Deal', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.4)', icon: Trophy },
  'popular':   { label: 'Popular',   color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.4)', icon: Star },
  'none':      { label: null, color: null, bg: null, border: null, icon: null },
};

const SkeletonCard = () => (
  <div className="mx-auto w-full max-w-[360px] rounded-2xl overflow-hidden animate-pulse"
    style={{ background: 'rgba(25,25,35,0.8)', border: '1px solid rgba(139,92,246,0.1)' }}>
    <div className="h-[205px] bg-gray-700/30" />
    <div className="p-5 space-y-3">
      <div className="h-5 bg-gray-700/60 rounded-lg w-1/2 mx-auto" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-700/40 rounded-lg w-1/2 mx-auto" />
        <div className="h-4 bg-gray-700/40 rounded-lg w-2/5 mx-auto" />
        <div className="h-4 bg-gray-700/40 rounded-lg w-1/3 mx-auto" />
      </div>
      <div className="h-4 bg-gray-700/30 rounded-lg w-2/3 mx-auto" />
      <div className="h-11 bg-gray-700/30 rounded-xl mt-4" />
    </div>
  </div>
);

const UCPackageCard = ({ pkg, index, onSeeMore }) => {
  const badge = badgeConfig[pkg.badge] || badgeConfig.none;
  const BadgeIcon = badge.icon;

  // Support both old ucAmount and new ucAmounts array
  const amounts = pkg.ucAmounts?.length ? pkg.ucAmounts : (pkg.ucAmount ? [pkg.ucAmount] : []);
  const displayAmounts = amounts.map(a => typeof a === 'number' ? `${a.toLocaleString()} UC` : a).join(' + ');
  const amountLines = amounts.map(a => typeof a === 'number' ? `${a.toLocaleString()} UC` : a);

  const waMessage = encodeURIComponent(
    `Hi Yathu Official, I want to buy UC Package:\n${displayAmounts}${pkg.bonus ? ` + ${pkg.bonus}` : ''}\nPrice: ${pkg.price}`
  );
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`;

  const isBonus = pkg.category === 'bonus';
  const safeDescription = pkg.description || '';
  const isLongDescription = safeDescription.length > DESCRIPTION_PREVIEW_LIMIT;
  const previewDescription = isLongDescription
    ? `${safeDescription.slice(0, DESCRIPTION_PREVIEW_LIMIT).trimEnd()}...`
    : safeDescription;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      whileHover={{ y: -8 }}
      className="group relative mx-auto flex h-full w-full max-w-[360px] flex-col overflow-hidden rounded-2xl text-center"
      style={{
        background: 'linear-gradient(145deg, rgba(25,25,35,0.97), rgba(15,15,22,0.98))',
        border: pkg.badge === 'best-deal'
          ? '1px solid rgba(245,158,11,0.3)'
          : '1px solid rgba(139,92,246,0.18)',
        transition: 'all 0.35s ease',
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      {pkg.badge === 'best-deal' && badge.label && BadgeIcon && (
        <div className="absolute right-3 top-3 z-10">
          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide shadow-lg"
            style={{
              background: 'linear-gradient(135deg, rgba(245,158,11,0.95), rgba(251,191,36,0.95))',
              color: '#1f1300',
              border: '1px solid rgba(255,220,140,0.6)',
              boxShadow: '0 8px 20px rgba(245,158,11,0.28)',
            }}
          >
            <BadgeIcon className="h-3 w-3" />
            {badge.label}
          </span>
        </div>
      )}

      {pkg.image && (
        <div className="overflow-hidden border-b border-white/10">
          <img src={pkg.image} alt={displayAmounts || 'UC package'} className="h-[205px] w-full object-cover transition-transform duration-300 group-hover:scale-105" />
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

      <div className="flex flex-1 flex-col p-5">

        {/* Category tag */}
        {isBonus && (
          <div className="mb-3 flex justify-center">
            <span className="rounded-lg px-2.5 py-1 text-xs font-bold"
              style={{ background: 'rgba(139,92,246,0.15)', color: '#c084fc', border: '1px solid rgba(139,92,246,0.3)' }}>
              🎁 Bonus UC
            </span>
          </div>
        )}

        {/* UC Amount */}
        <div className="mb-4">
          <div className="space-y-1.5">
            {amountLines.length > 0 ? amountLines.map((line, amountIndex) => (
              <div
                key={`${pkg._id}-amount-${amountIndex}`}
                className="text-[28px] font-black leading-none sm:text-[32px]"
                style={{ background: 'linear-gradient(135deg,#a855f7,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
              >
                {line}
              </div>
            )) : (
              <div
                className="text-[28px] font-black leading-none sm:text-[32px]"
                style={{ background: 'linear-gradient(135deg,#a855f7,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
              >
                —
              </div>
            )}
          </div>
        </div>

        {/* Bonus */}
        {pkg.bonus && (
          <div className="mb-3 flex items-center justify-center gap-2 rounded-xl px-4 py-2"
            style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-semibold text-purple-300">{pkg.bonus}</span>
          </div>
        )}

        <div className="mb-4 min-h-[128px] flex flex-col">
          {safeDescription ? (
            <>
              <p className="text-sm leading-relaxed text-gray-300">{previewDescription}</p>
              {isLongDescription ? (
                <button
                  type="button"
                  onClick={() => onSeeMore(pkg)}
                  className="mt-3 self-center text-sm font-semibold text-purple-300 hover:text-purple-200 transition-colors"
                >
                  See more
                </button>
              ) : (
                <div className="mt-3 h-[21px]" />
              )}
            </>
          ) : (
            <div className="h-full flex items-start justify-center">
              <div className="mt-3 h-[21px]" />
            </div>
          )}
        </div>

        {/* Top-up method */}
        {pkg.topupMethod === 'tag' && (
          <div className="mb-4 flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-bold"
            style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.3)', color: '#fbbf24' }}>
            🏷 Character ID Required
          </div>
        )}
        {pkg.topupMethod === 'login' && (
          <div className="mb-4 flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-bold"
            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc' }}>
            🔐 Login Required
          </div>
        )}

        {/* Price */}
        <div className="mb-4 flex flex-col items-center justify-center">
          {pkg.price === 'Inbox' ? (
            <div className="text-[22px] font-black leading-[1.2] sm:text-[24px] lg:text-[28px]" style={{ color: '#a855f7' }}>📩 Inbox for Price</div>
          ) : (
            <>
              <div className="mb-1 text-[24px] font-black leading-tight text-white sm:text-[28px]">LKR {pkg.price}</div>
              <div className="text-gray-500 text-xs">One-time payment</div>
            </>
          )}
        </div>

        {/* Status */}
        <div className="mb-4 flex justify-center">
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
            className="mt-auto flex items-center justify-center gap-2 rounded-xl py-3.5 font-bold text-sm transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff', boxShadow: '0 4px 20px rgba(34,197,94,0.3)' }}>
            <MessageCircle className="w-4 h-4" /> Buy Now on WhatsApp
          </a>
        ) : (
          <div className="mt-auto flex items-center justify-center gap-2 rounded-xl py-3.5 font-bold text-sm"
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
  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/uc-packages?status=available`);
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
          <h1 className="mb-4 text-[28px] font-black text-white sm:text-[30px] md:text-[34px] lg:text-[38px]">
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
          <div className="grid justify-items-center grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
          <div className="grid justify-items-center grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {packages.map((pkg, i) => (
              <UCPackageCard key={pkg._id} pkg={pkg} index={i} onSeeMore={setSelectedPackage} />
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

      {selectedPackage ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(8px)' }}
          onClick={() => setSelectedPackage(null)}
        >
          <div
            className="w-full max-w-xl rounded-3xl p-6"
            style={{
              background: 'linear-gradient(145deg, rgba(24,24,34,0.98), rgba(10,10,16,0.98))',
              border: '1px solid rgba(139,92,246,0.2)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="text-sm font-semibold text-purple-300 mb-1">UC Package Details</div>
                <h3 className="text-2xl font-black text-white">
                  {selectedPackage.ucAmounts?.length
                    ? selectedPackage.ucAmounts.map((amount) => (typeof amount === 'number' ? `${amount.toLocaleString()} UC` : amount)).join(' + ')
                    : selectedPackage.ucAmount
                    ? `${Number(selectedPackage.ucAmount).toLocaleString()} UC`
                    : 'UC Package'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPackage(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl p-5 text-gray-300 leading-relaxed text-base" style={{ background: 'rgba(255,255,255,0.04)' }}>
              {selectedPackage.description}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default UCPackages;
