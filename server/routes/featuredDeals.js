const express = require('express');
const jwt = require('jsonwebtoken');
const FeaturedDeal = require('../models/FeaturedDeal');
const Admin = require('../models/Admin');
const { protect } = require('../middleware/auth');

const router = express.Router();

const DEFAULT_FEATURED_DEALS = [
  {
    title: 'Price Path',
    category: 'PUBG Services',
    subCategory: 'Price Path',
    price: 1500,
    oldPrice: 2000,
    description: 'PUBG price path deal with fast delivery and reliable support.',
    image: '/pubg-accounts.png',
    badge: 'Hot',
    isActive: true,
    stockStatus: 'in_stock',
    displayOrder: 1,
  },
  {
    title: 'Popularity',
    category: 'PUBG Services',
    subCategory: 'Popularity',
    price: 1200,
    oldPrice: 1600,
    description: 'Boost your PUBG popularity with secure gifting support.',
    image: '/pubg-accounts.png',
    badge: 'Popular',
    isActive: true,
    stockStatus: 'in_stock',
    displayOrder: 2,
  },
  {
    title: 'X-Suit Cards',
    category: 'PUBG Services',
    subCategory: 'X-Suit Cards',
    price: 3500,
    oldPrice: 4200,
    description: 'Premium X-Suit card offers for players building legendary looks.',
    image: '/logo.JPG',
    badge: 'Premium',
    isActive: true,
    stockStatus: 'limited_stock',
    displayOrder: 3,
  },
  {
    title: 'Vehicle Cards',
    category: 'PUBG Services',
    subCategory: 'Vehicle Cards',
    price: 2800,
    oldPrice: 3300,
    description: 'Vehicle card deals for collectors and custom garage builds.',
    image: '/logo.JPG',
    badge: 'New',
    isActive: true,
    stockStatus: 'in_stock',
    displayOrder: 4,
  },
  {
    title: 'CapCut Pro',
    category: 'Premium Subscriptions',
    subCategory: 'CapCut Pro',
    price: 1800,
    oldPrice: 2500,
    description: 'Premium CapCut subscription access for creators and editors.',
    image: '/favicon.png',
    badge: 'Save',
    isActive: true,
    stockStatus: 'in_stock',
    displayOrder: 5,
  },
  {
    title: 'Canva Pro',
    category: 'Premium Subscriptions',
    subCategory: 'Canva Pro',
    price: 2200,
    oldPrice: 3000,
    description: 'Canva Pro access for polished design work and marketing assets.',
    image: '/favicon.png',
    badge: 'Best Value',
    isActive: true,
    stockStatus: 'in_stock',
    displayOrder: 6,
  },
  {
    title: 'Spotify Premium',
    category: 'Premium Subscriptions',
    subCategory: 'Spotify Premium',
    price: 1700,
    oldPrice: 2300,
    description: 'Spotify Premium subscription with smooth activation support.',
    image: '/favicon.png',
    badge: 'Trending',
    isActive: true,
    stockStatus: 'in_stock',
    displayOrder: 7,
  },
  {
    title: 'TikTok Likes',
    category: 'Social Media Boosters',
    subCategory: 'TikTok Likes',
    price: 900,
    oldPrice: 1200,
    description: 'Fast TikTok likes to increase social proof on your content.',
    image: '/favicon.png',
    badge: 'Fast',
    isActive: true,
    stockStatus: 'in_stock',
    displayOrder: 8,
  },
  {
    title: 'TikTok Followers',
    category: 'Social Media Boosters',
    subCategory: 'TikTok Followers',
    price: 1400,
    oldPrice: 1900,
    description: 'Follower growth package designed for creator momentum.',
    image: '/favicon.png',
    badge: 'Popular',
    isActive: true,
    stockStatus: 'in_stock',
    displayOrder: 9,
  },
  {
    title: 'TikTok Views',
    category: 'Social Media Boosters',
    subCategory: 'TikTok Views',
    price: 800,
    oldPrice: 1100,
    description: 'View booster package for stronger reach and visibility.',
    image: '/favicon.png',
    badge: 'Boost',
    isActive: true,
    stockStatus: 'in_stock',
    displayOrder: 10,
  },
  {
    title: 'Facebook Page Followers',
    category: 'Social Media Boosters',
    subCategory: 'Facebook Page Followers',
    price: 1500,
    oldPrice: 2100,
    description: 'Build Facebook page credibility with steady follower delivery.',
    image: '/favicon.png',
    badge: 'Growth',
    isActive: true,
    stockStatus: 'limited_stock',
    displayOrder: 11,
  },
  {
    title: 'Facebook Page Likes',
    category: 'Social Media Boosters',
    subCategory: 'Facebook Page Likes',
    price: 1300,
    oldPrice: 1800,
    description: 'Page like package for stronger first impressions and reach.',
    image: '/favicon.png',
    badge: 'Recommended',
    isActive: true,
    stockStatus: 'in_stock',
    displayOrder: 12,
  },
  {
    title: 'Instagram Followers',
    category: 'Social Media Boosters',
    subCategory: 'Instagram Followers',
    price: 1600,
    oldPrice: 2200,
    description: 'Instagram follower package built for brand and creator growth.',
    image: '/favicon.png',
    badge: 'Top Pick',
    isActive: true,
    stockStatus: 'in_stock',
    displayOrder: 13,
  },
];

