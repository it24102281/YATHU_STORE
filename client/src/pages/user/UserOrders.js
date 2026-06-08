import React, { useEffect, useState } from 'react';
import { Package2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const badgeClasses = {
  Pending: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
  Processing: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  Completed: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  Inprogress: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  'In Progress': 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  Cancelled: 'bg-red-500/15 text-red-300 border-red-500/30',
  Canceled: 'bg-red-500/15 text-red-300 border-red-500/30',
  Unpaid: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
  Paid: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  Failed: 'bg-red-500/15 text-red-300 border-red-500/30',
  Refunded: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
};

const formatMoney = (value) => {
  const amount = Number(value || 0);
  return Number.isFinite(amount) ? amount.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0';
};

const formatCount = (value) => {
  if (value === undefined || value === null || value === '') {
    return '-';
  }

  const amount = Number(value);
  return Number.isFinite(amount) ? amount.toLocaleString() : String(value);
};

const getEndCount = (order) => {
  if (order.cidEndCount) {
    return formatCount(order.cidEndCount);
  }

  const startCount = Number(order.startCount || 0);
  const quantity = Number(order.quantity || 0);
  const remains = Number(order.remains || 0);

  if (!startCount || !quantity) {
    return '-';
  }

  return (startCount + quantity - remains).toLocaleString();
};

const UserOrders = () => {
  const { getUserOrders } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getUserOrders();
        setOrders(response.data || []);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-[#050507] pt-28 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white">My Orders</h1>
          <p className="text-gray-400 mt-2">Track all your purchases, statuses, and payment updates.</p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-[#09090d]/85 backdrop-blur-2xl p-6 sm:p-8">
          {loading ? (
            <div className="py-20 flex justify-center">
              <div className="w-10 h-10 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="py-20 text-center">
              <div className="mx-auto w-20 h-20 rounded-3xl bg-white/[0.03] border border-white/8 flex items-center justify-center">
                <Package2 className="w-10 h-10 text-purple-400/60" />
              </div>
              <h2 className="mt-6 text-2xl font-bold text-white">No orders found</h2>
              <p className="mt-2 text-gray-400">Your future purchases will appear here.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {orders.map((order) => (
                <div key={order.id} className="rounded-3xl border border-white/8 bg-white/[0.03] p-5 sm:p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-gray-500 font-semibold">
                        {order.cidOrderId ? 'CID Order ID' : 'Order ID'}
                      </p>
                      <p className="mt-2 text-xl font-black text-white">{order.orderId}</p>
                      <p className="mt-3 text-lg font-semibold text-purple-300">{order.productName}</p>
                      <p className="mt-1 text-sm text-gray-400">{order.category || 'General'}</p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-xs uppercase tracking-[0.24em] text-gray-500 font-semibold">Charge</p>
                      <p className="mt-2 text-3xl font-black text-white">LKR {formatMoney(order.price)}</p>
                      <p className="mt-2 text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold">Service</p>
                      <p className="mt-2 text-sm font-semibold leading-6 text-white">{order.serviceName || order.productName}</p>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold">Link</p>
                      {order.link ? (
                        <a href={order.link} target="_blank" rel="noreferrer" className="mt-2 block break-all text-sm font-semibold leading-6 text-purple-200 hover:text-white">
                          {order.link}
                        </a>
                      ) : (
                        <p className="mt-2 text-sm font-semibold text-white">-</p>
                      )}
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold">Quantity</p>
                      <p className="mt-2 text-sm font-semibold text-white">Qty: {formatCount(order.cidQuantity || order.quantity)}</p>
                      <p className="mt-1 text-sm font-semibold text-white">Remains: {formatCount(order.cidRemains ?? order.remains)}</p>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold">Date & Time</p>
                      <p className="mt-2 text-sm font-semibold text-white">{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold">Start</p>
                      <p className="mt-2 text-sm font-semibold text-white">{formatCount(order.cidStartCount || order.startCount)}</p>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold">End</p>
                      <p className="mt-2 text-sm font-semibold text-white">{getEndCount(order)}</p>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold">Store Charge</p>
                      <p className="mt-2 text-sm font-semibold text-white">LKR {formatMoney(order.price)}</p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <span className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${badgeClasses[order.paymentStatus]}`}>
                      Payment: {order.paymentStatus}
                    </span>
                    <span className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${badgeClasses[order.orderStatus]}`}>
                      Status: {order.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserOrders;
