import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiDownload, FiArrowLeft, FiCheck, FiX } from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';
import { interviewAPI } from '../services';
import { useAuth } from '../context/AuthContext';
import { generateReportPDF, getScoreColor, getScoreBg } from '../utils/helpers';

const ReportPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const [report, setReport] = useState(location.state?.report || null);
  const [interview, setInterview] = useState(location.state?.interview || null);
  const [loading, setLoading] = useState(!report);

  useEffect(() => {
    if (!report) {
      interviewAPI.report(id)
        .then(({ data }) => {
          setReport(data.report);
          setInterview(data.report.interviewId);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id, report]);

  const handleDownload = () => generateReportPDF(report, interview, user);

  if (loading) return <LoadingSpinner text="Loading report..." />;
  if (!report) return <p className="text-text-muted">Report not found</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/history" className="flex items-center gap-2 text-text-muted hover:text-text text-sm">
          <FiArrowLeft /> Back to History
        </Link>
        <button onClick={handleDownload} className="btn-primary flex items-center gap-2">
          <FiDownload /> Download PDF
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card text-center bg-gradient-to-br from-primary/10 to-secondary/10">
        <p className="text-text-muted text-sm mb-2">Overall Score</p>
        <div className={`text-6xl font-bold ${getScoreColor(report.overallScore)}`}>{report.overallScore}%</div>
        <p className="text-text-muted mt-4 max-w-lg mx-auto">{report.performanceSummary}</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card">
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-green-400"><FiCheck /> Strengths</h3>
          <ul className="space-y-2">{report.strengths?.map((s) => <li key={s} className="text-sm text-text-muted">• {s}</li>)}</ul>
        </div>
        <div className="glass-card">
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-red-400"><FiX /> Weaknesses</h3>
          <ul className="space-y-2">{report.weaknesses?.map((w) => <li key={w} className="text-sm text-text-muted">• {w}</li>)}</ul>
        </div>
      </div>

      <div className="glass-card">
        <h3 className="font-semibold mb-3">Improvement Areas</h3>
        <ul className="space-y-2">{report.suggestions?.map((s) => <li key={s} className="text-sm text-text-muted">💡 {s}</li>)}</ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card">
          <h3 className="font-semibold mb-3">Recommended Topics</h3>
          <div className="flex flex-wrap gap-2">
            {report.recommendedTopics?.map((t) => (
              <span key={t} className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">{t}</span>
            ))}
          </div>
        </div>
        <div className="glass-card">
          <h3 className="font-semibold mb-3">Learning Path</h3>
          <ol className="space-y-2">
            {report.learningPath?.map((step, i) => (
              <li key={step} className="text-sm text-text-muted">{i + 1}. {step}</li>
            ))}
          </ol>
        </div>
      </div>

      {report.questionFeedback?.length > 0 && (
        <div className="glass-card">
          <h3 className="font-semibold mb-4">Question-wise Feedback</h3>
          <div className="space-y-4">
            {report.questionFeedback.map((qf, i) => (
              <div key={i} className={`p-4 rounded-xl border ${getScoreBg(qf.score)}`}>
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium text-sm">Q{i + 1}: {qf.question}</p>
                  <span className={`font-bold ${getScoreColor(qf.score)}`}>{qf.score}%</span>
                </div>
                <p className="text-text-muted text-xs mb-2">Your answer: {qf.answer?.substring(0, 200)}...</p>
                <p className="text-sm">{qf.feedback}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportPage;
