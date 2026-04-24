import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Trophy, 
  Zap, 
  Star, 
  MessageCircle, 
  ChevronRight,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
  Crown,
  Sparkles,
  Flame,
  Target,
  Rocket,
  Gamepad2,
  Medal,
  TrendingUp
} from 'lucide-react';
import AccountCard from '../components/AccountCard';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [featuredAccounts, setFeaturedAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { api } = useAuth();

  useEffect(() => {
    fetchFeaturedAccounts();
  }, []);

  const fetchFeaturedAccounts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/accounts/featured');
      setFeaturedAccounts(response.data.data);
    } catch (error) {
      console.error('Error fetching featured accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Shield,
      title: 'Trusted Seller',
      description: '100% secure transactions with guaranteed account delivery and full support'
    },
    {
      icon: Trophy,
      title: 'Premium Accounts',
      description: 'High-rank accounts with rare skins and exclusive items'
    },
    {
      icon: Zap,
      title: 'Fast Response',
      description: 'Get your account details instantly after purchase confirmation'
    },
    {
      icon: Users,
      title: '24/7 Support',
      description: 'Round-the-clock customer support for all your needs'
    }
  ];

  const stats = [
    { number: '1000+', label: 'Happy Customers', icon: Crown },
    { number: 'Countless', label: 'Accounts Sold', icon: Star },
    { number: '4+', label: 'Years Experience', icon: Users },
    { number: '100%', label: 'Trust Rating', icon: Sparkles }
  ];

  const reviews = [
    {
      name: 'Alex Chen',
      rank: 'Ace Master',
      message: 'Best PUBG accounts seller. Fast delivery! All skins were exactly as described.',
      rating: 5,
      avatar: '👤'
    },
    {
      name: 'Sarah Johnson',
      rank: 'Diamond',
      message: 'Very trustworthy seller. The account transfer was smooth and support was helpful.',
      rating: 5,
      avatar: '👩'
    },
    {
      name: 'Mike Wilson',
      rank: 'Platinum',
      message: 'High quality PUBG IDs with rare skins. Got my Glacier M416 and mythic set!',
      rating: 5,
      avatar: '👨'
    }
  ];

  const faqs = [
    {
      question: 'Are PUBG accounts safe to buy?',
      answer: 'Yes, all our accounts are obtained legally and are safe to use. We provide full account details and guide you through the transfer process.'
    },
    {
      question: 'How do I buy a PUBG account?',
      answer: 'Simply browse our accounts, click "View Details" on your preferred account, then contact us via WhatsApp or Telegram to complete the purchase.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept various payment methods including bank transfers, digital wallets, and cryptocurrency. Contact us for available options in your region.'
    },
    {
      question: 'How do I receive account details?',
      answer: 'After payment confirmation, we instantly send you all account details including login credentials, security information, and transfer instructions.'
    }
  ];

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-thej">
        {/* Animated Background Elements */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-10 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"
        />
        
        {/* Floating Gaming Elements */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -100, 0], 
              x: [0, 50, 0],
              opacity: [0, 1, 0] 
            }}
            transition={{ 
              duration: 3 + i, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: i * 0.5
            }}
            className="absolute w-2 h-2 bg-purple-500/30 rounded-full"
            style={{ 
              left: `${10 + i * 15}%`, 
              top: `${20 + i * 10}%` 
            }}
          />
        ))}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            {/* Gaming Logo Animation */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center mb-12 mt-24 lg:mt-32"
            >
              <div className="relative">
                <div className="w-48 h-48 md:w-64 md:h-64 rounded-3xl flex items-center justify-center shadow-2xl float-thej overflow-hidden ring-4 ring-purple-500/30">
                  <img src="/logo.JPG" alt="Yathu Pubg Store Logo" className="w-full h-full object-cover" />
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-fuchsia-600 rounded-full opacity-20 blur-2xl -z-10"
                />
              </div>
            </motion.div>
            
            {/* Main Title */}
            <div className="space-y-6">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-7xl md:text-9xl font-black text-thej-shadow heading-thej"
                style={{ fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.05em' }}
              >
                <span className="gradient-text">YATHU PUBG</span>
                <br />
                <span className="text-white">STORE</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-2xl md:text-3xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-medium"
              >
                Trusted PUBG Account Marketplace
              </motion.p>
            </div>
            
            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link
                to="/accounts"
                className="btn-thej-primary text-lg px-8 py-4 group"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <Rocket className="w-5 h-5" />
                  <span>View Accounts</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              
              <a
                href="https://wa.me/94763442220"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-thej-secondary text-lg px-8 py-4 group"
              >
                <span className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5" />
                  <span>Contact WhatsApp</span>
                  <Flame className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </span>
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto mt-20"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  className="stats-thej-card group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <stat.icon className="w-8 h-8 text-purple-500" />
                  </div>
                  <div className="text-3xl md:text-4xl font-black gradient-text mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-white font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured PUBG Accounts Section */}
      <section className="section-thej section-thej-light">
        <div className="container-thej">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-black gradient-text mb-6 heading-thej">Featured PUBG Accounts</h2>
            <p className="text-gray-400 text-xl max-w-3xl mx-auto">
              High-end PUBG accounts with rare skins like Glacier M416, mythic sets, and lab weapons
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-24">
              <div className="spinner-thej"></div>
            </div>
          ) : featuredAccounts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredAccounts.map((account, index) => (
                <AccountCard key={account._id} account={account} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-8">
                <Target className="w-16 h-16 text-gray-600" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4 heading-thej">No Featured Accounts</h3>
              <p className="text-gray-400 text-xl mb-8">
                No featured accounts available at the moment.
              </p>
              <Link
                to="/accounts"
                className="btn-thej-primary inline-flex items-center gap-3"
              >
                <span>View All Accounts</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          )}

          <div className="text-center mt-20">
            <Link
              to="/accounts"
              className="btn-thej-secondary inline-flex items-center gap-3"
            >
              <span>View All Accounts</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section-thej section-thej-dark">
        <div className="container-thej">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-black gradient-text mb-6 heading-thej">Why Choose Us</h2>
            <p className="text-gray-400 text-xl max-w-3xl mx-auto">
              We provide the best PUBG accounts with premium features and exceptional service
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="feature-thej-card group"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-12 h-12 text-purple-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 heading-thej">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="section-thej section-thej-light">
        <div className="container-thej">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-black gradient-text mb-6 heading-thej">Customer Reviews</h2>
            <p className="text-gray-400 text-xl max-w-3xl mx-auto">
              See what our satisfied customers have to say about our service
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="thej-card p-8"
              >
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-full flex items-center justify-center mr-4 text-3xl">
                    {review.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-white text-xl">{review.name}</div>
                    <div className="text-sm text-gray-400">{review.rank}</div>
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-purple-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 leading-relaxed">"{review.message}"</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-20">
            <Link
              to="/reviews"
              className="btn-thej-secondary inline-flex items-center gap-3"
            >
              <span>View All Reviews</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-thej section-thej-dark">
        <div className="container-thej">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-black gradient-text mb-6 heading-thej">Frequently Asked Questions</h2>
            <p className="text-gray-400 text-xl">
              Common questions about our PUBG account services
            </p>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="thej-card p-8"
              >
                <h3 className="text-xl font-bold text-white mb-4 flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-purple-500 mt-1 flex-shrink-0" />
                  <span>{faq.question}</span>
                </h3>
                <p className="text-gray-400 leading-relaxed ml-9">{faq.answer}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-20">
            <Link
              to="/faq"
              className="btn-thej-secondary inline-flex items-center gap-3"
            >
              <span>View All FAQs</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-thej section-thej-light">
        <div className="container-thej">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-5xl font-black gradient-text heading-thej">
              Get Your Dream PUBG Account Today!
            </h2>
            <p className="text-gray-300 text-xl leading-relaxed">
              Contact us now to purchase premium PUBG accounts with rare skins and high ranks
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <a
                href="https://wa.me/94763442220"
                target="_blank"
                rel="noopener noreferrer"
                className="thej-card p-6 hover-thej-lift group"
              >
                <MessageCircle className="w-12 h-12 text-green-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-white mb-2">WhatsApp</h3>
                <p className="text-gray-400">+94763442220</p>
              </a>
              
              <a
                href="https://www.tiktok.com/@yathupubgstore?_r=1&_t=ZS-94bnn9SfVlV"
                target="_blank"
                rel="noopener noreferrer"
                className="thej-card p-6 hover-thej-lift group"
              >
                <TrendingUp className="w-12 h-12 text-pink-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-white mb-2">TikTok</h3>
                <p className="text-gray-400">@yathupubgstore</p>
              </a>
              
              <a
                href="https://t.me/+94703374433"
                target="_blank"
                rel="noopener noreferrer"
                className="thej-card p-6 hover-thej-lift group"
              >
                <MessageCircle className="w-12 h-12 text-blue-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-white mb-2">Telegram</h3>
                <p className="text-gray-400">+94703374433</p>
              </a>
              
              <a
                href="https://www.facebook.com/share/1KTzzngFj3/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="thej-card p-6 hover-thej-lift group"
              >
                <Users className="w-12 h-12 text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-white mb-2">Facebook</h3>
                <p className="text-gray-400">YATHU PUBG STORE</p>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
