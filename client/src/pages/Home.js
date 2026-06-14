import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Shield,
  Zap,
  Star,
  MessageCircle,
  ChevronRight,
  CheckCircle,
  ArrowRight,
  Crown,
  Sparkles,
  Target,
  Lock,
  Headphones,
  BadgeCheck,
  Package,
  Instagram,
  Music2,
  Clapperboard,
  Coins,
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
const GamingControllerVisual = () => (
  <motion.div
    initial={{ opacity: 0, y: 28, scale: 0.96 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.8, delay: 0.15 }}
    className="relative isolate mx-auto flex min-h-[360px] w-full max-w-[590px] items-center justify-center sm:min-h-[430px] lg:min-h-[500px]"
    style={{ perspective: 1300 }}
  >
    <motion.div
      animate={{ scale: [1, 1.08, 1], opacity: [0.42, 0.7, 0.42] }}
      transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute z-0 h-[360px] w-[360px] rounded-full bg-purple-600/30 blur-3xl sm:h-[430px] sm:w-[430px]"
    />
    <div
      className="absolute z-0 h-[300px] w-[420px] rounded-full opacity-70 blur-2xl"
      style={{
        background: 'radial-gradient(circle, rgba(168,85,247,0.42) 0%, rgba(88,28,135,0.18) 42%, transparent 72%)',
      }}
    />

    {[
      { top: '16%', left: '16%', size: 6, delay: 0 },
      { top: '24%', left: '76%', size: 5, delay: 0.6 },
      { top: '47%', left: '9%', size: 4, delay: 1.2 },
      { top: '66%', left: '82%', size: 7, delay: 0.3 },
      { top: '80%', left: '29%', size: 4, delay: 1.5 },
      { top: '14%', left: '52%', size: 3, delay: 0.9 },
    ].map((particle) => (
      <motion.span
        key={`${particle.top}-${particle.left}`}
        animate={{ y: [0, -18, 0], opacity: [0.28, 0.9, 0.28], scale: [1, 1.45, 1] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: particle.delay }}
        className="absolute z-20 rounded-full bg-purple-200"
        style={{
          top: particle.top,
          left: particle.left,
          width: particle.size,
          height: particle.size,
          boxShadow: '0 0 18px rgba(216,180,254,0.95)',
        }}
      />
    ))}

    <motion.div
      animate={{ y: [0, -18, 0], rotateX: [13, 17, 13], rotateY: [-18, 12, -18], rotateZ: [-2, 2, -2] }}
      transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
      className="relative z-10 h-[285px] w-[360px] sm:h-[340px] sm:w-[500px]"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div
        className="absolute left-1/2 top-1/2 h-[178px] w-[328px] -translate-x-1/2 -translate-y-1/2 border border-purple-200/22 bg-[#08070b] sm:h-[220px] sm:w-[460px]"
        style={{
          borderRadius: '46% 46% 42% 42% / 38% 38% 58% 58%',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 42px 110px rgba(126,34,206,0.46), 0 0 34px rgba(168,85,247,0.34), inset 0 2px 0 rgba(255,255,255,0.18), inset 0 -38px 80px rgba(0,0,0,0.72), inset 0 28px 65px rgba(126,34,206,0.18)',
          transform: 'translate(-50%, -50%) translateZ(42px)',
        }}
      />
      <div
        className="absolute left-[12px] top-[122px] h-[142px] w-[156px] border border-purple-200/18 bg-[#07070b] sm:left-[8px] sm:top-[136px] sm:h-[178px] sm:w-[210px]"
        style={{
          borderRadius: '58% 36% 54% 62% / 36% 42% 64% 58%',
          backdropFilter: 'blur(20px)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.13), inset -22px -32px 52px rgba(0,0,0,0.74), 0 28px 80px rgba(88,28,135,0.32)',
          transform: 'translateZ(30px) rotate(-13deg)',
        }}
      />
      <div
        className="absolute right-[12px] top-[122px] h-[142px] w-[156px] border border-purple-200/18 bg-[#07070b] sm:right-[8px] sm:top-[136px] sm:h-[178px] sm:w-[210px]"
        style={{
          borderRadius: '36% 58% 62% 54% / 42% 36% 58% 64%',
          backdropFilter: 'blur(20px)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.13), inset 22px -32px 52px rgba(0,0,0,0.74), 0 28px 80px rgba(88,28,135,0.32)',
          transform: 'translateZ(30px) rotate(13deg)',
        }}
      />
      <div
        className="absolute left-1/2 top-[95px] h-[44px] w-[142px] -translate-x-1/2 rounded-full bg-white/10 sm:top-[112px] sm:h-[58px] sm:w-[190px]"
        style={{
          filter: 'blur(18px)',
          transform: 'translateX(-50%) translateZ(72px)',
        }}
      />

      <div
        className="absolute left-[70px] top-[128px] grid h-[86px] w-[86px] place-items-center rounded-full border border-purple-100/18 bg-[#050508] sm:left-[100px] sm:top-[154px] sm:h-[104px] sm:w-[104px]"
        style={{
          transform: 'translateZ(84px)',
          boxShadow: '0 18px 45px rgba(0,0,0,0.65), 0 0 40px rgba(192,132,252,0.55), inset 0 16px 28px rgba(255,255,255,0.08), inset -10px -18px 28px rgba(0,0,0,0.86)',
        }}
      >
        <motion.div
          animate={{ y: [0, -4, 0], x: [0, 3, 0] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
          className="h-12 w-12 rounded-full bg-gradient-to-br from-[#25202f] via-[#111016] to-black sm:h-14 sm:w-14"
          style={{ boxShadow: '0 0 26px rgba(168,85,247,0.5), inset 10px 10px 14px rgba(255,255,255,0.12), inset -12px -14px 18px rgba(0,0,0,0.72)' }}
        />
      </div>

      <div
        className="absolute left-[142px] top-[205px] h-[54px] w-[54px] rounded-full border border-purple-100/16 bg-[#050508] sm:left-[186px] sm:top-[248px] sm:h-[66px] sm:w-[66px]"
        style={{
          transform: 'translateZ(78px)',
          boxShadow: '0 14px 34px rgba(0,0,0,0.58), 0 0 24px rgba(168,85,247,0.32), inset 8px 8px 16px rgba(255,255,255,0.08), inset -10px -12px 18px rgba(0,0,0,0.74)',
        }}
      />

      <div
        className="absolute left-[122px] top-[128px] grid h-[66px] w-[66px] place-items-center sm:left-[166px] sm:top-[150px] sm:h-[78px] sm:w-[78px]"
        style={{ transform: 'translateZ(88px)' }}
      >
        <div className="absolute h-5 w-[58px] rounded-md bg-[#111018] shadow-[0_0_18px_rgba(168,85,247,0.22)] sm:h-6 sm:w-[68px]" />
        <div className="absolute h-[58px] w-5 rounded-md bg-[#111018] shadow-[0_0_18px_rgba(168,85,247,0.22)] sm:h-[68px] sm:w-6" />
      </div>

      <div
        className="absolute right-[66px] top-[128px] grid grid-cols-2 gap-3 sm:right-[92px] sm:top-[154px] sm:gap-4"
        style={{ transform: 'translateZ(86px)' }}
      >
        {[
          { label: 'Y', color: '#facc15' },
          { label: 'B', color: '#ef4444' },
          { label: 'X', color: '#38bdf8' },
          { label: 'A', color: '#22c55e' },
        ].map((button) => (
          <div
            key={button.label}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/12 bg-[#050508] text-xs font-black text-white sm:h-11 sm:w-11"
            style={{
              color: button.color,
              boxShadow: `0 12px 26px rgba(0,0,0,0.55), 0 0 18px ${button.color}55, inset 0 1px 0 rgba(255,255,255,0.16), inset -7px -8px 14px rgba(0,0,0,0.72)`,
            }}
          >
            {button.label}
          </div>
        ))}
      </div>

      <div
        className="absolute left-1/2 top-[120px] h-8 w-8 -translate-x-1/2 rounded-full border border-purple-100/18 bg-[#050508] sm:top-[146px] sm:h-10 sm:w-10"
        style={{ transform: 'translateX(-50%) translateZ(92px)', boxShadow: '0 12px 28px rgba(0,0,0,0.48), inset 0 1px 0 rgba(255,255,255,0.14)' }}
      />
      <div
        className="absolute left-[184px] top-[122px] h-7 w-12 rounded-full border border-purple-100/12 bg-[#050508] sm:left-[248px] sm:top-[148px] sm:h-8 sm:w-16"
        style={{ transform: 'translateZ(90px)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.14), 0 10px 24px rgba(0,0,0,0.36)' }}
      />
      <div
        className="absolute right-[184px] top-[122px] h-7 w-12 rounded-full border border-purple-100/12 bg-[#050508] sm:right-[248px] sm:top-[148px] sm:h-8 sm:w-16"
        style={{ transform: 'translateZ(90px)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.14), 0 10px 24px rgba(0,0,0,0.36)' }}
      />

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        className="absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-300/10 sm:h-[430px] sm:w-[430px]"
        style={{
          background: 'conic-gradient(from 90deg, transparent, rgba(168,85,247,0.34), transparent 34%, rgba(216,180,254,0.24), transparent 72%)',
          filter: 'blur(1.5px)',
          transform: 'translate(-50%, -50%) translateZ(-48px)',
        }}
      />
    </motion.div>

    <div className="absolute bottom-10 z-0 h-16 w-80 rounded-full bg-purple-500/20 blur-2xl" />
  </motion.div>
);

const HolographicControllerVisual = () => (
  <div
    className="relative isolate mx-auto flex min-h-[380px] w-full max-w-[680px] items-center justify-center sm:min-h-[460px] lg:min-h-[560px]"
    style={{ perspective: 1400 }}
  >
    <div
      className="absolute z-0 h-[340px] w-[460px] rounded-full blur-3xl sm:h-[460px] sm:w-[640px]"
      style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.34) 0%, rgba(126,34,206,0.2) 34%, rgba(96,165,250,0.07) 58%, transparent 76%)' }}
    />
    <div
      className="absolute z-0 h-[520px] w-[520px] rounded-full opacity-40 blur-[120px] sm:h-[680px] sm:w-[680px]"
      style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.18) 0%, rgba(88,28,135,0.08) 44%, transparent 70%)' }}
    />

    {[0, 1, 2].map((ring) => (
      <motion.div
        key={ring}
        animate={{ rotate: ring % 2 === 0 ? 360 : -360 }}
        transition={{ duration: 48 + ring * 12, repeat: Infinity, ease: 'linear' }}
        className="absolute rounded-full border"
        style={{
          width: 340 + ring * 74,
          height: 138 + ring * 34,
          borderColor: ring === 1 ? 'rgba(96,165,250,0.07)' : 'rgba(192,132,252,0.1)',
          transform: `rotate(${ring * 13 - 12}deg)`,
          boxShadow: '0 0 24px rgba(168,85,247,0.08)',
        }}
      />
    ))}

    {[
      { top: '13%', left: '16%', size: 4, delay: 0 },
      { top: '21%', left: '80%', size: 5, delay: 0.8 },
      { top: '34%', left: '7%', size: 3, delay: 1.1 },
      { top: '54%', left: '86%', size: 4, delay: 0.5 },
      { top: '74%', left: '20%', size: 5, delay: 1.7 },
      { top: '16%', left: '56%', size: 3, delay: 1.2 },
      { top: '77%', left: '62%', size: 3, delay: 0.9 },
      { top: '64%', left: '12%', size: 4, delay: 1.4 },
    ].map((particle) => (
      <motion.span
        key={`${particle.top}-${particle.left}`}
        animate={{ y: [0, -12, 0], opacity: [0.18, 0.48, 0.18], scale: [1, 1.25, 1] }}
        transition={{ duration: 7.8, repeat: Infinity, ease: 'easeInOut', delay: particle.delay }}
        className="absolute z-20 rounded-full"
        style={{
          top: particle.top,
          left: particle.left,
          width: particle.size,
          height: particle.size,
          background: particle.delay > 1 ? '#93c5fd' : '#d8b4fe',
          boxShadow: '0 0 14px rgba(216,180,254,0.42)',
        }}
      />
    ))}

    {[0, 1, 2].map((streak) => (
      <motion.div
        key={`streak-${streak}`}
        animate={{ x: [0, 12, 0], opacity: [0.1, 0.24, 0.1] }}
        transition={{ duration: 9 + streak * 1.3, repeat: Infinity, ease: 'easeInOut', delay: streak * 0.8 }}
        className="absolute z-10 rounded-full"
        style={{
          top: `${24 + streak * 16}%`,
          left: `${18 + streak * 8}%`,
          width: `${240 + streak * 60}px`,
          height: '2px',
          background: streak === 1
            ? 'linear-gradient(90deg, transparent, rgba(96,165,250,0.36), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(216,180,254,0.42), transparent)',
          filter: 'blur(0.5px)',
          transform: `rotate(${streak === 1 ? -10 : streak === 2 ? 12 : -4}deg)`,
        }}
      />
    ))}

    {[
      { label: 'UC', Icon: Coins, top: '19%', left: '19%', delay: 0 },
      { label: 'Helmet', Icon: Shield, top: '26%', left: '77%', delay: 1.2 },
      { label: 'TikTok', Icon: Music2, top: '68%', left: '15%', delay: 2.1 },
      { label: 'Instagram', Icon: Instagram, top: '72%', left: '77%', delay: 0.8 },
      { label: 'CapCut', Icon: Clapperboard, top: '11%', left: '58%', delay: 1.7 },
    ].map(({ label, Icon, top, left, delay }) => (
      <motion.div
        key={label}
        aria-label={label}
        animate={{ y: [0, -10, 0], x: [0, 5, 0], opacity: [0.18, 0.32, 0.18] }}
        transition={{ duration: 10.5, repeat: Infinity, ease: 'easeInOut', delay }}
        className="absolute z-10 hidden h-10 w-10 items-center justify-center rounded-2xl border border-purple-200/10 bg-white/[0.035] text-purple-100 shadow-[0_0_22px_rgba(168,85,247,0.10)] backdrop-blur-md sm:flex"
        style={{ top, left }}
      >
        <Icon className="h-4 w-4" strokeWidth={1.8} />
      </motion.div>
    ))}

    <motion.div
      animate={{ y: [0, -9, 0], rotate: [-0.6, 0.8, -0.6] }}
      transition={{ duration: 9.5, repeat: Infinity, ease: 'easeInOut' }}
      className="relative z-10 w-[360px] max-w-full sm:w-[540px] lg:w-[640px]"
      style={{
        transformStyle: 'preserve-3d',
        filter: 'drop-shadow(0 28px 60px rgba(0,0,0,0.58)) drop-shadow(0 0 22px rgba(168,85,247,0.42))',
      }}
    >
      <svg viewBox="0 0 820 430" className="h-auto w-full overflow-visible" role="img" aria-label="Holographic gaming controller">
        <defs>
          <linearGradient id="controllerEdge" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.95" />
            <stop offset="48%" stopColor="#d8b4fe" stopOpacity="0.98" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.95" />
          </linearGradient>
          <radialGradient id="controllerGlass" cx="50%" cy="42%" r="68%">
            <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.16" />
            <stop offset="42%" stopColor="#7c3aed" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#020106" stopOpacity="0.3" />
          </radialGradient>
          <filter id="neonGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="0.45 0 0 0 0.35 0 0.25 0 0 0.1 0 0 0.8 0 1 0 0 0 1 0" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          d="M144 178 C150 120 196 88 272 96 C322 101 344 126 410 126 C476 126 498 101 548 96 C624 88 670 120 676 178 C684 247 716 307 677 354 C636 404 572 354 536 312 C508 280 472 270 410 270 C348 270 312 280 284 312 C248 354 184 404 143 354 C104 307 136 247 144 178 Z"
          fill="url(#controllerGlass)"
          stroke="url(#controllerEdge)"
          strokeWidth="3"
          filter="url(#neonGlow)"
        />
        <path
          d="M184 183 C228 154 271 147 318 166 M502 166 C549 147 592 154 636 183 M298 252 C352 232 468 232 522 252"
          fill="none"
          stroke="#93c5fd"
          strokeWidth="1.5"
          strokeOpacity="0.38"
        />

        <g filter="url(#neonGlow)">
          <circle cx="264" cy="210" r="47" fill="#03020a" fillOpacity="0.62" stroke="#c4b5fd" strokeWidth="2.5" />
          <circle cx="264" cy="210" r="24" fill="#d8b4fe" fillOpacity="0.34" stroke="#93c5fd" strokeWidth="1.5" />
          <circle cx="410" cy="260" r="43" fill="#03020a" fillOpacity="0.58" stroke="#93c5fd" strokeWidth="2.2" />
          <circle cx="410" cy="260" r="22" fill="#8b5cf6" fillOpacity="0.28" stroke="#d8b4fe" strokeWidth="1.4" />
        </g>

        <g stroke="#d8b4fe" strokeWidth="3" strokeLinecap="round" filter="url(#neonGlow)">
          <path d="M206 278 H282" />
          <path d="M244 240 V316" />
        </g>

        <g filter="url(#neonGlow)">
          {[
            { cx: 566, cy: 190, color: '#facc15', label: 'Y' },
            { cx: 628, cy: 220, color: '#ef4444', label: 'B' },
            { cx: 504, cy: 220, color: '#38bdf8', label: 'X' },
            { cx: 566, cy: 282, color: '#22c55e', label: 'A' },
          ].map((button) => (
            <g key={button.label}>
              <circle cx={button.cx} cy={button.cy} r="28" fill="#020106" fillOpacity="0.62" stroke={button.color} strokeOpacity="0.9" strokeWidth="2" />
              <text x={button.cx} y={button.cy + 7} textAnchor="middle" fontSize="22" fontWeight="800" fill={button.color}>{button.label}</text>
            </g>
          ))}
        </g>

        <g stroke="#93c5fd" strokeWidth="2" strokeOpacity="0.6" filter="url(#neonGlow)">
          <circle cx="376" cy="180" r="16" fill="#03020a" fillOpacity="0.38" />
          <circle cx="444" cy="180" r="16" fill="#03020a" fillOpacity="0.38" />
          <path d="M390 178 H430" />
        </g>
      </svg>
    </motion.div>
  </div>
);

