import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ManageUsers from '../components/ManageUsers';
import ManageCourses from '../components/ManageCourses';
import TimetableManagement from '../components/TimetableManagement';
import AttendanceReports from '../components/AttendanceReports';
import NotificationPanel from '../components/NotificationPanel';
import ProfileManagement from '../components/ProfileManagement';
import ManageRooms from '../components/ManageRooms';
import AcademicCalendar from '../components/AcademicCalendar';
import AuditLog from '../components/AuditLog';
import SendNotification from '../components/SendNotification';
import ManageEnrollments from '../components/ManageEnrollments';

const API_URL = 'http://localhost/Attendance-timetable-system/backend/api';

const AdminDashboard = ({ user: initialUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(initialUser);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [stats, setStats] = useState(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    fetchUnreadCount();
    if (activeTab === 'dashboard') fetchStats();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [activeTab]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const fetchUnreadCount = async () => {
    try {
      const res = await axios.get(`${API_URL}/get_notifications.php?user_id=${user.id}`);
      if (res.data.status === 'success') setUnreadCount(res.data.data.unread_count);
    } catch (err) { /* silent */ }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/get_dashboard_stats.php`);
      if (res.data.status === 'success') setStats(res.data.data);
    } catch (err) { console.error(err); }
  };

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg> },
    { type: 'divider', label: 'Management' },
    { id: 'users', label: 'User Directory', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg> },
    { id: 'courses', label: 'Course Catalog', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg> },
    { id: 'timetable', label: 'Timetable Setup', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> },
    { id: 'rooms', label: 'Room Management', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg> },
    { id: 'enrollments', label: 'Enrollment Requests', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg> },
    { type: 'divider', label: 'Analytics' },
    { id: 'reports', label: 'Attendance Reports', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg> },
    { id: 'calendar', label: 'Academic Calendar', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> },
    { type: 'divider', label: 'System' },
    { id: 'notifications', label: 'Send Notification', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg> },
    { id: 'audit', label: 'Audit Log', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg> },
    { id: 'profile', label: 'My Profile', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg> },
  ];

  return (
    <div className={`h-screen overflow-hidden flex transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-slate-50'}`}>
      {/* Sidebar */}
      <aside className={`w-72 flex flex-col shadow-2xl z-20 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-gray-900 to-gray-800'} text-white`}>
        <div className="p-6 flex items-center gap-4 border-b border-gray-700/50">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl shadow-lg flex items-center justify-center transform -rotate-3">
             <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">ATMS <span className="text-indigo-400">Pro</span></h1>
        </div>

        <nav className="flex-1 p-4 space-y-1 mt-2 overflow-y-auto custom-scrollbar">
          {sidebarItems.map((item, i) => {
            if (item.type === 'divider') {
              return <div key={i} className="pt-4 pb-2"><p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{item.label}</p></div>;
            }
            return (
              <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 font-medium text-sm ${activeTab === item.id ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-inner' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Dark Mode Toggle */}
        <div className="px-4 py-3 border-t border-gray-700/50">
          <button onClick={() => setDarkMode(!darkMode)} className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-gray-800 text-gray-400 hover:text-white transition-colors text-sm font-medium">
            <span className="flex items-center gap-2">
              {darkMode ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
            <div className={`w-10 h-5 rounded-full flex items-center p-0.5 transition-colors ${darkMode ? 'bg-indigo-600 justify-end' : 'bg-gray-600 justify-start'}`}>
              <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
            </div>
          </button>
        </div>

        <div className="p-4 border-t border-gray-700/50">
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-800 hover:bg-red-600/20 hover:text-red-400 text-gray-300 transition-colors border border-gray-700 hover:border-red-500/30 font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Log Out Session
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Beautiful Animated Background for Main Content */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-blue-200/40 blur-[100px] dark:bg-blue-900/20"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-indigo-200/40 blur-[100px] dark:bg-indigo-900/20"></div>
          <div className="absolute top-[40%] left-[20%] w-[30vw] h-[30vw] rounded-full bg-purple-200/30 blur-[120px] dark:bg-purple-900/20"></div>
        </div>

        {/* Top App Bar */}
        <header className="h-20 shadow-xl flex items-center justify-between px-8 z-10 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative border-b border-white/5">
          {/* Decorative shapes for premium look */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -right-10 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[80px]"></div>
            <div className="absolute -bottom-24 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[80px]"></div>
          </div>
          
          <div className="flex items-center gap-4 relative z-10">
            {activeTab !== 'dashboard' && (
              <button onClick={() => setActiveTab('dashboard')} className="p-2 rounded-xl transition-all bg-white/20 text-white hover:bg-white/30 backdrop-blur-md shadow-sm border border-white/10" title="Back to Dashboard">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              </button>
            )}
            <h2 className="text-2xl font-bold capitalize tracking-tight drop-shadow-md">
              {activeTab === 'dashboard' ? 'Overview' : activeTab.replace('-', ' ')}
            </h2>
          </div>
          
          <div className="flex items-center gap-6 relative z-10">
            <button onClick={() => setNotifOpen(true)} className="relative transition-colors hover:scale-110 transform text-white/90 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md">{unreadCount > 9 ? '9+' : unreadCount}</span>
              )}
            </button>
            <div className="h-8 w-px bg-white/30"></div>
            <div className="relative">
              <div className="flex items-center gap-3 cursor-pointer group px-3 py-1.5 rounded-full transition-all border border-transparent hover:bg-white/10 hover:border-white/20" onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}>
                <div className="text-right hidden md:block">
                  <p className="text-sm font-bold transition-colors text-white group-hover:text-indigo-100 drop-shadow-sm">{user.username}</p>


                </div>
                <img src={`https://ui-avatars.com/api/?name=${user.full_name}&background=6366f1&color=fff&bold=true`} alt="Profile" className="w-10 h-10 rounded-full border-2 border-indigo-100 shadow-sm group-hover:border-indigo-300 transition-colors" />
              </div>
              
              {profileDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileDropdownOpen(false)}></div>
                  <div className={`absolute right-0 mt-3 w-48 rounded-xl shadow-lg py-1 z-50 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                    <button onClick={() => { setActiveTab('profile'); setProfileDropdownOpen(false); }} className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors flex items-center gap-2 ${darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-slate-700 hover:bg-slate-50'}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                      My Profile
                    </button>
                    <div className={`h-px w-full my-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}></div>
                    <button onClick={onLogout} className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors flex items-center gap-2 ${darkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-red-50'}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                      Log Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main className={`flex-1 overflow-y-auto p-8 z-0 custom-scrollbar ${darkMode ? 'bg-gray-950' : ''}`}>
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <div className="space-y-8 animate-fade-in-up">
                {/* Welcome Banner */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gray-900 h-64 flex items-center">
                  <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" alt="Dashboard Banner" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                  <div className="relative z-10 p-10 md:p-14 max-w-2xl">
                    <span className="inline-block px-3 py-1 bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-bold uppercase tracking-wider rounded-full mb-4 backdrop-blur-sm">System Administration</span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight tracking-tight">Welcome back,<br/>{user.full_name.split(' ')[0]}!</h2>
                    <p className="text-indigo-100 text-lg max-w-lg font-medium opacity-90">Manage your institution's users, courses, and schedules from this centralized command center.</p>
                  </div>
                </div>

                {/* Live Stats Cards */}
                {stats && (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                      { label: 'Total Users', value: stats.counts.total_users, color: 'blue', icon: '👥' },
                      { label: 'Students', value: stats.counts.total_students, color: 'purple', icon: '🎓' },
                      { label: 'Lecturers', value: stats.counts.total_lecturers, color: 'emerald', icon: '👨‍🏫' },
                      { label: 'Courses', value: stats.counts.total_courses, color: 'amber', icon: '📚' },
                      { label: 'Classes Today', value: stats.counts.classes_today, color: 'rose', icon: '📅' },
                    ].map((s, i) => (
                      <div key={i} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5`}>
                        <span className="text-2xl">{s.icon}</span>
                        <p className={`text-3xl font-black mt-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>{s.value}</p>
                        <p className={`text-xs font-bold uppercase tracking-wider mt-1 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>{s.label}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { id: 'users', title: 'Users', desc: 'Add, edit, or remove students and lecturers.', color: 'blue', link: 'Manage Users' },
                    { id: 'courses', title: 'Courses', desc: 'Create subjects and assign course codes.', color: 'green', link: 'Manage Courses' },
                    { id: 'timetable', title: 'Timetable', desc: 'Allocate lecturers and set class times.', color: 'purple', link: 'Setup Schedule' },
                  ].map(card => (
                    <div key={card.id} onClick={() => setActiveTab(card.id)} className={`${darkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-100'} backdrop-blur-md p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group relative overflow-hidden`}>
                      <div className={`absolute -right-6 -top-6 w-24 h-24 bg-${card.color}-50 rounded-full group-hover:scale-150 transition-transform duration-500 z-0 ${darkMode ? 'opacity-20' : ''}`}></div>
                      <div className="relative z-10">
                        <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>{card.title}</h3>
                        <p className={`font-medium mb-6 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>{card.desc}</p>
                        <span className={`text-${card.color}-600 font-bold text-sm inline-flex items-center group-hover:translate-x-2 transition-transform duration-300`}>{card.link} <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg></span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Attendance Trend & Low Attendance */}
                {stats && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Attendance Trend Chart */}
                    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border rounded-3xl p-6 shadow-sm`}>
                      <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>7-Day Attendance Trend</h3>
                      <div className="flex items-end gap-2 h-40">
                        {stats.attendance_trend.map((d, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                            <span className={`text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity ${darkMode ? 'text-gray-300' : 'text-slate-500'}`}>{d.percentage}%</span>
                            <div className={`w-full rounded-t-lg overflow-hidden flex flex-col justify-end ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`} style={{ height: '100%' }}>
                              <div className={`${d.percentage >= 80 ? 'bg-emerald-500' : d.percentage >= 60 ? 'bg-amber-500' : 'bg-rose-500'} rounded-t-lg transition-all duration-300 group-hover:opacity-80`} style={{ height: `${Math.max(d.percentage, 4)}%` }}></div>
                            </div>
                            <span className={`text-[10px] font-bold ${darkMode ? 'text-gray-500' : 'text-slate-400'}`}>{d.day}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Low Attendance Alert */}
                    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border rounded-3xl p-6 shadow-sm`}>
                      <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                        <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span> Low Attendance Students
                      </h3>
                      {stats.low_attendance_students.length > 0 ? (
                        <div className="space-y-3 max-h-[200px] overflow-y-auto">
                          {stats.low_attendance_students.map((s, i) => (
                            <div key={i} className="flex items-center justify-between py-2">
                              <div className="flex items-center gap-3">
                                <img src={`https://ui-avatars.com/api/?name=${s.full_name}&background=random&color=fff&bold=true&rounded=true&size=32`} alt="" className="w-8 h-8 rounded-full" />
                                <div>
                                  <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{s.full_name}</p>
                                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-slate-400'}`}>{s.email}</p>
                                </div>
                              </div>
                              <span className="text-sm font-black text-rose-500">{s.percentage}%</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className={`text-sm py-4 text-center ${darkMode ? 'text-gray-500' : 'text-slate-400'}`}>All students above 75% 🎉</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Recent Users */}
                {stats && stats.recent_users.length > 0 && (
                  <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border rounded-3xl p-6 shadow-sm`}>
                    <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Recently Registered</h3>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                      {stats.recent_users.map((u, i) => (
                        <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shrink-0 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-slate-50 border-gray-100'}`}>
                          <img src={`https://ui-avatars.com/api/?name=${u.full_name}&background=random&color=fff&bold=true&rounded=true&size=36`} alt="" className="w-9 h-9 rounded-full" />
                          <div>
                            <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{u.full_name}</p>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>{u.role} · {new Date(u.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Component Views */}
            <div className="animate-fade-in-up">
              {activeTab === 'users' && <ManageUsers loggedInUser={user} />}
              {activeTab === 'courses' && <ManageCourses />}
              {activeTab === 'timetable' && <TimetableManagement />}
              {activeTab === 'reports' && <AttendanceReports />}
              {activeTab === 'rooms' && <ManageRooms />}
              {activeTab === 'calendar' && <AcademicCalendar user={user} isAdmin={true} />}
              {activeTab === 'notifications' && <SendNotification />}
              {activeTab === 'audit' && <AuditLog />}
              {activeTab === 'enrollments' && <ManageEnrollments />}
              {activeTab === 'profile' && <ProfileManagement user={user} onProfileUpdate={handleProfileUpdate} />}
            </div>
          </div>
        </main>
      </div>

      {/* Notification Panel */}
      <NotificationPanel user={user} isOpen={notifOpen} onClose={() => { setNotifOpen(false); fetchUnreadCount(); }} />
    </div>
  );
};

export default AdminDashboard;
