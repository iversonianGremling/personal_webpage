import React, { useEffect, useRef } from 'react';

// Real images for the collage
const imageSources = [
  'https://picsum.photos/800/600',
  'https://picsum.photos/900/700',
  'https://picsum.photos/700/500',
  'https://picsum.photos/850/650',
  'https://picsum.photos/750/550',
  'https://picsum.photos/950/750',
];

const Background = () => {
  const canvasRef = useRef(null);
  const layers = useRef([]);
  const numLayers = 3; // Number of layers

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const loadImages = () => {
      for (let i = 0; i < numLayers; i++) {
        const layerItems = [];
        for (let j = 0; j < 10; j++) { // 10 items per layer
          const img = new Image();
          img.src = imageSources[Math.floor(Math.random() * imageSources.length)];

          img.onload = () => {
            layerItems.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              size: Math.random() * 150 + 100, // Random size between 100 and 250px
              speed: (i + 1) * 0.5, // Different speed for each layer
              image: img,
            });

            // Once all images in the layer are loaded, add the layer to layers
            if (layerItems.length === 10) {
              layers.current.push(layerItems);
            }
          };
        }
      }
    };

    loadImages();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const handleMouseMove = (event) => {
      const mouseX = event.clientX / window.innerWidth;
      const mouseY = event.clientY / window.innerHeight;

      layers.current.forEach((layerItems, layerIndex) => {
        layerItems.forEach((item) => {
          item.x += (mouseX - 0.5) * -layerItems[0].speed;
          item.y += (mouseY - 0.5) * -layerItems[0].speed;

          // Wrap items around the screen edges
          if (item.x < -item.size) item.x = canvas.width;
          if (item.x > canvas.width) item.x = -item.size;
          if (item.y < -item.size) item.y = canvas.height;
          if (item.y > canvas.height) item.y = -item.size;
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      layers.current.forEach((layerItems) => {
        layerItems.forEach((item) => {
          ctx.globalAlpha = 0.8; // Set transparency for the images
          ctx.drawImage(item.image, item.x, item.y, item.size, item.size);
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none', // Allow clicks to pass through
        zIndex: -1, // Ensure it's behind other content
      }}
    ></canvas>
  );
};

export default Background;
