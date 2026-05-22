import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentAttendance = ({ user }) => {
  const [attendance, setAttendance] = useState({
    summary: { total: 0, present: 0, absent: 0, late: 0, percentage: 0 },
    records: []
  });
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost/Attendance-timetable-system/backend/api';

  useEffect(() => {
    if (user && user.id) {
      fetchAttendance(user.id);
    }
  }, [user]);

  const fetchAttendance = async (studentId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/get_student_attendance.php?student_id=${studentId}`);
      if (response.data.status === 'success') {
        setAttendance(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const { summary, records } = attendance;
  
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (summary.percentage / 100) * circumference;
  
  const getProgressColor = (pct) => {
    if (pct >= 80) return 'text-emerald-500';
    if (pct >= 60) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'present':
        return <span className="px-3 py-1 inline-flex text-xs font-bold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">Present</span>;
      case 'late':
        return <span className="px-3 py-1 inline-flex text-xs font-bold rounded-md bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wider">Late</span>;
      case 'absent':
        return <span className="px-3 py-1 inline-flex text-xs font-bold rounded-md bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-wider">Absent</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden mt-2 animate-fade-in-up">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-8 border-b border-blue-100/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-md border border-blue-50">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Attendance History</h2>
            <p className="mt-1 text-slate-500 font-medium">Review your detailed attendance records.</p>
          </div>
        </div>
      </div>

      <div className="p-8">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="font-medium text-slate-500">Loading your history...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Summary Stats & Circular Progress */}
            <div className="lg:col-span-1 flex flex-col">
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-bl-full -mr-16 -mt-16 z-0"></div>
                
                <h3 className="text-xl font-bold text-slate-800 mb-6 relative z-10">Summary</h3>
                
                <div className="relative flex items-center justify-center mb-8 z-10">
                  <svg className="transform -rotate-90 w-40 h-40 drop-shadow-md">
                    <circle cx="80" cy="80" r="60" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white" />
                    <circle
                      cx="80" cy="80" r="60"
                      stroke="currentColor" strokeWidth="12" fill="transparent"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className={`${getProgressColor(summary.percentage)} transition-all duration-1000 ease-out`}
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-slate-800">{summary.percentage}%</span>
                  </div>
                </div>

                <div className="w-full space-y-3 z-10">
                  <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                    <span className="text-slate-500 font-bold text-sm uppercase tracking-wider">Total Classes</span>
                    <span className="font-black text-slate-800 text-lg">{summary.total}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-xl border border-emerald-100 shadow-sm">
                    <span className="text-emerald-700 font-bold text-sm uppercase tracking-wider flex items-center"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2"></div>Present</span>
                    <span className="font-black text-emerald-700 text-lg">{summary.present}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-amber-50 rounded-xl border border-amber-100 shadow-sm">
                    <span className="text-amber-700 font-bold text-sm uppercase tracking-wider flex items-center"><div className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-2"></div>Late</span>
                    <span className="font-black text-amber-700 text-lg">{summary.late}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-rose-50 rounded-xl border border-rose-100 shadow-sm">
                    <span className="text-rose-700 font-bold text-sm uppercase tracking-wider flex items-center"><div className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-2"></div>Absent</span>
                    <span className="font-black text-rose-700 text-lg">{summary.absent}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Records Table */}
            <div className="lg:col-span-2">
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white h-full flex flex-col">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-700">Detailed Log</h3>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{records.length} Records</span>
                </div>
                
                <div className="overflow-y-auto max-h-[600px] flex-1">
                  <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-white sticky top-0 z-10 shadow-sm">
                      <tr>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Course</th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-50">
                      {records.length > 0 ? (
                        records.map((record, index) => (
                          <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-bold">
                              {new Date(record.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <span className="inline-block px-2 py-1 bg-indigo-50 text-indigo-700 font-extrabold text-xs rounded border border-indigo-100 tracking-wide mr-3">
                                  {record.course_code}
                                </span>
                                <span className="text-sm font-bold text-slate-700">{record.course_name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(record.status)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="px-6 py-12 text-center text-slate-500 bg-slate-50">
                            <div className="flex flex-col items-center">
                              <svg className="w-12 h-12 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                              <span className="font-bold text-slate-600 text-lg">No records found</span>
                              <p className="text-sm mt-1">Your attendance hasn't been marked yet.</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAttendance;
