import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost/Attendance-timetable-system/backend/api';

const CourseEnrollment = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchCourses();
    fetchEnrollments();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API_URL}/get_courses.php`);
      if (res.data.status === 'success') setCourses(res.data.data || []);
    } catch (err) { console.error(err); }
  };

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/manage_enrollments.php?student_id=${user.id}`);
      if (res.data.status === 'success') setEnrollments(res.data.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleEnroll = async (courseId) => {
    try {
      const res = await axios.post(`${API_URL}/manage_enrollments.php`, { action: 'enroll', student_id: user.id, course_id: courseId });
      setMessage({ type: res.data.status === 'success' ? 'success' : 'error', text: res.data.message });
      fetchEnrollments();
    } catch (err) { setMessage({ type: 'error', text: 'Failed to enroll.' }); }
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const isEnrolled = (courseId) => enrollments.some(e => e.course_id == courseId);
  const getEnrollmentStatus = (courseId) => {
    const enrollment = enrollments.find(e => e.course_id == courseId);
    return enrollment ? enrollment.status : null;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved': return <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-full">✓ Approved</span>;
      case 'pending': return <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold rounded-full">⏳ Pending</span>;
      case 'rejected': return <span className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 text-xs font-bold rounded-full">✕ Rejected</span>;
      default: return null;
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden mt-2">
      <div className="bg-gradient-to-r from-sky-50 to-cyan-50 px-8 py-8 border-b border-sky-100/50">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-sky-600 shadow-md border border-sky-50">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Course Enrollment</h2>
            <p className="mt-1 text-slate-500 font-medium">Browse and enroll in available courses</p>
          </div>
        </div>
      </div>

      <div className="p-8">
        {message.text && (
          <div className={`p-4 mb-6 rounded-xl font-semibold ${message.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-green-50 text-green-800 border border-green-200'}`}>{message.text}</div>
        )}

        {/* My Enrollments */}
        {enrollments.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-800 mb-4">My Enrollments</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {enrollments.map(e => (
                <div key={e.id} className={`p-5 rounded-2xl border ${e.status === 'approved' ? 'bg-emerald-50/50 border-emerald-200' : e.status === 'pending' ? 'bg-amber-50/50 border-amber-200' : 'bg-red-50/50 border-red-200'}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-slate-800">{e.course_name}</p>
                      <p className="text-sm text-slate-500 font-mono mt-1">{e.course_code}</p>
                    </div>
                    {getStatusBadge(e.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Courses */}
        <h3 className="text-lg font-bold text-slate-800 mb-4">Available Courses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map(course => {
            const enrolled = isEnrolled(course.id);
            const status = getEnrollmentStatus(course.id);
            return (
              <div key={course.id} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center text-sky-600 mb-4 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                </div>
                <h4 className="text-lg font-bold text-slate-800">{course.course_name}</h4>
                <p className="text-sm text-slate-500 font-mono mt-1">{course.course_code}</p>
                <div className="mt-4">
                  {enrolled ? (
                    getStatusBadge(status)
                  ) : (
                    <button onClick={() => handleEnroll(course.id)} className="w-full py-2.5 bg-sky-600 text-white font-bold text-sm rounded-xl hover:bg-sky-700 transition-all shadow-lg shadow-sky-500/30">
                      Enroll Now
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CourseEnrollment;
