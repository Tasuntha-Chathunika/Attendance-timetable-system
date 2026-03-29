import { useState } from 'react';

const Login = () => {
    // User gahana data allaganna State deka
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Form eka submit weddi wada karana function eka
    const handleLogin = (e) => {
        e.preventDefault(); // Page eka refresh wena eka nawaththanawa

        // Danata type karapu data tika console eke pennanawa (Issarahata meka PHP ekata yawanawa)
        console.log("Login wena data:", { username, password });
        alert(`Testing: Username eka ${username}`);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">

                {/* Header Section */}
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">ATMS Login</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Attendance & Timetable Management System
                    </p>
                </div>

                {/* Login Form */}
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4">

                        {/* Username Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Username or Email
                            </label>
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Enter your username"
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {/* Login Button */}
                    <div>
                        <button
                            type="submit"
                            className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
                        >
                            Sign in
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default Login;