import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, Eye, EyeOff, ChevronLeft, UserPlus, ShieldCheck, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const strongPasswordRegex = /^.{8,}$/;
const whatsappRegex = /^[0-9+\-\s()]{8,20}$/;

const UserSignup = () => {
  const navigate = useNavigate();
  const { userSignup, verifyUserSignup, resendSignupCode } = useAuth();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    whatsappNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [verificationPending, setVerificationPending] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    if (!form.fullName.trim()) return 'Please enter your full name';
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Please enter a valid email address';
    if (!whatsappRegex.test(form.whatsappNumber)) return 'Please enter your WhatsApp number';
    if (!strongPasswordRegex.test(form.password)) return 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) return 'Password and confirm password do not match';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validate();

    if (error) {
      toast.error(error);
      return;
    }

    try {
      setSubmitting(true);
      const response = await userSignup(form);
      if (response?.data?.emailDelivery === false) {
        toast.success(response.message || 'Account created successfully. You can sign in now.');
        navigate('/user/login');
        return;
      }

      setVerificationPending(true);
      toast.success(response.message || 'Verification code sent to your email');
    } catch (errorResponse) {
      toast.error(errorResponse.response?.data?.message || 'Failed to create account');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(verificationCode)) {
      toast.error('Please enter the 6-digit verification code');
      return;
    }

    try {
      setVerifying(true);
      await verifyUserSignup({ email: form.email, code: verificationCode });
      toast.success('Account created successfully');
      navigate('/user/login');
    } catch (errorResponse) {
      toast.error(errorResponse.response?.data?.message || 'Failed to verify code');
    } finally {
      setVerifying(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setResending(true);
      await resendSignupCode(form.email);
      toast.success('Verification code resent successfully');
    } catch (errorResponse) {
      toast.error(errorResponse.response?.data?.message || 'Failed to resend verification code');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] pt-28 pb-16 px-4">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto rounded-[32px] border border-white/10 bg-[#09090d]/85 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
        <div className="p-6 sm:p-8 lg:p-10">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition text-sm font-semibold">
            <ChevronLeft className="w-4 h-4" />
            Back to Store
          </Link>

          <div className="mt-6">
            <p className="text-xs uppercase tracking-[0.28em] text-purple-300/80 font-semibold">Customer Signup</p>
            <h1 className="mt-3 text-4xl font-black text-white">Create Account</h1>
            <p className="mt-3 text-sm leading-7 text-gray-400">
              Register with your details to manage orders, account settings, and future purchases.
            </p>
          </div>

          {!verificationPending ? (
          <form onSubmit={handleSubmit} className="mt-8 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="ml-1 text-sm font-semibold text-gray-300">Full Name</label>
              <div className="relative mt-2">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input value={form.fullName} onChange={(e) => setField('fullName', e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-white outline-none focus:border-purple-400/50" placeholder="Your full name" />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="ml-1 text-sm font-semibold text-gray-300">Email Address</label>
              <div className="relative mt-2">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-white outline-none focus:border-purple-400/50" placeholder="you@example.com" />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="ml-1 text-sm font-semibold text-gray-300">WhatsApp Number</label>
              <div className="relative mt-2">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input value={form.whatsappNumber} onChange={(e) => setField('whatsappNumber', e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-white outline-none focus:border-purple-400/50" placeholder="+94 76 344 2220" />
              </div>
            </div>

            <div>
              <label className="ml-1 text-sm font-semibold text-gray-300">Password</label>
              <div className="relative mt-2">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setField('password', e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-14 text-white outline-none focus:border-purple-400/50" placeholder="Strong password" />
                <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="ml-1 text-sm font-semibold text-gray-300">Confirm Password</label>
              <div className="relative mt-2">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input type={showConfirmPassword ? 'text' : 'password'} value={form.confirmPassword} onChange={(e) => setField('confirmPassword', e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-14 text-white outline-none focus:border-purple-400/50" placeholder="Confirm password" />
                <button type="button" onClick={() => setShowConfirmPassword((prev) => !prev)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="sm:col-span-2 rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-sm leading-7 text-gray-400">
              Password must be at least 8 characters.
            </div>

            <div className="sm:col-span-2">
              <button type="submit" disabled={submitting} className="w-full rounded-2xl bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 px-6 py-4 font-bold text-white shadow-[0_18px_40px_rgba(124,58,237,0.28)] transition hover:from-purple-500 hover:via-violet-500 hover:to-fuchsia-500 disabled:opacity-60">
                <span className="inline-flex items-center gap-2">
                  {submitting ? 'Creating Account...' : 'Create Account'}
                  {!submitting && <UserPlus className="w-5 h-5" />}
                </span>
              </button>
            </div>
          </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="mt-8 space-y-5">
              <div className="rounded-2xl border border-purple-500/20 bg-purple-500/10 p-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-purple-300 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-semibold">Verification code sent</p>
                    <p className="text-sm text-gray-300 mt-1 leading-7">
                      We sent a 6-digit code to <span className="text-purple-300 font-semibold">{form.email}</span>. Enter it below to finish creating your account.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="ml-1 text-sm font-semibold text-gray-300">Email Verification Code</label>
                <input
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full mt-2 rounded-2xl border border-white/10 bg-white/5 py-4 px-4 text-white text-center tracking-[0.4em] text-2xl outline-none focus:border-purple-400/50"
                  placeholder="000000"
                />
              </div>

              <button type="submit" disabled={verifying} className="w-full rounded-2xl bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 px-6 py-4 font-bold text-white shadow-[0_18px_40px_rgba(124,58,237,0.28)] transition hover:from-purple-500 hover:via-violet-500 hover:to-fuchsia-500 disabled:opacity-60">
                {verifying ? 'Verifying Code...' : 'Verify & Create Account'}
              </button>

              <button type="button" onClick={handleResendCode} disabled={resending} className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-4 font-semibold text-gray-300 hover:text-white hover:border-purple-400/40 transition disabled:opacity-60 inline-flex items-center justify-center gap-2">
                <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
                {resending ? 'Resending Code...' : 'Resend Code'}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/user/login" className="text-purple-300 hover:text-white font-semibold transition">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default UserSignup;
