import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMic, FiFileText, FiBarChart2, FiUser, FiTrendingUp } from 'react-icons/fi';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { interviewAPI } from '../services';
import { formatDate, getScoreColor } from '../utils/helpers';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler);

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    interviewAPI.getDashboard()
      .then(({ data }) => setStats(data.stats))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;

  const quickActions = [
    { to: '/interview/setup', icon: FiMic, label: 'Start Interview', color: 'primary' },
    { to: '/resume', icon: FiFileText, label: 'Upload Resume', color: 'secondary' },
    { to: '/history', icon: FiBarChart2, label: 'View Reports', color: 'accent' },
    { to: '/profile', icon: FiUser, label: 'View Profile', color: 'green' },
  ];

  const barData = {
    labels: stats?.monthlyProgress?.map((m) => m.month) || [],
    datasets: [{
      label: 'Interviews',
      data: stats?.monthlyProgress?.map((m) => m.count) || [],
      backgroundColor: 'rgba(99, 102, 241, 0.5)',
      borderColor: '#6366F1',
      borderRadius: 8,
    }],
  };

  const lineData = {
    labels: stats?.scoreTrends?.map((s) => formatDate(s.date)) || [],
    datasets: [{
      label: 'Score Trend',
      data: stats?.scoreTrends?.map((s) => s.score) || [],
      borderColor: '#8B5CF6',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      pointBackgroundColor: '#06B6D4',
      pointBorderColor: '#06B6D4',
      pointHoverBackgroundColor: '#FFFFFF',
      pointHoverBorderColor: '#06B6D4',
      pointRadius: 6,
      pointHoverRadius: 8,
      fill: true,
      tension: 0.4,
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { labels: { color: '#94A3B8' } } },
    scales: {
      x: { ticks: { color: '#94A3B8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: '#94A3B8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
    },
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="glass-card bg-gradient-to-r from-primary/10 to-secondary/10 relative overflow-hidden">
          <h1 className="text-2xl md:text-3xl font-bold relative z-10">
            Welcome back,{' '}
            <span className="text-primary relative inline-block font-extrabold drop-shadow-[0_0_15px_rgba(99,102,241,0.8)]">
              {user?.name?.split(' ')[0]}
              <span className="absolute inset-0 bg-primary/15 blur-xl -z-10 rounded-full scale-150"></span>
            </span>! 👋
          </h1>
          <p className="text-text-muted mt-1 relative z-10">Ready to practice and improve your interview skills?</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Interviews" value={stats?.totalInterviews || 0} icon={FiMic} color="primary" delay={0.1} />
        <StatCard title="Average Score" value={`${stats?.averageScore || 0}%`} icon={FiTrendingUp} color="secondary" delay={0.2} />
        <StatCard title="Highest Score" value={`${stats?.highestScore || 0}%`} icon={FiBarChart2} color="accent" delay={0.3} />
        <StatCard title="Readiness Score" value={`${stats?.readinessScore || 0}%`} icon={FiTrendingUp} color="green" delay={0.4} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Link key={action.to} to={action.to} className="glass-card text-center hover:border-primary/30 group">
            <action.icon className="text-2xl text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">{action.label}</span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card">
          <h3 className="font-semibold mb-4">Monthly Progress</h3>
          <Bar data={barData} options={chartOptions} />
        </div>
        <div className="glass-card">
          <h3 className="font-semibold mb-4">Score Trends</h3>
          <Line data={lineData} options={chartOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card">
          <h3 className="font-semibold mb-4">Recent Interviews</h3>
          {stats?.recentInterviews?.length ? (
            <div className="space-y-3">
              {stats.recentInterviews.map((interview) => (
                <div key={interview._id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <div>
                    <p className="font-medium text-sm">{interview.domain}</p>
                    <p className="text-text-muted text-xs">{formatDate(interview.completedAt)}</p>
                  </div>
                  <span className={`font-bold ${getScoreColor(interview.score)}`}>{interview.score}%</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-muted text-sm">No interviews yet. Start your first one!</p>
          )}
        </div>

        <div className="glass-card">
          <h3 className="font-semibold mb-4">Recommended Topics</h3>
          <div className="flex flex-wrap gap-2">
            {(stats?.recommendedTopics || ['MERN', 'DSA', 'System Design', 'DBMS']).map((topic) => (
              <span key={topic} className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm border border-primary/20">
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
