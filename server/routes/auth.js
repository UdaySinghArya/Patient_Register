import { Router } from 'express';
import { User, toDirectoryDto, toUserDto } from '../models/User.js';

const router = Router();

function digitsOnly(value) {
  return typeof value === 'string' ? value.replace(/\D/g, '') : '';
}

router.get('/auth/directory', async (_req, res, next) => {
  try {
    const users = await User.find({}).sort({ role: 1 }).lean();
    res.json({ users: users.map(toDirectoryDto) });
  } catch (err) {
    next(err);
  }
});

router.post('/auth/login', async (req, res, next) => {
  try {
    const phone = digitsOnly(req.body?.phone);
    const pin = typeof req.body?.pin === 'string' ? req.body.pin.trim() : '';
    const errors = {};

    if (phone.length !== 10) errors.phone = 'Enter a 10-digit mobile number';
    if (!/^\d{4}$/.test(pin)) errors.pin = 'PIN must be 4 digits';

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    const user = await User.findOne({ phone }).lean();
    if (!user || user.pin !== pin) {
      return res.status(401).json({
        errors: { pin: 'Mobile number or PIN is incorrect' },
      });
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
