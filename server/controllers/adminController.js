import User from '../models/User.js';
import Interview from '../models/Interview.js';
import Report from '../models/Report.js';

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'candidate' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Cannot delete admin' });
    }

    await Interview.deleteMany({ userId: user._id });
    await Report.deleteMany({ userId: user._id });
    await user.deleteOne();

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'candidate' });
    const totalInterviews = await Interview.countDocuments({ status: 'completed' });
    const interviews = await Interview.find({ status: 'completed' });
    const averageScore = interviews.length
      ? Math.round(interviews.reduce((s, i) => s + i.score, 0) / interviews.length)
      : 0;

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const activeUsers = await User.countDocuments({ lastActive: { $gte: thirtyDaysAgo } });

    const userGrowth = await getUserGrowth();
    const interviewsPerDay = await getInterviewsPerDay();
    const scoreDistribution = getScoreDistribution(interviews);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalInterviews,
        averageScore,
        activeUsers,
        userGrowth,
        interviewsPerDay,
        scoreDistribution,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ status: 'completed' })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ success: true, interviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

async function getUserGrowth() {
  const users = await User.find({ role: 'candidate' }).select('createdAt');
  const months = {};
  users.forEach((u) => {
    const month = new Date(u.createdAt).toLocaleString('default', { month: 'short', year: '2-digit' });
    months[month] = (months[month] || 0) + 1;
  });
  return Object.entries(months).map(([month, count]) => ({ month, count }));
}

async function getInterviewsPerDay() {
  const interviews = await Interview.find({ status: 'completed' }).select('completedAt');
  const days = {};
  interviews.forEach((i) => {
    const day = new Date(i.completedAt || i.createdAt).toLocaleDateString();
    days[day] = (days[day] || 0) + 1;
  });
  return Object.entries(days)
    .slice(-14)
    .map(([date, count]) => ({ date, count }));
}

function getScoreDistribution(interviews) {
  const ranges = { '0-20': 0, '21-40': 0, '41-60': 0, '61-80': 0, '81-100': 0 };
  interviews.forEach((i) => {
    if (i.score <= 20) ranges['0-20']++;
    else if (i.score <= 40) ranges['21-40']++;
    else if (i.score <= 60) ranges['41-60']++;
    else if (i.score <= 80) ranges['61-80']++;
    else ranges['81-100']++;
  });
  return Object.entries(ranges).map(([range, count]) => ({ range, count }));
}
