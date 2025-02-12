// src/components/PostContainer.tsx
import React, { useRef, useEffect, useState } from 'react';
import PostCard from './PostCard';
import Post from '../types';

interface Props {
  posts: Post[];
  className?: string;
}

const PostContainer: React.FC<Props> = ({ posts, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 720);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  useEffect(() => {

    if (isMobile) return;
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
  }, [isMobile]);

  const handleResize = () => {
    const mobile = window.innerWidth < 720;
    setIsMobile(mobile);
  };

  return (
    <div
      ref={containerRef}
      className={`${className}`}
      style={{
        height: '600px',
        overflowY: 'auto',
        scrollBehavior: 'smooth',
        position: 'relative',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        marginTop: isMobile ? '8rem' : ''
      }}
    >
      <div className={'space-y-6 pr-4 '}>
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
            variant='default'
          />
        ))}
      </div>
    </div>
  );
};

export default PostContainer;
