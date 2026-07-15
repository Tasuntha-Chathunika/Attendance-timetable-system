import React from 'react';

const Logo = ({ className = "w-10 h-10", textClassName = "text-2xl", showText = true }) => {
  return (
    <div className="flex items-center space-x-3">
      {/* Logo Icon */}
      <div className={`${className} relative flex items-center justify-center`}>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg transform -rotate-6 scale-105 opacity-70 blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg transform rotate-3 border border-white/20"></div>
        <svg className="relative w-3/5 h-3/5 text-white drop-shadow-md z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col justify-center">
          <span className={`font-extrabold tracking-tighter ${textClassName} leading-none`}>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">ATMS</span>
          </span>
          <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mt-0.5">System</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
