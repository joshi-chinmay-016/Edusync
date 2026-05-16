import React from 'react';

const Logo = ({ className = "w-8 h-8" }) => (
  <svg 
    viewBox="0 0 100 100" 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="edusync-grad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#0ea5e9" />    {/* Light blue / Cyan */}
        <stop offset="35%" stopColor="#3b82f6" />   {/* Royal Blue */}
        <stop offset="70%" stopColor="#6366f1" />   {/* Indigo */}
        <stop offset="100%" stopColor="#d946ef" />  {/* Magenta / Pink */}
      </linearGradient>
      
      <linearGradient id="shadow-curve" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#000" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#000" stopOpacity="0" />
      </linearGradient>
    </defs>

    {/* Background Base */}
    <path 
      d="M50 5 C 75 5, 95 30, 95 65 C 95 90, 70 95, 50 95 C 30 95, 5 90, 5 65 C 5 30, 25 5, 50 5 Z" 
      fill="#09090b" 
    />

    <g transform="translate(50, 52) rotate(0) translate(-50, -50)">
      {/* Outer Triangle Shape constructed from 3 sweeping curves */}
      <path 
         d="M 50 10 Q 90 20 85 75 Q 50 90 15 75 Q 10 20 50 10 Z" 
         fill="url(#edusync-grad)" 
      />

      {/* Shutter Blade Intersect 1 */}
      <path d="M 50 10 Q 60 40 50 50 L 50 50 Q 80 40 85 75 Z" fill="url(#shadow-curve)" />
      
      {/* Shutter Blade Intersect 2 */}
      <path d="M 85 75 Q 40 80 50 50 L 50 50 Q 20 60 15 75 Z" fill="url(#shadow-curve)" />
      
      {/* Shutter Blade Intersect 3 */}
      <path d="M 15 75 Q 30 30 50 50 L 50 50 Q 30 20 50 10 Z" fill="url(#shadow-curve)" />
      
      {/* Dark Shutter Lines separating the blades */}
      <path d="M 50 50 Q 60 20 50 10" stroke="#000" strokeWidth="3" fill="none" />
      <path d="M 50 50 Q 70 60 85 75" stroke="#000" strokeWidth="3" fill="none" />
      <path d="M 50 50 Q 20 60 15 75" stroke="#000" strokeWidth="3" fill="none" />

      {/* Core Center Space */}
      <circle cx="50" cy="50" r="18" fill="#000" />
    </g>

    {/* The White E */}
    <text 
      x="50" 
      y="54" 
      fontFamily="system-ui, -apple-system, sans-serif" 
      fontWeight="900" 
      fontSize="26" 
      fill="#ffffff" 
      textAnchor="middle"
      dominantBaseline="middle"
      className="select-none"
    >
      E
    </text>
  </svg>
);

export default Logo;
