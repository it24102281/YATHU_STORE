import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  MessageCircle, 
  Video,
  ChevronRight
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Quick Links',
      links: [
        { name: 'Home', path: '/' },
        { name: 'Accounts', path: '/accounts' },
        { name: 'About Us', path: '/about' },
        { name: 'Reviews', path: '/reviews' },
        { name: 'FAQ', path: '/faq' },
        { name: 'Contact', path: '/contact' },
      ]
    },
    {
      title: 'Services',
      links: [
        { name: 'PUBG Accounts', path: '/accounts' },
        { name: 'Premium IDs', path: '/accounts?filter=premium' },
        { name: 'Rare Skins', path: '/accounts?filter=skins' },
        { name: 'High Rank Accounts', path: '/accounts?filter=rank' },
        { name: 'Custom Orders', path: '/contact' },
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Contact Support', path: '/contact' },
        { name: 'FAQ', path: '/faq' },
        { name: 'Terms of Service', path: '/terms' },
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Refund Policy', path: '/refund' },
      ]
    }
  ];

  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      href: 'https://wa.me/94763442220',
      color: 'hover:text-green-500'
    },
    {
      name: 'TikTok',
      icon: Video,
      href: 'https://www.tiktok.com/@yathupubgstore?_r=1&_t=ZS-94bnn9SfVlV',
      color: 'hover:text-pink-500'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      href: 'https://www.facebook.com/share/1KTzzngFj3/?mibextid=wwXIfr',
      color: 'hover:text-blue-500'
    }
  ];

  return (
    <footer className="bg-gray-950 border-t border-yellow-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <img src="/logo.JPG" alt="Yathu Pubg Store Logo" className="h-20 w-auto object-contain rounded-xl" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted destination for premium PUBG accounts. We provide secure deals, 
              rare skins, and high-rank accounts with instant delivery.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-gray-400 transition-colors ${social.color}`}
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Links Sections */}
          {footerLinks.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-yellow-500">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="flex items-center space-x-2 text-gray-400 hover:text-yellow-500 transition-colors text-sm group"
                    >
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 pt-8 border-t border-gray-800"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">WhatsApp</p>
                <a href="https://wa.me/94763442220" className="text-sm font-medium text-yellow-500 hover:text-yellow-400">
                  +94 763 442 220
                </a>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Telegram</p>
                <a href="https://t.me/+94703374433" className="text-sm font-medium text-yellow-500 hover:text-yellow-400">
                  +94 703 374 433
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <a href="mailto:info@yathupubgstore.com" className="text-sm font-medium text-yellow-500 hover:text-yellow-400">
                  info@yathupubgstore.com
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 pt-8 border-t border-gray-800"
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-400">
                © {currentYear} YATHU PUBG STORE. All rights reserved.
              </p>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <Link to="/terms" className="hover:text-yellow-500 transition-colors">
                Terms of Service
              </Link>
              <Link to="/privacy" className="hover:text-yellow-500 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/refund" className="hover:text-yellow-500 transition-colors">
                Refund Policy
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
