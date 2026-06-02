import express from 'express';
import UCPackage from '../models/UCPackage.js';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/uc-packages — public
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status && status !== 'all' ? { status } : {};
    const packages = await UCPackage.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: packages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/uc-packages/:id — public
router.get('/:id', async (req, res) => {
  try {
    const pkg = await UCPackage.findById(req.params.id);
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
    res.json({ success: true, data: pkg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/uc-packages — admin only
router.post('/', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const pkg = await UCPackage.create(req.body);
    res.status(201).json({ success: true, data: pkg, message: 'UC package created' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/uc-packages/:id — admin only
router.put('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const pkg = await UCPackage.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
    res.json({ success: true, data: pkg, message: 'UC package updated' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/uc-packages/:id — admin only
router.delete('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const pkg = await UCPackage.findByIdAndDelete(req.params.id);
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
    res.json({ success: true, message: 'UC package deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
