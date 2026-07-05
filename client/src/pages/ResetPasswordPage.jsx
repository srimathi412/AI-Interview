import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiLock, FiZap } from 'react-icons/fi';
import { authAPI } from '../services';
import useToast from '../hooks/useToast';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast, ToastComponent } = useToast();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: { token: searchParams.get('token') || '' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authAPI.resetPassword({ token: data.token, newPassword: data.newPassword });
      showToast('Password reset successful!', 'success');
      navigate('/login');
    } catch (err) {
      showToast(err.response?.data?.message || 'Reset failed', 'error');
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
          <h1 className="text-2xl font-bold">Reset Password</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="glass-card space-y-4">
          <div>
            <label className="label-text">Reset Token</label>
            <input className="input-field" {...register('token', { required: 'Token is required' })} />
            {errors.token && <p className="text-red-400 text-xs mt-1">{errors.token.message}</p>}
          </div>
          <div>
            <label className="label-text">New Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input type="password" className="input-field pl-10"
                {...register('newPassword', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })} />
            </div>
            {errors.newPassword && <p className="text-red-400 text-xs mt-1">{errors.newPassword.message}</p>}
          </div>
          <div>
            <label className="label-text">Confirm Password</label>
            <input type="password" className="input-field"
              {...register('confirmPassword', { validate: (v) => v === watch('newPassword') || 'Passwords do not match' })} />
            {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <p className="text-center text-text-muted text-sm mt-6">
          <Link to="/login" className="text-primary hover:underline">Back to Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
