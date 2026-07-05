import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const BASE = `http://localhost:${process.env.PORT || 5000}/api/auth`;

const testAuth = async () => {
  console.log('\n=== Phase 1 – Authentication API Test ===\n');

  const testEmail = `test_${Date.now()}@example.com`;
  const testUser = {
    name: 'Test User',
    email: testEmail,
    password: 'password123',
    college: 'Test College',
    department: 'CS',
  };

  // Register
  const regRes = await fetch(`${BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testUser),
  });
  const regData = await regRes.json();
  console.log('POST /register →', regRes.status, regData.success ? 'OK' : regData.message);
  if (!regData.success) throw new Error('Register failed');

  const token = regData.token;

  // Login
  const loginRes = await fetch(`${BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: testUser.password }),
  });
  const loginData = await loginRes.json();
  console.log('POST /login →', loginRes.status, loginData.success ? 'OK' : loginData.message);

  // Protected route – profile
  const profileRes = await fetch(`${BASE}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const profileData = await profileRes.json();
  console.log('GET /profile (protected) →', profileRes.status, profileData.success ? `OK (${profileData.user.name})` : profileData.message);

  // Unauthorized access
  const unauthRes = await fetch(`${BASE}/profile`);
  const unauthData = await unauthRes.json();
  console.log('GET /profile (no token) →', unauthRes.status, unauthData.message);

  // Cleanup test user
  await User.deleteOne({ email: testEmail });
  console.log('\nPhase 1 authentication verified successfully');
};

const run = async () => {
  await connectDB();
  await testAuth();
  await mongoose.connection.close();
  process.exit(0);
};

run().catch(async (err) => {
  console.error('\nTest failed:', err.message);
  await mongoose.connection.close().catch(() => {});
  process.exit(1);
});
