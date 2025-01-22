// src/components/PostContainer.tsx
import React, { useRef, useEffect } from 'react';
import PostCard from './PostCard';
import Post from '../types';

interface Props {
  posts: Post[];
  className?: string;
}

const PostContainer: React.FC<Props> = ({ posts, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    let scrollVelocity = 0;
    let isScrolling = true;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const mouseY = e.clientY - rect.top;
      const containerHeight = rect.height;
      const scrollZoneHeight = containerHeight * 0.4;

      if (mouseY < scrollZoneHeight) {
        scrollVelocity = -10 * (1 - mouseY / scrollZoneHeight);
      } else if (mouseY > containerHeight - scrollZoneHeight) {
        scrollVelocity = 10 * (mouseY - (containerHeight - scrollZoneHeight)) / scrollZoneHeight;
      } else {
        scrollVelocity = 0;
      }
    };

    const animateScroll = () => {
      if (!containerRef.current || !isScrolling) return;

      containerRef.current.scrollBy({
        top: scrollVelocity * 10,
        behavior: 'auto'
      });

      animationFrameId.current = requestAnimationFrame(animateScroll);
    };

    animationFrameId.current = requestAnimationFrame(animateScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      isScrolling = false;
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`mt-8 ${className}`}
      style={{
        height: '600px',
        overflowY: 'auto',
        scrollBehavior: 'smooth',
        position: 'relative',
        border: '2px solid #000',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      <div className="space-y-6 pr-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            id={post.id}
            title={post.title}
            content={post.content}
            tags={post.tags}
            image={post.image}
            date={post.date}
            type={post.type}
          />
        ))}
      </div>
    </div>
  );
};

export default PostContainer;
