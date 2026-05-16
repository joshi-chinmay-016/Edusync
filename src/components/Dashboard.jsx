import React, { useMemo } from 'react';
import { Lightbulb, BarChart2, Users, Calendar, Clock, AlertTriangle, MapPin, ArrowRight, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ data, user, classrooms, bookings }) => {
  const { usage, peakHours, recommendations } = data;
  const navigate = useNavigate();

  // Math helpers for new framer charts
  const maxUsage = Math.max(...Object.values(usage.most_used));
  const usageKeys = Object.keys(usage.most_used);
  const usageValues = Object.values(usage.most_used);

  const maxHeat = Math.max(...Object.values(peakHours.peak_hours));
  const heatKeys = Object.keys(peakHours.peak_hours);
  const heatValues = Object.values(peakHours.peak_hours);

  // Compute live classroom status
  const liveRooms = useMemo(() => {
     if (!classrooms || !bookings) return [];
     
     // Get today's active bookings
     const activeBookings = bookings.filter(b => b.status === "Confirmed");
     
     return classrooms.map(cr => {
        const bookingForRoom = activeBookings.find(b => b.room_name === cr.room_name);
        return {
           ...cr,
           isOccupied: !!bookingForRoom,
           bookedBy: bookingForRoom ? bookingForRoom.user : null,
           until: bookingForRoom ? bookingForRoom.end_time.split(' ')[1] : null
        };
     });
  }, [classrooms, bookings]);


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Header Context */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-3 mb-2 flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
           <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">System Overview</h2>
           <p className="text-gray-500 dark:text-gray-400 mt-1">AI-Driven Predictive Resource Optimization Analytics</p>
        </div>
        {user?.role === 'Admin' && (
           <div className="flex items-center text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-5 py-2.5 rounded-full border border-amber-200 dark:border-amber-700/50 shadow-sm">
             <AlertTriangle className="w-4 h-4 mr-2" />
             Elevated Admin Privileges Active
           </div>
        )}
      </motion.div>

      {/* Top Value Cards */}
      <motion.div 
        whileHover={{ scale: 1.02, y: -5 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 flex flex-col justify-center space-y-4 rounded-[2rem] shadow-xl dark:shadow-2xl cursor-pointer hover:shadow-indigo-500/10 dark:hover:border-indigo-500/50 group"
      >
        <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
          <Calendar className="w-7 h-7" />
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Total Bookings</p>
          <h3 className="text-4xl font-black text-gray-900 dark:text-white tabular-nums">{bookings?.length || usage.total_bookings}</h3>
        </div>
      </motion.div>
      
      <motion.div 
        whileHover={{ scale: 1.02, y: -5 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 flex flex-col justify-center space-y-4 rounded-[2rem] shadow-xl dark:shadow-2xl cursor-pointer hover:shadow-cyan-500/10 dark:hover:border-cyan-500/50 group"
      >
        <div className="w-14 h-14 bg-cyan-50 dark:bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300">
          <Users className="w-7 h-7" />
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Daily Active Users</p>
          <h3 className="text-4xl font-black text-gray-900 dark:text-white tabular-nums">84</h3>
        </div>
      </motion.div>

      <motion.div 
        whileHover={{ scale: 1.02, y: -5 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 flex flex-col justify-center space-y-4 rounded-[2rem] shadow-xl dark:shadow-2xl cursor-pointer hover:shadow-purple-500/10 dark:hover:border-purple-500/50 group"
      >
        <div className="w-14 h-14 bg-purple-50 dark:bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300">
          <Clock className="w-7 h-7" />
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Peak Hour</p>
          <h3 className="text-4xl font-black text-gray-900 dark:text-white tabular-nums">10:00 AM</h3>
        </div>
      </motion.div>

      {/* Live Campus Map (Free vs Occupied) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="lg:col-span-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 rounded-[2rem] shadow-xl dark:shadow-2xl relative"
      >
        <div className="absolute top-8 right-8 flex space-x-2 items-center">
           <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest hidden sm:block">Live Map</span>
           <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.7)] animate-pulse"></div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center mb-6">
          <MapPin className="w-6 h-6 mr-3 text-emerald-500" />
          Real-Time Classroom Status
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
           {liveRooms.map((room, i) => (
             <motion.div 
               key={room.id}
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.1 + (i * 0.05) }}
               whileHover={{ scale: 1.05, y: -5 }}
               className={`p-4 rounded-2xl border flex flex-col justify-between h-32 cursor-pointer shadow-sm ${
                  room.isOccupied 
                    ? 'bg-rose-50 dark:bg-rose-900/10 border-rose-200 dark:border-rose-900/50 hover:shadow-rose-500/20 hover:border-rose-400 dark:hover:border-rose-500/50' 
                    : 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-900/50 hover:shadow-emerald-500/20 hover:border-emerald-400 dark:hover:border-emerald-500/50'
               }`}
             >
                <div className="flex justify-between items-start">
                   <h4 className={`font-black text-lg ${room.isOccupied ? 'text-rose-700 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
                     {room.room_name}
                   </h4>
                   <div className={`w-2.5 h-2.5 rounded-full mt-2 ${room.isOccupied ? 'bg-rose-500/80 shadow-[0_0_5px_rgba(244,63,94,0.5)]' : 'bg-emerald-400/80'}`}></div>
                </div>
                
                {room.isOccupied ? (
                   <div className="text-xs">
                     <p className="font-bold text-rose-800 dark:text-rose-300 truncate">{room.bookedBy}</p>
                     <p className="text-rose-600 dark:text-rose-500 flex items-center mt-0.5"><Clock className="w-3 h-3 mr-1" /> Until {room.until}</p>
                   </div>
                ) : (
                   <div className="text-xs font-bold w-full">
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/bookings')}
                        className="w-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-500/30 px-2 py-2 rounded-lg font-bold flex items-center justify-between transition-colors shadow-sm group/btn"
                      >
                        FREE NOW
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
                      </motion.button>
                   </div>
                )}
             </motion.div>
           ))}
        </div>
      </motion.div>

      {/* Horizontal Utilization Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 rounded-[2rem] shadow-xl dark:shadow-2xl flex flex-col"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <BarChart2 className="w-6 h-6 mr-3 text-indigo-500 dark:text-indigo-400" />
            Classroom Utilization
          </h3>
          <span className="text-xs font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700">
            Live Bookings
          </span>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto pr-1">
          {classrooms && classrooms.map((room, idx) => {
            const roomBookings = bookings ? bookings.filter(b => b.room_name === room.room_name).length : 0;
            const maxBookings = 5; // treat 5 as 100%
            const pct = Math.min(100, Math.round((roomBookings / maxBookings) * 100));
            const confirmedCount = bookings ? bookings.filter(b => b.room_name === room.room_name && b.status === 'Confirmed').length : 0;

            const barColor = pct >= 80
              ? 'from-rose-500 to-pink-500 shadow-rose-500/30'
              : pct >= 50
              ? 'from-amber-400 to-orange-500 shadow-amber-500/30'
              : 'from-indigo-500 to-violet-500 shadow-indigo-500/30';

            const badge = pct >= 80
              ? { label: 'High', cls: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20' }
              : pct >= 50
              ? { label: 'Moderate', cls: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20' }
              : { label: 'Low', cls: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20' };

            return (
              <div key={room.id} className="group">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-100">{room.room_name}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider ${badge.cls}`}>{badge.label}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> Cap: {room.capacity}
                    </span>
                    <span className="font-black text-gray-700 dark:text-gray-200">{roomBookings} bookings</span>
                  </div>
                </div>
                <div className="w-full h-7 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(pct, 4)}%` }}
                    transition={{ type: 'spring', stiffness: 60, damping: 18, delay: 0.1 + idx * 0.08 }}
                    className={`h-full rounded-full bg-gradient-to-r shadow-md relative overflow-hidden ${barColor}`}
                  >
                    <div className="absolute inset-y-0 left-3 right-3 top-1 h-1/3 bg-white/30 rounded-full blur-sm" />
                  </motion.div>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-gray-500 dark:text-gray-400">{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* AI Recommendations Panel */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileHover={{ boxShadow: "0px 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
        className="lg:col-span-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 rounded-[2rem] shadow-xl dark:shadow-2xl flex flex-col transition-shadow"
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center border-b border-gray-100 dark:border-gray-800 pb-5 mb-6">
          <Lightbulb className="w-6 h-6 mr-3 text-amber-500" />
          AI Insights
        </h3>
        <div className="space-y-4 flex-1 overflow-y-auto pr-2">
          {recommendations.recommendations.map((rec, i) => (
            <motion.div 
              whileHover={{ x: 5 }} 
              key={i} 
              className="bg-amber-50 dark:bg-gray-800/80 p-5 rounded-2xl border border-amber-100 dark:border-gray-700/50 text-sm font-medium text-gray-800 dark:text-gray-300 leading-relaxed shadow-sm hover:shadow-md cursor-default dark:hover:bg-gray-700 hover:bg-amber-100 transition-colors"
            >
              <span className="text-amber-600 dark:text-amber-400 font-bold mr-2">Tip {i + 1}:</span>
              {rec}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Grid-Style Peak Hours Heatmap */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="lg:col-span-3 bg-white dark:bg-[#1a1d2e] border border-gray-200 dark:border-gray-800 p-8 rounded-[2rem] shadow-xl dark:shadow-2xl mt-2"
      >
        <h3 className="text-sm font-black text-gray-400 dark:text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center">
          <Activity className="w-4 h-4 mr-2 text-purple-500" />
          Peak Hours Heatmap
        </h3>

        {(() => {
          const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
          const timeSlots = ['09:00', '11:00', '14:00', '16:00'];

          // Mock usage intensity matrix [timeSlot][day] — 0 to 1
          const matrix = [
            [0.85, 0.95, 0.98, 0.78, 0.55, 0.40, 0.70], // 09:00
            [0.90, 0.80, 0.60, 0.88, 0.72, 0.30, 0.95], // 11:00
            [0.45, 0.50, 0.48, 0.40, 0.35, 0.20, 0.42], // 14:00
            [0.30, 0.35, 0.28, 0.25, 0.38, 0.15, 0.32], // 16:00
          ];

          // Color scale: blue (low) → purple (high)
          const getColor = (intensity) => {
            if (intensity > 0.85) return 'bg-[#9b59b6] shadow-[#9b59b6]/30';
            if (intensity > 0.70) return 'bg-[#8e44ad] shadow-[#8e44ad]/20';
            if (intensity > 0.55) return 'bg-[#7b5ea7] shadow-[#7b5ea7]/20';
            if (intensity > 0.40) return 'bg-[#5b7dd8] shadow-[#5b7dd8]/20';
            if (intensity > 0.25) return 'bg-[#4a6bc4] shadow-[#4a6bc4]/20';
            return 'bg-[#3a5ab0] shadow-[#3a5ab0]/10';
          };

          return (
            <div className="space-y-3">
              {/* Column headers (days) */}
              <div className="flex items-center">
                <div className="w-14 flex-shrink-0" />
                {days.map(day => (
                  <div key={day} className="flex-1 text-center text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{day}</div>
                ))}
              </div>

              {/* Heatmap rows */}
              {timeSlots.map((slot, rowIdx) => (
                <div key={slot} className="flex items-center gap-2">
                  <div className="w-12 flex-shrink-0 text-xs font-bold text-gray-400 dark:text-gray-500 text-right pr-2">{slot}</div>
                  {days.map((day, colIdx) => {
                    const intensity = matrix[rowIdx][colIdx];
                    const colorClass = getColor(intensity);
                    return (
                      <motion.div
                        key={day}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: (rowIdx * 7 + colIdx) * 0.015, type: 'spring', stiffness: 150 }}
                        whileHover={{ scale: 1.1, zIndex: 10 }}
                        title={`${day} ${slot} — ${Math.round(intensity * 100)}% usage`}
                        className={`flex-1 h-10 rounded-xl cursor-pointer shadow-md transition-all relative group/cell ${colorClass}`}
                      >
                        {/* Tooltip on hover */}
                        <div className="absolute -top-9 left-1/2 -translate-x-1/2 opacity-0 group-hover/cell:opacity-100 transition-all bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded-md whitespace-nowrap z-20 shadow-xl pointer-events-none">
                          {Math.round(intensity * 100)}% usage
                        </div>
                        {/* Inner shine */}
                        <div className="absolute inset-x-1.5 top-1 h-1/3 rounded-full bg-white/20 pointer-events-none" />
                      </motion.div>
                    );
                  })}
                </div>
              ))}

              {/* Legend */}
              <div className="flex items-center justify-center gap-2 pt-4">
                <span className="text-xs text-gray-400 font-medium">Low usage</span>
                {['bg-[#3a5ab0]', 'bg-[#5b7dd8]', 'bg-[#7b5ea7]', 'bg-[#9b59b6]'].map((c, i) => (
                  <div key={i} className={`w-6 h-4 rounded-md ${c}`} />
                ))}
                <span className="text-xs text-gray-400 font-medium">High usage</span>
              </div>
            </div>
          );
        })()}
      </motion.div>

    </div>
  );
};

export default Dashboard;
