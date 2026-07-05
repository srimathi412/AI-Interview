import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import { apiLimiter } from './middlewares/rateLimiter.js';
import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import extraRoutes from './routes/extraRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Trust proxy for production environment behind reverse proxies like Render
app.set('trust proxy', 1);

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// Normalize CORS origin to handle trailing slashes robustly in production
const allowedOrigin = process.env.CLIENT_URL 
  ? process.env.CLIENT_URL.replace(/\/$/, "") 
  : 'http://localhost:5173';

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', apiLimiter);

// Root route to handle standard homepage requests and prevent "Cannot GET /"
app.get('/', (req, res) => {
  res.json({ message: 'InterviewAce AI API is running' });
});

// Production health endpoint for deployment services (e.g., Render)
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'InterviewAce AI API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', extraRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`InterviewAce AI Server running on port ${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\nPort ${PORT} is already in use.`);
      console.error(`Stop the other process:  npx kill-port ${PORT}`);
      console.error(`Or on Windows:  netstat -ano | findstr :${PORT}  then  taskkill /PID <pid> /F\n`);
    } else {
      console.error('Server error:', err.message);
    }
    process.exit(1);
  });
};

startServer().catch((err) => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});

// Trigger nodemon restart after resolving EADDRINUSE
export default app;

