import { Router } from 'express';
import mongoose from 'mongoose';
import { Entry, toEntryDto } from '../models/Entry.js';
import { dayBoundsIST, isValidYmd, todayYmdIST } from '../utils/dates.js';
import { validateEntry } from '../utils/validateEntry.js';

const router = Router();

function roundMoney(n) {
  return Math.round(n * 100) / 100;
}

async function daySummary(ymd) {
  const bounds = dayBoundsIST(ymd);
  const docs = await Entry.find({
    createdAt: { $gte: bounds.start, $lt: bounds.end },
  })
    .sort({ createdAt: -1 })
    .lean();

  const patientCount = docs.length;
  const totalAmount = roundMoney(docs.reduce((sum, row) => sum + row.amount, 0));
  const lastEntry = docs[0]
    ? { patientName: docs[0].patientName, createdAt: docs[0].createdAt }
    : null;

  return {
    date: ymd,
    patientCount,
    totalAmount,
    lastEntry,
    entries: docs.map(toEntryDto),
  };
}

router.get('/entries', async (req, res, next) => {
  try {
    const raw = req.query.date;
    const ymd = raw == null || raw === '' ? todayYmdIST() : String(raw);

    if (!isValidYmd(ymd)) {
      return res.status(400).json({
        errors: { date: 'Invalid date. Use YYYY-MM-DD' },
      });
    }

    const summary = await daySummary(ymd);
    res.json(summary);
  } catch (err) {
    next(err);
  }
});

router.post('/entries', async (req, res, next) => {
  try {
    const { errors, value } = validateEntry(req.body);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    const doc = await Entry.create({
      ...value,
      createdAt: new Date(),
    });

    const date = todayYmdIST(doc.createdAt);
    const summary = await daySummary(date);

    res.status(201).json({
      entry: toEntryDto(doc),
      today: {
        date: summary.date,
        patientCount: summary.patientCount,
        totalAmount: summary.totalAmount,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.get('/entries/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ errors: { id: 'Invalid entry id' } });
    }
    const doc = await Entry.findById(req.params.id).lean();
    if (!doc) {
      return res.status(404).json({ errors: { id: 'Patient entry not found' } });
    }
    res.json({ entry: toEntryDto(doc) });
  } catch (err) {
    next(err);
  }
});

router.put('/entries/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ errors: { id: 'Invalid entry id' } });
    }

    const { errors, value } = validateEntry(req.body);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    const doc = await Entry.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return res.status(404).json({ errors: { id: 'Patient entry not found' } });
    }

    res.json({ entry: toEntryDto(doc) });
  } catch (err) {
    next(err);
  }
});

router.delete('/entries/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ errors: { id: 'Invalid entry id' } });
    }
    const doc = await Entry.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({ errors: { id: 'Patient entry not found' } });
    }
    res.json({ ok: true, id: String(doc._id) });
  } catch (err) {
    next(err);
  }
});

export default router;
