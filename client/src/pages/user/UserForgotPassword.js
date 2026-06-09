import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Mail, Send } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const UserForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const response = await forgotPassword(email);
      toast.success(response.message || 'Reset link sent to your email');
    } catch (error) {
      toast.error(error.message || 'Failed to send reset link');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] pt-28 pb-16 px-4">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto rounded-[32px] border border-white/10 bg-[#09090d]/85 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
        <div className="p-6 sm:p-8 lg:p-10">
          <Link to="/user/login" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition text-sm font-semibold">
            <ChevronLeft className="w-4 h-4" />
            Back to Login
          </Link>

          <p className="mt-6 text-xs uppercase tracking-[0.28em] text-purple-300/80 font-semibold">Password Help</p>
          <h1 className="mt-3 text-4xl font-black text-white">Forgot Password</h1>
          <p className="mt-3 text-sm leading-7 text-gray-400">
            Enter your email address and we&apos;ll send a secure reset link.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="ml-1 text-sm font-semibold text-gray-300">Email Address</label>
              <div className="relative mt-2">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-white outline-none focus:border-purple-400/50" placeholder="you@example.com" required />
              </div>
            </div>

            <button type="submit" disabled={submitting} className="w-full rounded-2xl bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 px-6 py-4 font-bold text-white shadow-[0_18px_40px_rgba(124,58,237,0.28)] transition hover:from-purple-500 hover:via-violet-500 hover:to-fuchsia-500 disabled:opacity-60">
              <span className="inline-flex items-center gap-2">
                {submitting ? 'Sending Reset Link...' : 'Send Reset Link'}
                {!submitting && <Send className="w-5 h-5" />}
              </span>
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default UserForgotPassword;
