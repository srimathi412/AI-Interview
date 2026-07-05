import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const listUsers = async () => {
  await connectDB();
  const users = await User.find({}, 'name email role');
  console.log('\n=== LIST OF REGISTERED USERS ===');
  users.forEach((user, idx) => {
    console.log(`${idx + 1}. Name: ${user.name} | Email: ${user.email} | Role: ${user.role}`);
  });
  console.log('================================\n');
  await mongoose.connection.close();
  process.exit(0);
};

listUsers().catch((err) => {
  console.error('Error listing users:', err.message);
  process.exit(1);
});
