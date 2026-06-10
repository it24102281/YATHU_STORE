import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const WhatsAppButton = () => {
  const [hovered, setHovered] = useState(false);
  const location = useLocation();
  const url = `https://wa.me/94763442220?text=${encodeURIComponent("Hi! I'm interested in buying a gaming account from Yathu Official.")}`;

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="fixed bottom-7 right-7 z-50 flex flex-col items-end gap-3">
      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="px-4 py-2.5 rounded-2xl text-sm font-semibold text-white pointer-events-none"
            style={{ background: 'rgba(17,17,17,0.95)', border: '1px solid rgba(34,197,94,0.3)', backdropFilter: 'blur(12px)', whiteSpace: 'nowrap', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}
          >
            💬 Chat with us
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button */}
      <motion.a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1.2 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        className="relative w-15 h-15 flex items-center justify-center rounded-full"
        style={{ width: 60, height: 60, background: 'linear-gradient(135deg, #22c55e, #16a34a)', boxShadow: '0 8px 32px rgba(34,197,94,0.4)' }}
      >
        <MessageCircle className="w-7 h-7 text-white" />
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full animate-ping" style={{ background: 'rgba(34,197,94,0.35)', animationDuration: '2s' }} />
      </motion.a>
    </div>
  );
};

export default WhatsAppButton;
