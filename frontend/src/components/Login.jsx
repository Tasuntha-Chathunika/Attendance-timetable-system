import { useState } from 'react';
import api from '../services/api';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);

        try {
            // PHP API ekata yawanawa
            const response = await api.post('/login.php', { username, password });

            if (response.data.status === 'success') {
                setMessage('Login Successful!');
                localStorage.setItem('user', JSON.stringify(response.data.user)); // User wa save karanawa

                setTimeout(() => {
                    alert(`Welcome ${response.data.user.full_name}! (Role: ${response.data.user.role})`);
                }, 500);
            } else {
                setIsError(true);
                setMessage(response.data.message);
            }
        } catch (error) {
            console.error("Login error:", error);
            setIsError(true);
            setMessage("Server connection failed.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">ATMS Login</h2>
                </div>

                {message && (
                    <div className={`p-3 text-sm text-center rounded-md ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {message}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Username or Email</label>
                            <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" />
                        </div>
                    </div>
                    <div>
                        <button type="submit" className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">Sign in</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;