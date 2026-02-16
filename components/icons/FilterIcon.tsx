
import React from 'react';

export const FilterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
      d="M12 3c2.755 0 5.455.232 7.973.668M12 3c-2.755 0-5.455.232-7.973.668m15.946 0A9.973 9.973 0 0121.75 6.32M3.027 3.668A9.973 9.973 0 002.25 6.32m19.5 0v1.076c0 .816-.274 1.583-.78 2.16l-6.319 6.32a2.25 2.25 0 01-1.59.658H9.322a2.25 2.25 0 01-1.591-.658l-6.319-6.32A2.258 2.258 0 012.25 7.395V6.32m19.5 0h-2.146M2.25 6.32H4.4M3.375 18.75h17.25" 
    />
  </svg>
);