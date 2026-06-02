import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, MessageCircle, Eye, Star, Crown, Zap, Shield } from 'lucide-react';
import VideoModal from './VideoModal';
import { getAutoThumbnail } from '../utils/video';

const WHATSAPP_NUMBER = '94763442220';
const ALL_LOGIN_METHODS = ['Facebook','Google','Twitter','Guest','Any','All Logins Cleared'];

const rankColors = {
  Bronze:    { bg: 'rgba(180,100,50,0.15)',  border: 'rgba(180,100,50,0.35)',  text: '#cd7f32' },
  Silver:    { bg: 'rgba(160,160,160,0.15)', border: 'rgba(160,160,160,0.35)', text: '#c0c0c0' },
  Gold:      { bg: 'rgba(255,200,0,0.15)',   border: 'rgba(255,200,0,0.35)',   text: '#ffd700' },
  Platinum:  { bg: 'rgba(100,200,220,0.15)', border: 'rgba(100,200,220,0.35)', text: '#7fffd4' },
  Diamond:   { bg: 'rgba(100,160,255,0.15)', border: 'rgba(100,160,255,0.35)', text: '#87ceeb' },
  Ace:       { bg: 'rgba(220,60,60,0.15)',   border: 'rgba(220,60,60,0.35)',   text: '#ff6b6b' },
  Master:    { bg: 'rgba(160,60,220,0.15)',  border: 'rgba(160,60,220,0.35)',  text: '#c084fc' },
  Conqueror: { bg: 'rgba(255,130,0,0.15)',   border: 'rgba(255,130,0,0.35)',   text: '#ff8c00' },
};

const categoryIcons = { Standard: Zap, Premium: Star, Elite: Crown, Rare: Shield };

const AccountCard = ({ account, index = 0 }) => {
  const [videoOpen, setVideoOpen] = useState(false);

  const hasVideo = account.videoType && account.videoType !== 'none' && account.videoUrl;

  const thumbnail =
    account.thumbnailUrl ||
    (account.videoType === 'youtube' ? getAutoThumbnail('youtube', account.videoUrl) : null) ||
    (account.images && account.images[0]) ||
    null;

  const rank = account.rank || 'Bronze';
  const rankStyle = rankColors[rank] || rankColors.Bronze;
  const CategoryIcon = categoryIcons[account.category] || Zap;

  const waMessage = encodeURIComponent(
    `Hi Yathu Official, I want to buy this account:\n${account.title}\nPrice: LKR ${account.price?.toLocaleString()}`
  );
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`;

  const displayFeatures = account.features?.length
    ? account.features.slice(0, 3)
    : account.skins?.slice(0, 3) || [];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.06, duration: 0.4 }}
        whileHover={{ y: -6 }}
        className="group relative flex flex-col rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, rgba(25,25,35,0.95), rgba(15,15,20,0.98))',
          border: '1px solid rgba(139,92,246,0.15)',
          transition: 'all 0.35s ease',
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.7), transparent)' }} />

        {/* Thumbnail area */}
        <div className="relative overflow-hidden" style={{ height: 200 }}>
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={account.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#1a1028,#0f0a1e)' }}>
              <div className="text-5xl mb-2">🎮</div>
              <p className="text-gray-500 text-xs">No preview</p>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(15,15,20,0.95) 0%, transparent 55%)' }} />

          {/* Status badge */}
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider"
              style={account.status === 'available'
                ? { background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.4)', color: '#4ade80' }
                : { background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171' }
              }>
              {account.status === 'available' ? '✓ Available' : '✗ Sold'}
            </span>
          </div>

          {account.featured && (
            <div className="absolute top-3 right-3">
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold"
                style={{ background: 'linear-gradient(135deg,#8b5cf6,#a855f7)', color: '#fff' }}>
                <Star className="w-3 h-3 fill-current" /> Featured
              </span>
            </div>
          )}

          {/* Play overlay on hover */}
          {hasVideo && (
            <button
              onClick={() => setVideoOpen(true)}
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'rgba(0,0,0,0.3)' }}
            >
              <div className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(139,92,246,0.9)', backdropFilter: 'blur(8px)' }}>
                <Play className="w-6 h-6 text-white fill-current ml-0.5" />
              </div>
            </button>
          )}

          <div className="absolute bottom-3 left-3">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold"
              style={{ background: rankStyle.bg, border: `1px solid ${rankStyle.border}`, color: rankStyle.text }}>
              {rank}
            </span>
          </div>
          <div className="absolute bottom-3 right-3">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold"
              style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.35)', color: '#c084fc' }}>
              <CategoryIcon className="w-3 h-3" />
              {account.category || 'Standard'}
            </span>
          </div>
        </div>

        {/* Card body */}
        <div className="flex flex-col flex-1 p-5 gap-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-white font-bold text-base leading-snug line-clamp-2 flex-1">{account.title}</h3>
            <div className="text-right flex-shrink-0">
              <div className="font-black text-lg" style={{ color: '#a855f7' }}>
                LKR {account.price?.toLocaleString()}
              </div>
            </div>
          </div>

          {displayFeatures.length > 0 && (
            <ul className="space-y-1.5">
              {displayFeatures.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#a855f7' }} />
                  <span className="truncate">{f}</span>
                </li>
              ))}
            </ul>
          )}

          {account.loginMethods?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {ALL_LOGIN_METHODS.every(m => account.loginMethods.includes(m)) ? (
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                  style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#c084fc' }}>
                  ✦ ALL Logins
                </span>
              ) : (
                account.loginMethods.map((m, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md text-xs font-semibold"
                    style={m === 'All Logins Cleared'
                      ? { background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }
                      : { background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', color: '#a78bfa' }
                    }>
                    {m === 'All Logins Cleared' ? '🔓 All Logins Cleared' : m}
                  </span>
                ))
              )}
            </div>
          )}

          {account.views > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <Eye className="w-3.5 h-3.5" />
              <span>{account.views} views</span>
            </div>
          )}

          <div className="flex flex-col gap-2 mt-auto pt-2">
            {hasVideo && (
              <button onClick={() => setVideoOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#c084fc' }}>
                <Play className="w-4 h-4" /> Watch Video
              </button>
            )}
            <div className="grid grid-cols-2 gap-2">
              <Link to={`/account/${account._id}`}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0' }}>
                <Eye className="w-3.5 h-3.5" /> Details
              </Link>
              <a href={waLink} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 hover:-translate-y-0.5"
                style={account.status === 'available'
                  ? { background: 'linear-gradient(135deg,#8b5cf6,#a855f7)', color: '#fff' }
                  : { background: 'rgba(100,100,100,0.2)', border: '1px solid rgba(100,100,100,0.3)', color: '#6b7280', pointerEvents: 'none' }
                }>
                <MessageCircle className="w-3.5 h-3.5" />
                {account.status === 'available' ? 'Buy Now' : 'Sold'}
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      <VideoModal
        isOpen={videoOpen}
        onClose={() => setVideoOpen(false)}
        videoType={account.videoType}
        videoUrl={account.videoUrl}
        title={account.title}
      />
    </>
  );
};

export default AccountCard;
