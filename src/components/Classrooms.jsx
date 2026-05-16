import React, { useState } from 'react';
import { Users, Building, Monitor, ShieldCheck, X, PlusCircle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Classrooms = ({ user, classrooms, setClassrooms, showToast }) => {
  const navigate = useNavigate();
  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRoom, setNewRoom] = useState({ room_name: '', capacity: '', building: '', resources: '' });

  const handleAddRoom = (e) => {
    e.preventDefault();
    const id = classrooms.length + 1;
    const resList = newRoom.resources.split(',').map(r => r.trim()).filter(Boolean);
    setClassrooms([...classrooms, { ...newRoom, capacity: Number(newRoom.capacity), id, resources: resList }]);
    if (showToast) showToast(`Classroom ${newRoom.room_name} added successfully!`, 'success');
    setShowAddModal(false);
    setNewRoom({ room_name: '', capacity: '', building: '', resources: '' });
  };

  const handleDeleteRoom = (id, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this classroom?")) {
      const roomToRemove = classrooms.find(r => r.id === id);
      setClassrooms(classrooms.filter(room => room.id !== id));
      if (showToast && roomToRemove) showToast(`Classroom ${roomToRemove.room_name} was deleted.`, 'info');
    }
  };

  const canEdit = user && (user.role === 'Admin' || user.role === 'Faculty');
  const canDelete = user && user.role === 'Admin';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 relative"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Manage Classrooms</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">View availability and asset inventory mapping</p>
        </div>
        
        {canEdit && (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition shadow-lg shadow-indigo-500/20 flex items-center"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add Room
          </motion.button>
        )}
      </div>

      <motion.div 
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4"
      >
        <AnimatePresence>
          {classrooms.map(room => (
            <motion.div 
              key={room.id}
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100 } }
              }}
              whileHover={{ y: -5, scale: 1.02 }}
              onClick={() => {
                if (user?.role === 'Student') {
                  if (showToast) showToast(`Routing to ${room.room_name} for Group Study...`, 'info');
                } else {
                  if (showToast) showToast(`Routing to ${room.room_name} for Lecture...`, 'info');
                }
                navigate('/bookings', { state: { prefillRoom: room.room_name } });
              }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-[2rem] shadow-xl dark:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-400/50 dark:hover:border-indigo-500/50 transition-all group relative cursor-pointer"
            >
              <div className="absolute top-6 right-6 flex items-center space-x-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.7)] animate-pulse" title="Available"></div>
                {canDelete && (
                  <motion.button
                    whileHover={{ scale: 1.1, color: "#ef4444" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => handleDeleteRoom(room.id, e)}
                    className="text-gray-400 hover:text-red-500 transition-colors bg-white/50 dark:bg-gray-800/50 p-1.5 rounded-full backdrop-blur-sm -mt-1.5 -mr-1.5 border border-transparent hover:border-red-500/20 shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
              
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-200 dark:ring-indigo-500/30 group-hover:scale-110 transition-transform">
                <Building className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{room.room_name}</h3>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-2.5 rounded-lg border border-gray-100 dark:border-gray-700/50">
                  <ShieldCheck className="w-4 h-4 mr-3 text-emerald-500" />
                  <span className="text-sm font-medium">{room.building}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-2.5 rounded-lg border border-gray-100 dark:border-gray-700/50">
                  <Users className="w-4 h-4 mr-3 text-blue-500" />
                  <span className="text-sm font-medium">Capacity: {room.capacity} seats</span>
                </div>
                {room.resources && room.resources.length > 0 && (
                  <div className="flex items-start text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-2.5 rounded-lg border border-gray-100 dark:border-gray-700/50">
                    <Monitor className="w-4 h-4 mr-3 text-purple-500 mt-0.5" />
                    <div className="flex flex-wrap gap-1">
                      {room.resources.map((res, i) => (
                        <span key={i} className="text-xs bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-500/30">
                          {res}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-40" 
              onClick={() => setShowAddModal(false)}
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, x: "-50%", y: "-50%" }}
              animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
              exit={{ opacity: 0, scale: 0.9, x: "-50%", y: "-50%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-1/2 left-1/2 w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 rounded-[2rem] shadow-2xl z-50"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Resource</h3>
                <motion.button 
                  whileHover={{ rotate: 90 }}
                  onClick={() => setShowAddModal(false)} 
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-white bg-gray-100 dark:bg-gray-800 rounded-full p-2 transition"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <form onSubmit={handleAddRoom} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-400 mb-1">Room Name</label>
                  <input required type="text" value={newRoom.room_name} onChange={(e) => setNewRoom({...newRoom, room_name: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-950/50 border border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition shadow-inner" placeholder="E.g. Room 505" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-400 mb-1">Capacity</label>
                    <input required type="number" value={newRoom.capacity} onChange={(e) => setNewRoom({...newRoom, capacity: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-950/50 border border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition shadow-inner" placeholder="E.g. 50" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-400 mb-1">Building</label>
                    <input required type="text" value={newRoom.building} onChange={(e) => setNewRoom({...newRoom, building: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-950/50 border border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition shadow-inner" placeholder="Main Block" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-400 mb-1">Resources (Comma separated)</label>
                  <input type="text" value={newRoom.resources} onChange={(e) => setNewRoom({...newRoom, resources: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-950/50 border border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition shadow-inner" placeholder="Projector, Mac Lab, Keyboards" />
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit" 
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition shadow-[0_0_20px_rgba(79,70,229,0.3)] mt-6 flex justify-center items-center"
                >
                  Save Classroom
                </motion.button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Classrooms;
