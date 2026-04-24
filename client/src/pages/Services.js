import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Trophy, Zap, Users, Star, Crown, Gamepad2, Target, Gift, Clock, CheckCircle, Car, Coins, Shirt, Package } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Gamepad2,
      title: 'PUBG Account Selling',
      description: 'Premium accounts from 1,000 LKR to 300,000 LKR (5 USD to 1,000 USD). I have successfully sold countless accounts to satisfied customers.',
      features: ['All price ranges available', 'Verified accounts', 'Instant delivery', 'Full account details provided'],
      price: 'Learn More'
    },
    {
      icon: Coins,
      title: 'UC Top-up Services',
      description: 'Get UC at the best rates in the market. Prices may vary slightly due to USD exchange rates.',
      features: ['Competitive rates', 'Fast delivery', 'Secure transactions', 'All UC amounts available'],
      price: 'Learn More'
    },
    {
      icon: Star,
      title: 'Popularity Gifting',
      description: 'Gift your friends with PUBG popularity items and make their gaming experience more enjoyable.',
      features: ['All popularity items', 'Gift to any player', 'Instant gifting', 'Surprise your friends'],
      price: 'Learn More'
    },
    {
      icon: Car,
      title: 'Car Cards Gifting',
      description: 'Exclusive car cards and vehicle skins to make your rides stand out in the battleground.',
      features: ['Rare car cards', 'Exclusive designs', 'All vehicle types', 'Limited edition items'],
      price: 'Learn More'
    },
    {
      icon: Shirt,
      title: 'X-Suits Gifting',
      description: 'Premium X-Suits and exclusive outfits that will make your character look legendary.',
      features: ['Legendary X-Suits', 'Exclusive outfits', 'Rare collections', 'Premium designs'],
      price: 'Learn More'
    },
    {
      icon: Package,
      title: 'Complete PUBG Services',
      description: 'Everything you need for PUBG Mobile - if it can be sold in the game, I have it!',
      features: ['All PUBG items', 'Custom requests', 'Bulk orders', 'Special deals'],
      price: 'Learn More'
    }
  ];

  const accountTypes = [
    {
      type: 'Bronze Accounts',
      description: 'Perfect for beginners and casual players',
      features: ['Level 50+', 'Basic skins', 'Good starting gear'],
      price: '$25 - $50'
    },
    {
      type: 'Silver Accounts',
      description: 'Great for intermediate players',
      features: ['Level 70+', 'Rare skins', 'Better weapons'],
      price: '$50 - $100'
    },
    {
      type: 'Gold Accounts',
      description: 'Premium accounts with exclusive content',
      features: ['Level 90+', 'Mythic sets', 'Lab weapons'],
      price: '$100 - $200'
    },
    {
      type: 'Diamond+ Accounts',
      description: 'Top-tier accounts for serious players',
      features: ['Level 100+', 'All rare items', 'Conqueror rank'],
      price: '$200 - $500'
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden hero-gaming">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center mb-8"
            >
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-2xl float-gaming">
                  <Gamepad2 className="w-12 h-12 text-black" />
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-2 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl opacity-20 blur-xl"
                />
              </div>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-black gradient-text mb-6">
              Our Services
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Premium PUBG Mobile accounts and exceptional service for every gamer
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Services Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black gradient-text mb-6">What We Offer</h2>
            <p className="text-gray-400 text-lg">
              Comprehensive services to enhance your PUBG Mobile experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="gaming-card p-8 hover-gaming-lift"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-2xl flex items-center justify-center mb-6">
                  <service.icon className="w-8 h-8 text-yellow-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">{service.description}</p>

                <div className="space-y-3 mb-6">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="text-center mt-6">
                  <a href="https://wa.me/94763442220" target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-3 bg-purple-500/20 hover:bg-purple-500/30 transition-colors rounded-full text-purple-400 font-bold w-full">
                    {service.price}
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Account Types Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black gradient-text mb-6">Account Types</h2>
            <p className="text-gray-400 text-lg">
              Choose the perfect account based on your gaming needs and budget
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {accountTypes.map((account, index) => (
              <motion.div
                key={account.type}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="feature-gaming-card p-6 text-center"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-6 h-6 text-yellow-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{account.type}</h3>
                <p className="text-gray-400 text-sm mb-4">{account.description}</p>

                <div className="space-y-2 mb-4">
                  {account.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center justify-center space-x-2">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span className="text-gray-300 text-xs">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="text-yellow-500 font-bold">{account.price}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black gradient-text mb-6">Why Choose Our Services</h2>
            <p className="text-gray-400 text-lg">
              We go above and beyond to ensure your satisfaction
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="gaming-card p-8 text-center"
            >
              <Gift className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-4">Free Bonuses</h3>
              <p className="text-gray-300 leading-relaxed">
                Get exclusive skins, weapons, and items with every premium account purchase
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="gaming-card p-8 text-center"
            >
              <Clock className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-4">Fast Processing</h3>
              <p className="text-gray-300 leading-relaxed">
                Quick verification and instant delivery of your account details
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="gaming-card p-8 text-center"
            >
              <Target className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-4">Quality Guaranteed</h3>
              <p className="text-gray-300 leading-relaxed">
                All accounts are verified and tested to ensure the best gaming experience
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-black gradient-text">
              Ready to Level Up Your Game?
            </h2>
            <p className="text-gray-300 text-xl leading-relaxed">
              Browse our premium accounts and find the perfect match for your gaming style
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="/accounts"
                className="btn-gaming-primary text-lg px-8 py-4"
              >
                Browse Accounts
              </a>
              <a
                href="https://wa.me/94763442220"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gaming-secondary text-lg px-8 py-4"
              >
                Contact Support
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;
