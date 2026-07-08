import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TimetableManagement = () => {
  const [timetable, setTimetable] = useState([]);
  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Custom Modal State
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, entryId: null });
  
  const [formData, setFormData] = useState({
    course_id: '',
    lecturer_id: '',
    day_of_week: '',
    start_time: '',
    end_time: ''
  });

  const API_URL = 'http://localhost/Attendance-timetable-system/backend/api';

  useEffect(() => {
    fetchTimetable();
    fetchCourses();
    fetchLecturers();
  }, []);

  const fetchTimetable = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/get_timetable.php`);
      if (response.data.status === 'success') {
        setTimetable(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching timetable:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API_URL}/get_courses.php`);
      if (response.data.status === 'success') {
        setCourses(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchLecturers = async () => {
    try {
      const response = await axios.get(`${API_URL}/get_users.php`);
      if (response.data.status === 'success') {
        const allUsers = response.data.data || [];
        setLecturers(allUsers.filter(u => u.role === 'lecturer'));
      }
    } catch (error) {
      console.error('Error fetching lecturers:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.course_id || !formData.lecturer_id || !formData.day_of_week || !formData.start_time || !formData.end_time) {
      setMessage({ type: 'error', text: 'Please fill all fields.' });
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/create_timetable.php`, formData);
      if (response.data.status === 'success') {
        setMessage({ type: 'success', text: response.data.message });
        setFormData({ course_id: '', lecturer_id: '', day_of_week: '', start_time: '', end_time: '' });
        fetchTimetable();
      } else {
        setMessage({ type: 'error', text: response.data.message });
      }
    } catch (error) {
      console.error('Error creating timetable:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to create timetable entry.' });
    }

    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const confirmDelete = (id) => {
    setDeleteModal({ isOpen: true, entryId: id });
  };

  const executeDelete = async () => {
    if (!deleteModal.entryId) return;

    try {
      const response = await axios.post(`${API_URL}/delete_timetable.php`, { id: deleteModal.entryId });
      if (response.data.status === 'success') {
        setMessage({ type: 'success', text: response.data.message });
        fetchTimetable();
      } else {
        setMessage({ type: 'error', text: response.data.message });
      }
    } catch (error) {
      console.error('Error deleting timetable:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to delete timetable entry.' });
    }

    setDeleteModal({ isOpen: false, entryId: null });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  // Helper to format time (e.g., 14:30:00 -> 02:30 PM)
  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    let h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${minutes} ${ampm}`;
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden mt-2">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-4 py-4 border-b border-purple-100/50">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-purple-600 shadow-sm border border-purple-50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Schedule Planner</h2>
              <p className="mt-0.5 text-sm text-slate-500 font-medium">Allocate lecturers, set class times, and manage the weekly timetable.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Message Alert */}
        {message.text && (
          <div className={`p-4 mb-8 rounded-xl flex justify-between items-center shadow-md border backdrop-blur-md animate-fade-in-up ${message.type === 'error' ? 'bg-red-50 text-red-800 border-red-200' : 'bg-green-50 text-green-800 border-green-200'}`}>
            <div className="flex items-center">
              {message.type === 'error' ? (
                <svg className="w-6 h-6 mr-3 flex-shrink-0 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
              ) : (
                <svg className="w-6 h-6 mr-3 flex-shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
              )}
              <span className="font-semibold">{message.text}</span>
            </div>
            <button onClick={() => setMessage({ type: '', text: '' })} className="text-gray-400 hover:text-gray-700 focus:outline-none transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Create Schedule Widget */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sticky top-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4 tracking-tight">Assign New Class</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Course</label>
                  <select
                    name="course_id"
                    value={formData.course_id}
                    onChange={handleChange}
                    className="w-full appearance-none bg-slate-50 border border-gray-200 text-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all font-medium cursor-pointer"
                  >
                    <option value="">Select a Course...</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.course_code} - {c.course_name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Lecturer</label>
                  <select
                    name="lecturer_id"
                    value={formData.lecturer_id}
                    onChange={handleChange}
                    className="w-full appearance-none bg-slate-50 border border-gray-200 text-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all font-medium cursor-pointer"
                  >
                    <option value="">Select a Lecturer...</option>
                    {lecturers.map(l => (
                      <option key={l.id} value={l.id}>{l.full_name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Day of Week</label>
                  <select
                    name="day_of_week"
                    value={formData.day_of_week}
                    onChange={handleChange}
                    className="w-full appearance-none bg-slate-50 border border-gray-200 text-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all font-medium cursor-pointer"
                  >
                    <option value="">Select Day...</option>
                    {daysOfWeek.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Start Time</label>
                    <input
                      type="time"
                      name="start_time"
                      value={formData.start_time}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-gray-200 text-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">End Time</label>
                    <input
                      type="time"
                      name="end_time"
                      value={formData.end_time}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-gray-200 text-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-4 rounded-lg transition-all shadow-md hover:shadow-lg mt-4 text-sm"
                >
                  Confirm Schedule
                </button>
              </form>
            </div>
          </div>

          {/* Weekly Timeline View */}
          <div className="lg:w-2/3">
            {loading ? (
              <div className="flex flex-col justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
                <p className="font-medium text-slate-500">Loading schedule...</p>
              </div>
            ) : timetable.length > 0 ? (
              <div className="space-y-6">
                {daysOfWeek.map((day) => {
                  const dayEntries = timetable.filter(entry => entry.day_of_week === day);
                  if (dayEntries.length === 0) return null;

                  // Sort entries by start time within the day
                  dayEntries.sort((a, b) => a.start_time.localeCompare(b.start_time));

                  return (
                    <div key={day} className="animate-fade-in-up">
                      <div className="flex items-center mb-4">
                        <div className="bg-indigo-100 text-indigo-700 font-bold px-4 py-1.5 rounded-lg text-sm uppercase tracking-widest shadow-sm">
                          {day}
                        </div>
                        <div className="flex-1 h-px bg-slate-200 ml-4"></div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {dayEntries.map((entry) => (
                          <div key={entry.id} className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                            
                            <div className="flex justify-between items-start mb-2 pl-2">
                              <div>
                                <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 font-bold text-[10px] rounded border border-slate-200 mb-1">
                                  {entry.course_code}
                                </span>
                                <h4 className="text-sm font-bold text-slate-800 leading-tight">{entry.course_name}</h4>
                              </div>
                              
                              <button 
                                onClick={() => confirmDelete(entry.id)}
                                className="w-8 h-8 rounded-full bg-red-50 text-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all transform translate-x-2 group-hover:translate-x-0"
                                aria-label="Remove schedule"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                              </button>
                            </div>
                            
                            <div className="space-y-1.5 pl-2">
                              <div className="flex items-center text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-100 w-fit">
                                <svg className="w-4 h-4 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <span className="text-[11px] font-bold tracking-wide">
                                  {formatTime(entry.start_time)} - {formatTime(entry.end_time)}
                                </span>
                              </div>
                              
                              <div className="flex items-center pt-1">
                                <img 
                                  src={`https://ui-avatars.com/api/?name=${entry.lecturer_name}&background=3b82f6&color=fff&rounded=true&bold=true`}
                                  alt={entry.lecturer_name}
                                  className="w-6 h-6 rounded-full border border-blue-100 shadow-sm mr-2 group-hover:scale-110 transition-transform"
                                />
                                <span className="text-xs font-semibold text-slate-700">{entry.lecturer_name}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[300px] bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
                  <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-slate-700">Schedule is empty</h3>
                <p className="text-slate-500 mt-2 font-medium">Use the planner widget to assign the first class.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setDeleteModal({ isOpen: false, entryId: null })}></div>
          
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl transform transition-all max-w-md w-full mx-4 relative z-10 border border-slate-100 scale-100">
            <div className="p-8 pb-6">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
              <h3 className="text-2xl font-extrabold text-center text-slate-900 mb-2">Remove Class?</h3>
              <p className="text-center text-slate-500 font-medium">
                You are about to remove this scheduled class from the timetable. Are you sure?
              </p>
            </div>
            
            <div className="bg-slate-50 px-8 py-5 flex gap-4 border-t border-slate-100">
              <button 
                onClick={() => setDeleteModal({ isOpen: false, entryId: null })}
                className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button 
                onClick={executeDelete}
                className="flex-1 bg-red-500 text-white font-bold py-3 px-4 rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimetableManagement;
