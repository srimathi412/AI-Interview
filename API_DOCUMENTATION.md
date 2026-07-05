# InterviewAce AI – API Documentation

Base URL: `http://localhost:5000/api` (development)

All protected routes require header: `Authorization: Bearer <token>`

---

## Authentication

### POST /auth/register
Register a new candidate account.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "college": "MIT",
  "department": "Computer Science"
}
```

**Response:** `{ success, token, user }`

---

### POST /auth/login
**Body:** `{ "email", "password" }`

**Response:** `{ success, token, user }`

---

### POST /auth/forgot-password
**Body:** `{ "email" }`

**Response:** `{ success, resetToken }` (dev mode returns token directly)

---

### POST /auth/reset-password
**Body:** `{ "token", "newPassword" }`

---

### GET /auth/profile
🔒 Returns current user profile.

---

### PUT /auth/profile
🔒 **Body:** `{ name, college, department, skills }`

---

### PUT /auth/change-password
🔒 **Body:** `{ currentPassword, newPassword }`

---

## Resume

### POST /resume/upload
🔒 Upload resume file (multipart/form-data, field: `resume`)

Supported: PDF, DOCX (max 5MB)

---

### POST /resume/analyze
🔒 AI-powered resume analysis.

**Optional Body:** `{ "text": "resume text" }`

**Response:**
```json
{
  "success": true,
  "data": {
    "skills": [],
    "projects": [],
    "education": [],
    "experience": [],
    "resumeScore": 85,
    "missingSkills": [],
    "suggestions": []
  }
}
```

---

### GET /resume/:id
🔒 Get resume data for current user.

---

## Interview

### GET /interview/dashboard
🔒 Dashboard statistics and charts data.

**Response:**
```json
{
  "stats": {
    "totalInterviews": 5,
    "averageScore": 78,
    "highestScore": 92,
    "readinessScore": 80,
    "monthlyProgress": [],
    "scoreTrends": [],
    "recentInterviews": [],
    "recommendedTopics": []
  }
}
```

---

### POST /interview/start
🔒 Start a new mock interview.

**Body:**
```json
{
  "type": "Technical",
  "domain": "MERN",
  "difficulty": "Medium",
  "questionCount": 5,
  "mode": "Text"
}
```

**Domains:** Java, Python, MERN, DSA, DBMS, OS, CN, AI/ML  
**Types:** HR, Technical, Mixed  
**Difficulty:** Easy, Medium, Hard  
**Mode:** Text, Voice

---

### POST /interview/evaluate
🔒 Evaluate a single answer with AI.

**Body:**
```json
{
  "interviewId": "mongodb_id",
  "questionIndex": 0,
  "answer": "Your answer text"
}
```

**Response:**
```json
{
  "evaluation": {
    "score": 85,
    "communication": 8,
    "technicalAccuracy": 9,
    "confidence": 7,
    "problemSolving": 8,
    "completeness": 8,
    "strengths": [],
    "weaknesses": [],
    "improvements": [],
    "feedback": "Detailed feedback"
  }
}
```

---

### POST /interview/save
🔒 Auto-save answer progress.

**Body:** `{ interviewId, questionIndex, answer }`

---

### POST /interview/submit
🔒 Submit completed interview and generate report.

**Body:** `{ interviewId, duration }` (duration in seconds)

---

### GET /interview/history
🔒 List completed interviews.

---

### GET /interview/report/:id
🔒 Get detailed report for an interview.

---

## Admin (Admin role required)

### GET /admin/users
List all candidate users.

---

### DELETE /admin/user/:id
Delete a user and their data.

---

### GET /admin/stats
Platform analytics: user growth, interviews per day, score distribution.

---

### GET /admin/interviews
List recent completed interviews with user info.

---

## Extra Features

### POST /chat
🔒 AI chat assistant.

**Body:** `{ "message": "Your question" }`

---

### GET /chat/history
🔒 Get chat message history.

---

### GET /daily-challenge
🔒 Get today's daily challenge question.

---

### GET /career
🔒 AI career recommendations based on profile and scores.

---

### GET /leaderboard
🔒 Top 20 users by average score.

---

## Health Check

### GET /health
```json
{ "success": true, "message": "InterviewAce AI API is running" }
```

---

## Error Responses

```json
{
  "success": false,
  "message": "Error description",
  "errors": []
}
```

| Status | Meaning |
|--------|---------|
| 400 | Validation error |
| 401 | Unauthorized |
| 403 | Forbidden (admin required) |
| 404 | Not found |
| 429 | Rate limit exceeded |
| 500 | Server error |

---

## Rate Limits

| Endpoint Group | Limit |
|---------------|-------|
| General API | 100 req / 15 min |
| Auth | 10 req / 15 min |
| AI endpoints | 20 req / 1 min |
