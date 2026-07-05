import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiZap, FiEye, FiEyeOff } from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';
import { extraAPI } from '../services';

const DailyChallengePage = () => {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    extraAPI.dailyChallenge()
      .then(({ data }) => setChallenge(data.challenge))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Loading today's challenge..." />;
  if (!challenge) return <p className="text-text-muted">No challenge available</p>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <FiZap className="text-4xl text-yellow-400 mx-auto mb-2" />
        <h1 className="text-2xl font-bold">Daily Challenge</h1>
        <p className="text-text-muted text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card space-y-6">
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs">{challenge.domain}</span>
          <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs">{challenge.difficulty}</span>
        </div>

        <div>
          <h3 className="text-text-muted text-sm mb-2">Question</h3>
          <p className="text-lg font-medium leading-relaxed">{challenge.question}</p>
        </div>

        <div>
          <button onClick={() => setShowHint(!showHint)} className="btn-secondary text-sm flex items-center gap-2">
            {showHint ? <FiEyeOff /> : <FiEye />} {showHint ? 'Hide Hint' : 'Show Hint'}
          </button>
          {showHint && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 p-4 bg-accent/10 rounded-xl border border-accent/20">
              <p className="text-sm text-accent">💡 {challenge.hint}</p>
            </motion.div>
          )}
        </div>

        <div>
          <button onClick={() => setShowSolution(!showSolution)} className="btn-accent text-sm flex items-center gap-2">
            {showSolution ? <FiEyeOff /> : <FiEye />} {showSolution ? 'Hide Solution' : 'Show Solution'}
          </button>
          {showSolution && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 p-4 bg-green-400/10 rounded-xl border border-green-400/20">
              <p className="text-sm text-green-400">{challenge.solution}</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DailyChallengePage;
