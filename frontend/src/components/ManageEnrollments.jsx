import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost/Attendance-timetable-system/backend/api';

const ManageEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => { fetchEnrollments(); }, []);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/manage_enrollments.php?all=true`);
      if (res.data.status === 'success') setEnrollments(res.data.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleAction = async (id, action) => {
    try {
      const res = await axios.post(`${API_URL}/manage_enrollments.php`, { action, id });
      setMessage({ type: 'success', text: res.data.message });
      fetchEnrollments();
    } catch (err) { setMessage({ type: 'error', text: 'Action failed.' }); }
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const filtered = enrollments.filter(e => filter === 'all' || e.status === filter);

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden mt-2">
      <div className="bg-gradient-to-r from-sky-50 to-cyan-50 px-8 py-8 border-b border-sky-100/50">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-sky-600 shadow-md border border-sky-50">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Enrollment Requests</h2>
              <p className="mt-1 text-slate-500 font-medium">Approve or reject student course enrollments</p>
            </div>
          </div>
          <div className="flex gap-2">
            {['all','pending','approved','rejected'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === f ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/30' : 'bg-white border border-gray-200 text-slate-600 hover:bg-slate-50'}`}>
                {f.charAt(0).toUpperCase() + f.slice(1)} {f === 'pending' && `(${enrollments.filter(e => e.status === 'pending').length})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-8">
        {message.text && (
          <div className={`p-4 mb-6 rounded-xl font-semibold ${message.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-green-50 text-green-800 border border-green-200'}`}>{message.text}</div>
        )}

        <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(e => (
                  <tr key={e.id} className={`hover:bg-slate-50/80 transition-colors ${e.status === 'pending' ? 'bg-amber-50/30' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={`https://ui-avatars.com/api/?name=${e.student_name}&background=random&color=fff&bold=true&rounded=true&size=40`} alt="" className="w-10 h-10 rounded-full" />
                        <span className="font-bold text-slate-800 text-sm">{e.student_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800 text-sm">{e.course_name}</p>
                      <p className="text-xs text-slate-500 font-mono">{e.course_code}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${e.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : e.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        {e.status.charAt(0).toUpperCase() + e.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">{new Date(e.enrolled_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      {e.status === 'pending' && (
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => handleAction(e.id, 'approve')} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors">Approve</button>
                          <button onClick={() => handleAction(e.id, 'reject')} className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors">Reject</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan="5" className="px-6 py-16 text-center text-slate-500 font-medium">No enrollment requests found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageEnrollments;
