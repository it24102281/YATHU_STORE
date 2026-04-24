import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Gamepad2, AlertCircle, RefreshCw, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const AdminDashboard = () => {
  const { getAuthHeaders, api } = useAuth();
  const [stats, setStats] = useState({
    totalAccounts: 0,
    activeAccounts: 0,
    soldAccounts: 0,
    totalContacts: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      // We simulate stats fetching since no dedicated stats endpoint exists yet, 
      // or we can try to fetch counts from existing endpoints if available.
      // For now, let's fetch accounts and contacts to count them.

      const headers = getAuthHeaders();
      const [accountsRes, contactsRes] = await Promise.all([
        api.get('/accounts', { headers }).catch(() => ({ data: { data: [] } })),
        api.get('/contacts', { headers }).catch(() => ({ data: { data: [] } }))
      ]);

      const accounts = accountsRes.data.data || [];
      const contacts = contactsRes.data.data || [];

      setStats({
        totalAccounts: accounts.length,
        activeAccounts: accounts.filter(a => a.status === 'Available').length,
        soldAccounts: accounts.filter(a => a.status === 'Sold').length,
        totalContacts: contacts.length
      });
    } catch (err) {
      console.error('Failed to fetch dashboard stats', err);
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Accounts',
      value: stats.totalAccounts,
      icon: Gamepad2,
      color: 'from-purple-500 to-purple-700',
      lightColor: 'bg-purple-500/10 text-purple-400'
    },
    {
      title: 'Available',
      value: stats.activeAccounts,
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-700',
      lightColor: 'bg-green-500/10 text-green-400'
    },
    {
      title: 'Sold',
      value: stats.soldAccounts,
      icon: Users,
      color: 'from-blue-500 to-indigo-700',
      lightColor: 'bg-blue-500/10 text-blue-400'
    },
    {
      title: 'Contacts',
      value: stats.totalContacts,
      icon: AlertCircle,
      color: 'from-orange-500 to-red-700',
      lightColor: 'bg-orange-500/10 text-orange-400'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
            Dashboard Overview
          </h1>
          <p className="text-gray-400 mt-1">
            Welcome back to the YATHU admin panel
          </p>
        </div>

        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Stats
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-white/5 border border-white/10 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#111] border border-white/5 rounded-2xl p-6 relative overflow-hidden group"
            >
              <div className={`absolute top-0 right-0 p-4 opacity-10 blur-xl w-32 h-32 bg-gradient-to-br ${stat.color} rounded-full -mr-16 -mt-16 transition-opacity group-hover:opacity-20`} />

              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">
                    {stat.title}
                  </p>
                  <h3 className="text-4xl font-black text-white">
                    {stat.value}
                  </h3>
                </div>

                <div className={`p-3 rounded-xl ${stat.lightColor}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Placeholders for future charts or recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-[#111] border border-white/5 rounded-2xl p-6 min-h-[400px] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />
          <div className="text-center relative z-10">
            <Gamepad2 className="w-12 h-12 text-purple-500/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-300">Sales Analytics</h3>
            <p className="text-gray-500 mt-2">Chart integration coming soon</p>
          </div>
        </div>

        <div className="bg-[#111] border border-white/5 rounded-2xl p-6 min-h-[400px] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tl from-purple-500/5 to-transparent pointer-events-none" />
          <div className="text-center relative z-10">
            <Users className="w-12 h-12 text-purple-500/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-300">Recent Activity</h3>
            <p className="text-gray-500 mt-2">Activity feed coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
