import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost/Attendance-timetable-system/backend/api';

const SendNotification = () => {
  const [formData, setFormData] = useState({ title: '', message: '', type: 'info', target: 'all', broadcast_role: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [sending, setSending] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const payload = { action: 'send', title: formData.title, message: formData.message, type: formData.type };
      if (formData.target === 'all') payload.broadcast_all = true;
      else if (formData.target === 'role') payload.broadcast_role = formData.broadcast_role;
      
      const res = await axios.post(`${API_URL}/manage_notifications.php`, payload);
      if (res.data.status === 'success') {
        setMsg({ type: 'success', text: 'Notification sent successfully!' });
        setFormData({ title: '', message: '', type: 'info', target: 'all', broadcast_role: '' });
      }
    } catch (err) { setMsg({ type: 'error', text: 'Failed to send.' }); }
    setSending(false);
    setTimeout(() => setMsg({ type: '', text: '' }), 3000);
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden mt-2">
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 px-6 py-6 border-b border-rose-100/50">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-rose-600 shadow-md border border-rose-50">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Send Notification</h2>
            <p className="mt-1 text-slate-500 font-medium">Broadcast announcements to students and lecturers</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {msg.text && (
          <div className={`p-4 mb-6 rounded-xl font-semibold ${msg.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-green-50 text-green-800 border border-green-200'}`}>{msg.text}</div>
        )}
        
        <form onSubmit={handleSend} className="max-w-2xl space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
            <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-rose-500 outline-none" required placeholder="e.g. Important Announcement" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
            <textarea value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} rows="3" className="w-full px-4 py-2 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-rose-500 outline-none resize-none" required placeholder="Write your notification message..." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Type</label>
              <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-rose-500 outline-none">
                <option value="info">ℹ️ Information</option>
                <option value="warning">⚠️ Warning</option>
                <option value="success">✅ Success</option>
                <option value="alert">🚨 Alert</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Send To</label>
              <select value={formData.target} onChange={e => setFormData({ ...formData, target: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-rose-500 outline-none">
                <option value="all">📢 All Users</option>
                <option value="role">👥 Specific Role</option>
              </select>
            </div>
          </div>
          {formData.target === 'role' && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Select Role</label>
              <select value={formData.broadcast_role} onChange={e => setFormData({ ...formData, broadcast_role: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-rose-500 outline-none">
                <option value="">Select...</option>
                <option value="student">Students</option>
                <option value="lecturer">Lecturers</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          )}
          <button type="submit" disabled={sending} className="w-full py-2.5 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-500/30 disabled:opacity-50 flex items-center justify-center gap-2">
            {sending ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> Sending...</> : <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg> Send Notification</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendNotification;
