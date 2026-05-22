import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentTimetable = () => {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost/Attendance-timetable-system/backend/api';

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/get_student_timetable.php`);
      if (response.data.status === 'success') {
        setTimetable(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching timetable:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    let h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${minutes} ${ampm}`;
  };

  // Group timetable by day for a nicer agenda view
  const groupedTimetable = timetable.reduce((acc, cls) => {
    if (!acc[cls.day_of_week]) {
      acc[cls.day_of_week] = [];
    }
    acc[cls.day_of_week].push(cls);
    return acc;
  }, {});

  const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const sortedDays = Object.keys(groupedTimetable).sort((a, b) => daysOrder.indexOf(a) - daysOrder.indexOf(b));

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden mt-2">
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-8 py-8 border-b border-purple-100/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-purple-600 shadow-md border border-purple-50">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Weekly Agenda</h2>
              <p className="mt-1 text-slate-500 font-medium">Your schedule grouped by day.</p>
            </div>
          </div>
          <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hidden md:block">
            {timetable.length} Classes Total
          </div>
        </div>
      </div>

      <div className="p-8">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
            <p className="font-medium text-slate-500">Loading your timetable...</p>
          </div>
        ) : timetable.length > 0 ? (
          <div className="space-y-8 animate-fade-in-up">
            {sortedDays.map((day) => (
              <div key={day} className="relative">
                <div className="sticky top-0 bg-white/90 backdrop-blur-md z-10 py-3 border-b border-slate-100 mb-4">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center">
                    <span className="w-3 h-3 rounded-full bg-purple-500 mr-3"></span>
                    {day}
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {groupedTimetable[day].map((cls) => (
                    <div key={cls.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden flex flex-col p-6">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-purple-400 to-indigo-500"></div>
                      
                      <div className="flex justify-between items-start mb-4">
                        <span className="inline-block px-3 py-1 bg-purple-50 text-purple-700 font-extrabold text-xs rounded-md border border-purple-100 tracking-wide">
                          {cls.course_code}
                        </span>
                        <div className="flex items-center text-slate-500 text-sm font-bold bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                          <svg className="w-4 h-4 mr-1 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          {formatTime(cls.start_time)} - {formatTime(cls.end_time)}
                        </div>
                      </div>
                      
                      <h4 className="text-xl font-bold text-slate-800 leading-tight mb-4 flex-1">{cls.course_name}</h4>
                      
                      <div className="flex items-center pt-4 border-t border-slate-50 mt-auto">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${cls.lecturer_name}&background=random&color=fff&bold=true`}
                          alt={cls.lecturer_name}
                          className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                        />
                        <div className="ml-3">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lecturer</p>
                          <p className="text-sm font-semibold text-slate-700">{cls.lecturer_name}</p>
                        </div>
                      </div>
                    </div>
                  ))}
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
            <p className="text-slate-500 mt-2 font-medium">Check back later for your schedule.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentTimetable;
