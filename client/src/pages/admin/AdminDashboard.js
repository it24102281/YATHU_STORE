import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Box,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Loader,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { api, getAuthHeaders } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch users
      const usersRes = await api.get('/admin/users', { headers: getAuthHeaders() }).catch(() => ({ data: { data: [] } }));
      const users = usersRes.data.data || [];

      // Fetch inventory groups
      const [accountsRes, ucRes, dealsRes] = await Promise.all([
        api.get('/accounts?status=all&limit=200').catch(() => ({ data: { data: [] } })),
        api.get('/uc-packages?status=all').catch(() => ({ data: { data: [] } })),
        api.get('/featured-deals?includeInactive=true', { headers: getAuthHeaders() }).catch(() => ({ data: { data: [] } })),
      ]);
      const products = [
        ...(accountsRes.data.data || []),
        ...(ucRes.data.data || []),
        ...(dealsRes.data.data || []),
      ];

      // Fetch orders
      const ordersRes = await api.get('/orders').catch(() => ({ data: { orders: [] } }));
      const orders = ordersRes.data.orders || [];

      const totalRevenue = orders
        .filter(o => o.orderStatus === 'Completed')
        .reduce((sum, o) => sum + o.price, 0);

      const pendingOrders = orders.filter(o => o.orderStatus === 'Pending').length;
      const completedOrders = orders.filter(o => o.orderStatus === 'Completed').length;

      setStats({
        totalUsers: users.length,
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue: totalRevenue.toFixed(2),
        pendingOrders,
        completedOrders
      });

      setRecentOrders(orders.slice(0, 5));
      setRecentProducts(products.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'from-blue-600 to-blue-700',
      bg: 'bg-blue-500/10'
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Box,
      color: 'from-purple-600 to-purple-700',
      bg: 'bg-purple-500/10'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'from-pink-600 to-pink-700',
      bg: 'bg-pink-500/10'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue}`,
      icon: DollarSign,
      color: 'from-green-600 to-green-700',
      bg: 'bg-green-500/10'
    }
  ];

  const orderStats = [
    {
      label: 'Completed Orders',
      value: stats.completedOrders,
      icon: CheckCircle,
      color: 'text-green-400'
    },
    {
      label: 'Pending Orders',
      value: stats.pendingOrders,
      icon: Clock,
      color: 'text-yellow-400'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-white">Dashboard</h1>
        <p className="text-gray-400 mt-2">Welcome to your admin control panel</p>
      </div>

      {/* Stats Cards */}
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
                className={`${card.bg} border border-gray-700 rounded-lg p-6 hover:border-purple-500/50 transition-colors`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`bg-gradient-to-br ${card.color} p-3 rounded-lg`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <p className="text-gray-400 text-sm font-medium mb-1">{card.title}</p>
                <p className="text-4xl font-black text-white">{card.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Order Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {orderStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-gray-800/30 border border-gray-700 rounded-lg p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-black text-white mt-2">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-12 h-12 ${stat.color}`} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-800/30 border border-gray-700 rounded-lg p-6"
          >
            <h2 className="text-xl font-bold text-white mb-4">Recent Orders</h2>
            {recentOrders.length === 0 ? (
              <p className="text-gray-400">No orders yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left px-4 py-3 text-gray-300 font-bold">Order ID</th>
                      <th className="text-left px-4 py-3 text-gray-300 font-bold">Customer</th>
                      <th className="text-left px-4 py-3 text-gray-300 font-bold">Amount</th>
                      <th className="text-left px-4 py-3 text-gray-300 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order._id} className="border-b border-gray-700 hover:bg-gray-900/30">
                        <td className="px-4 py-3 text-gray-300 font-mono text-sm">{String(order._id).slice(-10).toUpperCase()}</td>
                        <td className="px-4 py-3 text-white">{order.user?.fullName || 'Guest'}</td>
                        <td className="px-4 py-3 text-white font-bold">LKR {order.price}</td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            order.orderStatus === 'Completed' ? 'bg-green-500/20 text-green-300' :
                            order.orderStatus === 'Pending' ? 'bg-yellow-500/20 text-yellow-300' :
                            order.orderStatus === 'Processing' ? 'bg-blue-500/20 text-blue-300' :
                            'bg-red-500/20 text-red-300'
                          }`}>
                            {order.orderStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>

          {/* Recent Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gray-800/30 border border-gray-700 rounded-lg p-6"
          >
            <h2 className="text-xl font-bold text-white mb-4">Recently Added Products</h2>
            {recentProducts.length === 0 ? (
              <p className="text-gray-400">No products yet</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentProducts.map((product) => (
                  <div
                    key={product._id}
                    className="bg-gray-900/50 border border-gray-600 rounded-lg p-4 hover:border-purple-500/50 transition-colors"
                  >
                    <h3 className="text-white font-bold mb-2">{product.name}</h3>
                    <p className="text-gray-400 text-sm mb-3">{product.description?.substring(0, 60)}...</p>
                    <div className="flex items-center justify-between">
                      <span className="text-purple-400 font-bold">${product.price}</span>
                      <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-medium">
                        Stock: {product.stock}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg p-6"
          >
            <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a
                href="/admin/inventory"
                className="bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 font-bold px-4 py-3 rounded-lg transition-colors text-center"
              >
                Add Product
              </a>
              <a
                href="/admin/orders"
                className="bg-pink-600/30 hover:bg-pink-600/50 text-pink-300 font-bold px-4 py-3 rounded-lg transition-colors text-center"
              >
                View Orders
              </a>
              <a
                href="/admin/finance"
                className="bg-green-600/30 hover:bg-green-600/50 text-green-300 font-bold px-4 py-3 rounded-lg transition-colors text-center"
              >
                Finance
              </a>
              <a
                href="/admin/offers"
                className="bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 font-bold px-4 py-3 rounded-lg transition-colors text-center"
              >
                Social Pricing
              </a>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
