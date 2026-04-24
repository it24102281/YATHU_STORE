const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { protect } = require('../middleware/auth');

// POST /api/contact - Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message, accountInterest } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Create contact inquiry
    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      message,
      accountInterest
    });

    await contact.save();

    res.status(201).json({
      success: true,
      data: contact,
      message: 'Contact inquiry submitted successfully. We will get back to you soon!'
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(400).json({
      success: false,
      message: 'Error submitting contact form',
      error: error.message
    });
  }
});

// GET /api/contact - Get all contact inquiries (protected)
router.get('/', protect, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      priority,
      search
    } = req.query;

    // Build query
    const query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (priority && priority !== 'all') {
      query.priority = priority;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const contacts = await Contact.find(query)
      .populate('accountInterest', 'title price')
      .populate('respondedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Get total count
    const total = await Contact.countDocuments(query);

    res.json({
      success: true,
      data: contacts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching contact inquiries:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contact inquiries',
      error: error.message
    });
  }
});

// GET /api/contact/:id - Get single contact inquiry (protected)
router.get('/:id', protect, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('accountInterest', 'title price images')
      .populate('respondedBy', 'name email');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact inquiry not found'
      });
    }

    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Error fetching contact inquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contact inquiry',
      error: error.message
    });
  }
});

// PUT /api/contact/:id/respond - Respond to contact inquiry (protected)
router.put('/:id/respond', protect, async (req, res) => {
  try {
    const { response, status } = req.body;

    if (!response) {
      return res.status(400).json({
        success: false,
        message: 'Response message is required'
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        response,
        status: status || 'responded',
        respondedAt: new Date(),
        respondedBy: req.admin._id
      },
      { new: true, runValidators: true }
    ).populate('respondedBy', 'name email');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact inquiry not found'
      });
    }

    res.json({
      success: true,
      data: contact,
      message: 'Response sent successfully'
    });
  } catch (error) {
    console.error('Error responding to contact inquiry:', error);
    res.status(400).json({
      success: false,
      message: 'Error responding to contact inquiry',
      error: error.message
    });
  }
});

// PATCH /api/contact/:id/status - Update contact status (protected)
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'responded', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "pending", "responded", or "closed"'
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact inquiry not found'
      });
    }

    res.json({
      success: true,
      data: contact,
      message: `Status updated to ${status}`
    });
  } catch (error) {
    console.error('Error updating contact status:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating contact status',
      error: error.message
    });
  }
});

// DELETE /api/contact/:id - Delete contact inquiry (protected)
router.delete('/:id', protect, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact inquiry not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact inquiry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting contact inquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting contact inquiry',
      error: error.message
    });
  }
});

// GET /api/contact/stats - Get contact statistics (protected)
router.get('/stats/dashboard', protect, async (req, res) => {
  try {
    const stats = await Contact.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const priorityStats = await Contact.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    const recentInquiries = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email subject status createdAt');

    res.json({
      success: true,
      data: {
        statusStats: stats,
        priorityStats,
        recentInquiries
      }
    });
  } catch (error) {
    console.error('Error fetching contact stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contact statistics',
      error: error.message
    });
  }
});

module.exports = router;
