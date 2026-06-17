import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  CheckCircle,
  Loader,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const formatLkr = (value) => `LKR ${Number(value || 0).toFixed(2)}`;

const AdminFinance = () => {
  const { api } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const fetchFinanceData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders');
      setOrders(response.data.orders || []);
    } catch (err) {
      setError('Failed to fetch finance data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate metrics
  const calculateMetrics = () => {
    let filteredOrders = orders;

    if (period === 'today') {
      const today = new Date().toDateString();
      filteredOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today);
    } else if (period === 'week') {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      filteredOrders = orders.filter(o => new Date(o.createdAt) > weekAgo);
    } else if (period === 'month') {
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      filteredOrders = orders.filter(o => new Date(o.createdAt) > monthAgo);
    }

    const completedOrders = filteredOrders.filter(o => o.orderStatus === 'Completed');
    const totalCustomerCash = completedOrders.reduce((sum, o) => sum + o.price, 0);
    const totalProfit = completedOrders.reduce((sum, o) => sum + (o.profit || 0), 0);
    const cidSpentCost = completedOrders.reduce((sum, o) => sum + (o.price - (o.profit || 0)), 0);
    const totalOrders = filteredOrders.length;

    return {
      totalCustomerCash: totalCustomerCash.toFixed(2),
      cidSpentCost: cidSpentCost.toFixed(2),
      totalProfit: totalProfit.toFixed(2),
      totalOrders,
      completedOrders: completedOrders.length,
    };
  };

  const metrics = calculateMetrics();

  const statCards = [
    {
      title: 'Total Customer Cash',
      value: formatLkr(metrics.totalCustomerCash),
      icon: DollarSign,
      color: 'from-green-600 to-green-700'
    },
    {
      title: 'CID Store Spent Cost',
      value: formatLkr(metrics.cidSpentCost),
      icon: ShoppingCart,
      color: 'from-rose-600 to-rose-700'
    },
    {
      title: 'Net Profit',
      value: formatLkr(metrics.totalProfit),
      icon: TrendingUp,
      color: 'from-purple-600 to-purple-700'
    },
    {
      title: 'Completed Orders',
      value: metrics.completedOrders,
      icon: CheckCircle,
      color: 'from-blue-600 to-blue-700'
    }
  ];

  // Get top products by revenue
  const getTopProducts = () => {
    const productRevenue = {};
    orders
      .filter(o => o.orderStatus === 'Completed')
      .forEach(order => {
        const productName = order.productName || 'Unknown';
        productRevenue[productName] = (productRevenue[productName] || 0) + order.price;
      });

    return Object.entries(productRevenue)
      .map(([name, revenue]) => ({ name, revenue: revenue.toFixed(2) }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  };

  const topProducts = getTopProducts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Finance Dashboard</h1>
          <p className="text-gray-400 mt-1">Sales, revenue, and financial analytics</p>
        </div>
      </div>

      {/* Period Filter */}
      <div className="flex items-center gap-3 bg-gray-800/30 border border-gray-700 rounded-lg p-4 w-fit">
        <Calendar className="w-5 h-5 text-gray-400" />
        {['all', 'today', 'week', 'month'].map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              period === p
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {p === 'all' ? 'All Time' : p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 text-purple-400 animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-br ${card.color} bg-opacity-10 border border-opacity-30 rounded-lg p-6`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`bg-gradient-to-br ${card.color} p-3 rounded-lg`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-gray-400 text-sm font-medium mb-1">{card.title}</p>
                <p className="text-3xl font-black text-white">{card.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Top Products by Revenue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/30 border border-gray-700 rounded-lg p-6"
          >
            <h2 className="text-xl font-bold text-white mb-4">Top Products by Revenue</h2>
            {topProducts.length === 0 ? (
              <p className="text-gray-400">No completed orders yet</p>
            ) : (
              <div className="space-y-3">
                {topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between bg-gray-900/50 rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-purple-600/30 rounded-lg font-bold text-purple-300">
                        {index + 1}
                      </div>
                      <p className="text-white font-medium">{product.name}</p>
                    </div>
                    <p className="text-green-400 font-bold text-lg">{formatLkr(product.revenue)}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/30 border border-gray-700 rounded-lg p-6"
          >
            <h2 className="text-xl font-bold text-white mb-4">Recent Transactions</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left px-4 py-3 text-gray-300 font-bold">Order ID</th>
                    <th className="text-left px-4 py-3 text-gray-300 font-bold">Customer</th>
                    <th className="text-left px-4 py-3 text-gray-300 font-bold">Amount</th>
                    <th className="text-left px-4 py-3 text-gray-300 font-bold">Status</th>
                    <th className="text-left px-4 py-3 text-gray-300 font-bold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders
                    .slice(0, 10)
                    .map((order) => (
                      <tr key={order._id} className="border-b border-gray-700 hover:bg-gray-900/30 transition-colors">
                        <td className="px-4 py-3 text-gray-300 font-mono text-sm">{String(order._id).slice(-10).toUpperCase()}</td>
                        <td className="px-4 py-3 text-white">{order.user?.fullName}</td>
                        <td className="px-4 py-3 text-white font-bold">{formatLkr(order.price)}</td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            order.orderStatus === 'Completed' ? 'bg-green-500/20 text-green-300' :
                            order.orderStatus === 'Pending' ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-gray-500/20 text-gray-300'
                          }`}>
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-sm">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default AdminFinance;
