import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Star, 
  Shield, 
  Trophy, 
  Zap, 
  Eye, 
  ExternalLink,
  MessageCircle,
  Crown,
  Sparkles
} from 'lucide-react';

const AccountCard = ({ account, index }) => {
  const {
    _id,
    title,
    price,
    rank,
    level,
    skins,
    gunSkins,
    server,
    loginMethod,
    images,
    status,
    views,
    featured
  } = account;

  const getRankColor = (rank) => {
    const colors = {
      'Bronze': 'from-purple-600 to-purple-800',
      'Silver': 'from-gray-400 to-gray-600',
      'Gold': 'from-yellow-500 to-yellow-700',
      'Platinum': 'from-cyan-500 to-cyan-700',
      'Diamond': 'from-blue-500 to-blue-700',
      'Ace': 'from-purple-500 to-purple-700',
      'Master': 'from-red-500 to-red-700'
    };
    return colors[rank] || 'from-gray-500 to-gray-700';
  };

  const getServerFlag = (server) => {
    const flags = {
      'Asia': '🇦🇸',
      'Europe': '🇪🇺',
      'America': '🇺🇸',
      'Korea': '🇰🇷',
      'Taiwan/Hong Kong/Macau': '🇹🇼'
    };
    return flags[server] || '🌍';
  };

  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    const message = `Hi! I'm interested in ${title} account priced at $${price}.`;
    const url = `https://wa.me/94763442220?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ y: -12, scale: 1.02 }}
      className="thej-card group relative"
    >
      {/* Featured Badge */}
      {featured && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 + 0.2 }}
          className="absolute top-4 left-4 z-20"
        >
          <div className="badge-thej-featured flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-bold">
            <Crown className="w-4 h-4" />
            <span>Featured</span>
            <Sparkles className="w-4 h-4" />
          </div>
        </motion.div>
      )}

      {/* Status Badge */}
      <div className="absolute top-4 right-4 z-20">
        <div className={`badge-thej ${status === 'available' ? 'badge-thej-success' : 'badge-thej-danger'} backdrop-blur-md`}>
          {status === 'available' ? 'Available' : 'Sold'}
        </div>
      </div>

      {/* Image Section */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={images[0] || '/placeholder-account.jpg'}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
        
        {/* Rank Badge */}
        <div className="absolute bottom-4 left-4">
          <div className={`bg-gradient-to-r ${getRankColor(rank)} px-4 py-2 rounded-full text-sm font-bold text-white flex items-center space-x-2 shadow-lg`}>
            <Trophy className="w-4 h-4" />
            <span>{rank}</span>
          </div>
        </div>

        {/* Views Counter */}
        <div className="absolute bottom-4 right-4 flex items-center space-x-2 text-white/90 text-sm bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
          <Eye className="w-4 h-4" />
          <span>{views}</span>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <h3 className="font-bold text-xl text-white group-hover:text-purple-500 transition-colors line-clamp-2">
          {title}
        </h3>

        {/* Price and Server */}
        <div className="flex items-center justify-between">
          <div className="text-3xl font-black gradient-text">
            ${price}
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full">
            <span>{getServerFlag(server)}</span>
            <span>{server}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center space-x-2 text-sm text-gray-300 bg-gray-800/30 px-3 py-2 rounded-lg">
            <Zap className="w-4 h-4 text-purple-500" />
            <span>Level {level}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-300 bg-gray-800/30 px-3 py-2 rounded-lg">
            <Shield className="w-4 h-4 text-blue-500" />
            <span>{loginMethod}</span>
          </div>
        </div>

        {/* Items Preview */}
        {(skins.length > 0 || gunSkins.length > 0) && (
          <div className="space-y-2 pt-2 border-t border-gray-800">
            {skins.length > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Rare Skins</span>
                <span className="text-purple-500 font-semibold">{skins.length}</span>
              </div>
            )}
            {gunSkins.length > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Gun Skins</span>
                <span className="text-purple-500 font-semibold">{gunSkins.length}</span>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <Link
            to={`/account/${_id}`}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center space-x-2 group/btn"
          >
            <ExternalLink className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            <span>View Details</span>
          </Link>
          
          {status === 'available' && (
            <button
              onClick={handleWhatsAppClick}
              className="flex-1 btn-thej-primary py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center space-x-2 group/btn"
            >
              <MessageCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
              <span>Buy Now</span>
            </button>
          )}
        </div>
      </div>

      {/* Floating Glow Effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-purple-600/20 blur-xl"></div>
      </div>
    </motion.div>
  );
};

export default AccountCard;
