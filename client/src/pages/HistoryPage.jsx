import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiEye, FiDownload } from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';
import { interviewAPI } from '../services';
import { useAuth } from '../context/AuthContext';
import { formatDate, getScoreColor, generateReportPDF } from '../utils/helpers';

const HistoryPage = () => {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    interviewAPI.history()
      .then(({ data }) => setInterviews(data.interviews))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = async (id) => {
    try {
      const { data } = await interviewAPI.report(id);
      generateReportPDF(data.report, data.report.interviewId, user);
    } catch {
      alert('Failed to download report');
    }
  };

  if (loading) return <LoadingSpinner text="Loading history..." />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Interview History</h1>

      {interviews.length === 0 ? (
        <div className="glass-card text-center py-12">
          <p className="text-text-muted mb-4">No interviews completed yet</p>
          <Link to="/interview/setup" className="btn-primary">Start Your First Interview</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {interviews.map((interview, i) => (
            <motion.div
              key={interview._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-semibold">{interview.domain}</span>
                  <span className="px-2 py-0.5 bg-white/5 rounded text-xs text-text-muted">{interview.difficulty}</span>
                  <span className="px-2 py-0.5 bg-white/5 rounded text-xs text-text-muted">{interview.type}</span>
                </div>
                <p className="text-text-muted text-sm">
                  {formatDate(interview.completedAt || interview.createdAt)} • {Math.floor((interview.duration || 0) / 60)}m {(interview.duration || 0) % 60}s
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-2xl font-bold ${getScoreColor(interview.score)}`}>{interview.score}%</span>
                <Link to={`/report/${interview._id}`} className="btn-secondary text-sm py-2 px-4 flex items-center gap-2">
                  <FiEye /> View Report
                </Link>
                <button onClick={() => handleDownload(interview._id)} className="btn-accent text-sm py-2 px-4 flex items-center gap-2">
                  <FiDownload /> PDF
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
