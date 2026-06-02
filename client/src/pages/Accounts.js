import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import axios from 'axios';
import AccountCard from '../components/AccountCard';

const API_BASE_URL = (process.env.REACT_APP_API_URL || '/api').replace(/\/+$/, '');

const SORT_OPTIONS = [
  { value: 'createdAt-desc', label: 'Newest First' },
  { value: 'createdAt-asc',  label: 'Oldest First' },
  { value: 'price-asc',      label: 'Price: Low → High' },
  { value: 'price-desc',     label: 'Price: High → Low' },
];

const SkeletonCard = () => (
  <div className="rounded-2xl overflow-hidden animate-pulse"
    style={{ background: 'rgba(25,25,35,0.8)', border: '1px solid rgba(139,92,246,0.1)' }}>
    <div className="h-48 bg-gray-800/60" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-gray-700/60 rounded-lg w-3/4" />
      <div className="h-3 bg-gray-700/40 rounded-lg w-1/2" />
      <div className="h-3 bg-gray-700/40 rounded-lg w-2/3" />
      <div className="h-9 bg-gray-700/30 rounded-xl mt-4" />
    </div>
  </div>
);

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const [search, setSearch]       = useState('');
  const [status, setStatus]       = useState('available');
  const [sortBy, setSortBy]       = useState('createdAt-desc');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage]           = useState(1);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const [field, order] = sortBy.split('-');
      const params = new URLSearchParams({
        page, limit: 12, sortBy: field, sortOrder: order,
        ...(status !== 'all' && { status }),
        ...(search.trim() && { search: search.trim() }),
      });
      const res = await axios.get(`${API_BASE_URL}/accounts?${params}`);
      setAccounts(res.data.data);
      setPagination(res.data.pagination);
    } catch (e) {
      console.error(e);
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, status, sortBy]);

  useEffect(() => { fetchAccounts(); }, [fetchAccounts]);

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [search, status, sortBy]);

  const activeFilterCount = [status !== 'available'].filter(Boolean).length;

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: '#0a0a0a', fontFamily: 'Poppins, sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-semibold uppercase tracking-widest"
            style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', color: '#c084fc' }}>
            <Package className="w-3.5 h-3.5" /> Browse All Accounts
          </div>
          <h1 className="font-black text-4xl md:text-5xl text-white mb-3">
            Gaming <span style={{ background: 'linear-gradient(135deg,#8b5cf6,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Accounts</span>
          </h1>
          <p className="text-gray-400 text-lg">
            {pagination.total > 0 ? `${pagination.total} account${pagination.total !== 1 ? 's' : ''} available` : 'Browse our premium collection'}
          </p>
        </motion.div>

        {/* Search & Filter Bar */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="mb-8 space-y-4">
          <div className="flex gap-3 flex-wrap">
            {/* Search */}
            <div className="flex-1 min-w-64 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search by Account ID, features..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl text-sm text-white placeholder-gray-500 outline-none transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', focusBorderColor: 'rgba(139,92,246,0.5)' }}
                onFocus={e => e.target.style.borderColor = 'rgba(139,92,246,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort */}
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="px-4 py-3 rounded-xl text-sm text-white outline-none cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value} style={{ background: '#1a1a1a' }}>{o.label}</option>)}
            </select>

            {/* Filter toggle */}
            <button onClick={() => setShowFilters(v => !v)}
              className="relative flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{ background: showFilters ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${showFilters ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.1)'}`, color: showFilters ? '#c084fc' : '#9ca3af' }}>
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white"
                  style={{ background: '#8b5cf6' }}>{activeFilterCount}</span>
              )}
            </button>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-5 rounded-2xl space-y-4"
                  style={{ background: 'rgba(25,25,35,0.8)', border: '1px solid rgba(139,92,246,0.15)' }}>
                  <div className="grid grid-cols-1 gap-4">
                    {/* Status */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Status</label>
                      <div className="flex gap-2">
                        {[{ v: 'available', l: 'Available' }, { v: 'sold', l: 'Sold' }, { v: 'all', l: 'All' }].map(s => (
                          <button key={s.v} onClick={() => setStatus(s.v)}
                            className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200"
                            style={status === s.v
                              ? { background: 'rgba(139,92,246,0.3)', border: '1px solid rgba(139,92,246,0.5)', color: '#c084fc' }
                              : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#6b7280' }}>
                            {s.l}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {activeFilterCount > 0 && (
                    <button onClick={() => { setStatus('available'); }}
                      className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors">
                      <X className="w-3.5 h-3.5" /> Clear filters
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : accounts.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <div className="text-7xl mb-6">🎮</div>
            <h3 className="text-2xl font-bold text-white mb-3">No accounts found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filters.</p>
            <button onClick={() => { setSearch(''); setStatus('available'); setSortBy('createdAt-desc'); setPage(1); }}
              className="px-6 py-3 rounded-xl font-semibold text-sm text-white"
              style={{ background: 'linear-gradient(135deg,#8b5cf6,#a855f7)' }}>
              Reset Filters
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {accounts.map((account, i) => (
              <AccountCard key={account._id} account={account} index={i} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-2.5 rounded-xl disabled:opacity-30 transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </button>
            {Array.from({ length: pagination.pages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === pagination.pages || Math.abs(p - page) <= 1)
              .reduce((acc, p, i, arr) => {
                if (i > 0 && arr[i - 1] !== p - 1) acc.push('...');
                acc.push(p); return acc;
              }, [])
              .map((p, i) =>
                p === '...'
                  ? <span key={`dots-${i}`} className="px-2 text-gray-600">...</span>
                  : (
                    <button key={p} onClick={() => setPage(p)}
                      className="w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-200"
                      style={page === p
                        ? { background: 'linear-gradient(135deg,#8b5cf6,#a855f7)', color: '#fff' }
                        : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#9ca3af' }}>
                      {p}
                    </button>
                  )
              )}
            <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages}
              className="p-2.5 rounded-xl disabled:opacity-30 transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Accounts;
