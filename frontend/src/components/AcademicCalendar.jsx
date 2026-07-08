import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost/Attendance-timetable-system/backend/api';

const AcademicCalendar = ({ user, isAdmin = false }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', event_date: '', event_type: 'event' });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => { fetchEvents(); }, [currentMonth, currentYear]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/manage_events.php?month=${currentMonth}&year=${currentYear}`);
      if (res.data.status === 'success') setEvents(res.data.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/manage_events.php`, { action: 'add', ...formData, created_by: user.id });
      if (res.data.status === 'success') {
        setMessage({ type: 'success', text: 'Event added!' });
        fetchEvents();
        setShowForm(false);
        setFormData({ title: '', description: '', event_date: '', event_type: 'event' });
      }
    } catch (err) { setMessage({ type: 'error', text: 'Failed to add event.' }); }
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleDelete = async (id) => {
    try {
      await axios.post(`${API_URL}/manage_events.php`, { action: 'delete', id });
      fetchEvents();
    } catch (err) { console.error(err); }
  };

  const navigateMonth = (dir) => {
    let m = currentMonth + dir;
    let y = currentYear;
    if (m > 12) { m = 1; y++; }
    if (m < 1) { m = 12; y--; }
    setCurrentMonth(m);
    setCurrentYear(y);
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = [
    { label: 'Sun', color: 'text-rose-500 bg-rose-50' },
    { label: 'Mon', color: 'text-blue-500 bg-blue-50' },
    { label: 'Tue', color: 'text-purple-500 bg-purple-50' },
    { label: 'Wed', color: 'text-emerald-500 bg-emerald-50' },
    { label: 'Thu', color: 'text-amber-500 bg-amber-50' },
    { label: 'Fri', color: 'text-cyan-500 bg-cyan-50' },
    { label: 'Sat', color: 'text-indigo-500 bg-indigo-50' }
  ];

  const getTypeStyle = (type, isSolid = false) => {
    switch (type) {
      case 'exam': return isSolid ? { bg: 'bg-gradient-to-r from-red-400 to-rose-400 text-white shadow-sm shadow-red-100' } : { bg: 'bg-red-50/50', border: 'border-red-200', text: 'text-red-500', dot: 'bg-red-400', label: '📝 Exam' };
      case 'holiday': return isSolid ? { bg: 'bg-gradient-to-r from-emerald-300 to-teal-400 text-white shadow-sm shadow-emerald-100' } : { bg: 'bg-emerald-50/50', border: 'border-emerald-200', text: 'text-emerald-600', dot: 'bg-emerald-400', label: '🏖️ Holiday' };
      case 'deadline': return isSolid ? { bg: 'bg-gradient-to-r from-amber-300 to-orange-400 text-white shadow-sm shadow-amber-100' } : { bg: 'bg-amber-50/50', border: 'border-amber-200', text: 'text-amber-500', dot: 'bg-amber-400', label: '⏰ Deadline' };
      case 'event': return isSolid ? { bg: 'bg-gradient-to-r from-blue-400 to-indigo-400 text-white shadow-sm shadow-blue-100' } : { bg: 'bg-blue-50/50', border: 'border-blue-200', text: 'text-blue-500', dot: 'bg-blue-400', label: '🎉 Event' };
      default: return isSolid ? { bg: 'bg-gradient-to-r from-slate-400 to-gray-400 text-white shadow-sm shadow-slate-100' } : { bg: 'bg-slate-50/50', border: 'border-slate-200', text: 'text-slate-500', dot: 'bg-slate-400', label: '📌 Other' };
    }
  };

  // Build calendar grid
  const firstDay = new Date(currentYear, currentMonth - 1, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const getEventsForDay = (day) => {
    const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.event_date === dateStr);
  };

  const today = new Date();
  const isToday = (day) => day === today.getDate() && currentMonth === today.getMonth() + 1 && currentYear === today.getFullYear();

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 overflow-hidden mt-2">
      <div className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 px-4 py-4 relative overflow-hidden">
        {/* Colorful decorative circles */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center text-white shadow-xl border border-white/30 transform -rotate-3">
              <svg className="w-5 h-5 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight drop-shadow-md">Academic Calendar</h2>
              <p className="text-white/80 font-medium text-sm mt-0.5">Manage terms, holidays, and important events.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg p-1">
              <button onClick={() => navigateMonth(-1)} className="px-3 py-2 text-white hover:bg-white/20 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
              </button>
              <span className="px-4 py-2 font-black text-white text-base min-w-[160px] text-center tracking-wide uppercase">{monthNames[currentMonth - 1]} {currentYear}</span>
              <button onClick={() => navigateMonth(1)} className="px-3 py-2 text-white hover:bg-white/20 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </button>
            </div>
            {isAdmin && (
              <button onClick={() => setShowForm(!showForm)} className={`px-5 py-3 rounded-xl font-extrabold text-sm transition-all shadow-xl flex items-center gap-2 ${showForm ? 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-md border border-white/30' : 'bg-white text-violet-600 hover:bg-violet-50 hover:scale-105 transform'}`}>
                {showForm ? 'Cancel' : '+ Add Event'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-3 md:p-4 bg-slate-50/50">
        {message.text && (
          <div className={`p-4 mb-4 rounded-2xl font-bold shadow-md flex items-center gap-3 ${message.type === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
            <span className="text-xl">{message.type === 'error' ? '❌' : '✅'}</span>
            {message.text}
          </div>
        )}

        {showForm && isAdmin && (
          <form onSubmit={handleSubmit} className="bg-white border-2 border-violet-200 rounded-2xl p-4 mb-4 space-y-3 shadow-xl shadow-violet-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-500 to-fuchsia-500"></div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Create New Event</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-violet-600 uppercase mb-1">Event Title *</label>
                <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-1.5 border-2 border-gray-100 rounded-lg text-sm font-bold focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20 outline-none transition-all text-slate-700" required placeholder="E.g., Mid-Term Exam" />
              </div>
              <div>
                <label className="block text-xs font-black text-violet-600 uppercase mb-1">Date *</label>
                <input type="date" value={formData.event_date} onChange={e => setFormData({ ...formData, event_date: e.target.value })} className="w-full px-3 py-1.5 border-2 border-gray-100 rounded-lg text-sm font-bold focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20 outline-none transition-all text-slate-700" required />
              </div>
              <div>
                <label className="block text-xs font-black text-violet-600 uppercase mb-1">Category</label>
                <select value={formData.event_type} onChange={e => setFormData({ ...formData, event_type: e.target.value })} className="w-full px-3 py-1.5 border-2 border-gray-100 rounded-lg text-sm font-bold focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20 outline-none transition-all cursor-pointer text-slate-700">
                  <option value="event">🎉 Event</option>
                  <option value="exam">📝 Exam</option>
                  <option value="holiday">🏖️ Holiday</option>
                  <option value="deadline">⏰ Deadline</option>
                  <option value="other">📌 Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-violet-600 uppercase mb-1">Description</label>
                <input type="text" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-1.5 border-2 border-gray-100 rounded-lg text-sm font-bold focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20 outline-none transition-all text-slate-700" placeholder="Optional details..." />
              </div>
            </div>
            <div className="flex justify-end pt-1">
              <button type="submit" disabled={loading} className="w-full bg-violet-600 hover:bg-violet-700 text-white font-black py-2 px-6 rounded-lg transition-all shadow-lg hover:shadow-violet-500/40 active:scale-95 text-sm">Save Event ✨</button>
            </div>
          </form>
        )}

        <div className="flex flex-col xl:flex-row gap-6">
          {/* Left Column: Calendar Grid */}
          <div className="flex-1 flex flex-col">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 mb-4 flex-1">
              <div className="grid grid-cols-7 gap-1 md:gap-2 mb-4">
                {dayNames.map((d, i) => (
                  <div key={d.label} className={`text-center py-1.5 md:py-2 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-wider ${d.color} shadow-sm border border-black/5`}>
                    {d.label}
                  </div>
                ))}

                {calendarDays.map((day, idx) => {
                  if (!day) return <div key={`empty-${idx}`} className="min-h-[70px] md:min-h-[90px] rounded-2xl bg-slate-200/60 border border-dashed border-slate-300"></div>;

                  const dayEvents = getEventsForDay(day);
                  const hasEvents = dayEvents.length > 0;

                  return (
                    <div key={day} className={`min-h-[70px] md:min-h-[90px] border-2 rounded-2xl p-1.5 md:p-2 transition-all duration-300 group relative flex flex-col 
                      ${isToday(day) ? 'bg-gradient-to-br from-indigo-400 to-purple-400 border-transparent shadow-lg shadow-indigo-200/50 transform hover:-translate-y-1' :
                        hasEvents ? 'bg-violet-100 border-violet-300 hover:border-violet-400 hover:bg-violet-200 hover:shadow-md' :
                          'bg-slate-100 border-slate-300 hover:border-slate-400 hover:bg-slate-200'}`}>

                      <div className="flex justify-between items-start mb-2">
                        <span className={`flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-full text-xs font-black
                          ${isToday(day) ? 'bg-white text-indigo-500 shadow-sm' :
                            hasEvents ? 'bg-violet-200 text-violet-800' : 'text-slate-700'}`}>
                          {day}
                        </span>
                        {hasEvents && !isToday(day) && (
                          <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"></span>
                        )}
                      </div>

                      <div className="flex-1 flex flex-col gap-1.5 overflow-hidden">
                        {dayEvents.slice(0, 3).map(ev => {
                          const solidStyle = getTypeStyle(ev.event_type, true);
                          return (
                            <div key={ev.id} className={`text-[10px] md:text-xs font-bold px-2 py-1 rounded-lg truncate transition-transform hover:scale-[1.02] cursor-default ${solidStyle.bg}`} title={ev.title}>
                              {ev.title}
                            </div>
                          );
                        })}
                        {dayEvents.length > 3 && (
                          <span className={`text-[10px] font-black mt-1 ${isToday(day) ? 'text-white/80' : 'text-violet-400'}`}>
                            +{dayEvents.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Event List */}
          <div className="w-full xl:w-80 flex flex-col bg-white rounded-3xl shadow-sm border border-gray-100 p-5 max-h-[600px] overflow-hidden">
            <h4 className="text-2xl font-black text-slate-800 mb-4">✨ Highlights</h4>

            {events.length === 0 ? (
              <div className="flex-1 flex items-center justify-center bg-slate-50 rounded-2xl border border-dashed border-gray-200 p-8">
                <p className="text-slate-500 font-bold">No events scheduled.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {events.map(ev => {
                  const s = getTypeStyle(ev.event_type);
                  return (
                    <div key={ev.id} className={`flex items-start gap-4 p-4 rounded-2xl border-2 ${s.border} bg-gray-50 transition-all hover:shadow-md group`}>
                      <div className="flex-1 min-w-0">
                        <p className="font-extrabold text-slate-800 text-md truncate">{ev.title}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-slate-500">{new Date(ev.event_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                          <span className={`text-[10px] font-black ${s.text} px-2 py-0.5 rounded-full bg-white border ${s.border}`}>
                            {s.label.split(' ')[0]}
                          </span>
                        </div>
                      </div>
                      {isAdmin && (
                        <button onClick={() => handleDelete(ev.id)} className="text-red-300 hover:text-red-500 transition-colors mt-1">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicCalendar;