const Home = () => {
  const [featuredAccounts, setFeaturedAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { api } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/accounts/featured');
        setFeaturedAccounts(Array.isArray(res.data?.data) ? res.data.data : []);
      } catch (e) {
        console.error(e);
        setFeaturedAccounts([]);
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
      <style>{`
        .home-typing-line {
          display: block;
          width: 15ch;
          min-height: 1em;
        }

        .home-typing-loop {
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          border-right: 3px solid rgba(216, 180, 254, 0.92);
          animation: typing 3s steps(15, end) infinite, homeTypingCaret 0.8s step-end infinite;
        }

        @keyframes typing {
          0%,
          12% {
            width: 0;
          }

          42%,
          68% {
            width: 15ch;
          }

          100% {
            width: 0;
          }
        }

        @keyframes homeTypingCaret {
          0%,
          49% {
            border-right-color: rgba(216, 180, 254, 0.92);
          }

          50%,
          100% {
            border-right-color: transparent;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .home-typing-line {
            width: auto;
          }

          .home-typing-loop {
            width: auto;
            border-right: none;
            animation: none;
          }
        }
      `}</style>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          minHeight: '100vh',
          paddingTop: 80,
          background: 'radial-gradient(circle at 22% 30%, rgba(124,58,237,0.12), transparent 0 24rem), radial-gradient(circle at 78% 46%, rgba(124,58,237,0.16), transparent 0 28rem), linear-gradient(135deg, #060608 0%, #0b0815 45%, #060608 100%)',
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(168,85,247,0.5) 1px, transparent 1px)',
            backgroundSize: '26px 26px',
          }}
        />

        <div className="relative z-10 mx-auto flex max-w-7xl items-center px-4 sm:px-6 lg:px-8" style={{ minHeight: 'calc(100vh - 80px)' }}>
          <div className="grid w-full grid-cols-1 items-center gap-10 py-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12 lg:py-8">

            {/* Left */}
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="mx-auto w-full max-w-2xl space-y-9 lg:ml-10 lg:mr-0">
              {/* Heading */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="space-y-5">
                <div
                  className="pointer-events-none absolute left-0 top-[160px] h-48 w-48 rounded-full blur-3xl"
                  style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)' }}
                />
                <h1
                  className="relative max-w-[15ch] font-black leading-[0.9] tracking-[-0.02em]"
                  style={{
                    fontFamily: 'Rajdhani, Poppins, sans-serif',
                    fontSize: 'clamp(2.85rem, 5.4vw, 5.15rem)',
                    textShadow: '0 10px 30px rgba(0,0,0,0.28)',
                  }}
                >
                  <span className="block text-white">Premium</span>
                  <span className="home-typing-line whitespace-nowrap">
                    <span
                      className="home-typing-loop"
                      style={{
                        background: 'linear-gradient(135deg,#8b5cf6,#a855f7,#d8b4fe)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        textShadow: '0 0 24px rgba(168,85,247,0.42)',
                      }}
                    >
                      Gaming & Social
                    </span>
                  </span>
                  <span
                    className="block"
                    style={{
                      background: 'linear-gradient(135deg,#8b5cf6,#a855f7,#d8b4fe)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      textShadow: '0 0 28px rgba(168,85,247,0.55)',
                    }}
                  >
                    Booster
                  </span>
                </h1>
                <p className="text-xl font-semibold tracking-[0.02em] text-gray-300 sm:text-2xl" style={{ fontFamily: 'Rajdhani, Poppins, sans-serif' }}>
                  Accounts • UC Packages • Social Media Services
                </p>
                <p className="max-w-xl text-base leading-8 text-gray-400 sm:text-lg">
                  Premium gaming accounts, UC packages & social media growth services delivered instantly with secure payments and trusted support for gamers across Sri Lanka.
                </p>
              </motion.div>

              {/* Feature pills */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {['Verified Accounts', 'Instant Delivery', 'Secure Transactions', '24/7 Support'].map((f) => (
                  <div
                    key={f}
                    className="group flex items-center gap-3 rounded-full px-4 py-3"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(168,85,247,0.16)',
                      backdropFilter: 'blur(12px)',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
                    }}
                  >
                    <CheckCircle className="w-4 h-4 flex-shrink-0 text-purple-400" />
                    <span className="text-sm font-medium text-gray-200">{f}</span>
                  </div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
                className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/services"
                  className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl px-8 py-4 text-base font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]"
                  style={{
                    background: 'linear-gradient(135deg, rgba(124,58,237,0.78), rgba(168,85,247,0.62))',
                    border: '1px solid rgba(216,180,254,0.18)',
                    backdropFilter: 'blur(18px)',
                    boxShadow: '0 12px 36px rgba(124,58,237,0.26), inset 0 1px 0 rgba(255,255,255,0.16)',
                  }}
                >
                  <span
                    className="pointer-events-none absolute inset-y-0 left-[-28%] w-1/3 -skew-x-12 opacity-0 transition-all duration-500 group-hover:left-[110%] group-hover:opacity-100"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.42), transparent)' }}
                  />
                  <span>View Products</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="https://wa.me/94763442220"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-sm font-bold transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]"
                  style={{
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#cbd5e1',
                    background: 'rgba(255,255,255,0.03)',
                    backdropFilter: 'blur(18px)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
                  }}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.borderColor = 'rgba(37, 211, 102, 0.72)';
                    event.currentTarget.style.color = '#25D366';
                    event.currentTarget.style.boxShadow = '0 0 24px rgba(37, 211, 102, 0.18), inset 0 1px 0 rgba(255,255,255,0.04)';
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                    event.currentTarget.style.color = '#cbd5e1';
                    event.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.04)';
                  }}
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Contact on WhatsApp</span>
                </a>
              </motion.div>
            </motion.div>

            <HolographicControllerVisual />
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
        subtitle="The 3 latest Featured Deals uploaded from your admin inventory."
        showFilters={false}
        maxItems={3}
        latestFirst
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
