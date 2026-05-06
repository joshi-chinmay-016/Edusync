import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Monitor, Cpu, MapPin, CheckCircle, XCircle, ArrowRight, ChevronDown } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const ResourceLocator = ({ user, classrooms }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [queryResult, setQueryResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm) return;

    setQueryResult(null);
    setIsSearching(true);
    
    setTimeout(() => {
      const requirements = searchTerm.toLowerCase().split(',').map(req => req.trim()).filter(Boolean);
      
      const scoredRooms = classrooms.map(room => {
        let score = 0;
        let matchedResources = [];
        if (room.resources) {
            requirements.forEach(req => {
               const match = room.resources.find(res => res.toLowerCase().includes(req));
               if (match) {
                 score += 1;
                 matchedResources.push(match);
               }
            });
        }
        return { ...room, score, matchedResources };
      });

      const bestMatches = scoredRooms.filter(r => r.score > 0).sort((a, b) => b.score - a.score);

      setQueryResult({
        requirements: searchTerm,
        matches: bestMatches
      });
      setIsSearching(false);
    }, 1200);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8 max-w-5xl mx-auto"
    >
      <div className="text-center space-y-4 mb-12 relative">
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", bounce: 0.5, duration: 1 }}
          className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-indigo-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-cyan-500/30 ring-1 ring-cyan-200 dark:ring-cyan-500/20"
        >
          <Cpu className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">AI Resource Mapping</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
          Check if a classroom has the specific hardware you need. If it doesn't, our mapping algorithms automatically suggest optimized alternatives.
        </p>
      </div>

      <motion.div 
        whileHover={{ boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.1)" }}
        className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 p-8 rounded-[2rem] shadow-2xl relative transition-shadow"
      >
        <div className="absolute inset-0 overflow-hidden rounded-[2rem] pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px]"></div>
        </div>

        {/* Quick Context Chips (Study/Events) */}
        <div className="flex flex-wrap gap-3 mb-8 relative z-10">
           <span className="text-sm font-bold text-gray-400 dark:text-gray-500 mr-2 flex items-center">Preset Agendas:</span>
           {[
             { label: "Quiet Study Space (Low Traffic)", search: "Quiet, Whiteboard" },
             { label: "Club General Meeting (50+ capacity)", search: "Projector, Audio" },
             { label: "Tech Hackathon (Workstations)", search: "Desktop Computers, Projector" }
           ].map((preset, idx) => (
             <button
               key={idx}
               onClick={() => setSearchTerm(preset.search)}
               className="text-xs font-bold px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all shadow-sm hover:shadow-cyan-500/20"
             >
               {preset.label}
             </button>
           ))}
        </div>

        <form onSubmit={handleSearch} className="relative z-10">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
               <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">What required facilities or problems are you trying to solve?</label>
               <div className="relative">
                 <Monitor className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-500 w-6 h-6 pointer-events-none" />
                 <input 
                   type="text" 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full bg-gray-50 dark:bg-gray-950/50 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-2xl pl-14 pr-4 py-5 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition shadow-inner font-medium placeholder-gray-400 dark:placeholder-gray-600"
                   placeholder="e.g. Projector, Mac Lab, 3D Printer..."
                   required
                 />
               </div>
            </div>

            <div className="md:w-48 flex items-end mt-4 md:mt-0">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isSearching}
                className="w-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold h-[68px] rounded-2xl transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)] flex justify-center items-center group disabled:opacity-70 disabled:cursor-not-allowed text-lg"
              >
                {isSearching ? (
                   <span className="flex items-center">
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                         <Cpu className="w-6 h-6" />
                      </motion.div>
                   </span>
                ) : (
                   <span className="flex items-center">
                      Scan Campus
                      <Search className="w-6 h-6 ml-2 group-hover:rotate-12 transition-transform" />
                   </span>
                )}
              </motion.button>
            </div>
          </div>
        </form>
      </motion.div>

      <AnimatePresence mode="wait">
        {queryResult && (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            transition={{ type: "spring", stiffness: 80 }}
            className="pt-6"
          >
            {queryResult.matches.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-full text-sm font-bold shadow-sm">
                    {queryResult.matches.length} Rooms Found
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">Matching your requirements</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {queryResult.matches.map((room, idx) => (
                    <motion.div 
                      key={room.id}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      onClick={() => navigate('/bookings', { state: { prefillRoom: room.room_name } })}
                      className="bg-white dark:bg-[#0A0F24] border border-gray-200 dark:border-gray-800 p-8 rounded-[2rem] shadow-xl relative overflow-hidden group cursor-pointer transition-all hover:border-indigo-400 dark:hover:border-indigo-500/60"
                    >
                      <div className="absolute top-0 right-0 p-4">
                        <span className="bg-indigo-600 dark:bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider animate-pulse shadow-sm">Click to Book</span>
                      </div>
                      
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-cyan-100 dark:from-indigo-900/40 dark:to-cyan-900/40 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner flex-shrink-0 mb-6 group-hover:-rotate-12 transition-transform ring-1 ring-indigo-200 dark:ring-indigo-800/50">
                        <MapPin className="w-8 h-8" />
                      </div>
                      
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-2">{room.room_name}</h3>
                      <p className="text-gray-500 dark:text-gray-400 font-medium mb-6 flex items-center">
                        <Monitor className="w-4 h-4 mr-2" /> {room.building}
                      </p>
                      
                      <div className="space-y-3 border-t border-gray-100 dark:border-gray-800/60 pt-6">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Matched Assets</h4>
                        <div className="flex flex-wrap gap-2">
                          {room.matchedResources.map((res, i) => (
                            <span key={i} className="text-sm bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-500/20 font-bold flex items-center shadow-sm">
                              <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                              {res}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-500/20 p-10 rounded-[2rem] shadow-xl flex flex-col items-center justify-center text-center max-w-2xl mx-auto"
              >
                <div className="w-20 h-20 bg-red-100 dark:bg-red-500/20 rounded-2xl flex items-center justify-center text-red-600 dark:text-red-400 shadow-inner mb-6">
                  <XCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No Classes Found</h3>
                <p className="text-gray-700 dark:text-gray-400 leading-relaxed font-medium">
                  Unfortunately, none of the current classrooms on campus map to <strong className="text-red-500">"{queryResult.requirements}"</strong>. Try broadening your terms or checking back later.
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ResourceLocator;
