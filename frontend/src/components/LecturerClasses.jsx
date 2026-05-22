import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LecturerClasses = ({ user }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = 'http://localhost/Attendance-timetable-system/backend/api';

  useEffect(() => {
    if (user && user.id) {
      fetchClasses(user.id);
    }
  }, [user]);

  const fetchClasses = async (lecturerId) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_URL}/get_lecturer_classes.php?lecturer_id=${lecturerId}`);
      if (response.data.status === 'success') {
        setClasses(response.data.data || []);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error('Error fetching classes:', err);
      setError('Failed to load your classes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to format time
  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    let h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${minutes} ${ampm}`;
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden mt-2">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-8 border-b border-blue-100/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-md border border-blue-50">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">My Assigned Classes</h2>
            <p className="mt-1 text-slate-500 font-medium">Your schedule for the upcoming week.</p>
          </div>
        </div>
      </div>

      <div className="p-8">
        {error && (
          <div className="p-4 mb-8 rounded-xl flex items-center shadow-sm border bg-red-50 text-red-800 border-red-200 animate-fade-in-up">
            <svg className="w-6 h-6 mr-3 flex-shrink-0 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="font-medium text-slate-500">Loading your schedule...</p>
          </div>
        ) : classes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
            {classes.map((cls) => (
              <div key={cls.timetable_id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden flex flex-col">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
                
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 font-extrabold text-xs rounded-md border border-blue-100 tracking-wide">
                      {cls.course_code}
                    </span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 font-bold text-xs rounded-full border border-slate-200">
                      {cls.day_of_week}
                    </span>
                  </div>
                  
                  <h4 className="text-xl font-bold text-slate-800 leading-tight mb-4">{cls.course_name}</h4>
                  
                  <div className="flex items-center text-slate-600 bg-slate-50 px-3 py-2.5 rounded-lg border border-slate-100 mb-2">
                    <svg className="w-5 h-5 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span className="text-sm font-bold tracking-wide">
                      {formatTime(cls.start_time)} - {formatTime(cls.end_time)}
                    </span>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-50 mt-auto bg-slate-50/50">
                  <button className="w-full flex items-center justify-center gap-2 mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Mark Attendance
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
              <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-700">No classes assigned</h3>
            <p className="text-slate-500 mt-2 font-medium">You have no classes scheduled at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LecturerClasses;
