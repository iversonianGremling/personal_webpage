import React, { useEffect, useState } from 'react';

const MovingTitle = () => {
  const [squarePosition, setSquarePosition] = useState(0);

  useEffect(() => {
    const handleMouseMove = (event) => {
      const screenWidth = window.innerWidth;
      const container = document.querySelector('.container');
      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;

      // Calculate position of the square relative to the container width
      const relativeX = (event.clientX / screenWidth) * containerWidth;

      // Ensure the square stays within the confines of the container
      const newPosition = Math.max(0, Math.min(relativeX, containerWidth))/100;
      setSquarePosition(newPosition);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="container h-24 w-full mx-auto relative overflow-hidden mb-6">
      <div
        className="title text-7xl text-red-600 font-serif mt-6 transition-colors hover:text-white absolute top-0 cursor-default"
        style={{ opacity: `${squarePosition / 10 + 0.30}` }}
      >
                  LAST POSTS
      </div>


    </div>
  );
};

export default MovingTitle;
