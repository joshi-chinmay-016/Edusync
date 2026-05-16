import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, User, Shield, ArrowRight } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Logo from './Logo';

const Login = ({ setUser, showToast, logEvent }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isRegister, setIsRegister] = useState(false);
  const [isRegisterSuccess, setIsRegisterSuccess] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  const [email, setEmail] = useState('admin@edusync.local');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Student');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('mode') === 'register') {
      setIsRegister(true);
      setEmail('');
      setPassword('');
      setName('');
    } else {
      setIsRegister(false);
      setEmail('admin@edusync.local');
      setPassword('password123');
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegister) {
      setIsRegisterSuccess(true);
      setTimeout(() => {
        setUser({ name, email, role });
        if (showToast) showToast(`Welcome, ${name}! Your account has been created.`, 'success');
        logEvent?.({ action: 'LOGIN', user_email: email });
        navigate('/dashboard');
      }, 2500);
      return;
    }

    // Try to authenticate against backend if available
    let apiUser = null;
    try {
      const formData = new URLSearchParams();
      formData.append('grant_type', 'password');
      formData.append('username', email);
      formData.append('password', password);

      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('edusync_token', data.access_token);

        const meRes = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${data.access_token}` }
        });
        if (meRes.ok) {
          apiUser = await meRes.json();
        }
      }
    } catch (err) {
      // ignore errors; fallback below
    }

    if (apiUser) {
      setUser(apiUser);
      if (showToast) showToast(`Successfully logged in as ${apiUser.name} (${apiUser.role})`, 'success');
      logEvent?.({ action: 'LOGIN', user_email: apiUser.email });
      navigate('/dashboard');
      return;
    }

    // Fallback local mode
    let userRole = 'Admin';
    let userName = 'System Admin';
    const emailLower = email.toLowerCase();

    if (emailLower.includes('faculty') || emailLower.includes('chen') || emailLower.includes('turing') || emailLower.includes('prof')) {
      userRole = 'Faculty';
      if (emailLower.includes('chen')) userName = 'Dr. Emily Chen';
      else if (emailLower.includes('turing')) userName = 'Prof. Alan Turing';
      else userName = email.split('@')[0].split('.').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    } else if (emailLower.includes('student') || emailLower.includes('doe')) {
      userRole = 'Student';
      if (emailLower.includes('doe')) userName = 'John Doe';
      else userName = email.split('@')[0].split('.').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    } else if (!emailLower.includes('admin')) {
      userRole = 'Faculty'; 
      userName = email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);
    }

    setUser({ name: userName, email, role: userRole });
    logEvent?.({ action: 'LOGIN', user_email: email });
    if (showToast) showToast(`Successfully logged in as ${userName} (${userRole})`, 'success');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 flex items-center justify-center transition-transform group-hover:rotate-12 group-hover:scale-110 drop-shadow-[0_0_15px_rgba(99,102,241,0.4)]">
            <Logo className="w-10 h-10" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white hover:text-indigo-400 transition">EduSync</h1>
        </Link>
      </div>

      <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 p-8 md:p-10 rounded-3xl w-full max-w-md shadow-[0_10px_50px_rgba(0,0,0,0.5)] z-10 transition-all">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            {isRegister ? 'Create an account' : 'Welcome back'}
          </h2>
          <p className="text-gray-400 mt-2 text-sm">
            {isRegister ? 'Join EduSync to optimize your campus resources.' : 'Enter your credentials to access your dashboard.'}
          </p>
        </div>

        {isRegisterSuccess ? (
          <div className="flex flex-col items-center justify-center py-10 pb-12 animate-in fade-in duration-500 text-center">
            <div className="w-48 h-48 mb-4">
              <DotLottieReact
                src="https://lottie.host/9454848c-6661-488b-899a-c734d0e0d7d8/j5XPdlb3ZZ.lottie"
                loop
                autoplay
              />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Registration Successful</h3>
            <p className="text-indigo-400 text-sm font-medium">Preparing your dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5 ml-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-950/50 border border-gray-800 text-white rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-inner"
                    placeholder="John Doe"
                    required={isRegister}
                  />
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                   <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-950/50 border border-gray-800 text-white rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-inner"
                  placeholder="you@edusync.local"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                   <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-950/50 border border-gray-800 text-white rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-inner"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5 ml-1">Select Custom Role</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                     <Shield className="h-5 w-5 text-gray-500" />
                  </div>
                  <select 
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-gray-950/50 border border-gray-800 text-white rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-inner appearance-none cursor-pointer"
                  >
                    <option value="Student">Student</option>
                    <option value="Faculty">Faculty</option>
                    <option value="Admin">Administrator</option>
                  </select>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition shadow-[0_0_20px_rgba(79,70,229,0.3)] mt-6 flex justify-center items-center group"
            >
              {isRegister ? 'Create Account' : 'Sign In'}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        )}

        <div className="mt-8 text-center text-sm text-gray-400">
          {isRegister ? (
            <p>Already have an account? <span onClick={() => setIsRegister(false)} className="text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer transition">Sign in here</span></p>
          ) : (
            <p>Don't have an account? <span onClick={() => setIsRegister(true)} className="text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer transition">Register now</span></p>
          )}
        </div>
      </div>
      
      {!isRegister && (
         <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-gray-500 text-xs w-full text-center px-4">
           <p className="bg-gray-900/40 backdrop-blur-md px-4 py-2 rounded-full border border-gray-800/50 inline-block">
             Testing? Try <span className="text-indigo-400 font-medium">faculty@edusync.local</span> or <span className="text-cyan-400 font-medium">student@edusync.local</span> to switch roles.
           </p>
         </div>
      )}
    </div>
  );
};

export default Login;
