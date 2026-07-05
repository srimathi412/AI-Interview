import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiHome, FiUser, FiFileText, FiMic, FiBarChart2, FiClock,
  FiAward, FiMessageCircle, FiTarget, FiLogOut, FiMenu, FiX, FiZap, FiShield,
} from 'react-icons/fi';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const candidateLinks = [
    { to: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { to: '/interview/setup', icon: FiMic, label: 'Start Interview' },
    { to: '/resume', icon: FiFileText, label: 'Resume Analyzer' },
    { to: '/history', icon: FiClock, label: 'History' },
    { to: '/analytics', icon: FiBarChart2, label: 'Analytics' },
    { to: '/career', icon: FiTarget, label: 'Career Advisor' },
    { to: '/leaderboard', icon: FiAward, label: 'Leaderboard' },
    { to: '/daily-challenge', icon: FiZap, label: 'Daily Challenge' },
    { to: '/chat', icon: FiMessageCircle, label: 'AI Assistant' },
    { to: '/profile', icon: FiUser, label: 'Profile' },
  ];

  const adminLinks = [
    { to: '/admin', icon: FiShield, label: 'Admin Dashboard' },
  ];

  const links = isAdmin ? adminLinks : candidateLinks;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <FiZap className="text-white text-sm" />
          </div>
          <div>
            <span className="font-bold">
              Interview<span className="text-primary">Ace</span>
            </span>
            <p className="text-xs text-text-muted">{isAdmin ? 'Admin Panel' : 'Candidate Portal'}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary/10 text-primary border-l-4 border-l-primary rounded-l-none pl-3 shadow-[0_0_15px_rgba(99,102,241,0.25)]'
                  : 'text-text-muted hover:text-text hover:bg-white/5'
              }`
            }
          >
            <link.icon className="text-lg" />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center text-sm font-bold">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-text-muted truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-400/10 transition-colors"
        >
          <FiLogOut />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 glass rounded-xl"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <FiX /> : <FiMenu />}
      </button>

      <aside className="hidden lg:flex w-64 flex-shrink-0 glass border-r border-white/5 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className="lg:hidden fixed inset-y-0 left-0 w-64 z-40 glass border-r border-white/5"
        >
          <SidebarContent />
        </motion.aside>
      )}
    </>
  );
};

export default Sidebar;
