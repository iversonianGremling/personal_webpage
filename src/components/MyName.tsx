import React, { useState, useEffect } from 'react';

export const MyName: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const renderNameLayers = () => {
    const layers = 14;
    return Array.from({ length: layers }).map((_, index) => {
      const animationName = index % 2 === 0 ? 'moveRight' : 'moveLeft';
      const centerX = windowSize.width / 2;
      const centerY = windowSize.height / 2;
      const mouseX = ((mousePos.x - centerX) / centerX) * (0.5 + index * 0.1);
      const mouseY = ((mousePos.y - centerY) / centerY) * (0.2 + index * 0.05);

      return (
        <div
          key={index}
          className="absolute overflow-hidden"
          style={{
            top: `${-4 + 8 * index}rem`,
            left: '2rem',
            transform: `translate3d(${mouseX}rem, ${mouseY}rem, 0)`,
            zIndex: -100 - index,
          }}
        >
          <h1
            className="font-bold text-violet-600"
            style={{
              fontSize: '14rem',
              fontFamily: 'Tinos, serif',
              opacity: 1 - (1 / layers) * index,
              animation: `${animationName} ${20 + index * 2}s linear infinite`,
              whiteSpace: 'nowrap',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              WebkitTextStroke: '1px rgba(255,255,255,0.2)',
              display: 'inline-block',
              paddingRight: '50vw' // Ensure continuous animation
            }}
          >
            VELA VELUCCI VELA VELUCCI VELA VELUCCI
          </h1>
        </div>
      );
    });
  };

  return (
    <div className="cursor-default overflow-hidden w-screen h-screen fixed top-0 left-0 -z-10">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Tinos:ital,wght@0,400;0,700;1,400;1,700&display=swap');          
          @keyframes moveRight {
            0% { transform: translateX(-5%); }
            100% { transform: translateX(0%); }
          }
          @keyframes moveLeft {
            0% { transform: translateX(5%); }
            100% { transform: translateX(0%); }
          }
        `}
      </style>
      {renderNameLayers()}

      {/* Attribution Footer */}
      {/* <footer className="fixed bottom-2 right-2 text-xs text-white opacity-50">
        Font: <a href="https://fonts.google.com/specimen/Rubik+Glitch"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:opacity-75">
          Rubik Glitch
        </a> via Google Fonts
      </footer> */}
    </div>
  );
};
