import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Activity, Leaf, BatteryCharging, Wind, Building, Zap, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const AdminAnalytics = ({ user, classrooms, bookings }) => {

  const metrics = useMemo(() => {
    // Calculate total possible capacity vs used capacity
    const totalCapacity = classrooms.reduce((acc, curr) => acc + curr.capacity, 0);
    // Rough mock of active use: 
    const currentActiveBookings = bookings.filter(b => b.status === "Confirmed").length;
    // Assume each booking uses ~40 slots on average
    const currentOccupiedSlots = currentActiveBookings * 40; 
    
    const utilizationRate = Math.min(100, Math.round((currentOccupiedSlots / totalCapacity) * 100)) || 58;

    // Environmental metrics
    const unusedRooms = classrooms.length - currentActiveBookings;
    const energyWaste = unusedRooms > 0 ? unusedRooms * 1.5 : 0; // 1.5 kWh wasted per unused room (lights/AC)
    const carbonOffset = currentActiveBookings * 2.1; // kg CO2 saved by batching

    // Predictive Demand
    const projectedDemand = utilizationRate + 12; // Next sem +12%

    return { utilizationRate, projectedDemand, unusedRooms, energyWaste, carbonOffset };
  }, [classrooms, bookings]);

  // Generate Efficiency Scores table
  const scores = useMemo(() => {
    return classrooms.map(room => {
       const roomBookings = bookings.filter(b => b.room_name === room.room_name).length;
       // Mock: let's pretend a good room has > 2 bookings
       const efficiency = Math.min(100, Math.round((roomBookings / 3) * 100));
       return { ...room, bookings: roomBookings, efficiency };
    }).sort((a,b) => b.efficiency - a.efficiency);
  }, [classrooms, bookings]);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-7xl mx-auto space-y-8">
      
      <div className="flex justify-between items-end mb-8 border-b border-gray-200 dark:border-gray-800 pb-6">
        <div>
           <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight flex items-center">
             <Activity className="w-10 h-10 mr-4 text-indigo-500" /> Administrative Intelligence
           </h2>
           <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium text-lg">Infrastructure Forecasting, Efficiency, & Environmental Analytics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {/* Demand Forecasting Card */}
         <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[2rem] p-8 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full group-hover:scale-110 transition-transform"></div>
            <TrendingUp className="w-10 h-10 text-indigo-500 mb-6 relative z-10" />
            <h3 className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">Demand Forecasting</h3>
            <div className="mb-4">
              <span className="text-4xl font-black text-gray-900 dark:text-white">{metrics.utilizationRate}%</span>
              <span className="text-sm font-bold text-gray-500 ml-2">Current</span>
            </div>
            
            <div className="bg-indigo-50 dark:bg-indigo-500/10 rounded-xl p-4 border border-indigo-100 dark:border-indigo-500/20">
               <div className="flex justify-between items-center mb-1">
                 <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">Next Semester (Projected)</span>
                 <span className="font-black text-indigo-700 dark:text-indigo-300">+{metrics.projectedDemand - metrics.utilizationRate}%</span>
               </div>
               <div className="w-full bg-indigo-200 dark:bg-indigo-900/50 h-2 rounded-full overflow-hidden">
                 <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${metrics.projectedDemand}%` }}></div>
               </div>
            </div>

            <div className="mt-6 flex items-start text-sm">
               <ArrowUpRight className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0" />
               <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                 <strong className="text-gray-900 dark:text-white">Recommendation:</strong> No new classrooms required immediately. Optimize existing large halls instead.
               </p>
            </div>
         </motion.div>

         {/* Sustainability Impact */}
         <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-gray-900 border border-emerald-500 ring-2 ring-emerald-500/20 dark:border-emerald-500/50 rounded-[2rem] p-8 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full group-hover:scale-110 transition-transform"></div>
            <Leaf className="w-10 h-10 text-emerald-500 mb-6 relative z-10" />
            <h3 className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">Sustainability Impact</h3>
            
            <div className="flex items-end mb-6 space-x-2">
              <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400">{metrics.unusedRooms}</span>
              <span className="text-sm font-bold text-gray-500 mb-1">Rooms Unused Today</span>
            </div>

            <div className="space-y-3">
               <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
                 <div className="flex items-center">
                   <Zap className="w-4 h-4 text-amber-500 mr-2" />
                   <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Est. Energy Waste</span>
                 </div>
                 <span className="font-black text-amber-600 dark:text-amber-400">{metrics.energyWaste} kWh</span>
               </div>
               <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
                 <div className="flex items-center">
                   <Wind className="w-4 h-4 text-emerald-500 mr-2" />
                   <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Carbon Saved (Batching)</span>
                 </div>
                 <span className="font-black text-emerald-600 dark:text-emerald-400">{metrics.carbonOffset} kg</span>
               </div>
            </div>

            <div className="mt-6 flex items-start text-sm">
               <BatteryCharging className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0" />
               <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                 <strong className="text-gray-900 dark:text-white">Recommendation:</strong> Consolidate Friday PM classes into main block to power down AC in Block B.
               </p>
            </div>
         </motion.div>

         {/* Building Assets */}
         <motion.div whileHover={{ y: -5 }} className="bg-gradient-to-br from-gray-900 to-indigo-950 dark:from-gray-950 dark:to-indigo-950 border border-gray-800 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 blur-[1px]"></div>
            <div className="relative z-10 flex flex-col h-full">
              <Building className="w-10 h-10 text-cyan-400 mb-6" />
              <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">Total Managed Real-Estate</h3>
              <div className="mb-4">
                <span className="text-5xl font-black text-white">{classrooms.length}</span>
                <span className="text-sm font-bold text-gray-500 ml-2">Classrooms</span>
              </div>
              
              <div className="flex-1 overflow-hidden relative mt-4 -mr-12 -mb-12">
                <DotLottieReact src="https://lottie.host/9454848c-6661-488b-899a-c734d0e0d7d8/j5XPdlb3ZZ.lottie" loop autoplay />
              </div>
            </div>
         </motion.div>
      </div>

      {/* Classroom Efficiency Matrix */}
      <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[2.5rem] p-8 md:p-10 shadow-xl overflow-hidden">
         <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Classroom Efficiency Matrix</h3>
         
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b-2 border-gray-100 dark:border-gray-800">
                  <th className="py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Identifier</th>
                  <th className="py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Building Zone</th>
                  <th className="py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest text-center">Active Bookings</th>
                  <th className="py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest text-right">Performance Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                {scores.map((room, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors group">
                    <td className="py-5 font-bold text-gray-900 dark:text-white flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${room.efficiency >= 80 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : room.efficiency >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                      {room.room_name}
                    </td>
                    <td className="py-5 font-medium text-gray-500 dark:text-gray-400">{room.building}</td>
                    <td className="py-5 text-center font-black text-gray-700 dark:text-gray-300">{room.bookings}</td>
                    <td className="py-5 text-right">
                       <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-black border ${
                          room.efficiency >= 80 ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' : 
                          room.efficiency >= 40 ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20' : 
                          'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20'
                       }`}>
                         {room.efficiency}%
                         {room.efficiency >= 80 ? <ArrowUpRight className="w-4 h-4 ml-1" /> : <ArrowDownRight className="w-4 h-4 ml-1" />}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
         </div>
      </motion.div>

    </motion.div>
  );
};

export default AdminAnalytics;
