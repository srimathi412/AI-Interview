import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTarget, FiBook, FiTrendingUp } from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';
import { extraAPI } from '../services';

const CareerPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    extraAPI.career()
      .then(({ data: res }) => setData(res.recommendations))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Analyzing your career profile..." />;
  if (!data) return <p className="text-text-muted">Unable to load recommendations</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">AI Career Advisor</h1>
      <p className="text-text-muted">Personalized recommendations based on your resume and interview performance</p>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card text-center bg-gradient-to-br from-accent/10 to-primary/10">
        <FiTrendingUp className="text-4xl text-accent mx-auto mb-3" />
        <p className="text-text-muted text-sm">Interview Readiness</p>
        <div className="text-5xl font-bold text-accent mt-2">{data.readinessPercentage}%</div>
        <div className="w-full bg-white/10 rounded-full h-3 mt-4 max-w-md mx-auto">
          <div className="bg-gradient-to-r from-accent to-primary h-3 rounded-full" style={{ width: `${data.readinessPercentage}%` }} />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><FiTarget className="text-primary" /> Suitable Roles</h3>
          <div className="space-y-3">
            {data.suitableRoles?.map((role) => (
              <div key={role} className="p-3 bg-primary/10 rounded-xl border border-primary/20 text-sm font-medium">{role}</div>
            ))}
          </div>
        </div>

        <div className="glass-card">
          <h3 className="font-semibold mb-4">Missing Skills</h3>
          <div className="flex flex-wrap gap-2">
            {data.missingSkills?.map((skill) => (
              <span key={skill} className="px-3 py-1.5 bg-yellow-400/10 text-yellow-400 rounded-full text-sm border border-yellow-400/20">{skill}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><FiBook className="text-secondary" /> Learning Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {data.learningResources?.map((resource) => (
            <div key={resource} className="p-4 bg-white/5 rounded-xl text-sm text-center">{resource}</div>
          ))}
        </div>
      </div>

      <div className="glass-card">
        <h3 className="font-semibold mb-4">Personalized Learning Plan</h3>
        <ol className="space-y-3">
          {data.personalizedPlan?.map((step, i) => (
            <li key={step} className="flex items-start gap-3">
              <span className="w-7 h-7 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
              <span className="text-sm text-text-muted pt-1">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default CareerPage;
