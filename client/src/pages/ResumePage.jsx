import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiFileText, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';
import { resumeAPI } from '../services';
import useToast from '../hooks/useToast';

const ResumePage = () => {
  const { showToast, ToastComponent } = useToast();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('resume', file);
    setLoading(true);
    try {
      await resumeAPI.upload(formData);
      showToast('Resume uploaded! Analyzing...', 'success');
      const { data } = await resumeAPI.analyze();
      setAnalysis(data.data);
      showToast('Analysis complete!', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Upload failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const { data } = await resumeAPI.analyze();
      setAnalysis(data.data);
      showToast('Analysis complete!', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Analysis failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {ToastComponent}
      <h1 className="text-2xl font-bold">Resume Analyzer</h1>

      <div className="glass-card">
        <div className="border-2 border-dashed border-white/10 rounded-xl p-12 text-center hover:border-primary/30 transition-colors">
          <FiUpload className="text-4xl text-primary mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Upload Your Resume</h3>
          <p className="text-text-muted text-sm mb-4">PDF or DOCX format, max 5MB</p>
          <label className="btn-primary cursor-pointer inline-flex items-center gap-2">
            <FiFileText />
            Choose File
            <input type="file" accept=".pdf,.docx,.doc" onChange={handleUpload} className="hidden" />
          </label>
        </div>
      </div>

      {!analysis && !loading && (
        <button onClick={handleAnalyze} className="btn-secondary">Analyze Existing Resume</button>
      )}

      {loading && <LoadingSpinner text="Analyzing resume with AI..." />}

      {analysis && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="glass-card text-center">
            <p className="text-text-muted text-sm mb-2">Resume Score</p>
            <div className="text-5xl font-bold text-primary">{analysis.resumeScore}%</div>
            <div className="w-full bg-white/10 rounded-full h-3 mt-4">
              <div className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all" style={{ width: `${analysis.resumeScore}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'Skills', items: analysis.skills, icon: FiCheckCircle, color: 'text-green-400' },
              { title: 'Projects', items: analysis.projects, icon: FiFileText, color: 'text-primary' },
              { title: 'Education', items: analysis.education, icon: FiCheckCircle, color: 'text-accent' },
              { title: 'Experience', items: analysis.experience, icon: FiCheckCircle, color: 'text-secondary' },
            ].map((section) => (
              <div key={section.title} className="glass-card">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <section.icon className={section.color} /> {section.title}
                </h3>
                <ul className="space-y-2">
                  {(section.items || []).map((item, i) => (
                    <li key={i} className="text-sm text-text-muted flex items-start gap-2">
                      <span className="text-primary mt-1">•</span> {item}
                    </li>
                  ))}
                  {!section.items?.length && <li className="text-text-muted text-sm">No data found</li>}
                </ul>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-yellow-400">
                <FiAlertCircle /> Missing Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {(analysis.missingSkills || []).map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-yellow-400/10 text-yellow-400 rounded-full text-sm">{skill}</span>
                ))}
              </div>
            </div>
            <div className="glass-card">
              <h3 className="font-semibold mb-3">Improvement Suggestions</h3>
              <ul className="space-y-2">
                {(analysis.suggestions || []).map((s, i) => (
                  <li key={i} className="text-sm text-text-muted">💡 {s}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ResumePage;
