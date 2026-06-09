import React from 'react';
import FeaturedDeals from '../components/FeaturedDeals';

const Services = () => {
  return (
    <div className="min-h-screen bg-black">
      <FeaturedDeals
        compact
        heading="Browse All Featured Deals"
        subtitle="Every card on this page is loaded from your backend database, so admin updates appear automatically."
        showSearch
      />
    </div>
  );
};

export default Services;
