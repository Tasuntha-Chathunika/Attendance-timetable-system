import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentTimetable from '../components/StudentTimetable';
import StudentAttendance from '../components/StudentAttendance';

const StudentDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [attendancePercent, setAttendancePercent] = useState('...');
  const [attendanceValue, setAttendanceValue] = useState(0);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      const fetchPercentage = async () => {
        try {
          const response = await axios.get(`http://localhost/Attendance-timetable-system/backend/api/get_student_attendance.php?student_id=${user.id}`);
          if (response.data.status === 'success') {
            const pct = response.data.data.summary.percentage;
            setAttendancePercent(`${pct}%`);
            setAttendanceValue(parseFloat(pct));
          }
        } catch (error) {
          console.error("Failed to fetch percentage", error);
        }
      };
      fetchPercentage();
    }
  }, [activeTab, user.id]);

  // Determine color based on attendance
  const getAttendanceColor = (val) => {
    if (val >= 80) return 'text-emerald-500';
    if (val >= 60) return 'text-amber-500';
    return 'text-rose-500';
  };
  
  const getAttendanceBg = (val) => {
    if (val >= 80) return 'bg-emerald-50 border-emerald-100';
    if (val >= 60) return 'bg-amber-50 border-amber-100';
    return 'bg-rose-50 border-rose-100';
  };

  const getAttendanceRing = (val) => {
    if (val >= 80) return 'stroke-emerald-500';
    if (val >= 60) return 'stroke-amber-500';
    return 'stroke-rose-500';
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col shadow-2xl z-20">
        <div className="p-6 flex items-center gap-4 border-b border-gray-700/50">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-lg flex items-center justify-center transform -rotate-3">
             <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path></svg>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">ATMS <span className="text-purple-400">Student</span></h1>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${activeTab === 'dashboard' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30 shadow-inner' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            Dashboard
          </button>
          
          <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Academics</p>
          </div>
          
          <button 
            onClick={() => setActiveTab('timetable')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${activeTab === 'timetable' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30 shadow-inner' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            My Timetable
          </button>
          
          <button 
            onClick={() => setActiveTab('attendance')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${activeTab === 'attendance' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30 shadow-inner' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Attendance History
          </button>
        </nav>

        <div className="p-4 border-t border-gray-700/50">
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-800 hover:bg-red-600/20 hover:text-red-400 text-gray-300 transition-colors border border-gray-700 hover:border-red-500/30 font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Log Out Session
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Background Decorative Blob */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-purple-100 opacity-50 blur-3xl -z-10 pointer-events-none"></div>

        {/* Top App Bar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200/60 shadow-sm flex items-center justify-between px-8 z-10">
          <h2 className="text-2xl font-bold text-slate-800 capitalize tracking-tight">
            {activeTab === 'dashboard' ? 'Overview' : activeTab.replace('-', ' ')}
          </h2>
          
          <div className="flex items-center gap-6">
            <button className="text-slate-400 hover:text-purple-600 transition-colors relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
              {attendanceValue < 80 && attendanceValue !== 0 && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>}
            </button>
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-slate-800 group-hover:text-purple-600 transition-colors">{user.full_name}</p>
                <p className="text-xs font-semibold text-purple-500 uppercase tracking-wider">Student</p>
              </div>
              <img 
                src={`https://ui-avatars.com/api/?name=${user.full_name}&background=8b5cf6&color=fff&bold=true`} 
                alt="Profile" 
                className="w-10 h-10 rounded-full border-2 border-purple-100 shadow-sm group-hover:border-purple-300 transition-colors"
              />
            </div>
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto p-8 z-0">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <div className="space-y-8 animate-fade-in-up">
                
                {/* Welcome Banner */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-900 h-64 flex items-center">
                  <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" alt="Dashboard Banner" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
                  <div className="relative z-10 p-10 md:p-14 max-w-2xl">
                    <span className="inline-block px-3 py-1 bg-white/20 border border-white/30 text-white text-xs font-bold uppercase tracking-wider rounded-full mb-4 backdrop-blur-sm shadow-sm">Student Dashboard</span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight tracking-tight drop-shadow-md">Hello,<br/>{user.full_name.split(' ')[0]}! 🎓</h2>
                    <p className="text-slate-100 text-lg max-w-lg font-medium opacity-90 drop-shadow-sm">Track your attendance progress and stay on top of your schedule.</p>
                  </div>
                </div>

                {/* Dashboard Widgets */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Overall Attendance Stat Card */}
                  <div 
                    onClick={() => setActiveTab('attendance')}
                    className={`p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group relative overflow-hidden flex flex-col sm:flex-row items-center gap-8 ${getAttendanceBg(attendanceValue)}`}
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-bl-full -mr-16 -mt-16 z-0"></div>
                    
                    <div className="relative z-10 flex-1 text-center sm:text-left">
                      <h3 className="text-2xl font-bold text-slate-800 mb-2">Overall Attendance</h3>
                      <p className="text-slate-600 font-medium mb-6 max-w-xs">
                        {attendanceValue >= 80 ? "Great job! Keep up the excellent attendance record." : 
                         attendanceValue >= 60 ? "Warning: Your attendance is slipping. Try not to miss more classes." :
                         attendanceValue === 0 && attendancePercent === '...' ? "Loading your attendance..." :
                         "Critical: Your attendance is too low. Please contact your administrator."}
                      </p>
                      <span className={`font-bold text-sm inline-flex items-center group-hover:translate-x-2 transition-transform duration-300 ${getAttendanceColor(attendanceValue)}`}>
                        View Detailed History <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                      </span>
                    </div>

                    {/* Circular Progress Indicator */}
                    <div className="relative z-10 flex items-center justify-center shrink-0">
                      <div className="w-36 h-36 relative">
                        {/* Background Track */}
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="10" className="text-white/60"></circle>
                          {/* Progress Arc */}
                          <circle 
                            cx="50" 
                            cy="50" 
                            r="45" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="10" 
                            strokeLinecap="round"
                            className={`${getAttendanceRing(attendanceValue)} transition-all duration-1000 ease-out`}
                            strokeDasharray={`${attendanceValue === '...' ? 0 : (attendanceValue / 100) * 283} 283`}
                          ></circle>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                          <span className={`text-3xl font-black ${getAttendanceColor(attendanceValue)}`}>{attendancePercent}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* My Timetable Shortcut Card */}
                  <div 
                    onClick={() => setActiveTab('timetable')}
                    className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group relative overflow-hidden flex flex-col justify-center"
                  >
                    <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-indigo-50 rounded-full group-hover:scale-150 transition-transform duration-500 z-0"></div>
                    <div className="relative z-10">
                      <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-2">My Timetable</h3>
                      <p className="text-slate-500 font-medium mb-6 max-w-sm">Access your weekly class schedule and see upcoming lectures.</p>
                      <span className="text-indigo-600 font-bold text-sm inline-flex items-center group-hover:translate-x-2 transition-transform duration-300">
                        View Schedule <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Component Views */}
            <div className="animate-fade-in-up">
              {activeTab === 'timetable' && <StudentTimetable user={user} />}
              {activeTab === 'attendance' && <StudentAttendance user={user} />}
            </div>
            
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
