import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';

const icons = {
  success: FiCheckCircle,
  error: FiAlertCircle,
  info: FiInfo,
};

const colors = {
  success: 'border-green-400/30 bg-green-400/10 text-green-400',
  error: 'border-red-400/30 bg-red-400/10 text-red-400',
  info: 'border-accent/30 bg-accent/10 text-accent',
};

const Toast = ({ message, type = 'info', onClose }) => {
  const Icon = icons[type];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, x: '-50%' }}
        animate={{ opacity: 1, y: 0, x: '-50%' }}
        exit={{ opacity: 0, y: -20, x: '-50%' }}
        className={`fixed top-4 left-1/2 z-[9999] flex items-center gap-3 px-5 py-3 rounded-xl border ${colors[type]} backdrop-blur-xl shadow-xl`}
      >
        <Icon className="text-lg flex-shrink-0" />
        <span className="text-sm font-medium text-text">{message}</span>
        <button onClick={onClose} className="ml-2 hover:opacity-70">
          <FiX />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default Toast;
