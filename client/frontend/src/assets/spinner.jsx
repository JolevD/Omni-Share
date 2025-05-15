import React from 'react';

export const LoadingSpinner = ({ size = 16 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24"
    style={{
      animation: 'spin 1s linear infinite',
      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
    }}
  >
    <circle 
      cx="12" 
      cy="12" 
      r="10" 
      stroke="currentColor" 
      strokeWidth="4" 
      fill="none" 
      opacity="0.25" 
    />
    <path 
      fill="currentColor" 
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
    />
  </svg>
);