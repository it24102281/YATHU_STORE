import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import { getEmbedUrl } from '../utils/video';

const VideoModal = ({ isOpen, onClose, videoType, videoUrl, title }) => {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const embedUrl = getEmbedUrl(videoType, videoUrl);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(8px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-4xl rounded-2xl overflow-hidden"
            style={{ background: '#111', border: '1px solid rgba(139,92,246,0.3)', boxShadow: '0 32px 80px rgba(0,0,0,0.8)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4"
              style={{ background: 'rgba(139,92,246,0.1)', borderBottom: '1px solid rgba(139,92,246,0.2)' }}>
              <div>
                <p className="text-xs text-purple-400 font-semibold uppercase tracking-widest mb-0.5">Account Preview</p>
                <h3 className="text-white font-bold text-base truncate max-w-xs md:max-w-xl">{title}</h3>
              </div>
              <div className="flex items-center gap-2">
                {videoUrl && (
                  <a href={videoUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-purple-300 hover:text-white transition-colors"
                    style={{ background: 'rgba(139,92,246,0.15)' }}>
                    <ExternalLink className="w-3.5 h-3.5" /> Open
                  </a>
                )}
                <button onClick={onClose}
                  className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Video Frame */}
            <div className="relative" style={{ paddingTop: '56.25%' /* 16:9 */ }}>
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={title}
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center"
                  style={{ background: '#0a0a0a' }}>
                  <div className="text-6xl mb-4">🎮</div>
                  <p className="text-gray-400 font-medium">Video preview not available</p>
                  {videoUrl && (
                    <a href={videoUrl} target="_blank" rel="noopener noreferrer"
                      className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white"
                      style={{ background: 'linear-gradient(135deg,#8b5cf6,#a855f7)' }}>
                      <ExternalLink className="w-4 h-4" /> Open Video Link
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VideoModal;
