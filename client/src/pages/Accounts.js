import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown, 
  SlidersHorizontal,
  Star,
  Trophy,
  Zap,
  Shield
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import AccountCard from '../components/AccountCard';
import { useAuth } from '../context/AuthContext';

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    status: 'available',
    rank: 'all',
    server: 'all',
    minPrice: '',
    maxPrice: '',
    minLevel: '',
    maxLevel: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });
  const { api } = useAuth();

  const ranks = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Ace', 'Master'];
  const servers = ['Asia', 'Europe', 'America', 'Korea', 'Taiwan/Hong Kong/Macau'];
  const sortOptions = [
    { value: 'createdAt', label: 'Latest' },
    { value: 'price', label: 'Price' },
    { value: 'level', label: 'Level' },
    { value: 'views', label: 'Popularity' },
    { value: 'title', label: 'Name' }
  ];

  // Initialize filters from URL
  useEffect(() => {
    const filterType = searchParams.get('filter');
    if (filterType === 'premium') {
      setFilters(prev => ({ ...prev, sortBy: 'price', sortOrder: 'desc' }));
    } else if (filterType === 'skins') {
      setSearchTerm('rare skins');
    } else if (filterType === 'rank') {
      setFilters(prev => ({ ...prev, rank: 'Ace' }));
    }
  }, [searchParams]);

  useEffect(() => {
    fetchAccounts();
  }, [pagination.page, filters, searchTerm]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
        search: searchTerm || undefined
      };

      // Remove empty values
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === 'all') {
          delete params[key];
        }
      });

      const response = await api.get('/accounts', { params });
      setAccounts(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const clearFilters = () => {
    setFilters({
      status: 'available',
      rank: 'all',
      server: 'all',
      minPrice: '',
      maxPrice: '',
      minLevel: '',
      maxLevel: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const getRankColor = (rank) => {
    const colors = {
      'Bronze': 'from-purple-600 to-purple-800',
      'Silver': 'from-gray-400 to-gray-600',
      'Gold': 'from-yellow-500 to-yellow-700',
      'Platinum': 'from-cyan-500 to-cyan-700',
      'Diamond': 'from-blue-500 to-blue-700',
      'Ace': 'from-purple-500 to-purple-700',
      'Master': 'from-red-500 to-red-700'
    };
    return colors[rank] || 'from-gray-500 to-gray-700';
  };

  const getServerFlag = (server) => {
    const flags = {
      'Asia': '🇦🇸',
      'Europe': '🇪🇺',
      'America': '🇺🇸',
      'Korea': '🇰🇷',
      'Taiwan/Hong Kong/Macau': '🇹🇼'
    };
    return flags[server] || '🌍';
  };

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-4">PUBG Accounts</h1>
          <p className="text-gray-400 text-lg">
            Browse our premium collection of PUBG accounts with rare skins and high ranks
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search accounts by name, rank, or features..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>
            <button
              type="submit"
              className="btn-primary px-6"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary px-6 flex items-center space-x-2"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span>Filters</span>
              {(filters.rank !== 'all' || filters.server !== 'all' || filters.minPrice || filters.maxPrice || filters.minLevel || filters.maxLevel) && (
                <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full">
                  Active
                </span>
              )}
            </button>
          </form>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Rank Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Rank</label>
                  <select
                    value={filters.rank}
                    onChange={(e) => handleFilterChange('rank', e.target.value)}
                    className="form-input"
                  >
                    <option value="all">All Ranks</option>
                    {ranks.map(rank => (
                      <option key={rank} value={rank}>{rank}</option>
                    ))}
                  </select>
                </div>

                {/* Server Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Server</label>
                  <select
                    value={filters.server}
                    onChange={(e) => handleFilterChange('server', e.target.value)}
                    className="form-input"
                  >
                    <option value="all">All Servers</option>
                    {servers.map(server => (
                      <option key={server} value={server}>{server}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Price Range</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="form-input"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Level Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Level Range</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minLevel}
                      onChange={(e) => handleFilterChange('minLevel', e.target.value)}
                      className="form-input"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxLevel}
                      onChange={(e) => handleFilterChange('maxLevel', e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              {/* Sort and Clear */}
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-800">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-300">Sort by:</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="form-input text-sm"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={filters.sortOrder}
                    onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                    className="form-input text-sm"
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-400 hover:text-yellow-500 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-400">
            {loading ? 'Loading...' : `Showing ${accounts.length} of ${pagination.total} accounts`}
          </p>
        </div>

        {/* Accounts Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="spinner"></div>
          </div>
        ) : accounts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accounts.map((account, index) => (
                <AccountCard key={account._id} account={account} index={index} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center items-center space-x-2 mt-12"
              >
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-yellow-500/50 transition-colors"
                >
                  Previous
                </button>
                
                <div className="flex space-x-2">
                  {[...Array(pagination.pages)].map((_, i) => {
                    const page = i + 1;
                    const isCurrentPage = page === pagination.page;
                    const isNearCurrent = Math.abs(page - pagination.page) <= 2 || page === 1 || page === pagination.pages;
                    
                    if (!isNearCurrent && i > 0 && i < pagination.pages - 1) {
                      if (i === Math.floor(pagination.pages / 2)) {
                        return <span key={i} className="px-2 text-gray-400">...</span>;
                      }
                      return null;
                    }
                    
                    return (
                      <button
                        key={page}
                        onClick={() => setPagination(prev => ({ ...prev, page }))}
                        className={`w-10 h-10 rounded-lg transition-colors ${
                          isCurrentPage
                            ? 'bg-yellow-500 text-black'
                            : 'bg-gray-900 border border-gray-800 hover:border-yellow-500/50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-yellow-500/50 transition-colors"
                >
                  Next
                </button>
              </motion.div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No accounts found</h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your filters or search terms to find what you're looking for.
            </p>
            <button
              onClick={clearFilters}
              className="btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Accounts;
