import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Brain, CalendarCheck, BarChart, ArrowRight, Play, Cpu, Sparkles, Network, Users, Clock, ShieldCheck, ChevronRight, Star } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Logo from './Logo';

const TypewriterText = ({ text }) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayText(prev => {
        if (i < text.length) {
          i++;
          return text.slice(0, i);
        }
        clearInterval(intervalId);
        return prev;
      });
    }, 40);
    return () => clearInterval(intervalId);
  }, [text]);

  return <span>{displayText}</span>;
}

const StatCounter = ({ end, label, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    const duration = 2000;
    
    const animate = (time) => {
      if (!startTime) startTime = time;
      const progress = time - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      setCount(Math.floor(end * percentage));
      
      if (percentage < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [end]);

  return (
    <div className="flex flex-col items-center">
      <div className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-sky-400">
        {count}{suffix}
      </div>
      <div className="text-sm md:text-base text-slate-500 font-semibold mt-2 uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
};

const LandingPage = () => {
  const { scrollYProgress } = useScroll();
  const yElement = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacityElement = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const STAGGER = 0.1;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: STAGGER, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, filter: 'blur(10px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: "spring", stiffness: 60, damping: 15 } }
  };

  const testimonials = [
    { name: "Dr. Sarah Jenkins", role: "Computer Science Professor", text: "EduSync eliminated our department's double-booking nightmare completely. The AI resource locator is a lifesaver.", rating: 5 },
    { name: "Michael Chang", role: "Student Union President", text: "Finding an empty study room used to take 30 minutes of wandering. Now it takes 3 seconds on my phone.", rating: 5 },
    { name: "Dean Robert Hayes", role: "University Administration", text: "The infrastructure analytics gave us the data we needed to optimize our campus energy usage by 15% this semester alone.", rating: 5 }
  ];

  const floatingVariants = {
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-blue-100 text-slate-800 font-sans overflow-x-hidden selection:bg-blue-300/40 transition-colors duration-700">
      
      {/* ── Ambient Background Blobs ── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Large top-right blue orb */}
        <motion.div
          animate={{ rotate: [0, 90, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-[15%] -right-[10%] w-[55vw] h-[55vw] bg-blue-400/20 blur-[130px] rounded-full"
        />
        {/* Mid-left sky orb */}
        <motion.div
          animate={{ rotate: [0, -90, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[35%] -left-[10%] w-[45vw] h-[45vw] bg-sky-300/25 blur-[120px] rounded-full"
        />
        {/* Bottom center accent */}
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[5%] left-[30%] w-[40vw] h-[40vw] bg-blue-200/30 blur-[100px] rounded-full"
        />
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#c7d2fe18_1px,transparent_1px),linear-gradient(to_bottom,#c7d2fe18_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_65%_65%_at_50%_40%,#000_70%,transparent_100%)]" />
      </div>

      {/* ── Hero Section ── */}
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10 flex flex-col items-center justify-center min-h-[90vh]">
        <motion.div
          style={{ y: yElement, opacity: opacityElement }}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="text-center max-w-5xl mx-auto space-y-10"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center space-x-3 bg-white/70 backdrop-blur-2xl border border-blue-200/60 rounded-full px-6 py-2.5 shadow-lg shadow-blue-100/50 group cursor-default"
          >
            <div className="relative flex items-center justify-center">
              <Sparkles className="relative w-5 h-5 text-blue-500 z-10" />
              <div className="absolute inset-0 bg-blue-400 blur-md opacity-40 group-hover:opacity-70 transition duration-500" />
            </div>
            <span className="text-sm font-black text-slate-700 tracking-wider uppercase">
              <TypewriterText text="EduSync Core AI Engine 2.0 Online" />
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-[6rem] font-black tracking-tighter leading-[1.05] text-slate-800"
          >
            Campus Logistics, <br className="hidden md:block" />
            <span className="relative inline-block mt-4 md:mt-2 px-4 py-2">
              <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-400">
                Perfectly Synchronized.
              </span>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.5, delay: 0.8, ease: "circOut" }}
                className="absolute inset-0 bg-blue-100/60 rounded-3xl -z-10 origin-left backdrop-blur-sm"
              />
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            Deploy cutting-edge neural models to eliminate conflicting bookings, seamlessly locate available study rooms, and optimize your university's infrastructure usage.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center space-y-5 sm:space-y-0 sm:space-x-8 pt-6"
          >
            <Link to="/login?mode=register" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 45px rgba(59,130,246,0.45)" }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-10 py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center group relative overflow-hidden shadow-xl shadow-blue-200"
              >
                <span className="relative z-10 gap-2 flex items-center drop-shadow-sm">
                  Get Started Free
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/25 to-transparent z-0" />
              </motion.button>
            </Link>

            <a href="#features" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto text-slate-700 bg-white/60 backdrop-blur-xl border-2 border-blue-200/60 hover:border-blue-400 px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-blue-100/30 group flex items-center justify-center"
              >
                <Play className="w-6 h-6 mr-3 text-blue-500 group-hover:scale-110 transition-transform" />
                Watch Demo
              </motion.button>
            </a>
          </motion.div>
        </motion.div>
      </main>

      {/* ── Dashboard Preview Card ── */}
      <div className="relative z-20 px-6 max-w-6xl mx-auto mb-32 group">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 40, damping: 20 }}
          className="relative rounded-[2rem] p-4 md:p-6 bg-white/50 backdrop-blur-3xl border border-white/70 shadow-[0_20px_60px_rgba(59,130,246,0.12)] ring-1 ring-blue-200/40"
        >
          {/* macOS-style titlebar */}
          <div className="flex items-center space-x-2 mb-6 ml-2">
            <div className="w-3.5 h-3.5 rounded-full bg-red-400/80" />
            <div className="w-3.5 h-3.5 rounded-full bg-amber-400/80" />
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-400/80" />
            <div className="ml-4 bg-blue-100/60 rounded-md h-5 w-48 border border-blue-200/50" />
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Stats panel */}
            <div className="flex-1 bg-white/70 backdrop-blur-xl rounded-2xl border border-blue-100/60 p-8 shadow-inner overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400" />
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-800">Campus Overview</h3>
                  <p className="text-slate-400 text-sm">Real-time utilization metrics</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl text-blue-500 border border-blue-100">
                  <BarChart className="w-6 h-6" />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2 font-bold">
                    <span className="text-slate-600">Room 101 Utilization</span>
                    <span className="text-cyan-500">85%</span>
                  </div>
                  <div className="h-3 w-full bg-blue-100/60 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "85%" }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2 font-bold">
                    <span className="text-slate-600">Lab 203 Utilization</span>
                    <span className="text-sky-500">42%</span>
                  </div>
                  <div className="h-3 w-full bg-blue-100/60 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "42%" }}
                      transition={{ duration: 1.5, delay: 0.7 }}
                      className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full"
                    />
                  </div>
                </div>
                <div className="mt-8 p-4 bg-amber-50/80 border border-amber-200/60 rounded-xl flex items-start space-x-3 backdrop-blur-sm">
                  <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-amber-700">AI Recommendation</p>
                    <p className="text-xs text-amber-600/80 mt-1">Lab 203 is underutilized. Consider scheduling afternoon classes here to balance load.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lottie panel */}
            <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-blue-50/60 to-sky-100/60 rounded-2xl border border-blue-100/60 backdrop-blur-sm">
              <div className="w-full max-w-sm h-64">
                <DotLottieReact
                  src="https://lottie.host/6ee6371c-0cae-474c-8904-97048092fb47/hYZ4QHe7EV.lottie"
                  loop
                  autoplay
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Stats Band ── */}
      <div className="relative z-10 border-y border-blue-100/70 bg-white/50 backdrop-blur-md py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-blue-100">
          <StatCounter end={12500} label="Bookings Managed" suffix="+" />
          <StatCounter end={98}    label="Conflict Resolution" suffix="%" />
          <StatCounter end={450}   label="Classrooms Tracked" />
          <StatCounter end={24}    label="Hours Saved/Week" suffix="h" />
        </div>
      </div>

      {/* ── Features Section ── */}
      <div id="features" className="relative z-10 py-32 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 space-y-6">
            <h2 className="text-4xl md:text-5xl font-black text-slate-800">
              Built for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">Everyone</span>
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              A unified platform that adapts to the needs of students, teachers, and administrators.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Teacher */}
            <motion.div
              variants={floatingVariants}
              animate="animate"
              className="bg-white/60 backdrop-blur-xl border border-blue-100/70 p-8 rounded-[2rem] shadow-xl shadow-blue-100/30 hover:shadow-blue-200/50 transition-shadow relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Users className="w-32 h-32 text-blue-400" />
              </div>
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-500 border border-blue-100">
                <CalendarCheck className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black mb-3 text-slate-800">For Teachers</h3>
              <ul className="space-y-3 text-slate-500 font-medium">
                <li className="flex items-start"><ShieldCheck className="w-5 h-5 mr-2 text-emerald-500 flex-shrink-0" /> Conflict-free room booking</li>
                <li className="flex items-start"><Cpu className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0" /> Requirement-based filtering (e.g. Projectors)</li>
                <li className="flex items-start"><Clock className="w-5 h-5 mr-2 text-amber-400 flex-shrink-0" /> Manage recurring lectures easily</li>
              </ul>
            </motion.div>

            {/* Student */}
            <motion.div
              variants={floatingVariants}
              animate="animate"
              style={{ animationDelay: '1s' }}
              className="bg-white/60 backdrop-blur-xl border border-blue-100/70 p-8 rounded-[2rem] shadow-xl shadow-blue-100/30 hover:shadow-blue-200/50 transition-shadow relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Brain className="w-32 h-32 text-cyan-400" />
              </div>
              <div className="w-16 h-16 bg-cyan-50 rounded-2xl flex items-center justify-center mb-6 text-cyan-500 border border-cyan-100">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black mb-3 text-slate-800">For Students</h3>
              <ul className="space-y-3 text-slate-500 font-medium">
                <li className="flex items-start"><ShieldCheck className="w-5 h-5 mr-2 text-emerald-500 flex-shrink-0" /> Instant free classroom discovery</li>
                <li className="flex items-start"><Cpu className="w-5 h-5 mr-2 text-cyan-500 flex-shrink-0" /> Book spaces for group study</li>
                <li className="flex items-start"><Clock className="w-5 h-5 mr-2 text-amber-400 flex-shrink-0" /> Interactive campus room locator</li>
              </ul>
            </motion.div>

            {/* Admin */}
            <motion.div
              variants={floatingVariants}
              animate="animate"
              style={{ animationDelay: '2s' }}
              className="bg-white/60 backdrop-blur-xl border border-blue-100/70 p-8 rounded-[2rem] shadow-xl shadow-blue-100/30 hover:shadow-blue-200/50 transition-shadow relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Network className="w-32 h-32 text-sky-400" />
              </div>
              <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center mb-6 text-sky-500 border border-sky-100">
                <BarChart className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black mb-3 text-slate-800">For Administration</h3>
              <ul className="space-y-3 text-slate-500 font-medium">
                <li className="flex items-start"><ShieldCheck className="w-5 h-5 mr-2 text-emerald-500 flex-shrink-0" /> AI-driven infrastructure analytics</li>
                <li className="flex items-start"><Cpu className="w-5 h-5 mr-2 text-sky-500 flex-shrink-0" /> Detect peak hours &amp; underutilized spaces</li>
                <li className="flex items-start"><Clock className="w-5 h-5 mr-2 text-amber-400 flex-shrink-0" /> Automated optimization recommendations</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Testimonials ── */}
      <div className="relative z-10 py-32 bg-gradient-to-b from-sky-50/80 to-blue-100/60 backdrop-blur-sm border-t border-blue-100/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-800">Campus Success Stories</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/65 backdrop-blur-xl p-8 rounded-3xl shadow-lg shadow-blue-100/40 border border-white/80 hover:shadow-blue-200/50 transition-shadow"
              >
                <div className="flex space-x-1 mb-4">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 italic mb-6">"{test.text}"</p>
                <div>
                  <h4 className="font-bold text-slate-800">{test.name}</h4>
                  <span className="text-sm text-blue-500">{test.role}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA Section ── */}
      <div className="relative z-10 py-24 overflow-hidden">
        {/* Glass CTA card */}
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative rounded-[2.5rem] bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 p-[2px] shadow-2xl shadow-blue-300/40">
            <div className="relative rounded-[2.4rem] bg-gradient-to-br from-blue-600 to-cyan-500 px-10 py-20 text-center overflow-hidden">
              {/* Noise overlay */}
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
              {/* Glow orbs */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 blur-2xl rounded-full" />

              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                  Ready to Optimize Your Campus?
                </h2>
                <p className="text-blue-100 text-xl mb-10 max-w-2xl mx-auto">
                  Join thousands of students and faculty experiencing a frictionless scheduling environment.
                </p>
                <Link to="/login?mode=register">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(255,255,255,0.3)" }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-blue-600 px-10 py-4 rounded-full font-black text-lg shadow-xl hover:shadow-2xl transition-all"
                  >
                    Create Free Account
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="bg-white/60 backdrop-blur-md border-t border-blue-100/60 py-16 text-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
            <Logo className="w-10 h-10" />
            <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">
              EduSync
            </span>
          </div>

          <div className="flex space-x-6 text-sm font-semibold text-slate-400">
            <a href="#" className="hover:text-blue-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Terms</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Contact</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Documentation</a>
          </div>
        </div>
        <p className="text-slate-400 text-sm mt-8">© 2026 EduSync Core Technologies. Built for the future of education.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
