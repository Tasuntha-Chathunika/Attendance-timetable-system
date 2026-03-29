import { useState } from 'react'
import Home from './pages/Home' // Home Page eka import kireema
import Login from './components/Login'
import Register from './components/Register'

function App() {
  // Page eka maru karanna hadana State eka (Dan string ekak use karanawa)
  // 'home', 'login', or 'register'
  const [currentPage, setCurrentPage] = useState('home');

  // Page ekata yanna udaw wena wrapper function
  const navigateTo = (pageName) => {
    setCurrentPage(pageName);
  }

  return (
    <div className="relative min-h-screen bg-gray-100">

      {/* CurrentPage eka anuwa component eka wenas kireema */}
      {currentPage === 'home' && (
        <Home
          onNavigateToLogin={() => navigateTo('login')}
          onNavigateToRegister={() => navigateTo('register')}
        />
      )}

      {currentPage === 'login' && <Login />}
      {currentPage === 'register' && <Register />}

      {/* Page Login hari Register hari nam, Home ekata yanna back button ekak */}
      {currentPage !== 'home' && (
        <div className="absolute top-5 left-5">
          <button
            onClick={() => navigateTo('home')}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Back to Home
          </button>
        </div>
      )}

    </div>
  )
}

export default App