import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Video, Facebook, Phone, Mail, ChevronRight, Shield, Gamepad2 } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Accounts', path: '/accounts' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ];

  const serviceLinks = [
    { name: 'PUBG Accounts', path: '/accounts' },
    { name: 'UC Packages', path: '/services' },
    { name: 'Premium IDs', path: '/accounts' },
    { name: 'High Rank Accounts', path: '/accounts' },
    { name: 'Custom Orders', path: '/contact' },
  ];

  const legalLinks = [
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Refund Policy', path: '/refund' },
  ];

  const socials = [
    { name: 'WhatsApp', icon: MessageCircle, href: 'https://wa.me/94763442220', color: '#22c55e' },
    { name: 'TikTok', icon: Video, href: 'https://www.tiktok.com/@yathupubgstore?_r=1&_t=ZS-94bnn9SfVlV', color: '#ec4899' },
    { name: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/share/1KTzzngFj3/?mibextid=wwXIfr', color: '#3b82f6' },
  ];

  return (
    <footer style={{ background: '#080808', borderTop: '1px solid rgba(139,92,246,0.12)', fontFamily: 'Poppins, sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-5 group w-fit">
              <img src="/logo.JPG" alt="Yathu Official" className="h-12 w-12 object-cover rounded-xl border border-purple-500/30" />
              <div>
                <div className="font-black text-base" style={{ background: 'linear-gradient(135deg,#a855f7,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Yathu Official
                </div>
                <div className="text-[10px] text-gray-600 tracking-widest uppercase font-medium">Gaming Marketplace</div>
              </div>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Your trusted destination for premium gaming accounts. Secure deals, rare skins, and high-rank accounts with instant delivery.
            </p>
            <div className="flex gap-3">
              {socials.map((s) => (
                <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.name}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = `${s.color}20`; e.currentTarget.style.borderColor = `${s.color}50`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                >
                  <s.icon className="w-4 h-4" style={{ color: s.color }} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5" style={{ color: '#a855f7' }}>Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.name}>
                  <Link to={l.path} className="group flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors duration-200">
                    <ChevronRight className="w-3.5 h-3.5 text-purple-600 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200" />
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5" style={{ color: '#a855f7' }}>Services</h4>
            <ul className="space-y-3">
              {serviceLinks.map((l) => (
                <li key={l.name}>
                  <Link to={l.path} className="group flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors duration-200">
                    <ChevronRight className="w-3.5 h-3.5 text-purple-600 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200" />
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5" style={{ color: '#a855f7' }}>Contact Us</h4>
            <div className="space-y-4">
              {[
                { icon: MessageCircle, label: 'WhatsApp', value: '+94 763 442 220', href: 'https://wa.me/94763442220', color: '#22c55e' },
                { icon: Phone, label: 'Telegram', value: '+94 703 374 433', href: 'https://t.me/+94703374433', color: '#3b82f6' },
                { icon: Mail, label: 'Email', value: 'info@yathuofficial.com', href: 'mailto:info@yathuofficial.com', color: '#a855f7' },
              ].map((c) => (
                <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 group">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-110"
                    style={{ background: `${c.color}15`, border: `1px solid ${c.color}30` }}>
                    <c.icon className="w-4 h-4" style={{ color: c.color }} />
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-600 uppercase tracking-widest">{c.label}</div>
                    <div className="text-sm text-gray-400 group-hover:text-white transition-colors duration-200 font-medium">{c.value}</div>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px mb-8" style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent)' }} />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs">
            © {year} <span className="text-gray-400 font-medium">Yathu Official</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {legalLinks.map((l) => (
              <Link key={l.name} to={l.path} className="text-xs text-gray-600 hover:text-gray-300 transition-colors duration-200">
                {l.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
