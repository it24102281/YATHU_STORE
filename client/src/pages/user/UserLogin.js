import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  Eye,
  EyeOff,
  Lock,
  LogIn,
  Mail,
  Phone,
  RefreshCw,
  ShieldCheck,
  User,
  UserPlus,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const whatsappRegex = /^[0-9+\-\s()]{8,20}$/;

const UserLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    userLogin,
    userSignup,
    verifyUserSignup,
    resendSignupCode,
    isUserAuthenticated,
  } = useAuth();

  const [isSignupActive, setIsSignupActive] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [submittingLogin, setSubmittingLogin] = useState(false);

  const [signupForm, setSignupForm] = useState({
    fullName: '',
    email: '',
    whatsappNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submittingSignup, setSubmittingSignup] = useState(false);
  const [verificationPending, setVerificationPending] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verifyingSignup, setVerifyingSignup] = useState(false);
  const [resendingCode, setResendingCode] = useState(false);

  useEffect(() => {
    if (isUserAuthenticated) {
      navigate(location.state?.from?.pathname || '/', { replace: true });
    }
  }, [isUserAuthenticated, location.state, navigate]);

  const setSignupField = (key, value) => {
    setSignupForm((prev) => ({ ...prev, [key]: value }));
  };

  const validateSignup = () => {
    if (!signupForm.fullName.trim()) return 'Please enter your full name';
    if (!/\S+@\S+\.\S+/.test(signupForm.email)) return 'Please enter a valid email address';
    if (!whatsappRegex.test(signupForm.whatsappNumber)) return 'Please enter your WhatsApp number';
    if (!strongPasswordRegex.test(signupForm.password)) {
      return 'Password must be at least 8 characters and include uppercase, lowercase, and a number';
    }
    if (signupForm.password !== signupForm.confirmPassword) {
      return 'Password and confirm password do not match';
    }
    return null;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    setSubmittingLogin(true);
    const result = await userLogin(identifier, password);
    setSubmittingLogin(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success('Login successful');
    console.log('[Frontend Login] Redirect status', {
      role: result.role,
      redirectTo: result.redirectTo || location.state?.from?.pathname || '/',
    });
    navigate(result.redirectTo || location.state?.from?.pathname || '/', { replace: true });
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const error = validateSignup();

    if (error) {
      toast.error(error);
      return;
    }

    try {
      setSubmittingSignup(true);
      const response = await userSignup(signupForm);
      setVerificationPending(true);
      toast.success(response.message || 'Verification code sent to your email');
    } catch (errorResponse) {
      toast.error(errorResponse.response?.data?.message || 'Failed to create account');
    } finally {
      setSubmittingSignup(false);
    }
  };

  const handleVerifySignup = async (e) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(verificationCode)) {
      toast.error('Please enter the 6-digit verification code');
      return;
    }

    try {
      setVerifyingSignup(true);
      await verifyUserSignup({ email: signupForm.email, code: verificationCode });
      toast.success('Account created successfully');
      setVerificationPending(false);
      setVerificationCode('');
      setIsSignupActive(false);
      navigate('/user/login');
    } catch (errorResponse) {
      toast.error(errorResponse.response?.data?.message || 'Failed to verify code');
    } finally {
      setVerifyingSignup(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setResendingCode(true);
      await resendSignupCode(signupForm.email);
      toast.success('Verification code resent successfully');
    } catch (errorResponse) {
      toast.error(errorResponse.response?.data?.message || 'Failed to resend verification code');
    } finally {
      setResendingCode(false);
    }
  };

  const authInputClass =
    'w-full rounded-xl border border-white/10 bg-white/[0.05] py-4 pl-12 pr-4 text-[15px] text-white outline-none transition placeholder:text-white/42 focus:border-purple-400/55 focus:bg-white/[0.08]';

  const renderSignupContent = () => {
    if (verificationPending) {
      return (
        <form
          onSubmit={handleVerifySignup}
          className="flex min-h-full flex-col justify-center px-8 py-10 pb-12 text-center sm:px-10"
        >
          <Link
            to="/"
            className="mb-8 inline-flex items-center justify-center gap-2 text-sm font-semibold text-white/65 transition hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Store
          </Link>

          <h1 className="mb-5 text-[44px] font-semibold tracking-[0.02em] text-white">
            Verify Account
          </h1>

          <div className="mb-6 rounded-2xl border border-purple-400/20 bg-white/[0.04] p-4 text-left">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-purple-300" />
              <div>
                <p className="font-semibold text-white">Verification code sent</p>
                <p className="mt-1 text-sm leading-6 text-white/68">
                  We sent a 6-digit code to{' '}
                  <span className="font-semibold text-purple-200">{signupForm.email}</span>.
                </p>
              </div>
            </div>
          </div>

          <input
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-4 text-center text-2xl tracking-[0.35em] text-white outline-none transition placeholder:text-white/32 focus:border-purple-400/55 focus:bg-white/[0.08]"
            placeholder="000000"
          />

          <button
            type="submit"
            disabled={verifyingSignup}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 via-violet-500 to-fuchsia-500 px-10 py-4 text-sm font-black tracking-[0.16em] text-white shadow-[0_14px_30px_rgba(132,58,248,0.35)] transition hover:translate-y-[-1px] disabled:opacity-60"
          >
            {verifyingSignup ? 'VERIFYING...' : 'VERIFY'}
          </button>

          <button
            type="button"
            onClick={handleResendCode}
            disabled={resendingCode}
            className="mt-4 inline-flex items-center justify-center gap-2 text-sm text-white/70 transition hover:text-white disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${resendingCode ? 'animate-spin' : ''}`} />
            {resendingCode ? 'Resending code...' : 'Resend Code'}
          </button>
        </form>
      );
    }

    return (
      <form
        onSubmit={handleSignupSubmit}
        className="flex min-h-full flex-col justify-center px-8 py-10 pb-12 text-center sm:px-10"
      >
        <Link
          to="/"
          className="mb-8 inline-flex items-center justify-center gap-2 text-sm font-semibold text-white/65 transition hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Store
        </Link>

        <h1 className="mb-8 text-[44px] font-semibold tracking-[0.02em] text-white">
          Create Account
        </h1>

        <div className="space-y-4 text-left">
          <div className="relative">
            <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/34" />
            <input
              value={signupForm.fullName}
              onChange={(e) => setSignupField('fullName', e.target.value)}
              className={authInputClass}
              placeholder="Full Name"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/34" />
            <input
              type="email"
              value={signupForm.email}
              onChange={(e) => setSignupField('email', e.target.value)}
              className={authInputClass}
              placeholder="Email Address"
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/34" />
            <input
              value={signupForm.whatsappNumber}
              onChange={(e) => setSignupField('whatsappNumber', e.target.value)}
              className={authInputClass}
              placeholder="WhatsApp Number"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/34" />
            <input
              type={showSignupPassword ? 'text' : 'password'}
              value={signupForm.password}
              onChange={(e) => setSignupField('password', e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.05] py-4 pl-12 pr-12 text-[15px] text-white outline-none transition placeholder:text-white/42 focus:border-purple-400/55 focus:bg-white/[0.08]"
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowSignupPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/38 transition hover:text-white"
            >
              {showSignupPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/34" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={signupForm.confirmPassword}
              onChange={(e) => setSignupField('confirmPassword', e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.05] py-4 pl-12 pr-12 text-[15px] text-white outline-none transition placeholder:text-white/42 focus:border-purple-400/55 focus:bg-white/[0.08]"
              placeholder="Confirm Password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/38 transition hover:text-white"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <p className="mt-5 text-sm leading-6 text-white/52">
          Password must be at least 8 characters and include uppercase, lowercase, and a number.
        </p>

        <button
          type="submit"
          disabled={submittingSignup}
          className="mt-7 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 via-violet-500 to-fuchsia-500 px-10 py-4 text-sm font-black tracking-[0.16em] text-white shadow-[0_14px_30px_rgba(132,58,248,0.35)] transition hover:translate-y-[-1px] disabled:opacity-60"
        >
          {submittingSignup ? (
            'CREATING...'
          ) : (
            <span className="inline-flex items-center gap-2">
              SIGN UP
              <UserPlus className="h-5 w-5" />
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setIsSignupActive(false)}
          className="mt-5 text-sm text-white/68 underline decoration-white/20 underline-offset-4 transition hover:text-white md:hidden"
        >
          Already have an account? Sign In
        </button>
      </form>
    );
  };

  return (
    <div
      className="min-h-screen overflow-x-hidden px-4 py-6 md:py-8"
      style={{
        background: 'linear-gradient(-45deg, #0B001A, #1A0B2E, #2D124D, #1A0B2E)',
        backgroundSize: '400% 400%',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mx-auto mt-16 w-full max-w-[900px] overflow-hidden rounded-[24px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(162,82,255,0.05)] backdrop-blur-2xl"
        style={{
          minHeight: '680px',
          background: 'rgba(45, 18, 77, 0.2)',
        }}
      >
        <div className="relative hidden min-h-[680px] md:block">
          <div
            className="absolute left-0 top-0 h-full w-1/2 overflow-y-auto transition-all duration-500 ease-in-out"
            style={{
              transform: isSignupActive ? 'translateX(100%)' : 'translateX(0)',
              opacity: isSignupActive ? 0 : 1,
              zIndex: isSignupActive ? 1 : 2,
            }}
          >
            <form
              onSubmit={handleLoginSubmit}
              className="flex min-h-full flex-col items-center justify-center px-12 py-10 pb-12 text-center"
            >
              <Link
                to="/"
                className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-white/65 transition hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Store
              </Link>

              <h1 className="mb-8 text-[44px] font-semibold tracking-[0.02em] text-white">
                Welcome Back
              </h1>

              <div className="w-full max-w-sm space-y-4 text-left">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/34" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className={authInputClass}
                    placeholder="Email Address"
                    required
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/34" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.05] py-4 pl-12 pr-12 text-[15px] text-white outline-none transition placeholder:text-white/42 focus:border-purple-400/55 focus:bg-white/[0.08]"
                    placeholder="Password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/38 transition hover:text-white"
                  >
                    {showLoginPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Link
                to="/user/forgot-password"
                className="mt-6 text-sm text-white/68 transition hover:text-white"
              >
                Forgot your password?
              </Link>

              <button
                type="submit"
                disabled={submittingLogin}
                className="mt-8 inline-flex min-w-[190px] items-center justify-center rounded-full bg-gradient-to-r from-purple-600 via-violet-500 to-fuchsia-500 px-10 py-4 text-sm font-black tracking-[0.16em] text-white shadow-[0_14px_30px_rgba(132,58,248,0.35)] transition hover:translate-y-[-1px] disabled:opacity-60"
              >
                {submittingLogin ? (
                  'SIGNING IN...'
                ) : (
                  <span className="inline-flex items-center gap-2">
                    SIGN IN
                    <LogIn className="h-5 w-5" />
                  </span>
                )}
              </button>
            </form>
          </div>

          <div
            className="absolute left-0 top-0 h-full w-1/2 overflow-y-auto transition-all duration-500 ease-in-out"
            style={{
              transform: isSignupActive ? 'translateX(100%)' : 'translateX(0)',
              opacity: isSignupActive ? 1 : 0,
              zIndex: isSignupActive ? 5 : 1,
            }}
          >
            {renderSignupContent()}
          </div>

          <div
            className="absolute left-1/2 top-0 h-full w-1/2 overflow-hidden transition-transform duration-500 ease-in-out"
            style={{
              zIndex: 30,
              transform: isSignupActive ? 'translateX(-100%)' : 'translateX(0)',
            }}
          >
            <div
              className="relative left-[-100%] h-full w-[200%] transition-transform duration-500 ease-in-out"
              style={{
                transform: isSignupActive ? 'translateX(50%)' : 'translateX(0)',
                background:
                  'linear-gradient(to right, rgba(11, 0, 26, 0.42), rgba(45, 18, 77, 0.42))',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                borderLeft: '1px solid rgba(255,255,255,0.08)',
                borderRight: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div
                className="absolute left-0 top-0 flex h-full w-1/2 flex-col items-center justify-center px-10 text-center transition-transform duration-500 ease-in-out"
                style={{
                  transform: isSignupActive ? 'translateX(0)' : 'translateX(-20%)',
                }}
              >
                <h2 className="text-[46px] font-semibold tracking-[0.02em] text-white">
                  Welcome Back!
                </h2>
                <p className="mt-6 max-w-xs text-[15px] leading-8 text-white/78">
                  To keep connected with us please login with your personal info
                </p>
                <button
                  type="button"
                  onClick={() => setIsSignupActive(false)}
                  className="mt-10 inline-flex min-w-[190px] items-center justify-center rounded-full border border-white/45 px-10 py-4 text-sm font-black tracking-[0.16em] text-white transition hover:bg-white/10"
                >
                  SIGN IN
                </button>
              </div>

              <div
                className="absolute right-0 top-0 flex h-full w-1/2 flex-col items-center justify-center px-10 text-center transition-transform duration-500 ease-in-out"
                style={{
                  transform: isSignupActive ? 'translateX(20%)' : 'translateX(0)',
                }}
              >
                <h2 className="text-[46px] font-semibold tracking-[0.02em] text-white">
                  New Here?
                </h2>
                <p className="mt-6 max-w-xs text-[15px] leading-8 text-white/78">
                  Enter your personal details and start your journey with us
                </p>
                <button
                  type="button"
                  onClick={() => setIsSignupActive(true)}
                  className="mt-10 inline-flex min-w-[190px] items-center justify-center rounded-full border border-white/45 px-10 py-4 text-sm font-black tracking-[0.16em] text-white transition hover:bg-white/10"
                >
                  SIGN UP
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="md:hidden">
          {isSignupActive ? (
            <div className="min-h-[640px]">{renderSignupContent()}</div>
          ) : (
            <form onSubmit={handleLoginSubmit} className="flex min-h-[640px] flex-col justify-center px-6 py-12 text-center sm:px-8">
              <Link
                to="/"
                className="mb-8 inline-flex items-center justify-center gap-2 text-sm font-semibold text-white/65 transition hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Store
              </Link>

              <h1 className="mb-7 text-[40px] font-semibold tracking-[0.02em] text-white">
                Welcome Back
              </h1>

              <div className="space-y-4 text-left">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/34" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className={authInputClass}
                    placeholder="Email Address"
                    required
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/34" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.05] py-4 pl-12 pr-12 text-[15px] text-white outline-none transition placeholder:text-white/42 focus:border-purple-400/55 focus:bg-white/[0.08]"
                    placeholder="Password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/38 transition hover:text-white"
                  >
                    {showLoginPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Link
                to="/user/forgot-password"
                className="mt-6 text-sm text-white/68 transition hover:text-white"
              >
                Forgot your password?
              </Link>

              <button
                type="submit"
                disabled={submittingLogin}
                className="mt-8 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 via-violet-500 to-fuchsia-500 px-10 py-4 text-sm font-black tracking-[0.16em] text-white shadow-[0_14px_30px_rgba(132,58,248,0.35)] transition disabled:opacity-60"
              >
                {submittingLogin ? 'SIGNING IN...' : 'SIGN IN'}
              </button>

              <button
                type="button"
                onClick={() => setIsSignupActive(true)}
                className="mt-5 text-sm text-white/68 underline decoration-white/20 underline-offset-4 transition hover:text-white"
              >
                New here? Create Account
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default UserLogin;
