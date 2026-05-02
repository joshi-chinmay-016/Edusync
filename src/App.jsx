import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { User, LogOut, ChevronDown, Sun, Moon, Cpu, CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Classrooms from './components/Classrooms';
import Bookings from './components/Bookings';
import LandingPage from './components/LandingPage';
import Chatbot from './components/Chatbot';
import ResourceLocator from './components/ResourceLocator';
import Profile from './components/Profile';
import SpatialMap from './components/SpatialMap';
import AdminAnalytics from './components/AdminAnalytics';
import SmartScheduler from './components/SmartScheduler';
import Logo from './components/Logo';

// Main layout wrapper
const Layout = ({ children, user, setUser, theme, toggleTheme }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen font-sans flex flex-col relative">
      {/* Mesmerizing Glass Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="sticky top-0 z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 px-8 py-4 flex items-center justify-between shadow-sm dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
      >
        <Link to="/dashboard" className="flex items-center space-x-3 group">
          <motion.div 
            whileHover={{ rotate: 90, scale: 1.1 }}
            className="w-10 h-10 flex items-center justify-center shadow-lg shadow-indigo-500/20 rounded-full bg-black/5"
          >
            <Logo className="w-10 h-10" />
          </motion.div>
          <h1 className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-indigo-400 dark:to-cyan-400">
            EduSync
          </h1>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-2 text-sm font-medium p-1.5 rounded-2xl bg-gray-100/80 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-md shadow-inner">
          {[ 
            { path: '/dashboard', label: 'Dashboard', roles: ['Student', 'Faculty', 'Admin'] },
            { path: '/spatial', label: 'Heatmap', roles: ['Admin', 'Faculty'] },
            { path: '/analytics', label: 'Analytics', roles: ['Admin'] },
            { path: '/classrooms', label: 'Classrooms', roles: ['Student', 'Faculty', 'Admin'] }, 
            { path: '/resources', label: 'Resource AI', roles: ['Student', 'Faculty', 'Admin'] }, 
            { path: '/scheduler', label: 'Predictive Scheduling', roles: ['Faculty', 'Admin'] },
            { path: '/bookings', label: 'Bookings', roles: ['Student', 'Faculty', 'Admin'] }
          ].filter(nav => !user || nav.roles.includes(user.role)).map((nav) => (
             <Link 
              key={nav.path}
              to={nav.path} 
              className={`relative px-4 py-2 rounded-xl transition-all duration-300 font-semibold z-10 ${location.pathname === nav.path ? 'text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
             >
               {location.pathname === nav.path && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 bg-indigo-600 dark:bg-indigo-500 rounded-xl -z-10 shadow-md shadow-indigo-500/20"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
               )}
               {nav.label}
               {(nav.path === '/resources' || nav.path === '/scheduler') && <Cpu className="inline w-3 h-3 ml-1.5 mb-0.5 text-cyan-300 animate-pulse" />}
             </Link>
          ))}
        </nav>
        
        <div className="flex items-center space-x-4">
          {/* Theme toggle: placed in header for consistent UX */}
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="h-11 w-11 rounded-xl flex items-center justify-center text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-indigo-500/20 transition"
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-500" />}
              </motion.div>
            </AnimatePresence>
          </motion.button>

          {user && (
            <div className="relative z-50">
              <Link to="/profile">
                <motion.div 
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-3 cursor-pointer group px-2 py-1.5 rounded-2xl bg-white dark:bg-gray-800/80 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-sm hover:shadow-indigo-500/20 border border-gray-200 dark:border-gray-700/50 transition-all duration-300"
                >
                  <div className="text-right hidden md:block pl-2">
                    <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{user.name}</p>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{user.role}</p>
                  </div>
                  <div className="w-9 h-9 rounded-[0.6rem] bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white shadow-lg group-hover:shadow-indigo-500/50 transition uppercase border border-white/20">
                    {user.name.charAt(0)}
                  </div>
                </motion.div>
              </Link>
            </div>
          )}
        </div>
      </motion.header>

      {/* Mesmerizing Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-indigo-500/20 blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.05, 0.15, 0.05] }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] rounded-full bg-cyan-500/20 blur-[100px]" 
        />
      </div>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full h-full relative z-10 transition-colors">
        <AnimatePresence mode="wait">
           {React.cloneElement(children, { user, key: location.pathname })}
        </AnimatePresence>
      </main>

    </div>
  );
};

// Application
function App() {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const [data, setData] = useState({
    usage: { most_used: {}, underutilized: {}, total_bookings: 0 },
    peakHours: { peak_hours: {} },
    recommendations: { recommendations: [] }
  });

  const [classrooms, setClassrooms] = useState([
    { id: 1, room_name: 'Room 101', capacity: 60, building: 'Science Building', resources: ['Projector', 'Whiteboard', 'Microphone'] },
    { id: 2, room_name: 'Room 102', capacity: 40, building: 'Science Building', resources: ['Dual Screens'] },
    { id: 3, room_name: 'Room 201', capacity: 120, building: 'Main Auditorium', resources: ['Smart Board', 'Surround Sound', 'Podium Mic'] },
    { id: 4, room_name: 'Room 303', capacity: 30, building: 'Arts & Humanities', resources: ['Chalkboard'] },
    { id: 5, room_name: 'Room 404', capacity: 50, building: 'Engineering Complex', resources: ['Projector', '30 Desktop Computers'] },
    { id: 6, room_name: 'Lab 5B', capacity: 25, building: 'Engineering Complex', resources: ['3D Printers', 'VR Headsets', 'Projector'] }
  ]);

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('edusync_bookings');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, room_name: 'Room 101', start_time: '2026-03-20 10:00', end_time: '2026-03-20 12:00', status: 'Confirmed', user: 'Dr. Emily Chen' },
      { id: 2, room_name: 'Room 303', start_time: '2026-03-21 09:00', end_time: '2026-03-21 11:00', status: 'Confirmed', user: 'Prof. Alan Turing' },
      { id: 3, room_name: 'Room 102', start_time: '2026-03-22 14:00', end_time: '2026-03-22 16:00', status: 'Completed', user: 'System Admin' },
      { id: 4, room_name: 'Room 404', start_time: '2026-03-23 08:00', end_time: '2026-03-23 11:00', status: 'Cancelled', user: 'John Doe' },
      { id: 5, room_name: 'Room 201', start_time: '2026-03-24 13:00', end_time: '2026-03-24 15:00', status: 'Confirmed', user: 'Dr. Emily Chen' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('edusync_bookings', JSON.stringify(bookings));
  }, [bookings]);

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('dark');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const logEvent = async (event) => {
    try {
      await fetch(`${API_URL}/analytics/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });
    } catch (err) {
      // Ignore network errors; logging is best-effort
      // console.debug('Failed to log event', err);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('edusync_user');
    if (savedUser) setUser(JSON.parse(savedUser));

    // Theme initialization
    const savedTheme = localStorage.getItem('edusync_theme') || 'dark';
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    setTimeout(() => {
      setData({
        usage: {
          total_bookings: 145,
          most_used: { "Room 101": 25, "Room 102": 22 },
          underutilized: { "Room 404": 1, "Room 303": 3 }
        },
        peakHours: {
          peak_hours: { "10": 30, "11": 28, "14": 25, "15": 20 }
        },
        recommendations: {
          recommendations: [
            "Room 404 is underutilized (1 bookings). Consider scheduling classes here.",
            "Room 101 is heavily used (25 bookings). Monitor for maintenance.",
            "Peak demand generally occurs around 10:00 AM. Stagger new classes."
          ]
        }
      });
      setLoading(false);
    }, 1000);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('edusync_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem('edusync_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('edusync_user');
    }
  }, [user]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-white transition-colors">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center"
      >
        <div className="w-64 h-64 mb-6">
           <DotLottieReact
             src="https://lottie.host/6ee6371c-0cae-474c-8904-97048092fb47/hYZ4QHe7EV.lottie"
             loop
             autoplay
           />
        </div>
        <div className="text-xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500 dark:from-indigo-400 dark:to-cyan-400 animate-pulse">
          LOADING ANALYTICS...
        </div>
      </motion.div>
    </div>
  );

  return (
    <BrowserRouter>

      {/* Global Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`fixed bottom-8 right-8 z-[110] flex items-center shadow-2xl rounded-2xl p-4 pr-12 min-w-[300px] border backdrop-blur-md ${
              toast.type === 'error' ? 'bg-red-50/90 dark:bg-red-950/90 border-red-200 dark:border-red-900/50 text-red-800 dark:text-red-200' :
              toast.type === 'info' ? 'bg-blue-50/90 dark:bg-blue-950/90 border-blue-200 dark:border-blue-900/50 text-blue-800 dark:text-blue-200' :
              'bg-emerald-50/90 dark:bg-emerald-950/90 border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-200'
            }`}
          >
            <div className="mr-3 flex-shrink-0">
              {toast.type === 'error' ? <AlertCircle className="w-6 h-6" /> :
               toast.type === 'info' ? <Info className="w-6 h-6" /> :
               <CheckCircle className="w-6 h-6" />}
            </div>
            <p className="font-semibold text-sm">{toast.message}</p>
            <button 
              onClick={() => setToast(null)}
              className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Chatbot */}
      <Chatbot user={user} classrooms={classrooms} />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login setUser={setUser} showToast={showToast} logEvent={logEvent} />} />
        
        <Route path="/dashboard" element={user ? <Layout user={user} setUser={setUser} theme={theme} toggleTheme={toggleTheme}><Dashboard data={data} user={user} classrooms={classrooms} bookings={bookings} showToast={showToast} /></Layout> : <Navigate to="/login" />} />
        <Route path="/classrooms" element={user ? <Layout user={user} setUser={setUser} theme={theme} toggleTheme={toggleTheme}><Classrooms user={user} classrooms={classrooms} setClassrooms={setClassrooms} showToast={showToast} /></Layout> : <Navigate to="/login" />} />
        <Route path="/bookings" element={user ? <Layout user={user} setUser={setUser} theme={theme} toggleTheme={toggleTheme}><Bookings user={user} bookings={bookings} setBookings={setBookings} classrooms={classrooms} showToast={showToast} logEvent={logEvent} /></Layout> : <Navigate to="/login" />} />
        <Route path="/resources" element={user ? <Layout user={user} setUser={setUser} theme={theme} toggleTheme={toggleTheme}><ResourceLocator user={user} classrooms={classrooms} showToast={showToast} /></Layout> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <Layout user={user} setUser={setUser} theme={theme} toggleTheme={toggleTheme}><Profile user={user} setUser={setUser} bookings={bookings} setBookings={setBookings} showToast={showToast} logEvent={logEvent} /></Layout> : <Navigate to="/login" />} />
        <Route path="/spatial" element={user ? <Layout user={user} setUser={setUser} theme={theme} toggleTheme={toggleTheme}><SpatialMap user={user} classrooms={classrooms} bookings={bookings} /></Layout> : <Navigate to="/login" />} />
        <Route path="/analytics" element={user ? <Layout user={user} setUser={setUser} theme={theme} toggleTheme={toggleTheme}><AdminAnalytics user={user} classrooms={classrooms} bookings={bookings} /></Layout> : <Navigate to="/login" />} />
        <Route path="/scheduler" element={user ? <Layout user={user} setUser={setUser} theme={theme} toggleTheme={toggleTheme}><SmartScheduler user={user} classrooms={classrooms} bookings={bookings} setBookings={setBookings} showToast={showToast} /></Layout> : <Navigate to="/login" />} />
        
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
