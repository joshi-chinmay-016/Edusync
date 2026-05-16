import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Users, Clock, Calendar, CheckCircle, ArrowRight, Zap, RefreshCw, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SmartScheduler = ({ user, classrooms, bookings, setBookings, showToast }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ course: '', size: '', duration: '1', resources: '', date: '' });
  const [result, setResult] = useState(null);
  const [isComputing, setIsComputing] = useState(false);

  const handlePredict = (e) => {
    e.preventDefault();
    setIsComputing(true);
    setResult(null);

    setTimeout(() => {
      const neededSize = parseInt(formData.size);
      const reqs = formData.resources.toLowerCase().split(',').map(r => r.trim()).filter(Boolean);

      // Score rooms based on capacity fit and resource match
      const scoredRooms = classrooms.map(room => {
        let score = 0;
        let warnings = [];
        
        // 1. Capacity Check
        if (room.capacity < neededSize) {
          score -= 100; // Too small
          warnings.push(`Too small (${room.capacity} vs ${neededSize})`);
        } else {
          // Dynamic Reallocation logic: 
          // If room capacity is > 1.5x class size, penalize slightly to save large rooms for big classes
          if (room.capacity > neededSize * 1.5) {
             score -= 10;
             warnings.push(`Over-allocated capacity (Wasting ${room.capacity - neededSize} seats)`);
          } else {
             score += 20; // Good fit
          }
        }

        // 2. Resource Check
        if (reqs.length > 0 && room.resources) {
           reqs.forEach(req => {
              if (room.resources.find(res => res.toLowerCase().includes(req))) {
                 score += 15;
              } else {
                 score -= 5;
                 warnings.push(`Missing: ${req}`);
              }
           });
        }

        // 3. Availability Check (Mock check for the chosen date)
        // Check if there's any booking strictly on that date
        const isOccupiedOnDate = bookings.some(b => b.room_name === room.room_name && b.start_time.includes(formData.date));
        if (isOccupiedOnDate) {
           score -= 50;
           warnings.push("Potential schedule conflict on this date");
        } else {
           score += 20; // Available!
        }

        return { ...room, score, warnings, efficiencyScore: Math.min(100, Math.round((neededSize / room.capacity) * 100)) };
      });

      // Sort and take top 2
      const sorted = scoredRooms.filter(r => r.score > -50).sort((a, b) => b.score - a.score);
      setResult(sorted);
      setIsComputing(false);
    }, 1500);
  };

  const handleBook = (room) => {
    if (!formData.date) {
      if(showToast) showToast('Please select a date first', 'error');
      return;
    }
    
    // Auto-generate start time based on Date at 09:00 AM
    const pad = n => n.toString().padStart(2, '0');
    const startStr = `${formData.date} 09:00`;
    
    // End time based on duration
    const endHour = 9 + parseInt(formData.duration);
    const endStr = `${formData.date} ${pad(endHour)}:00`;

    const newBooking = {
      id: bookings.length + 1,
      room_name: room.room_name,
      start_time: startStr,
      end_time: endStr,
      status: 'Confirmed',
      user: user.name,
      purpose: formData.course
    };

    setBookings([newBooking, ...bookings]);
    if (showToast) showToast(`Successfully AI-Scheduled ${formData.course} in ${room.room_name}!`, 'success');
    navigate('/bookings');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <Cpu className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Predictive Scheduling Engine</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Auto-allocate optimal infrastructure based on class metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 rounded-[2rem] shadow-xl">
          <form onSubmit={handlePredict} className="space-y-5">
             <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-400 mb-2">Course / Event Name</label>
                <input required type="text" value={formData.course} onChange={e => setFormData({...formData, course: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-950/50 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 transition shadow-inner font-medium" placeholder="e.g. Intro to Data Science" />
             </div>
             
             <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-400 mb-2">Expected Class Size</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input required type="number" min="1" value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-950/50 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 transition shadow-inner font-medium" placeholder="e.g. 45" />
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-400 mb-2">Duration (Hours)</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-950/50 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 transition shadow-inner font-medium appearance-none">
                      <option value="1">1 Hour</option>
                      <option value="2">2 Hours</option>
                      <option value="3">3 Hours</option>
                    </select>
                  </div>
               </div>
             </div>

             <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-400 mb-2">Required Equipment (Comma Separated)</label>
                <input type="text" value={formData.resources} onChange={e => setFormData({...formData, resources: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-950/50 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 transition shadow-inner font-medium" placeholder="e.g. Projector, Mac Lab" />
             </div>

             <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-400 mb-2">Target Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-950/50 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 transition shadow-inner font-medium dark:[color-scheme:dark]" />
                </div>
             </div>

             <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={isComputing} type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-[54px] rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] mt-4 flex justify-center items-center">
                {isComputing ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><RefreshCw className="w-5 h-5" /></motion.div> : "Generate AI Assignment"}
             </motion.button>
          </form>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-7">
           <AnimatePresence mode="wait">
             {!result && !isComputing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full bg-gray-50 dark:bg-gray-900/50 border border-transparent dark:border-gray-800 border-dashed rounded-[2rem] flex flex-col items-center justify-center p-12 text-center">
                  <Zap className="w-16 h-16 text-gray-300 dark:text-gray-700 mb-4" />
                  <h3 className="text-xl font-bold text-gray-500 dark:text-gray-400">Awaiting Variables</h3>
                  <p className="text-gray-400 dark:text-gray-600 mt-2 max-w-sm font-medium">Enter course details and let the Dynamic Classroom Reallocation Engine find the optimal space.</p>
                </motion.div>
             )}

             {isComputing && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="h-full bg-indigo-500/10 border border-indigo-500/20 rounded-[2rem] flex flex-col items-center justify-center p-12 text-center backdrop-blur-md">
                   <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                     <Cpu className="w-20 h-20 text-indigo-500 mb-6" />
                   </motion.div>
                   <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Processing Campus Telemetry...</h3>
                   <p className="text-indigo-500 dark:text-indigo-500/70 mt-2 font-medium">Evaluating capacity thresholds and historical occupancy</p>
                </motion.div>
             )}

             {result && !isComputing && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                    <CheckCircle className="w-6 h-6 mr-3 text-emerald-500" /> Optimal Allocation Strategy
                  </h3>
                  
                  {result.length === 0 ? (
                     <div className="bg-red-50 dark:bg-red-900/10 p-8 rounded-3xl border border-red-200 dark:border-red-500/20">
                        <AlertTriangle className="w-10 h-10 text-red-500 mb-4" />
                        <h4 className="text-xl font-bold text-red-700 dark:text-red-400">No Viable Infrastructure Found</h4>
                        <p className="text-red-600/80 mt-2 font-medium">Consider splitting the class or procuring specialized resources externally.</p>
                     </div>
                  ) : (
                    result.map((room, idx) => (
                      <motion.div key={room.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className={`bg-white dark:bg-gray-900 border overflow-hidden p-6 rounded-3xl shadow-xl flex flex-col md:flex-row gap-6 relative group ${idx === 0 ? 'border-emerald-500 ring-4 ring-emerald-500/10 dark:ring-emerald-500/20' : 'border-gray-200 dark:border-gray-800 hover:border-indigo-400 dark:hover:border-indigo-500/50'}`}>
                         
                         {idx === 0 && <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-black px-4 py-1.5 rounded-bl-xl z-10 tracking-widest uppercase">Best Match</div>}
                         
                         <div className="flex-1 space-y-4">
                            <div>
                               <h4 className="text-2xl font-black text-gray-900 dark:text-white group-hover:text-indigo-500 transition-colors">{room.room_name}</h4>
                               <p className="text-sm font-bold text-gray-500 dark:text-gray-400 flex items-center mt-1">
                                 <Users className="w-4 h-4 mr-1.5" /> Capacity: {room.capacity} seats • {room.building}
                               </p>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                               <div className="flex justify-between items-center mb-2">
                                  <span className="text-xs font-bold text-gray-500 uppercase">Efficiency Score</span>
                                  <span className={`text-sm font-black ${room.efficiencyScore > 80 ? 'text-emerald-500' : room.efficiencyScore < 50 ? 'text-amber-500' : 'text-blue-500'}`}>{room.efficiencyScore}%</span>
                               </div>
                               <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <div className={`h-full ${room.efficiencyScore > 80 ? 'bg-emerald-500' : room.efficiencyScore < 50 ? 'bg-amber-500' : 'bg-blue-500'}`} style={{ width: `${room.efficiencyScore}%` }}></div>
                               </div>
                            </div>

                            {room.warnings.length > 0 && (
                               <div className="flex flex-wrap gap-2">
                                  {room.warnings.map((w, i) => (
                                     <span key={i} className="px-2 py-1 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold rounded flex items-center">
                                        <AlertTriangle className="w-3 h-3 mr-1" /> {w}
                                     </span>
                                  ))}
                               </div>
                            )}
                         </div>

                         <div className="flex items-center justify-center border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-800 pt-6 md:pt-0 md:pl-6">
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleBook(room)} className="w-full md:w-auto bg-gray-900 dark:bg-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-500 text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center transition-all shadow-md group-hover:shadow-indigo-500/30">
                              Allocate
                              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                         </div>
                      </motion.div>
                    ))
                  )}
                </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default SmartScheduler;
