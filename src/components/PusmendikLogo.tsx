/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

interface PusmendikLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showGlow?: boolean;
}

export const PusmendikLogo: React.FC<PusmendikLogoProps> = ({
  className = '',
  size = 'md',
  showGlow = true,
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  }[size];

  if (!imageError) {
    return (
      <div className={`relative shrink-0 flex items-center justify-center ${className}`}>
        {showGlow && (
          <div className="absolute inset-0 rounded-full bg-amber-400/30 blur-sm scale-110 pointer-events-none" />
        )}
        <img
          src="/pusmendik_logo.jpg"
          alt="Logo Pusmendik CBT"
          onError={() => setImageError(true)}
          className={`${sizeClasses} rounded-full object-cover shadow-lg border-2 border-amber-300 ring-2 ring-blue-900/40 shrink-0 bg-blue-950 transition transform hover:scale-105 relative z-10`}
        />
      </div>
    );
  }

  // Fallback to stylized vector emblem with torch & laurel
  return (
    <div
      className={`${sizeClasses} rounded-full bg-gradient-to-br from-[#1b365d] via-blue-900 to-[#0f172a] flex items-center justify-center p-1.5 shadow-lg shrink-0 border-2 border-amber-300 ring-2 ring-amber-400/20 relative z-10 ${className}`}
    >
      <svg className="w-full h-full text-amber-300" viewBox="0 0 48 48" fill="none">
        {/* Outer Laurel / Ring */}
        <circle cx="24" cy="24" r="21" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
        <circle cx="24" cy="24" r="18" stroke="#38bdf8" strokeWidth="1" opacity="0.6" />
        {/* Open Book Base */}
        <path
          d="M12 34C16 32 20 33 24 35C28 33 32 32 36 34V18C32 16 28 17 24 19C20 17 16 16 12 18V34Z"
          fill="#1e3a8a"
          stroke="#f59e0b"
          strokeWidth="1.5"
        />
        {/* Torch Body */}
        <path d="M22 23L21 33H27L26 23H22Z" fill="#f59e0b" />
        <rect x="20.5" y="21" width="7" height="2.5" rx="1" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
        {/* Cyan Flame */}
        <path
          d="M24 8C26 12 28 14 27 18C25.5 17 24 16 23 18C22 15 22 12 24 8Z"
          fill="#38bdf8"
        />
        <path
          d="M24 12C25 14 25.5 16 25 18C24.2 17.5 23.5 17 23 18C22.8 16.5 23 14.5 24 12Z"
          fill="#ffffff"
        />
      </svg>
    </div>
  );
};
