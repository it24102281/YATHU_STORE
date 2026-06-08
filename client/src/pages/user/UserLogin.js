import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Eye, EyeOff, ChevronLeft, ShieldCheck, MessageCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const UserLogin = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [adminHintVisible, setAdminHintVisible] = useState(false);
  const { userLogin, isUserAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const normalizedIdentifier = identifier.trim().toLowerCase();
  const looksLikeAdminEmail = normalizedIdentifier === 'admin@yathupubg.com' || normalizedIdentifier.startsWith('admin@');

  useEffect(() => {
    if (isUserAuthenticated) {
      navigate(location.state?.from?.pathname || '/', { replace: true });
    }
  }, [isUserAuthenticated, location.state, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (looksLikeAdminEmail) {
      setAdminHintVisible(true);
      toast.error('This page is for customers only. Admins must use /admin/login');
      return;
    }

    setSubmitting(true);

    const result = await userLogin(identifier, password);
    setSubmitting(false);

    if (!result.success) {
      setAdminHintVisible(false);
      toast.error(result.message);
      return;
    }

    setAdminHintVisible(false);
    toast.success('Login successful');
    navigate(location.state?.from?.pathname || '/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#050507] pt-28 pb-16 px-4">
      <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-[1.05fr_0.95fr] items-center">
        <div className="hidden lg:block rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-10 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-4 py-2 text-sm font-semibold text-purple-200">
            <ShieldCheck className="w-4 h-4" />
            Customer Access
          </div>
          <h1 className="mt-6 text-5xl font-black leading-tight text-white">
            Welcome back to your store account.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-gray-300">
            Check your orders, update your profile, and manage your account with the same premium gaming-store experience.
          </p>
          <div className="mt-10 space-y-4">
            {[
              'Login using your email address or WhatsApp number',
              'Track your orders and account activity securely',
              'Reset your password any time from the customer flow',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-black/20 px-4 py-4 text-gray-300">
                <MessageCircle className="w-5 h-5 text-purple-300 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[32px] border border-white/10 bg-[#09090d]/85 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          <div className="h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
          <div className="p-6 sm:p-8 lg:p-10">
            <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition text-sm font-semibold">
              <ChevronLeft className="w-4 h-4" />
              Back to Store
            </Link>

            <div className="mt-6">
              <p className="text-xs uppercase tracking-[0.28em] text-purple-300/80 font-semibold">Customer Login</p>
              <h1 className="mt-3 text-4xl font-black text-white">Sign In</h1>
              <p className="mt-3 text-sm leading-7 text-gray-400">
                Use your email address or WhatsApp number to access your account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="ml-1 text-sm font-semibold text-gray-300">Email or WhatsApp Number</label>
                <div className="relative mt-2">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => {
                      const nextValue = e.target.value;
                      setIdentifier(nextValue);
                      const nextNormalizedIdentifier = nextValue.trim().toLowerCase();
                      setAdminHintVisible(
                        nextNormalizedIdentifier === 'admin@yathupubg.com' || nextNormalizedIdentifier.startsWith('admin@')
                      );
                    }}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-white outline-none transition placeholder:text-gray-500 focus:border-purple-400/50 focus:bg-white/[0.08]"
                    placeholder="Email or WhatsApp number"
                    required
                  />
                </div>
                {adminHintVisible && (
                  <div className="mt-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                    This page is for customers only. If you are an admin, please use{' '}
                    <Link to="/admin/login" className="font-semibold text-white underline underline-offset-4">
                      /admin/login
                    </Link>
                    .
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="ml-1 text-sm font-semibold text-gray-300">Password</label>
                  <Link to="/user/forgot-password" className="text-sm text-purple-300 hover:text-white transition">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative mt-2">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-14 text-white outline-none transition placeholder:text-gray-500 focus:border-purple-400/50 focus:bg-white/[0.08]"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-2xl bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 px-6 py-4 font-bold text-white shadow-[0_18px_40px_rgba(124,58,237,0.28)] transition hover:from-purple-500 hover:via-violet-500 hover:to-fuchsia-500 disabled:opacity-60"
              >
                {submitting ? 'Signing In...' : (
                  <span className="inline-flex items-center gap-2">
                    Sign In
                    <LogIn className="w-5 h-5" />
                  </span>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-400">
              Don&apos;t have an account?{' '}
              <Link to="/user/signup" className="text-purple-300 hover:text-white font-semibold transition">
                Create Account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserLogin;
