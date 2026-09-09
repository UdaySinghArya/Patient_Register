import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDb } from './db.js';
import { Entry } from './models/Entry.js';
import { addDaysYmd, istDateTime, todayYmdIST } from './utils/dates.js';

const today = todayYmdIST();
const yesterday = addDaysYmd(today, -1);

const rows = [
  {
    patientName: 'Ramesh Kumar',
    address: 'Near bus stand, Ward 4',
    medicines: 'Amoxicillin 250mg (10 cap), Crocin 500 (10 tab)',
    amount: 180,
    createdAt: istDateTime(today, 15, 10),
  },
  {
    patientName: 'Fatima Bano',
    address: 'Gandhi Nagar, House 12',
    medicines: 'ORS (2 pkt), Zinc 20mg (10 tab), Metrogyl 400 (6 tab)',
    amount: 210,
    createdAt: istDateTime(today, 11, 40),
  },
  {
    patientName: 'Anita Devi',
    address: 'Ward 2 lane, Near temple',
    medicines: 'Paracetamol 500mg (10 tab), ORS (1 pkt)',
    amount: 120,
    createdAt: istDateTime(today, 9, 20),
  },
  {
    patientName: 'Suresh Patil',
    address: 'Old Bazaar Chowk',
    medicines: 'Pantoprazole 40mg (10 tab), Domperidone 10mg (10 tab), Calpol',
    amount: 340,
    createdAt: istDateTime(today, 13, 15),
  },
  {
    patientName: 'Meena Kumari',
    address: 'Station Road, Qtr 14',
    medicines: 'Cetirizine 10mg (10 tab), Vitamin C chewable (10 tab)',
    amount: 160,
    createdAt: istDateTime(today, 14, 45),
  },
  {
    patientName: 'Arjun Reddy',
    address: 'Collectorate Road',
    medicines: 'Azithromycin 500mg (3 tab), Cough syrup 100ml',
    amount: 275.5,
    createdAt: istDateTime(today, 16, 5),
  },
  {
    patientName: 'Mohan Lal',
    address: 'Village Kheda, Main road',
    medicines: 'Diclofenac 50mg (10 tab), Omeprazole 20mg (10 cap)',
    amount: 195,
    createdAt: istDateTime(yesterday, 10, 5),
  },
  {
    patientName: 'Sunita Sharma',
    address: 'Civil Lines, Lane 3',
    medicines: 'Iron folic acid (30 tab), Calcium 500 (30 tab)',
    amount: 220,
    createdAt: istDateTime(yesterday, 11, 20),
  },
  {
    patientName: 'Abdul Karim',
    address: 'Jama Masjid gali',
    medicines: 'Amoxicillin 500mg (6 cap), Ibuprofen 400 (10 tab)',
    amount: 250,
    createdAt: istDateTime(yesterday, 12, 40),
  },
  {
    patientName: 'Pushpa Devi',
    address: 'Near PHC, Block A',
    medicines: 'ORS (3 pkt), Paracetamol 250 syrup',
    amount: 90,
    createdAt: istDateTime(yesterday, 9, 15),
  },
  {
    patientName: 'Vikram Singh',
    address: 'Railway colony, Qtr 7',
    medicines: 'Losartan 50mg (10 tab), Amlodipine 5mg (10 tab)',
    amount: 310,
    createdAt: istDateTime(yesterday, 15, 50),
  },
  {
    patientName: 'Geeta Bai',
    address: 'Market yard, Shop 2 rear',
    medicines: 'Metformin 500mg (10 tab), Glimepiride 1mg (10 tab)',
    amount: 285,
    createdAt: istDateTime(yesterday, 17, 10),
  },
];

await connectDb();
await Entry.deleteMany({});
await Entry.insertMany(rows);
console.log(`Seeded ${rows.length} entries (today IST ${today}, yesterday ${yesterday}).`);
await mongoose.disconnect();
process.exit(0);
