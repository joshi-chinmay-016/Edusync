import React, { useState } from 'react';
import { Bookmark, Clock, CheckCircle, Calendar, X, AlertTriangle, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Profile = ({ user, setUser, bookings, setBookings, logEvent }) => {
  const navigate = useNavigate();

  if (!user) return null;

  const myBookings = bookings.filter(b => b.user === user.name);
  const activeBookings = myBookings.filter(b => b.status === "Confirmed");
  const pastBookings = myBookings.filter(b => b.status !== "Confirmed");

  const [popup, setPopup] = useState({ show: false, title: '', message: '' });

  const handleCancel = (id) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b));
    setPopup({ show: true, title: 'Booking Cancelled!', message: 'Classroom successfully released.' });
    setTimeout(() => setPopup({ show: false, title: '', message: '' }), 2500);
  };

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const handleLogout = async () => {
    const token = localStorage.getItem('edusync_token');
    if (token) {
      try {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        // ignore failures
      }
    }

    logEvent?.({ action: 'LOGOUT', user_email: user?.email });

    localStorage.removeItem('edusync_token');
    setUser(null);
    navigate('/');
  };

  return (
  <>
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 max-w-5xl mx-auto"
    >
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[2rem] p-8 shadow-xl dark:shadow-2xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center space-x-6">
            <motion.div 
              whileHover={{ rotate: 5, scale: 1.05 }}
              className="w-28 h-28 rounded-[2rem] bg-white dark:bg-gray-800/50 flex items-center justify-center overflow-hidden shadow-2xl shadow-indigo-500/30 ring-4 ring-white dark:ring-gray-900 border-2 border-indigo-200 dark:border-indigo-800 p-2"
            >
              <DotLottieReact
                src="https://lottie.host/d34284c1-7bd5-46f5-b17e-09d3d7a8370a/RpbJp5flPZ.lottie"
                loop
                autoplay
              />
            </motion.div>
            <div>
              <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">{user.name}</h2>
              <div className="flex items-center mt-3 space-x-3">
                 <span className="text-sm font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-500/30">{user.role}</span>
                 <span className="text-gray-500 dark:text-gray-400 font-medium">{user.email}</span>
              </div>
            </div>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center justify-center w-full md:w-auto px-6 py-3.5 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold rounded-xl transition-colors border border-red-100 dark:border-red-500/20 shadow-sm"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Secure Sign Out
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-[2rem] shadow-xl dark:shadow-2xl flex flex-col justify-center transition-all">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Total Reservations</p>
            <h3 className="text-4xl font-black text-gray-900 dark:text-white tabular-nums">{myBookings.length}</h3>
        </motion.div>
        <motion.div whileHover={{ y: -5 }} className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/50 p-6 rounded-[2rem] shadow-xl dark:shadow-2xl flex flex-col justify-center transition-all">
            <p className="text-emerald-600 dark:text-emerald-400 text-sm font-bold uppercase tracking-wider mb-1">Confirmed</p>
            <h3 className="text-4xl font-black text-emerald-700 dark:text-emerald-300 tabular-nums">{activeBookings.length}</h3>
        </motion.div>
        <motion.div whileHover={{ y: -5 }} className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 p-6 rounded-[2rem] shadow-xl dark:shadow-2xl flex flex-col justify-center transition-all">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Historical</p>
            <h3 className="text-4xl font-black text-gray-700 dark:text-gray-300 tabular-nums">{pastBookings.length}</h3>
        </motion.div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[2rem] overflow-hidden shadow-xl dark:shadow-2xl">
         <div className="p-6 border-b border-gray-100 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-800/20">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
               <Bookmark className="w-5 h-5 mr-3 text-indigo-500" />
               My Classroom Feed
            </h3>
         </div>
         <div className="p-0">
            {myBookings.length === 0 ? (
               <div className="p-16 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center">
                  <AlertTriangle className="w-12 h-12 mb-4 text-amber-500 opacity-50" />
                  <p className="font-semibold text-xl text-gray-800 dark:text-gray-200">No classes booked yet</p>
                  <p className="text-sm mt-2 max-w-xs leading-relaxed">You haven't reserved any hardware or classrooms. Visit the Bookings page to secure a room.</p>
               </div>
            ) : (
               <div className="divide-y divide-gray-100 dark:divide-gray-800/60">
                 <AnimatePresence>
                   {myBookings.map(b => (
                     <motion.div 
                       layout
                       initial={{ opacity: 0, x: -20 }}
                       animate={{ opacity: 1, x: 0 }}
                       exit={{ opacity: 0, scale: 0.95 }}
                       key={b.id} 
                       className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                     >
                        <div className="flex items-center space-x-5">
                           <div className={`w-14 h-14 rounded-2xl flex justify-center items-center text-xl font-black shadow-sm ${
                              b.status === "Confirmed" 
                                ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700"
                           }`}>
                              {b.room_name.split(' ')[1] || b.room_name.substring(0,3)}
                           </div>
                           <div>
                              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1.5">{b.room_name}</h4>
                              <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm space-x-3 font-medium">
                                 <span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5 text-indigo-400" /> {b.start_time.split(' ')[0]}</span>
                                 <span className="flex items-center text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-500/20">
                                    <Clock className="w-4 h-4 mr-1.5" /> {b.start_time.split(' ')[1]} - {b.end_time.split(' ')[1]}
                                 </span>
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center space-x-4 md:space-x-8">
                           {b.status === 'Confirmed' ? (
                              <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-bold text-sm bg-emerald-50 dark:bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-200 dark:border-emerald-500/30">
                                 <CheckCircle className="w-4 h-4 mr-2" /> Confirmed
                              </span>
                           ) : (
                              <span className={`font-bold text-sm flex items-center px-4 py-2 rounded-full border ${b.status === 'Cancelled' ? 'text-red-500 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30' : 'text-blue-500 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30'}`}>
                                 {b.status}
                              </span>
                           )}

                           {b.status === 'Confirmed' && (
                              <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleCancel(b.id)}
                                className="text-red-500 hover:text-red-600 dark:hover:text-red-400 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 px-4 py-2 rounded-xl text-sm font-bold transition flex items-center md:opacity-0 group-hover:opacity-100 shadow-sm"
                              >
                                <X className="w-4 h-4 mr-1.5" /> Cancel
                              </motion.button>
                           )}
                        </div>
                     </motion.div>
                   ))}
                 </AnimatePresence>
               </div>
            )}
         </div>
      </div>
    </motion.div>

    {/* Grand Centered Success Popup */}
    <AnimatePresence>
      {popup.show && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-950/60 backdrop-blur-xl z-[90]" 
          ></motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, x: "-50%", y: "-50%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.8, x: "-50%", y: "-50%" }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 w-full max-w-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 rounded-[2.5rem] shadow-[0_0_80px_rgba(79,70,229,0.2)] z-[100] flex flex-col items-center gap-2 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/10 to-transparent pointer-events-none"></div>
            <div className="w-48 h-48 relative -mt-4">
              <DotLottieReact
                src="https://lottie.host/9454848c-6661-488b-899a-c734d0e0d7d8/j5XPdlb3ZZ.lottie"
                loop={false}
                autoplay
              />
            </div>
            <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight text-center relative z-10">{popup.title}</h3>
            <p className="text-indigo-500 dark:text-indigo-400 font-bold mt-1 text-center relative z-10">{popup.message}</p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  </>
  );
};

export default Profile;
