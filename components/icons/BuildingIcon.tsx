
import React from 'react';

export const BuildingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M8.25 21V10.5M12 21V10.5m3.75 10.5V10.5m2.25-4.5h-15m15 0a9 9 0 00-15 0m15 0V3.75M5.25 6H3.75m16.5 0h-1.5M5.25 6V3.75m13.5 0V6" 
    />
  </svg>
);
