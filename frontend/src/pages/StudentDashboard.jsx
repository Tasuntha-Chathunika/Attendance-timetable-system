import React from 'react';

const StudentDashboard = ({ user, onLogout }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-purple-700 p-4 text-white flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">ATMS - Student Portal</h1>
        <div className="flex items-center gap-4">
          <span className="font-medium">{user.full_name}</span>
          <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-sm font-bold transition">Logout</button>
        </div>
      </nav>

      <div className="p-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Hello, {user.full_name}! 👨🎓</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-800">My Timetable</h3>
              <p className="text-gray-600">View your weekly class schedule.</p>
            </div>
            <div className="text-4xl">📅</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between border-2 border-yellow-400 bg-yellow-50">
            <div>
              <h3 className="text-xl font-bold text-yellow-800">Overall Attendance</h3>
              <p className="text-yellow-700">Your current attendance percentage.</p>
            </div>
            <div className="text-4xl font-extrabold text-yellow-600">85%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
