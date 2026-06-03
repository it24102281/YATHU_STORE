import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useSpring, useMotionValue, animate } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Shield,
  Zap,
  Star,
  MessageCircle,
  ChevronRight,
  Users,
  CheckCircle,
  ArrowRight,
  Crown,
  Sparkles,
  Target,
  Lock,
  Headphones,
  BadgeCheck,
  Package,
} from 'lucide-react';
import AccountCard from '../components/AccountCard';
import FeaturedDeals from '../components/FeaturedDeals';
import { useAuth } from '../context/AuthContext';

/* ── Animated counter hook ─────────────────────────────────────── */
const useCounter = (target, duration = 1800) => {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  useEffect(() => {
    if (!inView) return;
    const isNumeric = !isNaN(Number(target.replace(/[^0-9]/g, '')));
    if (!isNumeric) { setValue(target); return; }
    const end = parseInt(target.replace(/[^0-9]/g, ''), 10);
    const suffix = target.replace(/[0-9]/g, '');
    let start = 0;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setValue(end + suffix); clearInterval(timer); }
      else setValue(start + suffix);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return { value, ref };
};

const StatCard = ({ number, label, icon: Icon, delay }) => {
  const { value, ref } = useCounter(number);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="relative group text-center"
      style={{
        background: 'linear-gradient(145deg, rgba(139,92,246,0.08), rgba(168,85,247,0.04))',
        border: '1px solid rgba(139,92,246,0.18)',
        borderRadius: 20,
        padding: '32px 20px',
        backdropFilter: 'blur(12px)',
        transition: 'all 0.3s ease',
      }}
      whileHover={{ y: -6, borderColor: 'rgba(139,92,246,0.4)' }}
    >
      <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.25), rgba(168,85,247,0.15))' }}>
        <Icon className="w-7 h-7 text-purple-400" />
      </div>
      <div className="text-3xl md:text-4xl font-black mb-1"
        style={{ fontFamily: 'Poppins, sans-serif', background: 'linear-gradient(135deg,#a855f7,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
        {value}
      </div>
      <div className="text-sm text-gray-400 font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>{label}</div>
    </motion.div>
  );
};

