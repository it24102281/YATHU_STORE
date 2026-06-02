import express from 'express';
import Account from '../models/Account.js';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/accounts — public
router.get('/', async (req, res) => {
  try {
    const { status, search, page = 1, limit = 12, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (search) filter.$or = [
      { accountId: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    const total = await Account.countDocuments(filter);
    const accounts = await Account.find(filter).sort(sort).skip((page - 1) * limit).limit(Number(limit));
    res.json({ success: true, data: accounts, pagination: { page: Number(page), pages: Math.ceil(total / limit), total } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/accounts/:id
router.get('/:id', async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) return res.status(404).json({ success: false, message: 'Account not found' });
    account.views = (account.views || 0) + 1;
    await account.save();
    res.json({ success: true, data: account });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/accounts — admin
router.post('/', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const account = await Account.create(req.body);
    res.status(201).json({ success: true, data: account, message: 'Account created' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/accounts/:id — admin
router.put('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const account = await Account.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!account) return res.status(404).json({ success: false, message: 'Account not found' });
    res.json({ success: true, data: account, message: 'Account updated' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PATCH /api/accounts/:id/status — admin
router.patch('/:id/status', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const account = await Account.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!account) return res.status(404).json({ success: false, message: 'Account not found' });
    res.json({ success: true, data: account });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/accounts/:id — admin
router.delete('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const account = await Account.findByIdAndDelete(req.params.id);
    if (!account) return res.status(404).json({ success: false, message: 'Account not found' });
    res.json({ success: true, message: 'Account deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
