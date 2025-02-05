import React, { useEffect, useRef } from 'react';

const Background = () => {
  const canvasRef = useRef(null);
  const text = 'Vela Velucci';
  const fonts = ['bold 24px Arial', '28px Verdana', 'italic 26px Georgia'];
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 720);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleResize = () => {
    const mobile = window.innerWidth < 720;
    setIsMobile(mobile);
  };

  useEffect(() => {
    if (!isMobile){
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Create three distinct layers with different properties
      const layers = [
        { // Closest layer (moves most)
          items: Array.from({ length: 15 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            baseSize: Math.random() * 10 + 50,
            speed: 0.5,
            font: fonts[0],
            offset: Math.random() * 1000,
            floatX: 0,
            floatY: 0
          })),
          opacity: 0.3
        },
        { // Middle layer
          items: Array.from({ length: 25 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            baseSize: Math.random() * 10 + 30,
            speed: 0.3,
            font: fonts[1],
            offset: Math.random() * 1000,
            floatX: 0,
            floatY: 0
          })),
          opacity: 0.2
        },
        { // Farthest layer (moves least)
          items: Array.from({ length: 35 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            baseSize: Math.random() * 10 + 20,
            speed: 0.1,
            font: fonts[2],
            offset: Math.random() * 1000,
            floatX: 0,
            floatY: 0
          })),
          opacity: 0.1
        }
      ];

      let mouseX = 0;
      let mouseY = 0;
      let animationFrameId;

      const handleMouseMove = (e) => {
        mouseX = e.clientX - window.innerWidth / 2;
        mouseY = e.clientY - window.innerHeight / 2;
      };

      const animate = (timestamp) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        layers.forEach(layer => {
          ctx.globalAlpha = layer.opacity;
          layer.items.forEach(item => {
          // Mouse movement effect
            const moveX = mouseX * 0.02 * item.speed;
            const moveY = mouseY * 0.02 * item.speed;

            // Floating effect using perlin-like noise
            const floatOffset = timestamp * 0.001 + item.offset;
            item.floatX = Math.sin(floatOffset) * 20;
            item.floatY = Math.cos(floatOffset * 0.8) * 15;

            // Calculate final position
            const x = (item.x + moveX + item.floatX + canvas.width) % canvas.width;
            const y = (item.y + moveY + item.floatY + canvas.height) % canvas.height;

            // Dynamic size based on floating effect
            const size = item.baseSize + Math.sin(floatOffset) * 5;

            ctx.font = item.font.replace(/\d+/, size.toString());
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, x, y);
          });
        });

        animationFrameId = requestAnimationFrame(animate);
      };

      window.addEventListener('mousemove', handleMouseMove);
      animate(0);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        cancelAnimationFrame(animationFrameId);
      };
    }
  }, []);

  return (
    isMobile?  (<div className='bg-purple-700'></div>):
      (<canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: -1
        }}
      />)
  );
};

export default Background;
