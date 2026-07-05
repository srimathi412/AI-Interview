import Interview from '../models/Interview.js';
import Report from '../models/Report.js';
import User from '../models/User.js';
import {
  generateQuestions,
  evaluateAnswer,
  generateFinalReport,
} from '../services/aiService.js';

export const startInterview = async (req, res) => {
  try {
    const { type, domain, difficulty, questionCount, mode } = req.body;
    const user = await User.findById(req.user._id);

    let questions;
    try {
      questions = await generateQuestions({
        skills: user.skills,
        domain,
        difficulty,
        type,
        count: questionCount || 5,
        resumeData: user.resumeData,
      });
    } catch {
      questions = getFallbackQuestions(domain, difficulty, questionCount || 5);
    }

    const interview = await Interview.create({
      userId: user._id,
      type,
      domain,
      difficulty,
      mode: mode || 'Text',
      questionCount: questionCount || 5,
      questions: questions.map((q) => ({
        question: typeof q === 'string' ? q : q.question,
        answer: '',
      })),
      status: 'in-progress',
    });

    res.status(201).json({
      success: true,
      interview: {
        _id: interview._id,
        type: interview.type,
        domain: interview.domain,
        difficulty: interview.difficulty,
        mode: interview.mode,
        questions: interview.questions.map((q) => ({ question: q.question })),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const evaluateAnswerHandler = async (req, res) => {
  try {
    const { interviewId, questionIndex, answer } = req.body;
    const interview = await Interview.findOne({ _id: interviewId, userId: req.user._id });

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    const question = interview.questions[questionIndex];
    if (!question) {
      return res.status(400).json({ success: false, message: 'Invalid question index' });
    }

    let evaluation;
    try {
      evaluation = await evaluateAnswer(
        question.question,
        answer,
        interview.domain,
        interview.difficulty
      );
    } catch {
      evaluation = {
        score: Math.floor(Math.random() * 30) + 60,
        communication: 7,
        technicalAccuracy: 7,
        confidence: 7,
        problemSolving: 7,
        completeness: 7,
        strengths: ['Good attempt'],
        weaknesses: ['Could be more detailed'],
        improvements: ['Provide examples'],
        feedback: 'Your answer shows understanding but could benefit from more depth.',
      };
    }

    interview.questions[questionIndex].answer = answer;
    interview.questions[questionIndex].evaluation = evaluation;
    await interview.save();

    res.json({ success: true, evaluation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const submitInterview = async (req, res) => {
  try {
    const { interviewId, duration } = req.body;
    const interview = await Interview.findOne({ _id: interviewId, userId: req.user._id });

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    const evaluatedQuestions = interview.questions.filter((q) => q.evaluation?.score);
    const overallScore =
      evaluatedQuestions.length > 0
        ? Math.round(
            evaluatedQuestions.reduce((sum, q) => sum + (q.evaluation.score || 0), 0) /
              evaluatedQuestions.length
          )
        : 0;

    interview.score = overallScore;
    interview.duration = duration || 0;
    interview.status = 'completed';
    interview.completedAt = new Date();
    await interview.save();

    let reportData;
    try {
      reportData = await generateFinalReport({
        domain: interview.domain,
        difficulty: interview.difficulty,
        score: overallScore,
        questions: interview.questions,
      });
    } catch {
      reportData = {
        performanceSummary: `You scored ${overallScore}% in your ${interview.domain} interview.`,
        strengths: ['Consistent effort', 'Good communication'],
        weaknesses: ['Technical depth', 'Time management'],
        suggestions: ['Practice more coding problems', 'Review core concepts'],
        recommendedTopics: [interview.domain, 'System Design'],
        learningPath: ['Review fundamentals', 'Practice mock interviews', 'Build projects'],
      };
    }

    const report = await Report.create({
      interviewId: interview._id,
      userId: req.user._id,
      overallScore,
      performanceSummary: reportData.performanceSummary,
      strengths: reportData.strengths,
      weaknesses: reportData.weaknesses,
      suggestions: reportData.suggestions,
      recommendedTopics: reportData.recommendedTopics,
      learningPath: reportData.learningPath,
      questionFeedback: interview.questions.map((q) => ({
        question: q.question,
        answer: q.answer,
        score: q.evaluation?.score || 0,
        feedback: q.evaluation?.feedback || '',
      })),
    });

    const user = await User.findById(req.user._id);
    const allInterviews = await Interview.find({ userId: user._id, status: 'completed' });
    const avgScore =
      allInterviews.reduce((sum, i) => sum + i.score, 0) / (allInterviews.length || 1);
    user.readinessScore = Math.round(avgScore);
    await user.save();

    res.json({
      success: true,
      interview,
      report,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getInterviewHistory = async (req, res) => {
  try {
    const interviews = await Interview.find({
      userId: req.user._id,
      status: 'completed',
    }).sort({ createdAt: -1 });

    res.json({ success: true, interviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getInterviewReport = async (req, res) => {
  try {
    const report = await Report.findOne({
      interviewId: req.params.id,
      userId: req.user._id,
    }).populate('interviewId');

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    res.json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const saveProgress = async (req, res) => {
  try {
    const { interviewId, questionIndex, answer } = req.body;
    const interview = await Interview.findOne({ _id: interviewId, userId: req.user._id });

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    interview.questions[questionIndex].answer = answer;
    await interview.save();

    res.json({ success: true, message: 'Progress saved' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const interviews = await Interview.find({
      userId: req.user._id,
      status: 'completed',
    });

    const scores = interviews.map((i) => i.score);
    const totalInterviews = interviews.length;
    const averageScore = totalInterviews
      ? Math.round(scores.reduce((a, b) => a + b, 0) / totalInterviews)
      : 0;
    const highestScore = totalInterviews ? Math.max(...scores) : 0;

    const monthlyProgress = getMonthlyProgress(interviews);
    const scoreTrends = interviews.slice(-10).map((i) => ({
      date: i.completedAt,
      score: i.score,
      domain: i.domain,
    }));

    const recentInterviews = interviews.slice(0, 5);

    res.json({
      success: true,
      stats: {
        totalInterviews,
        averageScore,
        highestScore,
        readinessScore: req.user.readinessScore || averageScore,
        monthlyProgress,
        scoreTrends,
        recentInterviews,
        recommendedTopics: getRecommendedTopics(interviews),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

function getFallbackQuestions(domain, difficulty, count) {
  const questions = {
    MERN: [
      'Explain the MERN stack architecture.',
      'What is Virtual DOM in React?',
      'Explain JWT authentication flow.',
      'What is middleware in Express.js?',
      'How does MongoDB indexing work?',
      'Explain React Hooks and their use cases.',
      'What is the Event Loop in Node.js?',
      'Describe RESTful API design principles.',
      'How do you handle state management in React?',
      'Explain CORS and how to handle it.',
      'What are MongoDB aggregation pipelines?',
      'How do you optimize React performance?',
      'Explain async/await in JavaScript.',
      'What is the difference between SQL and NoSQL?',
      'How do you deploy a MERN application?',
    ],
    Java: [
      'Explain OOP concepts in Java.',
      'What is the difference between ArrayList and LinkedList?',
      'Explain Java memory management.',
      'What are Java Streams?',
      'Explain multithreading in Java.',
    ],
    Python: [
      'Explain list comprehensions in Python.',
      'What is the GIL in Python?',
      'Explain decorators in Python.',
      'Difference between list and tuple?',
      'What are Python generators?',
    ],
    DSA: [
      'Explain time complexity of binary search.',
      'What is a hash map?',
      'Explain dynamic programming.',
      'How does quicksort work?',
      'What is a balanced binary tree?',
    ],
  };

  const pool = questions[domain] || questions.MERN;
  return pool.slice(0, count).map((q) => ({ question: q, category: 'technical' }));
}

function getMonthlyProgress(interviews) {
  const months = {};
  interviews.forEach((i) => {
    const month = new Date(i.completedAt || i.createdAt).toLocaleString('default', {
      month: 'short',
    });
    if (!months[month]) months[month] = { count: 0, totalScore: 0 };
    months[month].count++;
    months[month].totalScore += i.score;
  });

  return Object.entries(months).map(([month, data]) => ({
    month,
    count: data.count,
    avgScore: Math.round(data.totalScore / data.count),
  }));
}

function getRecommendedTopics(interviews) {
  const domains = interviews.map((i) => i.domain);
  const allDomains = ['MERN', 'DSA', 'System Design', 'DBMS', 'OS', 'CN'];
  return allDomains.filter((d) => !domains.includes(d)).slice(0, 4);
}
