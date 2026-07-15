import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageUsers = ({ loggedInUser }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  
  // Custom Modal State
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, userId: null, userName: '' });
  const [userModal, setUserModal] = useState({ 
    isOpen: false, 
    mode: 'add', // 'add' or 'edit'
    id: null, 
    full_name: '', 
    username: '', 
    email: '', 
    role: 'student', 
    password: '' 
  });

  const API_URL = 'http://localhost/Attendance-timetable-system/backend/api';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/get_users.php`);
      if (response.data.status === 'success') {
        setUsers(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage({ type: 'error', text: 'Failed to load users.' });
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id, name) => {
    setDeleteModal({ isOpen: true, userId: id, userName: name });
  };

  const executeDelete = async () => {
    if (!deleteModal.userId) return;

    try {
      const response = await axios.post(`${API_URL}/delete_user.php`, { 
        id: deleteModal.userId,
        admin_id: loggedInUser.id // Passing the logged in admin's ID for security validation
      });
      
      if (response.data.status === 'success') {
        setMessage({ type: 'success', text: response.data.message });
        fetchUsers(); // Refresh list
      } else {
        setMessage({ type: 'error', text: response.data.message });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to delete user.' });
    }
    
    // Close modal
    setDeleteModal({ isOpen: false, userId: null, userName: '' });
    
    // Auto clear success message after 3 seconds
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const openAddModal = () => {
    setUserModal({
      isOpen: true,
      mode: 'add',
      id: null,
      full_name: '',
      username: '',
      email: '',
      role: 'student',
      password: ''
    });
  };

  const openEditModal = (user) => {
    setUserModal({
      isOpen: true,
      mode: 'edit',
      id: user.id,
      full_name: user.full_name,
      username: user.username,
      email: user.email,
      role: user.role,
      password: '' // Don't show existing password
    });
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    
    // Validations
    if (!userModal.email.toLowerCase().endsWith('@gmail.com')) {
      setMessage({ type: 'error', text: 'Email must be a @gmail.com address.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }
    
    if (userModal.password && userModal.password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }

    setLoading(true);
    
    try {
      if (userModal.mode === 'add') {
        const response = await axios.post(`${API_URL}/register.php`, {
          fullName: userModal.full_name,
          username: userModal.username,
          email: userModal.email,
          password: userModal.password,
          role: userModal.role
        });
        if (response.data.status === 'success') {
          setMessage({ type: 'success', text: 'User added successfully!' });
          fetchUsers();
          setUserModal({ ...userModal, isOpen: false });
        } else {
          setMessage({ type: 'error', text: response.data.message });
        }
      } else {
        const response = await axios.post(`${API_URL}/edit_user.php`, {
          id: userModal.id,
          full_name: userModal.full_name,
          username: userModal.username,
          email: userModal.email,
          role: userModal.role,
          password: userModal.password, // Optional
          admin_id: loggedInUser.id
        });
        if (response.data.status === 'success') {
          setMessage({ type: 'success', text: 'User updated successfully!' });
          fetchUsers();
          setUserModal({ ...userModal, isOpen: false });
        } else {
          setMessage({ type: 'error', text: response.data.message });
        }
      }
    } catch (error) {
      console.error('Error saving user:', error);
      setMessage({ type: 'error', text: 'An error occurred while saving.' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden mt-2 min-h-[600px] flex flex-col">
      {/* Global Message Alert */}
      {message.text && (
        <div className={`mx-8 mt-8 p-4 rounded-xl flex justify-between items-center shadow-md border backdrop-blur-md animate-fade-in-up ${message.type === 'error' ? 'bg-red-50 text-red-800 border-red-200' : 'bg-green-50 text-green-800 border-green-200'}`}>
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

      {!userModal.isOpen ? (
        <div className="flex-1 flex flex-col animate-fade-in">
          {/* Premium Colorful Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 px-8 py-10 border-b border-indigo-700/50 shadow-inner relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-purple-400 opacity-10 blur-3xl"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white shadow-lg border border-white/30">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                </div>
                <div>
                  <h2 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">User Directory</h2>
                  <p className="mt-1 text-indigo-100 font-medium">Manage students, lecturers, and system administrators.</p>
                </div>
              </div>
              
              {/* Filters and Search */}
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="relative">
                  <select 
                    className="appearance-none w-full sm:w-48 bg-white/10 backdrop-blur-md border border-white/20 text-white py-3 pl-4 pr-10 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all font-medium cursor-pointer [&>option]:text-slate-800"
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                  >
                    <option value="all">All Roles</option>
                    <option value="student">Students</option>
                    <option value="lecturer">Lecturers</option>
                    <option value="admin">Admins</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
                <div className="relative w-full sm:w-64">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  </div>
                  <input
                    type="text"
                    className="w-full pl-11 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all font-medium placeholder-indigo-200"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button 
                  onClick={openAddModal}
                  className="group relative flex items-center justify-center gap-2 bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-400 hover:to-pink-400 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-pink-500/40 transform hover:-translate-y-1 w-full sm:w-auto overflow-hidden border border-pink-400/50"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                  <svg className="w-5 h-5 relative z-10 group-hover:rotate-90 transition-transform duration-300 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                  <span className="relative z-10 drop-shadow-md">Add New User</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* User Table */}
            <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm bg-white">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-slate-50">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">User Info</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Username</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Joined</th>
                      <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-50">
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-16 text-center">
                          <div className="flex flex-col justify-center items-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
                            <p className="font-medium text-slate-500">Loading directory...</p>
                          </div>
                        </td>
                      </tr>
                    ) : filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => {
                        const isSelf = user.id === loggedInUser?.id;
                        
                        return (
                          <tr key={user.id} className={`hover:bg-slate-50/80 transition-colors group ${isSelf ? 'bg-indigo-50/30' : ''}`}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-12 w-12 flex-shrink-0 relative">
                                  <img 
                                    src={`https://ui-avatars.com/api/?name=${user.full_name}&background=random&color=fff&bold=true&rounded=true`} 
                                    alt={user.full_name}
                                    className="h-12 w-12 rounded-full border-2 border-white shadow-sm group-hover:scale-105 transition-transform"
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                    {user.full_name}
                                    {isSelf && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 uppercase tracking-wide">You</span>}
                                  </div>
                                  <div className="text-sm text-slate-500 font-medium">{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-slate-600 font-semibold bg-slate-100 px-3 py-1.5 rounded-lg inline-block">@{user.username}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1.5 inline-flex text-xs font-bold rounded-full shadow-sm border ${
                                user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                user.role === 'lecturer' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-teal-50 text-teal-700 border-teal-200'
                              }`}>
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">
                              {new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              {isSelf ? (
                                <span className="text-slate-400 text-xs italic px-3 py-1.5" title="You cannot delete yourself">Current User</span>
                              ) : (
                                <div className="flex justify-end gap-2">
                                  <button 
                                    onClick={() => openEditModal(user)}
                                    className="group relative inline-flex items-center justify-center w-10 h-10 border border-blue-100 rounded-xl text-blue-500 bg-blue-50 hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-sm hover:shadow-md"
                                    aria-label="Edit user"
                                  >
                                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                    
                                    <span className="absolute bottom-full right-1/2 translate-x-1/2 mb-2 w-max px-2.5 py-1 bg-slate-800 text-white text-xs font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg z-10">
                                      Edit User
                                      <svg className="absolute top-full left-1/2 -translate-x-1/2 text-slate-800 h-2 w-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"></polygon></svg>
                                    </span>
                                  </button>
                                  <button 
                                    onClick={() => confirmDelete(user.id, user.full_name)}
                                    className="group relative inline-flex items-center justify-center w-10 h-10 border border-red-100 rounded-xl text-red-500 bg-red-50 hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all shadow-sm hover:shadow-md"
                                    aria-label="Delete user"
                                  >
                                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    
                                    <span className="absolute bottom-full right-1/2 translate-x-1/2 mb-2 w-max px-2.5 py-1 bg-slate-800 text-white text-xs font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg z-10">
                                      Delete User
                                      <svg className="absolute top-full left-1/2 -translate-x-1/2 text-slate-800 h-2 w-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"></polygon></svg>
                                    </span>
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-20 text-center text-slate-500 bg-slate-50">
                          <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
                              <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                            </div>
                            <span className="text-xl font-bold text-slate-700">No users found</span>
                            <p className="text-slate-500 mt-2 font-medium">Try adjusting your search or filters.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col animate-fade-in bg-slate-50/50">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 px-8 py-6 border-b border-indigo-700/50 flex justify-between items-center shrink-0 shadow-md z-10 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white opacity-5 blur-2xl"></div>
              <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-pink-400 opacity-20 blur-3xl"></div>
            </div>
            
            <div className="flex items-center gap-4 relative z-10">
              <button 
                onClick={() => setUserModal({ ...userModal, isOpen: false })} 
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/20 text-white hover:bg-white/30 transition-all border border-white/30 hover:border-white/50 shadow-sm backdrop-blur-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              </button>
              <div>
                <h3 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3 drop-shadow-sm">
                  {userModal.mode === 'add' ? 'Add New User' : 'Edit User Details'}
                </h3>
                <p className="text-indigo-100 font-medium mt-1">
                  {userModal.mode === 'add' ? 'Create a new account in the system.' : 'Update the existing user information below.'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 sm:p-6 flex-1 overflow-y-auto bg-slate-50/50">
            <form onSubmit={handleUserSubmit} className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl shadow-indigo-100/50 border border-indigo-50 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 p-1">
                <div className="bg-white rounded-t-[15px] p-6 sm:p-8 border-b border-slate-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    </div>
                    <h4 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">User Information</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Full Name</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        </div>
                        <input 
                          type="text" 
                          required 
                          value={userModal.full_name} 
                          onChange={(e) => setUserModal({...userModal, full_name: e.target.value})}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white focus:border-purple-500 transition-all text-slate-800 font-semibold shadow-sm"
                          placeholder="e.g. John Doe"
                        />
                      </div>
                    </div>
                    
                    {/* Username */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Username</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-indigo-400 font-bold group-focus-within:text-indigo-600 transition-colors">@</div>
                        <input 
                          type="text" 
                          required 
                          value={userModal.username} 
                          onChange={(e) => setUserModal({...userModal, username: e.target.value})}
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white focus:border-purple-500 transition-all text-slate-800 font-semibold shadow-sm"
                          placeholder="johndoe"
                        />
                      </div>
                    </div>
                    
                    {/* Role */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Role</label>
                      <div className="relative group">
                        <select 
                          value={userModal.role} 
                          onChange={(e) => setUserModal({...userModal, role: e.target.value})}
                          className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white focus:border-purple-500 transition-all text-slate-800 font-semibold appearance-none cursor-pointer shadow-sm"
                        >
                          <option value="student">🎓 Student</option>
                          <option value="lecturer">👨‍🏫 Lecturer</option>
                          <option value="admin">🛡️ Administrator</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Email Address</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        </div>
                        <input 
                          type="email" 
                          required 
                          pattern=".*@gmail\.com$"
                          title="Please provide a valid @gmail.com address"
                          value={userModal.email} 
                          onChange={(e) => setUserModal({...userModal, email: e.target.value})}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white focus:border-purple-500 transition-all text-slate-800 font-semibold shadow-sm"
                          placeholder="john@gmail.com"
                        />
                      </div>
                    </div>
                    
                    {/* Password */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                        Password {userModal.mode === 'edit' && <span className="text-slate-400 font-medium normal-case">(Optional)</span>}
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        </div>
                        <input 
                          type="password" 
                          required={userModal.mode === 'add'} 
                          minLength="6"
                          title="Password must be at least 6 characters long"
                          value={userModal.password} 
                          onChange={(e) => setUserModal({...userModal, password: e.target.value})}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white focus:border-purple-500 transition-all text-slate-800 font-bold tracking-widest shadow-sm"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-5 bg-slate-50 flex justify-end gap-3 shrink-0">
                <button 
                  type="button" 
                  onClick={() => setUserModal({ ...userModal, isOpen: false })}
                  className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-all shadow-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-md shadow-indigo-200/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      Save User
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setDeleteModal({ isOpen: false, userId: null, userName: '' })}></div>
            
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl transform transition-all sm:max-w-md sm:w-full relative z-10 border border-slate-100 text-left sm:my-8">
              <div className="p-8 pb-6">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
              <h3 className="text-2xl font-extrabold text-center text-slate-900 mb-2">Delete User Account?</h3>
              <p className="text-center text-slate-500 font-medium">
                You are about to permanently delete <span className="text-slate-800 font-bold">{deleteModal.userName}</span>. All associated data will be removed. This action cannot be undone.
              </p>
            </div>
            
            <div className="bg-slate-50 px-8 py-5 flex gap-4 border-t border-slate-100">
              <button 
                onClick={() => setDeleteModal({ isOpen: false, userId: null, userName: '' })}
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
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
