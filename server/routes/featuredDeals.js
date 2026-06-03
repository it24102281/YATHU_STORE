const express = require('express');
const jwt = require('jsonwebtoken');
const FeaturedDeal = require('../models/FeaturedDeal');
const Admin = require('../models/Admin');
const { protect } = require('../middleware/auth');

const router = express.Router();

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
