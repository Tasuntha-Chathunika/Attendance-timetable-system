import { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './pages/AdminDashboard';
import LecturerDashboard from './pages/LecturerDashboard';
import StudentDashboard from './pages/StudentDashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);

  // App eka load weddi localStorage eke kalin log wechcha user kenek innawada kiyala balanawa
  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  // Login form eken success unama me function eka wada karanawa
  const handleLoginSuccess = (userData) => {
    setUser(userData); // Userwa state ekata danawa, ethakota auto dashboard ekata yanawa
  };

  // Logout weddi localStorage eken userwa makala, aye login page ekata yawanawa
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setCurrentPage('login');
  };

  // 1. User kenek log wela innawa nam, eyage role eka balala dashboard ekata yawanawa
  if (user) {
    if (user.role === 'admin') return <AdminDashboard user={user} onLogout={handleLogout} />;
    if (user.role === 'lecturer') return <LecturerDashboard user={user} onLogout={handleLogout} />;
    if (user.role === 'student') return <StudentDashboard user={user} onLogout={handleLogout} />;
  }

  // 2. User kenek log wela natham, Login hari Register hari pennanawa
  return (
    <div className="min-h-screen bg-gray-100">
      {currentPage === 'login' && (
        <Login 
          onNavigateToRegister={() => setCurrentPage('register')} 
          onLoginSuccess={handleLoginSuccess} 
        />
      )}
      
      {currentPage === 'register' && (
        <Register 
          onNavigateToLogin={() => setCurrentPage('login')} 
        />
      )}
    </div>
  );
}

export default App;