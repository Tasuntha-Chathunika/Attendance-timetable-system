import { useState } from 'react';

import Logo from './Logo';
import api from '../services/api';

const Login = ({ onNavigateToHome, onNavigateToRegister, onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);
        setIsLoading(true);

        try {
            const response = await api.post('/login.php', { username, password });

            if (response.data.status === 'success') {
                setMessage('Login Successful!');
                sessionStorage.setItem('user', JSON.stringify(response.data.user));
                
                setTimeout(() => {
                    if (onLoginSuccess) {
                        onLoginSuccess(response.data.user);
                    } else {
                        alert(`Welcome ${response.data.user.full_name}! (Role: ${response.data.user.role})`);
                    }
                }, 500);
            } else {
                setIsError(true);
                setMessage(response.data.message);
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Login error:", error);
            setIsError(true);
            setMessage("Server connection failed.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex w-full bg-slate-50 font-sans relative">
            {/* Back to Home Button (Floating) */}
            <button 
                onClick={onNavigateToHome}
                className="absolute top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white font-medium transition-all shadow-lg hover:-translate-x-1"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Home
            </button>

            {/* Left Image Side */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-indigo-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 to-purple-900/90 z-10 mix-blend-multiply"></div>
                <img 
                    src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80" 
                    alt="Technology Abstract" 
                    className="absolute inset-0 w-full h-full object-cover z-0"
                />
                <div className="relative z-20 flex flex-col justify-center items-center text-center p-16 h-full text-white">
                    <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl flex items-center justify-center mb-8 border border-white/20 transform -rotate-3">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path></svg>
                    </div>
                    <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">Welcome to <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300">ATMS</span></h1>
                    <p className="text-lg font-medium text-indigo-100 max-w-md leading-relaxed opacity-90">
                        The ultimate enterprise attendance and timetable management system. 
                        Streamline your academic scheduling today.
                    </p>
                </div>
            </div>

            {/* Right Form Side */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative overflow-hidden">
                {/* Decorative background blobs for the right side */}
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 rounded-full bg-purple-200/50 opacity-40 blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 rounded-full bg-indigo-200/50 opacity-40 blur-3xl pointer-events-none"></div>

                <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/50 p-10 relative z-10 animate-fade-in-up">
                    
                    {/* Mobile Logo (Visible only on small screens) */}
                    <div className="lg:hidden flex flex-col items-center mb-8">
                        <Logo className="w-16 h-16" textClassName="text-4xl" />
                    </div>

                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">Sign In</h2>
                        <p className="text-slate-500 font-medium">Please enter your credentials to continue</p>
                    </div>

                    {message && (
                        <div className={`p-4 mb-8 text-sm font-bold rounded-xl flex items-center border ${isError ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'} animate-fade-in-up`}>
                            {isError ? (
                                <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
                            ) : (
                                <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                            )}
                            {message}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleLogin} autoComplete="off">
                        <div className="space-y-5">
                            <div className="relative group">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Username or Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                    </div>
                                    <input 
                                        type="text" 
                                        autoComplete="off"
                                        required 
                                        value={username} 
                                        onChange={(e) => setUsername(e.target.value)} 
                                        className="block w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 bg-slate-50 focus:bg-white transition-all text-slate-800 font-medium placeholder-slate-400" 
                                        placeholder="Enter your username"
                                    />
                                </div>
                            </div>
                            <div className="relative group">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                    </div>
                                    <input 
                                        type="password" 
                                        autoComplete="new-password"
                                        required 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        className="block w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 bg-slate-50 focus:bg-white transition-all text-slate-800 font-medium placeholder-slate-400" 
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className={`w-full flex justify-center items-center py-4 px-4 rounded-xl shadow-lg shadow-indigo-500/30 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-300 hover:-translate-y-0.5 ${isLoading ? 'opacity-80 cursor-not-allowed' : 'hover:shadow-indigo-500/50'}`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Signing In...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-sm font-medium text-slate-500">
                            Don't have an account?{' '}
                            <button 
                                onClick={onNavigateToRegister} 
                                className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors focus:outline-none focus:underline"
                            >
                                Create an account
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;