import { useState } from 'react';
import api from '../services/api';

const Register = () => {
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState(''); // Aluthin dapu Username state eka
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('student');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);

        try {
            // PHP backend ekata data yawanawa
            const response = await api.post('/register.php', {
                fullName,
                username,
                email,
                role,
                password
            });

            if (response.data.status === 'success') {
                setMessage('Registration Successful! You can now login.');
                // Form eka his karanawa
                setFullName(''); setUsername(''); setEmail(''); setPassword(''); setRole('student');
            } else {
                setIsError(true);
                setMessage(response.data.message);
            }
        } catch (error) {
            console.error("Registration error:", error);
            setIsError(true);
            setMessage("Server connection failed. Is XAMPP running?");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 py-10">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">Create Account</h2>
                </div>

                {/* Error/Success msg pennana thana */}
                {message && (
                    <div className={`p-3 text-sm text-center rounded-md ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {message}
                    </div>
                )}

                <form className="mt-6 space-y-4" onSubmit={handleRegister}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" placeholder="John Doe" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" placeholder="johndoe123" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" placeholder="you@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <select value={role} onChange={(e) => setRole(e.target.value)} className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md bg-white">
                            <option value="student">Student</option>
                            <option value="lecturer">Lecturer</option>
                            <option value="admin">Administrator</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" placeholder="••••••••" />
                    </div>
                    <div className="pt-2">
                        <button type="submit" className="w-full px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700">Register</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;