import React from 'react';

const AdminDashboard = ({ user, onLogout }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-800 p-4 text-white flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">ATMS - Admin Portal</h1>
        <div className="flex items-center gap-4">
          <span className="font-medium">{user.full_name}</span>
          <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-sm font-bold transition">Logout</button>
        </div>
      </nav>

      <div className="p-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome, System Administrator! 🛡️</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-500">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Manage Users</h3>
            <p className="text-gray-600">Add, edit, or remove students and lecturers from the system.</p>
            <button className="mt-4 text-blue-600 font-bold hover:underline">Go to Users &rarr;</button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Manage Courses</h3>
            <p className="text-gray-600">Create new subjects and assign course codes.</p>
            <button className="mt-4 text-green-600 font-bold hover:underline">Go to Courses &rarr;</button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-purple-500">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Timetable Setup</h3>
            <p className="text-gray-600">Allocate lecturers to courses and set class times.</p>
            <button className="mt-4 text-purple-600 font-bold hover:underline">Manage Timetable &rarr;</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
