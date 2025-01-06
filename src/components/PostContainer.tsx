import React, { useRef, useEffect } from 'react';
import PostCard from './PostCard';
import Post from '../types';

interface Props {
  posts: Post[]; // Define an array of Post objects
  className?: string;
}

const PostContainer: React.FC<Props> = ({ posts, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number | null>(null); // To store requestAnimationFrame ID

  useEffect(() => {
    let scrollVelocity = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const { top, height } = container.getBoundingClientRect();
      const mouseY = e.clientY; // Mouse Y position relative to viewport
      const containerCenter = top + height / 2; // Center of the container

      // Calculate the distance from the mouse to the center of the container
      const distanceFromCenter = mouseY - containerCenter;

      // Set scroll velocity based on the distance (larger distance => faster scrolling)
      const maxSpeed = 40; // Maximum scroll speed
      scrollVelocity = (distanceFromCenter / height) * maxSpeed;
    };

    const animateScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      // Scroll the container by the calculated velocity
      container.scrollBy({ top: scrollVelocity });

      // Request the next frame
      animationFrameId.current = requestAnimationFrame(animateScroll);
    };

    // Start the animation loop
    animationFrameId.current = requestAnimationFrame(animateScroll);

    // Add mousemove listener
    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup on unmount
    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      className={`mt-8  ${className}`}
      ref={containerRef}
      style={{
        height: '600px',
        overflow: 'hidden', // Hide scrollbar
        position: 'relative',
        border: '2px solid black',
      }}
    >
      {posts.map((child, i) => (
        <PostCard
          id={child.id}
          key={i} // Provide a unique key for each item
          title={child.title}
          content={child.content}
          tags={child.tags}
          image={child.image}
          date={child.date}
          type={child.type}
        />
      ))}
    </div>
  );
};

export default PostContainer;
