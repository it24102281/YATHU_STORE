import React from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare, Quote } from 'lucide-react';

const Reviews = () => {
  const reviews = [
    {
      name: 'San Haranyan',
      rank: 'Ace Master',
      message: 'Best PUBG accounts seller. Fast delivery! All skins were exactly as described. Finally got my Glacier M416!',
      rating: 5,
      date: '2 days ago'
    },
    {
      name: 'Mithulashan',
      rank: 'Diamond V',
      message: 'Very trustworthy seller. The account transfer was smooth and support was helpful with the email binding process.',
      rating: 5,
      date: '1 week ago'
    },
    {
      name: 'Rajanayakam Lathujan',
      rank: 'Platinum II',
      message: 'High quality PUBG IDs with rare skins. Got my dream mythic set at a great price. Highly recommended!',
      rating: 5,
      date: '2 weeks ago'
    },
    {
      name: 'Supun Thilaka',
      rank: 'Ace Dominator',
      message: 'Excellent service. The response time was very fast. 100% genuine accounts here.',
      rating: 5,
      date: '3 weeks ago'
    },
    {
      name: 'Kavindu Perera',
      rank: 'Gold I',
      message: 'Bought a level 70 account with many lab weapons. Everything works perfectly. Thanks Yathu!',
      rating: 4,
      date: '1 month ago'
    },
    {
      name: 'Dinesh Kumara',
      rank: 'Crown III',
      message: 'Safe and secure. I was worried at first but the team was very professional. Happy with my purchase.',
      rating: 5,
      date: '1 month ago'
    }
  ];

  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="w-20 h-20 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-10 h-10 text-purple-500" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black gradient-text mb-6">Customer Reviews</h1>
          <p className="text-gray-400 text-lg">Hear what our global community of PUBG gamers has to say.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-900/50 p-8 rounded-3xl border border-white/5 relative group hover:border-purple-500/30 transition-all duration-300"
            >
              <Quote className="absolute top-6 right-8 w-10 h-10 text-purple-500/10 group-hover:text-purple-500/20 transition-colors" />
              
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-full flex items-center justify-center mr-4 text-2xl">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-white text-lg">{review.name}</div>
                  <div className="text-sm text-gray-500">{review.rank}</div>
                </div>
              </div>

              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < review.rating ? 'text-purple-500 fill-current' : 'text-gray-700'}`} 
                  />
                ))}
                <span className="ml-3 text-xs text-gray-500 leading-none">{review.date}</span>
              </div>

              <p className="text-gray-300 leading-relaxed italic">"{review.message}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
