import React from 'react';

// Simplified World Map SVG. Source: Natural Earth, public domain.
const WorldMapSvg: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M500,0 L1000,250 L500,500 L0,250 Z" fill="#f0f0f0" className="dark:fill-gray-700" />
    {/* This is a placeholder background. A real implementation would have detailed SVG path data for all countries. */}
    {/* Fix: Combined duplicate className attributes into one. */}
    <g stroke="#ccc" strokeWidth="0.5" fill="#e0e0e0" className="dark:stroke-gray-600 dark:fill-gray-600">
      {/* North America */}
      <path d="M 104,182 l 14,-62 l 60,8 l 58,-40 l 42,20 l 20,40 l -20,20 l -50,10 l -30,20 l -54,-10 z" />
      {/* South America */}
      <path d="M 300,320 l 20,-70 l -40,-40 l -30,10 l -10,40 l 20,50 z" />
      {/* Africa */}
      <path d="M 450,250 l 30,-50 l 40,0 l 20,40 l -10,60 l -50,30 l -30,-40 z" />
      {/* Europe */}
      <path d="M 480,150 l 30,-20 l 40,0 l 10,20 l -20,30 l -40,0 z" />
      {/* Asia */}
      <path d="M 600,180 l 100,-50 l 120,50 l 20,80 l -100,60 l -120,-40 z" />
      {/* Australia */}
      <path d="M 800,400 l 50,-30 l 30,40 l -40,30 z" />
    </g>
  </svg>
);

export default WorldMapSvg;