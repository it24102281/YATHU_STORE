import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  Shield,
  Mail,
  Lock,
  LogIn,
  AlertCircle,
  Eye,
  EyeOff,
  ChevronLeft,
  Sparkles,
  CheckCircle2,
  LayoutDashboard,
  PackageSearch,
  LineChart
} from 'lucide-react';

const featureItems = [
  {
    icon: LayoutDashboard,
    title: 'Store Control',
    description: 'Manage inventory, featured deals, offers, and the storefront from one panel.'
  },
  {
    icon: PackageSearch,
    title: 'Live Updates',
    description: 'Product changes sync straight to the customer-facing pages without hardcoded cards.'
  },
  {
    icon: LineChart,
    title: 'Business Ready',
    description: 'Track orders, manage product visibility, and keep your store polished every day.'
  }
];

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        console.log('[Frontend Login] Redirect status', {
          role: result.role || 'admin',
          redirectTo: result.redirectTo || '/admin/dashboard',
        });
        navigate(result.redirectTo || '/admin/dashboard', { replace: true });
      } else {
        setError(result.message || 'Invalid email or password');
      }
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050507] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(124,58,237,0.22),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.18),_transparent_28%)]" />
      <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-fuchsia-600/10 blur-[120px]" />
      <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-violet-700/10 blur-[140px]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr] xl:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden lg:flex"
          >
            <div className="relative flex w-full flex-col justify-between overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl xl:p-10">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(168,85,247,0.08),rgba(255,255,255,0.02),rgba(59,130,246,0.08))]" />

              <div className="relative">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-gray-300 transition hover:border-purple-400/40 hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back to Store
                </Link>

                <div className="mt-10 max-w-xl">
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-4 py-2 text-sm font-semibold text-purple-200">
                    <Sparkles className="h-4 w-4" />
                    Secure Admin Workspace
                  </div>

                  <h1 className="text-4xl font-black leading-tight text-white xl:text-5xl">
                    Run Yathu PUBG Store with a cleaner, faster control panel.
                  </h1>
                  <p className="mt-5 max-w-lg text-base leading-8 text-gray-300 xl:text-lg">
                    Access your dashboard, update products, manage Featured Deals, and keep the storefront synced from one secure admin login.
                  </p>
                </div>
              </div>

              <div className="relative mt-12 space-y-4">
                {featureItems.map(({ icon: Icon, title, description }) => (
                  <div
                    key={title}
                    className="flex items-start gap-4 rounded-2xl border border-white/8 bg-black/20 p-4"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-violet-700 shadow-lg shadow-purple-600/20">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">{title}</h2>
                      <p className="mt-1 text-sm leading-7 text-gray-400">{description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="relative mt-8 rounded-3xl border border-emerald-400/15 bg-emerald-500/8 p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300/90">
                      Protected Access
                    </p>
                    <p className="mt-2 text-sm leading-7 text-gray-300">
                      Only authorized admin accounts can access inventory, product editing, Featured Deals management, and order tools.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="w-full"
          >
            <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[#09090d]/85 shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
              <div className="h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

              <div className="p-6 sm:p-8 lg:p-10">
                <div className="mb-8 flex items-start justify-between gap-4">
                  <div>
                    <Link
                      to="/"
                      className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-gray-400 transition hover:border-purple-400/40 hover:text-white lg:hidden"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                      Store
                    </Link>

                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-purple-500 via-violet-600 to-fuchsia-600 shadow-[0_12px_40px_rgba(124,58,237,0.45)]">
                        <Shield className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-purple-300/80">
                          Admin Access
                        </p>
                        <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">
                          Welcome Back
                        </h1>
                        <p className="mt-2 max-w-sm text-sm leading-7 text-gray-400">
                          Sign in to manage your gaming marketplace, update products, and control storefront visibility.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/25 bg-red-500/10 p-4 text-red-300"
                  >
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                    <p className="text-sm leading-6">{error}</p>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="ml-1 text-sm font-semibold text-gray-300">
                      Email Address
                    </label>
                    <div className="group relative">
                      <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-purple-300" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-white outline-none transition-all placeholder:text-gray-500 focus:border-purple-400/50 focus:bg-white/[0.08] focus:shadow-[0_0_0_4px_rgba(168,85,247,0.08)]"
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="ml-1 text-sm font-semibold text-gray-300">
                      Password
                    </label>
                    <div className="group relative">
                      <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-purple-300" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-14 text-white outline-none transition-all placeholder:text-gray-500 focus:border-purple-400/50 focus:bg-white/[0.08] focus:shadow-[0_0_0_4px_rgba(168,85,247,0.08)]"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-white"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
                      Admin Note
                    </p>
                    <p className="mt-2 text-sm leading-7 text-gray-400">
                      Admin access is validated securely by the backend environment and token system. If login fails, verify your backend environment values and deployment configuration.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 px-6 py-4 font-bold text-white shadow-[0_18px_40px_rgba(124,58,237,0.28)] transition-all hover:from-purple-500 hover:via-violet-500 hover:to-fuchsia-500 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60"
                  >
                    {isLoading ? (
                      <div className="h-6 w-6 rounded-full border-[3px] border-white/30 border-t-white animate-spin" />
                    ) : (
                      <>
                        <span>Sign In to Dashboard</span>
                        <LogIn className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-gray-500">
              &copy; {new Date().getFullYear()} YATHU PUBG STORE. All rights reserved.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
