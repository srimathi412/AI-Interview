import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiMic, FiTrendingUp, FiActivity, FiTrash2 } from 'react-icons/fi';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { adminAPI } from '../services';
import useToast from '../hooks/useToast';
import { formatDate, getScoreColor } from '../utils/helpers';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const AdminDashboardPage = () => {
  const { showToast, ToastComponent } = useToast();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    Promise.all([adminAPI.getStats(), adminAPI.getUsers(), adminAPI.getInterviews()])
      .then(([statsRes, usersRes, interviewsRes]) => {
        setStats(statsRes.data.stats);
        setUsers(usersRes.data.users);
        setInterviews(interviewsRes.data.interviews);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDeleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await adminAPI.deleteUser(id);
      setUsers(users.filter((u) => u._id !== id));
      showToast('User deleted', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete failed', 'error');
    }
  };

  if (loading) return <LoadingSpinner text="Loading admin dashboard..." />;

  const chartOptions = {
    responsive: true,
    plugins: { legend: { labels: { color: '#94A3B8' } } },
    scales: {
      x: { ticks: { color: '#94A3B8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: '#94A3B8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
    },
  };

  return (
    <div className="space-y-6">
      {ToastComponent}
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="flex gap-2">
        {['overview', 'users', 'interviews'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize ${
              activeTab === tab ? 'bg-primary/20 text-primary' : 'text-text-muted hover:bg-white/5'
            }`}>{tab}</button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Users" value={stats?.totalUsers || 0} icon={FiUsers} color="primary" />
            <StatCard title="Total Interviews" value={stats?.totalInterviews || 0} icon={FiMic} color="secondary" />
            <StatCard title="Average Score" value={`${stats?.averageScore || 0}%`} icon={FiTrendingUp} color="accent" />
            <StatCard title="Active Users" value={stats?.activeUsers || 0} icon={FiActivity} color="green" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card">
              <h3 className="font-semibold mb-4">User Growth</h3>
              <Bar data={{
                labels: stats?.userGrowth?.map((u) => u.month) || [],
                datasets: [{ label: 'New Users', data: stats?.userGrowth?.map((u) => u.count) || [], backgroundColor: 'rgba(99,102,241,0.5)', borderRadius: 8 }],
              }} options={chartOptions} />
            </div>
            <div className="glass-card">
              <h3 className="font-semibold mb-4">Interviews Per Day</h3>
              <Line data={{
                labels: stats?.interviewsPerDay?.map((d) => d.date) || [],
                datasets: [{
                  label: 'Interviews',
                  data: stats?.interviewsPerDay?.map((d) => d.count) || [],
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
              }} options={chartOptions} />
            </div>
          </div>

          <div className="glass-card">
            <h3 className="font-semibold mb-4">Score Distribution</h3>
            <Bar data={{
              labels: stats?.scoreDistribution?.map((s) => s.range) || [],
              datasets: [{ label: 'Count', data: stats?.scoreDistribution?.map((s) => s.count) || [], backgroundColor: 'rgba(139,92,246,0.5)', borderRadius: 8 }],
            }} options={chartOptions} />
          </div>
        </>
      )}

      {activeTab === 'users' && (
        <div className="space-y-3">
          {users.map((user) => (
            <motion.div key={user._id} className="glass-card flex items-center justify-between">
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-text-muted text-sm">{user.email} • {user.college}</p>
              </div>
              <button onClick={() => handleDeleteUser(user._id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors">
                <FiTrash2 />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'interviews' && (
        <div className="space-y-3">
          {interviews.map((interview) => (
            <div key={interview._id} className="glass-card flex items-center justify-between">
              <div>
                <p className="font-semibold">{interview.userId?.name || 'Unknown'}</p>
                <p className="text-text-muted text-sm">{interview.domain} • {interview.difficulty} • {formatDate(interview.completedAt)}</p>
              </div>
              <span className={`font-bold ${getScoreColor(interview.score)}`}>{interview.score}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
