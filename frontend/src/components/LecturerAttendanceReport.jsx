import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost/Attendance-timetable-system/backend/api';

const LecturerAttendanceReport = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchReport(); }, []);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/get_attendance_reports.php?type=lecturer&lecturer_id=${user.id}`);
      if (res.data.status === 'success') setCourses(res.data.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const getBarColor = (pct) => pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-500' : 'bg-rose-500';
  const getTextColor = (pct) => pct >= 80 ? 'text-emerald-600' : pct >= 60 ? 'text-amber-600' : 'text-rose-600';

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden mt-2">
      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 px-8 py-8 border-b border-teal-100/50">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-teal-600 shadow-md border border-teal-50">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">My Attendance Reports</h2>
            <p className="mt-1 text-slate-500 font-medium">Attendance summary for your classes</p>
          </div>
        </div>
      </div>

      <div className="p-8">
        {loading ? (
          <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div></div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((c, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">{c.course_name}</h3>
                    <p className="text-sm text-slate-500 font-mono">{c.course_code}</p>
                    <p className="text-sm text-slate-400 mt-1">{c.day_of_week} · {c.start_time?.slice(0,5)} - {c.end_time?.slice(0,5)}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-3xl font-black ${getTextColor(c.percentage)}`}>{c.percentage}%</p>
                    <p className="text-xs text-slate-400 font-medium">{c.total_records} records</p>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${getBarColor(c.percentage)}`} style={{ width: `${c.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl font-bold text-slate-600">No attendance data yet</p>
            <p className="text-slate-400 mt-2">Attendance records will appear here once you start marking.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LecturerAttendanceReport;
