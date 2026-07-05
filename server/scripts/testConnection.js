import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const testConnection = async () => {
  console.log('=== InterviewAce AI – MongoDB Connection Test ===\n');
  console.log('SRV URI:', process.env.MONGODB_URI?.replace(/:[^:@]+@/, ':****@'));
  console.log('Direct fallback:', process.env.MONGODB_URI_DIRECT ? 'configured' : 'not set');
  console.log('');

  await connectDB();

  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log(`Collections (${collections.length}):`, collections.map((c) => c.name).join(', ') || 'none yet');

  const userCount = await User.countDocuments();
  console.log(`Users in database: ${userCount}`);

  console.log('\nMongoDB connection verified successfully');
  await mongoose.connection.close();
  process.exit(0);
};

testConnection().catch((err) => {
  console.error('\nConnection test failed:', err.message);
  process.exit(1);
});
