import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  UserCircle2,
  Mail,
  Phone,
  Shield,
  CalendarDays,
  Lock,
  Save,
  LogOut,
  Wallet,
  Activity,
  FileText,
  ChevronRight,
  CheckCircle2,
  Package2,
  Sparkles,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { termsSections } from '../../data/termsContent';

const tabs = [
  { id: 'profile', label: 'Profile Settings', icon: UserCircle2, note: 'Name and contact details' },
  { id: 'password', label: 'Change Password', icon: Lock, note: 'Security and password updates' },
  { id: 'funds', label: 'Fund Added History', icon: Wallet, note: 'Wallet deposits only' },
  { id: 'tracker', label: 'Fund Tracker', icon: Activity, note: 'Pending and completed progress' },
  { id: 'terms', label: 'Terms', icon: FileText, note: 'Store rules and policy notes' },
];

const UserProfile = () => {
  const { customer, updateUserProfile, changeUserPassword, userLogout, loadCustomer, getUserOrders } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab');
  const allowedTabs = tabs.map((tab) => tab.id);
  const initialTab = allowedTabs.includes(currentTab) ? currentTab : 'profile';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [profileForm, setProfileForm] = useState({ fullName: '', whatsappNumber: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    const nextTab = allowedTabs.includes(currentTab) ? currentTab : 'profile';
    setActiveTab(nextTab);
  }, [currentTab]);

  useEffect(() => {
    if (customer) {
      setProfileForm({
        fullName: customer.fullName || '',
        whatsappNumber: customer.whatsappNumber || '',
      });
    }
  }, [customer]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getUserOrders();
        setOrders(response.data || []);
      } catch (error) {
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const customerInitial = customer?.fullName?.trim()?.charAt(0)?.toUpperCase() || 'U';
  const labelClass = 'ml-1 text-sm font-semibold text-gray-300';
  const inputClass = 'w-full rounded-2xl border border-white/10 bg-white/5 py-4 px-4 text-white outline-none focus:border-purple-400/50';
  const walletHistory = useMemo(
    () =>
      Array.isArray(customer?.walletHistory)
        ? [...customer.walletHistory].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        : [],
    [customer?.walletHistory]
  );

  const fundSummary = useMemo(() => {
    const totalAdded = walletHistory.reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
    const pendingOrders = orders.filter((order) => ['Pending', 'Processing', 'Unpaid'].includes(order.orderStatus) || ['Pending', 'Unpaid'].includes(order.paymentStatus));

    return {
      totalAdded,
      addedCount: walletHistory.length,
      pendingCount: pendingOrders.length,
      lastAddedAt: walletHistory[0]?.createdAt || null,
    };
  }, [orders, walletHistory]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      await updateUserProfile(profileForm);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      setSavingPassword(true);
      await changeUserPassword(passwordForm);
      toast.success('Password changed successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = async () => {
    await userLogout();
    toast.success('Logout successful');
    navigate('/');
  };

  const selectTab = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const renderContent = () => {
    if (activeTab === 'profile') {
      return (
        <form onSubmit={handleProfileSubmit} className="rounded-[28px] border border-white/10 bg-[#09090d]/85 p-6 sm:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.3)]">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-purple-200">
            <UserCircle2 className="h-4 w-4" />
            Profile
          </div>
          <h2 className="text-2xl font-black text-white">Profile Settings</h2>
          <p className="mt-2 text-sm text-gray-400">Change your name and WhatsApp number from here.</p>
          <div className="mt-6 grid gap-5">
            <div>
              <label className={labelClass}>Full Name</label>
              <input
                value={profileForm.fullName}
                onChange={(e) => setProfileForm((prev) => ({ ...prev, fullName: e.target.value }))}
                className={`${inputClass} mt-2`}
              />
            </div>
            <div>
              <label className={labelClass}>WhatsApp Number</label>
              <input
                value={profileForm.whatsappNumber}
                onChange={(e) => setProfileForm((prev) => ({ ...prev, whatsappNumber: e.target.value }))}
                className={`${inputClass} mt-2`}
              />
            </div>
          </div>
          <button type="submit" disabled={savingProfile} className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 px-6 py-4 font-bold text-white shadow-[0_18px_40px_rgba(124,58,237,0.28)] transition hover:from-purple-500 hover:via-violet-500 hover:to-fuchsia-500 disabled:opacity-60">
            <Save className="w-4 h-4" />
            {savingProfile ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      );
    }

    if (activeTab === 'password') {
      return (
        <form onSubmit={handlePasswordSubmit} className="rounded-[28px] border border-white/10 bg-[#09090d]/85 p-6 sm:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.3)]">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-purple-200">
            <Lock className="h-4 w-4" />
            Security
          </div>
          <h2 className="text-2xl font-black text-white">Change Password</h2>
          <p className="mt-2 text-sm text-gray-400">Keep your account secure with a strong new password.</p>
          <div className="mt-6 grid gap-5">
            <div>
              <label className={labelClass}>Current Password</label>
              <input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))} className={`${inputClass} mt-2`} />
            </div>
            <div>
              <label className={labelClass}>New Password</label>
              <input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))} className={`${inputClass} mt-2`} />
            </div>
            <div>
              <label className={labelClass}>Confirm New Password</label>
              <input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))} className={`${inputClass} mt-2`} />
            </div>
          </div>
          <button type="submit" disabled={savingPassword} className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 px-6 py-4 font-bold text-white shadow-[0_18px_40px_rgba(124,58,237,0.28)] transition hover:from-purple-500 hover:via-violet-500 hover:to-fuchsia-500 disabled:opacity-60">
            <Lock className="w-4 h-4" />
            {savingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      );
    }

    if (activeTab === 'funds') {
      return (
        <div className="rounded-[28px] border border-white/10 bg-[#09090d]/85 p-6 sm:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.3)]">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-emerald-200">
            <Wallet className="h-4 w-4" />
            Wallet History
          </div>
          <h2 className="text-2xl font-black text-white">Fund Added History</h2>
          <p className="mt-2 text-sm text-gray-400">Only real wallet deposits and fund additions will appear here.</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5">
              <div className="text-sm text-emerald-300">Total Added</div>
              <div className="mt-2 text-3xl font-black text-white">LKR {fundSummary.totalAdded.toLocaleString()}</div>
            </div>
            <div className="rounded-3xl border border-purple-500/20 bg-purple-500/10 p-5">
              <div className="text-sm text-purple-300">Successful Adds</div>
              <div className="mt-2 text-3xl font-black text-white">{fundSummary.addedCount}</div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <div className="text-sm text-gray-400">Latest Added</div>
              <div className="mt-2 text-lg font-bold text-white">
                {fundSummary.lastAddedAt ? new Date(fundSummary.lastAddedAt).toLocaleString() : 'No history yet'}
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {ordersLoading ? (
              <div className="py-16 flex justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500/20 border-t-purple-500" />
              </div>
            ) : walletHistory.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-14 text-center">
                <Wallet className="mx-auto h-10 w-10 text-purple-400/70" />
                <h3 className="mt-4 text-xl font-bold text-white">No fund history yet</h3>
                <p className="mt-2 text-gray-400">This section will show records only after funds are actually added to your wallet.</p>
              </div>
            ) : (
              walletHistory.map((entry) => (
                  <div key={entry.id} className="rounded-3xl border border-white/8 bg-white/[0.03] p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="text-lg font-bold text-white">{entry.paymentMethod || 'Wallet Deposit'}</div>
                        <div className="mt-1 text-sm text-gray-400">{entry.details || 'Fund added to wallet'}</div>
                      </div>
                      <div className="text-left md:text-right">
                        <div className="text-2xl font-black text-white">LKR {Number(entry.amount || 0).toLocaleString()}</div>
                        <div className="mt-1 text-sm text-gray-500">{entry.createdAt ? new Date(entry.createdAt).toLocaleString() : '-'}</div>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      );
    }

    if (activeTab === 'tracker') {
      return (
        <div className="rounded-[28px] border border-white/10 bg-[#09090d]/85 p-6 sm:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.3)]">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-blue-200">
            <Activity className="h-4 w-4" />
            Activity Tracker
          </div>
          <h2 className="text-2xl font-black text-white">Fund Tracker</h2>
          <p className="mt-2 text-sm text-gray-400">Quick tracking for recent payment and order activity.</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-5">
              <div className="text-sm text-yellow-300">Pending Actions</div>
              <div className="mt-2 text-3xl font-black text-white">{fundSummary.pendingCount}</div>
            </div>
            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5">
              <div className="text-sm text-emerald-300">Completed Orders</div>
              <div className="mt-2 text-3xl font-black text-white">{orders.filter((order) => order.orderStatus === 'Completed').length}</div>
            </div>
            <div className="rounded-3xl border border-blue-500/20 bg-blue-500/10 p-5">
              <div className="text-sm text-blue-300">Total Orders</div>
              <div className="mt-2 text-3xl font-black text-white">{orders.length}</div>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-white/8 bg-white/[0.03] p-5">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-purple-500/10 p-3">
                <Activity className="h-5 w-5 text-purple-300" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Tracker Summary</h3>
                <p className="mt-2 text-gray-400">
                  This section gives the customer a simple overview of paid, pending, and completed activity. As your payment and wallet system grows, we can connect this section to real top-up tracking data too.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-black text-white">Purchased Orders</h3>
                <p className="mt-1 text-sm text-gray-400">All your recent order activity appears here.</p>
              </div>
            </div>

            {ordersLoading ? (
              <div className="py-16 flex justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500/20 border-t-blue-500" />
              </div>
            ) : orders.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-14 text-center">
                <Package2 className="mx-auto h-10 w-10 text-blue-400/70" />
                <h3 className="mt-4 text-xl font-bold text-white">No purchased orders yet</h3>
                <p className="mt-2 text-gray-400">Your placed orders will show here once you start purchasing from the store.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="rounded-3xl border border-white/8 bg-white/[0.03] p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <div className="text-lg font-bold text-white">{order.productName || order.serviceName || 'Order'}</div>
                        <div className="mt-1 text-sm text-gray-400">
                          {[order.category, order.platform].filter(Boolean).join(' • ') || 'General'}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                          <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-purple-200">
                            Payment: {order.paymentStatus || 'Unknown'}
                          </span>
                          <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-blue-200">
                            Order: {order.orderStatus || 'Pending'}
                          </span>
                          {order.quantity ? (
                            <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-gray-200">
                              Qty: {order.quantity}
                            </span>
                          ) : null}
                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                          <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
                            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Qty</div>
                            <div className="mt-1 text-base font-bold text-white">{order.cidQuantity ?? '-'}</div>
                          </div>
                          <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
                            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Remains</div>
                            <div className="mt-1 text-base font-bold text-white">{order.cidRemains ?? '-'}</div>
                          </div>
                          <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
                            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Start</div>
                            <div className="mt-1 text-base font-bold text-white">{order.cidStartCount ?? '-'}</div>
                          </div>
                          <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
                            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">End</div>
                            <div className="mt-1 text-base font-bold text-white">{order.cidEndCount ?? '-'}</div>
                          </div>
                        </div>
                      </div>

                      <div className="text-left lg:text-right">
                        <div className="text-2xl font-black text-white">
                          LKR {Number(order.price || order.totalLkr || 0).toLocaleString()}
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          {order.createdAt ? new Date(order.createdAt).toLocaleString() : '-'}
                        </div>
                        {order.orderId ? (
                          <div className="mt-1 text-xs uppercase tracking-[0.18em] text-gray-500">
                            Order ID: {order.orderId}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="rounded-[28px] border border-white/10 bg-[#09090d]/85 p-6 sm:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.3)]">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-gray-200">
          <FileText className="h-4 w-4" />
          Terms
        </div>
        <h2 className="text-2xl font-black text-white">Terms & Conditions</h2>
        <p className="mt-2 text-sm text-gray-400">Review the complete customer terms before placing or funding orders.</p>

        <div className="mt-6 space-y-5">
          {termsSections.map((section) => (
            <div key={section.title} className="rounded-3xl border border-white/8 bg-white/[0.03] p-5 sm:p-6">
              <h3 className="flex items-center gap-3 text-xl font-black text-white">
                <CheckCircle2 className="h-5 w-5 text-purple-300" />
                {section.title}
              </h3>
              <div className="mt-4 space-y-3">
                {section.items.map((item) => (
                  <div key={item} className="rounded-2xl border border-white/6 bg-black/20 px-4 py-4 text-gray-300 leading-7">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Link
          to="/terms"
          className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-purple-500/20 bg-purple-500/10 px-5 py-3 font-semibold text-purple-200 transition hover:bg-purple-500/15 hover:text-white"
        >
          Read Full Terms Page
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#050507] pt-28 pb-16 px-4">
      <div className="mx-auto max-w-7xl grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-6">
          <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#09090d]/85 p-6 sm:p-8">
            <div className="absolute" />
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-purple-200">
              <Sparkles className="h-4 w-4" />
              Account Center
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-500 via-violet-500 to-fuchsia-600 text-2xl font-black text-white shadow-[0_18px_40px_rgba(124,58,237,0.28)]">
                {customerInitial}
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">{customer?.fullName || 'Customer'}</h1>
                <p className="mt-1 text-sm text-gray-400">Customer Settings</p>
              </div>
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-gray-300">
                <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-purple-300" /> {customer?.email || '-'}</div>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-gray-300">
                <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-purple-300" /> {customer?.whatsappNumber || '-'}</div>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-gray-300">
                <div className="flex items-center gap-3"><Shield className="h-4 w-4 text-purple-300" /> Status: {customer?.status || 'Active'}</div>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-gray-300">
                <div className="flex items-center gap-3"><CalendarDays className="h-4 w-4 text-purple-300" /> Joined: {customer?.createdAt ? new Date(customer.createdAt).toLocaleDateString() : '-'}</div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#09090d]/85 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.3)]">
            <div className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => selectTab(tab.id)}
                  className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                    activeTab === tab.id
                      ? 'bg-purple-500/15 text-white border border-purple-400/25'
                      : 'text-gray-400 hover:bg-white/[0.04] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`rounded-xl p-2 ${activeTab === tab.id ? 'bg-purple-500/20 text-purple-200' : 'bg-white/[0.05] text-gray-400'}`}>
                      <tab.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div>{tab.label}</div>
                      <div className={`mt-0.5 text-xs font-medium ${activeTab === tab.id ? 'text-purple-200/80' : 'text-gray-500'}`}>{tab.note}</div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </button>
              ))}
            </div>

            <button
              onClick={handleLogout}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-3 font-semibold text-red-300 transition hover:bg-red-500/15 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </aside>

        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[28px] border border-white/10 bg-[#09090d]/85 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-purple-500/10 p-3">
                  <UserCircle2 className="h-5 w-5 text-purple-300" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Customer Name</div>
                  <div className="text-lg font-bold text-white">{customer?.fullName || '-'}</div>
                </div>
              </div>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-[#09090d]/85 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-500/10 p-3">
                  <Wallet className="h-5 w-5 text-emerald-300" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Wallet Balance</div>
                  <div className="text-lg font-bold text-white">LKR {Number(customer?.walletBalance || 0).toLocaleString()}</div>
                </div>
              </div>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-[#09090d]/85 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-blue-500/10 p-3">
                  <Package2 className="h-5 w-5 text-blue-300" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Orders</div>
                  <div className="text-lg font-bold text-white">{orders.length}</div>
                </div>
              </div>
            </div>
          </div>

          {renderContent()}

          <div className="grid gap-4 md:grid-cols-2">
            <Link to="/user/orders" className="rounded-[28px] border border-white/10 bg-[#09090d]/85 p-6 transition hover:border-purple-400/20 hover:bg-white/[0.03]">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-purple-500/10 p-3">
                  <Package2 className="h-5 w-5 text-purple-300" />
                </div>
                <div>
                  <div className="text-lg font-bold text-white">View My Orders</div>
                  <div className="mt-1 text-sm text-gray-400">Open the full purchase history page.</div>
                </div>
              </div>
            </Link>

            <Link to="/terms" className="rounded-[28px] border border-white/10 bg-[#09090d]/85 p-6 transition hover:border-purple-400/20 hover:bg-white/[0.03]">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white/[0.06] p-3">
                  <FileText className="h-5 w-5 text-gray-200" />
                </div>
                <div>
                  <div className="text-lg font-bold text-white">Customer Terms</div>
                  <div className="mt-1 text-sm text-gray-400">Review store rules, delivery notes, and policy terms.</div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
