# InterviewAce AI – Smart Interview Preparation Platform

**Practice Smarter. Crack Interviews Faster.**

**Live Demo**: [https://ai-interview-omega-three.vercel.app](https://ai-interview-omega-three.vercel.app)

InterviewAce AI is a production-ready MERN stack application that helps students and job seekers prepare for technical and HR interviews using AI-powered mock interviews, resume analysis, voice practice, and comprehensive analytics.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-6366F1)
![React](https://img.shields.io/badge/React-18-61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-20-339933)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248)

---

## Features

- **Authentication** – JWT-based signup/login, forgot/reset password, role-based access
- **Resume Analyzer** – Upload PDF/DOCX, AI-powered skill extraction and scoring
- **AI Mock Interviews** – Gemini/OpenAI generated questions by domain & difficulty
- **Voice Interviews** – Web Speech API speech-to-text
- **AI Evaluation** – Multi-criteria scoring with detailed feedback
- **PDF Reports** – Downloadable interview performance reports
- **Analytics Dashboard** – Charts, trends, readiness score
- **Career Advisor** – AI-powered role and learning recommendations
- **Leaderboard** – Top performers ranking
- **Daily Challenge** – One technical question per day
- **AI Chat Assistant** – Interview and career guidance chatbot
- **Admin Dashboard** – User management and platform analytics

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion, Chart.js, React Hook Form |
| Backend | Node.js, Express.js, Mongoose |
| Database | MongoDB Atlas |
| Auth | JWT, bcrypt |
| AI | Google Gemini API (primary), OpenAI API (fallback) |
| Deployment | Vercel (frontend), Render (backend) |

---

## Project Structure

```
InterviewAce/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route pages
│   │   ├── layouts/        # Layout wrappers
│   │   ├── context/        # Auth context
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   └── utils/          # Helpers
│   └── vercel.json
├── server/                 # Express backend
│   ├── config/             # DB, multer config
│   ├── controllers/        # Route controllers (MVC)
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── middlewares/        # Auth, validation, rate limiting
│   ├── services/           # AI & resume parsing services
│   ├── seeds/              # Database seed script
│   └── uploads/            # Resume file storage
├── postman/                # Postman collection
├── docker-compose.yml
└── README.md
```

---

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Google Gemini API key (or OpenAI API key)

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd "AI Interview"

# Install backend
cd server
npm install
cp .env.example .env
# Edit .env with your credentials

# Install frontend
cd ../client
npm install
cp .env.example .env
```

### 2. Configure Environment

**server/.env**
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/interviewace
JWT_SECRET=your_super_secret_key
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
PORT=5000
```

**client/.env**
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed Database (Optional)

```bash
cd server
npm run seed
```

**Seed credentials:**
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@interviewace.ai | admin123 |
| Candidate | john@example.com | password123 |

### 4. Run Development Servers

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

Open **http://localhost:5173**

---

## Docker Deployment

```bash
# Set environment variables in .env at project root
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

## Production Deployment

### Backend → Render

1. Push code to GitHub
2. Create new **Web Service** on [Render](https://render.com)
3. Connect repository, set root directory to `server`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add environment variables from `server/.env.example`
7. Deploy

### Frontend → Vercel

1. Import project on [Vercel](https://vercel.com)
2. Set root directory to `client`
3. Framework preset: **Vite**
4. Add environment variable:
   ```
   VITE_API_URL=https://your-render-app.onrender.com/api
   ```
5. Update `CLIENT_URL` on Render to your Vercel URL
6. Deploy

---

## API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete endpoint reference.

Import `postman/InterviewAce_AI.postman_collection.json` into Postman for testing.

---

## Testing Instructions

### Manual Testing Flow

1. **Register** a new account at `/register`
2. **Upload resume** at `/resume` (PDF or DOCX)
3. **Analyze resume** and review skills/score
4. **Start interview** at `/interview/setup` – select domain, difficulty, mode
5. **Answer questions** – use text or voice mode
6. **Evaluate answers** and **submit interview**
7. **View report** with scores, feedback, learning path
8. **Download PDF** from history page
9. Test **Career Advisor**, **Leaderboard**, **Daily Challenge**, **AI Chat**
10. Login as **admin** to test admin dashboard

### API Health Check

```bash
curl http://localhost:5000/api/health
```

---

## Security Features

- JWT authentication with protected routes
- bcrypt password hashing (12 rounds)
- Helmet security headers
- CORS configuration
- Rate limiting (API, auth, AI endpoints)
- Input validation (express-validator)
- Environment variable secrets
- XSS protection via React escaping

---

## User Roles

| Feature | Candidate | Admin |
|---------|-----------|-------|
| Mock Interviews | ✅ | ❌ |
| Resume Analysis | ✅ | ❌ |
| Analytics | ✅ | ❌ |
| View All Users | ❌ | ✅ |
| Platform Stats | ❌ | ✅ |
| Delete Users | ❌ | ✅ |

---

## License

MIT License – free for educational and portfolio use.

---

## Author

Built for software engineering placement interviews and portfolio showcase.

**InterviewAce AI** – *Practice Smarter. Crack Interviews Faster.*
