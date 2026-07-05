import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiBook, FiBriefcase, FiLock, FiUpload } from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { authAPI, resumeAPI } from '../services';
import useToast from '../hooks/useToast';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { showToast, ToastComponent } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { name: user?.name, college: user?.college, department: user?.department },
  });

  const onUpdateProfile = async (data) => {
    setLoading(true);
    try {
      const res = await authAPI.updateProfile(data);
      updateUser(res.data.user);
      showToast('Profile updated!', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Update failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const onChangePassword = async (e) => {
    e.preventDefault();
    const form = e.target;
    setLoading(true);
    try {
      await authAPI.changePassword({
        currentPassword: form.currentPassword.value,
        newPassword: form.newPassword.value,
      });
      showToast('Password changed!', 'success');
      form.reset();
    } catch (err) {
      showToast(err.response?.data?.message || 'Password change failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const onUploadResume = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('resume', file);
    setLoading(true);
    try {
      await resumeAPI.upload(formData);
      showToast('Resume uploaded!', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Upload failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {ToastComponent}
      <h1 className="text-2xl font-bold">Profile Settings</h1>

      <div className="flex gap-2">
        {['profile', 'password', 'resume'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
              activeTab === tab ? 'bg-primary/20 text-primary' : 'text-text-muted hover:bg-white/5'
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit(onUpdateProfile)} className="glass-card space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-2xl font-bold">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-lg">{user?.name}</p>
              <p className="text-text-muted text-sm">{user?.email}</p>
            </div>
          </div>

          {[
            { name: 'name', label: 'Full Name', icon: FiUser },
            { name: 'college', label: 'College', icon: FiBook },
            { name: 'department', label: 'Department', icon: FiBriefcase },
          ].map((field) => (
            <div key={field.name}>
              <label className="label-text">{field.label}</label>
              <div className="relative">
                <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input className="input-field pl-10" {...register(field.name, { required: field.name === 'name' ? 'Required' : false })} />
              </div>
            </div>
          ))}

          <div>
            <label className="label-text">Skills</label>
            <div className="flex flex-wrap gap-2">
              {(user?.skills || []).map((skill) => (
                <span key={skill} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">{skill}</span>
              ))}
              {!user?.skills?.length && <span className="text-text-muted text-sm">Upload resume to extract skills</span>}
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </motion.form>
      )}

      {activeTab === 'password' && (
        <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={onChangePassword} className="glass-card space-y-4">
          {['currentPassword', 'newPassword'].map((field) => (
            <div key={field}>
              <label className="label-text">{field === 'currentPassword' ? 'Current Password' : 'New Password'}</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input type="password" name={field} className="input-field pl-10" required minLength={6} />
              </div>
            </div>
          ))}
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Changing...' : 'Change Password'}
          </button>
        </motion.form>
      )}

      {activeTab === 'resume' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card">
          <p className="text-text-muted text-sm mb-4">Resume Status: {user?.resumeUrl ? '✅ Uploaded' : '❌ Not uploaded'}</p>
          <label className="btn-primary cursor-pointer inline-flex items-center gap-2">
            <FiUpload />
            Upload New Resume
            <input type="file" accept=".pdf,.docx,.doc" onChange={onUploadResume} className="hidden" />
          </label>
          <p className="text-text-muted text-xs mt-2">Supported: PDF, DOCX (max 5MB)</p>
        </motion.div>
      )}
    </div>
  );
};

export default ProfilePage;
