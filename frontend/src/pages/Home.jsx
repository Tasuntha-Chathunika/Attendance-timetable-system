import React from 'react';

// Me functions deka prop widihata App.jsx eken labenawa
const Home = ({ onNavigateToLogin, onNavigateToRegister }) => {
    return (
        <div className="min-h-screen bg-gray-50">

            {/* Navigation Bar */}
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="text-2xl font-bold text-blue-600">🎓 ATMS</div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={onNavigateToLogin}
                            className="text-gray-700 hover:text-blue-600 font-medium transition"
                        >
                            Login
                        </button>
                        <button
                            onClick={onNavigateToRegister}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Register
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-6 py-20 md:py-32">
                <div className="grid md:grid-cols-2 gap-12 items-center">

                    {/* Left Side: Text & Buttons */}
                    <div className="space-y-6">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                            Smart Attendance & <span className="text-blue-600">Timetable</span> Management.
                        </h1>
                        <p className="text-xl text-gray-600 max-w-lg">
                            A modern platform designed to streamline student tracking and scheduling for educational institutions. Fast, reliable, and user-friendly.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                onClick={onNavigateToLogin}
                                className="bg-blue-600 text-white text-lg px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-150 font-semibold shadow-md flex items-center justify-center"
                            >
                                Go to Login
                            </button>
                            <button
                                onClick={onNavigateToRegister}
                                className="bg-white text-gray-900 text-lg px-8 py-3 rounded-lg hover:bg-gray-200 transition duration-150 font-semibold border border-gray-300 shadow-sm flex items-center justify-center"
                            >
                                Create Account
                            </button>
                        </div>
                    </div>

                    {/* Right Side: Simple Design Element */}
                    <div className="bg-blue-100 h-96 rounded-3xl flex items-center justify-center p-10 shadow-inner">
                        <div className='space-y-4 text-center'>
                            <div className='text-6xl'>🗓️</div>
                            <div className='text-2xl font-bold text-blue-900'>Real-time Tracking</div>
                        </div>
                    </div>

                </div>
            </main>

        </div>
    );
};

export default Home;