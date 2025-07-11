const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Sign Up
router.post('/signup', async (req, res) => {
  const { studentId, email, password } = req.body;
  if (!studentId || !email || !password) {
    return res.status(400).json({ message: 'All fields required' });
  }
  try {
    const existing = await User.findOne({ $or: [{ studentId }, { email },{ password }] });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ studentId, email, password: hashed });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { studentId: user.studentId, email: user.email,  password: user.password } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Sign In
router.post('/signin', async (req, res) => {
  const { studentId, email, password } = req.body;
  if (!studentId || !password || !email) {
    return res.status(400).json({ message: 'All fields required' });
  }
  try {
    const user = await User.findOne({ studentId });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { studentId: user.studentId, email: user.email, password: user.password } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;