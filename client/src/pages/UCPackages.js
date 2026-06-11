import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Lock,
  MessageCircle,
  Package,
  ShieldCheck,
  Sparkles,
  Tag,
  Trophy,
  UserCircle2,
  Zap,
} from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const WHATSAPP_NUMBER = '94763442220';
const DESCRIPTION_PREVIEW_LIMIT = 40;

const badgeConfig = {
  'best-deal': {
    label: 'Best Deal',
    icon: Trophy,
    className:
      'border border-amber-300/40 bg-amber-400/15 text-amber-100 shadow-[0_8px_24px_rgba(245,158,11,0.18)]',
  },
  popular: {
    label: 'Popular',
    icon: Sparkles,
    className:
      'border border-fuchsia-300/35 bg-fuchsia-400/12 text-fuchsia-100 shadow-[0_8px_24px_rgba(217,70,239,0.16)]',
  },
  none: null,
};

const cardBaseShadow = '0 20px 45px rgba(0, 0, 0, 0.32)';
const cardActiveShadow = '0 26px 60px rgba(88, 28, 135, 0.34), 0 0 26px rgba(168, 85, 247, 0.26)';

const SkeletonCard = () => (
  <div
    className="h-full overflow-hidden rounded-[20px] border border-white/10 animate-pulse"
    style={{
      background:
        'linear-gradient(155deg, rgba(20,18,30,0.96) 0%, rgba(12,12,18,0.98) 60%, rgba(26,11,46,0.95) 100%)',
      boxShadow: cardBaseShadow,
    }}
  >
    <div className="h-56 bg-white/[0.05]" />
    <div className="space-y-4 p-5">
      <div className="h-5 w-24 rounded-full bg-white/[0.08]" />
      <div className="rounded-[18px] border border-white/8 bg-white/[0.03] p-4 space-y-3">
        <div className="h-8 w-32 rounded-lg bg-white/[0.08]" />
        <div className="h-8 w-28 rounded-lg bg-white/[0.06]" />
        <div className="h-8 w-24 rounded-lg bg-white/[0.05]" />
      </div>
      <div className="h-4 w-full rounded-lg bg-white/[0.06]" />
      <div className="h-4 w-2/3 rounded-lg bg-white/[0.05]" />
      <div className="flex gap-2">
        <div className="h-7 w-24 rounded-full bg-white/[0.05]" />
        <div className="h-7 w-32 rounded-full bg-white/[0.05]" />
      </div>
      <div className="mt-4 h-12 rounded-2xl bg-white/[0.08]" />
    </div>
  </div>
);

const splitAmountLabel = (value) => {
  const normalized = String(value || '').replace(/\s+/g, ' ').trim();
  const match = normalized.match(/^(.+?)(?:\s*(UC))$/i);

  if (!match) {
    return { amount: normalized, label: '' };
  }

  return { amount: match[1].trim(), label: 'UC' };
};

const normalizeAmountLines = (pkg) => {
  const rawAmounts = Array.isArray(pkg.ucAmounts) && pkg.ucAmounts.length
    ? pkg.ucAmounts
    : pkg.ucAmount
    ? [pkg.ucAmount]
    : [];

  return rawAmounts.map((value) => {
    if (typeof value === 'number') {
      return `${value.toLocaleString()} UC`;
    }

    return String(value).trim();
  });
};

const getPriceMode = (pkg) => {
  if (pkg.price === 'Inbox') {
    return 'inbox';
  }

  if (pkg.price === null || pkg.price === undefined || String(pkg.price).trim() === '') {
    return 'hidden';
  }

  return 'standard';
};

const getWhatsAppMessage = (pkg, amountLines, priceMode) => {
  const lines = [
    'Hi Yathu Official, I want to buy this UC package:',
    amountLines.join('\n'),
  ];

  if (pkg.bonus) {
    lines.push(`Bonus: ${pkg.bonus}`);
  }

  if (priceMode === 'standard') {
    lines.push(`Price: LKR ${pkg.price}`);
  }

  if (priceMode === 'inbox') {
    lines.push('Price: Inbox for Price');
  }

  return encodeURIComponent(lines.join('\n'));
};

const pillClassName =
  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] backdrop-blur-xl';

