import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, RadialLinearScale, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import LoadingSpinner from '../components/LoadingSpinner';
import StatCard from '../components/StatCard';
import { FiTrendingUp, FiMic, FiAward } from 'react-icons/fi';
import { interviewAPI } from '../services';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, RadialLinearScale, ArcElement, Title, Tooltip, Legend, Filler);

const AnalyticsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    interviewAPI.getDashboard()
      .then(({ data }) => setStats(data.stats))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Loading analytics..." />;

  const chartOptions = {
    responsive: true,
    plugins: { legend: { labels: { color: '#94A3B8' } } },
    scales: {
      x: { ticks: { color: '#94A3B8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: '#94A3B8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
    },
  };

  const doughnutData = {
    labels: ['Completed', 'Remaining Goal'],
    datasets: [{
      data: [stats?.totalInterviews || 0, Math.max(0, 20 - (stats?.totalInterviews || 0))],
      backgroundColor: ['#6366F1', 'rgba(255,255,255,0.1)'],
      borderWidth: 0,
    }],
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Performance Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Interviews" value={stats?.totalInterviews || 0} icon={FiMic} color="primary" />
        <StatCard title="Average Score" value={`${stats?.averageScore || 0}%`} icon={FiTrendingUp} color="secondary" />
        <StatCard title="Readiness Score" value={`${stats?.readinessScore || 0}%`} icon={FiAward} color="accent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card">
          <h3 className="font-semibold mb-4">Monthly Progress</h3>
          <Bar data={{
            labels: stats?.monthlyProgress?.map((m) => m.month) || [],
            datasets: [
              { label: 'Interviews', data: stats?.monthlyProgress?.map((m) => m.count) || [], backgroundColor: 'rgba(99,102,241,0.5)', borderRadius: 8 },
              { label: 'Avg Score', data: stats?.monthlyProgress?.map((m) => m.avgScore) || [], backgroundColor: 'rgba(6,182,212,0.5)', borderRadius: 8 },
            ],
          }} options={chartOptions} />
        </div>
        <div className="glass-card">
          <h3 className="font-semibold mb-4">Score Trends</h3>
          <Line data={{
            labels: stats?.scoreTrends?.map((s) => new Date(s.date).toLocaleDateString()) || [],
            datasets: [{
              label: 'Score',
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
          }} options={chartOptions} />
        </div>
      </div>

      <div className="glass-card max-w-sm">
        <h3 className="font-semibold mb-4">Interview Goal Progress</h3>
        <Doughnut data={doughnutData} options={{ plugins: { legend: { labels: { color: '#94A3B8' } } } }} />
        <p className="text-center text-text-muted text-sm mt-4">Goal: 20 interviews</p>
      </div>
    </div>
  );
};

export default AnalyticsPage;
