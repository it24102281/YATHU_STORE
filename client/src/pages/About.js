import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Trophy, Users, Clock, CheckCircle, Star, Gamepad2, Target } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Shield,
      title: 'Trusted Since 2021',
      description: 'We have been serving the PUBG community with premium accounts for over 4 years with 100% customer satisfaction.'
    },
    {
      icon: Trophy,
      title: 'Premium Quality Accounts',
      description: 'All our accounts are carefully selected and verified to ensure the highest quality and best gaming experience.'
    },
    {
      icon: Users,
      title: '1000+ Happy Customers',
      description: 'Join thousands of satisfied gamers who have purchased their dream PUBG accounts from our store.'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Our dedicated support team is available round the clock to help you with any questions or issues.'
    }
  ];

  const stats = [
    { number: '1000+', label: 'Happy Customers', icon: Users },
    { number: '4+', label: 'Years Experience', icon: Clock },
    { number: '100%', label: 'Satisfaction Rate', icon: Star },
    { number: '24/7', label: 'Support Available', icon: Shield }
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
              About YATHU PUBG STORE
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Your trusted partner for premium PUBG Mobile accounts since 2021
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

      {/* Our Story Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black gradient-text mb-6">Our Story</h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Founded in 2021, YATHU PUBG STORE has become the most trusted destination for PUBG Mobile enthusiasts seeking premium accounts.
            </p>
          </motion.div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="gaming-card p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-gray-300 leading-relaxed">
                To provide PUBG Mobile players with the highest quality accounts, exceptional service, and a seamless purchasing experience. We believe every gamer deserves access to premium content without the grind.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="gaming-card p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
              <p className="text-gray-300 leading-relaxed">
                To become the world's most trusted marketplace for gaming accounts, setting the standard for quality, security, and customer satisfaction in the gaming community.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="gaming-card p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-4">Our Values</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                  <span>Trust and transparency in every transaction</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                  <span>Exceptional customer service and support</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                  <span>Only the highest quality accounts</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                  <span>Fast and secure delivery</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black gradient-text mb-6">Why Choose Us</h2>
            <p className="text-gray-400 text-lg">
              We stand out from the competition with our commitment to excellence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="feature-gaming-card p-8"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="w-8 h-8 text-yellow-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
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
              Ready to Get Started?
            </h2>
            <p className="text-gray-300 text-xl leading-relaxed">
              Join thousands of satisfied customers and get your dream PUBG account today
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="https://wa.me/94763442220"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gaming-primary text-lg px-8 py-4"
              >
                Contact Us on WhatsApp
              </a>
              <a
                href="/accounts"
                className="btn-gaming-secondary text-lg px-8 py-4"
              >
                Browse Accounts
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
