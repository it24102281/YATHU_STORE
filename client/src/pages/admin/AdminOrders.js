import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Loader,
  Filter,
  Eye,
  Wallet,
  Send
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminOrders = () => {
  const { api } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submittingToCid, setSubmittingToCid] = useState(false);
  const [syncingOrderId, setSyncingOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders');
      setOrders(response.data.orders || []);
    } catch (err) {
      setError('Failed to fetch orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (order) => {
    setSelectedOrder(order);
    if (order.cidOrderId) {
      try {
        setSyncingOrderId(order._id);
        const response = await api.get(`/orders/${order._id}/sync`);
        if (response.data?.success && response.data.order) {
          const updatedOrder = response.data.order;
          setOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o));
          setSelectedOrder(prev => prev && prev._id === updatedOrder._id ? updatedOrder : prev);
        }
      } catch (err) {
        console.error('Failed to sync order details:', err);
      } finally {
        setSyncingOrderId(null);
      }
    }
  };

  const updateOrderStatus = async (orderId, newStatus, paymentStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, {
        orderStatus: newStatus,
        paymentStatus: paymentStatus || (newStatus === 'Completed' ? 'Paid' : undefined)
      });
      setSuccess('Order updated successfully!');
      fetchOrders();
      setSelectedOrder(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to update order');
    }
  };

  const submitOrderToCid = async (orderId) => {
    try {
      setSubmittingToCid(true);
      const response = await api.post(`/social/admin/submit-order/${orderId}`);
      setSuccess(response.data?.message || 'Order submitted to CID successfully!');
      fetchOrders();
      setSelectedOrder(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit order to CID');
    } finally {
      setSubmittingToCid(false);
    }
  };

  const filteredOrders = orders.filter(order =>
    statusFilter === 'all' || order.orderStatus?.toLowerCase() === statusFilter
  );

  const statusColors = {
    Pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    Processing: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    Completed: 'bg-green-500/20 text-green-300 border-green-500/30',
    Cancelled: 'bg-red-500/20 text-red-300 border-red-500/30'
  };

  const statusIcons = {
    Pending: <Clock className="w-4 h-4" />,
    Processing: <Loader className="w-4 h-4 animate-spin" />,
    Completed: <CheckCircle className="w-4 h-4" />,
    Cancelled: <AlertCircle className="w-4 h-4" />
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white">Orders Management</h1>
        <p className="text-gray-400 mt-1">View and manage customer orders</p>
      </div>

      {/* Messages */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg flex items-center gap-2"
        >
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-green-500/20 border border-green-500/50 text-green-300 px-4 py-3 rounded-lg flex items-center gap-2"
        >
          <CheckCircle className="w-5 h-5" />
          <span>{success}</span>
        </motion.div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-4 bg-gray-800/30 border border-gray-700 rounded-lg p-4">
        <Filter className="w-5 h-5 text-gray-400" />
        {['all', 'pending', 'processing', 'completed', 'cancelled'].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              statusFilter === status
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 text-purple-400 animate-spin" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/30 border border-gray-700 rounded-lg">
          <p className="text-gray-400">No orders found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredOrders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/30 border border-gray-700 rounded-lg p-4 hover:border-purple-500/50 transition-colors"
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                {/* Order Number */}
                <div>
                  <p className="text-xs text-gray-400 mb-1">Order ID</p>
                  {order.cidOrderId ? (
                    <>
                      <p className="font-mono text-sm text-emerald-400 font-bold">CID: {order.cidOrderId}</p>
                      <p className="text-[10px] text-gray-500 font-mono mt-0.5">Local: {String(order._id).slice(-10).toUpperCase()}</p>
                    </>
                  ) : (
                    <p className="font-mono text-sm text-purple-300">{String(order._id).slice(-10).toUpperCase()}</p>
                  )}
                </div>

                {/* Customer */}
                <div>
                  <p className="text-xs text-gray-400 mb-1">Customer</p>
                  <p className="text-white font-medium">{order.user?.fullName || 'N/A'}</p>
                </div>

                {/* Amount */}
                <div>
                  <p className="text-xs text-gray-400 mb-1">Amount</p>
                  <p className="text-white font-bold text-lg">Rs. {order.totalLkr || order.customerPrice || order.price} LKR</p>
                </div>

                {/* Status */}
                <div>
                  <p className="text-xs text-gray-400 mb-1">Status</p>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border w-fit ${statusColors[order.orderStatus]}`}>
                    {statusIcons[order.orderStatus]}
                    <span className="text-sm font-medium">{order.orderStatus}</span>
                  </div>
                  <p className="mt-2 text-xs text-gray-400">Payment: {order.paymentStatus || 'Unpaid'}</p>
                </div>

                {/* Actions */}
                <button
                  onClick={() => handleViewDetails(order)}
                  className="bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">Details</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 border border-gray-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">Order Details</h2>
            </div>

            <div className="p-6 space-y-4">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/30 rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-1">Order Number (Local)</p>
                  <p className="text-white font-mono">{String(selectedOrder._id).slice(-10).toUpperCase()}</p>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-1">Customer</p>
                  <p className="text-white">{selectedOrder.user?.fullName}</p>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-1">Product</p>
                  <p className="text-white">{selectedOrder.serviceName || selectedOrder.productName}</p>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-1">Amount</p>
                  <p className="text-white font-bold">Rs. {selectedOrder.totalLkr || selectedOrder.customerPrice || selectedOrder.price} LKR</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-800/30 rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-1">Platform</p>
                  <p className="text-white">{selectedOrder.platform || 'General'}</p>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-1">Quantity</p>
                  <p className="text-white">{selectedOrder.quantity || '-'}</p>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-1">Payment</p>
                  <p className="text-white">{selectedOrder.paymentStatus || 'Unpaid'}</p>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-1">CID Service ID</p>
                  <p className="text-white">{selectedOrder.cidServiceId || selectedOrder.serviceId || '-'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800/30 rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-1">Price INR</p>
                  <p className="text-white">Rs. {selectedOrder.priceInr || 0} INR</p>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-1">Price LKR / 1000</p>
                  <p className="text-white">Rs. {selectedOrder.priceLkr || 0} LKR</p>
                </div>
              </div>

              {/* CID Growth Media Provider Data */}
              {selectedOrder.cidOrderId && (
                <div className="bg-purple-950/20 border border-purple-500/30 rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-300">CID Growth Media Live Data</span>
                    {syncingOrderId === selectedOrder._id ? (
                      <div className="flex items-center gap-1.5 text-xs text-purple-400 font-semibold">
                        <Loader className="w-3.5 h-3.5 animate-spin" />
                        <span>Syncing live data...</span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-gray-500 font-mono">Synced from API</span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">CID Order ID</p>
                      <p className="text-emerald-400 font-mono font-bold mt-1 text-sm">{selectedOrder.cidOrderId}</p>
                    </div>
                    <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">Status</p>
                      <p className="text-purple-300 font-bold mt-1 text-sm">{selectedOrder.orderStatus}</p>
                    </div>
                    <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">Quantity</p>
                      <p className="text-white font-bold mt-1 text-sm">{selectedOrder.cidQuantity || selectedOrder.quantity}</p>
                    </div>
                    <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">Remains</p>
                      <p className="text-white font-bold mt-1 text-sm">{selectedOrder.cidRemains ?? selectedOrder.remains}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">Start Count</p>
                      <p className="text-white font-bold mt-1 text-sm">{selectedOrder.cidStartCount || selectedOrder.startCount}</p>
                    </div>
                    <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">End Count</p>
                      <p className="text-white font-bold mt-1 text-sm">{selectedOrder.cidEndCount || '-'}</p>
                    </div>
                  </div>

                  {selectedOrder.apiError && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-xs p-3 rounded-xl">
                      <strong>Reseller API Error:</strong> {selectedOrder.apiError}
                    </div>
                  )}
                </div>
              )}

              {selectedOrder.link && (
                <div className="bg-gray-800/30 rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-2">Booster Link</p>
                  <p className="text-white break-all">{selectedOrder.link}</p>
                </div>
              )}

              {/* Status Update */}
              <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4">
                <p className="text-sm font-bold text-white mb-3">Update Status</p>
                <div className="flex gap-2 flex-wrap">
                  {['Pending', 'Processing', 'Completed', 'Cancelled'].map(status => (
                    <button
                      key={status}
                      onClick={() => updateOrderStatus(selectedOrder._id, status)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedOrder.orderStatus === status
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4">
                <p className="text-sm font-bold text-white mb-3">Payment Control</p>
                <div className="flex gap-2 flex-wrap">
                  {['Unpaid', 'Paid', 'Refunded'].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateOrderStatus(selectedOrder._id, selectedOrder.orderStatus, status)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                        selectedOrder.paymentStatus === status
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <Wallet className="w-4 h-4" />
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4">
                <p className="text-sm font-bold text-white mb-3">CID Submission</p>
                <button
                  onClick={() => submitOrderToCid(selectedOrder._id)}
                  disabled={submittingToCid || selectedOrder.paymentStatus !== 'Paid' || Boolean(selectedOrder.cidOrderId)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 bg-purple-600 text-white disabled:bg-gray-700 disabled:text-gray-400"
                >
                  <Send className="w-4 h-4" />
                  {submittingToCid ? 'Submitting...' : selectedOrder.cidOrderId ? 'Already Sent to CID' : 'Submit Paid Order to CID'}
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold px-4 py-2 rounded-lg transition-all"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
