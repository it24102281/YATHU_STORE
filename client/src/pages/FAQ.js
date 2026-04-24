import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = React.useState(null);

  const faqs = [
    {
      question: 'Are PUBG accounts safe to buy?',
      answer: 'Yes, all our accounts are obtained legally and are safe to use. We provide full account details and guide you through the transfer process to ensure maximum security.'
    },
    {
      question: 'How do I buy a PUBG account?',
      answer: 'Simply browse our accounts, click "View Details" on your preferred account, then contact us via WhatsApp or Telegram to complete the purchase. We walk you through every step.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept various payment methods including bank transfers, digital wallets (like Easypaisa, JazzCash), and cryptocurrency. Contact us for available options in your region.'
    },
    {
      question: 'How long does the delivery take?',
      answer: 'After payment confirmation, account delivery is usually instant. In some cases, it might take up to 30 minutes for security verification and final transfer.'
    },
    {
      question: 'Can I change the account email and password?',
      answer: 'Absolutely! Once you purchase an account, we provide instructions on how to change all security details including the linked email, phone number, and password.'
    },
    {
      question: 'Do you offer any warranty?',
      answer: 'We guarantee the account matches its description at delivery. For added security, we provide a 24-hour verification window for all our accounts.'
    }
  ];

  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="w-20 h-20 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-10 h-10 text-purple-500" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black gradient-text mb-6">Frequently Asked Questions</h1>
          <p className="text-gray-400 text-lg">Find answers to common questions about our PUBG accounts and services.</p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-900/50 border border-white/5 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(index === openIndex ? null : index)}
                className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
              >
                <span className="text-lg font-bold text-white">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-purple-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-8 pb-6 text-gray-400 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
