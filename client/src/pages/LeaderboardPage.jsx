import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiMic } from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';
import { extraAPI } from '../services';
import { getScoreColor } from '../utils/helpers';

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    extraAPI.leaderboard()
      .then(({ data }) => setLeaderboard(data.leaderboard))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Loading leaderboard..." />;

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center">
        <FiAward className="text-4xl text-yellow-400 mx-auto mb-2" />
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <p className="text-text-muted text-sm">Top performers on InterviewAce AI</p>
      </div>

      <div className="space-y-3">
        {leaderboard.map((entry, i) => (
          <motion.div
            key={entry.name + i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`glass-card flex items-center gap-4 ${i < 3 ? 'border-yellow-400/20' : ''}`}
          >
            <span className="text-2xl w-10 text-center">{medals[i] || `#${i + 1}`}</span>
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center font-bold">
              {entry.name?.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="font-semibold">{entry.name}</p>
              <p className="text-text-muted text-xs flex items-center gap-1"><FiMic className="text-xs" /> {entry.interviewsCompleted} interviews</p>
            </div>
            <span className={`text-xl font-bold ${getScoreColor(entry.score)}`}>{entry.score}%</span>
          </motion.div>
        ))}
        {!leaderboard.length && <p className="text-text-muted text-center">No data yet. Complete interviews to appear on the leaderboard!</p>}
      </div>
    </div>
  );
};

export default LeaderboardPage;
