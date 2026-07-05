import api from './api';

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

export const resumeAPI = {
  upload: (formData) =>
    api.post('/resume/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  analyze: (text) => api.post('/resume/analyze', { text }),
  get: () => api.get('/resume/me'),
};

export const interviewAPI = {
  getDashboard: () => api.get('/interview/dashboard'),
  start: (data) => api.post('/interview/start', data),
  evaluate: (data) => api.post('/interview/evaluate', data),
  submit: (data) => api.post('/interview/submit', data),
  save: (data) => api.post('/interview/save', data),
  history: () => api.get('/interview/history'),
  report: (id) => api.get(`/interview/report/${id}`),
};

export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  deleteUser: (id) => api.delete(`/admin/user/${id}`),
  getStats: () => api.get('/admin/stats'),
  getInterviews: () => api.get('/admin/interviews'),
};

export const extraAPI = {
  chat: (message) => api.post('/chat', { message }),
  chatHistory: () => api.get('/chat/history'),
  dailyChallenge: () => api.get('/daily-challenge'),
  career: () => api.get('/career'),
  leaderboard: () => api.get('/leaderboard'),
};
