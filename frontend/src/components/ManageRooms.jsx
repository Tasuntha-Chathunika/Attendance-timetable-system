import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost/Attendance-timetable-system/backend/api';

const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({ room_name: '', building: '', capacity: '' });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => { fetchRooms(); }, []);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/manage_rooms.php`);
      if (res.data.status === 'success') setRooms(res.data.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = editingRoom 
        ? { action: 'update', id: editingRoom.id, ...formData }
        : { action: 'add', ...formData };
      const res = await axios.post(`${API_URL}/manage_rooms.php`, payload);
      if (res.data.status === 'success') {
        setMessage({ type: 'success', text: res.data.message });
        fetchRooms();
        resetForm();
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save room.' });
    }
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this room?')) return;
    try {
      const res = await axios.post(`${API_URL}/manage_rooms.php`, { action: 'delete', id });
      if (res.data.status === 'success') {
        setMessage({ type: 'success', text: 'Room deleted.' });
        fetchRooms();
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete room.' });
    }
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const startEdit = (room) => {
    setEditingRoom(room);
    setFormData({ room_name: room.room_name, building: room.building || '', capacity: room.capacity || '' });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ room_name: '', building: '', capacity: '' });
    setEditingRoom(null);
    setShowForm(false);
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden mt-2">
      <div className="bg-gradient-to-r from-cyan-50 to-teal-50 px-8 py-8 border-b border-cyan-100/50">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-cyan-600 shadow-md border border-cyan-50">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Room Management</h2>
              <p className="mt-1 text-slate-500 font-medium">Manage lecture halls, labs, and venue allocations</p>
            </div>
          </div>
          <button onClick={() => { resetForm(); setShowForm(!showForm); }} className={`px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center gap-2 ${showForm ? 'bg-slate-600 text-white' : 'bg-cyan-600 text-white shadow-cyan-500/30 hover:bg-cyan-700'}`}>
            {showForm ? <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg> Cancel</> : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg> Add Room</>}
          </button>
        </div>
      </div>

      <div className="p-8">
        {message.text && (
          <div className={`p-4 mb-6 rounded-xl flex items-center gap-3 shadow-md border ${message.type === 'error' ? 'bg-red-50 text-red-800 border-red-200' : 'bg-green-50 text-green-800 border-green-200'}`}>
            <span className="font-semibold">{message.text}</span>
          </div>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-6 space-y-4">
            <h4 className="font-bold text-slate-800">{editingRoom ? 'Edit Room' : 'Add New Room'}</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Room Name *</label>
                <input type="text" value={formData.room_name} onChange={e => setFormData({ ...formData, room_name: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none" required placeholder="e.g. Hall A" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Building</label>
                <input type="text" value={formData.building} onChange={e => setFormData({ ...formData, building: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none" placeholder="e.g. Main Block" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Capacity</label>
                <input type="number" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none" placeholder="e.g. 60" />
              </div>
            </div>
            <button type="submit" className="px-8 py-3 bg-cyan-600 text-white font-bold rounded-xl hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-500/30">
              {editingRoom ? 'Update Room' : 'Add Room'}
            </button>
          </form>
        )}

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map(room => (
            <div key={room.id} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all group">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center text-cyan-600 mb-4 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => startEdit(room)} className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                  </button>
                  <button onClick={() => handleDelete(room.id)} className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-800">{room.room_name}</h3>
              {room.building && <p className="text-sm text-slate-500 font-medium mt-1">{room.building}</p>}
              {room.capacity > 0 && (
                <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                  <span className="font-semibold">Capacity: {room.capacity}</span>
                </div>
              )}
            </div>
          ))}
          {rooms.length === 0 && !loading && (
            <div className="col-span-full text-center py-16">
              <p className="text-xl font-bold text-slate-600">No rooms added yet</p>
              <p className="text-slate-400 mt-2">Click "Add Room" to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageRooms;
