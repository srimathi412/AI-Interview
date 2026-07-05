import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiMail, FiZap } from 'react-icons/fi';
import { authAPI } from '../services';
import useToast from '../hooks/useToast';

const ForgotPasswordPage = () => {
  const { showToast, ToastComponent } = useToast();
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await authAPI.forgotPassword(data.email);
      setResetToken(res.data.resetToken);
      showToast('Reset token generated. Check below.', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to send reset link', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-4">
      {ToastComponent}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mx-auto mb-4">
            <FiZap className="text-white text-xl" />
          </div>
          <h1 className="text-2xl font-bold">Forgot Password</h1>
          <p className="text-text-muted text-sm mt-1">Enter your email to receive a reset token</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="glass-card space-y-5">
          <div>
            <label className="label-text">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input type="email" className="input-field pl-10" placeholder="you@example.com"
                {...register('email', { required: 'Email is required' })} />
            </div>
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Sending...' : 'Send Reset Token'}
          </button>
        </form>

        {resetToken && (
          <div className="glass-card mt-4">
            <p className="text-sm text-text-muted mb-2">Your reset token (valid for 1 hour):</p>
            <code className="text-accent text-xs break-all">{resetToken}</code>
            <Link to={`/reset-password?token=${resetToken}`} className="btn-accent w-full block text-center mt-4">
              Reset Password
            </Link>
          </div>
        )}

        <p className="text-center text-text-muted text-sm mt-6">
          <Link to="/login" className="text-primary hover:underline">Back to Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
