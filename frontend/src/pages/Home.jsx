import React, { useState, useEffect } from 'react';

const IMAGES = [
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1920&q=80"
];

const Home = ({ onNavigateToLogin, onNavigateToRegister }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-purple-500 selection:text-white">
      
      {/* Sleek Navigation Bar */}
      <nav className="fixed w-full z-50 backdrop-blur-md bg-white/70 border-b border-white/20 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg flex items-center justify-center transform -rotate-3 transition-transform hover:rotate-0 duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
                </svg>
              </div>
              <span className="text-2xl font-extrabold text-slate-800 tracking-tight ml-2">ATMS <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Portal</span></span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-purple-600 font-bold relative group">
                Home
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-purple-600"></span>
              </a>
              <a href="#features" className="text-slate-600 font-semibold hover:text-purple-600 transition-colors relative group">
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#about" className="text-slate-600 font-semibold hover:text-purple-600 transition-colors relative group">
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={onNavigateToLogin}
                className="hidden sm:block text-slate-600 font-bold hover:text-purple-600 transition-colors"
              >
                Portal Login
              </button>
              <button 
                onClick={onNavigateToRegister}
                className="px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Register
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        {IMAGES.map((src, index) => (
          <div 
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out z-0 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
          >
            <img src={src} alt="Campus" className="w-full h-full object-cover scale-105 transform motion-safe:animate-slow-zoom" />
          </div>
        ))}
        
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-950/40 z-10"></div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 w-full text-center md:text-left">
          <div className="max-w-3xl mx-auto md:mx-0 animate-fade-in-up">
            <span className="inline-block px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 backdrop-blur-md mb-6 text-sm font-bold text-purple-300 uppercase tracking-widest">
              WHY CHOOSE ATMS
            </span>
            
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6 drop-shadow-lg">
              Everything you need to run your institute smoothly.
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 font-medium mb-10 max-w-2xl leading-relaxed drop-shadow-md mx-auto md:mx-0">
              Say goodbye to manual roll calls and spreadsheet schedules. Experience the future of academic management.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center md:justify-start">
              <button 
                onClick={onNavigateToRegister}
                className="px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-xl shadow-purple-500/40 hover:shadow-purple-500/60 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Get Started
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </button>
              
              <button 
                onClick={onNavigateToLogin}
                className="px-8 py-4 rounded-xl font-bold text-white bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/20 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
                Portal Login
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-100 rounded-full blur-3xl opacity-40 -translate-y-1/2 -translate-x-1/3"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Core Features</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group overflow-hidden flex flex-col">
              <div className="h-48 overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" alt="Tracking Dashboard" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
              </div>
              <div className="p-8 flex-1">
                <h4 className="text-xl font-bold text-slate-800 mb-3">Real-time Tracking</h4>
                <p className="text-slate-500 font-medium leading-relaxed">Lecturers can mark attendance instantly via their portal, instantly syncing to the central database and student dashboards.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group overflow-hidden flex flex-col">
              <div className="h-48 overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80" alt="Scheduling Calendar" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
              </div>
              <div className="p-8 flex-1">
                <h4 className="text-xl font-bold text-slate-800 mb-3">Smart Scheduling</h4>
                <p className="text-slate-500 font-medium leading-relaxed">Admins can build and modify complex timetables effortlessly. Students and faculty always see their most up-to-date schedule.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group overflow-hidden flex flex-col">
              <div className="h-48 overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800&q=80" alt="Secure Access" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                </div>
              </div>
              <div className="p-8 flex-1">
                <h4 className="text-xl font-bold text-slate-800 mb-3">Role-based Access</h4>
                <p className="text-slate-500 font-medium leading-relaxed">Dedicated, highly secure portals for Administrators, Lecturers, and Students with tailored UI/UX and permissions.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80" alt="About ATMS" className="w-full h-auto object-cover" />
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/40 to-transparent mix-blend-multiply"></div>
            </div>
          </div>
          <div className="md:w-1/2">
            <h2 className="text-purple-600 font-bold tracking-wide uppercase text-sm mb-2">About Our Platform</h2>
            <h3 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Transforming Education Management.</h3>
            <p className="text-lg text-slate-600 font-medium mb-6 leading-relaxed">
              The Attendance & Timetable Management System (ATMS) was built with a single goal: to remove administrative friction from educational institutes so that educators can focus on what they do best—teaching.
            </p>
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              With our cutting-edge tech stack, secure cloud infrastructure, and intuitive role-based dashboards, managing complex schedules and tracking thousands of attendance records is now a seamless, elegant experience.
            </p>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12 text-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-center items-center gap-2 mb-4 opacity-50">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path></svg>
            <span className="text-xl font-extrabold tracking-tight text-white ml-2">ATMS</span>
          </div>
          <p className="text-sm font-medium">&copy; {new Date().getFullYear()} Attendance & Timetable Management System. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};

export default Home;