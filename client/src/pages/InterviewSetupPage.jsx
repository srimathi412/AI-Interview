import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMic, FiType, FiPlay } from 'react-icons/fi';
import { interviewAPI } from '../services';
import useToast from '../hooks/useToast';
import LoadingSpinner from '../components/LoadingSpinner';

const InterviewSetupPage = () => {
  const navigate = useNavigate();
  const { showToast, ToastComponent } = useToast();
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({
    type: 'Technical',
    difficulty: 'Medium',
    domain: 'MERN',
    questionCount: 5,
    mode: 'Text',
  });

  const domains = ['Java', 'Python', 'MERN', 'DSA', 'DBMS', 'OS', 'CN', 'AI/ML'];
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const types = ['HR', 'Technical', 'Mixed'];
  const counts = [5, 10, 15];

  const handleStart = async () => {
    setLoading(true);
    try {
      const { data } = await interviewAPI.start(config);
      navigate('/interview/session', { state: { interview: data.interview, config } });
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to start interview', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Generating AI questions..." />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {ToastComponent}
      <h1 className="text-2xl font-bold">Interview Setup</h1>
      <p className="text-text-muted">Configure your mock interview session</p>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card space-y-6">
        <div>
          <label className="label-text">Interview Type</label>
          <div className="grid grid-cols-3 gap-3">
            {types.map((t) => (
              <button key={t} onClick={() => setConfig({ ...config, type: t })}
                className={`py-3 rounded-xl text-sm font-medium transition-all ${
                  config.type === t ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/5 text-text-muted hover:bg-white/10'
                }`}>{t}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="label-text">Difficulty</label>
          <div className="grid grid-cols-3 gap-3">
            {difficulties.map((d) => (
              <button key={d} onClick={() => setConfig({ ...config, difficulty: d })}
                className={`py-3 rounded-xl text-sm font-medium transition-all ${
                  config.difficulty === d ? 'bg-secondary/20 text-secondary border border-secondary/30' : 'bg-white/5 text-text-muted hover:bg-white/10'
                }`}>{d}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="label-text">Domain</label>
          <div className="grid grid-cols-4 gap-2">
            {domains.map((d) => (
              <button key={d} onClick={() => setConfig({ ...config, domain: d })}
                className={`py-2 rounded-xl text-xs font-medium transition-all ${
                  config.domain === d ? 'bg-accent/20 text-accent border border-accent/30' : 'bg-white/5 text-text-muted hover:bg-white/10'
                }`}>{d}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="label-text">Number of Questions</label>
          <div className="grid grid-cols-3 gap-3">
            {counts.map((c) => (
              <button key={c} onClick={() => setConfig({ ...config, questionCount: c })}
                className={`py-3 rounded-xl text-sm font-medium transition-all ${
                  config.questionCount === c ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/5 text-text-muted hover:bg-white/10'
                }`}>{c} Questions</button>
            ))}
          </div>
        </div>

        <div>
          <label className="label-text">Mode</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { mode: 'Text', icon: FiType, desc: 'Type your answers' },
              { mode: 'Voice', icon: FiMic, desc: 'Speak your answers' },
            ].map(({ mode, icon: Icon, desc }) => (
              <button key={mode} onClick={() => setConfig({ ...config, mode })}
                className={`p-4 rounded-xl text-left transition-all ${
                  config.mode === mode ? 'bg-primary/20 border border-primary/30' : 'bg-white/5 hover:bg-white/10'
                }`}>
                <Icon className="text-xl text-primary mb-2" />
                <p className="font-medium text-sm">{mode}</p>
                <p className="text-text-muted text-xs">{desc}</p>
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleStart} className="btn-primary w-full flex items-center justify-center gap-2 text-lg py-4">
          <FiPlay /> Start Interview
        </button>
      </motion.div>
    </div>
  );
};

export default InterviewSetupPage;
