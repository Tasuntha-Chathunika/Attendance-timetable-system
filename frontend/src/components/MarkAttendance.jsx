import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MarkAttendance = ({ user }) => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({}); // { student_id: 'present' | 'absent' | 'late' }
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Today's date

  const API_URL = 'http://localhost/Attendance-timetable-system/backend/api';

  useEffect(() => {
    if (user && user.id) {
      fetchClasses(user.id);
      fetchStudents();
    }
  }, [user]);

  useEffect(() => {
    if (selectedCourse && selectedDate) {
      fetchExistingAttendance();
    }
  }, [selectedCourse, selectedDate]);

  const fetchClasses = async (lecturerId) => {
    try {
      const response = await axios.get(`${API_URL}/get_lecturer_classes.php?lecturer_id=${lecturerId}`);
      if (response.data.status === 'success') {
        const uniqueCourses = [];
        const courseIds = new Set();
        (response.data.data || []).forEach(cls => {
          if (!courseIds.has(cls.course_id)) {
            courseIds.add(cls.course_id);
            uniqueCourses.push({
              id: cls.course_id,
              code: cls.course_code,
              name: cls.course_name
            });
          }
        });
        setClasses(uniqueCourses);
      }
    } catch (err) {
      console.error('Error fetching classes:', err);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/get_students.php`);
      if (response.data.status === 'success') {
        setStudents(response.data.data || []);
        const initAtt = {};
        (response.data.data || []).forEach(student => {
          initAtt[student.id] = 'present';
        });
        setAttendance(initAtt);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchExistingAttendance = async () => {
    try {
      const response = await axios.get(`${API_URL}/get_attendance.php?course_id=${selectedCourse}&date=${selectedDate}`);
      if (response.data.status === 'success' && response.data.data.length > 0) {
        const existingAtt = { ...attendance };
        response.data.data.forEach(record => {
          existingAtt[record.student_id] = record.status;
        });
        setAttendance(existingAtt);
      } else {
        const resetAtt = {};
        students.forEach(student => {
          resetAtt[student.id] = 'present';
        });
        setAttendance(resetAtt);
      }
    } catch (err) {
      console.error('Error fetching existing attendance:', err);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendance({
      ...attendance,
      [studentId]: status
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourse || !selectedDate) {
      setMessage({ type: 'error', text: 'Please select a course and date.' });
      return;
    }

    setSaving(true);
    const attendanceData = Object.keys(attendance).map(studentId => ({
      student_id: studentId,
      status: attendance[studentId]
    }));

    try {
      const response = await axios.post(`${API_URL}/save_attendance.php`, {
        course_id: selectedCourse,
        date: selectedDate,
        attendance: attendanceData
      });

      if (response.data.status === 'success') {
        setMessage({ type: 'success', text: response.data.message });
      } else {
        setMessage({ type: 'error', text: response.data.message });
      }
    } catch (err) {
      console.error('Error saving attendance:', err);
      setMessage({ type: 'error', text: 'Failed to save attendance.' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    }
  };

  const markAll = (status) => {
    const newAtt = {};
    students.forEach(student => {
      newAtt[student.id] = status;
    });
    setAttendance(newAtt);
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden mt-2">
      
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-8 py-8 border-b border-emerald-100/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-md border border-emerald-50">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Record Attendance</h2>
            <p className="mt-1 text-slate-500 font-medium">Select a course and date to begin grading attendance.</p>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Messages */}
        {message.text && (
          <div className={`p-4 mb-8 rounded-xl flex items-center shadow-sm border animate-fade-in-up ${message.type === 'error' ? 'bg-red-50 text-red-800 border-red-200' : 'bg-green-50 text-green-800 border-green-200'}`}>
            {message.type === 'error' ? (
              <svg className="w-6 h-6 mr-3 flex-shrink-0 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
            ) : (
              <svg className="w-6 h-6 mr-3 flex-shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
            )}
            <span className="font-semibold flex-1">{message.text}</span>
            <button onClick={() => setMessage({ type: '', text: '' })} className="text-gray-400 hover:text-gray-700">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            </button>
          </div>
        )}

        {/* Selection Form */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <label className="block text-sm font-bold text-slate-700 mb-2">Select Course</label>
            <div className="relative">
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-gray-200 text-slate-800 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium cursor-pointer"
              >
                <option value="">-- Choose a Class --</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-bold text-slate-700 mb-2">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-slate-50 border border-gray-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
            />
          </div>
        </div>

        {/* Attendance List Area */}
        {selectedCourse ? (
          <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white animate-fade-in-up">
            
            {/* Toolbar */}
            <div className="bg-slate-50 px-6 py-4 flex flex-col sm:flex-row justify-between items-center border-b border-gray-200 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold">
                  {students.length}
                </div>
                <h3 className="font-bold text-slate-700">Enrolled Students</h3>
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <button onClick={() => markAll('present')} className="flex-1 sm:flex-none text-sm px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg font-bold transition-colors">
                  All Present
                </button>
                <button onClick={() => markAll('absent')} className="flex-1 sm:flex-none text-sm px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg font-bold transition-colors">
                  All Absent
                </button>
              </div>
            </div>
            
            {/* List */}
            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {loading ? (
                <div className="p-12 flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mb-4"></div>
                  <p className="font-medium text-slate-500">Loading student roster...</p>
                </div>
              ) : students.length > 0 ? (
                students.map(student => (
                  <div key={student.id} className="p-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between hover:bg-slate-50 transition-colors gap-4">
                    
                    {/* Student Info */}
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${student.full_name}&background=random&color=fff&bold=true&rounded=true`}
                        alt={student.full_name}
                        className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                      />
                      <div>
                        <h4 className="font-bold text-slate-800">{student.full_name}</h4>
                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">@{student.username}</span>
                      </div>
                    </div>

                    {/* Segmented Control */}
                    <div className="bg-slate-100 p-1 rounded-xl flex items-center shadow-inner w-full sm:w-auto">
                      <button
                        onClick={() => handleStatusChange(student.id, 'present')}
                        className={`flex-1 sm:flex-none px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${
                          attendance[student.id] === 'present'
                            ? 'bg-emerald-500 text-white shadow-md transform scale-[1.02]'
                            : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50'
                        }`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => handleStatusChange(student.id, 'late')}
                        className={`flex-1 sm:flex-none px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${
                          attendance[student.id] === 'late'
                            ? 'bg-amber-500 text-white shadow-md transform scale-[1.02]'
                            : 'text-slate-500 hover:text-amber-600 hover:bg-amber-50'
                        }`}
                      >
                        Late
                      </button>
                      <button
                        onClick={() => handleStatusChange(student.id, 'absent')}
                        className={`flex-1 sm:flex-none px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${
                          attendance[student.id] === 'absent'
                            ? 'bg-rose-500 text-white shadow-md transform scale-[1.02]'
                            : 'text-slate-500 hover:text-rose-600 hover:bg-rose-50'
                        }`}
                      >
                        Absent
                      </button>
                    </div>

                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-slate-500 font-medium">No students enrolled in this course.</div>
              )}
            </div>
            
            {/* Submit Footer */}
            <div className="bg-slate-50 px-6 py-5 border-t border-gray-200 flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={saving || students.length === 0}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white shadow-md transition-all ${
                  saving || students.length === 0 
                    ? 'bg-slate-400 cursor-not-allowed opacity-70' 
                    : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 hover:shadow-lg hover:-translate-y-0.5'
                }`}
              >
                {saving ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Saving Records...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Submit Attendance
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] bg-slate-50 rounded-2xl border border-slate-200 border-dashed animate-fade-in-up">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
              <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-700">No Course Selected</h3>
            <p className="text-slate-500 mt-2 font-medium max-w-sm text-center">Please select a course and date from the dropdown above to load the student roster and mark attendance.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkAttendance;