const UCPackageCard = ({
  pkg,
  index,
  isActive,
  isExpanded,
  onSelect,
  onToggleDescription,
}) => {
  const amountLines = normalizeAmountLines(pkg);
  const priceMode = getPriceMode(pkg);
  const badge = badgeConfig[pkg.badge] || badgeConfig.none;
  const BadgeIcon = badge?.icon;
  const safeDescription = String(pkg.description || '').trim();
  const shouldTruncate = safeDescription.length > DESCRIPTION_PREVIEW_LIMIT;
  const visibleDescription =
    shouldTruncate && !isExpanded
      ? `${safeDescription.slice(0, DESCRIPTION_PREVIEW_LIMIT).trimEnd()}...`
      : safeDescription;
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${getWhatsAppMessage(pkg, amountLines, priceMode)}`;
  const interactionPills = [
    pkg.status === 'available'
      ? {
          key: 'available',
          icon: ShieldCheck,
          label: 'Available',
          className:
            'border-emerald-300/30 bg-emerald-400/12 text-emerald-100 shadow-[0_8px_24px_rgba(16,185,129,0.14)]',
        }
      : null,
    pkg.topupMethod === 'tag'
      ? {
          key: 'tag',
          icon: Tag,
          label: 'Character ID Required',
          className:
            'border-amber-300/30 bg-amber-400/12 text-amber-100 shadow-[0_8px_24px_rgba(245,158,11,0.14)]',
        }
      : null,
    pkg.topupMethod === 'login'
      ? {
          key: 'login',
          icon: Lock,
          label: 'Login Required',
          className:
            'border-sky-300/30 bg-sky-400/12 text-sky-100 shadow-[0_8px_24px_rgba(56,189,248,0.14)]',
        }
      : null,
  ].filter(Boolean);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={
        isActive
          ? {
              opacity: 1,
              y: 0,
              scale: 1.02,
              boxShadow: [
                '0 26px 60px rgba(88, 28, 135, 0.34), 0 0 20px rgba(168, 85, 247, 0.18)',
                '0 28px 64px rgba(88, 28, 135, 0.38), 0 0 32px rgba(192, 132, 252, 0.32)',
                '0 26px 60px rgba(88, 28, 135, 0.34), 0 0 20px rgba(168, 85, 247, 0.18)',
              ],
              borderColor: [
                'rgba(168,85,247,0.45)',
                'rgba(216,180,254,0.72)',
                'rgba(168,85,247,0.45)',
              ],
            }
          : {
              opacity: 1,
              y: 0,
              scale: 1,
              boxShadow: cardBaseShadow,
              borderColor: 'rgba(255,255,255,0.1)',
            }
      }
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        boxShadow: isActive
          ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
          : { duration: 0.3 },
        borderColor: isActive
          ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
          : { duration: 0.3 },
      }}
      whileHover={{ y: -8 }}
      onClick={() => onSelect(pkg._id)}
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[20px] border text-left"
      style={{
        background:
          'linear-gradient(155deg, rgba(20,18,30,0.96) 0%, rgba(10,10,16,0.98) 58%, rgba(31,12,47,0.96) 100%)',
        boxShadow: isActive ? cardActiveShadow : cardBaseShadow,
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.12),_transparent_42%)] opacity-70" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />

      <div className="relative overflow-hidden">
        {pkg.image ? (
          <img
            src={pkg.image}
            alt={amountLines.join(' / ') || 'UC package'}
            className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-56 w-full items-center justify-center"
            style={{
              background:
                'radial-gradient(circle at top, rgba(168,85,247,0.3), transparent 40%), linear-gradient(145deg, #120c1f 0%, #09090f 100%)',
            }}
          >
            <div className="text-center">
              <div
                className="text-[42px] font-black"
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  letterSpacing: '0.12em',
                  background: 'linear-gradient(135deg, #e9d5ff 0%, #a855f7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                UC
              </div>
              <div className="mt-2 text-xs font-semibold uppercase tracking-[0.28em] text-purple-200/80">
                Premium Top-Up
              </div>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090f] via-[#09090f]/25 to-transparent" />

        <div className="absolute left-4 right-4 top-4 flex flex-wrap gap-2">
          {badge && BadgeIcon ? (
            <span className={`${pillClassName} ${badge.className}`}>
              <BadgeIcon className="h-3.5 w-3.5" />
              {badge.label}
            </span>
          ) : null}
          {interactionPills.map((pill) => (
            <span key={pill.key} className={`${pillClassName} ${pill.className}`}>
              <pill.icon className="h-3.5 w-3.5" />
              {pill.label}
            </span>
          ))}
        </div>
      </div>

      <div className="relative flex flex-1 flex-col p-5 sm:p-6">
        <div
          className="rounded-[18px] border p-4 sm:p-5"
          style={{
            background: 'linear-gradient(145deg, rgba(17,17,28,0.88), rgba(30,16,48,0.75))',
            borderColor: isActive ? 'rgba(168,85,247,0.34)' : 'rgba(168,85,247,0.2)',
            boxShadow: isActive ? '0 0 24px rgba(168,85,247,0.14)' : 'none',
          }}
        >
          <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-purple-200/80">
            <Package className="h-3.5 w-3.5" />
            UC Package
          </div>

          <div className="space-y-3">
            {amountLines.length > 0 ? (
              amountLines.map((line, amountIndex) => {
                const { amount, label } = splitAmountLabel(line);
                return (
                  <div
                    key={`${pkg._id}-amount-${amountIndex}`}
                    className="flex items-end gap-2 border-b border-white/6 pb-3 last:border-b-0 last:pb-0"
                  >
                    <span
                      className="leading-none"
                      style={{
                        fontFamily: "'Rajdhani', sans-serif",
                        fontWeight: 800,
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                        letterSpacing: '1px',
                        background: 'linear-gradient(135deg, #e9d5ff 0%, #a855f7 52%, #7c3aed 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        textShadow: '0 0 18px rgba(168,85,247,0.18)',
                      }}
                    >
                      {amount}
                    </span>
                    {label ? (
                      <span
                        className="pb-1 leading-none text-purple-100/90"
                        style={{
                          fontFamily: "'Rajdhani', sans-serif",
                          fontWeight: 700,
                          fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)',
                          letterSpacing: '0.2em',
                        }}
                      >
                        {label}
                      </span>
                    ) : null}
                  </div>
                );
              })
            ) : (
              <div className="text-lg font-semibold text-white/70">UC amount coming soon</div>
            )}
          </div>
        </div>

        {pkg.bonus ? (
          <div className="mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-purple-300/20 bg-purple-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-purple-100">
            <Zap className="h-3.5 w-3.5 text-purple-300" />
            {pkg.bonus}
          </div>
        ) : null}

        <div className="mt-5 min-h-[120px] flex-1">
          <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-500">
            Description
          </div>
          {safeDescription ? (
            <div className="mt-3">
              <AnimatePresence initial={false}>
                <motion.p
                  key={isExpanded ? 'expanded' : 'collapsed'}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.28, ease: 'easeInOut' }}
                  className="overflow-hidden text-sm leading-7 text-gray-300"
                >
                  {visibleDescription}
                </motion.p>
              </AnimatePresence>

              {shouldTruncate ? (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onToggleDescription(pkg._id);
                  }}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-purple-300 transition hover:text-purple-200"
                >
                  {isExpanded ? 'See Less' : 'See More'}
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              ) : null}
            </div>
          ) : (
            <p className="mt-3 text-sm leading-7 text-gray-500">Premium UC top-up package from Yathu Official.</p>
          )}
        </div>

        {priceMode !== 'hidden' ? (
          <div
            className="mt-5 rounded-[18px] border px-4 py-4 text-center"
            style={{
              background:
                priceMode === 'inbox'
                  ? 'linear-gradient(145deg, rgba(72,32,110,0.32), rgba(29,12,45,0.78))'
                  : 'linear-gradient(145deg, rgba(18,18,28,0.9), rgba(31,12,47,0.7))',
              borderColor:
                priceMode === 'inbox'
                  ? 'rgba(196,132,252,0.28)'
                  : 'rgba(168,85,247,0.2)',
            }}
          >
            {priceMode === 'inbox' ? (
              <div className="text-lg font-black text-purple-100 sm:text-xl">📩 Inbox for Price</div>
            ) : (
              <>
                <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-500">
                  Price
                </div>
                <div className="mt-2 text-[30px] font-black leading-none text-white">LKR {pkg.price}</div>
              </>
            )}
          </div>
        ) : null}

        {pkg.status === 'available' ? (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[18px] px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-white transition duration-300 hover:-translate-y-1"
            style={{
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 48%, #15803d 100%)',
              boxShadow: '0 16px 36px rgba(34,197,94,0.28)',
            }}
          >
            <MessageCircle className="h-4 w-4" />
            Buy on WhatsApp
          </a>
        ) : (
          <div
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[18px] border border-white/10 bg-white/[0.04] px-5 py-4 text-sm font-bold uppercase tracking-[0.16em] text-gray-500"
          >
            <UserCircle2 className="h-4 w-4" />
            Currently Unavailable
          </div>
        )}
      </div>
    </motion.article>
  );
};

const UCPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePackageId, setActivePackageId] = useState(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/uc-packages?status=available`);
        setPackages(Array.isArray(res.data?.data) ? res.data.data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!packages.length) {
      setActivePackageId(null);
      return;
    }

    setActivePackageId((current) =>
      current && packages.some((pkg) => pkg._id === current) ? current : null
    );
  }, [packages]);

  const trustPoints = useMemo(
    () => [
      'Secure WhatsApp checkout',
      'Fast manual processing',
      'Trusted gaming marketplace',
    ],
    []
  );

  const toggleDescription = (id) => {
    setExpandedDescriptions((current) => ({
      ...current,
      [id]: !current[id],
    }));
  };

  return (
    <div
      className="min-h-screen pt-24 pb-20"
      style={{
        background:
          'radial-gradient(circle at top, rgba(88,28,135,0.18), transparent 22%), linear-gradient(180deg, #08080d 0%, #0b0713 45%, #09090f 100%)',
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-14 text-center"
        >
          <div
            className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em]"
            style={{
              background: 'rgba(139,92,246,0.12)',
              border: '1px solid rgba(168,85,247,0.28)',
              color: '#d8b4fe',
            }}
          >
            <Package className="h-3.5 w-3.5" />
            UC Packages
          </div>
          <h1 className="text-4xl font-black text-white sm:text-5xl lg:text-6xl">
            Premium <span className="gradient-text">UC Marketplace</span>
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-gray-400 sm:text-lg">
            Discover premium PUBG UC packages with a luxury gaming-store experience, clear delivery options,
            and trusted WhatsApp ordering.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="mb-14 rounded-[24px] border border-white/10 px-5 py-5 sm:px-6"
          style={{
            background:
              'linear-gradient(145deg, rgba(19,18,29,0.9), rgba(10,10,16,0.96))',
            boxShadow: '0 22px 60px rgba(0,0,0,0.28)',
          }}
        >
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Select Your UC',
                desc: 'Choose the package that matches your gaming budget and top-up method.',
              },
              {
                step: '02',
                title: 'Message on WhatsApp',
                desc: 'Tap the CTA to send your package choice directly to the store team.',
              },
              {
                step: '03',
                title: 'Receive Fast Support',
                desc: 'Get premium guidance and fast delivery for your selected package.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-[20px] border border-white/8 bg-white/[0.03] p-5"
              >
                <div className="text-xs font-black uppercase tracking-[0.28em] text-purple-300">
                  Step {item.step}
                </div>
                <div className="mt-3 text-lg font-bold text-white">{item.title}</div>
                <div className="mt-2 text-sm leading-7 text-gray-400">{item.desc}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : packages.length === 0 ? (
          <div
            className="rounded-[24px] border border-white/10 px-6 py-20 text-center"
            style={{
              background:
                'linear-gradient(145deg, rgba(19,18,29,0.9), rgba(10,10,16,0.96))',
            }}
          >
            <div className="text-6xl">UC</div>
            <h3 className="mt-5 text-2xl font-bold text-white">No UC Packages Available</h3>
            <p className="mx-auto mt-3 max-w-lg text-gray-400">
              The marketplace is being refreshed. Reach out directly if you need a custom UC order right now.
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white"
              style={{
                background: 'linear-gradient(135deg,#22c55e,#15803d)',
                boxShadow: '0 14px 34px rgba(34,197,94,0.24)',
              }}
            >
              <MessageCircle className="h-4 w-4" />
              Contact Us
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {packages.map((pkg, index) => (
              <UCPackageCard
                key={pkg._id}
                pkg={pkg}
                index={index}
                isActive={activePackageId === pkg._id}
                isExpanded={Boolean(expandedDescriptions[pkg._id])}
                onSelect={setActivePackageId}
                onToggleDescription={toggleDescription}
              />
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 rounded-[24px] border border-white/10 px-6 py-6 text-center"
          style={{
            background:
              'linear-gradient(145deg, rgba(19,18,29,0.84), rgba(10,10,16,0.96))',
            boxShadow: '0 20px 50px rgba(0,0,0,0.24)',
          }}
        >
          <div className="flex flex-wrap items-center justify-center gap-3">
            {trustPoints.map((point) => (
              <span
                key={point}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-gray-300"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-purple-300" />
                {point}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UCPackages;