const ensureSeedData = async () => {
  const count = await FeaturedDeal.countDocuments();
  if (count === 0) {
    await FeaturedDeal.insertMany(DEFAULT_FEATURED_DEALS);
  }
};

const getOptionalAdmin = async (req) => {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return null;

  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return await Admin.findById(decoded.id);
  } catch (error) {
    return null;
  }
};

// GET /api/featured-deals - Get featured deals
router.get('/', async (req, res) => {
  try {
    await ensureSeedData();

    const admin = await getOptionalAdmin(req);
    const includeInactive = req.query.includeInactive === 'true' && admin?.isActive;
    const query = {};

    if (!includeInactive) {
      query.isActive = true;
      query.stockStatus = { $ne: 'out_of_stock' };
    }

    if (req.query.category && req.query.category !== 'All') {
      query.category = req.query.category;
    }

    const deals = await FeaturedDeal.find(query).sort({ displayOrder: 1, createdAt: -1 });

    res.json({
      success: true,
      data: deals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching featured deals',
      error: error.message,
    });
  }
});

// GET /api/featured-deals/:id - Get single featured deal
router.get('/:id', async (req, res) => {
  try {
    const admin = await getOptionalAdmin(req);
    const query = { _id: req.params.id };

    if (!admin?.isActive) {
      query.isActive = true;
      query.stockStatus = { $ne: 'out_of_stock' };
    }

    const deal = await FeaturedDeal.findOne(query);

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Featured deal not found',
      });
    }

    res.json({
      success: true,
      data: deal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching featured deal',
      error: error.message,
    });
  }
});

// POST /api/featured-deals - Create featured deal
router.post('/', protect, async (req, res) => {
  try {
    const deal = new FeaturedDeal(req.body);
    await deal.save();

    res.status(201).json({
      success: true,
      data: deal,
      message: 'Featured deal created successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating featured deal',
      error: error.message,
    });
  }
});

// PUT /api/featured-deals/:id - Update featured deal
router.put('/:id', protect, async (req, res) => {
  try {
    const deal = await FeaturedDeal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Featured deal not found',
      });
    }

    res.json({
      success: true,
      data: deal,
      message: 'Featured deal updated successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating featured deal',
      error: error.message,
    });
  }
});

// DELETE /api/featured-deals/:id - Delete featured deal
router.delete('/:id', protect, async (req, res) => {
  try {
    const deal = await FeaturedDeal.findByIdAndDelete(req.params.id);

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Featured deal not found',
      });
    }

    res.json({
      success: true,
      message: 'Featured deal deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting featured deal',
      error: error.message,
    });
  }
});

module.exports = router;
