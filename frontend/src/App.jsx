import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './pages/AdminDashboard';
import LecturerDashboard from './pages/LecturerDashboard';
import StudentDashboard from './pages/StudentDashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);

  // App eka load weddi sessionStorage eke kalin log wechcha user kenek innawada kiyala balanawa
  useEffect(() => {
    const loggedInUser = sessionStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  // Login form eken success unama me function eka wada karanawa
  const handleLoginSuccess = (userData) => {
    setUser(userData); // Userwa state ekata danawa, ethakota auto dashboard ekata yanawa
  };

  // Logout weddi sessionStorage eken userwa makala, aye login page ekata yawanawa
  const handleLogout = () => {
    sessionStorage.removeItem('user');
    setUser(null);
    setCurrentPage('login');
  };

  // 1. User kenek log wela innawa nam, eyage role eka balala dashboard ekata yawanawa
  if (user) {
    if (user.role === 'admin') return <AdminDashboard user={user} onLogout={handleLogout} />;
    if (user.role === 'lecturer') return <LecturerDashboard user={user} onLogout={handleLogout} />;
    if (user.role === 'student') return <StudentDashboard user={user} onLogout={handleLogout} />;
  }

  // 2. User kenek log wela natham, Home, Login hari Register hari pennanawa
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {currentPage === 'home' && (
        <Home 
          onNavigateToLogin={() => setCurrentPage('login')} 
          onNavigateToRegister={() => setCurrentPage('register')}
        />
      )}

      {currentPage === 'login' && (
        <Login 
          onNavigateToHome={() => setCurrentPage('home')}
          onNavigateToRegister={() => setCurrentPage('register')} 
          onLoginSuccess={handleLoginSuccess} 
        />
      )}
      
      {currentPage === 'register' && (
        <Register 
          onNavigateToHome={() => setCurrentPage('home')}
          onNavigateToLogin={() => setCurrentPage('login')} 
        />
      )}
    </div>
  );
}

export default App;