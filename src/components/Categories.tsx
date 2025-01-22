import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import SaladFingersText from './SaladFingers';

const Categories = () => {
  const radius = 120; // Radius of the circle
  const iconSize = 60; // Size of each icon
  const innerBoundary = radius - iconSize / 2 - 50; // Inner boundary for interactive zone
  const outerBoundary = radius + iconSize / 2; // Outer boundary for interactive zone
  const [rotation, setRotation] = useState(0); // Current rotation angle
  const [prevAngle, setPrevAngle] = useState<number | null>(null); // Previous angle of the mouse relative to the center
  const [isInside, setIsInside] = useState(false); // Whether the mouse is inside the interactive zone
  const circleRef = useRef<HTMLDivElement | null>(null); // Ref for the circle container

  const categories = [
    { to: '/music', imgSrc: 'https://cdn-icons-png.flaticon.com/512/727/727245.png', alt: 'Music', label: 'Music' },
    { to: '/gaming', imgSrc: 'https://cdn-icons-png.flaticon.com/512/7329/7329743.png', alt: 'Gaming', label: 'Gaming' },
    { to: '/philosophy', imgSrc: 'https://cdn-icons-png.flaticon.com/512/2913/2913490.png', alt: 'Philosophy', label: 'Philosophy' },
    { to: '/writings', imgSrc: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', alt: 'Writings', label: 'Writings' },
    { to: '/articles', imgSrc: 'https://cdn-icons-png.flaticon.com/512/2617/2617315.png', alt: 'Articles', label: 'Articles' },
    { to: '/intersectionality', imgSrc: 'https://cdn-icons-png.flaticon.com/512/2883/2883859.png', alt: 'Intersectionality', label: 'Intersectionality' },
    { to: '/programming', imgSrc: 'https://cdn-icons-png.flaticon.com/512/4712/4712015.png', alt: 'Programming', label: 'Programming' },
    { to: '/working', imgSrc: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', alt: 'Working', label: 'Working' },
  ];

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!circleRef.current) return;

      const rect = circleRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      // Calculate distance from mouse to center of the circle
      const distance = Math.sqrt((mouseX - centerX) ** 2 + (mouseY - centerY) ** 2);

      // Check if mouse is within the interactive zone (between inner and outer boundaries)
      if (distance >= innerBoundary && distance <= outerBoundary) {
        setIsInside(true); // Mark that the mouse is inside the interactive zone

        // Calculate the absolute angle between the mouse and the center of the circle
        const angle = Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI);

        if (prevAngle !== null) {
          // Calculate the difference between the current angle and the previous angle
          let deltaAngle = angle - prevAngle;

          // Normalize the delta angle to be within -180 to 180 degrees
          if (deltaAngle > 180) deltaAngle -= 360;
          if (deltaAngle < -180) deltaAngle += 360;

          // Update the rotation based on the delta angle
          setRotation((prevRotation) => prevRotation + deltaAngle);
        }

        // Update the previous angle
        setPrevAngle(angle);
      } else {
        setIsInside(false); // Mark that the mouse has left the interactive zone
        setPrevAngle(null); // Reset previous angle to prevent sudden jumps
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [innerBoundary, outerBoundary, prevAngle]);

  return (
    <div className="flex items-center justify-center text-white shadow-lg h-screen pb-32">
      <div
        ref={circleRef}
        className="circle-container relative"
        style={{ width: `${2 * radius}px`, height: `${2 * radius}px` }}
      >
        {/* Render category icons in a rotated position */}
        {categories.map((category, index) => {
          // Calculate the initial angle for each icon
          const angle = (index * 360) / categories.length; // Distribute icons evenly around the circle
          const radians = -2 * (angle/2 + rotation) * (Math.PI / 180); // Convert to radians and apply rotation
          const x = radius + radius * Math.cos(radians) - iconSize / 2;
          const y = radius + radius * Math.sin(radians) - iconSize / 2;

          return (
            <div
              key={index}
              className="absolute flex flex-col items-center"
              style={{
                left: `${x}px`,
                top: `${y}px`,
                width: `${iconSize}px`,
                height: `${iconSize + 20}px`, // Extra height for label text
              }}
            >
              <Link to={category.to} className="w-full h-full">
                <img
                  src={category.imgSrc}
                  alt={category.alt}
                  className="w-full h-full rounded-full hover:opacity-80 bg-white"
                />
              </Link>
              <span className="text-xs mt-1">{category.label}</span>
            </div>
          );
        })}
        {/* Center text */}
        <div
          className="absolute text-center font-bold text-white"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/4712/4712015.png"
            alt="Programming"
            className="w-full h-full rounded-full hover:opacity-80"
          />
        </div>
      </div>
    </div>
  );
};

export default Categories;
