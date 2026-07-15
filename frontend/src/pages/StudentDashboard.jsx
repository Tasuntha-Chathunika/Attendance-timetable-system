import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentTimetable from '../components/StudentTimetable';
import StudentAttendance from '../components/StudentAttendance';
import NotificationPanel from '../components/NotificationPanel';
import ProfileManagement from '../components/ProfileManagement';
import CourseEnrollment from '../components/CourseEnrollment';
import AcademicCalendar from '../components/AcademicCalendar';

const API_URL = 'http://localhost/Attendance-timetable-system/backend/api';

const StudentDashboard = ({ user: initialUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(initialUser);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [attendancePercent, setAttendancePercent] = useState('...');
  const [attendanceValue, setAttendanceValue] = useState(0);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    fetchUnreadCount();
    if (activeTab === 'dashboard') fetchPercentage();
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

  const fetchPercentage = async () => {
    try {
      const response = await axios.get(`${API_URL}/get_student_attendance.php?student_id=${user.id}`);
      if (response.data.status === 'success') {
        const pct = response.data.data.summary.percentage;
        setAttendancePercent(`${pct}%`);
        setAttendanceValue(parseFloat(pct));
      }
    } catch (error) { console.error("Failed to fetch percentage", error); }
  };

  const handleProfileUpdate = (updatedUser) => setUser(updatedUser);

  const getAttendanceColor = (val) => val >= 80 ? 'text-emerald-500' : val >= 60 ? 'text-amber-500' : 'text-rose-500';
  const getAttendanceBg = (val) => val >= 80 ? 'bg-emerald-50 border-emerald-100' : val >= 60 ? 'bg-amber-50 border-amber-100' : 'bg-rose-50 border-rose-100';
  const getAttendanceRing = (val) => val >= 80 ? 'stroke-emerald-500' : val >= 60 ? 'stroke-amber-500' : 'stroke-rose-500';

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg> },
    { type: 'divider', label: 'Academics' },
    { id: 'timetable', label: 'My Timetable', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> },
    { id: 'attendance', label: 'Attendance History', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> },
    { id: 'enrollment', label: 'Course Enrollment', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg> },
    { id: 'calendar', label: 'Academic Calendar', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> },
    { type: 'divider', label: 'Account' },
    { id: 'profile', label: 'My Profile', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg> },
  ];

  return (
    <div className={`h-screen overflow-hidden flex transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-slate-50'}`}>
      <aside className={`w-72 flex flex-col shadow-2xl z-20 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-gray-900 to-gray-800'} text-white`}>
        <div className="p-6 flex items-center gap-4 border-b border-gray-700/50">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-lg flex items-center justify-center transform -rotate-3">
             <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path></svg>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight ml-3"><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">ATMS</span> <span className="text-purple-400 font-bold">Student</span></h1>
        </div>

        <nav className="flex-1 p-4 space-y-1 mt-2 overflow-y-auto custom-scrollbar">
          {sidebarItems.map((item, i) => {
            if (item.type === 'divider') return <div key={i} className="pt-4 pb-2"><p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{item.label}</p></div>;
            return (
              <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 font-medium text-sm ${activeTab === item.id ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30 shadow-inner' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                {item.icon} {item.label}
              </button>
            );
          })}
        </nav>

        <div className="px-4 py-3 border-t border-gray-700/50">
          <button onClick={() => setDarkMode(!darkMode)} className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-gray-800 text-gray-400 hover:text-white transition-colors text-sm font-medium">
            <span className="flex items-center gap-2">{darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}</span>
            <div className={`w-10 h-5 rounded-full flex items-center p-0.5 transition-colors ${darkMode ? 'bg-purple-600 justify-end' : 'bg-gray-600 justify-start'}`}>
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

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Beautiful Animated Background for Main Content */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-purple-200/40 blur-[100px] dark:bg-purple-900/20"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-fuchsia-200/40 blur-[100px] dark:bg-fuchsia-900/20"></div>
          <div className="absolute top-[40%] left-[20%] w-[30vw] h-[30vw] rounded-full bg-pink-200/30 blur-[120px] dark:bg-pink-900/20"></div>
        </div>

        <header className="h-20 shadow-md flex items-center justify-between px-8 z-10 bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-500 text-white relative">
          {/* Decorative shapes for premium look */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mt-20 -mr-20"></div>
            <div className="absolute bottom-0 left-20 w-40 h-40 bg-pink-400/20 rounded-full blur-2xl -mb-20"></div>
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
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md">{unreadCount > 9 ? '9+' : unreadCount}</span>
              )}
            </button>
            <div className="h-8 w-px bg-white/30"></div>
            <div className="relative">
              <div className="flex items-center gap-3 cursor-pointer group px-3 py-1.5 rounded-full transition-all border border-transparent hover:bg-white/10 hover:border-white/20" onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}>
                <div className="text-right hidden md:block">
                  <p className="text-sm font-bold transition-colors text-white group-hover:text-fuchsia-100 drop-shadow-sm">{user.username}</p>


                </div>
                <img src={`https://ui-avatars.com/api/?name=${user.full_name}&background=8b5cf6&color=fff&bold=true`} alt="Profile" className="w-10 h-10 rounded-full border-2 border-purple-100 shadow-sm group-hover:border-purple-300 transition-colors" />
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

        <main className={`flex-1 overflow-y-auto p-8 z-0 custom-scrollbar ${darkMode ? 'bg-gray-950' : ''}`}>
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <div className="space-y-8 animate-fade-in-up">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-900 h-64 flex items-center">
                  <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" alt="Dashboard Banner" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                  <div className="relative z-10 p-10 md:p-14 max-w-2xl">
                    <span className="inline-block px-3 py-1 bg-white/20 border border-white/30 text-white text-xs font-bold uppercase tracking-wider rounded-full mb-4 backdrop-blur-sm shadow-sm">Student Dashboard</span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight tracking-tight drop-shadow-md">Hello,<br/>{user.full_name.split(' ')[0]}! 🎓</h2>
                    <p className="text-slate-100 text-lg max-w-lg font-medium opacity-90 drop-shadow-sm">Track your attendance progress and stay on top of your schedule.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Overall Attendance */}
                  <div onClick={() => setActiveTab('attendance')} className={`p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group relative overflow-hidden flex flex-col sm:flex-row items-center gap-8 ${darkMode ? 'bg-gray-800 border-gray-700' : getAttendanceBg(attendanceValue)}`}>
                    <div className="relative z-10 flex-1 text-center sm:text-left">
                      <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Overall Attendance</h3>
                      <p className={`font-medium mb-6 max-w-xs ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                        {attendanceValue >= 80 ? "Great job! Keep up the excellent record." : 
                         attendanceValue >= 60 ? "Warning: Your attendance is slipping." :
                         attendanceValue === 0 && attendancePercent === '...' ? "Loading your attendance..." :
                         "Critical: Your attendance is too low."}
                      </p>
                      <span className={`font-bold text-sm inline-flex items-center group-hover:translate-x-2 transition-transform duration-300 ${getAttendanceColor(attendanceValue)}`}>
                        View Detailed History <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                      </span>
                    </div>
                    <div className="relative z-10 flex items-center justify-center shrink-0">
                      <div className="w-36 h-36 relative">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="10" className={`${darkMode ? 'text-gray-700' : 'text-white/60'}`}></circle>
                          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" className={`${getAttendanceRing(attendanceValue)} transition-all duration-1000 ease-out`} strokeDasharray={`${attendanceValue === '...' ? 0 : (attendanceValue / 100) * 283} 283`}></circle>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className={`text-3xl font-black ${getAttendanceColor(attendanceValue)}`}>{attendancePercent}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: 'timetable', title: 'My Timetable', desc: 'View weekly schedule', color: 'indigo', icon: '📅' },
                      { id: 'enrollment', title: 'Enroll Courses', desc: 'Browse & enroll', color: 'sky', icon: '📚' },
                      { id: 'calendar', title: 'Calendar', desc: 'Events & deadlines', color: 'violet', icon: '🗓️' },
                      { id: 'profile', title: 'My Profile', desc: 'Edit your info', color: 'pink', icon: '👤' },
                    ].map(card => (
                      <div key={card.id} onClick={() => setActiveTab(card.id)} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border p-5 rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group`}>
                        <span className="text-2xl">{card.icon}</span>
                        <h4 className={`font-bold mt-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>{card.title}</h4>
                        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>{card.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="animate-fade-in-up">
              {activeTab === 'timetable' && <StudentTimetable user={user} />}
              {activeTab === 'attendance' && <StudentAttendance user={user} />}
              {activeTab === 'enrollment' && <CourseEnrollment user={user} />}
              {activeTab === 'calendar' && <AcademicCalendar user={user} isAdmin={false} />}
              {activeTab === 'profile' && <ProfileManagement user={user} onProfileUpdate={handleProfileUpdate} />}
            </div>
          </div>
        </main>
      </div>

      <NotificationPanel user={user} isOpen={notifOpen} onClose={() => { setNotifOpen(false); fetchUnreadCount(); }} />
    </div>
  );
};

export default StudentDashboard;
