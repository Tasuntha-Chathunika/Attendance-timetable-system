import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost/Attendance-timetable-system/backend/api';

const NotificationPanel = ({ user, isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) fetchNotifications();
  }, [isOpen]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/get_notifications.php?user_id=${user.id}`);
      if (res.data.status === 'success') {
        setNotifications(res.data.data.notifications);
        setUnreadCount(res.data.data.unread_count);
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const markAsRead = async (notifId) => {
    try {
      await axios.post(`${API_URL}/manage_notifications.php`, { action: 'mark_read', notification_id: notifId });
      setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, is_read: 1 } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) { console.error(err); }
  };

  const markAllRead = async () => {
    try {
      await axios.post(`${API_URL}/manage_notifications.php`, { action: 'mark_read', user_id: user.id, mark_all: true });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
      setUnreadCount(0);
    } catch (err) { console.error(err); }
  };

  const deleteNotif = async (notifId) => {
    try {
      await axios.post(`${API_URL}/manage_notifications.php`, { action: 'delete', notification_id: notifId });
      setNotifications(prev => prev.filter(n => n.id !== notifId));
    } catch (err) { console.error(err); }
  };

  const getTypeStyles = (type) => {
    switch (type) {
      case 'warning': return { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-500', dot: 'bg-amber-500' };
      case 'success': return { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'text-emerald-500', dot: 'bg-emerald-500' };
      case 'alert': return { bg: 'bg-rose-50', border: 'border-rose-200', icon: 'text-rose-500', dot: 'bg-rose-500' };
      default: return { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-500', dot: 'bg-blue-500' };
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'warning': return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>;
      case 'success': return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
      case 'alert': return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
      default: return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
    }
  };

  const timeAgo = (dateStr) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col h-full animate-slide-in-right z-10">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50">
          <div>
            <h3 className="text-xl font-extrabold text-slate-800">Notifications</h3>
            {unreadCount > 0 && <p className="text-sm text-indigo-600 font-semibold mt-0.5">{unreadCount} unread</p>}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors">Mark all read</button>
            )}
            <button onClick={onClose} className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : notifications.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {notifications.map(notif => {
                const styles = getTypeStyles(notif.type);
                return (
                  <div key={notif.id} className={`px-6 py-4 transition-colors hover:bg-slate-50/50 ${notif.is_read == 0 ? 'bg-indigo-50/30' : ''}`}>
                    <div className="flex gap-3">
                      <div className={`w-10 h-10 rounded-xl ${styles.bg} border ${styles.border} flex items-center justify-center ${styles.icon} shrink-0 mt-0.5`}>
                        {getTypeIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-bold text-sm text-slate-800 flex items-center gap-2">
                              {notif.title}
                              {notif.is_read == 0 && <span className={`w-2 h-2 rounded-full ${styles.dot}`}></span>}
                            </p>
                            <p className="text-sm text-slate-500 mt-1 leading-relaxed">{notif.message}</p>
                            <p className="text-xs text-slate-400 mt-2 font-medium">{timeAgo(notif.created_at)}</p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {notif.is_read == 0 && (
                              <button onClick={() => markAsRead(notif.id)} className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors" title="Mark as read">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                              </button>
                            )}
                            <button onClick={() => deleteNotif(notif.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors" title="Delete">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
              </div>
              <p className="text-lg font-bold text-slate-600">All caught up!</p>
              <p className="text-sm text-slate-400 mt-1">No notifications yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;
