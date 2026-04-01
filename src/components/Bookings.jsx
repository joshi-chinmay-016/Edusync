import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Calendar, Clock, Lock, CheckCircle, Search, Filter, PlusCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Bookings = ({ user, bookings, setBookings, classrooms, showToast, logEvent }) => {
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBooking, setNewBooking] = useState({ room_name: '', start_time: '', end_time: '', purpose: '' });
  const [popup, setPopup] = useState({ show: false, title: '', message: '' });

  useEffect(() => {
    if (location.state?.prefillRoom) {
      setNewBooking(prev => ({ ...prev, room_name: location.state.prefillRoom }));
      setShowAddModal(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleCancel = (id) => {
    const booking = bookings.find(b => b.id === id);
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b));
    logEvent?.({
      action: 'CANCELLED',
      user_email: user?.email,
      room_name: booking?.room_name,
      start_time: booking?.start_time,
      end_time: booking?.end_time
    });
    setPopup({ show: true, title: 'Booking Cancelled!', message: 'Classroom successfully released.' });
    setTimeout(() => setPopup({ show: false, title: '', message: '' }), 2500);
  };

  const handleAddBooking = (e) => {
    e.preventDefault();
    if (!newBooking.room_name || !newBooking.start_time || !newBooking.end_time) return;

    // Format times for consistency in mock data: '2026-03-25 10:00'
    const formatDateTime = (dtStr) => {
       const d = new Date(dtStr);
       const pad = (n) => n.toString().padStart(2, '0');
       return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    const newStart = new Date(newBooking.start_time);
    const newEnd = new Date(newBooking.end_time);

    const isOccupied = bookings.some(b => {
      if (b.room_name !== newBooking.room_name || b.status !== 'Confirmed') return false;
      const bStart = new Date(b.start_time);
      const bEnd = new Date(b.end_time);
      return (newStart >= bStart && newStart < bEnd) || (newEnd > bStart && newEnd <= bEnd) || (newStart <= bStart && newEnd >= bEnd);
    });

    if (isOccupied) {
      alert("Error: Room is already booked during this time slot! Please check the dashboard map to find an empty classroom.");
      return;
    }

    const newB = {
      id: bookings.length + 1,
      room_name: newBooking.room_name,
      start_time: formatDateTime(newBooking.start_time),
      end_time: formatDateTime(newBooking.end_time),
      status: 'Confirmed',
      user: user.name,
      purpose: newBooking.purpose || (user?.role === 'Student' ? 'Group Study' : 'Lecture')
    };

    setShowAddModal(false);
    setBookings([newB, ...bookings]);
    setNewBooking({ room_name: '', start_time: '', end_time: '', purpose: '' });
    logEvent?.({
      action: 'BOOKED',
      user_email: user?.email,
      room_name: newB.room_name,
      start_time: newB.start_time,
      end_time: newB.end_time
    });
    setPopup({ show: true, title: 'Booking Confirmed!', message: 'Classroom successfully reserved.' });
    
    setTimeout(() => {
      setPopup({ show: false, title: '', message: '' });
    }, 2500);
  };

  const filteredBookings = bookings.filter(b => 
    b.room_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
<>
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Active Bookings</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm md:text-base">Manage all classroom schedules and history</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 flex-shrink-0" />
            <input 
              type="text" 
              placeholder="Search rooms or users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm w-full md:w-64 text-gray-900 dark:text-gray-100 shadow-sm"
            />
          </div>
          {user && (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center shadow-lg shadow-indigo-500/20 transition-all flex-shrink-0 whitespace-nowrap"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              {user?.role === 'Student' ? 'Book Study Room' : 'New Booking'}
            </motion.button>
          )}
        </div>
      </div>

      <motion.div 
        layout
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-xl dark:shadow-2xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
                <th className="p-5 text-gray-600 dark:text-gray-300 font-bold text-sm tracking-wide">Room</th>
                <th className="p-5 text-gray-600 dark:text-gray-300 font-bold text-sm tracking-wide">Reserved For</th>
                <th className="p-5 text-gray-600 dark:text-gray-300 font-bold text-sm tracking-wide">Date & Time</th>
                <th className="p-5 text-gray-600 dark:text-gray-300 font-bold text-sm tracking-wide">Status</th>
                <th className="p-5 text-gray-600 dark:text-gray-300 font-bold text-sm tracking-wide text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
              <AnimatePresence>
                {filteredBookings.map(b => {
                  const safeUserName = user ? user.name.toLowerCase() : '';
                  const bUserLower = b.user.toLowerCase();
                  
                  const canCancel = user && b.status === 'Confirmed' && (
                    user.role === 'Admin' || 
                    user.name === b.user ||
                    (user.role === 'Faculty' && (bUserLower.includes(safeUserName) || safeUserName.includes(bUserLower.split(' ').pop())))
                  );

                  return (
                    <motion.tr 
                      key={b.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      layout
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition group"
                    >
                      <td className="p-5 text-gray-900 dark:text-white font-semibold flex items-center">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex justify-center items-center mr-3 border border-indigo-200 dark:border-indigo-500/20">
                          {b.room_name.substring(b.room_name.length - 3)}
                        </div>
                        {b.room_name}
                      </td>
                      <td className="p-5 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        <div className="font-bold text-gray-900 dark:text-gray-200">{b.user}</div>
                        <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">{b.purpose || 'Session'}</div>
                      </td>
                      <td className="p-5 text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
                          <span className="font-medium mr-2 whitespace-nowrap">{b.start_time.split(' ')[0]}</span>
                          <span className="text-sm border border-gray-200 dark:border-gray-700 rounded-md px-2 py-0.5 bg-gray-50 dark:bg-gray-800/50 whitespace-nowrap flex items-center">
                             <Clock className="w-3 h-3 mr-1 text-gray-400" />
                             {b.start_time.split(' ')[1]} - {b.end_time.split(' ')[1]}
                          </span>
                        </div>
                      </td>
                      <td className="p-5">
                        {b.status === 'Confirmed' && <span className="inline-flex items-center px-3 py-1 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-full border border-emerald-200 dark:border-emerald-500/20"><CheckCircle className="w-3 h-3 mr-1" /> Confirmed</span>}
                        {b.status === 'Completed' && <span className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-full border border-blue-200 dark:border-blue-500/20">Completed</span>}
                        {b.status === 'Cancelled' && <span className="inline-flex items-center px-3 py-1 bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-xs font-bold rounded-full border border-red-200 dark:border-red-500/20">Cancelled</span>}
                      </td>
                      <td className="p-5 text-right">
                        {canCancel ? (
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCancel(b.id)}
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-bold bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition"
                          >
                            Cancel
                          </motion.button>
                        ) : (
                          b.status === 'Confirmed' && (
                            <motion.button 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                 if (showToast) showToast(`Added to Waitlist for ${b.room_name} (${b.start_time.split(' ')[1]}). You'll be notified if it frees up.`, 'info');
                              }}
                              className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 text-sm font-bold bg-amber-50 hover:bg-amber-100 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 px-3 py-1.5 rounded-lg transition border border-amber-200 dark:border-amber-900/50 flex items-center justify-end w-full sm:w-auto ml-auto"
                            >
                              <Lock className="w-3 h-3 mr-1" /> Join Waitlist
                            </motion.button>
                          )
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        {filteredBookings.length === 0 && (
          <div className="p-10 text-center text-gray-500 dark:text-gray-400">
            <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-200">No bookings found</h3>
            <p>Try adjusting your search filters.</p>
          </div>
        )}
      </motion.div>

      {/* Add Booking Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-[60]" 
              onClick={() => setShowAddModal(false)}
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, x: "-50%", y: "-50%" }}
              animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
              exit={{ opacity: 0, scale: 0.9, x: "-50%", y: "-50%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-1/2 left-1/2 w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 rounded-[2rem] shadow-2xl z-[70]"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Reserve Classroom</h3>
                <motion.button 
                  whileHover={{ rotate: 90 }}
                  onClick={() => setShowAddModal(false)} 
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-white bg-gray-100 dark:bg-gray-800 rounded-full p-2 transition"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <form onSubmit={handleAddBooking} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-400 mb-2">Classroom</label>
                    <select 
                      required 
                      value={newBooking.room_name} 
                      onChange={(e) => setNewBooking({...newBooking, room_name: e.target.value})} 
                      className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-inner appearance-none font-medium dark:[color-scheme:dark]" 
                    >
                      <option value="" disabled>Select an available room</option>
                      {classrooms.map(c => (
                         <option key={c.id} value={c.room_name}>{c.room_name} (Cap: {c.capacity})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-400 mb-2">Booking Purpose</label>
                    <select 
                      required 
                      value={newBooking.purpose} 
                      onChange={(e) => setNewBooking({...newBooking, purpose: e.target.value})} 
                      className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-inner appearance-none font-medium dark:[color-scheme:dark]" 
                    >
                      <option value="" disabled>Select Purpose</option>
                      {user?.role === 'Student' ? (
                        <>
                          <option value="Group Study">Group Study</option>
                          <option value="Project Meeting">Project Meeting</option>
                          <option value="Club Activity">Club Activity</option>
                        </>
                      ) : (
                        <>
                          <option value="Lecture">Lecture</option>
                          <option value="Lab Session">Lab Session</option>
                          <option value="Seminar">Seminar</option>
                          <option value="Maintenance">Maintenance</option>
                        </>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-400 mb-2">Start Date & Time</label>
                    <input 
                      required 
                      type="datetime-local" 
                      value={newBooking.start_time} 
                      onChange={(e) => setNewBooking({...newBooking, start_time: e.target.value})} 
                      className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-inner font-medium dark:[color-scheme:dark]" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-400 mb-2">End Date & Time</label>
                    <input 
                      required 
                      type="datetime-local" 
                      value={newBooking.end_time} 
                      onChange={(e) => setNewBooking({...newBooking, end_time: e.target.value})} 
                      className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-inner font-medium dark:[color-scheme:dark]" 
                    />
                  </div>
                  
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit" 
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition shadow-[0_0_20px_rgba(79,70,229,0.3)] mt-6 flex justify-center items-center"
                  >
                    Confirm Booking
                  </motion.button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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

export default Bookings;
