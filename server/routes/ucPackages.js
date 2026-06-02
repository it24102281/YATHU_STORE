const express = require('express');
const router = express.Router();
const UCPackage = require('../models/UCPackage');
const { protect } = require('../middleware/auth');

// GET /api/uc-packages - Get all packages (public)
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status && status !== 'all') query.status = status;

    const packages = await UCPackage.find(query).sort({ ucAmount: 1 });
    res.json({ success: true, data: packages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching UC packages', error: error.message });
  }
});

// GET /api/uc-packages/:id - Get single package (public)
router.get('/:id', async (req, res) => {
  try {
    const pkg = await UCPackage.findById(req.params.id);
    if (!pkg) return res.status(404).json({ success: false, message: 'UC package not found' });
    res.json({ success: true, data: pkg });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching UC package', error: error.message });
  }
});

// POST /api/uc-packages - Create package (protected)
router.post('/', protect, async (req, res) => {
  try {
    const pkg = new UCPackage(req.body);
    await pkg.save();
    res.status(201).json({ success: true, data: pkg, message: 'UC package created successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error creating UC package', error: error.message });
  }
});

// PUT /api/uc-packages/:id - Update package (protected)
router.put('/:id', protect, async (req, res) => {
  try {
    const pkg = await UCPackage.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!pkg) return res.status(404).json({ success: false, message: 'UC package not found' });
    res.json({ success: true, data: pkg, message: 'UC package updated successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error updating UC package', error: error.message });
  }
});

// DELETE /api/uc-packages/:id - Delete package (protected)
router.delete('/:id', protect, async (req, res) => {
  try {
    const pkg = await UCPackage.findByIdAndDelete(req.params.id);
    if (!pkg) return res.status(404).json({ success: false, message: 'UC package not found' });
    res.json({ success: true, message: 'UC package deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting UC package', error: error.message });
  }
});

module.exports = router;
