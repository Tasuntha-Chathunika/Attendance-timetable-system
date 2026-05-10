import React from 'react';

const LecturerDashboard = ({ user, onLogout }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-green-700 p-4 text-white flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">ATMS - Lecturer Portal</h1>
        <div className="flex items-center gap-4">
          <span className="font-medium">Mr/Ms. {user.full_name}</span>
          <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-sm font-bold transition">Logout</button>
        </div>
      </nav>

      <div className="p-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome back, Lecturer! 👨🏫</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <h3 className="text-xl font-bold text-gray-800 mb-2">My Classes Today</h3>
            <p className="text-gray-600 mb-4">View your schedule and assigned subjects for today.</p>
            <button className="bg-green-100 text-green-800 px-4 py-2 rounded font-bold hover:bg-green-200 w-full text-left">View Schedule</button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Mark Attendance</h3>
            <p className="text-gray-600 mb-4">Select a class to mark student attendance (Present/Absent).</p>
            <button className="bg-blue-100 text-blue-800 px-4 py-2 rounded font-bold hover:bg-blue-200 w-full text-left">Take Attendance</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturerDashboard;
