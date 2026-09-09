import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    role: { type: String, required: true, enum: ['Chemist', 'Doctor'] },
    name: { type: String, required: true, trim: true },
  },
  { versionKey: false }
);

export function toUserDto(doc) {
  const row = typeof doc.toObject === 'function' ? doc.toObject() : doc;
  return {
    id: String(row._id),
    email: row.email,
    role: row.role,
    name: row.name,
  };
}

export const User = mongoose.model('User', userSchema);
