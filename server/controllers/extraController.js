import ChatSession from '../models/ChatSession.js';
import DailyChallenge from '../models/DailyChallenge.js';
import User from '../models/User.js';
import Interview from '../models/Interview.js';
import { chatAssistant, generateDailyChallenge, generateCareerRecommendations } from '../services/aiService.js';

export const sendChatMessage = async (req, res) => {
  try {
    const { message } = req.body;
    let session = await ChatSession.findOne({ userId: req.user._id });

    if (!session) {
      session = await ChatSession.create({ userId: req.user._id, messages: [] });
    }

    session.messages.push({ role: 'user', content: message });

    let response;
    try {
      response = await chatAssistant(message, session.messages.slice(-10));
    } catch {
      response =
        'I can help you with interview preparation, career guidance, and technical concepts. Please configure your AI API key for full functionality.';
    }

    session.messages.push({ role: 'assistant', content: response });
    await session.save();

    res.json({ success: true, response, messages: session.messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const session = await ChatSession.findOne({ userId: req.user._id });
    res.json({ success: true, messages: session?.messages || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDailyChallenge = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    let challenge = await DailyChallenge.findOne({ date: today });

    if (!challenge) {
      let data;
      try {
        data = await generateDailyChallenge();
      } catch {
        data = {
          question: 'Explain the difference between stack and queue with real-world examples.',
          hint: 'Think about LIFO vs FIFO ordering.',
          solution:
            'A stack follows Last-In-First-Out (LIFO) - like a stack of plates. A queue follows First-In-First-Out (FIFO) - like a line at a ticket counter.',
          domain: 'DSA',
          difficulty: 'Medium',
        };
      }
      challenge = await DailyChallenge.create({ date: today, ...data });
    }

    res.json({ success: true, challenge });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCareerRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const interviews = await Interview.find({ userId: user._id, status: 'completed' });

    const userData = {
      skills: user.skills,
      resumeData: user.resumeData,
      resumeScore: user.resumeScore,
      interviewScores: interviews.map((i) => ({ domain: i.domain, score: i.score })),
      readinessScore: user.readinessScore,
    };

    let recommendations;
    try {
      recommendations = await generateCareerRecommendations(userData);
    } catch {
      recommendations = {
        suitableRoles: ['Full Stack Developer', 'Backend Developer', 'Frontend Developer'],
        missingSkills: user.missingSkills.length ? user.missingSkills : ['System Design', 'DevOps'],
        learningResources: ['freeCodeCamp', 'LeetCode', 'MDN Web Docs'],
        readinessPercentage: user.readinessScore || 50,
        personalizedPlan: [
          'Complete 2 mock interviews per week',
          'Build a portfolio project',
          'Review core CS fundamentals',
        ],
      };
    }

    res.json({ success: true, recommendations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({ role: 'candidate' }).select('name readinessScore');
    const interviewCounts = await Interview.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: '$userId', count: { $sum: 1 }, avgScore: { $avg: '$score' } } },
    ]);

    const countMap = {};
    interviewCounts.forEach((ic) => {
      countMap[ic._id.toString()] = { count: ic.count, avgScore: Math.round(ic.avgScore) };
    });

    const leaderboard = users
      .map((u) => ({
        name: u.name,
        score: countMap[u._id.toString()]?.avgScore || u.readinessScore || 0,
        interviewsCompleted: countMap[u._id.toString()]?.count || 0,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    res.json({ success: true, leaderboard });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
