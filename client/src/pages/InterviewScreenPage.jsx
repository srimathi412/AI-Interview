import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiMic, FiMicOff, FiSend } from 'react-icons/fi';
import { interviewAPI } from '../services';
import useTimer from '../hooks/useTimer';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import useToast from '../hooks/useToast';
import LoadingSpinner from '../components/LoadingSpinner';

const InterviewScreenPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast, ToastComponent } = useToast();
  const interview = location.state?.interview;
  const config = location.state?.config;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [evaluating, setEvaluating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { seconds, start, formatted } = useTimer(0, true);
  const { transcript, isListening, isSupported, startListening, stopListening, setTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (!interview) navigate('/interview/setup');
    start();
  }, [interview, navigate, start]);

  useEffect(() => {
    if (config?.mode === 'Voice' && transcript) {
      setAnswers((prev) => ({ ...prev, [currentIndex]: transcript.trim() }));
    }
  }, [transcript, currentIndex, config?.mode]);

  const questions = interview?.questions || [];
  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleAnswerChange = (value) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: value }));
  };

  const autoSave = useCallback(async (index, answer) => {
    if (!answer) return;
    try {
      await interviewAPI.save({ interviewId: interview._id, questionIndex: index, answer });
    } catch { /* silent auto-save */ }
  }, [interview?._id]);

  const evaluateCurrent = async () => {
    const answer = answers[currentIndex];
    if (!answer?.trim()) {
      showToast('Please provide an answer first', 'error');
      return;
    }
    setEvaluating(true);
    try {
      await interviewAPI.evaluate({
        interviewId: interview._id,
        questionIndex: currentIndex,
        answer,
      });
      showToast('Answer evaluated!', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Evaluation failed', 'error');
    } finally {
      setEvaluating(false);
    }
  };

  const handleNext = async () => {
    await autoSave(currentIndex, answers[currentIndex]);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      if (config?.mode === 'Voice') setTranscript(answers[currentIndex + 1] || '');
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      if (config?.mode === 'Voice') setTranscript(answers[currentIndex - 1] || '');
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const answer = answers[currentIndex];
      if (answer?.trim()) {
        await interviewAPI.evaluate({
          interviewId: interview._id,
          questionIndex: currentIndex,
          answer,
        });
      }
      const { data } = await interviewAPI.submit({ interviewId: interview._id, duration: seconds });
      navigate(`/report/${interview._id}`, { state: { report: data.report, interview: data.interview } });
    } catch (err) {
      showToast(err.response?.data?.message || 'Submit failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!interview) return <LoadingSpinner />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {ToastComponent}

      <div className="flex items-center justify-between">
        <div>
          <span className="text-primary text-sm font-medium">{config?.domain} • {config?.difficulty}</span>
          <h1 className="text-xl font-bold">Mock Interview</h1>
        </div>
        <div className="text-right">
          <p className="text-text-muted text-xs">Timer</p>
          <p className="text-2xl font-mono font-bold text-accent">{formatted}</p>
        </div>
      </div>

      <div className="w-full bg-white/10 rounded-full h-2">
        <motion.div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full" animate={{ width: `${progress}%` }} />
      </div>
      <p className="text-text-muted text-sm">Question {currentIndex + 1} of {questions.length}</p>

      <motion.div key={currentIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card">
        <p className="text-lg font-medium leading-relaxed">{currentQuestion?.question}</p>
      </motion.div>

      <div className="glass-card space-y-4">
        <label className="label-text">Your Answer</label>
        {config?.mode === 'Voice' && isSupported && (
          <div className="flex gap-3">
            <button onClick={isListening ? stopListening : startListening}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${
                isListening ? 'bg-red-400/20 text-red-400 border border-red-400/30' : 'bg-primary/20 text-primary border border-primary/30'
              }`}>
              {isListening ? <FiMicOff /> : <FiMic />}
              {isListening ? 'Stop Recording' : 'Start Recording'}
            </button>
            {isListening && <span className="text-red-400 text-sm animate-pulse">● Recording...</span>}
          </div>
        )}
        <textarea
          value={answers[currentIndex] || ''}
          onChange={(e) => handleAnswerChange(e.target.value)}
          rows={6}
          className="input-field resize-none"
          placeholder="Type your answer here..."
        />
      </div>

      <div className="flex flex-wrap gap-3 justify-between">
        <button onClick={handlePrev} disabled={currentIndex === 0} className="btn-secondary flex items-center gap-2">
          <FiChevronLeft /> Previous
        </button>

        <div className="flex gap-3">
          <button onClick={evaluateCurrent} disabled={evaluating} className="btn-accent flex items-center gap-2">
            {evaluating ? 'Evaluating...' : 'Evaluate Answer'}
          </button>

          {currentIndex < questions.length - 1 ? (
            <button onClick={handleNext} className="btn-primary flex items-center gap-2">
              Next <FiChevronRight />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting} className="btn-primary flex items-center gap-2">
              <FiSend /> {submitting ? 'Submitting...' : 'Submit Interview'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewScreenPage;
