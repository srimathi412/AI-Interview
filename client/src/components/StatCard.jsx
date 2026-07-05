import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const StatCard = ({ title, value, icon: Icon, trend, color = 'primary', delay = 0 }) => {
  const colorClasses = {
    primary: 'from-primary/20 to-primary/5 border-primary/20 text-primary',
    secondary: 'from-secondary/20 to-secondary/5 border-secondary/20 text-secondary',
    accent: 'from-accent/20 to-accent/5 border-accent/20 text-accent',
    green: 'from-green-400/20 to-green-400/5 border-green-400/20 text-green-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`stat-card bg-gradient-to-br ${colorClasses[color]} border`}
    >
      <div className="flex items-center justify-between">
        <span className="text-text-muted text-sm font-medium">{title}</span>
        {Icon && <Icon className={`text-xl ${colorClasses[color].split(' ').pop()}`} />}
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-text">{value}</span>
        {trend !== undefined && (
          <span className={`flex items-center text-xs mb-1 ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
