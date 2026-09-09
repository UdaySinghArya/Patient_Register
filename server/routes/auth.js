import { Router } from 'express';
import { User, toUserDto } from '../models/User.js';

const router = Router();
const STATIC_OTP = process.env.STATIC_OTP || '0000';

function normalizeEmail(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

router.get('/auth/directory', async (_req, res, next) => {
  try {
    const users = await User.find({}).sort({ role: 1 }).lean();
    res.json({
      users: users.map((row) => ({
        email: row.email,
        role: row.role,
        name: row.name,
      })),
    });
  } catch (err) {
    next(err);
  }
});

router.post('/auth/send-otp', async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body?.email);
    if (!isEmail(email)) {
      return res.status(400).json({ errors: { email: 'Enter a valid email address' } });
    }

    const user = await User.findOne({ email }).lean();
    if (!user) {
      return res.status(404).json({ errors: { email: 'This email is not on the clinic list' } });
    }

    res.json({ ok: true, email });
  } catch (err) {
    next(err);
  }
});

router.post('/auth/verify-otp', async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const code = typeof req.body?.otp === 'string' ? req.body.otp.trim() : '';

    if (!isEmail(email)) {
      return res.status(400).json({ errors: { email: 'Enter a valid email address' } });
    }

    const user = await User.findOne({ email }).lean();
    if (!user || code !== STATIC_OTP) {
      return res.status(401).json({ errors: { otp: 'OTP is incorrect. Use 0000' } });
    }

    res.json({ user: toUserDto(user) });
  } catch (err) {
    next(err);
  }
});

router.post('/auth/logout', (_req, res) => {
  res.json({ ok: true });
});

export default router;
