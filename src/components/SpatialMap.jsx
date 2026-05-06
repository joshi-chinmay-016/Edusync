import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Layers, Maximize, Cpu, Battery, Users, ArrowRight } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const SpatialMap = ({ classrooms, bookings }) => {
  const [activeLayer, setActiveLayer] = useState("Heatmap");
  const [selectedZone, setSelectedZone] = useState(null);

  // Group rooms by building
  const blocks = classrooms.reduce((acc, cr) => {
     if(!acc[cr.building]) acc[cr.building] = [];
     acc[cr.building].push(cr);
     return acc;
  }, {});

  const getHeatColor = (buildingRooms) => {
     // compute usage percentage of this block
     let totalB = 0;
     buildingRooms.forEach(r => {
        totalB += bookings.filter(b => b.room_name === r.room_name).length;
     });
     
     // Mock hot logic: > 3 bookings = HOT
     if (totalB > 3) return "bg-rose-500/80 shadow-[0_0_30px_rgba(244,63,94,0.6)] border-rose-400";
     if (totalB > 1) return "bg-amber-500/80 shadow-[0_0_20px_rgba(244,151,0,0.5)] border-amber-400";
     return "bg-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.3)] border-emerald-400";
  };

  const getNoiseColor = (buildingRooms) => {
     // Quiet zones = Arts, Loud = Engine / Main
     if (buildingRooms[0].building.includes('Engineering')) return "bg-orange-500/70 shadow-[0_0_25px_rgba(249,115,22,0.5)]";
     if (buildingRooms[0].building.includes('Main')) return "bg-red-500/80 shadow-[0_0_25px_rgba(239,68,68,0.5)]";
     return "bg-blue-400/60 shadow-[0_0_15px_rgba(59,130,246,0.3)] border-blue-300"; // Quiet
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto space-y-8 h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
        <div>
           <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight flex items-center">
             <Map className="w-10 h-10 mr-4 text-cyan-500" /> Spatial Intelligence Map
           </h2>
           <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium text-lg">Real-time topographical rendering of campus utilization and human traffic</p>
        </div>

        <div className="flex bg-gray-100/80 dark:bg-gray-800/80 p-1.5 rounded-2xl shadow-inner border border-gray-200 dark:border-gray-700">
           {['Heatmap', 'Acoustic (Noise)', 'Energy Grid'].map(layer => (
              <button 
                key={layer}
                onClick={() => setActiveLayer(layer)}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all relative ${activeLayer === layer ? 'text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50'}`}
              >
                {activeLayer === layer && (
                  <motion.div layoutId="layer-active" className="absolute inset-0 bg-cyan-600 rounded-xl shadow-lg -z-10" />
                )}
                {layer}
              </button>
           ))}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
        {/* The "Map" Canvas */}
        <div className="lg:col-span-8 bg-gray-900 rounded-[3rem] border-4 border-gray-800 p-8 shadow-2xl relative overflow-hidden min-h-[500px] flex items-center justify-center">
           {/* Grid effect */}
           <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] opacity-40"></div>
           
           <div className="z-10 w-full h-full relative p-6 grid grid-cols-2 gap-8">
              {Object.keys(blocks).map((buildingName, i) => {
                 const rooms = blocks[buildingName];
                 let zoneColor = getHeatColor(rooms);
                 if (activeLayer === 'Acoustic (Noise)') zoneColor = getNoiseColor(rooms);
                 if (activeLayer === 'Energy Grid') zoneColor = i % 2 === 0 ? "bg-cyan-500/80 shadow-[0_0_30px_rgba(6,182,212,0.6)] cursor-crosshair" : "bg-indigo-900/60 shadow-[0_0_10px_rgba(49,46,129,0.3)] grayscale opacity-50";

                 return (
                   <motion.div 
                     key={buildingName}
                     whileHover={{ scale: 1.05 }}
                     onClick={() => setSelectedZone(buildingName)}
                     className={`rounded-3xl border-2 backdrop-blur-md p-6 flex flex-col justify-between cursor-pointer transition-all hover:border-white ${zoneColor} ${selectedZone === buildingName ? 'ring-4 ring-white' : ''}`}
                     style={{
                        height: '100%',
                        gridRow: i === 0 ? 'span 2' : 'span 1'
                     }}
                   >
                     <h3 className="text-white font-black text-xl tracking-widest uppercase drop-shadow-md">{buildingName}</h3>
                     <div className="mt-auto flex items-center justify-between text-white/90">
                        <span className="font-bold flex items-center text-sm drop-shadow-md">
                           <Users className="w-4 h-4 mr-1.5 opacity-80" /> {rooms.length} Nodes
                        </span>
                        {activeLayer === 'Heatmap' && <span className="bg-black/20 px-2 py-1 rounded font-bold text-xs uppercase tracking-wider backdrop-blur-xl">Live</span>}
                     </div>
                   </motion.div>
                 );
              })}
           </div>

           <div className="absolute bottom-6 right-6 flex items-center bg-black/50 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/10 text-white font-mono text-xs shadow-lg">
             <Layers className="w-4 h-4 text-cyan-400 mr-2" />
             Rendering: {activeLayer} Layer
           </div>
        </div>

        {/* Sidebar Analytics for selected block */}
        <div className="lg:col-span-4 flex flex-col">
           <AnimatePresence mode="wait">
             {selectedZone ? (
               <motion.div key={selectedZone} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[2rem] p-8 shadow-xl flex-1 flex flex-col relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-bl-full z-0 pointer-events-none"></div>
                 
                 <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                       <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight leading-none">{selectedZone}</h3>
                       <motion.button onClick={() => setSelectedZone(null)} whileHover={{ rotate: 90 }} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors">
                         <span className="sr-only">Close</span>
                         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                       </motion.button>
                    </div>

                    <div className="space-y-4">
                       <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Zone Status</p>
                          {activeLayer === 'Heatmap' && (
                             <div className="flex items-center text-rose-600 dark:text-rose-400 font-black text-lg">
                               <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse mr-3"></div> HIGH TRAFFIC AREA
                             </div>
                          )}
                          {activeLayer === 'Acoustic (Noise)' && (
                             <div className="flex flex-col">
                                <span className="font-bold text-gray-900 dark:text-white text-lg mb-2">Noise Level: 74dB</span>
                                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex">
                                   <div className="bg-emerald-500 h-full w-1/3"></div>
                                   <div className="bg-amber-500 h-full w-1/3"></div>
                                   <div className="bg-rose-500 h-full w-1/4"></div>
                                </div>
                             </div>
                          )}
                          {activeLayer === 'Energy Grid' && (
                             <div className="flex items-center text-cyan-600 dark:text-cyan-400 font-black text-lg">
                               <Battery className="w-6 h-6 mr-3 text-cyan-500" /> OPTIMAL POWER DRAW
                             </div>
                          )}
                       </div>

                       <div>
                          <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3 mt-6">Classrooms in Sector</p>
                          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                             {blocks[selectedZone].map(cr => (
                               <div key={cr.id} className="flex justify-between items-center bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 px-4 py-3 rounded-xl shadow-sm hover:border-cyan-500/50 transition-colors cursor-default">
                                  <span className="font-bold text-gray-900 dark:text-white">{cr.room_name}</span>
                                  <span className="text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-md flex items-center">
                                     <Users className="w-3 h-3 mr-1 opacity-50" /> {cr.capacity}
                                  </span>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>
                 </div>
               </motion.div>
             ) : (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gray-50 dark:bg-gray-900/40 border border-gray-200 border-dashed dark:border-gray-800 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center h-full flex-1">
                 <Maximize className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-4" />
                 <h3 className="text-xl font-bold text-gray-500 dark:text-gray-400">Select a Sector</h3>
                 <p className="text-sm text-gray-400 dark:text-gray-500 mt-2 font-medium max-w-[250px]">Click any topographical block on the map canvas to extract deep intelligence.</p>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default SpatialMap;
