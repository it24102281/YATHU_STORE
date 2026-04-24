import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, MoreVertical, Edit2, Trash2, Shield, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminAccounts = () => {
  const { api, getAuthHeaders } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/accounts', { headers: getAuthHeaders() });
      if (res.data && res.data.data) {
        setAccounts(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const filteredAccounts = accounts.filter(acc =>
    acc.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acc.level?.toString().includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600 flex items-center gap-3">
            <Users className="w-8 h-8 text-purple-500" />
            Manage Accounts
          </h1>
          <p className="text-gray-400 mt-1">
            View, edit, and manage all gaming accounts
          </p>
        </div>

        <button className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-500/25 active:scale-[0.98]">
          + Add Account
        </button>
      </div>

      <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        {/* Toolbar */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
            <input
              type="text"
              placeholder="Search by title or level..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>
          <div className="text-sm font-medium text-gray-400">
            Total: <span className="text-white">{filteredAccounts.length}</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#0a0a0a] text-gray-400 font-semibold border-b border-white/5 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4">Account Title</th>
                <th className="px-6 py-4">Level</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-20 text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                      Loading accounts...
                    </div>
                  </td>
                </tr>
              ) : filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-20 text-gray-500 font-medium">
                    <Shield className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                    No accounts found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((account, i) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={account._id || i}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-6 py-4 font-medium text-gray-200 truncate max-w-xs flex items-center gap-3">
                      {account.thumbnail && (
                        <div className="w-10 h-10 rounded-lg bg-gray-800 overflow-hidden shrink-0">
                          <img src={account.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                        </div>
                      )}
                      {account.title || 'Untitled Account'}
                    </td>
                    <td className="px-6 py-4 text-gray-400 font-medium">
                      Lv. {account.level || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-purple-400 font-bold">
                      ₹{account.price || '0'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs rounded-lg font-bold ${account.status === 'Available' ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : account.status === 'Sold' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                        }`}>
                        {account.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors inline-block" title="View details">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors inline-block" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 rounded-lg transition-colors inline-block" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAccounts;
