import { User } from '../models/User.js';

export async function ensureClinicUsers() {
  try {
    await User.collection.dropIndex('phone_1');
  } catch {
    // old phone unique index may not exist
  }

  const chemistEmail = (process.env.CHEMIST_EMAIL || 'chemist-wali@gmail.com').trim().toLowerCase();
  const doctorEmail = (process.env.DOCTOR_EMAIL || 'doctor-wali@gmail.com').trim().toLowerCase();

  const rows = [
    { email: chemistEmail, role: 'Chemist', name: 'Clinic chemist' },
    { email: doctorEmail, role: 'Doctor', name: 'Clinic doctor' },
  ];

  for (const row of rows) {
    await User.updateOne({ email: row.email }, { $set: row }, { upsert: true });
  }

  console.log(`Clinic users ready: ${rows.map((row) => row.email).join(', ')}`);
}
