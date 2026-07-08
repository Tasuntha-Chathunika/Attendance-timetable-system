import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost/Attendance-timetable-system/backend/api';

const AttendanceReports = () => {
  const [view, setView] = useState('overview');
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseReport, setCourseReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/get_attendance_reports.php?type=overview`);
      if (res.data.status === 'success') setCourses(res.data.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const fetchCourseReport = async (courseId) => {
    setLoading(true);
    try {
      let url = `${API_URL}/get_attendance_reports.php?type=course&course_id=${courseId}`;
      if (dateFrom && dateTo) url += `&from=${dateFrom}&to=${dateTo}`;
      const res = await axios.get(url);
      if (res.data.status === 'success') {
        setCourseReport(res.data.data);
        setView('course');
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const getBarColor = (pct) => {
    if (pct >= 80) return 'bg-emerald-500';
    if (pct >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getTextColor = (pct) => {
    if (pct >= 80) return 'text-emerald-600';
    if (pct >= 60) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getBgColor = (pct) => {
    if (pct >= 80) return 'bg-emerald-50 border-emerald-200';
    if (pct >= 60) return 'bg-amber-50 border-amber-200';
    return 'bg-rose-50 border-rose-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-8 py-8 border-b border-orange-100/50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-orange-600 shadow-md border border-orange-50">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
              </div>
              <div>
                <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Attendance Reports</h2>
                <p className="mt-1 text-slate-500 font-medium">Course-wise and student-wise attendance analytics</p>
              </div>
            </div>
            {view === 'course' && (
              <button onClick={() => { setView('overview'); setCourseReport(null); setSelectedCourse(null); }} className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl font-bold text-slate-600 hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Back to Overview
              </button>
            )}
          </div>
        </div>

        <div className="p-8">
          {loading ? (
            <div className="flex flex-col justify-center items-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600 mb-4"></div>
              <p className="font-medium text-slate-500">Loading report data...</p>
            </div>
          ) : view === 'overview' ? (
            <div>
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
                  <p className="text-sm font-bold text-blue-600 uppercase tracking-wider">Total Courses</p>
                  <p className="text-4xl font-black text-blue-700 mt-2">{courses.length}</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
                  <p className="text-sm font-bold text-emerald-600 uppercase tracking-wider">Above 75%</p>
                  <p className="text-4xl font-black text-emerald-700 mt-2">{courses.filter(c => c.percentage >= 75).length}</p>
                </div>
                <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6">
                  <p className="text-sm font-bold text-rose-600 uppercase tracking-wider">Below 75%</p>
                  <p className="text-4xl font-black text-rose-700 mt-2">{courses.filter(c => c.percentage < 75 && c.total_records > 0).length}</p>
                </div>
              </div>

              {/* Courses Table */}
              <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm bg-white">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Course</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Present</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Absent</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Late</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Attendance Rate</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-50">
                      {courses.map(course => (
                        <tr key={course.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-800">{course.course_name}</p>
                            <p className="text-sm text-slate-500 font-mono">{course.course_code}</p>
                          </td>
                          <td className="px-6 py-4 text-center font-semibold text-slate-700">{course.total_records}</td>
                          <td className="px-6 py-4 text-center font-semibold text-emerald-600">{course.present}</td>
                          <td className="px-6 py-4 text-center font-semibold text-rose-600">{course.absent}</td>
                          <td className="px-6 py-4 text-center font-semibold text-amber-600">{course.late}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                                <div className={`h-full rounded-full transition-all duration-500 ${getBarColor(course.percentage)}`} style={{ width: `${course.percentage}%` }}></div>
                              </div>
                              <span className={`font-black text-sm min-w-[3rem] text-right ${getTextColor(course.percentage)}`}>{course.percentage}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => { setSelectedCourse(course); fetchCourseReport(course.id); }} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-colors border border-indigo-100">
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                      {courses.length === 0 && (
                        <tr>
                          <td colSpan="7" className="px-6 py-16 text-center text-slate-500">
                            <p className="text-xl font-bold">No attendance data available</p>
                            <p className="mt-2">Attendance records will appear here once lecturers begin marking.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : view === 'course' && courseReport ? (
            <div className="space-y-8">
              {/* Course Header */}
              <div className={`rounded-2xl p-6 border ${getBgColor(selectedCourse?.percentage || 0)}`}>
                <div className="flex items-center gap-4 mb-4">
                  <button onClick={() => setView('overview')} className="p-2 bg-white/50 hover:bg-white rounded-xl transition-all shadow-sm text-slate-600 hover:text-slate-900" title="Back to Overview">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                  </button>
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Course Report</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-extrabold text-slate-800">{selectedCourse?.course_name}</h3>
                    <p className="text-slate-500 font-mono mt-1">{selectedCourse?.course_code}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-5xl font-black ${getTextColor(selectedCourse?.percentage || 0)}`}>{selectedCourse?.percentage}%</p>
                    <p className="text-slate-500 font-medium text-sm mt-1">Overall Attendance</p>
                  </div>
                </div>
              </div>

              {/* Date Filter */}
              <div className="flex items-center gap-4 flex-wrap">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">From Date</label>
                  <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">To Date</label>
                  <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
                </div>
                <button onClick={() => fetchCourseReport(selectedCourse.id)} className="self-end px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30">
                  Apply Filter
                </button>
              </div>

              {/* Daily Chart */}
              {courseReport.daily && courseReport.daily.length > 0 && (
                <div>
                  <h4 className="text-lg font-bold text-slate-800 mb-4">Daily Attendance Trend</h4>
                  <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-end gap-1 h-40">
                      {courseReport.daily.map((day, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                          <span className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">{day.percentage}%</span>
                          <div className="w-full bg-gray-100 rounded-t-lg overflow-hidden flex flex-col justify-end" style={{ height: '100%' }}>
                            <div className={`${getBarColor(day.percentage)} rounded-t-lg transition-all duration-300 group-hover:opacity-80`} style={{ height: `${Math.max(day.percentage, 4)}%` }}></div>
                          </div>
                          <span className="text-[9px] font-medium text-slate-400 rotate-45 origin-left mt-1">{day.date.slice(5)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Student-wise Table */}
              <div>
                <h4 className="text-lg font-bold text-slate-800 mb-4">Student-wise Breakdown</h4>
                <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm bg-white">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Student</th>
                          <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Present</th>
                          <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Absent</th>
                          <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Late</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Rate</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-50">
                        {courseReport.students.map(s => (
                          <tr key={s.id} className={`hover:bg-slate-50/80 transition-colors ${s.percentage < 75 ? 'bg-rose-50/30' : ''}`}>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <img src={`https://ui-avatars.com/api/?name=${s.full_name}&background=random&color=fff&bold=true&rounded=true&size=40`} alt={s.full_name} className="w-10 h-10 rounded-full" />
                                <div>
                                  <p className="font-bold text-slate-800 text-sm">{s.full_name}</p>
                                  <p className="text-xs text-slate-500">{s.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center font-semibold text-emerald-600">{s.present}</td>
                            <td className="px-6 py-4 text-center font-semibold text-rose-600">{s.absent}</td>
                            <td className="px-6 py-4 text-center font-semibold text-amber-600">{s.late}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden max-w-[120px]">
                                  <div className={`h-full rounded-full ${getBarColor(s.percentage)}`} style={{ width: `${s.percentage}%` }}></div>
                                </div>
                                <span className={`font-black text-sm ${getTextColor(s.percentage)}`}>{s.percentage}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AttendanceReports;
