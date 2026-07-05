import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import path from 'path';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Interview from '../models/Interview.js';
import Report from '../models/Report.js';
import DailyChallenge from '../models/DailyChallenge.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB for seeding...');

    await User.deleteMany({});
    await Interview.deleteMany({});
    await Report.deleteMany({});
    await DailyChallenge.deleteMany({});

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@interviewace.ai',
      password: 'admin123',
      college: 'InterviewAce HQ',
      department: 'Administration',
      role: 'admin',
      skills: ['Management', 'Analytics'],
    });

    const candidates = await User.create([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        college: 'MIT',
        department: 'Computer Science',
        skills: ['React', 'Node.js', 'MongoDB', 'JavaScript'],
        resumeScore: 82,
        readinessScore: 75,
        resumeData: {
          skills: ['React', 'Node.js', 'MongoDB'],
          projects: ['E-commerce Platform', 'Chat Application'],
          education: ['B.Tech Computer Science - MIT'],
          experience: ['Intern at TechCorp'],
          technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
        },
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        college: 'Stanford',
        department: 'Software Engineering',
        skills: ['Python', 'Java', 'DSA', 'Machine Learning'],
        resumeScore: 88,
        readinessScore: 85,
        resumeData: {
          skills: ['Python', 'Java', 'Machine Learning'],
          projects: ['ML Prediction Model', 'Sorting Visualizer'],
          education: ['B.Tech Software Engineering - Stanford'],
          experience: ['Research Assistant'],
          technologies: ['Python', 'TensorFlow', 'Java'],
        },
      },
      {
        name: 'Alex Johnson',
        email: 'alex@example.com',
        password: 'password123',
        college: 'Berkeley',
        department: 'Information Technology',
        skills: ['MERN', 'AWS', 'Docker'],
        resumeScore: 79,
        readinessScore: 70,
      },
    ]);

    for (const candidate of candidates) {
      const interview = await Interview.create({
        userId: candidate._id,
        type: 'Technical',
        domain: 'MERN',
        difficulty: 'Medium',
        mode: 'Text',
        questionCount: 5,
        questions: [
          {
            question: 'Explain Virtual DOM in React.',
            answer: 'Virtual DOM is a lightweight copy of the actual DOM...',
            evaluation: {
              score: 78,
              communication: 8,
              technicalAccuracy: 7,
              confidence: 8,
              problemSolving: 7,
              completeness: 8,
              feedback: 'Good explanation with room for more depth.',
            },
          },
          {
            question: 'What is JWT Authentication?',
            answer: 'JWT is a token-based authentication mechanism...',
            evaluation: {
              score: 85,
              communication: 9,
              technicalAccuracy: 8,
              confidence: 8,
              problemSolving: 8,
              completeness: 9,
              feedback: 'Excellent understanding of JWT flow.',
            },
          },
        ],
        score: 82,
        duration: 1200,
        status: 'completed',
        completedAt: new Date(),
      });

      await Report.create({
        interviewId: interview._id,
        userId: candidate._id,
        overallScore: 82,
        performanceSummary: 'Strong performance with good technical knowledge.',
        strengths: ['Clear communication', 'Good technical foundation'],
        weaknesses: ['Could improve system design knowledge'],
        suggestions: ['Practice system design questions', 'Build more projects'],
        recommendedTopics: ['System Design', 'Microservices'],
        learningPath: ['Review React advanced patterns', 'Learn Docker', 'Practice DSA'],
      });
    }

    await DailyChallenge.create({
      date: new Date().toISOString().split('T')[0],
      question: 'Implement a function to detect a cycle in a linked list.',
      hint: 'Use Floyd\'s Tortoise and Hare algorithm.',
      solution: 'Use two pointers - slow moves one step, fast moves two steps. If they meet, there is a cycle.',
      domain: 'DSA',
      difficulty: 'Medium',
    });

    console.log('Seed data created successfully!');
    console.log('Admin: admin@interviewace.ai / admin123');
    console.log('Candidates: john@example.com, jane@example.com, alex@example.com / password123');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
