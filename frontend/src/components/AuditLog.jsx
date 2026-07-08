import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost/Attendance-timetable-system/backend/api';

const AuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchLogs(); }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/audit_log.php?limit=100`);
      if (res.data.status === 'success') setLogs(res.data.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const getActionIcon = (action) => {
    if (action.includes('login')) return { icon: '🔑', color: 'bg-blue-50 text-blue-600 border-blue-200' };
    if (action.includes('logout')) return { icon: '🚪', color: 'bg-slate-50 text-slate-600 border-slate-200' };
    if (action.includes('create') || action.includes('add')) return { icon: '➕', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' };
    if (action.includes('delete') || action.includes('remove')) return { icon: '🗑️', color: 'bg-red-50 text-red-600 border-red-200' };
    if (action.includes('update') || action.includes('edit')) return { icon: '✏️', color: 'bg-amber-50 text-amber-600 border-amber-200' };
    if (action.includes('attendance')) return { icon: '📋', color: 'bg-purple-50 text-purple-600 border-purple-200' };
    return { icon: '📝', color: 'bg-gray-50 text-gray-600 border-gray-200' };
  };

  const filteredLogs = logs.filter(log =>
    (log.action?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (log.user_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (log.details?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden mt-2">
      <div className="bg-gradient-to-r from-slate-100 to-gray-100 px-8 py-8 border-b border-gray-200/50">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-600 shadow-md border border-slate-50">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Audit Log</h2>
              <p className="mt-1 text-slate-500 font-medium">Complete activity history and system actions</p>
            </div>
          </div>
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search logs..." className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm text-sm font-medium focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none" />
          </div>
        </div>
      </div>

      <div className="p-8">
        {loading ? (
          <div className="flex justify-center items-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-600"></div></div>
        ) : filteredLogs.length > 0 ? (
          <div className="space-y-3">
            {filteredLogs.map(log => {
              const { icon, color } = getActionIcon(log.action);
              return (
                <div key={log.id} className={`flex items-start gap-4 p-4 rounded-2xl border ${color} transition-all hover:shadow-sm`}>
                  <div className="text-xl shrink-0 mt-0.5">{icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-slate-800">{log.action}</p>
                    {log.details && <p className="text-sm text-slate-500 mt-0.5">{log.details}</p>}
                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                      {log.user_name && (
                        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                          {log.user_name} ({log.user_role})
                        </span>
                      )}
                      {log.ip_address && (
                        <span className="text-xs text-slate-400 font-mono">{log.ip_address}</span>
                      )}
                      <span className="text-xs text-slate-400 font-medium">{new Date(log.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl font-bold text-slate-600">No audit logs found</p>
            <p className="text-slate-400 mt-2">System activity will be logged here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLog;
