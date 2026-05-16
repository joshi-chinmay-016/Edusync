import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Chatbot = ({ user, classrooms }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi there! I'm the EduSync AI Agent. How can I help you optimize your campus resources today?" }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI Response based on robust keywords
    setTimeout(() => {
      let reply = "I'm not quite sure how to answer that yet, but try asking me about 'classrooms', 'bookings', or specific assets like 'projectors'.";
      const q = input.toLowerCase();

      // Conversational parsing
      if (q.match(/hello|hi|hey|greetings|morning/)) {
        reply = `Hello ${user ? user.name.split(' ')[0] : 'there'}! I'm your AI optimization assistant. How can I map resources for you today?`;
      } else if (q.match(/who|what are you/)) {
        reply = "I am the EduSync AI, a large language model designed specifically to assist educational institutions with resource optimization and logistics. I monitor your campus telemetry continuously.";
      } else if (q.match(/how are you/)) {
        reply = "My neural nets are firing perfectly, thank you! I'm operating at 100% capacity and ready to assist you.";
      } else if (q.includes('classroom') || q.includes('room') || q.includes('add')) {
        reply = `Right now we have ${classrooms?.length || 0} active classrooms catalogued. Admin and Faculty can dynamically add new ones via the "Classrooms" module using the "+ Add Room" button!`;
      } else if (q.includes('booking') || q.includes('cancel')) {
        reply = "Faculty members have permission to cancel their own specific bookings. However, System Admins can override and manage all global bookings to clear conflicts.";
      } else if (q.match(/optimiz|ai|model|prediction/)) {
        reply = "Our AI prediction module uses historical data from the 'UsageLogs' table via a Scikit-Learn linear regression model to predict peak demand. Check out the beautiful heatmaps on the Dashboard!";
      } else if (q.match(/projector|computer|mac|hardware|resource/)) {
        reply = "If you're looking for specific hardware, jump over to the new 'Resource AI' tab in your navigation! It will scan the campus and automatically redirect you if your room doesn't have it.";
      } else if (q.match(/thank/)) {
        reply = "You're very welcome! If you need anything else, I'm just a click away.";
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
      setIsTyping(false);
    }, 1500); // 1.5s delay to mimic thinking
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-cyan-500 rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(79,70,229,0.5)] cursor-pointer border-2 border-white/20 dark:border-gray-800 relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 blur-md rounded-full group-hover:animate-ping opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <Sparkles className="absolute top-2 right-2 w-3 h-3 text-cyan-200 animate-pulse" />
            <MessageSquare className="w-7 h-7 relative z-10" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 50, rotateX: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50, filter: "blur(10px)" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-80 sm:w-96 h-[32rem] bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 rounded-3xl shadow-2xl flex flex-col overflow-hidden origin-bottom-right"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 p-4 flex items-center justify-between text-white shadow-md relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/micro-carbon.png')] opacity-10 mix-blend-overlay"></div>
              <div className="flex items-center space-x-3 relative z-10">
                <div className="relative">
                   <Bot className="w-6 h-6" />
                   <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-indigo-600"></div>
                </div>
                <div>
                   <span className="font-black text-white text-md tracking-wide">EduSync AI</span>
                   <p className="text-[10px] text-indigo-100 font-medium uppercase tracking-widest">Online • Telemetry Linked</p>
                </div>
              </div>
              <motion.button
                whileHover={{ rotate: 90 }}
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition bg-white/10 rounded-full p-1 border border-white/20 relative z-10"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-5 overflow-y-auto space-y-5 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 custom-scrollbar">
              {messages.map((m, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  key={i} 
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role === 'assistant' && (
                     <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center shadow-md mr-2 flex-shrink-0 mt-1">
                        <Bot className="w-4 h-4 text-white" />
                     </div>
                  )}
                  <div 
                    className={`p-3.5 rounded-[1.25rem] text-[15px] leading-relaxed relative ${
                      m.role === 'user' 
                        ? 'bg-gradient-to-br from-indigo-600 to-indigo-500 text-white rounded-br-sm shadow-md' 
                        : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-sm shadow-sm'
                    }`}
                  >
                    {m.content}
                  </div>
                </motion.div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                 <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                 >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center shadow-md mr-2 flex-shrink-0 mt-1">
                        <Bot className="w-4 h-4 text-white" />
                     </div>
                    <div className="p-3.5 rounded-[1.25rem] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-bl-sm flex items-center shadow-sm">
                       <MoreHorizontal className="w-6 h-6 text-indigo-400 animate-pulse" />
                    </div>
                 </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions (Example chips) */}
            <div className="px-3 pb-2 pt-1 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800/50 flex space-x-2 overflow-x-auto custom-scrollbar">
               {["How do I add a room?", "Find a projector", "Who are you?"].map((chip) => (
                  <button 
                    key={chip}
                    onClick={() => { setInput(chip); }}
                    className="flex-shrink-0 text-xs px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 rounded-full font-medium hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition whitespace-nowrap"
                  >
                     {chip}
                  </button>
               ))}
            </div>

            {/* Input Form */}
            <div className="p-3 bg-gray-50 dark:bg-gray-950/50">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask EduSync..."
                  disabled={isTyping}
                  className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 dark:text-white text-gray-900 rounded-full pl-5 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm shadow-inner transition font-medium disabled:opacity-50"
                  autoComplete="off"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="submit"
                  disabled={isTyping || !input.trim()}
                  className="absolute right-2 p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </motion.button>
              </form>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
      <style jsx="true">{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.3);
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default Chatbot;
