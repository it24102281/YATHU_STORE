const express = require('express');
const router = express.Router();
const Account = require('../models/Account');
const { protect } = require('../middleware/auth');

// GET /api/accounts - Get all accounts with filters and search
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      status = 'available',
      rank,
      server,
      minPrice,
      maxPrice,
      minLevel,
      maxLevel,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      featured
    } = req.query;

    // Build query
    const query = {};
    
    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Featured filter
    if (featured === 'true') {
      query.featured = true;
    }
    
    // Rank filter
    if (rank && rank !== 'all') {
      query.rank = rank;
    }
    
    // Server filter
    if (server && server !== 'all') {
      query.server = server;
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    // Level range filter
    if (minLevel || maxLevel) {
      query.level = {};
      if (minLevel) query.level.$gte = parseInt(minLevel);
      if (maxLevel) query.level.$lte = parseInt(maxLevel);
    }
    
    // Search filter
    if (search) {
      query.$text = { $search: search };
    }

    // Sort options
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const accounts = await Account.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Get total count for pagination
    const total = await Account.countDocuments(query);

    res.json({
      success: true,
      data: accounts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching accounts',
      error: error.message
    });
  }
});

// GET /api/accounts/featured - Get featured accounts
router.get('/featured', async (req, res) => {
  try {
    const accounts = await Account.find({ 
      status: 'available', 
      featured: true 
    })
    .sort({ createdAt: -1 })
    .limit(6);

    res.json({
      success: true,
      data: accounts
    });
  } catch (error) {
    console.error('Error fetching featured accounts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured accounts',
      error: error.message
    });
  }
});

// GET /api/accounts/:id - Get single account by ID
router.get('/:id', async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    
    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }

    // Increment view count
    await Account.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.json({
      success: true,
      data: account
    });
  } catch (error) {
    console.error('Error fetching account:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching account',
      error: error.message
    });
  }
});

// POST /api/accounts - Create new account (protected)
router.post('/', protect, async (req, res) => {
  try {
    const account = new Account(req.body);
    await account.save();

    res.status(201).json({
      success: true,
      data: account,
      message: 'Account created successfully'
    });
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating account',
      error: error.message
    });
  }
});

// PUT /api/accounts/:id - Update account (protected)
router.put('/:id', protect, async (req, res) => {
  try {
    const account = await Account.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }

    res.json({
      success: true,
      data: account,
      message: 'Account updated successfully'
    });
  } catch (error) {
    console.error('Error updating account:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating account',
      error: error.message
    });
  }
});

// DELETE /api/accounts/:id - Delete account (protected)
router.delete('/:id', protect, async (req, res) => {
  try {
    const account = await Account.findByIdAndDelete(req.params.id);

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting account',
      error: error.message
    });
  }
});

// PATCH /api/accounts/:id/status - Update account status (protected)
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['available', 'sold'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "available" or "sold"'
      });
    }

    const account = await Account.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }

    res.json({
      success: true,
      data: account,
      message: `Account marked as ${status}`
    });
  } catch (error) {
    console.error('Error updating account status:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating account status',
      error: error.message
    });
  }
});

// GET /api/accounts/stats - Get account statistics (protected)
router.get('/stats/dashboard', protect, async (req, res) => {
  try {
    const stats = await Account.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalValue: { $sum: '$price' },
          avgPrice: { $avg: '$price' }
        }
      }
    ]);

    const rankStats = await Account.aggregate([
      { $match: { status: 'available' } },
      {
        $group: {
          _id: '$rank',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const serverStats = await Account.aggregate([
      { $match: { status: 'available' } },
      {
        $group: {
          _id: '$server',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        statusStats: stats,
        rankStats,
        serverStats
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

module.exports = router;