/* ── Section heading ───────────────────────────────────────────── */
const SectionHeading = ({ badge, title, subtitle }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="text-center mb-16"
  >
    {badge && (
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-semibold uppercase tracking-widest"
        style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', color: '#c084fc' }}>
        {badge}
      </div>
    )}
    <h2 className="text-4xl md:text-5xl font-black mb-4"
      style={{ fontFamily: 'Poppins, sans-serif', background: 'linear-gradient(135deg,#e2e8f0,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
      {title}
    </h2>
    {subtitle && <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">{subtitle}</p>}
  </motion.div>
);

/* ── Main Component ────────────────────────────────────────────── */
const Home = () => {
  const [featuredAccounts, setFeaturedAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { api } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/accounts/featured');
        setFeaturedAccounts(res.data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const features = [
    { icon: BadgeCheck, title: 'Verified Accounts', desc: 'Every account is manually verified before delivery to ensure quality and authenticity.' },
    { icon: Zap, title: 'Instant Delivery', desc: 'Fast and secure account transfer process completed right after payment confirmation.' },
    { icon: Lock, title: 'Secure Payments', desc: 'Protected transactions with trusted payment methods and full buyer guarantee.' },
    { icon: Headphones, title: 'Premium Support', desc: '24/7 customer assistance before and after purchase for a seamless experience.' },
  ];

  const stats = [
    { number: '1000+', label: 'Happy Customers', icon: Crown },
    { number: '500+', label: 'Accounts Sold', icon: Package },
    { number: '4+', label: 'Years Experience', icon: Sparkles },
    { number: '100%', label: 'Secure Deals', icon: Shield },
  ];

  const reviews = [
    { name: 'Alex Chen', rank: 'Ace Master', msg: 'Best PUBG accounts seller. Fast delivery and all skins were exactly as described. Highly recommend!', rating: 5, initials: 'AC', color: '#8b5cf6' },
    { name: 'Sarah Johnson', rank: 'Diamond Tier', msg: 'Very trustworthy seller. The account transfer was smooth and customer support was incredibly helpful.', rating: 5, initials: 'SJ', color: '#a855f7' },
    { name: 'Mike Wilson', rank: 'Platinum Tier', msg: 'High quality PUBG IDs with rare skins. Got my Glacier M416 and mythic set. 100% legit!', rating: 5, initials: 'MW', color: '#c084fc' },
  ];

  const trustPoints = [
    'Secure Transactions',
    'Verified Accounts',
    'Fast Delivery',
    'Customer Satisfaction',
  ];

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a', fontFamily: 'Poppins, sans-serif' }}>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: '100vh', paddingTop: 80 }}>
        {/* Background */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #0f0a1e 45%, #0a0a0a 100%)' }} />
        {/* Grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        {/* Glow orbs */}
        <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }} transition={{ duration: 8, repeat: Infinity }}
          className="absolute" style={{ top: '-10%', left: '-5%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />
        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute" style={{ bottom: '-10%', right: '-5%', width: 700, height: 700, background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full py-16">

            {/* Left */}
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="space-y-8">
              {/* Trust badge */}
              <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full"
                style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.28)' }}>
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold text-purple-300 tracking-wide">Trusted Gaming Marketplace</span>
              </motion.div>

              {/* Heading */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="space-y-4">
                <h1 className="font-black leading-tight" style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)' }}>
                  <span className="text-white">Premium Gaming</span>
                  <br />
                  <span style={{ background: 'linear-gradient(135deg,#8b5cf6,#a855f7,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    Accounts & UC
                  </span>
                  <br />
                  <span className="text-white">Packages</span>
                </h1>
                <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
                  Buy verified gaming accounts with rare skins, high ranks, and secure ownership transfer.
                  Trusted by thousands of satisfied customers.
                </p>
              </motion.div>

              {/* Feature pills */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                className="grid grid-cols-2 gap-3">
                {['Verified Accounts', 'Instant Delivery', 'Secure Transactions', '24/7 Support'].map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 text-purple-400" />
                    <span className="text-sm text-gray-300 font-medium">{f}</span>
                  </div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
                className="flex flex-col sm:flex-row gap-4">
                <Link to="/accounts"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-base transition-all duration-300 hover:-translate-y-1"
                  style={{ background: 'linear-gradient(135deg,#8b5cf6,#a855f7)', boxShadow: '0 8px 32px rgba(139,92,246,0.35)' }}>
                  <span>View Accounts</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a href="https://wa.me/94763442220" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm transition-all duration-300 hover:-translate-y-1 hover:bg-green-500/10"
                  style={{ border: '2px solid rgba(34,197,94,0.5)', color: '#4ade80' }}>
                  <MessageCircle className="w-5 h-5" />
                  <span>Contact on WhatsApp</span>
                </a>
              </motion.div>
            </motion.div>

            {/* Right - Hero card */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              className="relative hidden lg:flex justify-center items-center">
              {/* Glow ring */}
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-3xl opacity-20"
                style={{ background: 'conic-gradient(from 0deg, transparent 60%, #8b5cf6, #a855f7, transparent 100%)', filter: 'blur(20px)' }} />

              <div className="relative w-full max-w-md">
                {/* Main card */}
                <div className="relative rounded-3xl overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(17,17,17,0.8))', border: '1px solid rgba(139,92,246,0.25)', backdropFilter: 'blur(20px)' }}>
                  <img src="/logo.JPG" alt="Yathu Official" className="w-full object-cover transition-transform duration-500 hover:scale-105" style={{ height: 340 }} />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.6) 0%, transparent 50%)' }} />
                  {/* Shine */}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)' }} />
                </div>

                {/* Trust badge floating */}
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -bottom-5 -right-5 px-5 py-3 rounded-2xl flex items-center gap-2"
                  style={{ background: 'linear-gradient(135deg,#8b5cf6,#a855f7)', boxShadow: '0 12px 30px rgba(139,92,246,0.4)' }}>
                  <Crown className="w-4 h-4 text-yellow-300" />
                  <span className="text-white font-bold text-sm">1000+ Happy Customers</span>
                </motion.div>

                {/* Stats mini card */}
                <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute -top-4 -left-4 px-4 py-3 rounded-2xl"
                  style={{ background: 'rgba(17,17,17,0.9)', border: '1px solid rgba(139,92,246,0.3)', backdropFilter: 'blur(12px)' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-white text-xs font-semibold">Verified & Secure</span>
                  </div>
                  <div className="flex mt-1 gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24" style={{ background: 'linear-gradient(to bottom, transparent, #0a0a0a)' }} />
      </section>

      {/* ── STATS ───────────────────────────────────────────────── */}
      <section className="relative py-20" style={{ background: 'linear-gradient(135deg, #0f0a1e 0%, #0a0a0a 100%)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <StatCard key={s.label} number={s.number} label={s.label} icon={s.icon} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ───────────────────────────────────────── */}
      <section className="py-24" style={{ background: '#0a0a0a' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Why Choose Us"
            title="Built for Serious Gamers"
            subtitle="We provide the best gaming accounts with premium features and exceptional service you can trust."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -8 }}
                className="group relative p-7 rounded-2xl text-center"
                style={{ background: 'linear-gradient(145deg, rgba(139,92,246,0.06), rgba(17,17,17,0.6))', border: '1px solid rgba(139,92,246,0.12)', backdropFilter: 'blur(12px)', transition: 'all 0.4s ease' }}
              >
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{ background: 'radial-gradient(circle at 50% 0%, rgba(139,92,246,0.1) 0%, transparent 70%)' }} />
                <div className="absolute top-0 left-0 right-0 h-px rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.6), transparent)' }} />
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(168,85,247,0.1))' }}>
                  <f.icon className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-white font-bold text-lg mb-3">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPECIAL OFFERS ──────────────────────────────────────── */}
      {false && (<>
      <section className="py-24" style={{ background: 'linear-gradient(180deg, #0f0a1e 0%, #0a0a0a 100%)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading badge="Special Offers" title="Exclusive Deals For You" subtitle="Unbeatable prices on UC packages, premium accounts, and limited-time discount offers." />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                badge: 'Best Seller',
                badgeColor: '#f59e0b',
                title: 'UC Packages',
                desc: 'Exclusive UC packages at unbeatable prices. Perfect for gearing up your PUBG account with top-tier cosmetics.',
                items: ['600 UC — Starter Pack', '1800 UC — Classic Crate', '8100 UC — Elite Bundle'],
                cta: 'Get UC Now',
                href: 'https://wa.me/94763442220?text=I%20want%20to%20buy%20UC%20packages',
                isExternal: true,
              },
              {
                badge: 'Popular',
                badgeColor: '#8b5cf6',
                title: 'Premium Accounts',
                desc: 'High-rank accounts with rare skins, mythic outfits, and exclusive weapon finishes at competitive prices.',
                items: ['High Rank (Ace/Conqueror)', 'Glacier M416 Included', 'Instant Transfer'],
                cta: 'Browse Accounts',
                href: '/accounts',
                isExternal: false,
              },
              {
                badge: 'Limited Offer',
                badgeColor: '#ef4444',
                title: 'Discount Offers',
                desc: 'Get 15% discount on all our premium PUBG accounts for a limited time. Grab yours before the offer ends!',
                items: ['15% OFF All Accounts', 'Fast Secure Delivery', 'Rare Skins Included'],
                cta: 'Claim Discount',
                href: '/accounts',
                isExternal: false,
              },
            ].map((offer, i) => (
              <motion.div
                key={offer.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                whileHover={{ y: -8 }}
                className="group relative flex flex-col rounded-2xl overflow-hidden"
                style={{ background: 'linear-gradient(145deg, rgba(139,92,246,0.1), rgba(17,17,17,0.8))', border: '1px solid rgba(139,92,246,0.18)', backdropFilter: 'blur(12px)', transition: 'all 0.4s ease' }}
              >
                {/* Top gradient bar */}
                <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${offer.badgeColor}, transparent)` }} />

                <div className="p-7 flex flex-col flex-1">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4 self-start"
                    style={{ background: `${offer.badgeColor}22`, border: `1px solid ${offer.badgeColor}55`, color: offer.badgeColor }}>
                    <Sparkles className="w-3 h-3" />
                    {offer.badge}
                  </div>

                  <h3 className="text-white font-black text-xl mb-3">{offer.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-5">{offer.desc}</p>

                  <ul className="space-y-2 mb-7 flex-1">
                    {offer.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle className="w-4 h-4 flex-shrink-0 text-purple-400" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  {offer.isExternal ? (
                    <a href={offer.href} target="_blank" rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl font-bold text-sm text-white transition-all duration-300 hover:-translate-y-0.5"
                      style={{ background: 'linear-gradient(135deg,#8b5cf6,#a855f7)', boxShadow: '0 4px 20px rgba(139,92,246,0.3)' }}>
                      {offer.cta} <ArrowRight className="w-4 h-4" />
                    </a>
                  ) : (
                    <Link to={offer.href}
                      className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl font-bold text-sm text-white transition-all duration-300 hover:-translate-y-0.5"
                      style={{ background: 'linear-gradient(135deg,#8b5cf6,#a855f7)', boxShadow: '0 4px 20px rgba(139,92,246,0.3)' }}>
                      {offer.cta} <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED ACCOUNTS ───────────────────────────────────── */}
      </>)}

      <FeaturedDeals
        heading="Featured Deals"
        subtitle="Live inventory from the admin panel across PUBG services, premium subscriptions, and social media boosters."
      />

      <section className="py-24" style={{ background: '#0a0a0a' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Featured Accounts"
            title="Top PUBG Accounts"
            subtitle="Hand-picked accounts with rare skins, Glacier M416, mythic sets, and lab weapons."
          />
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
            </div>
          ) : featuredAccounts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {featuredAccounts.map((account, index) => (
                <AccountCard key={account._id} account={account} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                <Target className="w-12 h-12 text-purple-500/50" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">No Featured Accounts</h3>
              <p className="text-gray-500 mb-6">Check back soon for premium accounts.</p>
              <Link to="/accounts" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white text-sm"
                style={{ background: 'linear-gradient(135deg,#8b5cf6,#a855f7)' }}>
                View All Accounts <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}
          {featuredAccounts.length > 0 && (
            <div className="text-center mt-12">
              <Link to="/accounts"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm transition-all duration-300 hover:-translate-y-1"
                style={{ border: '1px solid rgba(139,92,246,0.35)', color: '#c084fc', background: 'rgba(139,92,246,0.06)' }}>
                View All Accounts <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── CUSTOMER REVIEWS ────────────────────────────────────── */}
      <section className="py-24" style={{ background: 'linear-gradient(180deg, #0f0a1e 0%, #0a0a0a 100%)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading badge="Customer Reviews" title="What Our Customers Say" subtitle="Real experiences from our satisfied gaming community members." />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                whileHover={{ y: -6 }}
                className="relative p-7 rounded-2xl"
                style={{ background: 'linear-gradient(145deg, rgba(139,92,246,0.08), rgba(17,17,17,0.7))', border: '1px solid rgba(139,92,246,0.14)', backdropFilter: 'blur(12px)', transition: 'all 0.3s ease' }}
              >
                <div className="absolute top-0 left-0 right-0 h-px rounded-t-2xl" style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.4), transparent)' }} />
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {[...Array(r.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">"{r.msg}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${r.color}, ${r.color}99)` }}>
                    {r.initials}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{r.name}</div>
                    <div className="text-gray-500 text-xs">{r.rank}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/reviews"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:text-white"
              style={{ color: '#c084fc' }}>
              View All Reviews <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── TRUST SECTION ───────────────────────────────────────── */}
      <section className="py-16" style={{ background: '#0a0a0a' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl p-10 text-center"
            style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(168,85,247,0.05))', border: '1px solid rgba(139,92,246,0.2)', backdropFilter: 'blur(16px)' }}
          >
            <h3 className="text-white font-black text-2xl md:text-3xl mb-8">Why Thousands Trust Us</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {trustPoints.map((p, i) => (
                <motion.div key={p} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl"
                  style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)' }}>
                  <CheckCircle className="w-6 h-6 text-purple-400" />
                  <span className="text-gray-300 text-sm font-medium text-center">{p}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA SECTION ─────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f0a1e 0%, #0a0a0a 100%)' }}>
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }}
          className="absolute" style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 400, background: 'radial-gradient(ellipse, rgba(139,92,246,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-semibold uppercase tracking-widest"
              style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', color: '#c084fc' }}>
              <Sparkles className="w-3.5 h-3.5" /> Get Started Today
            </div>
            <h2 className="font-black text-4xl md:text-5xl text-white mb-5 leading-tight">
              Ready to Find Your<br />
              <span style={{ background: 'linear-gradient(135deg,#8b5cf6,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Perfect Account?</span>
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Browse our collection of verified gaming accounts and exclusive UC packages. Join thousands of satisfied customers today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/accounts"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-base transition-all duration-300 hover:-translate-y-1"
                style={{ background: 'linear-gradient(135deg,#8b5cf6,#a855f7)', boxShadow: '0 8px 32px rgba(139,92,246,0.35)' }}>
                View Accounts <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm transition-all duration-300 hover:-translate-y-1"
                style={{ border: '1px solid rgba(139,92,246,0.35)', color: '#c084fc', background: 'rgba(139,92,246,0.06)' }}>
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
