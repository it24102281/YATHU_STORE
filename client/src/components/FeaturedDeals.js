import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Package2, RefreshCw, Sparkles, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CATEGORY_OPTIONS = [
  'All',
  'PUBG Services',
  'Premium Subscriptions',
  'Social Media Boosters',
];

const stockLabels = {
  in_stock: 'In Stock',
  limited_stock: 'Limited',
  out_of_stock: 'Out of Stock',
};

const formatPrice = (value) => `LKR ${Number(value || 0).toLocaleString()}`;
const DESCRIPTION_PREVIEW_LIMIT = 140;

const FeaturedDeals = ({
  heading = 'Featured Deals',
  subtitle = 'Explore curated offers powered directly by the inventory database.',
  showHeader = true,
  compact = false,
  showFilters = true,
  maxItems,
  latestFirst = false,
}) => {
  const { api } = useAuth();
  const [deals, setDeals] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDeal, setSelectedDeal] = useState(null);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/featured-deals');
      setDeals(res.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load featured deals right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const filteredDeals = useMemo(() => {
    let nextDeals =
      activeCategory === 'All'
        ? [...deals]
        : deals.filter((deal) => deal.category === activeCategory);

    if (latestFirst) {
      nextDeals.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    if (typeof maxItems === 'number') {
      nextDeals = nextDeals.slice(0, maxItems);
    }

    return nextDeals;
  }, [activeCategory, deals, latestFirst, maxItems]);

  const getPreviewText = (description) => {
    const safeDescription = description || 'Professional delivery with reliable support and updated inventory status.';
    if (safeDescription.length <= DESCRIPTION_PREVIEW_LIMIT) {
      return { text: safeDescription, truncated: false };
    }

    return {
      text: `${safeDescription.slice(0, DESCRIPTION_PREVIEW_LIMIT).trimEnd()}...`,
      truncated: true,
    };
  };

  return (
    <section className={compact ? 'py-16' : 'py-24'} style={{ background: 'linear-gradient(180deg, #0f0a1e 0%, #0a0a0a 100%)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {showHeader && (
          <div className="text-center mb-12">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-semibold uppercase tracking-widest"
              style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', color: '#c084fc' }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Fresh Inventory
            </div>
            <h2
              className="text-4xl md:text-5xl font-black mb-4"
              style={{
                fontFamily: 'Poppins, sans-serif',
                background: 'linear-gradient(135deg,#e2e8f0,#a855f7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {heading}
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
          </div>
        )}

        {showFilters && (
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {CATEGORY_OPTIONS.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className="px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200"
                style={
                  activeCategory === category
                    ? { background: 'linear-gradient(135deg,#8b5cf6,#a855f7)', color: '#fff', boxShadow: '0 8px 24px rgba(139,92,246,0.25)' }
                    : { background: 'rgba(255,255,255,0.05)', color: '#d1d5db', border: '1px solid rgba(255,255,255,0.08)' }
                }
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
          </div>
        ) : error ? (
          <div
            className="rounded-3xl p-10 text-center"
            style={{ background: 'rgba(127,29,29,0.18)', border: '1px solid rgba(248,113,113,0.25)' }}
          >
            <p className="text-red-300 font-semibold mb-4">{error}</p>
            <button
              onClick={fetchDeals}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg,#8b5cf6,#a855f7)' }}
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        ) : filteredDeals.length === 0 ? (
          <div
            className="rounded-3xl p-12 text-center"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(139,92,246,0.15)' }}
          >
            <div
              className="w-20 h-20 mx-auto mb-5 rounded-3xl flex items-center justify-center"
              style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)' }}
            >
              <Package2 className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No deals in this category</h3>
            <p className="text-gray-500">New inventory will appear here as soon as it is enabled from the admin panel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredDeals.map((deal, index) => {
              const buyLink = `https://wa.me/94763442220?text=${encodeURIComponent(`Hi, I want to buy ${deal.title} from Featured Deals.`)}`;
              const descriptionPreview = getPreviewText(deal.description);

              return (
                <motion.div
                  key={deal._id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06, duration: 0.35 }}
                  whileHover={{ y: -8 }}
                  className="group overflow-hidden rounded-3xl h-full flex flex-col"
                  style={{
                    background: 'linear-gradient(145deg, rgba(139,92,246,0.1), rgba(12,12,18,0.95))',
                    border: '1px solid rgba(139,92,246,0.18)',
                    boxShadow: '0 20px 45px rgba(0,0,0,0.24)',
                  }}
                >
                  <div className="relative h-52 overflow-hidden">
                    {deal.image ? (
                      <img
                        src={deal.image}
                        alt={deal.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-6xl"
                        style={{ background: 'radial-gradient(circle at top, rgba(139,92,246,0.22), rgba(15,15,24,0.96))' }}
                      >
                        {deal.category === 'PUBG Services' ? '🎮' : deal.category === 'Premium Subscriptions' ? '🎨' : '📱'}
                      </div>
                    )}
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,8,12,0.92), rgba(8,8,12,0.08))' }} />
                    <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                      <span
                        className="px-3 py-1 rounded-full text-[11px] font-bold"
                        style={{ background: 'rgba(15,23,42,0.72)', color: '#e5e7eb', border: '1px solid rgba(255,255,255,0.12)' }}
                      >
                        {deal.category}
                      </span>
                      {deal.badge && (
                        <span
                          className="px-3 py-1 rounded-full text-[11px] font-bold"
                          style={{ background: 'rgba(139,92,246,0.8)', color: '#fff' }}
                        >
                          {deal.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6 flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="text-xl font-black text-white leading-tight">{deal.title}</h3>
                        <p className="text-sm text-purple-300 mt-1">{deal.subCategory || deal.category}</p>
                      </div>
                      <span
                        className="px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap"
                        style={
                          deal.stockStatus === 'limited_stock'
                            ? { background: 'rgba(245,158,11,0.18)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.28)' }
                            : { background: 'rgba(34,197,94,0.15)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.25)' }
                        }
                      >
                        {stockLabels[deal.stockStatus] || 'Available'}
                      </span>
                    </div>

                    <div className="min-h-[138px] mb-5 flex flex-col">
                      <p className="text-sm text-gray-400 leading-relaxed">
                        {descriptionPreview.text}
                      </p>
                      {descriptionPreview.truncated ? (
                        <button
                          type="button"
                          onClick={() => setSelectedDeal(deal)}
                          className="mt-3 self-start text-sm font-semibold text-purple-300 hover:text-purple-200 transition-colors"
                        >
                          See more
                        </button>
                      ) : (
                        <div className="mt-3 h-[21px]" />
                      )}
                    </div>

                    <div className="flex items-end justify-between gap-4 mt-auto">
                      <div>
                        <div className="text-2xl font-black text-white">{formatPrice(deal.price)}</div>
                        {deal.oldPrice ? (
                          <div className="text-sm text-gray-500 line-through">{formatPrice(deal.oldPrice)}</div>
                        ) : null}
                      </div>

                      <a
                        href={buyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5"
                        style={{ background: 'linear-gradient(135deg,#8b5cf6,#a855f7)', boxShadow: '0 10px 24px rgba(139,92,246,0.28)' }}
                      >
                        Buy Now
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {selectedDeal ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(8px)' }}
          onClick={() => setSelectedDeal(null)}
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
                <div className="text-sm font-semibold text-purple-300 mb-1">{selectedDeal.category}</div>
                <h3 className="text-2xl font-black text-white">{selectedDeal.title}</h3>
                <p className="text-sm text-gray-400 mt-1">{selectedDeal.subCategory || selectedDeal.category}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDeal(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl p-5 text-gray-300 leading-relaxed text-base" style={{ background: 'rgba(255,255,255,0.04)' }}>
              {selectedDeal.description || 'Professional delivery with reliable support and updated inventory status.'}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default FeaturedDeals;
