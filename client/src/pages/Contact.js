import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Users, 
  TrendingUp, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Shield,
  Gamepad2,
  Send,
  CheckCircle
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    accountType: '',
    budget: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        message: '',
        accountType: '',
        budget: ''
      });
    }, 2000);
  };

  const contactMethods = [
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      value: '+94763442220',
      description: 'Fast response for account purchases',
      link: 'https://wa.me/94763442220',
      color: 'text-green-500',
      bgColor: 'from-green-500/20 to-green-600/20',
      valueColor: 'text-green-400'
    },
    {
      icon: MessageCircle,
      title: 'Telegram',
      value: '+94703374433',
      description: 'Alternative contact method',
      link: 'https://t.me/+94703374433',
      color: 'text-blue-500'
    },
    {
      icon: TrendingUp,
      title: 'TikTok',
      value: '@yathupubgstore',
      description: 'Follow us for updates and showcases',
      link: 'https://www.tiktok.com/@yathupubgstore?_r=1&_t=ZS-94bnn9SfVlV',
      color: 'text-pink-500'
    },
    {
      icon: Users,
      title: 'Facebook',
      value: 'YATHU PUBG STORE',
      description: 'Join our community',
      link: 'https://www.facebook.com/share/1KTzzngFj3/?mibextid=wwXIfr',
      color: 'text-blue-600'
    }
  ];

  const faqs = [
    {
      question: 'How quickly do you respond?',
      answer: 'We typically respond within 5-10 minutes during business hours.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept bank transfers, digital wallets, and cryptocurrency.'
    },
    {
      question: 'Is my purchase guaranteed?',
      answer: 'Yes, all purchases come with a 7-day guarantee and full support.'
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
                  <MessageCircle className="w-12 h-12 text-black" />
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-2 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl opacity-20 blur-xl"
                />
              </div>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-black gradient-text mb-6">
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Get in touch for premium PUBG accounts and exceptional service
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black gradient-text mb-6">Get in Touch</h2>
            <p className="text-gray-400 text-lg">
              Multiple ways to reach us for your convenience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <motion.a
                key={method.title}
                href={method.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="gaming-card p-6 text-center hover-gaming-lift group"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${method.bgColor || 'from-yellow-500/20 to-yellow-600/20'} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <method.icon className={`w-8 h-8 ${method.color}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{method.title}</h3>
                <p className={`${method.valueColor || 'text-yellow-500'} font-bold mb-2`}>{method.value}</p>
                <p className="text-gray-400 text-sm">{method.description}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black gradient-text mb-6">Send Us a Message</h2>
            <p className="text-gray-400 text-lg">
              Fill out the form below and we'll get back to you ASAP
            </p>
          </motion.div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="gaming-card p-12 text-center"
            >
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Message Sent!</h3>
              <p className="text-gray-300">
                Thank you for contacting us. We'll get back to you within 24 hours.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="gaming-card p-8"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-2">Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="form-gaming"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="form-gaming"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-2">Account Type Interested In</label>
                    <select
                      name="accountType"
                      value={formData.accountType}
                      onChange={handleChange}
                      className="form-gaming"
                    >
                      <option value="">Select Account Type</option>
                      <option value="bronze">Bronze</option>
                      <option value="silver">Silver</option>
                      <option value="gold">Gold</option>
                      <option value="platinum">Platinum</option>
                      <option value="diamond">Diamond</option>
                      <option value="ace">Ace</option>
                      <option value="conqueror">Conqueror</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Budget Range</label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="form-gaming"
                    >
                      <option value="">Select Budget</option>
                      <option value="0-50">$0 - $50</option>
                      <option value="50-100">$50 - $100</option>
                      <option value="100-200">$100 - $200</option>
                      <option value="200-500">$200 - $500</option>
                      <option value="500+">$500+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Your Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="form-gaming"
                    placeholder="Tell us what you're looking for..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-gaming-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center space-x-2">
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </span>
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black gradient-text mb-6">Frequently Asked Questions</h2>
            <p className="text-gray-400 text-lg">
              Quick answers to common questions
            </p>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="gaming-card p-6"
              >
                <h3 className="text-xl font-bold text-white mb-3">{faq.question}</h3>
                <p className="text-gray-300">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Hours */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="gaming-card p-8"
          >
            <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">Business Hours</h2>
            <div className="space-y-2 text-gray-300">
              <p>Monday - Friday: 9:00 AM - 11:00 PM</p>
              <p>Saturday - Sunday: 10:00 AM - 12:00 AM</p>
              <p className="text-yellow-500 font-bold mt-4">24/7 WhatsApp Support Available</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
