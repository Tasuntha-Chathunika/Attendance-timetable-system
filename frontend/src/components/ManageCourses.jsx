import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, courseId: null, courseName: '' });

  const API_URL = 'http://localhost/Attendance-timetable-system/backend/api';

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/get_courses.php`);
      if (response.data.status === 'success') {
        setCourses(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setMessage({ type: 'error', text: 'Failed to load courses.' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!courseName.trim() || !courseCode.trim()) {
      setMessage({ type: 'error', text: 'Please fill in all fields.' });
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/add_course.php`, {
        course_name: courseName,
        course_code: courseCode
      });

      if (response.data.status === 'success') {
        setMessage({ type: 'success', text: response.data.message });
        setCourseName('');
        setCourseCode('');
        fetchCourses(); // Refresh list
      } else {
        setMessage({ type: 'error', text: response.data.message });
      }
    } catch (error) {
      console.error('Error adding course:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to add course.' });
    }
    
    // Auto clear success message after 3 seconds
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const confirmDelete = (id, name) => {
    setDeleteModal({ isOpen: true, courseId: id, courseName: name });
  };

  const executeDelete = async () => {
    if (!deleteModal.courseId) return;

    try {
      const response = await axios.post(`${API_URL}/delete_course.php`, { id: deleteModal.courseId });
      
      if (response.data.status === 'success') {
        setMessage({ type: 'success', text: response.data.message });
        fetchCourses(); // Refresh list
      } else {
        setMessage({ type: 'error', text: response.data.message });
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to delete course.' });
    }
    
    setDeleteModal({ isOpen: false, courseId: null, courseName: '' });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden mt-2">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-8 py-10 border-b border-emerald-100/50">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-md border border-emerald-50">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Course Management</h2>
              <p className="mt-1 text-slate-500 font-medium">Design curriculum, assign unique codes, and manage subjects.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
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
          
          {/* Add Course Glassmorphic Form */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-8">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-6 border border-emerald-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-6 tracking-tight">Create New Course</h3>
              <form onSubmit={handleAddCourse} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="courseName">Course Name</label>
                  <input
                    type="text"
                    id="courseName"
                    className="w-full bg-slate-50 border border-gray-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder-gray-400"
                    placeholder="e.g. Advanced AI Robotics"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="courseCode">Course Code</label>
                  <input
                    type="text"
                    id="courseCode"
                    className="w-full bg-slate-50 border border-gray-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder-gray-400 uppercase"
                    placeholder="e.g. CS404"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 mt-4"
                >
                  Publish Course
                </button>
              </form>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="lg:w-2/3">
            {loading ? (
              <div className="flex flex-col justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
                <p className="font-medium text-slate-500">Syncing courses...</p>
              </div>
            ) : courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map((course, index) => (
                  <div 
                    key={course.id} 
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group border border-gray-100 flex flex-col"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Course Image */}
                    <div className="h-40 overflow-hidden relative bg-slate-100">
                      {/* Using sig=${course.id} ensures a unique but stable image per course */}
                      <img 
                        src={`https://source.unsplash.com/random/400x200/?education,books&sig=${course.id}`} 
                        alt={course.course_name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                      <div className="absolute bottom-4 left-4">
                        <span className="px-3 py-1.5 bg-emerald-500/90 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm border border-emerald-400/50">
                          {course.course_code}
                        </span>
                      </div>
                    </div>
                    
                    {/* Course Info */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-lg font-bold text-slate-800 mb-1 leading-tight group-hover:text-emerald-600 transition-colors">{course.course_name}</h4>
                        <p className="text-xs text-slate-500 font-medium mb-4 flex items-center">
                          <svg className="w-3.5 h-3.5 mr-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path></svg>
                          System ID: #{course.id}
                        </p>
                      </div>
                      
                      <div className="pt-4 border-t border-slate-100 flex justify-end">
                        <button 
                          onClick={() => confirmDelete(course.id, course.course_name)}
                          className="flex items-center justify-center px-4 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-all group/btn w-full shadow-sm"
                        >
                          <svg className="w-3.5 h-3.5 mr-1.5 group-hover/btn:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          Remove Course
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
                  <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-slate-700">No courses available</h3>
                <p className="text-slate-500 mt-2 font-medium">Use the panel to create your first course.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setDeleteModal({ isOpen: false, courseId: null, courseName: '' })}></div>
          
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl transform transition-all max-w-md w-full mx-4 relative z-10 border border-slate-100 scale-100">
            <div className="p-8 pb-6">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
              <h3 className="text-2xl font-extrabold text-center text-slate-900 mb-2">Delete Course?</h3>
              <p className="text-center text-slate-500 font-medium">
                You are about to permanently delete <span className="text-slate-800 font-bold">"{deleteModal.courseName}"</span>. This action cannot be undone.
              </p>
            </div>
            
            <div className="bg-slate-50 px-8 py-5 flex gap-4 border-t border-slate-100">
              <button 
                onClick={() => setDeleteModal({ isOpen: false, courseId: null, courseName: '' })}
                className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button 
                onClick={executeDelete}
                className="flex-1 bg-red-500 text-white font-bold py-3 px-4 rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCourses;
