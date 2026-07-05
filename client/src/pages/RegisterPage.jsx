import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiBook, FiBriefcase, FiZap } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import useToast from '../hooks/useToast';

const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const { showToast, ToastComponent } = useToast();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser(data);
      showToast('Account created successfully!', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.response?.data?.message || 'Registration failed', 'error');
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
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-text-muted text-sm mt-1">Start your interview preparation journey</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="glass-card space-y-4">
          {[
            { name: 'name', label: 'Full Name', icon: FiUser, rules: { required: 'Name is required' } },
            { name: 'email', label: 'Email', icon: FiMail, type: 'email', rules: { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } } },
            { name: 'password', label: 'Password', icon: FiLock, type: 'password', rules: { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } } },
            { name: 'college', label: 'College', icon: FiBook, rules: {} },
            { name: 'department', label: 'Department', icon: FiBriefcase, rules: {} },
          ].map((field) => (
            <div key={field.name}>
              <label className="label-text">{field.label}</label>
              <div className="relative">
                <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type={field.type || 'text'}
                  className="input-field pl-10"
                  {...register(field.name, field.rules)}
                />
              </div>
              {errors[field.name] && <p className="text-red-400 text-xs mt-1">{errors[field.name].message}</p>}
            </div>
          ))}

          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-text-muted text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
