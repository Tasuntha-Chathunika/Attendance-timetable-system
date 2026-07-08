import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost/Attendance-timetable-system/backend/api';

const ProfileManagement = ({ user, onProfileUpdate }) => {
  const [activeSection, setActiveSection] = useState('profile');
  const [formData, setFormData] = useState({
    full_name: user.full_name || '',
    email: user.email || '',
    username: user.username || ''
  });
  const [passwordData, setPasswordData] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await axios.post(`${API_URL}/update_profile.php`, { user_id: user.id, ...formData });
      if (res.data.status === 'success') {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        if (onProfileUpdate && res.data.user) {
          const updatedUser = { ...user, ...res.data.user };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          onProfileUpdate(updatedUser);
        }
      } else {
        setMessage({ type: 'error', text: res.data.message });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
    }
    setSaving(false);
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (passwordData.new_password.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }
    setSaving(true);
    try {
      const res = await axios.post(`${API_URL}/change_password.php`, {
        user_id: user.id,
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });
      if (res.data.status === 'success') {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
      } else {
        setMessage({ type: 'error', text: res.data.message });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to change password.' });
    }
    setSaving(false);
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const getRoleColor = () => {
    switch (user.role) {
      case 'admin': return { bg: 'bg-indigo-500', light: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' };
      case 'lecturer': return { bg: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' };
      default: return { bg: 'bg-purple-500', light: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' };
    }
  };

  const colors = getRoleColor();

  return (
    <div className="space-y-6">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        {/* Profile Header Card */}
        <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 pb-16 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full -ml-24 -mb-24"></div>
          </div>
          <div className="relative z-10 flex items-center gap-6">
            <img 
              src={`https://ui-avatars.com/api/?name=${user.full_name}&background=${colors.bg.replace('bg-', '').replace('-500', '')}&color=fff&bold=true&size=128`}
              alt={user.full_name}
              className="w-16 h-16 rounded-xl border-4 border-white/20 shadow-xl"
            />
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">{user.full_name}</h2>
              <p className="text-white/70 text-sm font-medium">@{user.username}</p>
              <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${colors.light} ${colors.text}`}>
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 -mt-6 relative z-10">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-1.5 inline-flex gap-1.5">
            <button onClick={() => setActiveSection('profile')} className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeSection === 'profile' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30' : 'text-slate-600 hover:bg-slate-50'}`}>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                Edit Profile
              </span>
            </button>
            <button onClick={() => setActiveSection('security')} className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeSection === 'security' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30' : 'text-slate-600 hover:bg-slate-50'}`}>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                Change Password
              </span>
            </button>
          </div>
        </div>

        <div className="p-6 pt-5">
          {/* Alert Message */}
          {message.text && (
            <div className={`p-4 mb-6 rounded-xl flex items-center gap-3 shadow-md border backdrop-blur-md animate-fade-in-up ${message.type === 'error' ? 'bg-red-50 text-red-800 border-red-200' : 'bg-green-50 text-green-800 border-green-200'}`}>
              {message.type === 'success' ? (
                <svg className="w-5 h-5 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
              ) : (
                <svg className="w-5 h-5 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
              )}
              <span className="font-semibold text-sm">{message.text}</span>
            </div>
          )}

          {activeSection === 'profile' ? (
            <form onSubmit={handleProfileUpdate} className="max-w-lg space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                <input type="text" value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-slate-700 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Username</label>
                <input type="text" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-slate-700 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-slate-700 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" required />
              </div>
              <button type="submit" disabled={saving} className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/30 disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
                {saving ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> Saving...</> : <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Save Changes</>}
              </button>
            </form>
          ) : (
            <form onSubmit={handlePasswordChange} className="max-w-lg space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Current Password</label>
                <input type="password" value={passwordData.current_password} onChange={e => setPasswordData({ ...passwordData, current_password: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-slate-700 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">New Password</label>
                <input type="password" value={passwordData.new_password} onChange={e => setPasswordData({ ...passwordData, new_password: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-slate-700 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Confirm New Password</label>
                <input type="password" value={passwordData.confirm_password} onChange={e => setPasswordData({ ...passwordData, confirm_password: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-slate-700 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" required />
              </div>
              <button type="submit" disabled={saving} className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/30 disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
                {saving ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> Updating...</> : <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg> Update Password</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileManagement;
