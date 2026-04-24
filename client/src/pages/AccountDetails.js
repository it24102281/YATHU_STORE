import React from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';

const AccountDetails = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold gradient-text mb-4">Account Details</h1>
          <p className="text-gray-400">Account ID: {id} - Details page coming soon</p>
        </motion.div>
      </div>
    </div>
  );
};

export default AccountDetails;
