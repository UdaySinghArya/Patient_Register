import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema(
  {
    patientName: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    medicines: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now, index: true },
  },
  { versionKey: false }
);

entrySchema.index({ createdAt: -1 });

export function toEntryDto(doc) {
  const row = typeof doc.toObject === 'function' ? doc.toObject() : doc;
  return {
    id: String(row._id),
    patientName: row.patientName,
    address: row.address,
    medicines: row.medicines,
    amount: row.amount,
    createdAt: row.createdAt,
  };
}

export const Entry = mongoose.model('Entry', entrySchema);
