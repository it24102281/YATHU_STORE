import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Trophy, Users, Clock, CheckCircle, Star, Gamepad2, MessageCircle, Calendar, Eye } from 'lucide-react';

const SoldProofs = () => {
  const soldProofs = [
    {
      id: 1,
      customerName: 'Alex Chen',
      accountType: 'Ace Master',
      price: '$250',
      date: '2024-01-15',
      image: '/placeholder-proof1.jpg',
      features: ['Glacier M416', 'Mythic Set', 'Lab Weapons'],
      rating: 5,
      testimonial: 'Amazing account! Exactly as described. Fast delivery and great support!'
    },
    {
      id: 2,
      customerName: 'Sarah Johnson',
      accountType: 'Conqueror',
      price: '$450',
      date: '2024-01-12',
      image: '/placeholder-proof2.jpg',
      features: ['All Mythic Sets', 'Rare Skins', 'High KD'],
      rating: 5,
      testimonial: 'Best purchase ever! The account has everything I wanted. Highly recommend!'
    },
    {
      id: 3,
      customerName: 'Mike Wilson',
      accountType: 'Diamond',
      price: '$180',
      date: '2024-01-10',
      image: '/placeholder-proof3.jpg',
      features: ['Premium Skins', 'Good Stats', 'Multiple Weapons'],
      rating: 5,
      testimonial: 'Great service and amazing account. The team was very helpful throughout the process.'
    },
    {
      id: 4,
      customerName: 'Emma Davis',
      accountType: 'Platinum',
      price: '$120',
      date: '2024-01-08',
      image: '/placeholder-proof4.jpg',
      features: ['Rare Items', 'Good Progress', 'Clean Account'],
      rating: 5,
      testimonial: 'Perfect for my needs! Account was delivered instantly and works perfectly.'
    },
    {
      id: 5,
      customerName: 'James Lee',
      accountType: 'Ace',
      price: '$200',
      date: '2024-01-05',
      image: '/placeholder-proof5.jpg',
      features: ['Ace Rank', 'Mythic Weapons', 'Premium Skins'],
      rating: 5,
      testimonial: 'Excellent service! The account exceeded my expectations. Thank you!'
    },
    {
      id: 6,
      customerName: 'Lisa Brown',
      accountType: 'Crown',
      price: '$350',
      date: '2024-01-03',
      image: '/placeholder-proof6.jpg',
      features: ['Crown Rank', 'All Collections', 'Max Level'],
      rating: 5,
      testimonial: 'Absolutely love my new account! Worth every penny. Great seller!'
    }
  ];

  const stats = [
    { number: '500+', label: 'Accounts Sold', icon: Trophy },
    { number: '100%', label: 'Satisfaction', icon: Star },
    { number: '24/7', label: 'Support', icon: Users },
    { number: '5★', label: 'Average Rating', icon: Shield }
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
                  <Trophy className="w-12 h-12 text-black" />
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-2 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl opacity-20 blur-xl"
                />
              </div>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-black gradient-text mb-6">
              Sold Proofs
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              See our successful sales and happy customer testimonials
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="stats-gaming-card text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-yellow-500" />
                </div>
                <div className="text-3xl md:text-4xl font-black gradient-text mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sold Proofs Grid */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black gradient-text mb-6">Recent Sales</h2>
            <p className="text-gray-400 text-lg">
              Real customer purchases with verified testimonials
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {soldProofs.map((proof, index) => (
              <motion.div
                key={proof.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="gaming-card overflow-hidden hover-gaming-lift"
              >
                {/* Account Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={proof.image}
                    alt={`${proof.customerName} - ${proof.accountType}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  
                  {/* Account Type Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="badge-gaming-featured px-3 py-1 rounded-full text-xs font-bold">
                      {proof.accountType}
                    </div>
                  </div>
                  
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-yellow-500/90 text-black px-3 py-1 rounded-full text-xs font-bold">
                      {proof.price}
                    </div>
                  </div>
                  
                  {/* Date */}
                  <div className="absolute bottom-4 left-4 flex items-center space-x-2 text-white/80 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{proof.date}</span>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">{proof.customerName}</h3>
                      <div className="flex items-center space-x-1">
                        {[...Array(proof.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                        ))}
                      </div>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-yellow-500" />
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {proof.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="badge-gaming-gold text-xs"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Testimonial */}
                  <div className="border-t border-gray-800 pt-4">
                    <p className="text-gray-300 text-sm italic leading-relaxed">
                      "{proof.testimonial}"
                    </p>
                  </div>

                  {/* Verified Badge */}
                  <div className="mt-4 flex items-center justify-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-green-500 text-xs font-medium">Verified Purchase</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-black gradient-text">
              Why Our Customers Trust Us
            </h2>
            <p className="text-gray-300 text-xl leading-relaxed">
              Every sale is verified and every customer is satisfied. Join hundreds of happy gamers today!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="gaming-card p-6">
                <Shield className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">100% Verified</h3>
                <p className="text-gray-400">All accounts are verified before sale</p>
              </div>
              
              <div className="gaming-card p-6">
                <MessageCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Real Testimonials</h3>
                <p className="text-gray-400">Genuine customer reviews</p>
              </div>
              
              <div className="gaming-card p-6">
                <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Quality Guaranteed</h3>
                <p className="text-gray-400">Premium accounts only</p>
              </div>
            </div>

            <div className="mt-12">
              <a
                href="https://wa.me/94763442220"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gaming-primary text-lg px-8 py-4"
              >
                Get Your Account Now
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SoldProofs;
