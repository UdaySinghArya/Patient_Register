import mongoose from 'mongoose';

export async function connectDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Missing MONGODB_URI. Set it in server/.env, e.g.');
    console.error('MONGODB_URI=mongodb://127.0.0.1:27017/patient_register');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log(`MongoDB connected: ${uri}`);
  } catch (err) {
    console.error('Could not connect to MongoDB. Is mongod running locally?');
    console.error(`Tried MONGODB_URI=${uri}`);
    console.error(err.message);
    process.exit(1);
  }
}
